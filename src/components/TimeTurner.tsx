import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Clock, RotateCcw, Sunrise, Sun, Sunset, Moon, Calendar, History } from 'lucide-react';

interface TimeEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'academic' | 'social' | 'magical' | 'system';
  location?: string;
  participants?: string[];
}

interface TimeState {
  currentHour: number;
  selectedDate: Date;
  timeScale: 'hour' | 'day' | 'week';
  isTimeActive: boolean;
}

const sampleEvents: TimeEvent[] = [
  {
    id: '1',
    title: 'Potions Class',
    description: 'Advanced Brewing Techniques with Professor Snape',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: 'academic',
    location: 'Dungeons',
    participants: ['Hermione Granger', 'Harry Potter']
  },
  {
    id: '2',
    title: 'Marauder Spotted',
    description: 'Student seen near the Forbidden Library',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    type: 'magical',
    location: 'Library Wing'
  },
  {
    id: '3',
    title: 'Hackathon Begins',
    description: 'Annual coding competition starts',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    type: 'social',
    location: 'Tech Zone',
    participants: ['Team DumbleDorks', 'Code Wizards']
  },
  {
    id: '4',
    title: 'Spell Cast: Lumos',
    description: 'User activated illumination spell',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    type: 'system',
    participants: ['Current User']
  },
  {
    id: '5',
    title: 'Study Group',
    description: 'Defense Against Dark Arts study session',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    type: 'academic',
    location: 'Common Room',
    participants: ['Multiple Students']
  }
];

