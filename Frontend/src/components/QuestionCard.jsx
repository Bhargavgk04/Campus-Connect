import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageCircle, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuestionCard({ question, isDetailed = false }) {
  const [upvotes, setUpvotes] = useState(question.upvotes);
  const [likes, setLikes] = useState(question.likes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const handleUpvote = (e) => {
    e.preventDefault();
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const CardContent = () => (
    <>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link to={`/profile/${question.author.id}`} className="shrink-0">
          <img 
            src={question.author.avatar}
            alt={question.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col space-y-1.5">
            <Link to={`/question/${question.id}`}>
              <h3 className={cn(
                "font-semibold leading-tight text-foreground hover:text-primary transition-colors line-clamp-2",
                isDetailed ? "text-2xl" : "text-lg"
              )}>
                {question.title}
              </h3>
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
              <Link to={`/profile/${question.author.id}`} className="font-medium hover:text-primary transition-colors">
                {question.author.name}
              </Link>
              <span className="mx-1.5">•</span>
              <Link to={`/category/${question.category.slug}`} className="hover:text-primary transition-colors">
                {question.category.name}
              </Link>
              <span className="mx-1.5">•</span>
              <span>{formatDate(question.createdAt)}</span>
            </div>
          </div>

          {/* Question content */}
          <div className={cn(
            "mt-2 text-sm text-foreground/90",
            isDetailed ? "" : "line-clamp-3"
          )}>
            <p>{question.content}</p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button 
              onClick={handleUpvote}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors",
                hasUpvoted ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{upvotes}</span>
            </button>
            
            <Link 
              to={`/question/${question.id}`}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{question.answers.length} Answers</span>
            </Link>
            
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors",
                hasLiked ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", hasLiked && "fill-accent")} />
              <span>{likes}</span>
            </button>
            
            <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (isDetailed) {
    return (
      <div className="bg-card rounded-xl shadow-sm p-5 border border-border animate-fade-in">
        <CardContent />
      </div>
    );
  }

  return (
    <Link to={`/question/${question.id}`} className="block">
      <div className="bg-card rounded-xl shadow-sm p-5 border border-border card-hover animate-fade-in">
        <CardContent />
      </div>
    </Link>
  );
} 