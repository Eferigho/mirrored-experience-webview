import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { Logo } from './Logo';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Volume2, 
  Eye,
  Gamepad2,
  Shield,
  Bell,
  Globe,
  Monitor,
  HardDrive,
  Wifi,
  Trophy,
  MapPin,
  Clock,
  Star,
  Crown
} from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Settings state
  const [motionComfort, setMotionComfort] = useState(75);
  const [audioVolume, setAudioVolume] = useState(80);
  const [graphicsQuality, setGraphicsQuality] = useState('high');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [parentalControls, setParentalControls] = useState(false);

  const userStats = {
    level: 12,
    xp: 2847,
    xpToNext: 3500,
    totalDistance: 4672,
    citiesVisited: 8,
    toursCompleted: 47,
    timeSpent: 89,
    achievements: 23,
    favoriteCity: 'Tokyo',
    joinDate: 'March 2024'
  };

  const achievements = [
    {
      id: 'first-tour',
      name: 'First Journey',
      description: 'Complete your first VR tour',
      icon: '🚗',
      earned: true,
      date: 'March 15, 2024'
    },
    {
      id: 'tokyo-explorer',
      name: 'Tokyo Explorer',
      description: 'Complete all Tokyo tours',
      icon: '🏮',
      earned: true,
      date: 'April 2, 2024'
    },
    {
      id: 'social-driver',
      name: 'Social Driver',
      description: 'Complete 10 multiplayer tours',
      icon: '👥',
      earned: true,
      date: 'May 18, 2024'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Drive 1000km total distance',
      icon: '⚡',
      earned: false,
      progress: 85
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'tour',
      description: 'Completed "Shibuya Crossing Experience"',
      time: '2 hours ago',
      rating: 5
    },
    {
      id: '2',
      type: 'achievement',
      description: 'Earned "Social Driver" achievement',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'purchase',
      description: 'Purchased Paris Premium Pack',
      time: '3 days ago'
    }
  ];

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
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Logo />
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-brand-primary-solid/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-primary-solid" />
                </div>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium">Alex Johnson</p>
                <p className="text-sm text-muted-foreground">Level {userStats.level} Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass-card border border-border/50 p-1 grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="glass-card p-6">
                    <h2 className="text-xl font-['Raleway'] font-semibold mb-6">Profile Information</h2>
                    
                    <div className="flex items-start gap-6 mb-6">
                      <Avatar className="w-20 h-20">
                        <div className="w-full h-full bg-brand-primary-solid/20 flex items-center justify-center">
                          <User className="w-10 h-10 text-brand-primary-solid" />
                        </div>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-['Raleway'] font-semibold">Alex Johnson</h3>
                          <Badge className="bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-muted-foreground">Level {userStats.level}</span>
                          <div className="flex-1 max-w-xs">
                            <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-2" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {userStats.xp}/{userStats.xpToNext} XP
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">
                          Joined {userStats.joinDate} • {userStats.citiesVisited} cities explored
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-brand-primary-solid">{userStats.toursCompleted}</div>
                        <div className="text-xs text-muted-foreground">Tours</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-brand-secondary">{userStats.totalDistance}km</div>
                        <div className="text-xs text-muted-foreground">Distance</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-brand-accent">{userStats.timeSpent}h</div>
                        <div className="text-xs text-muted-foreground">Time</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-yellow-500">{userStats.achievements}</div>
                        <div className="text-xs text-muted-foreground">Achievements</div>
                      </div>
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="glass-card p-6">
                    <h3 className="text-lg font-['Raleway'] font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                          <div className="w-8 h-8 rounded-full bg-brand-primary-solid/20 flex items-center justify-center flex-shrink-0">
                            {activity.type === 'tour' && <MapPin className="w-4 h-4 text-brand-primary-solid" />}
                            {activity.type === 'achievement' && <Trophy className="w-4 h-4 text-yellow-500" />}
                            {activity.type === 'purchase' && <Crown className="w-4 h-4 text-brand-secondary" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{activity.time}</span>
                              {activity.rating && (
                                <div className="flex items-center gap-1">
                                  {renderStars(activity.rating)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <Card className="glass-card p-6">
                    <h3 className="text-lg font-['Raleway'] font-semibold mb-4">Favorite City</h3>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏮</div>
                      <div className="font-medium">{userStats.favoriteCity}</div>
                      <div className="text-sm text-muted-foreground">15 tours completed</div>
                    </div>
                  </Card>

                  <Card className="glass-card p-6">
                    <h3 className="text-lg font-['Raleway'] font-semibold mb-4">Subscription</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium">Premium</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renews</span>
                        <span className="text-sm">Feb 15, 2025</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Manage Subscription
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* VR & Comfort Settings */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-['Raleway'] font-semibold mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    VR & Comfort
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Motion Comfort</label>
                        <span className="text-sm text-muted-foreground">{motionComfort}%</span>
                      </div>
                      <Slider
                        value={[motionComfort]}
                        onValueChange={(value) => setMotionComfort(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher values reduce motion sickness but may limit immersion
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Graphics Quality</label>
                      <Select value={graphicsQuality} onValueChange={setGraphicsQuality}>
                        <SelectTrigger className="glass-card border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Performance)</SelectItem>
                          <SelectItem value="medium">Medium (Balanced)</SelectItem>
                          <SelectItem value="high">High (Quality)</SelectItem>
                          <SelectItem value="ultra">Ultra (Premium)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Auto-Pause on Remove Headset</label>
                        <p className="text-xs text-muted-foreground">Automatically pause when headset is removed</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </Card>

                {/* Audio Settings */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-['Raleway'] font-semibold mb-4 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Audio
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Master Volume</label>
                        <span className="text-sm text-muted-foreground">{audioVolume}%</span>
                      </div>
                      <Slider
                        value={[audioVolume]}
                        onValueChange={(value) => setAudioVolume(value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Audio Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="glass-card border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                          <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                          <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Spatial Audio</label>
                        <Switch checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Voice Chat Auto-Gain</label>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Controls */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-['Raleway'] font-semibold mb-4 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Controls
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium block mb-2">Control Scheme</label>
                      <Select defaultValue="standard">
                        <SelectTrigger className="glass-card border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="left-handed">Left-Handed</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Haptic Feedback</label>
                        <Switch checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Smooth Turning</label>
                        <Switch checked={false} />
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Calibrate Controllers
                    </Button>
                  </div>
                </Card>

                {/* System */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-['Raleway'] font-semibold mb-4 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    System
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Automatic Updates</label>
                        <Switch checked={autoUpdates} onCheckedChange={setAutoUpdates} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Notifications</label>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Usage Analytics</label>
                        <Switch checked={true} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Storage Used</span>
                        <span>47GB / 100GB</span>
                      </div>
                      <Progress value={47} className="h-2" />
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <HardDrive className="w-4 h-4 mr-2" />
                        Manage Storage
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`glass-card p-6 text-center ${
                      achievement.earned ? '' : 'opacity-60'
                    }`}
                  >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-['Raleway'] font-semibold mb-2">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    
                    {achievement.earned ? (
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                        Earned {achievement.date}
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Progress: {achievement.progress}%
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-8">
              <div className="max-w-2xl mx-auto">
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-['Raleway'] font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Privacy & Safety
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Profile Visibility</label>
                        <p className="text-xs text-muted-foreground">Who can see your profile and stats</p>
                      </div>
                      <Select defaultValue="friends">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Parental Controls</label>
                        <p className="text-xs text-muted-foreground">Enable content filtering and time limits</p>
                      </div>
                      <Switch checked={parentalControls} onCheckedChange={setParentalControls} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Data Collection</label>
                        <p className="text-xs text-muted-foreground">Allow anonymous usage data collection</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Download My Data
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-6">
                  <h3 className="text-lg font-['Raleway'] font-semibold mb-4">Help & Support</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      📚 Help Center
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      💬 Contact Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🐛 Report Bug
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      💡 Feature Request
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};