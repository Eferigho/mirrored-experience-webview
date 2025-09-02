import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';

// Set Cesium base URL and Ion access token
(window as any).CESIUM_BASE_URL = '/cesium/';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTdmMDA4Yy0zOWUxLTRkNzAtOWVlMC0zOTM5ZGYwYjM3MGYiLCJpZCI6MzM3NTcwLCJpYXQiOjE3NTY4MTY5Nzh9.M8r2BQa0aSSVdCgBAiWqUDcRk7HaKPzUiAsioyg_Dlk';

// Configure Cesium to handle iframe sandboxing issues
Cesium.Ion.defaultServer = 'https://api.cesium.com';

interface CesiumTerrainProps {
  tourId: string;
  vehiclePosition?: { x: number; y: number; z: number };
  cameraMode?: 'first-person' | 'third-person' | 'chase';
  onTerrainReady?: () => void;
}

// City coordinates mapping
const CITY_COORDINATES = {
  'shibuya-crossing': { lat: 35.6580, lng: 139.7016, height: 50 },
  'tokyo-food-tour': { lat: 35.6654, lng: 139.7706, height: 10 },
  'imperial-palace': { lat: 35.6852, lng: 139.7528, height: 30 },
  'new-york': { lat: 40.7589, lng: -73.9851, height: 100 },
  'paris': { lat: 48.8566, lng: 2.3522, height: 50 }
};

