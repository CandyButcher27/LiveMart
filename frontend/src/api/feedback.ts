// Temporary in-memory storage for feedback until backend is implemented
const FEEDBACK_STORAGE_KEY = 'livemart_feedback';

export interface Feedback {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

// Get feedback from localStorage
const getStoredFeedback = (): Feedback[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save feedback to localStorage
const saveFeedback = (feedback: Feedback[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
  }
};

export const submitFeedback = async (content: string): Promise<Feedback> => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedbackList = getStoredFeedback();
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        userId: 'current-user-id', // This would come from auth in a real app
        content,
        createdAt: new Date().toISOString(),
      };
      
      const updatedFeedback = [...feedbackList, newFeedback];
      saveFeedback(updatedFeedback);
      
      resolve(newFeedback);
    }, 500);
  });
};

export const getMyFeedback = async (): Promise<Feedback[]> => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedback = getStoredFeedback();
      // In a real app, we would filter by the current user's ID
      resolve(feedback);
    }, 500);
  });
};

// This would be used by admins in the future
export const getAllFeedback = async (): Promise<Feedback[]> => {
  return getStoredFeedback();
};
