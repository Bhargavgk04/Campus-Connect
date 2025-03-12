import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AnswerForm({ questionId }) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Answer posted successfully!");
      setAnswer("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border animate-fade-in">
      <h3 className="text-lg font-semibold mb-3">Your Answer</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Share your knowledge or experience..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-lg transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              <span>{isSubmitting ? "Posting..." : "Post Answer"}</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 