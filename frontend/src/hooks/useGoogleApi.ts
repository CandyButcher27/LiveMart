import { useState, useEffect, useCallback } from 'react';
import type { GapiAuth2, LoadConfig } from '../types/global';

interface UseGoogleApiReturn {
  isGoogleApiLoaded: boolean;
  isSignedIn: boolean;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  authInstance: GapiAuth2 | null;
  error: Error | null;
}

export const useGoogleApi = (): UseGoogleApiReturn => {
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [authInstance, setAuthInstance] = useState<GapiAuth2 | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const updateSigninStatus = useCallback((isSignedInStatus: boolean) => {
    setIsSignedIn(isSignedInStatus);
  }, []);

  const loadAuth2 = useCallback(async (): Promise<void> => {
    try {
      // FIX: Removed the strict check here. The only requirement is that window.gapi exists
      // because gapi.load() is the method that defines gapi.client and gapi.auth2.
      if (!window.gapi) {
         throw new Error('Google API client object not found.');
      }

      // 1. First, load the required client and auth2 modules.
      // This step defines window.gapi.client, window.gapi.auth2, and all their methods.
      await new Promise<void>((resolve, reject) => {
        const loadOptions: LoadConfig = {
          callback: () => resolve(),
          onerror: () => reject(new Error('Error loading Google API client modules (client:auth2)')),
          timeout: 10000,
          ontimeout: () => reject(new Error('Timeout loading Google API client modules')),
        };
        
        // This call is essential for making gapi.client and gapi.auth2 available.
        window.gapi.load('client:auth2', loadOptions);
      });

      // We can now safely assume gapi.client exists, preventing the previous error.

      // 2. Then initialize the client
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events',
      });

      // 3. Get the auth2 instance
      const auth2 = window.gapi.auth2.getAuthInstance() || 
                   await window.gapi.auth2.init({
                     client_id: import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID,
                     scope: 'https://www.googleapis.com/auth/calendar.events',
                   });

      // Type assertion to GapiAuth2 to match our type definition
      const authInstance = auth2 as unknown as GapiAuth2;
      setAuthInstance(authInstance);
      
      // Listen for auth changes
      authInstance.isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(authInstance.isSignedIn.get());
      
      setIsGoogleApiLoaded(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize Google API');
      console.error('Error initializing Google API:', error);
      setError(error);
      throw error;
    }
  }, [updateSigninStatus]);

  useEffect(() => {
    let isMounted = true;

    const waitForGapiLoadAndInitialize = async () => {
      try {
        console.log('Initializing Google API...');
        
        await new Promise<void>(resolve => {
          // Check if gapi is already loaded (for hot-reloads or repeated calls)
          if (window.gapi) {
            console.log('gapi already loaded in memory, proceeding.');
            return resolve();
          }
          
          // Overwrite the globally defined onGAPILoaded function in index.html
          // to resolve our promise when it's finally called by api.js
          const originalCallback = window.onGAPILoaded;
          window.onGAPILoaded = () => {
             // We call the resolve here, ensuring the script fully ran before proceeding.
             resolve();
             // Call the original callback to maintain console logs, etc.
             originalCallback?.();
          };
        });
        
        // Now gapi is ready for the core initialization logic (loadAuth2)
        await loadAuth2();
        
        if (isMounted) {
          console.log('Google API initialized successfully');
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Unknown error initializing Google API');
          console.error('Initialization error:', error);
          setError(error);
        }
      }
    };

    waitForGapiLoadAndInitialize();

    return () => {
      isMounted = false;
    };
  }, [loadAuth2]);

  const signIn = async (): Promise<boolean> => {
    if (!authInstance) {
      console.error('Google Auth not initialized');
      return false;
    }
    try {
      await authInstance.signIn();
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sign in');
      console.error('Sign in error:', error);
      setError(error);
      return false;
    }
  };

  const signOut = async (): Promise<boolean> => {
    if (!authInstance) {
      console.error('Google Auth not initialized');
      return false;
    }
    try {
      await authInstance.signOut();
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sign out');
      console.error('Sign out error:', error);
      setError(error);
      return false;
    }
  };

  return {
    isGoogleApiLoaded,
    isSignedIn,
    signIn,
    signOut,
    authInstance,
    error,
  };
};

export default useGoogleApi;