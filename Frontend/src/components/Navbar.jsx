import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
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
            CampusQuery
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
          <Link 
            to="/login" 
            className="px-4 py-2 text-primary hover:text-primary/80 transition-colors"
          >
            Log In
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
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
            <div className="pt-2 flex flex-col space-y-2">
              <Link 
                to="/login" 
                className="px-4 py-2 text-center text-primary hover:text-primary/80 border border-primary/20 rounded-md"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 text-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 