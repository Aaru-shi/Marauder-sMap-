import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Zap, Eye, EyeOff } from 'lucide-react';

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
  isActive: boolean;
}

interface MagicalMapProps {
  mode: 'daily' | 'hackathon' | 'orientation' | 'fest';
  currentUser: User | null;
  users: User[];
  spells: Spell[];
  onModeChange: (mode: 'daily' | 'hackathon' | 'orientation' | 'fest') => void;
  onCastSpell: (spellId: string, targetUserId?: string) => void;
}

const mapModes = [
  { id: 'daily', label: 'Daily Campus', icon: Calendar, description: 'Normal campus with students & professors' },
  { id: 'hackathon', label: 'Hackathon', icon: Zap, description: 'Tech zones, coding booths & project areas' },
  { id: 'orientation', label: 'Orientation', icon: Users, description: 'Welcome booths & student help desks' },
  { id: 'fest', label: 'Fest Mode', icon: MapPin, description: 'Event stages, food courts & activities' },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'professor': return '🧙';
    case 'cr': return '👑';
    default: return '🎓';
  }
};

const getHouseColor = (house: string) => {
  switch (house) {
    case 'gryffindor': return 'bg-red-500';
    case 'slytherin': return 'bg-green-600';
    case 'hufflepuff': return 'bg-yellow-500';
    case 'ravenclaw': return 'bg-blue-600';
    default: return 'bg-gray-500';
  }
};

