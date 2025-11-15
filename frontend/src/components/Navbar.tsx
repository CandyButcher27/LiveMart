import { Link, useLocation } from "react-router-dom";
import { GoogleLoginButton } from "./auth/GoogleLoginButton";
import { UserProfile } from "./auth/UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

export default function Navbar() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    currentUser?.role === "customer" && { label: "Products", path: "/customer" },
    currentUser?.role === "retailer" && { label: "Dashboard", path: "/retailer" },
    currentUser?.role === "wholesaler" && { label: "Dashboard", path: "/wholesaler" },
  ].filter(Boolean) as { label: string; path: string }[];

  return (
    <nav className="w-full backdrop-blur-md bg-slate-900/40 border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Branding */}
        <Link 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all hover:scale-[1.03]"
        >
          LiveMart
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-all px-2 py-1 rounded-md",
                  active
                    ? "text-white bg-white/10 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <UserProfile />
          ) : (
            <div className="hidden sm:block">
              <GoogleLoginButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
