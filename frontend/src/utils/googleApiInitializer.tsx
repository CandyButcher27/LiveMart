import { useEffect, useState } from "react";
import { initGoogleAPI, initGoogleIdentity } from "./googleCalendar";

declare global {
  interface Window {
    gapiLoaded?: boolean;
  }
}

export const useGoogleApi = () => {
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeGoogleApis = async () => {
      try {
        // ⭐ Prevent multiple initializations
        if (window.gapiLoaded) {
          console.log("Google API already initialized — skipping");
          setIsGoogleApiReady(true);
          return;
        }

        // ⭐ Mark as loaded BEFORE running
        window.gapiLoaded = true;

        console.log("Initializing Google API...");

        await initGoogleAPI();
        await initGoogleIdentity();

        console.log("Google API initialization complete!");
        setIsGoogleApiReady(true);

      } catch (err) {
        console.error("Google API initialization error:", err);
        setError(err instanceof Error ? err : new Error("Google API init failed"));
      }
    };

    initializeGoogleApis();
  }, []);

  return { isGoogleApiReady, error };
};
