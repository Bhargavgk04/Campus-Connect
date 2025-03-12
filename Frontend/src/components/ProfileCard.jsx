import { Github, Globe, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileCard({ user, className }) {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className={cn("glass rounded-xl overflow-hidden animate-fade-in", className)}>
      {/* Cover Image (placeholder gradient) */}
      <div className="h-32 bg-gradient-to-r from-primary/30 to-accent/30" />
      
      <div className="p-5 -mt-12">
        {/* Avatar */}
        <div className="flex justify-center">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="h-24 w-24 rounded-full border-4 border-background object-cover"
          />
        </div>
        
        {/* User Info */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground mt-1">{user.bio}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center gap-3 mt-4">
          {user.socialLinks.linkedin && (
            <a 
              href={user.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          
          {user.socialLinks.twitter && (
            <a 
              href={user.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          )}
          
          {user.socialLinks.github && (
            <a 
              href={user.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          
          {user.socialLinks.website && (
            <a 
              href={user.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Website"
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 