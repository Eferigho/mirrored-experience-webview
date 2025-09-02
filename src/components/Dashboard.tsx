import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Logo } from './Logo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  User, 
  Settings, 
  LogOut, 
  Play, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Crown, 
  Lock,
  Wifi,
  MoreVertical,
  Plus
} from 'lucide-react';

interface DashboardProps {
  onStartTour: (cityId: string, vehicleId: string, isMultiplayer: boolean) => void;
  onSettings: () => void;
  onProfile: () => void;
  onMarketplace?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartTour, onSettings, onProfile, onMarketplace }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('sedan');
  const [activeTab, setActiveTab] = useState('single-player');

  const cities = [
    {
      id: 'tokyo',
      name: 'Tokyo, Japan',
      difficulty: 'Intermediate',
      rating: 4.8,
      tours: 12,
      estimatedTime: '45 min',
      image: 'https://images.unsplash.com/photo-1717986439981-0c6a51130cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc1Njc0NDU3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Navigate through neon-lit streets and experience the energy of Shibuya crossing',
      premium: false
    },
    {
      id: 'new-york',
      name: 'New York, USA',
      difficulty: 'Advanced',
      rating: 4.9,
      tours: 15,
      estimatedTime: '60 min',
      image: 'https://images.unsplash.com/photo-1544455670-11459b484d10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHN0cmVldHN8ZW58MXx8fHwxNzU2Nzk5NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Drive through Times Square and Central Park in the city that never sleeps',
      premium: false
    },
    {
      id: 'paris',
      name: 'Paris, France',
      difficulty: 'Beginner',
      rating: 4.7,
      tours: 10,
      estimatedTime: '40 min',
      image: 'https://images.unsplash.com/photo-1683213954027-5adddc3fd7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGZyYW5jZSUyMGxhbmRtYXJrc3xlbnwxfHx8fDE3NTY3OTk1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Cruise along the Seine and visit iconic landmarks like the Eiffel Tower',
      premium: true
    }
  ];

  const vehicles = [
    {
      id: 'sedan',
      name: 'Urban Sedan',
      type: 'Comfort',
      speed: 7,
      handling: 8,
      premium: false,
      image: '🚗'
    },
    {
      id: 'sports',
      name: 'Sports Car',
      type: 'Performance',
      speed: 10,
      handling: 9,
      premium: true,
      image: '🏎️'
    },
    {
      id: 'suv',
      name: 'Luxury SUV',
      type: 'Comfort',
      speed: 6,
      handling: 7,
      premium: true,
      image: '🚙'
    }
  ];

  const multiplayerSessions = [
    {
      id: 'session-1',
      city: 'Tokyo',
      host: 'DriveExplorer',
      players: 3,
      maxPlayers: 4,
      ping: 45,
      status: 'Open'
    },
    {
      id: 'session-2',
      city: 'New York',
      host: 'CityRacer',
      players: 2,
      maxPlayers: 6,
      ping: 32,
      status: 'Open'
    },
    {
      id: 'session-3',
      city: 'Paris',
      host: 'VRTourist',
      players: 4,
      maxPlayers: 4,
      ping: 78,
      status: 'Full'
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-sm hover:text-primary transition-colors">Tours</button>
              <button onClick={onMarketplace} className="text-sm hover:text-primary transition-colors">Marketplace</button>
              <button className="text-sm hover:text-primary transition-colors">Community</button>
            </nav>

            <div className="flex items-center gap-4">
              <Badge className="bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30">
                Premium Active
              </Badge>
              
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <div className="w-full h-full bg-brand-primary-solid/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-primary-solid" />
                  </div>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">Level 12 Explorer</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={onSettings}>
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-['Raleway'] font-semibold mb-2">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready for your next virtual adventure? Choose your destination and vehicle.
          </p>
        </div>

        {/* Mode Selection Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="glass-card border border-border/50 p-1">
            <TabsTrigger value="single-player" className="flex items-center gap-2 px-4">
              <User className="w-4 h-4" />
              Single Player
            </TabsTrigger>
            <TabsTrigger value="multiplayer" className="flex items-center gap-2 px-4">
              <Users className="w-4 h-4" />
              Multiplayer
            </TabsTrigger>
          </TabsList>

          {/* Single Player Content */}
          <TabsContent value="single-player" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* City Selection */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-['Raleway'] font-semibold mb-4">Choose Your Destination</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {cities.map((city) => (
                    <Card 
                      key={city.id}
                      className={`glass-card cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedCity === city.id ? 'ring-2 ring-brand-primary-solid ring-offset-2 ring-offset-background' : ''
                      }`}
                      onClick={() => setSelectedCity(city.id)}
                    >
                      <div className="relative">
                        <ImageWithFallback 
                          src={city.image}
                          alt={city.name}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        {city.premium && (
                          <Badge className="absolute top-3 right-3 bg-brand-accent/90 text-white border-0">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <Badge className={`text-xs ${getDifficultyColor(city.difficulty)}`}>
                            {city.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-['Raleway'] font-semibold">{city.name}</h3>
                          <div className="flex items-center gap-1">
                            {renderStars(city.rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {city.rating}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {city.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{city.tours} tours</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{city.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <h2 className="text-xl font-['Raleway'] font-semibold mb-4">Select Vehicle</h2>
                <div className="space-y-3">
                  {vehicles.map((vehicle) => (
                    <Card 
                      key={vehicle.id}
                      className={`glass-card cursor-pointer transition-all duration-200 ${
                        selectedVehicle === vehicle.id ? 'ring-2 ring-brand-primary-solid ring-offset-2 ring-offset-background' : ''
                      } ${vehicle.premium ? 'opacity-60' : ''}`}
                      onClick={() => !vehicle.premium && setSelectedVehicle(vehicle.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{vehicle.image}</span>
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                {vehicle.name}
                                {vehicle.premium && <Lock className="w-3 h-3 text-muted-foreground" />}
                              </h4>
                              <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Speed</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 10 }, (_, i) => (
                                <div 
                                  key={i}
                                  className={`w-1 h-2 rounded-sm ${
                                    i < vehicle.speed ? 'bg-brand-accent' : 'bg-border'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Handling</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 10 }, (_, i) => (
                                <div 
                                  key={i}
                                  className={`w-1 h-2 rounded-sm ${
                                    i < vehicle.handling ? 'bg-brand-secondary' : 'bg-border'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {vehicle.premium && (
                          <Button size="sm" variant="outline" className="w-full mt-3 text-xs">
                            Unlock with Premium
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Start Tour Button */}
                <Button 
                  onClick={() => selectedCity && onStartTour(selectedCity, selectedVehicle, false)}
                  disabled={!selectedCity}
                  className="w-full mt-6 bg-brand-accent hover:bg-brand-accent-hover text-white py-3"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Tour
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Multiplayer Content */}
          <TabsContent value="multiplayer" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-['Raleway'] font-semibold">Active Sessions</h2>
                  <Button variant="outline" size="sm" className="glass-card border-border/50">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {multiplayerSessions.map((session) => (
                    <Card key={session.id} className="glass-card">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="font-medium">{session.city} Tour</h4>
                              <p className="text-sm text-muted-foreground">Host: {session.host}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{session.players}/{session.maxPlayers}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Wifi className="w-4 h-4" />
                              <span>{session.ping}ms</span>
                            </div>
                            
                            <Badge 
                              className={`${
                                session.status === 'Open' 
                                  ? 'bg-green-500/20 text-green-700 border-green-500/30' 
                                  : 'bg-red-500/20 text-red-700 border-red-500/30'
                              }`}
                            >
                              {session.status}
                            </Badge>
                            
                            <Button 
                              size="sm" 
                              variant={session.status === 'Open' ? 'default' : 'ghost'}
                              disabled={session.status === 'Full'}
                              className={session.status === 'Open' ? 'bg-brand-accent hover:bg-brand-accent-hover text-white' : ''}
                            >
                              {session.status === 'Open' ? 'Join' : 'Full'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Multiplayer Vehicle Selection */}
              <div>
                <h2 className="text-xl font-['Raleway'] font-semibold mb-4">Your Vehicle</h2>
                <Card className="glass-card p-4">
                  <div className="text-center">
                    <span className="text-4xl mb-3 block">🚗</span>
                    <h4 className="font-medium mb-1">Urban Sedan</h4>
                    <p className="text-sm text-muted-foreground mb-4">Default multiplayer vehicle</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Change Vehicle
                    </Button>
                  </div>
                </Card>

                <div className="mt-6 p-4 rounded-lg glass border border-border/50">
                  <h5 className="font-medium mb-2 text-sm">Multiplayer Tips</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Stay close to the group</li>
                    <li>• Use voice chat for coordination</li>
                    <li>• Be respectful to other drivers</li>
                    <li>• Take turns being tour guide</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};