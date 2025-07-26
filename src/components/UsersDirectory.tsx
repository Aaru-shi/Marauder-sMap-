import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Crown, GraduationCap, Wand2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  magicalName: string;
  house: 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';
  role: 'student' | 'professor' | 'cr';
  location: { x: number; y: number };
  isVisible: boolean;
}

interface UsersDirectoryProps {
  users: User[];
  currentUser: User | null;
}

const houseData = {
  gryffindor: { color: 'bg-red-500', icon: '🦁', name: 'Gryffindor' },
  slytherin: { color: 'bg-green-600', icon: '🐍', name: 'Slytherin' },
  hufflepuff: { color: 'bg-yellow-500', icon: '🦡', name: 'Hufflepuff' },
  ravenclaw: { color: 'bg-blue-600', icon: '🦅', name: 'Ravenclaw' },
};

const roleData = {
  student: { icon: GraduationCap, label: 'Student', emoji: '🎓' },
  professor: { icon: Wand2, label: 'Professor', emoji: '🧙' },
  cr: { icon: Crown, label: 'Class Rep', emoji: '👑' },
};

export const UsersDirectory: React.FC<UsersDirectoryProps> = ({ users, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouse, setSelectedHouse] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.magicalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = selectedHouse === 'all' || user.house === selectedHouse;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesHouse && matchesRole && user.isVisible;
  });

  const houseStats = Object.keys(houseData).map(house => ({
    house,
    count: users.filter(u => u.house === house && u.isVisible).length,
    ...houseData[house as keyof typeof houseData]
  }));

  const roleStats = Object.keys(roleData).map(role => ({
    role,
    count: users.filter(u => u.role === role && u.isVisible).length,
    ...roleData[role as keyof typeof roleData]
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-uncial text-foreground mb-2">Marauder's Directory</h1>
        <p className="text-lg font-crimson text-muted-foreground">
          Find fellow witches and wizards on campus
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{users.filter(u => u.isVisible).length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Total Marauders</div>
          </div>
        </Card>
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{users.filter(u => u.isVisible && u.role === 'student').length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Students</div>
          </div>
        </Card>
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{users.filter(u => u.isVisible && u.role === 'professor').length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Professors</div>
          </div>
        </Card>
        <Card className="spell-card text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-accent">{users.filter(u => u.isVisible && u.role === 'cr').length}</div>
            <div className="text-sm text-muted-foreground font-cinzel">Class Reps</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          {/* Search */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Search Marauders</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-accent/30"
                />
              </div>
            </div>
          </Card>

          {/* House Filter */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Filter by House</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedHouse === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedHouse('all')}
                  className="w-full justify-start"
                >
                  All Houses
                </Button>
                {houseStats.map((house) => (
                  <Button
                    key={house.house}
                    variant={selectedHouse === house.house ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedHouse(house.house)}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span>{house.icon}</span>
                      {house.name}
                    </span>
                    <Badge variant="secondary">{house.count}</Badge>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Role Filter */}
          <Card className="spell-card">
            <div className="p-4">
              <h3 className="font-cinzel font-bold mb-3">Filter by Role</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedRole === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole('all')}
                  className="w-full justify-start"
                >
                  All Roles
                </Button>
                {roleStats.map((role) => (
                  <Button
                    key={role.role}
                    variant={selectedRole === role.role ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRole(role.role)}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span>{role.emoji}</span>
                      {role.label}
                    </span>
                    <Badge variant="secondary">{role.count}</Badge>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Users List */}
        <div className="lg:col-span-3">
          <Card className="spell-card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel font-bold">Marauders Found: {filteredUsers.length}</h3>
                <Users className="w-5 h-5 text-accent" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                {filteredUsers.map((user) => {
                  const house = houseData[user.house];
                  const role = roleData[user.role];
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <Card
                      key={user.id}
                      className={`spell-card cursor-pointer transition-all duration-300 ${
                        isCurrentUser ? 'border-accent ring-2 ring-accent/50' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full ${house.color} flex items-center justify-center text-white text-lg`}>
                            {house.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-cinzel font-bold truncate">
                              {user.magicalName}
                              {isCurrentUser && <span className="text-accent ml-2">(You)</span>}
                            </h4>
                            <p className="text-sm text-muted-foreground font-crimson truncate">
                              {user.name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-cinzel">
                            {house.name}
                          </Badge>
                          <Badge variant="outline" className="font-cinzel">
                            {role.emoji} {role.label}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground font-crimson">
                          Location: Campus Grounds
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-cinzel text-muted-foreground">
                    No marauders found
                  </p>
                  <p className="text-sm text-muted-foreground font-crimson">
                    Try adjusting your search filters
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="spell-card max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full ${houseData[selectedUser.house].color} flex items-center justify-center text-white text-2xl`}>
                  {houseData[selectedUser.house].icon}
                </div>
                <div>
                  <h2 className="text-xl font-uncial text-foreground">{selectedUser.magicalName}</h2>
                  <p className="text-muted-foreground font-crimson">{selectedUser.name}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-cinzel font-bold text-sm mb-1">House</h3>
                    <Badge variant="secondary" className="font-cinzel">
                      {houseData[selectedUser.house].name}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-sm mb-1">Role</h3>
                    <Badge variant="outline" className="font-cinzel">
                      {roleData[selectedUser.role].emoji} {roleData[selectedUser.role].label}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-cinzel font-bold text-sm mb-2">Status</h3>
                  <p className="text-sm text-muted-foreground font-crimson">
                    Currently visible on the Marauder's Map
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {selectedUser.id !== currentUser?.id && (
                    <Button className="btn-magical flex-1">
                      Send Message
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
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