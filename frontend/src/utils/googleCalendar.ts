// Google Calendar API utility functions

interface CalendarEvent {
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
}

// These should be set in your environment variables
const CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CALENDAR_CLIENT_ID || '';
const API_KEY = (import.meta as any).env.VITE_GOOGLE_CALENDAR_API_KEY || '';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

// Initialize the Google API client library
export async function initGoogleAPI(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Check if gapi is available
    if (typeof window.gapi === 'undefined') {
      const error = new Error('Google API client not loaded');
      console.error(error);
      reject(error);
      return;
    }

    // Load the client library and initialize it with the API key
    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });
        gapiInited = true;
        console.log('Google API client initialized');
        resolve();
      } catch (error) {
        console.error('Error initializing Google API client:', error);
        reject(error);
      }
    });
  });
}

// Initialize the Google Identity Services client library
export function initGoogleIdentity(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof window.google === 'undefined' || !window.google.accounts) {
      console.error('Google Identity Services not loaded');
      resolve();
      return;
    }

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse: google.accounts.oauth2.TokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          console.log('Google API token received');
          gisInited = true;
          resolve();
        } else {
          console.error('Failed to get Google API token');
          resolve();
        }
      },
      error_callback: (error: any) => {
        console.error('Google API token error:', error);
        resolve();
      },
    });
    
    gisInited = true;
    resolve();
  });
}

// Create a calendar event
export async function createCalendarEvent(event: {
  summary: string;
  description: string;
  start: string;
  end: string;
}): Promise<string> {
  if (!gapiInited || !gisInited || !tokenClient) {
    throw new Error('Google API not properly initialized');
  }

  try {
    // Request an access token
    await new Promise<void>((resolve, reject) => {
      if (!tokenClient) {
        reject(new Error('Token client not initialized'));
        return;
      }

      // Set up the callback for when the token is received
      const originalCallback = tokenClient.callback;
      if (originalCallback) {
        tokenClient.callback = (response: google.accounts.oauth2.TokenResponse) => {
          if (response.error) {
            reject(new Error(response.error_description || 'Failed to get access token'));
            return;
          }
          // Restore the original callback
          tokenClient!.callback = originalCallback;
          resolve();
        };
      }

      // Request the token
      tokenClient.requestAccessToken({ prompt: 'consent' });
    });

    // Create the event
    const eventPayload: CalendarEvent = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: eventPayload,
    });

    if (response.status === 200 && response.result.htmlLink) {
      return response.result.htmlLink;
    } else {
      throw new Error('Failed to create calendar event');
    }
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

// Format a date for the Google Calendar API
export function formatDateForCalendar(date: Date): string {
  return date.toISOString();
}

// Add days to a date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Format a date to a human-readable string
export function formatDeliveryDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Check if Google API is available
export function isGoogleApiAvailable(): boolean {
  return gapiInited && gisInited && tokenClient !== null;
}
