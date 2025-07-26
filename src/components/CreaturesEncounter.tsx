import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cat, Bird, Ghost, Heart, Zap, Gift, Sparkles } from 'lucide-react';

interface Creature {
  id: string;
  name: string;
  type: 'cat' | 'owl' | 'ghost' | 'phoenix' | 'house-elf';
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  location: { x: number; y: number };
  interactionCount: number;
  lastSeen: Date;
  isActive: boolean;
  reward?: string;
  mood: 'friendly' | 'neutral' | 'mischievous' | 'sleepy';
}

interface Encounter {
  id: string;
  creature: Creature;
  timestamp: Date;
  interaction: 'pet' | 'feed' | 'talk' | 'follow';
  reward: string;
}

const initialCreatures: Creature[] = [
  {
    id: 'mrs-norris',
    name: 'Mrs. Norris',
    type: 'cat',
    emoji: '🐱',
    rarity: 'uncommon',
    description: 'A watchful cat patrolling the corridors',
    location: { x: 45, y: 65 },
    interactionCount: 0,
    lastSeen: new Date(),
    isActive: true,
    reward: '5 House Points',
    mood: 'mischievous'
  },
  {
    id: 'hedwig',
    name: 'Hedwig',
    type: 'owl',
    emoji: '🦉',
    rarity: 'rare',
    description: 'A wise owl carrying magical messages',
    location: { x: 20, y: 30 },
    interactionCount: 0,
    lastSeen: new Date(),
    isActive: true,
    reward: 'Secret Message',
    mood: 'friendly'
  },
  {
    id: 'peeves',
    name: 'Peeves',
    type: 'ghost',
    emoji: '👻',
    rarity: 'legendary',
    description: 'A mischievous poltergeist causing chaos',
    location: { x: 70, y: 40 },
    interactionCount: 0,
    lastSeen: new Date(),
    isActive: false,
    reward: 'Rare Spell Component',
    mood: 'mischievous'
  },
  {
    id: 'fawkes',
    name: 'Fawkes',
    type: 'phoenix',
    emoji: '🔥',
    rarity: 'legendary',
    description: 'A magnificent phoenix with healing powers',
    location: { x: 50, y: 80 },
    interactionCount: 0,
    lastSeen: new Date(),
    isActive: false,
    reward: 'Phoenix Feather',
    mood: 'neutral'
  },
  {
    id: 'dobby',
    name: 'Dobby',
    type: 'house-elf',
    emoji: '🧝',
    rarity: 'rare',
    description: 'A helpful house-elf eager to assist',
    location: { x: 80, y: 60 },
    interactionCount: 0,
    lastSeen: new Date(),
    isActive: true,
    reward: 'Magical Item',
    mood: 'friendly'
  }
];

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  legendary: 'bg-purple-500'
};

const moodIcons = {
  friendly: '😊',
  neutral: '😐',
  mischievous: '😈',
  sleepy: '😴'
};