export const MagicalMap: React.FC<MagicalMapProps> = ({
  mode,
  currentUser,
  users,
  spells,
  onModeChange,
  onCastSpell
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mapBackground, setMapBackground] = useState('daily');
  
  const evanescoSpell = spells.find(s => s.id === 'evanesco');
  const lumosSpell = spells.find(s => s.id === 'lumos');

  useEffect(() => {
    setMapBackground(mode);
  }, [mode]);

  const visibleUsers = users.filter(user => user.isVisible || user.id === currentUser?.id);

  const getMapLayout = () => {
    switch (mode) {
      case 'hackathon':
        return {
          title: 'Tech Zone Map',
          landmarks: [
            { name: 'Coding Stations', x: 20, y: 30 },
            { name: 'Demo Area', x: 70, y: 20 },
            { name: 'Mentor Zone', x: 50, y: 70 },
            { name: 'Food Court', x: 80, y: 80 }
          ]
        };
      case 'orientation':
        return {
          title: 'Welcome Campus',
          landmarks: [
            { name: 'Registration', x: 50, y: 20 },
            { name: 'Student Help', x: 30, y: 50 },
            { name: 'Library Tour', x: 70, y: 60 },
            { name: 'Cafe Meet', x: 40, y: 80 }
          ]
        };
      case 'fest':
        return {
          title: 'Festival Grounds',
          landmarks: [
            { name: 'Main Stage', x: 50, y: 30 },
            { name: 'Food Stalls', x: 80, y: 70 },
            { name: 'Game Zone', x: 20, y: 60 },
            { name: 'Art Gallery', x: 60, y: 80 }
          ]
        };
      default:
        return {
          title: 'Daily Campus',
          landmarks: [
            { name: 'Library', x: 30, y: 40 },
            { name: 'Cafeteria', x: 70, y: 30 },
            { name: 'Main Building', x: 50, y: 60 },
            { name: 'Sports Complex', x: 80, y: 70 }
          ]
        };
    }
  };

  const mapLayout = getMapLayout();

  return (
    <div className="p-6 space-y-6">
      {/* Map Mode Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mapModes.map((mapMode) => {
          const Icon = mapMode.icon;
          return (
            <Button
              key={mapMode.id}
              variant={mode === mapMode.id ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange(mapMode.id as any)}
              className={mode === mapMode.id ? "btn-magical" : ""}
            >
              <Icon className="w-4 h-4 mr-2" />
              {mapMode.label}
            </Button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="map-container h-[500px] relative">
            {/* Map Title */}
            <div className="absolute top-4 left-4 right-4 z-20">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-accent/30">
                <h3 className="font-cinzel text-lg font-bold text-foreground">
                  {mapLayout.title}
                </h3>
                <p className="text-sm text-muted-foreground font-crimson">
                  {mapModes.find(m => m.id === mode)?.description}
                </p>
              </div>
            </div>

            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-primary/10" />
              {/* Grid Pattern */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Landmarks */}
            {mapLayout.landmarks.map((landmark, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
              >
                <div className="bg-muted/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-border text-xs font-cinzel whitespace-nowrap">
                  {landmark.name}
                </div>
              </div>
            ))}

            {/* Current User Location */}
            {currentUser && currentUser.isVisible && (
              <div
                className={`user-pin absolute transform -translate-x-1/2 -translate-y-1/2 z-20 ${getHouseColor(currentUser.house)} ${lumosSpell?.isActive ? 'animate-pulse-glow' : ''}`}
                style={{ left: `${currentUser.location.x}%`, top: `${currentUser.location.y}%` }}
                title={`You (${currentUser.magicalName})`}
              >
                ⭐
              </div>
            )}

            {/* Other Users */}
            {visibleUsers.map((user) => (
              user.id !== currentUser?.id && (
                <div
                  key={user.id}
                  className={`user-pin absolute transform -translate-x-1/2 -translate-y-1/2 z-15 ${getHouseColor(user.house)} cursor-pointer`}
                  style={{ left: `${user.location.x}%`, top: `${user.location.y}%` }}
                  onClick={() => setSelectedUser(user)}
                  title={`${user.magicalName} (${user.name})`}
                >
                  {getRoleIcon(user.role)}
                </div>
              )
            ))}

            {/* Magical Effects */}
            {lumosSpell?.isActive && currentUser && (
              <div
                className="absolute rounded-full border-2 border-accent animate-ping"
                style={{
                  left: `${currentUser.location.x}%`,
                  top: `${currentUser.location.y}%`,
                  width: '60px',
                  height: '60px',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, hsl(var(--accent) / 0.3), transparent)'
                }}
              />
            )}
          </Card>

          {/* Quick Spell Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={evanescoSpell?.isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onCastSpell('evanesco')}
              className={evanescoSpell?.isActive ? "btn-magical" : ""}
            >
              {evanescoSpell?.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="ml-2">Evanesco</span>
            </Button>
            <Button
              variant={lumosSpell?.isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onCastSpell('lumos')}
              className={lumosSpell?.isActive ? "btn-magical" : ""}
            >
              <Zap className="w-4 h-4 mr-2" />
              Lumos
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* User Info */}
          {currentUser && (
            <Card className="spell-card">
              <div className="p-4">
                <h3 className="font-cinzel font-bold mb-2">Your Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getHouseColor(currentUser.house)}`} />
                    <span className="font-crimson">{currentUser.magicalName}</span>
                  </div>
                  <Badge variant="secondary" className="font-cinzel">
                    {currentUser.house} {getRoleIcon(currentUser.role)}
                  </Badge>
                  <div className="text-sm text-muted-foreground font-crimson">
                    Status: {currentUser.isVisible ? 'Visible on map' : 'Hidden (Evanesco active)'}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Nearby Marauders */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Nearby Marauders</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {visibleUsers.slice(0, 5).map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className={`w-3 h-3 rounded-full ${getHouseColor(user.house)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-crimson font-medium truncate">
                        {user.magicalName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getRoleIcon(user.role)} {user.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Map Legend */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Legend</h3>
              <div className="space-y-2 text-sm font-crimson">
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span>Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎓</span>
                  <span>Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👑</span>
                  <span>Class Representatives</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🧙</span>
                  <span>Professors</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Selected User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="spell-card max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full ${getHouseColor(selectedUser.house)} flex items-center justify-center text-white font-bold`}>
                  {getRoleIcon(selectedUser.role)}
                </div>
                <div>
                  <h3 className="font-cinzel font-bold">{selectedUser.magicalName}</h3>
                  <p className="text-sm text-muted-foreground font-crimson">{selectedUser.name}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Badge variant="secondary" className="font-cinzel">
                  {selectedUser.house} House
                </Badge>
                <Badge variant="outline" className="font-cinzel">
                  {selectedUser.role}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onCastSpell('summon', selectedUser.id)}
                  className="btn-magical"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Summon
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
