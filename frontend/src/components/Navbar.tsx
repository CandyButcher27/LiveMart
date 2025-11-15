import { GoogleLoginButton } from './auth/GoogleLoginButton';
import { UserProfile } from './auth/UserProfile';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">LiveMart</span>
          </div>
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
      </div>
    </nav>
  );
}
