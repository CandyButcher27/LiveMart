import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Navbar } from './Navbar';

export function Layout({ isAuthPage = false }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {!isAuthPage && <Navbar />}
        <main className={`flex-1 w-full ${!isAuthPage ? "" : "flex items-center justify-center"}`}>
          <div className={`w-full h-full ${!isAuthPage ? 'h-[calc(100vh-4rem)]' : 'w-full max-w-md'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
