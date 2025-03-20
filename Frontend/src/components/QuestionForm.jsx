import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { id: 'academic', name: 'Academic' },
  { id: 'campus-life', name: 'Campus Life' },
  { id: 'admissions', name: 'Admissions' },
  { id: 'careers', name: 'Careers' },
  { id: 'general', name: 'General' }
];

export default function QuestionForm({ collegeId, onQuestionAdded }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to post a question");
      return;
    }
    
    if (!title || !content || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!collegeId) {
      toast.error("College ID is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:8080/api/questions', {
        title,
        content,
        category,
        college: collegeId,
        tags: []
      }, {
        withCredentials: true
      });

      toast.success("Question posted successfully!");
      setTitle("");
      setContent("");
      setCategory("");
      
      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error(error.response?.data?.message || 'Failed to post question');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="glass rounded-xl p-6 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
        <p className="text-muted-foreground text-center">
          Please log in to post a question
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Question Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question about?"
              className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={120}
            />
            <div className="mt-1 text-xs text-muted-foreground text-right">
              {title.length}/120
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Question Details
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more details about your question..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            <PlusCircle className="h-4 w-4" />
            <span>{isSubmitting ? "Posting..." : "Post Question"}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 