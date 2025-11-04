import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { getApiUrl } from "@/config/api";

export default function EditAchievementsModal({ isOpen, onClose, userData, onUpdate }) {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Update achievements when userData changes
  useEffect(() => {
    if (userData?.achievements) {
      setAchievements(userData.achievements);
    }
  }, [userData]);

  const handleAddAchievement = () => {
    if (!newAchievement.title.trim() || !newAchievement.description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    setAchievements([...achievements, { 
      title: newAchievement.title.trim(),
      description: newAchievement.description.trim()
    }]);
    setNewAchievement({ title: "", description: "" });
  };

  const handleRemoveAchievement = (indexToRemove) => {
    setAchievements(achievements.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        getApiUrl('profile/achievements'),
        { achievements },
        { withCredentials: true }
      );

      if (response.data) {
        onUpdate(response.data);
        onClose();
        toast.success('Achievements updated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating achievements:', error);
      toast.error(error.response?.data?.message || 'Failed to update achievements');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Achievements</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newAchievement.title}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter achievement title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAchievement.description}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter achievement description"
              />
            </div>
            <Button 
              onClick={handleAddAchievement}
              className="w-full"
              disabled={isLoading}
            >
              Add Achievement
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Current Achievements</Label>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-secondary rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAchievement(index)}
                    className="text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 