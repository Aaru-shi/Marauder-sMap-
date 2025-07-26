import React, { useState, useEffect } from 'react';
import { MapPin, Wand2, Users, Compass, Clock, Settings, Scroll, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OnboardingWizard } from './OnboardingWizard';
import { MagicalMap } from './MagicalMap';
import { SpellsGrimoire } from './SpellsGrimoire';
import { UsersDirectory } from './UsersDirectory';
import { MagicalCompass } from './MagicalCompass';
import { CreaturesEncounter } from './CreaturesEncounter';
import { TimeTurner } from './TimeTurner';
import { SettingsPanel } from './SettingsPanel';
import heroImage from '@/assets/marauders-map-hero.jpg';

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
  description: string;
  effect: string;
  isActive: boolean;
  cooldown: number;
  usageCount: number;
}

export const MaraudersApp: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [mapMode, setMapMode] = useState<'daily' | 'hackathon' | 'orientation' | 'fest'>('daily');
  const [users, setUsers] = useState<User[]>([]);
  const [spells, setSpells] = useState<Spell[]>([
    {
      id: 'evanesco',
      name: 'Evanesco',
      description: 'Vanish from the map to maintain privacy',
      effect: 'Makes you invisible to other marauders',
      isActive: false,
      cooldown: 0,
      usageCount: 0
    },
    {
      id: 'summon',
      name: 'Summon',
      description: 'Send a pulse to locate a friend',
      effect: 'Highlights a friend\'s location temporarily',
      isActive: false,
      cooldown: 0,
      usageCount: 0
    },
    {
      id: 'lumos',
      name: 'Lumos',
      description: 'Illuminate your location',
      effect: 'Makes your location glow brightly',
      isActive: false,
      cooldown: 0,
      usageCount: 0
    },
    {
      id: 'protego',
      name: 'Protego',
      description: 'Shield yourself from being pinged',
      effect: 'Prevents others from summoning you',
      isActive: false,
      cooldown: 0,
      usageCount: 0
    }
  ]);

  const tabs = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'daily', label: 'Daily', icon: MapPin },
    { id: 'spells', label: 'Spells', icon: Wand2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'compass', label: 'Compass', icon: Compass },
    { id: 'creatures', label: 'Creatures', icon: Scroll },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    // Initialize with some demo users
    const demoUsers: User[] = [
      {
        id: 'demo1',
        name: 'Hermione Granger',
        magicalName: 'Brightest Witch',
        house: 'gryffindor',
        role: 'student',
        location: { x: 45, y: 60 },
        isVisible: true
      },
      {
        id: 'demo2',
        name: 'Draco Malfoy',
        magicalName: 'Slytherin Prince',
        house: 'slytherin',
        role: 'cr',
        location: { x: 70, y: 40 },
        isVisible: true
      },
      {
        id: 'demo3',
        name: 'Luna Lovegood',
        magicalName: 'Moonlight Dreamer',
        house: 'ravenclaw',
        role: 'student',
        location: { x: 30, y: 80 },
        isVisible: true
      }
    ];
    setUsers(demoUsers);
  }, []);

  const handleOnboardingComplete = (userData: Partial<User>) => {
    const newUser: User = {
      id: 'current-user',
      name: userData.name || 'Marauder',
      magicalName: userData.magicalName || 'Unknown Wizard',
      house: userData.house || 'gryffindor',
      role: 'student',
      location: { x: 50, y: 50 },
      isVisible: true
    };
    setCurrentUser(newUser);
    setIsOnboardingComplete(true);
  };

  const castSpell = (spellId: string, targetUserId?: string) => {
    setSpells(prev => prev.map(spell => {
      if (spell.id === spellId && spell.cooldown === 0) {
        return {
          ...spell,
          isActive: !spell.isActive,
          usageCount: spell.usageCount + 1,
          cooldown: spell.id === 'summon' ? 30 : 0
        };
      }
      return spell;
    }));

    // Handle spell effects
    if (spellId === 'evanesco' && currentUser) {
      setCurrentUser(prev => prev ? { ...prev, isVisible: !prev.isVisible } : null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
      case 'daily':
        return (
          <MagicalMap 
            mode={mapMode}
            currentUser={currentUser}
            users={users}
            spells={spells}
            onModeChange={setMapMode}
            onCastSpell={castSpell}
          />
        );
      case 'spells':
        return <SpellsGrimoire spells={spells} onCastSpell={castSpell} />;
      case 'users':
        return <UsersDirectory users={users} currentUser={currentUser} />;
      case 'compass':
        return <MagicalCompass users={users} currentUser={currentUser} />;
      case 'creatures':
        return <CreaturesEncounter />;
      case 'time':
        return <TimeTurner />;
      case 'settings':
        return <SettingsPanel currentUser={currentUser} spells={spells} />;
      default:
        return <MagicalMap mode={mapMode} currentUser={currentUser} users={users} spells={spells} onModeChange={setMapMode} onCastSpell={castSpell} />;
    }
  };

  if (!isOnboardingComplete) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-parchment relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="floating-particles absolute inset-0 z-0" />
      
      {/* Hero Image Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Marauder's Map" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-uncial text-2xl md:text-4xl text-accent drop-shadow-lg">
            Marauder's Campus Compass
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-tab whitespace-nowrap ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        <Card className="parchment-bg border-accent/30 min-h-[70vh]">
          {renderContent()}
        </Card>
      </main>

      {/* Footer Magic */}
      <footer className="relative z-10 text-center py-6 text-muted-foreground">
        <p className="font-cinzel text-sm">
          "I solemnly swear I am up to no good" - Team DumbleDorks
        </p>
      </footer>
    </div>
  );
};