import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import CollegesList from "./pages/CollegesList";
import CollegePage from "./pages/CollegePage";
import NotFound from "./pages/NotFound";
import Activity from "./pages/Activity";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/colleges" element={<CollegesList />} />
          <Route path="/college/:id" element={<CollegePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;