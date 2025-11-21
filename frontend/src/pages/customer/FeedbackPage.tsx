import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccess, showError } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { submitFeedback } from '../../api/feedback';

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const maxLength = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      showError('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitFeedback(feedback);
      showSuccess('Thank you for your feedback!');
      setFeedback('');
      navigate('/customer/feedback/view');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length <= maxLength) {
      setFeedback(input);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-white">Share Your Feedback</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-300 mb-2">
            Your feedback helps us improve our service
          </label>
          <textarea
            id="feedback"
            rows={5}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your feedback here (max 200 characters)"
            value={feedback}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <div className="text-right text-sm text-slate-400 mt-1">
            {feedback.length}/{maxLength} characters
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting || !feedback.trim()
                ? 'bg-blue-600/50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isSubmitting || !feedback.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackPage;
