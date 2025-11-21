// Type definitions for environment variables

// For Vite environment variables
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CALENDAR_CLIENT_ID: string;
  readonly VITE_GOOGLE_CALENDAR_API_KEY: string;
  // Add other Vite environment variables here as needed
}

// Extend the ImportMeta interface to include env
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_GOOGLE_CALENDAR_CLIENT_ID: string;
    readonly VITE_GOOGLE_CALENDAR_API_KEY: string;
  }
}

// Type definitions for Google APIs
export interface LoadConfig {
  callback: () => void;
  onerror: () => void;
  timeout: number;
  ontimeout: () => void;
}

declare namespace gapi {
  function load(module: string, config: LoadConfig): void;
  namespace client {
    function init(config: {
      apiKey: string;
      clientId: string;
      discoveryDocs: string[];
      scope: string;
      [key: string]: any;
    }): Promise<void>;

    function getToken(): { access_token: string } | null;
    
    namespace calendar {
      namespace events {
        function insert(params: {
          calendarId: string;
          resource: {
            summary: string;
            description: string;
            start: { 
              dateTime: string;
              timeZone?: string;
            };
            end: { 
              dateTime: string;
              timeZone?: string;
            };
          };
        }): { 
          result: { 
            htmlLink: string;
            status: number;
          };
        };
      }
    }
  }
}

// Type for GapiAuth2 to match the expected type in useGoogleApi
export interface GapiAuth2 {
  isSignedIn: {
    listen(listener: (isSignedIn: boolean) => void): void;
    get(): boolean;
  };
  currentUser: {
    get(): {
      getId(): string;
      isSignedIn(): boolean;
      getAuthResponse(includeAuthorizationData?: boolean): any;
    };
  };
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
        error_description?: string;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback?: (tokenResponse: TokenResponse) => void;
        error_callback?: (error: any) => void;
      }

      interface TokenClient {
        callback?: (tokenResponse: TokenResponse) => void;
        error_callback?: (error: any) => void;
        requestAccessToken: (overridableTokenRequest?: { prompt?: string }) => void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
    }
  }
}

// Extend the existing gapi type declaration
declare namespace gapi {
  namespace auth2 {
    interface GoogleAuth {
      isSignedIn: {
        listen(listener: (isSignedIn: boolean) => void): void;
        get(): boolean;
      };
      signIn(): Promise<GoogleUser>;
      signOut(): Promise<void>;
      currentUser: {
        get(): GoogleUser;
      };
    }

    interface GoogleUser {
      getId(): string;
      isSignedIn(): boolean;
      getAuthResponse(includeAuthorizationData?: boolean): any;
    }
  }
}

declare global {
  interface Window {
    gapi: {
      load: (module: string, config: {
        callback?: () => void;
        onerror?: () => void;
        timeout?: number;
        ontimeout?: () => void;
      }) => void;
      client: {
        init: (config: {
          apiKey: string;
          clientId: string;
          discoveryDocs: string[];
          scope: string;
          [key: string]: any;
        }) => Promise<void>;
        calendar: any;
        getToken: () => { access_token: string } | null;
      };
      auth2: {
        init: (config: {
          client_id: string;
          scope: string;
          [key: string]: any;
        }) => gapi.auth2.GoogleAuth;
        getAuthInstance: () => gapi.auth2.GoogleAuth;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: google.accounts.oauth2.TokenClientConfig) => google.accounts.oauth2.TokenClient;
        };
      };
    };
    // The required global callback function for the script to call when it's done loading
    onGAPILoaded: () => void; 
    onGAPIError: (error: any) => void;
    // Removed gapiLoaded, as it's no longer necessary with the promise-based approach
  }
}

export {};