import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Gamepad2, Headphones, Shield, Check } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to VRDrive",
      subtitle: "Let's get you started with a quick tour",
      icon: Gamepad2,
      content: (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-primary-solid/20 to-brand-secondary/20 flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-brand-primary-solid" />
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Experience the world's most beautiful cities through immersive virtual reality driving. 
            This quick tutorial will help you get the most out of your VRDrive experience.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-3 text-brand-secondary">
              <Check className="w-4 h-4" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-brand-secondary">
              <Check className="w-4 h-4" />
              <span>Beginner-friendly</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-brand-secondary">
              <Check className="w-4 h-4" />
              <span>Safety first</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Basic Controls",
      subtitle: "Master steering, acceleration, and braking",
      icon: Gamepad2,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-['Raleway'] font-semibold">Steering</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-brand-primary-solid/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-primary-solid font-medium">1</span>
                  </div>
                  <span>Use your VR controllers or steering wheel to turn</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-brand-primary-solid/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-primary-solid font-medium">2</span>
                  </div>
                  <span>Natural hand movements translate to smooth steering</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-['Raleway'] font-semibold">Speed Control</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-brand-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-secondary font-medium">A</span>
                  </div>
                  <span>Right trigger to accelerate</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-brand-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-secondary font-medium">B</span>
                  </div>
                  <span>Left trigger to brake</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
            <p className="text-sm text-center">
              <strong className="text-brand-accent">Pro Tip:</strong> Start with gentle movements. 
              The physics engine responds to subtle inputs for the most realistic experience.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Head Movement & Camera",
      subtitle: "Look around and change perspectives",
      icon: Headphones,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-secondary/20 to-brand-accent/20 flex items-center justify-center">
              <Headphones className="w-12 h-12 text-brand-secondary" />
            </div>
            <p className="text-muted-foreground">
              Use natural head movements to look around and enjoy different camera angles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Card className="p-4 glass-card">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-primary-solid/20 flex items-center justify-center">
                <span className="text-brand-primary-solid font-medium">👁️</span>
              </div>
              <h5 className="font-medium mb-2">First Person</h5>
              <p className="text-xs text-muted-foreground">Driver's seat view for maximum immersion</p>
            </Card>
            
            <Card className="p-4 glass-card">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                <span className="text-brand-secondary font-medium">🚗</span>
              </div>
              <h5 className="font-medium mb-2">Third Person</h5>
              <p className="text-xs text-muted-foreground">External view to see your vehicle and surroundings</p>
            </Card>
            
            <Card className="p-4 glass-card">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <span className="text-brand-accent font-medium">📸</span>
              </div>
              <h5 className="font-medium mb-2">Photo Mode</h5>
              <p className="text-xs text-muted-foreground">Capture and share your favorite moments</p>
            </Card>
          </div>
          
          <div className="text-center">
            <Button variant="outline" size="sm" className="glass-card border-border/50">
              Press Y to cycle camera views
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Safety & Comfort",
      subtitle: "Your wellbeing is our priority",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-accent/20 to-destructive/20 flex items-center justify-center">
              <Shield className="w-12 h-12 text-brand-accent" />
            </div>
            <p className="text-muted-foreground">
              VRDrive includes multiple comfort features to ensure a pleasant experience for everyone
            </p>
          </div>
          
          <div className="space-y-4">
            <Card className="p-4 glass-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-secondary">🛡️</span>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Motion Comfort</h5>
                  <p className="text-sm text-muted-foreground">Adjustable comfort settings reduce motion sickness</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 glass-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary-solid/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary-solid">⏸️</span>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Quick Pause</h5>
                  <p className="text-sm text-muted-foreground">Press menu button anytime to pause and rest</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 glass-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-accent">👥</span>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Safe Social</h5>
                  <p className="text-sm text-muted-foreground">Moderated multiplayer with reporting tools</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-center">
              <strong className="text-destructive">Remember:</strong> Take breaks every 20-30 minutes. 
              If you feel uncomfortable, remove your headset immediately.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl glass-card">
        {/* Progress Bar */}
        <div className="p-6 pb-0">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Step {currentSlide + 1} of {slides.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-8 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-['Raleway'] font-semibold mb-2">
              {slides[currentSlide].title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 pt-0 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="glass-card border-border/50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-brand-primary-solid' 
                    : 'bg-border hover:bg-border/80'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            className="bg-brand-accent hover:bg-brand-accent-hover text-white"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};