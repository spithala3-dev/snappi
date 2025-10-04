// src/context/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
  createRequest: (request: Omit<Request, 'id' | 'created_at'>, details: any) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  createRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  addPoints: (userId: string, points: number, reason: string, requestId?: string) => void;
  awardBadge: (userId: string, badgeId: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at'>) => void;
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

  // Fetch requests
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching requests:', error);
    else if (data) setRequests(data as Request[]);
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching announcements:', error);
    else if (data) setAnnouncements(data as Announcement[]);
  };

  useEffect(() => {
    fetchRequests();
    fetchAnnouncements();

    // Supabase v2 real-time subscription
    const requestsChannel = supabase
      .channel('requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, payload => {
        if (payload.eventType === 'INSERT') setRequests(prev => [payload.new as Request, ...prev]);
        if (payload.eventType === 'UPDATE') setRequests(prev => prev.map(r => r.id === payload.new.id ? payload.new as Request : r));
        if (payload.eventType === 'DELETE') setRequests(prev => prev.filter(r => r.id !== payload.old.id));
      })
      .subscribe();

    const announcementsChannel = supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, payload => {
        if (payload.eventType === 'INSERT') setAnnouncements(prev => [payload.new as Announcement, ...prev]);
        if (payload.eventType === 'UPDATE') setAnnouncements(prev => prev.map(a => a.id === payload.new.id ? payload.new as Announcement : a));
        if (payload.eventType === 'DELETE') setAnnouncements(prev => prev.filter(a => a.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(announcementsChannel);
    };
  }, []);

  // CREATE REQUEST
  const createRequest = async (requestData: Omit<Request, 'id' | 'created_at'>, details: any) => {
    const { data, error } = await supabase
      .from('requests')
      .insert([{ ...requestData }])
      .select();

    if (error) {
      console.error('Error creating request:', error);
      return;
    }

    const newRequest = data?.[0] as Request;

    if (requestData.requestType === 'food_delivery') {
      setFoodDetails(prev => ({ ...prev, [newRequest.id]: { ...details, requestId: newRequest.id } }));
    } else if (requestData.requestType === 'parcel_pickup') {
      setParcelDetails(prev => ({ ...prev, [newRequest.id]: { ...details, requestId: newRequest.id } }));
    } else if (requestData.requestType === 'mart_pickup') {
      setMartDetails(prev => ({ ...prev, [newRequest.id]: { ...details, requestId: newRequest.id } }));
    }
  };

  const updateRequest = async (id: string, updates: Partial<Request>) => {
    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) console.error('Error updating request:', error);
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting request:', error);
  };

  const sendMessage = (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = { ...messageData, id: Date.now().toString(), createdAt: new Date() };
    setMessages(prev => [...prev, newMessage]);
  };

  const createRating = (ratingData: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = { ...ratingData, id: Date.now().toString(), createdAt: new Date() };
    setRatings(prev => [...prev, newRating]);
  };

  const addPoints = (userId: string, points: number, reason: string, requestId?: string) => {
    const newEntry: PointsHistory = { id: Date.now().toString(), userId, points, reason, requestId, createdAt: new Date() };
    setPointsHistory(prev => [...prev, newEntry]);
  };

  const awardBadge = (userId: string, badgeId: string) => {
    const exists = userBadges.find(ub => ub.userId === userId && ub.badgeId === badgeId);
    if (exists) return;
    setUserBadges(prev => [...prev, { id: Date.now().toString(), userId, badgeId, earnedAt: new Date() }]);
  };

  const createAnnouncement = (announcementData: Omit<Announcement, 'id' | 'created_at'>) => {
    const newAnnouncement: Announcement = { ...announcementData, id: Date.now().toString(), created_at: new Date() };
    setAnnouncements(prev => [...prev, newAnnouncement]);
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
      createAnnouncement
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
