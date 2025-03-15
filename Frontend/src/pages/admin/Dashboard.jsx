import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  School,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const statsCards = [
  {
    title: "Total Users",
    icon: Users,
    value: "Loading...",
    description: "Active users across all colleges",
    queryKey: ["admin", "stats", "users"],
    // Replace with your API endpoint
    queryFn: () => fetch("/api/admin/stats/users").then((res) => res.json()),
  },
  {
    title: "Total Colleges",
    icon: School,
    value: "Loading...",
    description: "Registered educational institutions",
    queryKey: ["admin", "stats", "colleges"],
    queryFn: () => fetch("/api/admin/stats/colleges").then((res) => res.json()),
  },
  {
    title: "Total Questions",
    icon: MessageSquare,
    value: "Loading...",
    description: "Questions asked across platform",
    queryKey: ["admin", "stats", "questions"],
    queryFn: () => fetch("/api/admin/stats/questions").then((res) => res.json()),
  },
  {
    title: "Reported Content",
    icon: AlertTriangle,
    value: "Loading...",
    description: "Items requiring moderation",
    queryKey: ["admin", "stats", "reports"],
    queryFn: () => fetch("/api/admin/stats/reports").then((res) => res.json()),
  },
];

const Dashboard = () => {
  // Fetch all stats in parallel
  const statsQueries = statsCards.map((card) =>
    useQuery({
      queryKey: card.queryKey,
      queryFn: card.queryFn,
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsQueries[index].isLoading
                  ? "Loading..."
                  : statsQueries[index].isError
                  ? "Error"
                  : statsQueries[index].data?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions and events across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add your activity list component here */}
          <p className="text-sm text-muted-foreground">
            Activity feed coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 