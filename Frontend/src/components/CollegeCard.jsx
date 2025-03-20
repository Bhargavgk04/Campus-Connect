import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { School, MapPin, Users, MessageSquare, CheckCircle2, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function CollegeCard({ college, minimal = false }) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(college.image);
  const [isEnrolled, setIsEnrolled] = useState(college.isEnrolled || false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Ensure the image URL is properly formatted
    if (college.image && !college.image.startsWith('http')) {
      setImageUrl(`http://localhost:8080${college.image}`);
    }
  }, [college.image]);

  const handleJoinToggle = async () => {
    if (!isAuthenticated) {
      // Handle not authenticated case (e.g., redirect to login)
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isEnrolled ? 'unjoin' : 'join';
      await axios.post(`http://localhost:8080/api/colleges/${college._id}/${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setIsEnrolled(!isEnrolled);
    } catch (error) {
      console.error('Error toggling enrollment:', error);
      // Handle error (e.g., show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <span className="text-2xl font-medium text-primary">
              {college.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{college.name}</h3>
        
        {!minimal && (
          <>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {college.description}
            </p>
            
            <div className="space-y-2 mb-4">
              {college.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{college.location}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{college.members?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{college.questionsCount?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Link
            to={`/college/${college._id}`}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <School className="h-4 w-4" />
            View Details
          </Link>
          
          {isAuthenticated && (
            <button
              onClick={handleJoinToggle}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isEnrolled
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEnrolled ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Joined
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Join
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

CollegeCard.propTypes = {
  college: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    members: PropTypes.number,
    questionsCount: PropTypes.number,
    isEnrolled: PropTypes.bool
  }).isRequired,
  minimal: PropTypes.bool
};