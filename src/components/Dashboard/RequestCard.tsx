import React from 'react';
import { Request } from '../../types';
import { MapPin, Clock, DollarSign, Heart } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface RequestCardProps {
  request: Request;
  onClick: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const { foodDetails, parcelDetails, martDetails } = useData();

  const statusColors = {
    open: 'bg-green-100 text-green-800',
    accepted: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const urgencyColors = {
    low: 'text-gray-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

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

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-300"
    >
      {request.imageUrl && (
        <img src={request.imageUrl} alt={request.title} className="w-full h-40 object-cover" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{request.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.description}</p>

        {details && request.requestType === 'food_delivery' && (
          <div className="bg-orange-50 rounded-lg p-2 mb-3">
            <p className="text-sm font-medium text-orange-900">{details.foodCourt}</p>
            <p className="text-xs text-orange-700 line-clamp-1">{details.items}</p>
          </div>
        )}

        {details && request.requestType === 'parcel_pickup' && (
          <div className="bg-blue-50 rounded-lg p-2 mb-3">
            <p className="text-sm font-medium text-blue-900">Tracking: {details.trackingNumber}</p>
            <p className="text-xs text-blue-700">{details.parcelLocation}</p>
          </div>
        )}

        {details && request.requestType === 'mart_pickup' && (
          <div className="bg-green-50 rounded-lg p-2 mb-3">
            <p className="text-sm font-medium text-green-900">{details.storeName}</p>
            <p className="text-xs text-green-700 line-clamp-1">{details.itemsList}</p>
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500 space-x-3 mb-3">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {request.deliveryLocation}
          </div>
          <div className={`flex items-center font-medium ${urgencyColors[request.urgency]}`}>
            <Clock className="w-3 h-3 mr-1" />
            {request.urgency}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {request.isPaid ? (
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign className="w-4 h-4" />
              <span>${request.amount}</span>
            </div>
          ) : (
            <div className="flex items-center text-pink-600 font-semibold">
              <Heart className="w-4 h-4 mr-1" />
              <span>Volunteer</span>
            </div>
          )}

          <div className="text-xs text-gray-400">
            {new Date(request.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
