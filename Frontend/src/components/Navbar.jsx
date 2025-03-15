import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    /** @param {MouseEvent} event */
    const handleClickOutside = (event) => {
      const target = event.target;
      if (showProfileMenu && target instanceof Element && !target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  // Handle search
  /** @param {React.FormEvent} e */
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300 px-6",
        isScrolled ? "py-3 nav-blur backdrop-blur-md bg-background/80 shadow-sm" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CampusConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/questions" className="text-foreground/80 hover:text-primary transition-colors">
            Questions
          </Link>
          <Link to="/categories" className="text-foreground/80 hover:text-primary transition-colors">
            Categories
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>
        </div>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch}
          className={cn(
            "hidden md:flex relative items-center transition-all duration-300",
            isScrolled ? "w-64" : "w-72"
          )}
        >
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pr-10 rounded-full bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button type="submit" className="absolute right-3">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        </form>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {/* Admin Button */}
          <Link
            to="/admin"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Panel</span>
          </Link>
          
          {/* Profile Menu */}
          <div className="relative profile-menu">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors"
            >
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="profile-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border">
                <div className="py-1">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/activity"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Activity
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-foreground"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 mt-2 rounded-lg glass animate-fade-in">
          <form 
            onSubmit={handleSearch}
            className="relative mb-4"
          >
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-full bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="submit" className="absolute right-3 top-2">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>
          <div className="space-y-3">
            <Link to="/questions" className="block py-2 text-foreground/80 hover:text-primary">
              Questions
            </Link>
            <Link to="/categories" className="block py-2 text-foreground/80 hover:text-primary">
              Categories
            </Link>
            <Link to="/about" className="block py-2 text-foreground/80 hover:text-primary">
              About
            </Link>
            <Link to="/admin" className="flex items-center gap-2 py-2 text-primary hover:text-primary/80">
              <ShieldCheck className="w-4 h-4" />
              Admin Dashboard
            </Link>
            <Link to="/profile" className="block py-2 text-foreground/80 hover:text-primary">
              My Profile
            </Link>
            <Link to="/activity" className="block py-2 text-foreground/80 hover:text-primary">
              My Activity
            </Link>
            <Link
              to="/login"
              className="block py-2 text-destructive hover:text-destructive/80"
            >
              Sign Out
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 