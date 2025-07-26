import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Palette, Shield, BarChart3, User, Bell, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

interface User {
  id: string;
  name: string;
  magicalName: string;
  house: 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';
  role: 'student' | 'professor' | 'cr';
  location: { x: number; y: number };
  isVisible: boolean;
}

interface Spell {
  id: string;
  name: string;
  usageCount: number;
}

interface SettingsPanelProps {
  currentUser: User | null;
  spells: Spell[];
}

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  sounds: boolean;
  privacy: {
    showLocation: boolean;
    allowPings: boolean;
    shareStatus: boolean;
  };
  display: {
    showParticles: boolean;
    animationsEnabled: boolean;
    mapTheme: 'classic' | 'modern' | 'dark';
  };
}

const houseData = {
  gryffindor: { color: 'bg-red-500', icon: '🦁', name: 'Gryffindor' },
  slytherin: { color: 'bg-green-600', icon: '🐍', name: 'Slytherin' },
  hufflepuff: { color: 'bg-yellow-500', icon: '🦡', name: 'Hufflepuff' },
  ravenclaw: { color: 'bg-blue-600', icon: '🦅', name: 'Ravenclaw' },
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentUser, spells }) => {
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    notifications: true,
    sounds: true,
    privacy: {
      showLocation: true,
      allowPings: true,
      shareStatus: true,
    },
    display: {
      showParticles: true,
      animationsEnabled: true,
      mapTheme: 'classic',
    },
  });

  const [activeSection, setActiveSection] = useState<string>('profile');

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  const totalSpellsCast = spells.reduce((total, spell) => total + spell.usageCount, 0);

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        {currentUser && (
          <>
            <div className={`w-20 h-20 rounded-full ${houseData[currentUser.house].color} flex items-center justify-center text-white text-3xl mx-auto mb-4`}>
              {houseData[currentUser.house].icon}
            </div>
            <h2 className="text-2xl font-uncial text-foreground">{currentUser.magicalName}</h2>
            <p className="text-muted-foreground font-crimson">{currentUser.name}</p>
            <Badge variant="secondary" className="mt-2 font-cinzel">
              {houseData[currentUser.house].name} House
            </Badge>
          </>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="magical-name" className="font-cinzel">Magical Name</Label>
          <Input
            id="magical-name"
            value={currentUser?.magicalName || ''}
            className="bg-background/50 border-accent/30"
            placeholder="Enter your magical name..."
          />
        </div>
        
        <div>
          <Label htmlFor="real-name" className="font-cinzel">Real Name</Label>
          <Input
            id="real-name"
            value={currentUser?.name || ''}
            className="bg-background/50 border-accent/30"
            placeholder="Enter your real name..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{totalSpellsCast}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Spells Cast</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{currentUser?.role}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Role</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel font-bold mb-4">Privacy Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-cinzel">Show Location on Map</Label>
              <p className="text-sm text-muted-foreground font-crimson">Allow others to see your location</p>
            </div>
            <Switch
              checked={settings.privacy.showLocation}
              onCheckedChange={(checked) => updateSetting('privacy.showLocation', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-cinzel">Allow Pings</Label>
              <p className="text-sm text-muted-foreground font-crimson">Let others summon you</p>
            </div>
            <Switch
              checked={settings.privacy.allowPings}
              onCheckedChange={(checked) => updateSetting('privacy.allowPings', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-cinzel">Share Status</Label>
              <p className="text-sm text-muted-foreground font-crimson">Show your current activity</p>
            </div>
            <Switch
              checked={settings.privacy.shareStatus}
              onCheckedChange={(checked) => updateSetting('privacy.shareStatus', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <h4 className="font-cinzel font-bold text-destructive mb-2">Danger Zone</h4>
        <p className="text-sm text-muted-foreground font-crimson mb-3">
          These actions cannot be undone. Proceed with caution.
        </p>
        <Button variant="destructive" size="sm">
          Reset All Data
        </Button>
      </div>
    </div>
  );

  const renderDisplaySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel font-bold mb-4">Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <div>
                <Label className="font-cinzel">Dark Mode</Label>
                <p className="text-sm text-muted-foreground font-crimson">Toggle dark theme</p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-cinzel">Floating Particles</Label>
              <p className="text-sm text-muted-foreground font-crimson">Show magical particles in background</p>
            </div>
            <Switch
              checked={settings.display.showParticles}
              onCheckedChange={(checked) => updateSetting('display.showParticles', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-cinzel">Animations</Label>
              <p className="text-sm text-muted-foreground font-crimson">Enable magical animations</p>
            </div>
            <Switch
              checked={settings.display.animationsEnabled}
              onCheckedChange={(checked) => updateSetting('display.animationsEnabled', checked)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-cinzel font-bold mb-3">Map Theme</h4>
        <div className="grid grid-cols-3 gap-2">
          {['classic', 'modern', 'dark'].map((theme) => (
            <Button
              key={theme}
              variant={settings.display.mapTheme === theme ? "default" : "outline"}
              size="sm"
              onClick={() => updateSetting('display.mapTheme', theme)}
              className={settings.display.mapTheme === theme ? "btn-magical" : ""}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel font-bold mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <div>
                <Label className="font-cinzel">Push Notifications</Label>
                <p className="text-sm text-muted-foreground font-crimson">Receive app notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.sounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <div>
                <Label className="font-cinzel">Sound Effects</Label>
                <p className="text-sm text-muted-foreground font-crimson">Play magical sound effects</p>
              </div>
            </div>
            <Switch
              checked={settings.sounds}
              onCheckedChange={(checked) => updateSetting('sounds', checked)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-cinzel font-bold mb-3">Notification Types</h4>
        <div className="space-y-2">
          {[
            'Spell activations',
            'Friend pings',
            'Creature encounters',
            'System updates'
          ].map((type) => (
            <div key={type} className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span className="text-sm font-crimson">{type}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStatsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel font-bold mb-4">Your Magical Statistics</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="spell-card text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-accent">{totalSpellsCast}</div>
              <div className="text-sm text-muted-foreground font-cinzel">Total Spells Cast</div>
            </div>
          </Card>
          <Card className="spell-card text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-accent">{spells.length}</div>
              <div className="text-sm text-muted-foreground font-cinzel">Spells Known</div>
            </div>
          </Card>
        </div>
        
        <div>
          <h4 className="font-cinzel font-bold mb-3">Spell Usage Breakdown</h4>
          <div className="space-y-2">
            {spells.map((spell) => (
              <div key={spell.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="font-cinzel">{spell.name}</span>
                <Badge variant="secondary">{spell.usageCount} times</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-cinzel font-bold mb-3">Achievements</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'First Spell', icon: '🌟', earned: totalSpellsCast > 0 },
            { name: 'Spell Master', icon: '🧙', earned: totalSpellsCast >= 10 },
            { name: 'Marauder', icon: '🗺️', earned: true },
            { name: 'Explorer', icon: '🔍', earned: false },
          ].map((achievement) => (
            <div 
              key={achievement.name}
              className={`p-3 rounded-lg border text-center ${
                achievement.earned 
                  ? 'bg-gradient-emerald border-success' 
                  : 'bg-muted/50 border-border opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className="text-xs font-cinzel">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'privacy': return renderPrivacySection();
      case 'display': return renderDisplaySection();
      case 'notifications': return renderNotificationsSection();
      case 'stats': return renderStatsSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-uncial text-foreground mb-2">Marauder Settings</h1>
        <p className="text-lg font-crimson text-muted-foreground">
          Customize your magical experience
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => setActiveSection(section.id)}
                className={`w-full justify-start ${activeSection === section.id ? "btn-magical" : ""}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.label}
              </Button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="spell-card">
            <div className="p-6">
              {renderContent()}
            </div>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <Button className="btn-magical">
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};