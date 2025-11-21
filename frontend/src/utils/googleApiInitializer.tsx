import { useEffect, useState } from 'react';
import { initGoogleAPI, initGoogleIdentity } from './googleCalendar';

export const useGoogleApi = () => {
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeGoogleApis = async () => {
      try {
        // Check if Google API is already loaded
        if (window.gapiLoaded) {
          await initGoogleAPI();
          await initGoogleIdentity();
          setIsGoogleApiReady(true);
          return;
        }

        // Set up event listener for when Google API is loaded
        const handleGapiLoaded = async () => {
          try {
            await initGoogleAPI();
            await initGoogleIdentity();
            setIsGoogleApiReady(true);
          } catch (err) {
            console.error('Error initializing Google APIs:', err);
            setError(err instanceof Error ? err : new Error('Failed to initialize Google APIs'));
          }
        };

        // Add event listener
        document.addEventListener('gapi-loaded', handleGapiLoaded);

        // Cleanup
        return () => {
          document.removeEventListener('gapi-loaded', handleGapiLoaded);
        };
      } catch (err) {
        console.error('Error setting up Google API listener:', err);
        setError(err instanceof Error ? err : new Error('Failed to set up Google API listener'));
      }
    };

    initializeGoogleApis();
  }, []);

  return { isGoogleApiReady, error };
};
