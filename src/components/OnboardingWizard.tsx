import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles, Crown, Heart } from 'lucide-react';

interface User {
  name: string;
  magicalName: string;
  house: 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';
}

interface OnboardingWizardProps {
  onComplete: (userData: User) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<Partial<User>>({});

  const houses = [
    { 
      id: 'gryffindor', 
      name: 'Gryffindor', 
      description: 'Brave, daring, nerve, and chivalry',
      icon: '🦁',
      colors: 'text-red-600 border-red-600'
    },
    { 
      id: 'slytherin', 
      name: 'Slytherin', 
      description: 'Ambitious, cunning, leadership, and resourcefulness',
      icon: '🐍',
      colors: 'text-green-600 border-green-600'
    },
    { 
      id: 'hufflepuff', 
      name: 'Hufflepuff', 
      description: 'Hard work, patience, loyalty, and fair play',
      icon: '🦡',
      colors: 'text-yellow-600 border-yellow-600'
    },
    { 
      id: 'ravenclaw', 
      name: 'Ravenclaw', 
      description: 'Intelligence, wit, learning, and wisdom',
      icon: '🦅',
      colors: 'text-blue-600 border-blue-600'
    }
  ];

  const steps = [
    {
      title: 'Welcome to Hogwarts',
      subtitle: 'Enter your credentials to access the Marauder\'s Map',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Wand2 className="w-16 h-16 mx-auto text-accent mb-4 animate-float" />
            <p className="text-lg font-cinzel text-muted-foreground">
              Speak friend, and enter
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-cinzel">Your Real Name</Label>
              <Input
                id="name"
                placeholder="e.g., Harry Potter"
                value={userData.name || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background/50 border-accent/30"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Choose Your Magical Identity',
      subtitle: 'Every marauder needs a secret name',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto text-accent mb-4 animate-pulse-glow" />
          </div>
          <div>
            <Label htmlFor="magicalName" className="font-cinzel">Your Magical Name</Label>
            <Input
              id="magicalName"
              placeholder="e.g., Prongs, Padfoot, Moony..."
              value={userData.magicalName || ''}
              onChange={(e) => setUserData(prev => ({ ...prev, magicalName: e.target.value }))}
              className="bg-background/50 border-accent/30"
            />
            <p className="text-sm text-muted-foreground mt-2 font-crimson">
              This is how you'll appear on the map to other marauders
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'The Sorting Hat Awaits',
      subtitle: 'Choose your house or let magic decide',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Crown className="w-16 h-16 mx-auto text-accent mb-4 animate-shimmer" />
            <Button
              variant="outline"
              onClick={() => {
                const randomHouse = houses[Math.floor(Math.random() * houses.length)];
                setUserData(prev => ({ ...prev, house: randomHouse.id as any }));
              }}
              className="btn-magical mb-6"
            >
              🎩 Let the Sorting Hat Decide
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {houses.map((house) => (
              <Card
                key={house.id}
                className={`spell-card cursor-pointer transition-all duration-300 ${
                  userData.house === house.id ? `border-2 ${house.colors} bg-gradient-gold/20` : ''
                }`}
                onClick={() => setUserData(prev => ({ ...prev, house: house.id as any }))}
              >
                <div className="p-4 text-center">
                  <div className="text-4xl mb-2">{house.icon}</div>
                  <h3 className={`font-cinzel font-bold ${house.colors.split(' ')[0]}`}>
                    {house.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 font-crimson">
                    {house.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'You Are Now a Marauder',
      subtitle: 'Welcome to the magical world of campus navigation',
      content: (
        <div className="space-y-6 text-center">
          <Heart className="w-16 h-16 mx-auto text-accent mb-4 animate-spell-cast" />
          <div className="space-y-4">
            <p className="text-xl font-cinzel text-accent">
              Welcome, {userData.magicalName}!
            </p>
            <p className="font-crimson text-muted-foreground">
              You have been sorted into <span className="font-bold text-foreground">{userData.house}</span>
            </p>
            <div className="bg-muted/50 rounded-lg p-4 border-accent/30 border">
              <p className="font-cinzel text-sm mb-2">Marauder's Oath:</p>
              <p className="font-crimson italic">
                "I solemnly swear I am up to no good... but only the fun kind of mischief that helps fellow students navigate campus life!"
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const canProceed = () => {
    switch (step) {
      case 0: return userData.name;
      case 1: return userData.magicalName;
      case 2: return userData.house;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(userData as User);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-parchment flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="floating-particles absolute inset-0 z-0" />
      
      <Card className="w-full max-w-2xl parchment-bg border-accent/30 relative z-10">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-cinzel text-muted-foreground">
                Step {step + 1} of {steps.length}
              </span>
              <span className="text-sm font-cinzel text-muted-foreground">
                {Math.round(((step + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-gold h-2 rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-uncial text-foreground mb-2">
                {currentStep.title}
              </h1>
              <p className="text-lg font-crimson text-muted-foreground">
                {currentStep.subtitle}
              </p>
            </div>

            {currentStep.content}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="font-cinzel"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-magical font-cinzel"
              >
                {step === steps.length - 1 ? 'Begin Your Journey' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};