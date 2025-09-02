import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Logo } from './Logo';
import { 
  ArrowLeft, 
  Crown, 
  Car, 
  MapPin, 
  Palette, 
  ShoppingCart,
  Star,
  Download,
  Check,
  Lock,
  CreditCard
} from 'lucide-react';

interface MarketplaceProps {
  onBack: () => void;
  onPurchase: (itemId: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onBack, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState('cities');
  const [cartItems, setCartItems] = useState<string[]>([]);

  const premiumCities = [
    {
      id: 'london',
      name: 'London, UK',
      description: 'Drive through historic London with Big Ben, Tower Bridge, and royal palaces',
      price: '$9.99',
      rating: 4.8,
      tours: 14,
      image: 'https://images.unsplash.com/photo-1683213954027-5adddc3fd7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGZyYW5jZSUyMGxhbmRtYXJrc3xlbnwxfHx8fDE3NTY3OTk1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: true,
      discount: '20%'
    },
    {
      id: 'dubai',
      name: 'Dubai, UAE',
      description: 'Experience luxury and innovation in the city of the future',
      price: '$12.99',
      rating: 4.9,
      tours: 10,
      image: 'https://images.unsplash.com/photo-1683213954027-5adddc3fd7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGZyYW5jZSUyMGxhbmRtYXJrc3xlbnwxfHx8fDE3NTY3OTk1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      id: 'sydney',
      name: 'Sydney, Australia',
      description: 'Coastal drives with iconic Sydney Opera House and Harbor Bridge',
      price: '$8.99',
      rating: 4.7,
      tours: 12,
      image: 'https://images.unsplash.com/photo-1683213954027-5adddc3fd7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGZyYW5jZSUyMGxhbmRtYXJrc3xlbnwxfHx8fDE3NTY3OTk1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    }
  ];

  const premiumVehicles = [
    {
      id: 'ferrari',
      name: 'Ferrari 488 GTB',
      description: 'Experience pure Italian performance and style',
      price: '$15.99',
      category: 'Supercar',
      speed: 10,
      handling: 9,
      image: 'https://images.unsplash.com/photo-1665491641262-53155eaac2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTk1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: true
    },
    {
      id: 'tesla-s',
      name: 'Tesla Model S Plaid',
      description: 'Silent acceleration with cutting-edge technology',
      price: '$12.99',
      category: 'Electric',
      speed: 10,
      handling: 8,
      image: 'https://images.unsplash.com/photo-1665491641262-53155eaac2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTk1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      id: 'porsche-911',
      name: 'Porsche 911 Turbo S',
      description: 'Legendary German engineering and precision',
      price: '$14.99',
      category: 'Sports Car',
      speed: 9,
      handling: 10,
      image: 'https://images.unsplash.com/photo-1665491641262-53155eaac2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTk1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    }
  ];

  const cosmeticUpgrades = [
    {
      id: 'neon-lights',
      name: 'Neon Underglow Pack',
      description: 'Customizable LED underglow for night driving',
      price: '$3.99',
      category: 'Lighting',
      image: '🌈',
      featured: false
    },
    {
      id: 'custom-plates',
      name: 'Custom License Plates',
      description: 'Personalize your vehicle with custom license plates',
      price: '$2.99',
      category: 'Personalization',
      image: '🔢',
      featured: false
    },
    {
      id: 'wheel-rims',
      name: 'Chrome Wheel Package',
      description: 'Premium chrome and carbon fiber wheel options',
      price: '$5.99',
      category: 'Wheels',
      image: '⭕',
      featured: false
    }
  ];

  const subscriptionTiers = [
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      features: [
        'Access to all premium cities',
        'Priority multiplayer access',
        'Exclusive vehicle skins',
        'Early access to new content'
      ],
      color: 'bg-brand-primary-solid',
      popular: false
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: '$19.99',
      period: 'month',
      features: [
        'Everything in Premium',
        'All premium vehicles included',
        'Custom avatar creation',
        'Private multiplayer rooms',
        '24/7 premium support'
      ],
      color: 'bg-brand-accent',
      popular: true
    }
  ];

  const addToCart = (itemId: string) => {
    if (!cartItems.includes(itemId)) {
      setCartItems([...cartItems, itemId]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(id => id !== itemId));
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

  const getCartTotal = () => {
    let total = 0;
    [...premiumCities, ...premiumVehicles, ...cosmeticUpgrades].forEach(item => {
      if (cartItems.includes(item.id)) {
        total += parseFloat(item.price.replace('$', ''));
      }
    });
    return total.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Logo />
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass-card border-border/50 relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({cartItems.length})
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-['Raleway'] font-semibold mb-2">VRDrive Marketplace</h1>
          <p className="text-muted-foreground text-lg">Expand your virtual world with premium content</p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="glass-card border border-border/50 p-1 grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="cities" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Cities</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="hidden sm:inline">Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Cosmetics</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
          </TabsList>

          {/* Cities */}
          <TabsContent value="cities" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumCities.map((city) => (
                <Card key={city.id} className="glass-card group hover:scale-[1.02] transition-all duration-200">
                  <div className="relative">
                    <ImageWithFallback 
                      src={city.image}
                      alt={city.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    
                    {city.featured && (
                      <Badge className="absolute top-3 left-3 bg-brand-accent/90 text-white border-0">
                        Featured
                      </Badge>
                    )}
                    
                    {city.discount && (
                      <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0">
                        {city.discount} OFF
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-['Raleway'] font-semibold">{city.name}</h3>
                      <div className="flex items-center gap-1">
                        {renderStars(city.rating)}
                        <span className="text-xs text-muted-foreground ml-1">{city.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {city.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                      <span>{city.tours} tours included</span>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>12GB</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{city.price}</span>
                      <Button 
                        size="sm"
                        onClick={() => addToCart(city.id)}
                        disabled={cartItems.includes(city.id)}
                        className={cartItems.includes(city.id) 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                        }
                      >
                        {cartItems.includes(city.id) ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Added
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vehicles */}
          <TabsContent value="vehicles" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="glass-card group hover:scale-[1.02] transition-all duration-200">
                  <div className="relative">
                    <ImageWithFallback 
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    
                    {vehicle.featured && (
                      <Badge className="absolute top-3 left-3 bg-brand-accent/90 text-white border-0">
                        Featured
                      </Badge>
                    )}
                    
                    <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0">
                      {vehicle.category}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-['Raleway'] font-semibold mb-2">{vehicle.name}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {vehicle.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
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
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{vehicle.price}</span>
                      <Button 
                        size="sm"
                        onClick={() => addToCart(vehicle.id)}
                        disabled={cartItems.includes(vehicle.id)}
                        className={cartItems.includes(vehicle.id) 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                        }
                      >
                        {cartItems.includes(vehicle.id) ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Added
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cosmetics */}
          <TabsContent value="cosmetics" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cosmeticUpgrades.map((item) => (
                <Card key={item.id} className="glass-card text-center group hover:scale-[1.02] transition-all duration-200">
                  <div className="p-6">
                    <div className="text-4xl mb-4">{item.image}</div>
                    <h3 className="font-['Raleway'] font-semibold mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    
                    <Badge className="mb-4 bg-muted/50 text-muted-foreground">
                      {item.category}
                    </Badge>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{item.price}</span>
                      <Button 
                        size="sm"
                        onClick={() => addToCart(item.id)}
                        disabled={cartItems.includes(item.id)}
                        className={cartItems.includes(item.id) 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                        }
                      >
                        {cartItems.includes(item.id) ? <Check className="w-3 h-3" /> : '+'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscription Plans */}
          <TabsContent value="subscription" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {subscriptionTiers.map((tier) => (
                  <Card 
                    key={tier.id} 
                    className={`glass-card relative ${
                      tier.popular ? 'ring-2 ring-brand-accent ring-offset-2 ring-offset-background' : ''
                    }`}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-accent text-white">
                        Most Popular
                      </Badge>
                    )}
                    
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-['Raleway'] font-semibold mb-2">{tier.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold">{tier.price}</span>
                          <span className="text-muted-foreground">/{tier.period}</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full ${tier.color} hover:opacity-90 text-white`}
                        size="lg"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Choose {tier.name}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Cart Summary - Fixed Bottom */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-50">
            <div className="container mx-auto flex items-center justify-between max-w-4xl">
              <div className="flex items-center gap-4">
                <span className="font-medium">{cartItems.length} items in cart</span>
                <span className="text-muted-foreground">Total: ${getCartTotal()}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setCartItems([])} size="sm">
                  Clear Cart
                </Button>
                <Button 
                  onClick={() => onPurchase('cart')}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};