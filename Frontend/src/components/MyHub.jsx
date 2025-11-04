import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getApiUrl } from '@/config/api';

const MyHub = () => {
  const [enrolledColleges, setEnrolledColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledColleges();
  }, []);

  const fetchEnrolledColleges = async () => {
    try {
      console.log('Fetching enrolled colleges...');
      const response = await axios.get(getApiUrl('enrollment/my-colleges'), {
        withCredentials: true
      });
      console.log('Enrolled colleges response:', response.data);
      setEnrolledColleges(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled colleges:', error);
      setError(error.response?.data?.message || 'Failed to fetch enrolled colleges');
      setLoading(false);
    }
  };

  const handleUnenroll = async (collegeId) => {
    try {
      console.log('Attempting to unenroll from college:', collegeId);
      await axios.delete(getApiUrl(`enrollment/unenroll/${collegeId}`), {
        withCredentials: true
      });
      toast.success('Successfully unenrolled from college');
      // Refresh the list after unenrolling
      fetchEnrolledColleges();
    } catch (error) {
      console.error('Error unenrolling from college:', error);
      toast.error(error.response?.data?.message || 'Failed to unenroll from college');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center p-4">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchEnrolledColleges}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Hub</h1>
      
      {enrolledColleges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't enrolled in any colleges yet.</p>
          <button
            onClick={() => navigate('/colleges')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Colleges
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledColleges.map((enrollment) => (
            <div
              key={enrollment.college._id}
              className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-border"
            >
              <img
                src={enrollment.college.image}
                alt={enrollment.college.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{enrollment.college.name}</h2>
                <p className="text-muted-foreground mb-4">{enrollment.college.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Enrolled on: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleUnenroll(enrollment.college._id)}
                    className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHub; 