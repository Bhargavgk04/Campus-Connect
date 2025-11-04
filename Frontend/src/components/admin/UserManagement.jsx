import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from "@/config/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const roles = ['all', 'student', 'faculty', 'visitor', 'admin'];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedRole === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selectedRole));
    }
  }, [selectedRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(getApiUrl('users'), {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'faculty':
        return 'bg-blue-500';
      case 'student':
        return 'bg-green-500';
      case 'visitor':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="flex gap-2 mb-6">
        {roles.map((role) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            onClick={() => setSelectedRole(role)}
            className="capitalize"
          >
            {role}
          </Button>
        ))}
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[600px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <Badge className={`mt-1 ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      {user.role === 'student' && (
                        <p className="text-sm mt-1">
                          {user.department} • Year {user.currentYear}
                        </p>
                      )}
                      {user.role === 'faculty' && (
                        <p className="text-sm mt-1">{user.position}</p>
                      )}
                      {user.role === 'visitor' && (
                        <p className="text-sm mt-1">Grade: {user.grade}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
};

export default UserManagement; 