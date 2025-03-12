import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuestionCard from "../components/QuestionCard";
import AnswerForm from "../components/AnswerForm";
import { getQuestionById } from "../data/mockData";
import { ChevronUp, ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuestionDetail() {
  const { id } = useParams();
  const question = getQuestionById(id || "");
  const [answers, setAnswers] = useState([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (question) {
      // Sort answers by upvotes (highest first)
      const sortedAnswers = [...question.answers].sort(
        (a, b) => b.upvotes - a.upvotes
      );
      setAnswers(sortedAnswers);
    }
  }, [question]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle upvoting an answer
  const handleUpvoteAnswer = (answerId, action) => {
    setAnswers(
      answers.map((answer) => {
        if (answer.id === answerId) {
          return {
            ...answer,
            upvotes:
              action === 'upvote' ? answer.upvotes + 1 : Math.max(0, answer.upvotes - 1),
          };
        }
        return answer;
      })
    );
  };

  if (!question) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16 px-4 md:px-6">
          <div className="container max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Question Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The question you're looking for doesn't exist or has been removed.
            </p>
            <a
              href="/questions"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-6"
            >
              Browse Questions
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="container max-w-4xl mx-auto">
          {/* Question */}
          <QuestionCard question={question} isDetailed />
          
          {/* Answers Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Answers ({answers.length})
              </h2>
            </div>
            
            {/* Answer List */}
            {answers.length > 0 ? (
              <div className="space-y-6">
                {answers.map((answer) => (
                  <div key={answer.id} className="bg-card rounded-xl p-5 border border-border animate-fade-in">
                    <div className="flex gap-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleUpvoteAnswer(answer.id, 'upvote')}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Upvote"
                        >
                          <ChevronUp className="h-6 w-6" />
                        </button>
                        <span className="text-sm font-medium py-1">{answer.upvotes}</span>
                        <button
                          onClick={() => handleUpvoteAnswer(answer.id, 'downvote')}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Downvote"
                        >
                          <ChevronDown className="h-6 w-6" />
                        </button>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="text-foreground/90">{answer.content}</div>
                        
                        {/* Author and Date */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={answer.author.avatar}
                              alt={answer.author.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <a href={`/profile/${answer.author.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                                {answer.author.name}
                              </a>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(answer.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground">
                  No answers yet. Be the first to answer this question!
                </p>
              </div>
            )}
            
            {/* Answer Form */}
            <div className="mt-8">
              <AnswerForm questionId={question.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 