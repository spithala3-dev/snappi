import React, { useState } from 'react';
import { X, Utensils, Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { RequestType } from '../../types';

interface CreateRequestModalProps {
  onClose: () => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ onClose }) => {
  const [requestType, setRequestType] = useState<RequestType>('food_delivery');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash_on_delivery'>('upi');

  const [foodCourt, setFoodCourt] = useState('');
  const [items, setItems] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');

  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcelLocation, setParcelLocation] = useState('');

  const [storeName, setStoreName] = useState('');
  const [itemsList, setItemsList] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const { user } = useAuth();
  const { createRequest } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let details: any = {};

    if (requestType === 'food_delivery') {
      details = {
        foodCourt,
        items,
        estimatedPrice: parseFloat(estimatedPrice),
      };
    } else if (requestType === 'parcel_pickup') {
      details = {
        trackingNumber,
        parcelLocation,
      };
    } else if (requestType === 'mart_pickup') {
      details = {
        storeName,
        itemsList,
        priceRangeMin: parseFloat(priceMin),
        priceRangeMax: parseFloat(priceMax),
      };
    }

    createRequest(
      {
        requesterId: user.id,
        requestType,
        title,
        description,
        pickupLocation,
        deliveryLocation,
        isPaid,
        amount: isPaid ? parseFloat(amount) : undefined,
        paymentMethod: isPaid ? paymentMethod : undefined,
        urgency,
        status: 'open',
      },
      details
    );

    onClose();
  };

  const requestTypes = [
    { id: 'food_delivery' as RequestType, label: 'Food Delivery', icon: Utensils, color: 'orange' },
    { id: 'parcel_pickup' as RequestType, label: 'Parcel Pickup', icon: Package, color: 'blue' },
    { id: 'mart_pickup' as RequestType, label: 'Mart Pickup', icon: ShoppingBag, color: 'green' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Request Type</label>
            <div className="grid grid-cols-3 gap-3">
              {requestTypes.map(type => {
                const Icon = type.icon;
                const isSelected = requestType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRequestType(type.id)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${isSelected ? `text-${type.color}-600` : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${isSelected ? `text-${type.color}-900` : 'text-gray-600'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Quick title for your request"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Detailed description"
              required
            />
          </div>

          {requestType === 'food_delivery' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Court</label>
                <select
                  value={foodCourt}
                  onChange={(e) => setFoodCourt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a food court</option>
                  <option value="Main Dining Hall">Main Dining Hall</option>
                  <option value="Student Center Cafe">Student Center Cafe</option>
                  <option value="Food Truck Zone">Food Truck Zone</option>
                  <option value="Library Cafe">Library Cafe</option>
                  <option value="Off-Campus">Off-Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items to Order</label>
                <textarea
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={2}
                  placeholder="e.g., 2 burgers, 1 fries, 1 coke"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </>
          )}

          {requestType === 'parcel_pickup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC123456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Location</label>
                <input
                  type="text"
                  value={parcelLocation}
                  onChange={(e) => setParcelLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mail Room, Front Desk"
                  required
                />
              </div>
            </>
          )}

          {requestType === 'mart_pickup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <select
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a store</option>
                  <option value="Campus Store">Campus Store</option>
                  <option value="Target">Target</option>
                  <option value="Walmart">Walmart</option>
                  <option value="CVS">CVS</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items Needed</label>
                <textarea
                  value={itemsList}
                  onChange={(e) => setItemsList(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                  placeholder="e.g., shampoo, notebooks, snacks"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Where should the helper pick up from?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Where should it be delivered?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level as any)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    urgency === level
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">Payment Type</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    !isPaid
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isPaid
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>

            {isPaid && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required={isPaid}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        paymentMethod === 'upi'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cash on Delivery
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all"
          >
            Create Request
          </button>
        </form>
      </div>
    </div>
  );
};
