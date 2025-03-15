import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuestionCard from "../components/QuestionCard";
import CategorySelector from "../components/CategorySelector";
import QuestionForm from "../components/QuestionForm";
import { getQuestionsSortedByUpvotes, getQuestionsByCategory } from "../data/mockData";
import { Filter, SortAsc, SortDesc } from "lucide-react";

export default function Questions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || null);
  const [questions, setQuestions] = useState([]);
  const [sortOrder, setSortOrder] = useState('popular');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  useEffect(() => {
    let filteredQuestions;
    
    // Filter by category if selected
    if (selectedCategory) {
      filteredQuestions = getQuestionsByCategory(selectedCategory);
    } else {
      filteredQuestions = getQuestionsSortedByUpvotes();
    }
    
    // Sort questions
    if (sortOrder === 'popular') {
      filteredQuestions.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      filteredQuestions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    setQuestions(filteredQuestions);
  }, [selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-6">Questions</h1>
              
              {/* Filters */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSortOrder('popular')}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                        sortOrder === 'popular'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <SortDesc className="h-4 w-4" />
                      Popular
                    </button>
                    
                    <button
                      onClick={() => setSortOrder('recent')}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                        sortOrder === 'recent'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <SortAsc className="h-4 w-4" />
                      Recent
                    </button>
                  </div>
                </div>
                
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              
              {/* Questions List */}
              <div className="space-y-6">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No questions found for this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <QuestionForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}