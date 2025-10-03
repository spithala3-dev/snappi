import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Request,
  Message,
  Rating,
  Badge,
  UserBadge,
  PointsHistory,
  Announcement,
  FoodDeliveryDetails,
  ParcelPickupDetails,
  MartPickupDetails
} from '../types';

interface DataContextType {
  requests: Request[];
  messages: Message[];
  ratings: Rating[];
  badges: Badge[];
  userBadges: UserBadge[];
  pointsHistory: PointsHistory[];
  announcements: Announcement[];
  foodDetails: Record<string, FoodDeliveryDetails>;
  parcelDetails: Record<string, ParcelPickupDetails>;
  martDetails: Record<string, MartPickupDetails>;
  createRequest: (request: Omit<Request, 'id' | 'createdAt'>, details: any) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  deleteRequest: (id: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  createRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  addPoints: (userId: string, points: number, reason: string, requestId?: string) => void;
  awardBadge: (userId: string, badgeId: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_BADGES: Badge[] = [
  { id: '1', name: 'First Delivery', description: 'Complete your first delivery', icon: 'package', criteria: { deliveries: 1 } },
  { id: '2', name: 'Fastest Helper', description: 'Complete 10 deliveries in under 15 minutes', icon: 'zap', criteria: { fast_deliveries: 10 } },
  { id: '3', name: 'Snack Hero', description: 'Complete 25 food deliveries', icon: 'utensils', criteria: { food_deliveries: 25 } },
  { id: '4', name: 'Night Owl', description: 'Complete 10 deliveries after 10 PM', icon: 'moon', criteria: { night_deliveries: 10 } },
  { id: '5', name: 'Weekend Warrior', description: 'Complete 15 deliveries on weekends', icon: 'calendar', criteria: { weekend_deliveries: 15 } },
  { id: '6', name: 'Top Helper', description: 'Reach the #1 spot on the leaderboard', icon: 'trophy', criteria: { leaderboard_rank: 1 } },
  { id: '7', name: 'Five Star', description: 'Maintain 5-star average over 20 deliveries', icon: 'star', criteria: { avg_rating: 5, min_deliveries: 20 } },
  { id: '8', name: 'Century Club', description: 'Complete 100 deliveries', icon: 'award', criteria: { deliveries: 100 } },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [badges] = useState<Badge[]>(DEFAULT_BADGES);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [foodDetails, setFoodDetails] = useState<Record<string, FoodDeliveryDetails>>({});
  const [parcelDetails, setParcelDetails] = useState<Record<string, ParcelPickupDetails>>({});
  const [martDetails, setMartDetails] = useState<Record<string, MartPickupDetails>>({});

  useEffect(() => {
    const storedRequests = localStorage.getItem('snappi_requests');
    const storedMessages = localStorage.getItem('snappi_messages');
    const storedRatings = localStorage.getItem('snappi_ratings');
    const storedUserBadges = localStorage.getItem('snappi_user_badges');
    const storedPointsHistory = localStorage.getItem('snappi_points_history');
    const storedAnnouncements = localStorage.getItem('snappi_announcements');
    const storedFoodDetails = localStorage.getItem('snappi_food_details');
    const storedParcelDetails = localStorage.getItem('snappi_parcel_details');
    const storedMartDetails = localStorage.getItem('snappi_mart_details');

    if (storedRequests) setRequests(JSON.parse(storedRequests));
    if (storedMessages) setMessages(JSON.parse(storedMessages));
    if (storedRatings) setRatings(JSON.parse(storedRatings));
    if (storedUserBadges) setUserBadges(JSON.parse(storedUserBadges));
    if (storedPointsHistory) setPointsHistory(JSON.parse(storedPointsHistory));
    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
    if (storedFoodDetails) setFoodDetails(JSON.parse(storedFoodDetails));
    if (storedParcelDetails) setParcelDetails(JSON.parse(storedParcelDetails));
    if (storedMartDetails) setMartDetails(JSON.parse(storedMartDetails));
  }, []);

  const createRequest = (requestData: Omit<Request, 'id' | 'createdAt'>, details: any) => {
    const newRequest: Request = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('snappi_requests', JSON.stringify(updatedRequests));

    if (requestData.requestType === 'food_delivery') {
      const newFoodDetails = { ...foodDetails, [newRequest.id]: { ...details, requestId: newRequest.id } };
      setFoodDetails(newFoodDetails);
      localStorage.setItem('snappi_food_details', JSON.stringify(newFoodDetails));
    } else if (requestData.requestType === 'parcel_pickup') {
      const newParcelDetails = { ...parcelDetails, [newRequest.id]: { ...details, requestId: newRequest.id } };
      setParcelDetails(newParcelDetails);
      localStorage.setItem('snappi_parcel_details', JSON.stringify(newParcelDetails));
    } else if (requestData.requestType === 'mart_pickup') {
      const newMartDetails = { ...martDetails, [newRequest.id]: { ...details, requestId: newRequest.id } };
      setMartDetails(newMartDetails);
      localStorage.setItem('snappi_mart_details', JSON.stringify(newMartDetails));
    }
  };

  const updateRequest = (id: string, updates: Partial<Request>) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, ...updates } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('snappi_requests', JSON.stringify(updatedRequests));
  };

  const deleteRequest = (id: string) => {
    const updatedRequests = requests.filter(req => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem('snappi_requests', JSON.stringify(updatedRequests));
  };

  const sendMessage = (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('snappi_messages', JSON.stringify(updatedMessages));
  };

  const createRating = (ratingData: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...ratingData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);
    localStorage.setItem('snappi_ratings', JSON.stringify(updatedRatings));
  };

  const addPoints = (userId: string, points: number, reason: string, requestId?: string) => {
    const newEntry: PointsHistory = {
      id: Date.now().toString(),
      userId,
      points,
      reason,
      requestId,
      createdAt: new Date(),
    };

    const updatedHistory = [...pointsHistory, newEntry];
    setPointsHistory(updatedHistory);
    localStorage.setItem('snappi_points_history', JSON.stringify(updatedHistory));

    const users = JSON.parse(localStorage.getItem('snappi_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].totalPoints = (users[userIndex].totalPoints || 0) + points;
      localStorage.setItem('snappi_users', JSON.stringify(users));
    }
  };

  const awardBadge = (userId: string, badgeId: string) => {
    const existing = userBadges.find(ub => ub.userId === userId && ub.badgeId === badgeId);
    if (existing) return;

    const newBadge: UserBadge = {
      id: Date.now().toString(),
      userId,
      badgeId,
      earnedAt: new Date(),
    };

    const updatedBadges = [...userBadges, newBadge];
    setUserBadges(updatedBadges);
    localStorage.setItem('snappi_user_badges', JSON.stringify(updatedBadges));
  };

  const createAnnouncement = (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('snappi_announcements', JSON.stringify(updatedAnnouncements));
  };

  return (
    <DataContext.Provider value={{
      requests,
      messages,
      ratings,
      badges,
      userBadges,
      pointsHistory,
      announcements,
      foodDetails,
      parcelDetails,
      martDetails,
      createRequest,
      updateRequest,
      deleteRequest,
      sendMessage,
      createRating,
      addPoints,
      awardBadge,
      createAnnouncement,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
