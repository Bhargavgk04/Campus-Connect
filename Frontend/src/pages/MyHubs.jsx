import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, MessageSquare, School } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function MyHubs() {
  const [enrolledColleges, setEnrolledColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEnrolledColleges();
  }, []);

  const fetchEnrolledColleges = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/enrollment/my-colleges', {
        withCredentials: true
      });
      setEnrolledColleges(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled colleges:', error);
      setError(error.response?.data?.message || 'Failed to fetch enrolled colleges');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container max-w-7xl mx-auto px-4 pt-28 pb-16">
          <div className="text-red-500 text-center p-4">
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchEnrolledColleges}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Hubs</h1>
            <p className="text-muted-foreground">
              Quick access to your joined college communities
            </p>
          </div>
          <Link
            to="/colleges"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <School className="h-4 w-4" />
            Join More Colleges
          </Link>
        </div>

        {enrolledColleges.length > 0 ? (
          <div className="grid gap-6">
            {enrolledColleges.map((enrollment) => (
              <Link
                key={enrollment.college._id}
                to={`/college/${enrollment.college._id}`}
                className="block bg-card text-card-foreground rounded-lg shadow-md dark:shadow-primary/5 border border-border p-6 hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">{enrollment.college.name}</h2>
                    <p className="text-muted-foreground">
                      Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                        <Users className="h-4 w-4" />
                        <span>{enrollment.college.members?.toLocaleString() || '0'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{enrollment.college.questionsCount?.toLocaleString() || '0'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                        <School className="h-4 w-4" />
                        <span>{enrollment.college.departments?.length || '0'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Departments</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <School className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Joined Colleges Yet</h2>
            <p className="text-muted-foreground mb-6">
              Join college communities to see them here
            </p>
            <Link
              to="/colleges"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <School className="h-4 w-4" />
              Browse Colleges
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
