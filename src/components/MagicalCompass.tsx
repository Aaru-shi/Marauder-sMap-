import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Compass, Navigation, MapPin, Zap, Route } from 'lucide-react';

interface User {
  id: string;
  name: string;
  magicalName: string;
  house: 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';
  role: 'student' | 'professor' | 'cr';
  location: { x: number; y: number };
  isVisible: boolean;
}

interface Destination {
  id: string;
  name: string;
  category: 'landmark' | 'user' | 'event';
  location: { x: number; y: number };
  description?: string;
}

interface MagicalCompassProps {
  users: User[];
  currentUser: User | null;
}

const campusLandmarks: Destination[] = [
  { id: 'library', name: 'Ancient Library', category: 'landmark', location: { x: 30, y: 40 }, description: 'Repository of magical knowledge' },
  { id: 'cafeteria', name: 'Great Hall Cafeteria', category: 'landmark', location: { x: 70, y: 30 }, description: 'Where marauders gather for sustenance' },
  { id: 'main-building', name: 'Main Academic Tower', category: 'landmark', location: { x: 50, y: 60 }, description: 'Center of learning and wisdom' },
  { id: 'sports', name: 'Quidditch Sports Complex', category: 'landmark', location: { x: 80, y: 70 }, description: 'Training grounds for athletic prowess' },
  { id: 'dorms', name: 'Student Dormitories', category: 'landmark', location: { x: 20, y: 80 }, description: 'Where marauders rest and plot' },
  { id: 'admin', name: 'Administrative Castle', category: 'landmark', location: { x: 60, y: 20 }, description: 'Seat of campus governance' },
];

