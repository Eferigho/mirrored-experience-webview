import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Car, Users, MapPin, Headphones, Shield, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLearnMore }) => {
  const features = [
    {
      icon: Car,
      title: "Immersive Driving",
      description: "Experience realistic physics and stunning visuals as you navigate through world-famous cities."
    },
    {
      icon: Users,
      title: "Social Exploration",
      description: "Join friends and other drivers in multiplayer tours. Share the adventure together."
    },
    {
      icon: MapPin,
      title: "Endless Destinations", 
      description: "From Tokyo's neon streets to Paris boulevards - explore the world from your living room."
    }
  ];

  const testimonials = [
    {
      name: "Travel Weekly",
      logo: "🌍",
      quote: "The future of virtual tourism"
    },
    {
      name: "VR Gaming",
      logo: "🎮",
      quote: "Incredibly immersive experience"
    },
    {
      name: "Tech Review",
      logo: "⚡",
      quote: "Revolutionary driving simulation"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
              <a href="#cities" className="text-sm hover:text-primary transition-colors">Cities</a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
              <a href="#support" className="text-sm hover:text-primary transition-colors">Support</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button 
                onClick={onGetStarted}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                size="sm"
              >
                Try Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1747463922810-76b3f23fa687?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc3RyZWV0JTIwZHJpdmluZyUyMHZpZXd8ZW58MXx8fHwxNzU2Nzk5NDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="City street driving view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30">
              🚀 Now with multiplayer mode
            </Badge>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-['Raleway'] font-semibold leading-tight">
              Experience the world{' '}
              <span className="bg-gradient-to-r from-brand-primary-solid to-brand-secondary bg-clip-text text-transparent">
                behind the wheel
              </span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl font-['Poppins'] leading-relaxed">
              Immerse yourself in realistic driving tours through iconic cities worldwide. 
              Feel every turn, see every landmark, and share the journey with friends in virtual reality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-brand-accent hover:bg-brand-accent-hover text-white text-lg px-8 py-4 rounded-xl"
              >
                Try for Free
                <Car className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={onLearnMore}
                variant="outline"
                size="lg"
                className="border-2 border-primary/20 hover:border-primary/40 text-lg px-8 py-4 rounded-xl glass"
              >
                Learn More
                <Headphones className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-secondary" />
                <span>Safe & Comfortable</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-accent" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-primary-solid" />
                <span>50K+ Active Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-['Raleway'] font-semibold">
              Why Choose VRDrive?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Experience the perfect blend of cutting-edge technology and immersive storytelling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-primary-solid/20 to-brand-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-brand-primary-solid" />
                  </div>
                  <h3 className="mb-4 text-xl font-['Raleway'] font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials/Partners */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="mb-4 text-2xl font-['Raleway'] font-semibold">Trusted by Industry Leaders</h3>
            <p className="text-muted-foreground">What the experts are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card p-6 text-center">
                <div className="text-3xl mb-3">{testimonial.logo}</div>
                <p className="text-sm text-muted-foreground mb-2">"{testimonial.quote}"</p>
                <p className="font-['Montserrat'] font-medium text-sm">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bringing the world's cities to your living room through immersive virtual reality.
              </p>
            </div>
            <div>
              <h4 className="font-['Montserrat'] font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Features</a>
                <a href="#" className="hover:text-primary transition-colors">Cities</a>
                <a href="#" className="hover:text-primary transition-colors">Pricing</a>
                <a href="#" className="hover:text-primary transition-colors">Download</a>
              </nav>
            </div>
            <div>
              <h4 className="font-['Montserrat'] font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Help Center</a>
                <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
                <a href="#" className="hover:text-primary transition-colors">System Requirements</a>
                <a href="#" className="hover:text-primary transition-colors">Safety Guidelines</a>
              </nav>
            </div>
            <div>
              <h4 className="font-['Montserrat'] font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary-solid/20 flex items-center justify-center text-brand-primary-solid text-sm cursor-pointer hover:bg-brand-primary-solid/30 transition-colors">
                  f
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary text-sm cursor-pointer hover:bg-brand-secondary/30 transition-colors">
                  t
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-sm cursor-pointer hover:bg-brand-accent/30 transition-colors">
                  i
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 VRDrive. All rights reserved.</p>
            <nav className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};