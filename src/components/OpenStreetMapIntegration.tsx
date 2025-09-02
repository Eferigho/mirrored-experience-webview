import React, { useState, useEffect } from 'react';

// OpenStreetMap API types
interface OSMNode {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OSMWay {
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
}

interface OSMRelation {
  id: number;
  members: Array<{
    type: 'node' | 'way' | 'relation';
    ref: number;
    role: string;
  }>;
  tags?: Record<string, string>;
}

interface OSMData {
  elements: Array<OSMNode | OSMWay | OSMRelation>;
}

interface CityBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface BuildingData {
  id: string;
  position: { x: number; z: number };
  size: { width: number; height: number; depth: number };
  type: 'residential' | 'commercial' | 'industrial' | 'landmark';
  name?: string;
  tags: Record<string, string>;
}

interface RoadData {
  id: string;
  points: { x: number; z: number }[];
  width: number;
  type: 'highway' | 'street' | 'alley';
  lanes: number;
  name?: string;
  tags: Record<string, string>;
}

interface LandmarkData {
  id: string;
  position: { x: number; z: number };
  name: string;
  type: 'monument' | 'building' | 'natural' | 'amenity';
  description: string;
  tags: Record<string, string>;
}

// OpenStreetMap Integration Service
export class OpenStreetMapService {
  private static readonly OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
  private static readonly NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';

  // Convert lat/lon to local coordinates
  private static latLonToLocal(lat: number, lon: number, centerLat: number, centerLon: number): { x: number; z: number } {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat - centerLat) * Math.PI / 180;
    const dLon = (lon - centerLon) * Math.PI / 180;
    
    const x = dLon * R * Math.cos(centerLat * Math.PI / 180);
    const z = dLat * R;
    
    return { x, z };
  }

