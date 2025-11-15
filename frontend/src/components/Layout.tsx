import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "./Navbar";

export function Layout({ isAuthPage = false }) {
  return (
    <AuthProvider>
      {/* Full app wrapper */}
      <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col">

        {/* Navbar only for non-auth pages */}
        {!isAuthPage && (
          <div className="backdrop-blur-md bg-slate-900/40 border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/20">
            <Navbar />
          </div>
        )}

        {/* Main content area */}
        <main
          className={`flex-1 w-full ${
            isAuthPage
              ? "flex items-center justify-center p-6"
              : "p-6 max-w-7xl mx-auto w-full"
          }`}
        >
          <div
            className={
              isAuthPage
                ? "w-full max-w-lg"
                : "w-full h-full"
            }
          >
            <Outlet />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
