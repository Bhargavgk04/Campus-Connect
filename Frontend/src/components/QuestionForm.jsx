import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { categories } from "../data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function QuestionForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Question posted successfully!");
      setTitle("");
      setContent("");
      setCategory("");
      setIsSubmitting(false);
    }, 1000);
  };

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
                <option key={cat.id} value={cat.slug}>
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