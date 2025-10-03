import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface RatingModalProps {
  requestId: string;
  helperId: string;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ requestId, helperId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const { user } = useAuth();
  const { createRating, addPoints } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    createRating({
      requestId,
      raterId: user.id,
      ratedId: helperId,
      rating,
      review: review.trim() || undefined,
    });

    if (rating === 5) {
      addPoints(helperId, 5, 'Bonus for 5-star rating', requestId);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Rate Your Experience</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">How was your experience with the helper?</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {rating === 5 && '🎉 Amazing!'}
                {rating === 4 && '😊 Great!'}
                {rating === 3 && '😐 Good'}
                {rating === 2 && '😕 Okay'}
                {rating === 1 && '😞 Poor'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
              placeholder="Share your experience..."
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};
