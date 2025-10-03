import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, DollarSign, Heart, User, Phone, MessageCircle, CheckCircle, Star } from 'lucide-react';
import { Request } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ChatBox } from './ChatBox';
import { RatingModal } from './RatingModal';

interface RequestDetailModalProps {
  request: Request;
  onClose: () => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ request, onClose }) => {
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const { user } = useAuth();
  const { updateRequest, addPoints, foodDetails, parcelDetails, martDetails } = useData();

  const isRequester = user?.id === request.requesterId;
  const isHelper = user?.id === request.helperId;
  const canAccept = request.status === 'open' && !isRequester;
  const canComplete = request.status === 'in_progress' && isRequester;
  const canStartProgress = request.status === 'accepted' && isHelper;

  const users = JSON.parse(localStorage.getItem('snappi_users') || '[]');
  const requester = users.find((u: any) => u.id === request.requesterId);
  const helper = request.helperId ? users.find((u: any) => u.id === request.helperId) : null;

  const getDetails = () => {
    if (request.requestType === 'food_delivery') {
      return foodDetails[request.id];
    } else if (request.requestType === 'parcel_pickup') {
      return parcelDetails[request.id];
    } else if (request.requestType === 'mart_pickup') {
      return martDetails[request.id];
    }
    return null;
  };

  const details = getDetails();

  const handleAccept = () => {
    if (!user) return;
    updateRequest(request.id, {
      status: 'accepted',
      helperId: user.id,
      acceptedAt: new Date(),
    });
    setShowChat(true);
  };

  const handleStartProgress = () => {
    updateRequest(request.id, {
      status: 'in_progress',
    });
  };

  const handleComplete = () => {
    updateRequest(request.id, {
      status: 'completed',
      completedAt: new Date(),
    });

    if (request.helperId) {
      addPoints(request.helperId, 10, 'Completed delivery', request.id);

      const helperData = users.find((u: any) => u.id === request.helperId);
      if (helperData) {
        helperData.totalDeliveries = (helperData.totalDeliveries || 0) + 1;
        localStorage.setItem('snappi_users', JSON.stringify(users));
      }
    }

    setShowRating(true);
  };

  const statusColors = {
    open: 'bg-green-100 text-green-800',
    accepted: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">{request.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
              {request.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {request.imageUrl && (
            <img src={request.imageUrl} alt={request.title} className="w-full h-64 object-cover rounded-xl" />
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{request.description}</p>
          </div>

          {details && request.requestType === 'food_delivery' && (
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Food Delivery Details</h3>
              <div className="space-y-1 text-sm">
                <p className="text-orange-800"><span className="font-medium">Food Court:</span> {details.foodCourt}</p>
                <p className="text-orange-800"><span className="font-medium">Items:</span> {details.items}</p>
                <p className="text-orange-800"><span className="font-medium">Estimated Price:</span> ${details.estimatedPrice}</p>
              </div>
            </div>
          )}

          {details && request.requestType === 'parcel_pickup' && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Parcel Details</h3>
              <div className="space-y-1 text-sm">
                <p className="text-blue-800"><span className="font-medium">Tracking Number:</span> {details.trackingNumber}</p>
                <p className="text-blue-800"><span className="font-medium">Location:</span> {details.parcelLocation}</p>
              </div>
            </div>
          )}

          {details && request.requestType === 'mart_pickup' && (
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-2">Mart Pickup Details</h3>
              <div className="space-y-1 text-sm">
                <p className="text-green-800"><span className="font-medium">Store:</span> {details.storeName}</p>
                <p className="text-green-800"><span className="font-medium">Items:</span> {details.itemsList}</p>
                <p className="text-green-800"><span className="font-medium">Price Range:</span> ${details.priceRangeMin} - ${details.priceRangeMax}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center text-gray-700 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="font-medium">Pickup</span>
              </div>
              <p className="text-sm text-gray-600">{request.pickupLocation}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center text-gray-700 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="font-medium">Delivery</span>
              </div>
              <p className="text-sm text-gray-600">{request.deliveryLocation}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium capitalize">{request.urgency} urgency</span>
              </div>

              {request.isPaid ? (
                <div className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="w-5 h-5" />
                  <span>${request.amount}</span>
                  <span className="ml-2 text-xs text-gray-600">({request.paymentMethod?.replace('_', ' ')})</span>
                </div>
              ) : (
                <div className="flex items-center text-pink-600 font-semibold">
                  <Heart className="w-5 h-5 mr-1" />
                  <span>Volunteer</span>
                </div>
              )}
            </div>
          </div>

          {requester && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Requester</h3>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{requester.fullName}</p>
                  <p className="text-sm text-gray-600">{requester.hostel}</p>
                </div>
                {(isHelper || request.status !== 'open') && (
                  <a
                    href={`tel:${requester.phone}`}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {helper && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Helper</h3>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{helper.fullName}</p>
                  <p className="text-sm text-gray-600">{helper.hostel}</p>
                </div>
                {(isRequester || request.status !== 'open') && (
                  <a
                    href={`tel:${helper.phone}`}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {(isRequester || isHelper) && request.status !== 'open' && request.status !== 'completed' && (
            <button
              onClick={() => setShowChat(!showChat)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{showChat ? 'Hide Chat' : 'Show Chat'}</span>
            </button>
          )}

          {showChat && (
            <ChatBox requestId={request.id} />
          )}

          <div className="flex space-x-3">
            {canAccept && (
              <button
                onClick={handleAccept}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Accept Request
              </button>
            )}

            {canStartProgress && (
              <button
                onClick={handleStartProgress}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Start Delivery</span>
              </button>
            )}

            {canComplete && (
              <button
                onClick={handleComplete}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Completed</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showRating && request.helperId && (
        <RatingModal
          requestId={request.id}
          helperId={request.helperId}
          onClose={() => {
            setShowRating(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};
