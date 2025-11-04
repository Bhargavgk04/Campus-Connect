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
import { toast } from "sonner";
import axios from "axios";
import { getApiUrl } from "@/config/api";

export default function EditSkillsModal({ isOpen, onClose, userData, onUpdate }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update skills when userData changes
  useEffect(() => {
    if (userData?.skills) {
      setSkills(userData.skills);
    }
  }, [userData]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill");
      return;
    }
    if (skills.includes(newSkill.trim())) {
      toast.error("This skill already exists");
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        getApiUrl('profile/skills'),
        { skills },
        { withCredentials: true }
      );

      if (response.data) {
        onUpdate(response.data);
        onClose();
        toast.success('Skills updated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating skills:', error);
      toast.error(error.response?.data?.message || 'Failed to update skills');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="newSkill">Add New Skill</Label>
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
            </div>
            <Button 
              onClick={handleAddSkill}
              className="mt-auto"
              disabled={isLoading}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Current Skills</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 