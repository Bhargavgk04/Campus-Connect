import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

export default function ViewProfileDialog({ isOpen, onClose, userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/profile/${userId}`, {
        withCredentials: true
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            {userData ? `Viewing profile of ${userData.name}` : 'Loading profile...'}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : userData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`}
                      alt={userData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    />
                  </div>
                  <h1 className="text-2xl font-bold mt-4">{userData.name}</h1>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <Badge className="mt-2">{userData.role}</Badge>
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
                      <p className="font-medium">{userData.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {userData.department && (
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                    )}
                    {userData.year && (
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-medium">{userData.year}</p>
                      </div>
                    )}
                    {userData.rollNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{userData.rollNumber}</p>
                      </div>
                    )}
                    {userData.cgpa && (
                      <div>
                        <p className="text-sm text-muted-foreground">CGPA</p>
                        <p className="font-medium">{userData.cgpa}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 