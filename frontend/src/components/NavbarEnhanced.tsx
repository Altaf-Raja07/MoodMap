import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Menu, X, User, LogOut, Settings, BarChart3 } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export const NavbarEnhanced = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const navLinks = [
    { to: "/explore", label: "Explore" },
    { to: "/street-food", label: "Street Food" },
    { to: "/favorites", label: "Favorites", authRequired: true },
    { to: "/analytics", label: "Analytics", authRequired: true },
  ];

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">Mood</span>
              <span className="text-foreground">Map</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks
              .filter(link => !link.authRequired || isAuthenticated)
              .map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                  activeClassName="text-primary"
                >
                  {link.label}
                </NavLink>
              ))}
            
            <ThemeToggle />

            {/* Auth Section */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:inline">{currentUser?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/analytics')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              {navLinks
                .filter(link => !link.authRequired || isAuthenticated)
                .map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    activeClassName="text-primary bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-t border-border/50 mt-2">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      navigate('/profile');
                      setIsOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      navigate('/settings');
                      setIsOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-red-600"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/register');
                      setIsOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarEnhanced;