export const CreaturesEncounter: React.FC = () => {
  const [creatures, setCreatures] = useState<Creature[]>(initialCreatures);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [interacting, setInteracting] = useState(false);
  const [showReward, setShowReward] = useState<string | null>(null);

  // Randomly activate/deactivate creatures
  useEffect(() => {
    const interval = setInterval(() => {
      setCreatures(prev => prev.map(creature => {
        if (Math.random() < 0.1) { // 10% chance to change status
          return {
            ...creature,
            isActive: !creature.isActive,
            location: {
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10
            },
            mood: ['friendly', 'neutral', 'mischievous', 'sleepy'][Math.floor(Math.random() * 4)] as any
          };
        }
        return creature;
      }));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const interactWithCreature = async (creature: Creature, interactionType: 'pet' | 'feed' | 'talk' | 'follow') => {
    setInteracting(true);
    
    // Simulate interaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newEncounter: Encounter = {
      id: `encounter-${Date.now()}`,
      creature,
      timestamp: new Date(),
      interaction: interactionType,
      reward: creature.reward || 'Magical Experience'
    };

    setEncounters(prev => [newEncounter, ...prev]);
    
    // Update creature stats
    setCreatures(prev => prev.map(c => 
      c.id === creature.id 
        ? { 
            ...c, 
            interactionCount: c.interactionCount + 1,
            lastSeen: new Date(),
            mood: 'friendly' as const
          }
        : c
    ));

    setShowReward(creature.reward || 'Magical Experience');
    setInteracting(false);
    
    // Hide reward after 3 seconds
    setTimeout(() => setShowReward(null), 3000);
  };

  const getCreatureIcon = (type: string) => {
    switch (type) {
      case 'cat': return Cat;
      case 'owl': return Bird;
      case 'ghost': return Ghost;
      default: return Sparkles;
    }
  };

  const activeCreatures = creatures.filter(c => c.isActive);
  const totalEncounters = encounters.length;
  const uniqueCreaturesMet = new Set(encounters.map(e => e.creature.id)).size;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-uncial text-foreground mb-2">Magical Creatures</h1>
        <p className="text-lg font-crimson text-muted-foreground">
          Discover the mystical beings roaming the campus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{activeCreatures.length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Active Creatures</div>
          </div>
        </Card>
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{totalEncounters}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Total Encounters</div>
          </div>
        </Card>
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{uniqueCreaturesMet}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Species Met</div>
          </div>
        </Card>
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{creatures.length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Total Known</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Creatures Map */}
        <div className="lg:col-span-2">
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-4">Creature Locations</h3>
              
              <div className="relative h-96 bg-gradient-parchment rounded-lg border-2 border-accent/30 overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="creature-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#creature-grid)" />
                  </svg>
                </div>

                {/* Active Creatures */}
                {activeCreatures.map((creature) => (
                  <div
                    key={creature.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${creature.location.x}%`, top: `${creature.location.y}%` }}
                    onClick={() => setSelectedCreature(creature)}
                  >
                    <div className={`w-12 h-12 rounded-full border-2 border-accent bg-gradient-gold flex items-center justify-center text-2xl animate-float shadow-glow ${rarityColors[creature.rarity]}/20`}>
                      {creature.emoji}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-cinzel bg-background/90 px-2 py-1 rounded whitespace-nowrap">
                      {creature.name}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-accent/30">
                  <h4 className="font-cinzel font-bold text-sm mb-2">Legend</h4>
                  <div className="space-y-1 text-xs font-crimson">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span>Common</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Rare</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span>Legendary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Creature Info & Interactions */}
        <div className="space-y-4">
          {selectedCreature ? (
            <Card className="spell-card">
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{selectedCreature.emoji}</div>
                  <h3 className="font-uncial text-xl text-foreground">{selectedCreature.name}</h3>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="secondary" className={`${rarityColors[selectedCreature.rarity]} text-white`}>
                      {selectedCreature.rarity}
                    </Badge>
                    <Badge variant="outline" className="font-cinzel">
                      {moodIcons[selectedCreature.mood]} {selectedCreature.mood}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground font-crimson mb-4 text-center">
                  {selectedCreature.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-cinzel">Interactions:</span>
                    <span>{selectedCreature.interactionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-cinzel">Reward:</span>
                    <span className="text-accent">{selectedCreature.reward}</span>
                  </div>
                </div>
                
                {selectedCreature.isActive ? (
                  <div className="space-y-2">
                    <h4 className="font-cinzel font-bold text-sm">Interact:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={() => interactWithCreature(selectedCreature, 'pet')}
                        disabled={interacting}
                        className="btn-magical"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Pet
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => interactWithCreature(selectedCreature, 'feed')}
                        disabled={interacting}
                        className="btn-magical"
                      >
                        <Gift className="w-4 h-4 mr-1" />
                        Feed
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => interactWithCreature(selectedCreature, 'talk')}
                        disabled={interacting}
                        className="btn-magical"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Talk
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => interactWithCreature(selectedCreature, 'follow')}
                        disabled={interacting}
                        className="btn-magical"
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Follow
                      </Button>
                    </div>
                    
                    {interacting && (
                      <div className="text-center">
                        <Progress value={50} className="h-2 mb-2" />
                        <p className="text-sm text-muted-foreground font-cinzel animate-pulse">
                          Interacting with {selectedCreature.name}...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground font-cinzel">
                      This creature is currently not available for interaction
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="spell-card">
              <div className="p-4 text-center">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-cinzel font-bold mb-2">Select a Creature</h3>
                <p className="text-sm text-muted-foreground font-crimson">
                  Click on any creature on the map to interact with them
                </p>
              </div>
            </Card>
          )}

          {/* Recent Encounters */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Recent Encounters</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {encounters.slice(0, 5).map((encounter) => (
                  <div key={encounter.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="text-lg">{encounter.creature.emoji}</span>
                    <div className="flex-1 text-sm">
                      <div className="font-cinzel font-medium">{encounter.interaction} {encounter.creature.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {encounter.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {encounter.reward}
                    </Badge>
                  </div>
                ))}
                
                {encounters.length === 0 && (
                  <p className="text-sm text-muted-foreground font-crimson text-center py-4">
                    No encounters yet. Start interacting with creatures!
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reward Notification */}
      {showReward && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="spell-card border-accent ring-2 ring-accent/50 animate-fade-in">
            <div className="p-4 text-center">
              <Gift className="w-8 h-8 mx-auto text-accent mb-2" />
              <h3 className="font-cinzel font-bold">Reward Received!</h3>
              <p className="text-sm text-muted-foreground font-crimson">{showReward}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};