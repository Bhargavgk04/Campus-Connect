import { useState, useEffect } from 'react';
import { X, Save, Calendar, Github, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiUrl } from '@/config/api';
import axios from 'axios';

export default function EditProfileModal({ isOpen, onClose, userData, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    passoutYear: '',
    rollNumber: '',
    cgpa: '',
    dateOfBirth: '',
    bloodGroup: '',
    position: '',
    qualification: '',
    specialization: '',
    experience: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    },
    studentIdCard: '',
    facultyIdCard: '',
    grade: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Aerospace Engineering',
    'Artificial Intelligence',
    'Data Science',
    'Cyber Security'
  ];

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        ...userData,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        socialLinks: userData.socialLinks || {
          github: '',
          linkedin: '',
          twitter: ''
        }
      }));
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.put(getApiUrl('profile/update'), formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (data && data.user) {
        onUpdate(data.user);
        toast.success('Profile updated successfully');
        onClose();
      } else {
        toast.error(data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const [_, platform] = name.split('.');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || ''
      }));
    }
  };

  const getRoleSpecificFields = () => {
    switch (userData?.role) {
      case 'student':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="passoutYear">Passout Year</Label>
                <Input
                  id="passoutYear"
                  name="passoutYear"
                  type="number"
                  value={formData.passoutYear}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );
      case 'faculty':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );
      case 'visitor':
        return (
          <div className="flex flex-col gap-1">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {getRoleSpecificFields()}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={formData.bloodGroup || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, bloodGroup: value || '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <Input
                  type="url"
                  placeholder="GitHub Profile URL"
                  value={formData.socialLinks?.github || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      github: e.target.value
                    }
                  }))}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <Input
                  type="url"
                  placeholder="LinkedIn Profile URL"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      linkedin: e.target.value
                    }
                  }))}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <Input
                  type="url"
                  placeholder="Twitter Profile URL"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      twitter: e.target.value
                    }
                  }))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 