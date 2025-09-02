import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Logo } from './Logo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onAuth: () => void;
  onToggleMode: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onBack, onAuth, onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mb-8 -ml-2 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Logo */}
          <div className="mb-8">
            <Logo className="mb-4" />
            <h1 className="text-2xl font-['Raleway'] font-semibold mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Sign in to continue your virtual driving adventures' 
                : 'Start exploring the world from behind the wheel'
              }
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 glass-card border-border/50 focus:border-brand-primary-solid"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-card border-border/50 focus:border-brand-primary-solid pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 glass-card border-border/50 focus:border-brand-primary-solid"
                  required
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border/50" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-brand-primary-solid hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white py-3 rounded-xl"
              size="lg"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Social Auth */}
          <div className="mt-6">
            <div className="relative">
              <Separator className="my-4" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground font-['Montserrat']">
                OR
              </span>
            </div>

            <div className="space-y-3 mt-6">
              <Button variant="outline" className="w-full glass-card border-border/50 hover:border-border/80 py-3">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button variant="outline" className="w-full glass-card border-border/50 hover:border-border/80 py-3">
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>

              <Button variant="ghost" className="w-full text-brand-primary-solid hover:bg-brand-primary-solid/10 py-3">
                Continue as Guest
              </Button>
            </div>
          </div>

          {/* Toggle Mode */}
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button 
              variant="link" 
              onClick={onToggleMode}
              className="ml-1 p-0 text-brand-primary-solid hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1660190366607-9b192135e0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGhlYWRzZXQlMjBnYW1pbmd8ZW58MXx8fHwxNzU2Nzk5NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="VR Gaming Experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brand-primary-solid/20 to-brand-primary-solid/60" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-['Raleway'] font-semibold mb-4">
              {mode === 'login' ? 'Ready for your next adventure?' : 'Join the revolution'}
            </h2>
            <p className="text-white/90 leading-relaxed">
              {mode === 'login' 
                ? 'Experience breathtaking cities and iconic landmarks through immersive virtual reality driving.' 
                : 'Discover a new way to explore the world. Drive through stunning cities with photorealistic detail and cutting-edge VR technology.'
              }
            </p>
            
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                <span>Photorealistic city environments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-secondary"></div>
                <span>Multiplayer social experiences</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span>Comfort-first VR design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};