export const MagicalCompass: React.FC<MagicalCompassProps> = ({ users, currentUser }) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [customDestination, setCustomDestination] = useState('');
  const [pathActive, setPathActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Convert users to destinations
  const userDestinations: Destination[] = users
    .filter(user => user.isVisible && user.id !== currentUser?.id)
    .map(user => ({
      id: user.id,
      name: user.magicalName,
      category: 'user' as const,
      location: user.location,
      description: `${user.role} from ${user.house} house`
    }));

  const allDestinations = [...campusLandmarks, ...userDestinations];

  const filteredDestinations = allDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateDistance = (dest: Destination) => {
    if (!currentUser) return 0;
    const dx = dest.location.x - currentUser.location.x;
    const dy = dest.location.y - currentUser.location.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateDirection = (dest: Destination) => {
    if (!currentUser) return 0;
    const dx = dest.location.x - currentUser.location.x;
    const dy = dest.location.y - currentUser.location.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const getDirectionText = (angle: number) => {
    const normalizedAngle = ((angle + 360) % 360);
    if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'East';
    if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'Southeast';
    if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'South';
    if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'Southwest';
    if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'West';
    if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'Northwest';
    if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'North';
    return 'Northeast';
  };

  const activateMagicalPath = (destination: Destination) => {
    setSelectedDestination(destination);
    setPathActive(true);
    setTimeout(() => setPathActive(false), 5000); // Path expires after 5 seconds
  };

  const categories = [
    { id: 'all', label: 'All Destinations', icon: MapPin },
    { id: 'landmark', label: 'Landmarks', icon: MapPin },
    { id: 'user', label: 'Marauders', icon: Navigation },
    { id: 'event', label: 'Events', icon: Zap },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-uncial text-foreground mb-2">Magical Compass</h1>
        <p className="text-lg font-crimson text-muted-foreground">
          Navigate the mystical pathways of campus
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compass & Navigation */}
        <div className="space-y-4">
          {/* Active Path */}
          {selectedDestination && (
            <Card className={`spell-card ${pathActive ? 'border-accent ring-2 ring-accent/50' : ''}`}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Route className={`w-5 h-5 text-accent ${pathActive ? 'animate-pulse-glow' : ''}`} />
                  <h3 className="font-cinzel font-bold">Active Path</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="font-cinzel font-medium">{selectedDestination.name}</div>
                    <div className="text-sm text-muted-foreground font-crimson">
                      {selectedDestination.description}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <div className="font-bold text-accent">
                        {calculateDistance(selectedDestination).toFixed(0)}
                      </div>
                      <div className="text-xs text-muted-foreground font-cinzel">Distance</div>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <div className="font-bold text-accent">
                        {getDirectionText(calculateDirection(selectedDestination))}
                      </div>
                      <div className="text-xs text-muted-foreground font-cinzel">Direction</div>
                    </div>
                  </div>
                  
                  {pathActive && (
                    <div className="text-center">
                      <div className="text-accent font-cinzel text-sm animate-pulse">
                        ✨ Magical path is active ✨
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Compass Dial */}
          <Card className="spell-card">
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="font-cinzel font-bold">Marauder's Compass</h3>
              </div>
              
              <div className="relative w-48 h-48 mx-auto">
                {/* Compass Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-accent bg-gradient-gold/20">
                  {/* Compass Rose */}
                  <div className="absolute inset-4 rounded-full border-2 border-accent/50">
                    {/* Direction Labels */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-cinzel font-bold">N</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-cinzel font-bold">S</div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-cinzel font-bold">W</div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-cinzel font-bold">E</div>
                  </div>
                  
                  {/* Compass Needle */}
                  {selectedDestination && (
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-bottom"
                      style={{ 
                        transform: `translate(-50%, -50%) rotate(${calculateDirection(selectedDestination)}deg)`,
                        transition: 'transform 0.5s ease-in-out'
                      }}
                    >
                      <div className="w-1 bg-accent h-16 rounded-full shadow-glow" />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-accent rounded-full" />
                    </div>
                  )}
                  
                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full" />
                </div>
              </div>
              
              {!selectedDestination && (
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground font-crimson">
                    Select a destination to activate the compass
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Quick Navigation</h3>
              <div className="space-y-2">
                <Label htmlFor="custom-dest" className="font-cinzel text-sm">
                  Set Custom Destination
                </Label>
                <Input
                  id="custom-dest"
                  placeholder="Enter location name..."
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  className="bg-background/50 border-accent/30"
                />
                <Button 
                  size="sm" 
                  className="w-full btn-magical"
                  disabled={!customDestination.trim()}
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Find Path
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Destinations List */}
        <div className="lg:col-span-2">
          <Card className="spell-card">
            <div className="p-4">
              {/* Search & Filters */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="search" className="font-cinzel">Search Destinations</Label>
                  <Input
                    id="search"
                    placeholder="Search locations and marauders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-background/50 border-accent/30"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id ? "btn-magical" : ""}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Destinations Grid */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                <h3 className="font-cinzel font-bold mb-3">
                  Available Destinations ({filteredDestinations.length})
                </h3>
                
                {filteredDestinations.map((destination) => {
                  const distance = calculateDistance(destination);
                  const direction = getDirectionText(calculateDirection(destination));
                  
                  return (
                    <Card
                      key={destination.id}
                      className={`spell-card cursor-pointer transition-all duration-300 ${
                        selectedDestination?.id === destination.id ? 'border-accent ring-2 ring-accent/50' : ''
                      }`}
                      onClick={() => activateMagicalPath(destination)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-cinzel font-bold">{destination.name}</h4>
                              <Badge variant="secondary" className="font-cinzel text-xs">
                                {destination.category}
                              </Badge>
                            </div>
                            {destination.description && (
                              <p className="text-sm text-muted-foreground font-crimson mb-2">
                                {destination.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="font-cinzel">
                                📍 {distance.toFixed(0)} units away
                              </span>
                              <span className="font-cinzel">
                                🧭 {direction}
                              </span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant={selectedDestination?.id === destination.id ? "default" : "outline"}
                            className={selectedDestination?.id === destination.id ? "btn-magical" : ""}
                          >
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                
                {filteredDestinations.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-cinzel text-muted-foreground">
                      No destinations found
                    </p>
                    <p className="text-sm text-muted-foreground font-crimson">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};