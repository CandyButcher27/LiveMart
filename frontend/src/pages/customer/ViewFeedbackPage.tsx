import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMyFeedback, type Feedback } from '../../api/feedback';
import { format } from 'date-fns';
import { Loader2, MessageSquareText } from 'lucide-react';

const ViewFeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setIsLoading(true);
        const feedback = await getMyFeedback();
        // Sort by most recent first
        const sortedFeedback = feedback.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbackList(sortedFeedback);
      } catch (err) {
        console.error('Failed to load feedback:', err);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      loadFeedback();
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-slate-400">Loading your feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Your Feedback History</h1>
      </div>

      {feedbackList.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquareText className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-slate-300">No feedback submitted yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            Your feedback helps us improve our service.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((feedback) => (
            <div 
              key={feedback.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <p className="text-slate-300 whitespace-pre-line">{feedback.content}</p>
                <span className="text-xs text-slate-500 ml-4 whitespace-nowrap">
                  {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFeedbackPage;
