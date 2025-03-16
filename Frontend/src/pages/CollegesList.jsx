import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, MessageSquare, School, Check } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function CollegesList() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/colleges");
      setColleges(response.data);
    } catch (error) {
      toast.error("Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (collegeId, event) => {
    event.preventDefault(); // Prevent navigation
    setColleges(prevColleges =>
      prevColleges.map(college =>
        college._id === collegeId
          ? { ...college, isJoined: !college.isJoined }
          : college
      )
    );
  };

  const handleCardClick = (college, event) => {
    // Only navigate if the click wasn't on the join button
    if (!event.defaultPrevented && college.isJoined) {
      navigate(`/college/${college._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-7xl mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-4 text-foreground">Colleges</h1>
        <p className="text-muted-foreground mb-8">Browse and connect with college communities</p>

        <div className="grid gap-6">
          {colleges.map((college) => (
            <div
              key={college._id}
              onClick={(e) => handleCardClick(college, e)}
              className={`bg-card text-card-foreground rounded-lg shadow-md dark:shadow-primary/5 border border-border p-6 ${
                college.isJoined 
                  ? "hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer" 
                  : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-foreground">{college.name}</h2>
                  <p className="text-muted-foreground">
                    Founded in {college.establishedYear || "N/A"}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                      <Users className="h-4 w-4" />
                      <span>{(college.members || 0).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{(college.questionsCount || 0).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                      <Users className="h-4 w-4" />
                      <span>{(college.activeUsers || 0).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                  <button
                    onClick={(e) => handleJoin(college._id, e)}
                    className={`rounded-lg p-3 transition-colors ${
                      college.isJoined
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 font-semibold">
                      {college.isJoined ? (
                        <>
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-primary">Joined</span>
                        </>
                      ) : (
                        <>
                          <School className="h-4 w-4 text-primary-foreground" />
                          <span className="text-primary-foreground">Join</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {college.isJoined ? "Click to view" : "Click to join"}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
