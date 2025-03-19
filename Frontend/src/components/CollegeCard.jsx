import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { School, MapPin, Users, MessageSquare } from "lucide-react";

export default function CollegeCard({ college, minimal = false }) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(college.image);

  useEffect(() => {
    // Ensure the image URL is properly formatted
    if (college.image && !college.image.startsWith('http')) {
      setImageUrl(`http://localhost:8080${college.image}`);
    }
  }, [college.image]);

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

        <Link
          to={`/college/${college._id}`}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <School className="h-4 w-4" />
          View Details
        </Link>
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
  }).isRequired,
  minimal: PropTypes.bool
};