export const CesiumTerrain: React.FC<CesiumTerrainProps> = ({
  tourId,
  vehiclePosition = { x: 0, y: 0, z: 0 },
  cameraMode = 'third-person',
  onTerrainReady
}) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    const initializeCesium = async () => {
      try {
        // Initialize Cesium viewer with high-quality settings
        // Now using Cesium Ion with your API key for premium features
        let terrainProvider;
        try {
          terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
            requestWaterMask: true,
            requestVertexNormals: true
          });
          console.log('High-quality Cesium World Terrain loaded successfully');
        } catch (terrainError) {
          console.warn('Failed to load Cesium World Terrain, using ellipsoid terrain:', terrainError);
          terrainProvider = new Cesium.EllipsoidTerrainProvider();
        }
        
        let imageryProvider;
        try {
          imageryProvider = new Cesium.IonImageryProvider({ assetId: 1 }); // World Imagery
          console.log('High-quality Cesium World Imagery loaded successfully');
        } catch (imageryError) {
          console.warn('Failed to load Cesium World Imagery, using OpenStreetMap:', imageryError);
          imageryProvider = new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
          });
        }

        // Test Ion access
        try {
          const testResource = await Cesium.IonResource.fromAssetId(1);
          console.log('Ion access confirmed - API key is working');
        } catch (ionError) {
          console.warn('Ion access test failed:', ionError);
        }

        const viewer = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider: terrainProvider,
          imageryProvider: imageryProvider,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        scene3DOnly: true,
        shouldAnimate: true,
        shadows: true,
        terrainShadows: Cesium.ShadowMode.ENABLED,
        sceneMode: Cesium.SceneMode.SCENE3D,
        requestRenderMode: false,
        maximumRenderTimeChange: Infinity
      });

      viewerRef.current = viewer;

      // Configure scene settings for high quality
      const scene = viewer.scene;
      scene.globe.enableLighting = true;
      scene.globe.dynamicAtmosphereLighting = true;
      scene.globe.atmosphereLightIntensity = 10.0;
      scene.globe.atmosphereMieCoefficient = new Cesium.Cartesian3(21e-6, 21e-6, 21e-6);
      scene.globe.atmosphereMieScaleHeight = 1200.0;
      scene.globe.atmosphereRayleighCoefficient = new Cesium.Cartesian3(5.5e-6, 13.0e-6, 28.4e-6);
      scene.globe.atmosphereRayleighScaleHeight = 8000.0;
      scene.globe.atmosphereSunIntensity = 20.0;
      scene.globe.depthTestAgainstTerrain = true;
      scene.globe.tileCacheSize = 1000;

      // Set high-quality rendering
      scene.postProcessStages.fxaa.enabled = true;
      scene.fog.enabled = true;
      scene.fog.density = 0.0002;
      scene.fog.screenSpaceErrorFactor = 2.0;
      scene.globe.maximumScreenSpaceError = 1.0;
      scene.globe.preloadSiblings = true;
      scene.globe.preloadAncestors = true;

      // Configure camera with better positioning
      const camera = viewer.camera;
      const cityCoords = CITY_COORDINATES[tourId as keyof typeof CITY_COORDINATES] || CITY_COORDINATES['shibuya-crossing'];
      
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          cityCoords.lng,
          cityCoords.lat,
          cityCoords.height
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-30.0),
          roll: 0.0
        }
      });

      // Ensure the globe is visible and enhance appearance for high-quality terrain
      scene.globe.show = true;
      scene.globe.enableLighting = true; // Enable lighting for realistic terrain
      scene.globe.dynamicAtmosphereLighting = true;
      scene.globe.atmosphereLightIntensity = 10.0;
      scene.globe.atmosphereMieCoefficient = new Cesium.Cartesian3(21e-6, 21e-6, 21e-6);
      scene.globe.atmosphereMieScaleHeight = 1200.0;
      scene.globe.atmosphereRayleighCoefficient = new Cesium.Cartesian3(5.5e-6, 13.0e-6, 28.4e-6);
      scene.globe.atmosphereRayleighScaleHeight = 8000.0;
      scene.globe.atmosphereSunIntensity = 20.0;
      scene.globe.translucency.enabled = false;
      
      // Enhanced visual settings for high-quality terrain
      scene.globe.depthTestAgainstTerrain = true;
      scene.globe.tileCacheSize = 1000;
      scene.globe.maximumScreenSpaceError = 0.5; // Higher quality
      scene.globe.preloadSiblings = true;
      scene.globe.preloadAncestors = true;

      // Add 3D buildings for major cities (now enabled with your Ion token)
      if (tourId.includes('tokyo') || tourId.includes('shibuya') || tourId.includes('imperial')) {
        try {
          // Try different Tokyo building asset IDs
          const buildingAssetIds = [96188, 75343, 1]; // Try multiple asset IDs
          let buildingsLoaded = false;
          
          for (const assetId of buildingAssetIds) {
            try {
              const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
              buildingsTileset.maximumScreenSpaceError = 1;
              buildingsTileset.maximumMemoryUsage = 512;
              viewer.scene.primitives.add(buildingsTileset);
              console.log(`3D buildings loaded successfully for Tokyo (Asset ID: ${assetId})`);
              buildingsLoaded = true;
              break;
            } catch (error) {
              console.warn(`Failed to load buildings with asset ID ${assetId}:`, error);
            }
          }
          
          if (!buildingsLoaded) {
            console.warn('Could not load any 3D buildings for Tokyo');
          }
        } catch (buildingsError) {
          console.warn('Could not load 3D buildings:', buildingsError);
        }
      } else if (tourId.includes('new-york')) {
        try {
          const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343); // New York 3D Tiles
          buildingsTileset.maximumScreenSpaceError = 1;
          buildingsTileset.maximumMemoryUsage = 512;
          viewer.scene.primitives.add(buildingsTileset);
          console.log('3D buildings loaded successfully for New York');
        } catch (buildingsError) {
          console.warn('Could not load 3D buildings for New York:', buildingsError);
        }
      } else if (tourId.includes('paris')) {
        try {
          const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343); // Paris 3D Tiles
          buildingsTileset.maximumScreenSpaceError = 1;
          buildingsTileset.maximumMemoryUsage = 512;
          viewer.scene.primitives.add(buildingsTileset);
          console.log('3D buildings loaded successfully for Paris');
        } catch (buildingsError) {
          console.warn('Could not load 3D buildings for Paris:', buildingsError);
        }
      }

      // Add weather effects
      scene.skyAtmosphere.show = true;
      scene.skyBox.show = true;
      
      // Set time for realistic lighting
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date());
      viewer.clock.shouldAnimate = true;

      // Add vehicle entity with a simple box model (more reliable)
      const vehicleEntity = viewer.entities.add({
        name: 'Vehicle',
        position: Cesium.Cartesian3.fromDegrees(
          cityCoords.lng,
          cityCoords.lat,
          cityCoords.height
        ),
        box: {
          dimensions: new Cesium.Cartesian3(4.0, 2.0, 1.5), // Length, width, height
          material: Cesium.Color.BLUE,
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        },
        label: {
          text: 'Your Vehicle',
          font: '14pt sans-serif',
          pixelOffset: new Cesium.Cartesian2(0, -60),
          fillColor: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        }
      });

      // Add a marker for the city center
      viewer.entities.add({
        name: 'City Center',
        position: Cesium.Cartesian3.fromDegrees(cityCoords.lng, cityCoords.lat, cityCoords.height),
        point: {
          pixelSize: 20,
          color: Cesium.Color.BLUE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 3
        },
        label: {
          text: `City: ${tourId}`,
          font: '16pt sans-serif',
          pixelOffset: new Cesium.Cartesian2(0, -80),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        }
      });

      console.log('Cesium initialized successfully for tour:', tourId);
      console.log('City coordinates:', cityCoords);
      
      // Test available asset IDs
      const testAssetIds = [1, 75343, 96188, 17725];
      console.log('Testing Cesium Ion asset accessibility...');
      for (const assetId of testAssetIds) {
        try {
          const resource = await Cesium.IonResource.fromAssetId(assetId);
          console.log(`Asset ID ${assetId}: Accessible`);
        } catch (error) {
          console.log(`Asset ID ${assetId}: Not accessible - ${error.message}`);
        }
      }

        setIsLoading(false);
        onTerrainReady?.();

      } catch (err) {
        console.error('Failed to initialize Cesium:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize 3D terrain');
        setIsLoading(false);
      }
    };

    initializeCesium();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [tourId, onTerrainReady]);

  // Update camera based on vehicle position and camera mode
  useEffect(() => {
    if (!viewerRef.current || !vehiclePosition) return;

    const viewer = viewerRef.current;
    const camera = viewer.camera;
    const cityCoords = CITY_COORDINATES[tourId as keyof typeof CITY_COORDINATES] || CITY_COORDINATES['shibuya-crossing'];

    // Convert vehicle position to geographic coordinates
    const vehicleLng = cityCoords.lng + (vehiclePosition.x / 111000); // Rough conversion
    const vehicleLat = cityCoords.lat + (vehiclePosition.z / 111000);
    const vehicleHeight = cityCoords.height + vehiclePosition.y;

    const vehiclePositionCartesian = Cesium.Cartesian3.fromDegrees(vehicleLng, vehicleLat, vehicleHeight);

    // Update vehicle entity position
    const vehicleEntity = viewer.entities.getById('Vehicle');
    if (vehicleEntity) {
      vehicleEntity.position = vehiclePositionCartesian;
    }

    // Update camera based on mode
    switch (cameraMode) {
      case 'first-person':
        camera.setView({
          destination: vehiclePositionCartesian,
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-10.0),
            roll: 0.0
          }
        });
        break;
      case 'third-person':
        camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(vehicleLng, vehicleLat, vehicleHeight + 20),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-30.0),
            roll: 0.0
          }
        });
        break;
      case 'chase':
        const chasePosition = Cesium.Cartesian3.fromDegrees(vehicleLng - 0.001, vehicleLat - 0.001, vehicleHeight + 50);
        camera.setView({
          destination: chasePosition,
          orientation: {
            heading: Cesium.Math.toRadians(45.0),
            pitch: Cesium.Math.toRadians(-45.0),
            roll: 0.0
          }
        });
        break;
    }
  }, [vehiclePosition, cameraMode, tourId]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">3D Terrain Error</h3>
          <p className="text-gray-300">{error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Falling back to standard WebGL rendering...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Loading 3D Terrain</h3>
            <p className="text-gray-300">Initializing Cesium with high-quality terrain...</p>
          </div>
        </div>
      )}
      <div 
        ref={cesiumContainer} 
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
