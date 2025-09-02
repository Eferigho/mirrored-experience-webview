import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { WebGLRenderer } from './WebGLRenderer';
import { CesiumTerrain } from './CesiumTerrain';
import { useOpenStreetMapData, cityDataCache } from './OpenStreetMapIntegration';
import { 
  ArrowLeft,
  Navigation, 
  Camera, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Users,
  MessageCircle,
  Settings,
  Pause,
  Play,
  RotateCcw,
  Map,
  Home,
  Maximize,
  Eye,
  MapPin,
  Route,
  Navigation2,
  Gamepad2,
  Zap,
  Shield
} from 'lucide-react';

interface DrivingSimulationProps {
  tourId: string;
  isMultiplayer: boolean;
  onExit: () => void;
}

// Vehicle physics and state management
interface VehicleState {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  speed: number;
  maxSpeed: number;
  acceleration: number;
  brakeForce: number;
  steeringAngle: number;
  maxSteeringAngle: number;
  isGrounded: boolean;
}

interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  handbrake: boolean;
}

// 3D City Data from OpenStreetMap
interface CityData {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  buildings: BuildingData[];
  roads: RoadData[];
  landmarks: LandmarkData[];
}

interface BuildingData {
  id: string;
  position: { x: number; z: number };
  size: { width: number; height: number; depth: number };
  type: 'residential' | 'commercial' | 'industrial' | 'landmark';
  texture: string;
}

interface RoadData {
  id: string;
  points: { x: number; z: number }[];
  width: number;
  type: 'highway' | 'street' | 'alley';
  lanes: number;
}

interface LandmarkData {
  id: string;
  position: { x: number; z: number };
  name: string;
  type: 'monument' | 'building' | 'natural';
  description: string;
}

// Procedural City Generator
class ProceduralCityGenerator {
  private seed: number;
  private buildings: BuildingData[] = [];
  private roads: RoadData[] = [];
  private landmarks: LandmarkData[] = [];

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  generateCity(cityId: string, size: number = 2000): CityData {
    this.buildings = [];
    this.roads = [];
    this.landmarks = [];

    // Generate road network
    this.generateRoadNetwork(size);
    
    // Generate buildings
    this.generateBuildings(size);
    
    // Generate landmarks based on city
    this.generateLandmarks(cityId);

    return {
      id: cityId,
      name: this.getCityName(cityId),
      center: { lat: 0, lng: 0 }, // Will be set based on real coordinates
      buildings: this.buildings,
      roads: this.roads,
      landmarks: this.landmarks
    };
  }

  private generateRoadNetwork(size: number): void {
    const gridSize = 20;
    const cellSize = size / gridSize;

    // Generate main roads (grid pattern)
    for (let i = 0; i <= gridSize; i++) {
      // Vertical roads
      this.roads.push({
        id: `road_v_${i}`,
        points: [
          { x: i * cellSize - size/2, z: -size/2 },
          { x: i * cellSize - size/2, z: size/2 }
        ],
        width: i % 5 === 0 ? 8 : 4, // Main roads are wider
        type: i % 5 === 0 ? 'highway' : 'street',
        lanes: i % 5 === 0 ? 4 : 2
      });

      // Horizontal roads
      this.roads.push({
        id: `road_h_${i}`,
        points: [
          { x: -size/2, z: i * cellSize - size/2 },
          { x: size/2, z: i * cellSize - size/2 }
        ],
        width: i % 5 === 0 ? 8 : 4,
        type: i % 5 === 0 ? 'highway' : 'street',
        lanes: i % 5 === 0 ? 4 : 2
      });
    }
  }

  private generateBuildings(size: number): void {
    const buildingCount = 500;
    const minDistance = 15;

    for (let i = 0; i < buildingCount; i++) {
      let attempts = 0;
      let position: { x: number; z: number };
      let valid = false;

      // Try to place building without overlapping
      while (attempts < 50 && !valid) {
        position = {
          x: (Math.random() - 0.5) * size * 0.8,
          z: (Math.random() - 0.5) * size * 0.8
        };

        valid = this.isValidBuildingPosition(position, minDistance);
        attempts++;
      }

      if (valid) {
        const buildingTypes: Array<'residential' | 'commercial' | 'industrial'> = 
          ['residential', 'commercial', 'industrial'];
        const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        
        const height = this.getBuildingHeight(type);
        const width = 8 + Math.random() * 12;
        const depth = 8 + Math.random() * 12;

        this.buildings.push({
          id: `building_${i}`,
          position,
          size: { width, height, depth },
          type,
          texture: this.getBuildingTexture(type)
        });
      }
    }
  }

