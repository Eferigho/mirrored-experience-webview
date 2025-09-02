import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { Dashboard } from './components/Dashboard';
import { TourDetailsPage } from './components/TourDetailsPage';
import { InDriveUI } from './components/InDriveUI';
import { Marketplace } from './components/Marketplace';
import { SettingsPage } from './components/SettingsPage';

type AppView = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'tour-details' | 'in-drive' | 'marketplace' | 'settings';
type AuthMode = 'login' | 'signup';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedTour, setSelectedTour] = useState<string>('');
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Navigation handlers
  const handleGetStarted = () => {
    setCurrentView('auth');
    setAuthMode('signup');
  };

  const handleLearnMore = () => {
    // Scroll to features section or show more info
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleAuth = () => {
    setIsAuthenticated(true);
    if (!hasCompletedOnboarding) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleToggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentView('dashboard');
  };

  const handleStartTour = (cityId: string, vehicleId: string, isMultiplayerMode: boolean) => {
    setSelectedCity(cityId);
    setIsMultiplayer(isMultiplayerMode);
    setCurrentView('tour-details');
  };

  const handleStartSpecificTour = (tourId: string) => {
    setSelectedTour(tourId);
    setCurrentView('in-drive');
  };

  const handleExitTour = () => {
    setCurrentView('dashboard');
  };

  const handleSettings = () => {
    setCurrentView('settings');
  };

  const handleProfile = () => {
    console.log('Opening profile...');
  };

  const handleMarketplace = () => {
    setCurrentView('marketplace');
  };

  const handlePurchase = (itemId: string) => {
    console.log('Purchasing item:', itemId);
    // Here you would handle the purchase flow
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={handleGetStarted}
            onLearnMore={handleLearnMore}
          />
        );

      case 'auth':
        return (
          <AuthPage
            mode={authMode}
            onBack={handleBackToLanding}
            onAuth={handleAuth}
            onToggleMode={handleToggleAuthMode}
          />
        );

      case 'onboarding':
        return (
          <OnboardingCarousel
            onComplete={handleOnboardingComplete}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            onStartTour={handleStartTour}
            onSettings={handleSettings}
            onProfile={handleProfile}
            onMarketplace={handleMarketplace}
          />
        );

      case 'tour-details':
        return (
          <TourDetailsPage
            cityId={selectedCity}
            onBack={() => setCurrentView('dashboard')}
            onStartTour={handleStartSpecificTour}
          />
        );

      case 'in-drive':
        return (
          <InDriveUI
            tourId={selectedTour}
            isMultiplayer={isMultiplayer}
            onExit={handleExitTour}
          />
        );

      case 'marketplace':
        return (
          <Marketplace
            onBack={() => setCurrentView('dashboard')}
            onPurchase={handlePurchase}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            onBack={() => setCurrentView('dashboard')}
          />
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-['Raleway'] font-semibold mb-4">
                Feature Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6">
                This feature is currently under development.
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="size-full">
      {renderCurrentView()}
      
      {/* Theme Toggle - Fixed position for easy access during development */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 z-50"
        title="Toggle theme"
      >
        {isDarkMode ? (
          <span className="text-lg">☀️</span>
        ) : (
          <span className="text-lg">🌙</span>
        )}
      </button>
    </div>
  );
}