import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import QuestionCard from "../components/QuestionCard";
import { getQuestionsSortedByUpvotes } from "../data/mockData";

export default function Index() {
  const topQuestions = getQuestionsSortedByUpvotes().slice(0, 3);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Top Questions Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Top Questions
              </h2>
              <a 
                href="/questions" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                View All →
              </a>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {topQuestions.map((question) => (
                <QuestionCard 
                  key={question.id} 
                  question={question}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4 md:px-6 bg-muted/50">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                How CampusQuery Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your questions answered by fellow students and contribute to the community knowledge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Ask a Question</h3>
                <p className="text-muted-foreground">
                  Share your question with detailed information to help others understand your problem.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Answers</h3>
                <p className="text-muted-foreground">
                  Receive answers from students who have faced similar issues or have the expertise.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Upvote the Best</h3>
                <p className="text-muted-foreground">
                  Vote for the most helpful answers to help others find quality content.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join CTA Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Join the CampusQuery Community
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Create an account today to start asking questions, providing answers, and connecting with fellow students.
                </p>
                <a 
                  href="/signup" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8"
                >
                  Sign Up Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CampusQuery
              </span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              © 2023 CampusQuery. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 