  private generateLandmarks(cityId: string): void {
    const landmarkData = {
      'shibuya-crossing': [
        {
          id: 'shibuya_station',
          position: { x: 0, z: 0 },
          name: 'Shibuya Station',
          type: 'building' as const,
          description: 'The heart of Shibuya, one of Tokyo\'s busiest stations'
        },
        {
          id: 'hachiko_statue',
          position: { x: 50, z: 30 },
          name: 'Hachiko Statue',
          type: 'monument' as const,
          description: 'Famous meeting spot and symbol of loyalty'
        }
      ],
      'tokyo-food-tour': [
        {
          id: 'tsukiji_market',
          position: { x: 0, z: 0 },
          name: 'Tsukiji Market',
          type: 'building' as const,
          description: 'World\'s largest fish market'
        }
      ],
      'imperial-palace': [
        {
          id: 'imperial_palace',
          position: { x: 0, z: 0 },
          name: 'Imperial Palace',
          type: 'building' as const,
          description: 'The primary residence of the Emperor of Japan'
        }
      ]
    };

    this.landmarks = landmarkData[cityId as keyof typeof landmarkData] || [];
  }

  private isValidBuildingPosition(position: { x: number; z: number }, minDistance: number): boolean {
    return !this.buildings.some(building => {
      const dx = position.x - building.position.x;
      const dz = position.z - building.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance < minDistance;
    });
  }

  private getBuildingHeight(type: string): number {
    const heights = {
      residential: 15 + Math.random() * 30,
      commercial: 25 + Math.random() * 50,
      industrial: 20 + Math.random() * 40
    };
    return heights[type as keyof typeof heights] || 20;
  }

  private getBuildingTexture(type: string): string {
    const textures = {
      residential: 'residential_building',
      commercial: 'commercial_building',
      industrial: 'industrial_building'
    };
    return textures[type as keyof typeof textures] || 'default_building';
  }

  private getCityName(cityId: string): string {
    const names = {
      'shibuya-crossing': 'Shibuya, Tokyo',
      'tokyo-food-tour': 'Tsukiji, Tokyo',
      'imperial-palace': 'Imperial Palace, Tokyo'
    };
    return names[cityId as keyof typeof names] || 'Virtual City';
  }
}

// Vehicle Physics Engine
class VehiclePhysics {
  private vehicle: VehicleState;
  private input: InputState;
  private deltaTime: number = 0;
  private lastTime: number = 0;

