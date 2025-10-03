export interface User {
  id: string;
  email: string;
  fullName: string;
  hostel: string;
  phone: string;
  avatarUrl?: string;
  totalPoints: number;
  totalDeliveries: number;
  successRate: number;
  isAdmin: boolean;
  isSuspended: boolean;
}

export type RequestType = 'food_delivery' | 'parcel_pickup' | 'mart_pickup';
export type RequestStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type Urgency = 'low' | 'medium' | 'high';
export type PaymentMethod = 'upi' | 'cash_on_delivery';

export interface Request {
  id: string;
  requesterId: string;
  helperId?: string;
  requestType: RequestType;
  title: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  isPaid: boolean;
  amount?: number;
  paymentMethod?: PaymentMethod;
  urgency: Urgency;
  status: RequestStatus;
  imageUrl?: string;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  requester?: User;
  helper?: User;
}

export interface FoodDeliveryDetails {
  requestId: string;
  foodCourt: string;
  items: string;
  estimatedPrice: number;
}

export interface ParcelPickupDetails {
  requestId: string;
  trackingNumber: string;
  parcelLocation: string;
}

export interface MartPickupDetails {
  requestId: string;
  storeName: string;
  itemsList: string;
  priceRangeMin: number;
  priceRangeMax: number;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  message: string;
  createdAt: Date;
  sender?: User;
}

export interface Rating {
  id: string;
  requestId: string;
  raterId: string;
  ratedId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge?: Badge;
}

export interface PointsHistory {
  id: string;
  userId: string;
  points: number;
  reason: string;
  requestId?: string;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}