export const TimeTurner: React.FC = () => {
  const [timeState, setTimeState] = useState<TimeState>({
    currentHour: new Date().getHours(),
    selectedDate: new Date(),
    timeScale: 'hour',
    isTimeActive: false
  });
  
  const [events] = useState<TimeEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<TimeEvent | null>(null);
  const [turnerRotation, setTurnerRotation] = useState(0);

  const timeOfDayIcon = (hour: number) => {
    if (hour >= 6 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 18) return Sun;
    if (hour >= 18 && hour < 22) return Sunset;
    return Moon;
  };

  const timeOfDayLabel = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour < 22) return 'Evening';
    return 'Night';
  };

  const getTimeOfDayColor = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'text-yellow-500'; // Morning
    if (hour >= 12 && hour < 18) return 'text-orange-500'; // Afternoon
    if (hour >= 18 && hour < 22) return 'text-purple-500'; // Evening
    return 'text-blue-500'; // Night
  };

  const activateTimeTurner = (targetHour: number) => {
    setTimeState(prev => ({ ...prev, isTimeActive: true }));
    setTurnerRotation(prev => prev + 360);
    
    // Animate time change
    setTimeout(() => {
      setTimeState(prev => ({ 
        ...prev, 
        currentHour: targetHour,
        isTimeActive: false 
      }));
    }, 2000);
  };

  const getEventsForTime = (hour: number) => {
    const hourStart = new Date();
    hourStart.setHours(hour, 0, 0, 0);
    const hourEnd = new Date();
    hourEnd.setHours(hour + 1, 0, 0, 0);
    
    return events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= hourStart && eventTime < hourEnd;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-500';
      case 'social': return 'bg-green-500';
      case 'magical': return 'bg-purple-500';
      case 'system': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return '📚';
      case 'social': return '👥';
      case 'magical': return '✨';
      case 'system': return '⚙️';
      default: return '📅';
    }
  };

  const currentEvents = getEventsForTime(timeState.currentHour);
  const TimeIcon = timeOfDayIcon(timeState.currentHour);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-uncial text-foreground mb-2">Time-Turner</h1>
        <p className="text-lg font-crimson text-muted-foreground">
          Navigate through the temporal streams of campus events
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Time Turner Control */}
        <div className="space-y-4">
          <Card className="spell-card">
            <div className="p-6">
              <div className="text-center mb-6">
                <div 
                  className={`relative w-32 h-32 mx-auto mb-4 transition-transform duration-2000 ${timeState.isTimeActive ? 'animate-spin' : ''}`}
                  style={{ transform: `rotate(${turnerRotation}deg)` }}
                >
                  {/* Time Turner Design */}
                  <div className="absolute inset-0 rounded-full border-4 border-accent bg-gradient-gold/20">
                    <div className="absolute inset-2 rounded-full border-2 border-accent/50">
                      <div className="absolute inset-2 rounded-full border border-accent/30 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Rotating outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-accent animate-spin" style={{ animationDuration: '10s' }}>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full" />
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full" />
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full" />
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full" />
                  </div>
                </div>
                
                <h3 className="font-uncial text-xl text-foreground">Time Turner</h3>
                <p className="text-sm text-muted-foreground font-crimson">
                  "Turning time is not a game"
                </p>
              </div>

              {/* Current Time Display */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TimeIcon className={`w-6 h-6 ${getTimeOfDayColor(timeState.currentHour)}`} />
                  <span className="text-2xl font-bold font-cinzel">
                    {timeState.currentHour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-crimson">
                  {timeOfDayLabel(timeState.currentHour)}
                </p>
              </div>

              {/* Time Slider */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-cinzel mb-2">
                    <span>00:00</span>
                    <span>23:59</span>
                  </div>
                  <Slider
                    value={[timeState.currentHour]}
                    onValueChange={([value]) => setTimeState(prev => ({ ...prev, currentHour: value }))}
                    max={23}
                    min={0}
                    step={1}
                    className="mb-4"
                  />
                </div>

                <Button
                  onClick={() => activateTimeTurner(timeState.currentHour)}
                  disabled={timeState.isTimeActive}
                  className="w-full btn-magical"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {timeState.isTimeActive ? 'Turning Time...' : 'Activate Time Turner'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Time Jumps */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Quick Jumps</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => activateTimeTurner(8)}
                  className="font-cinzel"
                >
                  <Sunrise className="w-4 h-4 mr-1" />
                  Morning
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => activateTimeTurner(12)}
                  className="font-cinzel"
                >
                  <Sun className="w-4 h-4 mr-1" />
                  Noon
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => activateTimeTurner(18)}
                  className="font-cinzel"
                >
                  <Sunset className="w-4 h-4 mr-1" />
                  Evening
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => activateTimeTurner(0)}
                  className="font-cinzel"
                >
                  <Moon className="w-4 h-4 mr-1" />
                  Midnight
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline & Events */}
        <div className="lg:col-span-2">
          <Card className="spell-card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel font-bold">
                  Events at {timeState.currentHour.toString().padStart(2, '0')}:00
                </h3>
                <Badge variant="secondary" className="font-cinzel">
                  {currentEvents.length} events
                </Badge>
              </div>

              {/* Event Timeline */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {currentEvents.length > 0 ? (
                  currentEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="spell-card cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-cinzel font-bold">{event.title}</h4>
                              <Badge 
                                variant="secondary" 
                                className={`${getEventTypeColor(event.type)} text-white text-xs`}
                              >
                                {event.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-crimson mb-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-cinzel">
                              {event.location && (
                                <span>📍 {event.location}</span>
                              )}
                              <span>⏰ {new Date(event.timestamp).toLocaleTimeString()}</span>
                              {event.participants && (
                                <span>👥 {event.participants.length} participants</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-cinzel text-muted-foreground">
                      No events at this time
                    </p>
                    <p className="text-sm text-muted-foreground font-crimson">
                      Try turning the Time Turner to explore other moments
                    </p>
                  </div>
                )}
              </div>

              {/* Daily Overview */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="font-cinzel font-bold mb-3">Daily Activity Overview</h4>
                <div className="grid grid-cols-24 gap-1 h-8">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const hourEvents = getEventsForTime(hour);
                    const isCurrentHour = hour === timeState.currentHour;
                    
                    return (
                      <div
                        key={hour}
                        className={`rounded cursor-pointer transition-all duration-200 ${
                          isCurrentHour 
                            ? 'bg-accent ring-2 ring-accent/50' 
                            : hourEvents.length > 0 
                              ? 'bg-accent/60 hover:bg-accent/80' 
                              : 'bg-muted hover:bg-muted-foreground/20'
                        }`}
                        onClick={() => activateTimeTurner(hour)}
                        title={`${hour}:00 - ${hourEvents.length} events`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-cinzel mt-1">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>23:59</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="spell-card max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{getEventTypeIcon(selectedEvent.type)}</div>
                <div>
                  <h2 className="text-xl font-uncial text-foreground">{selectedEvent.title}</h2>
                  <Badge 
                    variant="secondary" 
                    className={`${getEventTypeColor(selectedEvent.type)} text-white mt-1`}
                  >
                    {selectedEvent.type}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-cinzel font-bold text-sm mb-1">Description</h3>
                  <p className="text-muted-foreground font-crimson">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-cinzel font-bold text-sm mb-1">Time</h3>
                    <p className="text-sm font-crimson">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <h3 className="font-cinzel font-bold text-sm mb-1">Location</h3>
                      <p className="text-sm font-crimson">{selectedEvent.location}</p>
                    </div>
                  )}
                </div>
                
                {selectedEvent.participants && (
                  <div>
                    <h3 className="font-cinzel font-bold text-sm mb-1">Participants</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.participants.map((participant, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                  className="w-full"
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