  constructor() {
    this.vehicle = {
      position: { x: 0, y: 0, z: 0 }, // Start at city center
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      speed: 0,
      maxSpeed: 50,
      acceleration: 15,
      brakeForce: 25,
      steeringAngle: 0,
      maxSteeringAngle: 0.5,
      isGrounded: true
    };

    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      handbrake: false
    };
  }

  updateInput(input: InputState): void {
    this.input = input;
  }

  update(deltaTime: number): VehicleState {
    this.deltaTime = deltaTime;
    
    // Calculate forces
    const engineForce = this.calculateEngineForce();
    const brakeForce = this.calculateBrakeForce();
    const steeringForce = this.calculateSteeringForce();

    // Update vehicle state
    this.updateVelocity(engineForce, brakeForce);
    this.updatePosition();
    this.updateRotation(steeringForce);

    return { ...this.vehicle };
  }

  private calculateEngineForce(): number {
    let force = 0;
    
    if (this.input.forward) {
      force = this.vehicle.acceleration;
    } else if (this.input.backward) {
      force = -this.vehicle.acceleration * 0.5; // Reverse is slower
    }

    // Apply speed limit
    if (this.vehicle.speed >= this.vehicle.maxSpeed && force > 0) {
      force = 0;
    }

    return force;
  }

  private calculateBrakeForce(): number {
    if (this.input.brake || this.input.handbrake) {
      return this.vehicle.brakeForce * (this.input.handbrake ? 1.5 : 1);
    }
    return 0;
  }

  private calculateSteeringForce(): number {
    let steering = 0;
    
    if (this.input.left) {
      steering = -this.vehicle.maxSteeringAngle;
    } else if (this.input.right) {
      steering = this.vehicle.maxSteeringAngle;
    }

    // Steering effectiveness decreases with speed
    const speedFactor = Math.max(0.1, 1 - this.vehicle.speed / this.vehicle.maxSpeed);
    return steering * speedFactor;
  }

  private updateVelocity(engineForce: number, brakeForce: number): void {
    // Calculate total force
    const totalForce = engineForce - brakeForce;
    
    // Apply air resistance
    const airResistance = this.vehicle.speed * this.vehicle.speed * 0.01;
    
    // Update speed
    this.vehicle.speed += (totalForce - airResistance) * this.deltaTime;
    this.vehicle.speed = Math.max(0, this.vehicle.speed);

    // Update velocity vector
    const radians = this.vehicle.rotation.y;
    this.vehicle.velocity.x = Math.sin(radians) * this.vehicle.speed;
    this.vehicle.velocity.z = Math.cos(radians) * this.vehicle.speed;
  }

  private updatePosition(): void {
    this.vehicle.position.x += this.vehicle.velocity.x * this.deltaTime;
    this.vehicle.position.z += this.vehicle.velocity.z * this.deltaTime;
  }

  private updateRotation(steeringForce: number): void {
    if (this.vehicle.speed > 0.1) {
      this.vehicle.rotation.y += steeringForce * this.deltaTime;
    }
  }

  getVehicleState(): VehicleState {
    return { ...this.vehicle };
  }

  reset(): void {
    this.vehicle = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      speed: 0,
      maxSpeed: 50,
      acceleration: 15,
      brakeForce: 25,
      steeringAngle: 0,
      maxSteeringAngle: 0.5,
      isGrounded: true
    };
  }
}