  // Get city bounds from city name
  static async getCityBounds(cityName: string): Promise<CityBounds | null> {
    try {
      const response = await fetch(
        `${this.NOMINATIM_API_URL}/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, boundingbox } = data[0];
        return {
          minLat: parseFloat(boundingbox[0]),
          maxLat: parseFloat(boundingbox[1]),
          minLon: parseFloat(boundingbox[2]),
          maxLon: parseFloat(boundingbox[3])
        };
      }
    } catch (error) {
      console.error('Error fetching city bounds:', error);
    }
    return null;
  }

  // Fetch OSM data for a specific area with retry logic and optimized queries
  static async fetchOSMData(bounds: CityBounds, retries: number = 3): Promise<OSMData | null> {
    // Calculate area size to determine query complexity
    const areaSize = (bounds.maxLat - bounds.minLat) * (bounds.maxLon - bounds.minLon);
    const isLargeArea = areaSize > 0.01; // Roughly 1km²
    
    // Use different timeout based on area size
    const timeout = isLargeArea ? 60 : 30;
    
    // Optimized query - prioritize buildings and main roads first
    const query = `
      [out:json][timeout:${timeout}];
      (
        way["building"]["building"!~"^(no|roof)$"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        way["highway"]["highway"~"^(primary|secondary|tertiary|residential|trunk|motorway)$"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        node["amenity"]["amenity"~"^(school|hospital|university|college|place_of_worship|restaurant|cafe|bank|fuel|parking)$"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
      );
      out geom;
    `;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetching OSM data (attempt ${attempt}/${retries})...`);
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), (timeout + 10) * 1000);
        
        const response = await fetch(this.OVERPASS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 504 && attempt < retries) {
            console.warn(`Attempt ${attempt} failed with 504, retrying...`);
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`OSM data fetched successfully on attempt ${attempt}`);
        return data;
        
      } catch (error) {
        console.error(`Error fetching OSM data (attempt ${attempt}):`, error);
        
        if (attempt === retries) {
          // On final attempt, try a simpler fallback query
          return await this.fetchOSMDataFallback(bounds);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    return null;
  }

  // Fallback method with minimal data for large areas
  private static async fetchOSMDataFallback(bounds: CityBounds): Promise<OSMData | null> {
    console.log('Using fallback query with minimal data...');
    
    const fallbackQuery = `
      [out:json][timeout:30];
      (
        way["building"]["building"!~"^(no|roof)$"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
        way["highway"]["highway"~"^(primary|secondary|trunk|motorway)$"](${bounds.minLat},${bounds.minLon},${bounds.maxLat},${bounds.maxLon});
      );
      out geom;
    `;

    try {
      const response = await fetch(this.OVERPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(fallbackQuery)}`
      });

      if (!response.ok) {
        throw new Error(`Fallback query failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fallback query succeeded');
      return data;
    } catch (error) {
      console.error('Fallback query also failed:', error);
      return null;
    }
  }

  // Process OSM data into game objects
  static processOSMData(osmData: OSMData, centerLat: number, centerLon: number): {
    buildings: BuildingData[];
    roads: RoadData[];
    landmarks: LandmarkData[];
  } {
    const buildings: BuildingData[] = [];
    const roads: RoadData[] = [];
    const landmarks: LandmarkData[] = [];

    // Create lookup maps for nodes
    const nodes = new Map<number, OSMNode>();
    osmData.elements.forEach(element => {
      if (element.type === 'node') {
        nodes.set(element.id, element as OSMNode);
      }
    });

    // Process ways (buildings and roads)
    osmData.elements.forEach(element => {
      if (element.type === 'way') {
        const way = element as OSMWay;
        
        if (way.tags?.building) {
          // Process building
          const building = this.processBuilding(way, nodes, centerLat, centerLon);
          if (building) {
            buildings.push(building);
          }
        } else if (way.tags?.highway) {
          // Process road
          const road = this.processRoad(way, nodes, centerLat, centerLon);
          if (road) {
            roads.push(road);
          }
        }
      } else if (element.type === 'node') {
        // Process landmarks
        const node = element as OSMNode;
        const landmark = this.processLandmark(node, centerLat, centerLon);
        if (landmark) {
          landmarks.push(landmark);
        }
      }
    });

    return { buildings, roads, landmarks };
  }

  // Process building from OSM way
  private static processBuilding(way: OSMWay, nodes: Map<number, OSMNode>, centerLat: number, centerLon: number): BuildingData | null {
    if (!way.geometry || way.geometry.length < 3) return null;

    // Calculate building bounds
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    way.geometry.forEach((node: any) => {
      minLat = Math.min(minLat, node.lat);
      maxLat = Math.max(maxLat, node.lat);
      minLon = Math.min(minLon, node.lon);
      maxLon = Math.max(maxLon, node.lon);
    });

    // Calculate center and size
    const buildingCenterLat = (minLat + maxLat) / 2;
    const buildingCenterLon = (minLon + maxLon) / 2;
    const position = this.latLonToLocal(buildingCenterLat, buildingCenterLon, centerLat, centerLon);

    const width = this.latLonToLocal(maxLat, minLon, centerLat, centerLon).x - 
                  this.latLonToLocal(minLat, minLon, centerLat, centerLon).x;
    const depth = this.latLonToLocal(minLat, maxLon, centerLat, centerLon).z - 
                  this.latLonToLocal(minLat, minLon, centerLat, centerLon).z;

    // Determine building type
    let type: 'residential' | 'commercial' | 'industrial' | 'landmark' = 'residential';
    if (way.tags?.amenity === 'school' || way.tags?.amenity === 'hospital') {
      type = 'landmark';
    } else if (way.tags?.building === 'commercial' || way.tags?.shop) {
      type = 'commercial';
    } else if (way.tags?.building === 'industrial') {
      type = 'industrial';
    }

    // Estimate height based on building type and floors
    let height = 10; // Default height
    if (way.tags?.['building:levels']) {
      height = parseInt(way.tags['building:levels']) * 3;
    } else if (type === 'commercial') {
      height = 15 + Math.random() * 20;
    } else if (type === 'industrial') {
      height = 8 + Math.random() * 15;
    }

    return {
      id: `building_${way.id}`,
      position,
      size: { width: Math.abs(width), height, depth: Math.abs(depth) },
      type,
      name: way.tags?.name,
      tags: way.tags || {}
    };
  }

  // Process road from OSM way
  private static processRoad(way: OSMWay, nodes: Map<number, OSMNode>, centerLat: number, centerLon: number): RoadData | null {
    if (!way.geometry || way.geometry.length < 2) return null;

    const points = way.geometry.map((node: any) => 
      this.latLonToLocal(node.lat, node.lon, centerLat, centerLon)
    );

    // Determine road type and width
    let type: 'highway' | 'street' | 'alley' = 'street';
    let width = 4;
    let lanes = 2;

    if (way.tags?.highway === 'motorway' || way.tags?.highway === 'trunk') {
      type = 'highway';
      width = 8;
      lanes = 4;
    } else if (way.tags?.highway === 'primary' || way.tags?.highway === 'secondary') {
      type = 'street';
      width = 6;
      lanes = 2;
    } else if (way.tags?.highway === 'residential' || way.tags?.highway === 'service') {
      type = 'alley';
      width = 3;
      lanes = 1;
    }

    return {
      id: `road_${way.id}`,
      points,
      width,
      type,
      lanes,
      name: way.tags?.name,
      tags: way.tags || {}
    };
  }

  // Process landmark from OSM node
  private static processLandmark(node: OSMNode, centerLat: number, centerLon: number): LandmarkData | null {
    if (!node.tags) return null;

    // Check if it's a significant landmark
    const isLandmark = node.tags.amenity === 'school' || 
                      node.tags.amenity === 'hospital' ||
                      node.tags.tourism === 'museum' ||
                      node.tags.tourism === 'attraction' ||
                      node.tags.historic ||
                      node.tags.leisure === 'park';

    if (!isLandmark) return null;

    const position = this.latLonToLocal(node.lat, node.lon, centerLat, centerLon);

    let type: 'monument' | 'building' | 'natural' | 'amenity' = 'amenity';
    if (node.tags.historic) {
      type = 'monument';
    } else if (node.tags.leisure === 'park') {
      type = 'natural';
    } else if (node.tags.amenity) {
      type = 'amenity';
    }

    return {
      id: `landmark_${node.id}`,
      position,
      name: node.tags.name || 'Unnamed Landmark',
      type,
      description: `${type} - ${node.tags.amenity || node.tags.tourism || node.tags.historic || 'Landmark'}`,
      tags: node.tags
    };
  }
}

// React Hook for OSM Integration
export const useOpenStreetMapData = (cityName: string) => {
  const [data, setData] = useState<{
    buildings: BuildingData[];
    roads: RoadData[];
    landmarks: LandmarkData[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityName) return;

      setLoading(true);
      setError(null);

      try {
        // Get city bounds
        const bounds = await OpenStreetMapService.getCityBounds(cityName);
        if (!bounds) {
          throw new Error(`City "${cityName}" not found. Please check the spelling or try a different city.`);
        }

        // Fetch OSM data with retry logic
        const osmData = await OpenStreetMapService.fetchOSMData(bounds);
        if (!osmData) {
          throw new Error(`Unable to load map data for "${cityName}". The area might be too large or the service is temporarily unavailable. Please try again later or try a smaller area.`);
        }

        // Process data
        const centerLat = (bounds.minLat + bounds.maxLat) / 2;
        const centerLon = (bounds.minLon + bounds.maxLon) / 2;
        const processedData = OpenStreetMapService.processOSMData(osmData, centerLat, centerLon);

        setData(processedData);
      } catch (err) {
        let errorMessage = 'Unknown error occurred while loading map data';
        
        if (err instanceof Error) {
          if (err.message.includes('504') || err.message.includes('timeout')) {
            errorMessage = `Request timeout for "${cityName}". The area might be too large. Please try a smaller city or region.`;
          } else if (err.message.includes('404') || err.message.includes('not found')) {
            errorMessage = `City "${cityName}" not found. Please check the spelling or try a different city.`;
          } else if (err.message.includes('network') || err.message.includes('fetch')) {
            errorMessage = `Network error while loading "${cityName}". Please check your internet connection and try again.`;
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        console.error('Error loading OSM data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  return { data, loading, error };
};

// City Data Cache
class CityDataCache {
  private cache = new Map<string, {
    buildings: BuildingData[];
    roads: RoadData[];
    landmarks: LandmarkData[];
  }>();

  set(cityName: string, data: { buildings: BuildingData[]; roads: RoadData[]; landmarks: LandmarkData[] }) {
    this.cache.set(cityName, data);
  }

  get(cityName: string) {
    return this.cache.get(cityName);
  }

  has(cityName: string) {
    return this.cache.has(cityName);
  }

  clear() {
    this.cache.clear();
  }
}

export const cityDataCache = new CityDataCache();
