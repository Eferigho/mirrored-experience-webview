import React, { useState, useEffect, useRef } from 'react';

// Google Maps API type declarations
declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: any);
    }
    namespace marker {
      class AdvancedMarkerElement {
        constructor(opts?: any);
        position: any;
        map: Map | null;
        title: string;
        content: Element | null;
      }
    }
    class DirectionsService {
      route(request: any, callback: (result: any, status: string) => void): void;
    }
    class DirectionsRenderer {
      constructor(opts?: any);
      setMap(map: Map): void;
      setDirections(result: any): void;
    }
    class StreetViewPanorama {
      constructor(node: Element, opts?: any);
    }
    namespace SymbolPath {
      const CIRCLE: any;
    }
    namespace TravelMode {
      const DRIVING: any;
    }
  }
}
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Play, 
  MapPin, 
  Clock, 
  Star, 
  Download,
  Headphones,
  Users,
  Filter,
  Calendar,
  Globe,
  Map,
  Navigation,
  Eye,
  Route,
  Maximize
} from 'lucide-react';

interface TourDetailsPageProps {
  cityId: string;
  onBack: () => void;
  onStartTour: (tourId: string) => void;
}

// Google Maps integration component
const GoogleMap = ({ tour, isStreetView = false }: { tour: any; isStreetView?: boolean }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [streetView, setStreetView] = useState<google.maps.StreetViewPanorama | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps && window.google.maps.marker) {
        setIsLoading(false);
        initializeMap();
        return;
      }

      try {
        // Set up the callback function
        window.initGoogleMaps = () => {
          setIsLoading(false);
          initializeMap();
        };

        // Check if script already exists to prevent multiple loads
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          // If script exists but maps isn't ready, wait for it
          const checkGoogleMaps = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.marker) {
              clearInterval(checkGoogleMaps);
              setIsLoading(false);
              initializeMap();
            }
          }, 100);

          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkGoogleMaps);
            if (isLoading) {
              setLoadError(true);
              setIsLoading(false);
            }
          }, 10000);
          return;
        }

        // Create script element with proper async loading
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBByaRzkBsDQuOPtOn6x0a8HAkeTjCxMTo&libraries=marker,geometry,places&loading=async&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        
        // Add error handling
        script.onerror = () => {
          setLoadError(true);
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        setLoadError(true);
        setIsLoading(false);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) return;

      // Tokyo coordinates for demonstration
      const center = { lat: 35.6762, lng: 139.6503 };
      
      if (isStreetView) {
        const panorama = new google.maps.StreetViewPanorama(mapRef.current, {
          position: center,
          pov: {
            heading: 34,
            pitch: 10,
          },
          zoom: 1,
          addressControl: false,
          enableCloseButton: false,
          showRoadLabels: true,
        });
        setStreetView(panorama);
      } else {
        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 12,
          center: center,
          mapTypeId: 'roadmap',
          mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ saturation: -40 }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#4285F4' }, { weight: 2 }]
            }
          ]
        });

        // Add route markers using AdvancedMarkerElement
        const routePoints = [
          { lat: 35.6762, lng: 139.6503, title: 'Start: Shibuya Station', color: '#10b981' },
          { lat: 35.6586, lng: 139.7454, title: 'Checkpoint: Tokyo Station', color: '#f59e0b' },
          { lat: 35.6895, lng: 139.6917, title: 'End: Harajuku', color: '#ef4444' },
        ];

        routePoints.forEach((point, index) => {
          try {
            // Create marker content
            const markerContent = document.createElement('div');
            markerContent.style.width = '16px';
            markerContent.style.height = '16px';
            markerContent.style.backgroundColor = point.color;
            markerContent.style.borderRadius = '50%';
            markerContent.style.border = '2px solid white';
            markerContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            markerContent.style.cursor = 'pointer';

            // Create advanced marker
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
              new google.maps.marker.AdvancedMarkerElement({
                position: { lat: point.lat, lng: point.lng },
                map: mapInstance,
                title: point.title,
                content: markerContent,
              });
            } else {
              // Fallback to basic marker styling if AdvancedMarkerElement is not available
              console.warn('AdvancedMarkerElement not available, using fallback styling');
              // Note: We're not using the deprecated Marker as fallback to avoid the warning
              // Instead, we'll just log this for debugging
            }
          } catch (error) {
            console.error('Error creating marker:', error);
          }
        });

        // Draw route
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        });

        directionsRenderer.setMap(mapInstance);

        directionsService.route({
          origin: routePoints[0],
          destination: routePoints[routePoints.length - 1],
          waypoints: routePoints.slice(1, -1).map(point => ({
            location: point,
            stopover: true
          })),
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          }
        });

        setMap(mapInstance);
      }
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, [isStreetView, tour]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loadError) {
    return (
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'w-full h-96'}`}>
        <div className="w-full h-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground">Failed to load Google Maps</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'w-full h-96'}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden bg-muted" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}
      
      {!isLoading && !loadError && (
        <>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
            onClick={toggleFullscreen}
          >
            <Maximize className="w-4 h-4" />
          </Button>

          {isFullscreen && (
            <Button
              variant="secondary"
              className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              onClick={toggleFullscreen}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export const TourDetailsPage: React.FC<TourDetailsPageProps> = ({ cityId, onBack, onStartTour }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tours');

  // Cleanup Google Maps callback on component unmount
  useEffect(() => {
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, []);

  const cityData = {
    tokyo: {
      name: 'Tokyo, Japan',
      description: 'Experience the vibrant energy of Japan\'s capital city through immersive VR tours with photo-realistic Google Maps integration',
      image: 'https://images.unsplash.com/photo-1717986439981-0c6a51130cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc1Njc0NDU3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.8,
      totalReviews: 2341
    }
  };

  const tours = [
    {
      id: 'shibuya-crossing',
      title: 'Shibuya Crossing Experience',
      description: 'Navigate through the world\'s busiest pedestrian crossing and explore the neon-lit streets of Shibuya with real-time Google Maps integration',
      duration: '25 min',
      difficulty: 'Intermediate',
      rating: 4.9,
      reviews: 847,
      themes: ['landmarks', 'culture'],
      languages: ['en', 'ja', 'zh'],
      sponsored: false,
      premium: false,
      image: 'https://images.unsplash.com/photo-1717986439981-0c6a51130cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc1Njc0NDU3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      coordinates: { lat: 35.6598, lng: 139.7006 },
      routeLength: '8.2 km',
      highlights: [
        'World\'s busiest pedestrian crossing',
        'Iconic neon-lit billboards',
        'Hachiko statue viewing point',
        'Tokyo fashion districts',
        '3D Street View integration'
      ]
    },
    {
      id: 'tokyo-food-tour',
      title: 'Tokyo Food District Drive',
      description: 'Drive through Tsukiji and discover Tokyo\'s incredible food culture with expert narration and photo-realistic maps',
      duration: '35 min',
      difficulty: 'Beginner',
      rating: 4.7,
      reviews: 623,
      themes: ['food', 'culture'],
      languages: ['en', 'ja'],
      sponsored: true,
      premium: false,
      image: 'https://images.unsplash.com/photo-1717986439981-0c6a51130cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc1Njc0NDU3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      coordinates: { lat: 35.6654, lng: 139.7707 },
      routeLength: '12.5 km',
      highlights: [
        'Historic Tsukiji Market area',
        'Traditional sushi restaurants',
        'Tokyo Bay waterfront views',
        'Local food preparation techniques',
        'Real-time navigation'
      ]
    },
    {
      id: 'imperial-palace',
      title: 'Imperial Palace & Gardens',
      description: 'A serene drive around Tokyo\'s Imperial Palace with historical insights, beautiful scenery, and immersive map views',
      duration: '30 min',
      difficulty: 'Beginner',
      rating: 4.6,
      reviews: 891,
      themes: ['history', 'landmarks'],
      languages: ['en', 'ja', 'zh', 'ko'],
      sponsored: false,
      premium: true,
      image: 'https://images.unsplash.com/photo-1717986439981-0c6a51130cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc1Njc0NDU3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      coordinates: { lat: 35.6852, lng: 139.7528 },
      routeLength: '6.8 km',
      highlights: [
        'Imperial Palace East Gardens',
        'Nijubashi Bridge viewpoint',
        'Historic moats and walls',
        'Traditional Japanese architecture',
        '360° street-level views'
      ]
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const filters = [
    { id: 'all', name: 'All Tours', icon: MapPin },
    { id: 'landmarks', name: 'Landmarks', icon: MapPin },
    { id: 'culture', name: 'Culture', icon: Users },
    { id: 'food', name: 'Food', icon: Calendar },
    { id: 'history', name: 'History', icon: Clock }
  ];

  const city = cityData[cityId as keyof typeof cityData] || cityData.tokyo;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`} 
      />
    ));
  };

  const filteredTours = selectedFilter === 'all' 
    ? tours 
    : tours.filter(tour => tour.themes.includes(selectedFilter));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* City Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <ImageWithFallback 
                src={city.image}
                alt={city.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-['Raleway'] font-semibold mb-2">{city.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {renderStars(city.rating)}
                    <span className="ml-2 text-sm">{city.rating}</span>
                  </div>
                  <span className="text-sm opacity-90">({city.totalReviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {city.description}
            </p>

            {/* Interactive Map Preview */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Raleway'] font-semibold flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  City Overview Map
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-card border-border/50"
                  onClick={() => setActiveTab('map')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  View Full Map
                </Button>
              </div>
              <div className="h-64 rounded-lg overflow-hidden bg-muted/20">
                <GoogleMap tour={tours[0]} />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass-card p-6">
              <h3 className="font-['Raleway'] font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tours</span>
                  <span className="font-medium">{tours.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Duration</span>
                  <span className="font-medium">30 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Map Integration</span>
                  <span className="font-medium text-brand-accent">Google Maps</span>
                </div>
              </div>
            </Card>

            {/* Language Selection */}
            <Card className="glass-card p-6">
              <h3 className="font-['Raleway'] font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Audio Language
              </h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedLanguage === lang.code 
                        ? 'bg-brand-primary-solid/20 border border-brand-primary-solid/30' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card p-1 h-auto">
            <TabsTrigger 
              value="tours" 
              className="flex items-center gap-2 data-[state=active]:bg-brand-primary-solid data-[state=active]:text-white"
            >
              <Route className="w-4 h-4" />
              Available Tours
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex items-center gap-2 data-[state=active]:bg-brand-primary-solid data-[state=active]:text-white"
            >
              <Map className="w-4 h-4" />
              Interactive Map
            </TabsTrigger>
            <TabsTrigger 
              value="streetview" 
              className="flex items-center gap-2 data-[state=active]:bg-brand-primary-solid data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4" />
              Street View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tours" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={selectedFilter === filter.id 
                      ? 'bg-brand-primary-solid hover:bg-brand-primary-solid/90' 
                      : 'glass-card border-border/50 hover:border-border/80'
                    }
                  >
                    <IconComponent className="w-3 h-3 mr-2" />
                    {filter.name}
                  </Button>
                );
              })}
            </div>

            {/* Enhanced Tours Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="glass-card group hover:scale-[1.02] transition-all duration-200 overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback 
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      {tour.sponsored && (
                        <Badge className="bg-brand-accent/90 text-white border-0 text-xs backdrop-blur-sm">
                          Sponsored
                        </Badge>
                      )}
                      {tour.premium && (
                        <Badge className="bg-yellow-500/90 text-white border-0 text-xs backdrop-blur-sm">
                          Premium
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <Badge className={`text-xs backdrop-blur-sm ${getDifficultyColor(tour.difficulty)}`}>
                        {tour.difficulty}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div className="text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <Route className="w-3 h-3" />
                          <span className="text-xs">{tour.routeLength}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(tour.rating)}
                          <span className="text-xs ml-1">{tour.rating}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-brand-accent hover:bg-brand-accent-hover text-white shadow-lg"
                        onClick={() => onStartTour(tour.id)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start Tour
                      </Button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-['Raleway'] font-semibold text-lg mb-2 leading-tight">
                        {tour.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {tour.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{tour.reviews}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Headphones className="w-4 h-4" />
                        <Download className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Tour Highlights */}
                    <div className="border-t border-border/50 pt-4">
                      <h4 className="text-xs font-['Montserrat'] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Tour Highlights
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {tour.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full flex-shrink-0"></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Raleway'] font-semibold text-2xl mb-2">Interactive Tour Map</h2>
                  <p className="text-muted-foreground">Explore all available tour routes with real-time Google Maps integration</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass-card">
                    <Navigation className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <GoogleMap tour={tours[0]} isStreetView={false} />
              </div>
              
              {/* Tour Route Legend */}
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {tours.map((tour, index) => (
                  <Card key={tour.id} className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : index === tours.length - 1 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <h4 className="font-['Raleway'] font-semibold text-sm">{tour.title}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{tour.routeLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span>{tour.difficulty}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="streetview" className="space-y-6">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Raleway'] font-semibold text-2xl mb-2">Street View Preview</h2>
                  <p className="text-muted-foreground">Experience photo-realistic street-level views of your tour destinations</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass-card">
                    <Eye className="w-4 h-4 mr-2" />
                    360° View
                  </Button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-2xl mb-6">
                <GoogleMap tour={tours[0]} isStreetView={true} />
              </div>
              
              {/* Street View Controls */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card p-4">
                  <h3 className="font-['Raleway'] font-semibold mb-3">Quick Navigation</h3>
                  <div className="space-y-2">
                    {tours.map((tour) => (
                      <Button
                        key={tour.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start hover:bg-brand-primary-solid/10"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {tour.title}
                      </Button>
                    ))}
                  </div>
                </Card>
                
                <Card className="glass-card p-4">
                  <h3 className="font-['Raleway'] font-semibold mb-3">View Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-['Montserrat']">Show Roads</label>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-['Montserrat']">Show Landmarks</label>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-['Montserrat']">Auto-Rotate</label>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <Button size="sm" className="w-full mt-4 bg-brand-accent hover:bg-brand-accent-hover text-white">
                      <Maximize className="w-4 h-4 mr-2" />
                      Enter VR Mode
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};