// Main Driving Simulation Component
export const DrivingSimulation: React.FC<DrivingSimulationProps> = ({ tourId, isMultiplayer, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const physicsRef = useRef<VehiclePhysics>(new VehiclePhysics());
  const cityGeneratorRef = useRef<ProceduralCityGenerator>(new ProceduralCityGenerator());
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Starting Point');
  const [cameraMode, setCameraMode] = useState<'first-person' | 'third-person' | 'chase'>('third-person');
  const [inputState, setInputState] = useState<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    handbrake: false
  });

  const [cityData, setCityData] = useState<CityData | null>(null);
  const [useRealData, setUseRealData] = useState(false);
  const [useCesiumTerrain, setUseCesiumTerrain] = useState(true);

  // Get city name from tour ID
  const getCityName = (tourId: string): string => {
    const cityMap: Record<string, string> = {
      'shibuya-crossing': 'Shibuya, Tokyo, Japan',
      'tokyo-food-tour': 'Tsukiji, Tokyo, Japan',
      'imperial-palace': 'Imperial Palace, Tokyo, Japan',
      'new-york': 'Manhattan, New York, USA',
      'paris': 'Paris, France'
    };
    return cityMap[tourId] || 'Tokyo, Japan';
  };

  // Try to load real OSM data first, fallback to procedural
  const { data: osmData, loading: osmLoading, error: osmError } = useOpenStreetMapData(
    useRealData ? getCityName(tourId) : ''
  );

  // Initialize city data
  useEffect(() => {
    if (useRealData && osmData) {
      // Use real OSM data
      const city: CityData = {
        id: tourId,
        name: getCityName(tourId),
        center: { lat: 0, lng: 0 },
        buildings: osmData.buildings,
        roads: osmData.roads,
        landmarks: osmData.landmarks
      };
      setCityData(city);
      setIsLoading(false);
    } else if (!useRealData) {
      // Use procedural generation
      const generator = cityGeneratorRef.current;
      const city = generator.generateCity(tourId, 2000);
      setCityData(city);
      setIsLoading(false);
    }
  }, [tourId, useRealData, osmData]);

  // Fallback: Always ensure we have city data
  useEffect(() => {
    if (!cityData && !isLoading) {
      console.log('No city data found, generating fallback city');
      const generator = cityGeneratorRef.current;
      const city = generator.generateCity(tourId, 2000);
      setCityData(city);
      setIsLoading(false);
    }
  }, [cityData, isLoading, tourId]);

  // Initialize procedural city data on component mount
  useEffect(() => {
    if (!useRealData && !cityData) {
      console.log('Generating procedural city for tourId:', tourId);
      const generator = cityGeneratorRef.current;
      const city = generator.generateCity(tourId, 2000);
      console.log('Generated city data:', city);
      setCityData(city);
      setIsLoading(false);
    }
  }, [tourId, useRealData, cityData]);

  // Handle OSM loading states
  useEffect(() => {
    if (useRealData) {
      setIsLoading(osmLoading);
      if (osmError) {
        console.warn('Failed to load OSM data, falling back to procedural generation:', osmError);
        setUseRealData(false);
      }
    }
  }, [useRealData, osmLoading, osmError]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'w':
        case 'arrowup':
          setInputState(prev => ({ ...prev, forward: true }));
          break;
        case 's':
        case 'arrowdown':
          setInputState(prev => ({ ...prev, backward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setInputState(prev => ({ ...prev, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setInputState(prev => ({ ...prev, right: true }));
          break;
        case ' ':
          event.preventDefault();
          setInputState(prev => ({ ...prev, brake: true }));
          break;
        case 'shift':
          setInputState(prev => ({ ...prev, handbrake: true }));
          break;
        case 'c':
          setCameraMode(prev => {
            const modes: Array<'first-person' | 'third-person' | 'chase'> = 
              ['first-person', 'third-person', 'chase'];
            const currentIndex = modes.indexOf(prev);
            return modes[(currentIndex + 1) % modes.length];
          });
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'w':
        case 'arrowup':
          setInputState(prev => ({ ...prev, forward: false }));
          break;
        case 's':
        case 'arrowdown':
          setInputState(prev => ({ ...prev, backward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setInputState(prev => ({ ...prev, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setInputState(prev => ({ ...prev, right: false }));
          break;
        case ' ':
          setInputState(prev => ({ ...prev, brake: false }));
          break;
        case 'shift':
          setInputState(prev => ({ ...prev, handbrake: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    let lastTime = 0;
    
    const gameLoop = (currentTime: number) => {
      if (!isPaused) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // Update physics
        const physics = physicsRef.current;
        physics.updateInput(inputState);
        const vehicleState = physics.update(deltaTime);
        
        setCurrentSpeed(Math.round(vehicleState.speed * 3.6)); // Convert to km/h
        
        // Debug: Log vehicle position and input
        if (vehicleState.speed > 0 || inputState.forward || inputState.backward || inputState.left || inputState.right) {
          console.log('Vehicle state:', {
            position: vehicleState.position,
            speed: vehicleState.speed,
            input: inputState
          });
        }
        
        // Update location based on position
        updateLocation(vehicleState.position);
        
        // Render scene
        renderScene(vehicleState);
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, inputState]);

  const updateLocation = (position: { x: number; z: number }) => {
    if (!cityData) return;

    // Find nearest landmark
    let nearestLandmark = cityData.landmarks[0];
    let minDistance = Infinity;

    cityData.landmarks.forEach(landmark => {
      const dx = position.x - landmark.position.x;
      const dz = position.z - landmark.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestLandmark = landmark;
      }
    });

    if (minDistance < 100) {
      setCurrentLocation(nearestLandmark.name);
    } else {
      setCurrentLocation('City Streets');
    }
  };

  const renderScene = (vehicleState: VehicleState) => {
    // WebGL rendering is now handled by the WebGLRenderer component
    // This function is kept for compatibility but the actual rendering
    // happens in the WebGLRenderer component
  };

  const handleReset = () => {
    physicsRef.current.reset();
    setCurrentSpeed(0);
    setCurrentLocation('Starting Point');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card p-8 text-center max-w-md">
          <div className="animate-spin w-12 h-12 border-3 border-brand-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-['Raleway'] font-semibold mb-2">
            {useCesiumTerrain 
              ? 'Loading High-Quality 3D Terrain' 
              : useRealData 
                ? 'Loading Real City Data' 
                : 'Generating 3D City'
            }
          </h3>
          <p className="text-muted-foreground">
            {useCesiumTerrain
              ? 'Initializing Cesium with real-world terrain and satellite imagery...'
              : useRealData 
                ? 'Fetching OpenStreetMap data and building 3D environment...' 
                : 'Creating procedural city environment...'
            }
          </p>
          {useRealData && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>This may take a moment as we download real-world city data</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* 3D Renderer - Cesium or WebGL */}
      {useCesiumTerrain ? (
        <CesiumTerrain
          tourId={tourId}
          vehiclePosition={physicsRef.current.getVehicleState().position}
          cameraMode={cameraMode}
          onTerrainReady={() => console.log('Cesium terrain ready')}
        />
      ) : (
        cityData && (
          <WebGLRenderer
            vehicleState={physicsRef.current.getVehicleState()}
            cityData={cityData}
            cameraMode={cameraMode}
          />
        )
      )}
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar - Location and Speed */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <Card className="glass bg-black/60 border-white/20 text-white p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-accent" />
              <div>
                <h3 className="font-['Raleway'] font-semibold text-lg">{currentLocation}</h3>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span>Speed: {currentSpeed} km/h</span>
                  <Badge className="bg-brand-accent/30 text-brand-accent border-brand-accent/50">
                    {cameraMode.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Exit Button */}
          <Button
            onClick={onExit}
            variant="secondary"
            size="lg"
            className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md"
          >
            <Home className="w-4 h-4 mr-2" />
            Exit Tour
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-auto">
          {/* Vehicle Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsPaused(!isPaused)}
              variant="secondary"
              size="lg"
              className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md"
            >
              {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>

            <Button
              onClick={handleReset}
              variant="secondary"
              size="lg"
              className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              onClick={() => setCameraMode(prev => {
                const modes: Array<'first-person' | 'third-person' | 'chase'> = 
                  ['first-person', 'third-person', 'chase'];
                const currentIndex = modes.indexOf(prev);
                return modes[(currentIndex + 1) % modes.length];
              })}
              variant="secondary"
              size="lg"
              className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md"
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>

            <Button
              onClick={() => setUseRealData(!useRealData)}
              variant="secondary"
              size="lg"
              className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md"
            >
              <Map className="w-4 h-4 mr-2" />
              {useRealData ? 'Procedural' : 'Real Data'}
            </Button>

            <Button
              onClick={() => setUseCesiumTerrain(!useCesiumTerrain)}
              variant="secondary"
              size="lg"
              className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-md"
            >
              <Eye className="w-4 h-4 mr-2" />
              {useCesiumTerrain ? 'Cesium 3D' : 'WebGL'}
            </Button>
          </div>

          {/* Vehicle Stats */}
          <Card className="glass bg-black/60 border-white/20 text-white p-4 backdrop-blur-md">
            <div className="text-center">
              <div className="text-xs text-white/70 mb-1">Vehicle Status</div>
              <div className="text-sm">
                <span className="font-medium">Speed:</span> {currentSpeed} km/h
              </div>
              <div className="text-sm">
                <span className="font-medium">Position:</span> {Math.round(physicsRef.current.getVehicleState().position.x)}, {Math.round(physicsRef.current.getVehicleState().position.z)}
              </div>
            </div>
          </Card>
        </div>

        {/* Controls Instructions */}
        <div className="absolute bottom-20 left-4 pointer-events-none">
          <div className="text-white/60 text-sm space-y-1 bg-black/40 p-3 rounded-lg backdrop-blur-sm">
            <div className="font-['Montserrat'] font-medium text-xs uppercase tracking-wide mb-2">Driving Controls</div>
            <div>🕹️ WASD / Arrow Keys to drive</div>
            <div>🛑 Space to brake, Shift for handbrake</div>
            <div>📷 C to change camera view</div>
            <div>⏸️ P to pause</div>
          </div>
        </div>

        {/* City Info */}
        {cityData && (
          <div className="absolute top-20 right-4 pointer-events-auto">
            <Card className="glass bg-black/60 border-white/20 text-white p-4 backdrop-blur-md max-w-xs">
              <h4 className="font-['Raleway'] font-semibold mb-3 flex items-center gap-2">
                <Route className="w-4 h-4" />
                City Overview
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Buildings:</span>
                  <span>{cityData.buildings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Roads:</span>
                  <span>{cityData.roads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Landmarks:</span>
                  <span>{cityData.landmarks.length}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
