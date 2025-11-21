// src/components/layout/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CartIcon from "../cart/CartIcon";
import { MessageSquareText } from "lucide-react";

const Navbar: React.FC = () => {
  const { email, role, logout } = useAuth();

  return (
    <header className="w-full bg-slate-900/60 border-b border-slate-800 p-3 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/customer" className="text-xl font-bold hover:text-blue-400 transition-colors">
          LiveMART
        </Link>

        <div className="flex items-center gap-6">
          {role === 'customer' && (
            <div className="flex items-center gap-4">
              <Link 
                to="/customer/feedback" 
                className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-blue-400 transition-colors"
              >
                <MessageSquareText size={18} />
                <span className="hidden sm:inline">Give Feedback</span>
              </Link>
              <Link 
                to="/customer/feedback/view" 
                className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-blue-400 transition-colors"
              >
                <MessageSquareText size={18} />
                <span className="hidden sm:inline">View Feedback</span>
              </Link>
            </div>
          )}
          
          <CartIcon />
          
          <div className="text-sm text-slate-300 hidden md:block">
            {email && `${email} • ${role}`}
          </div>
          
          <button
            onClick={logout}
            className="text-sm px-3 py-1 rounded-md bg-red-600/90 hover:bg-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
