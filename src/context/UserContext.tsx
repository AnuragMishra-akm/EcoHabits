"use client";

import React, { createContext, useState, ReactNode, useContext } from 'react';
import { ReceiptText, Trophy } from 'lucide-react';
import type { ReactElement } from 'react';

type User = {
  name: string;
  email: string;
  avatar: string;
};

export type Activity = {
    id: string;
    description: string;
    date: string;
    icon: ReactElement;
};

type UserContextType = {
  user: User;
  points: number;
  activities: Activity[];
  updateAvatar: (newAvatar: string) => void;
  addPoints: (amount: number) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatar: "https://placehold.co/100x100.png",
  });

  const [points, setPoints] = useState(5400);

  const [activities, setActivities] = useState<Activity[]>([
      {
          id: '1',
          description: "Joined Unilever's Plastic-Free Week challenge.",
          date: new Date().toISOString(),
          icon: <Trophy className="w-5 h-5 text-yellow-500" />
      }
  ]);

  const updateAvatar = (newAvatar: string) => {
    setUser((prevUser) => ({ ...prevUser, avatar: newAvatar }));
  };

  const addPoints = (amount: number) => {
    setPoints((prevPoints) => prevPoints + amount);
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity: Activity = {
      ...activity,
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
    };
    setActivities((prevActivities) => [newActivity, ...prevActivities]);
  };

  return (
    <UserContext.Provider value={{ user, points, activities, updateAvatar, addPoints, addActivity }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
