import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Ban,
  UserCheck,
  AlertTriangle,
  Users as UsersIcon,
  Building2,
  GraduationCap,
  UserCog,
  List,
  Grid,
  User,
  Shield,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserManagementPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Add server URL constant
  const SERVER_URL = "http://localhost:8080";

  // Helper function to get profile picture URL
  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    return `${SERVER_URL}/${profilePicture}`;
  };

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetch("http://localhost:8080/api/admin/users", {
      credentials: 'include'
    }).then((res) => res.json()),
  });

  // User action mutation
  const userActionMutation = useMutation({
    mutationFn: ({ userId, action }) =>
      fetch(`http://localhost:8080/api/users/${userId}/${action}`, {
        method: "POST",
        credentials: 'include'
      }),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries(["admin", "users"]);
      toast({
        title: "User updated",
        description: `User has been ${action}ed successfully.`,
      });
    },
  });

  // Filter users based on search query and selected role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleUserAction = (userId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      userActionMutation.mutate({ userId, action });
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsViewProfileOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const variants = {
      admin: "bg-red-100 text-red-700",
      student: "bg-blue-100 text-blue-700",
      faculty: "bg-green-100 text-green-700",
      visitor: "bg-yellow-100 text-yellow-700",
    };
    return variants[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      case "faculty":
        return <User className="h-4 w-4" />;
      case "visitor":
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={selectedRole} onValueChange={setSelectedRole}>
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="visitor">Visitors</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredUsers?.map((user) => (
              <Card key={user._id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                      {user.profilePicture ? (
                        <img
                          src={getProfilePictureUrl(user.profilePicture)}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary text-sm font-medium">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewProfile(user)}
                          className="text-blue-600"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers?.map((user) => (
              <Card key={user._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-primary/10">
                      {user.profilePicture ? (
                        <img
                          src={getProfilePictureUrl(user.profilePicture)}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary text-lg font-medium">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewProfile(user)}
                          className="text-blue-600"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* View Profile Dialog */}
      <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Viewing profile of {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Profile Info */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-card rounded-lg shadow-sm p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={selectedUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`}
                        alt={selectedUser.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                      />
                    </div>
                    <h1 className="text-2xl font-bold mt-4">{selectedUser.name}</h1>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <Badge className="mt-2">{selectedUser.role}</Badge>
                  </div>
                </div>
              </div>

              {/* Right Column - User Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-card rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">User Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium">{selectedUser.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Joined</p>
                        <p className="font-medium">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedUser.department && (
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">{selectedUser.department}</p>
                        </div>
                      )}
                      {selectedUser.year && (
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-medium">{selectedUser.year}</p>
                        </div>
                      )}
                      {selectedUser.rollNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">Roll Number</p>
                          <p className="font-medium">{selectedUser.rollNumber}</p>
                        </div>
                      )}
                      {selectedUser.cgpa && (
                        <div>
                          <p className="text-sm text-muted-foreground">CGPA</p>
                          <p className="font-medium">{selectedUser.cgpa}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage; 