import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wand2, Eye, EyeOff, Zap, Shield, Sparkles, Clock } from 'lucide-react';

interface Spell {
  id: string;
  name: string;
  description: string;
  effect: string;
  isActive: boolean;
  cooldown: number;
  usageCount: number;
}

interface SpellsGrimoireProps {
  spells: Spell[];
  onCastSpell: (spellId: string) => void;
}

const spellIcons = {
  evanesco: EyeOff,
  summon: Zap,
  lumos: Sparkles,
  protego: Shield,
};

const spellRarities = {
  evanesco: { rarity: 'Common', color: 'bg-gray-500' },
  summon: { rarity: 'Uncommon', color: 'bg-blue-500' },
  lumos: { rarity: 'Rare', color: 'bg-purple-500' },
  protego: { rarity: 'Epic', color: 'bg-yellow-500' },
};

export const SpellsGrimoire: React.FC<SpellsGrimoireProps> = ({ spells, onCastSpell }) => {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [castingSpell, setCastingSpell] = useState<string | null>(null);

  const handleCastSpell = async (spellId: string) => {
    setCastingSpell(spellId);
    onCastSpell(spellId);
    
    // Simulate casting animation
    setTimeout(() => {
      setCastingSpell(null);
    }, 1000);
  };

  const getSpellIcon = (spellId: string) => {
    const Icon = spellIcons[spellId as keyof typeof spellIcons] || Wand2;
    return Icon;
  };

  const getSpellRarity = (spellId: string) => {
    return spellRarities[spellId as keyof typeof spellRarities] || { rarity: 'Common', color: 'bg-gray-500' };
  };

  const totalSpellsCast = spells.reduce((total, spell) => total + spell.usageCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-uncial text-foreground mb-2">Spellbook Grimoire</h1>
        <p className="text-lg font-crimson text-muted-foreground">
          Ancient magics to aid your journey
        </p>
        
        {/* Spell Statistics */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{spells.length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Spells Known</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{totalSpellsCast}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Times Cast</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {spells.filter(s => s.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground font-cinzel">Active</div>
          </div>
        </div>
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spells.map((spell) => {
          const Icon = getSpellIcon(spell.id);
          const rarity = getSpellRarity(spell.id);
          const isCasting = castingSpell === spell.id;
          
          return (
            <Card 
              key={spell.id} 
              className={`spell-card cursor-pointer transition-all duration-300 relative overflow-hidden ${
                spell.isActive ? 'border-accent ring-2 ring-accent/50' : ''
              } ${isCasting ? 'animate-spell-cast' : ''}`}
              onClick={() => setSelectedSpell(spell)}
            >
              {/* Rarity Indicator */}
              <div className={`absolute top-0 right-0 ${rarity.color} text-white px-2 py-1 text-xs font-bold`}>
                {rarity.rarity}
              </div>
              
              {/* Spell Status Glow */}
              {spell.isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent pointer-events-none" />
              )}
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full bg-gradient-gold flex items-center justify-center ${
                    isCasting ? 'animate-spin' : ''
                  }`}>
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-cinzel font-bold text-lg">{spell.name}</h3>
                      {spell.isActive && (
                        <Badge variant="default" className="bg-gradient-emerald">
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground font-crimson mb-3">
                      {spell.description}
                    </p>
                    
                    <div className="text-xs text-accent font-cinzel italic mb-4">
                      "{spell.effect}"
                    </div>
                    
                    {/* Spell Stats */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                      <span className="font-cinzel">Used: {spell.usageCount} times</span>
                      {spell.cooldown > 0 && (
                        <span className="flex items-center gap-1 font-cinzel">
                          <Clock className="w-3 h-3" />
                          Cooldown: {spell.cooldown}s
                        </span>
                      )}
                    </div>
                    
                    {/* Cooldown Progress */}
                    {spell.cooldown > 0 && (
                      <div className="mb-4">
                        <Progress value={(spell.cooldown / 30) * 100} className="h-2" />
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCastSpell(spell.id);
                      }}
                      disabled={spell.cooldown > 0 || isCasting}
                      className={`w-full ${spell.isActive ? 'btn-magical' : ''}`}
                      variant={spell.isActive ? "default" : "outline"}
                    >
                      {isCasting ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                          Casting...
                        </>
                      ) : spell.isActive ? (
                        'Deactivate Spell'
                      ) : spell.cooldown > 0 ? (
                        `Cooldown: ${spell.cooldown}s`
                      ) : (
                        'Cast Spell'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Spell Details Modal */}
      {selectedSpell && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="spell-card max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-full bg-gradient-gold">
                  {React.createElement(getSpellIcon(selectedSpell.id), { 
                    className: "w-8 h-8 text-accent-foreground" 
                  })}
                </div>
                <div>
                  <h2 className="text-2xl font-uncial text-foreground">{selectedSpell.name}</h2>
                  <Badge variant="secondary" className="font-cinzel mt-1">
                    {getSpellRarity(selectedSpell.id).rarity} Spell
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-cinzel font-bold text-sm mb-2">Description</h3>
                  <p className="text-muted-foreground font-crimson">{selectedSpell.description}</p>
                </div>
                
                <div>
                  <h3 className="font-cinzel font-bold text-sm mb-2">Magical Effect</h3>
                  <p className="text-accent font-crimson italic">"{selectedSpell.effect}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{selectedSpell.usageCount}</div>
                    <div className="text-xs text-muted-foreground font-cinzel">Times Cast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {selectedSpell.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs text-muted-foreground font-cinzel">Status</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleCastSpell(selectedSpell.id);
                      setSelectedSpell(null);
                    }}
                    disabled={selectedSpell.cooldown > 0}
                    className="btn-magical flex-1"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Cast {selectedSpell.name}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSpell(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};