// src/components/layout/Navbar.tsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import CartIcon from "../cart/CartIcon";


const Navbar: React.FC = () => {
  const { email, role, logout } = useAuth();

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Later: integrate with backend /products?query=
  };

  return (
    <header className="w-full bg-slate-900/60 border-b border-slate-800 p-3 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="text-xl font-bold">LiveMART</div>

        

        <div className="flex items-center gap-4">
          <CartIcon />
          <div className="text-sm text-slate-300 hidden md:block">
            {email && `${email} • ${role}`}
          </div>
          <button
            onClick={logout}
            className="text-sm px-3 py-1 rounded-md bg-red-600/90 hover:brightness-95"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
