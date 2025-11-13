import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { BookOpen, Upload, Home, LogOut, Info, FileText, MessageSquare, ListChecks, Gift, Moon, Sun, BookmarkCheck, Menu, FileUp } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import logo from "@/assets/padhai-logo.png";
import logoDark from "@/assets/padhai-logo-dark.png";
import { NotificationSystem } from "@/components/NotificationSystem";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={theme === "dark" ? logoDark : logo} alt="Padhai Co." className="h-10 w-40 object-contain" />
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link to="/notes" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Browse Notes</span>
          </Link>
          {user && (
            <>
              <Link to="/upload" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <Upload className="h-4 w-4" />
                <span className="hidden md:inline">Upload</span>
              </Link>
              <NotificationSystem />
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold">My Profile</div>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/upload?tab=my-notes")}>
                    <FileUp className="mr-2 h-4 w-4" />
                    My Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/library")}>
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    My Library
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/request-notes")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Request Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-requests")}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    My Requests
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/refer-earn")}>
                    <Gift className="mr-2 h-4 w-4" />
                    Refer & Earn
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/about")}>
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/privacy")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/terms")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Terms & Conditions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/about")}>
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/privacy")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/terms")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Terms & Conditions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/auth")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Login
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
