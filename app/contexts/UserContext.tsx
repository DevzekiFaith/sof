"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  preferences?: {
    [key: string]: any;
  };
}

export type BillingInterval = "quarterly";

interface UserContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (preferences: { [key: string]: any }) => void;
  purchaseCourse: (courseId: string) => void;
  purchaseQuarterlyPass: () => void;
  hasCourseAccess: (courseId: string) => boolean;
  getOwnedCourses: () => string[];
  getQuarterlyPass: () => { isActive: boolean; expiresAt?: string };
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'self_pay_users';
const CURRENT_USER_KEY = 'self_pay_current_user';

const PREF_OWNED_COURSES_KEY = "ownedCourseIds";
const PREF_QUARTERLY_PASS_EXPIRES_AT_KEY = "quarterlyPassExpiresAt";
const QUARTERLY_DURATION_DAYS = 90;

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load current user from localStorage on mount
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      preferences: {}
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUserPreferences = (newPreferences: { [key: string]: any }) => {
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        preferences: { ...users[userIndex].preferences, ...newPreferences }
      };
      users[userIndex] = updatedUser;
      saveUsers(users);
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const getOwnedCourses = (): string[] => {
    const owned = currentUser?.preferences?.[PREF_OWNED_COURSES_KEY];
    return Array.isArray(owned) ? owned : [];
  };

  const getQuarterlyPass = (): { isActive: boolean; expiresAt?: string } => {
    const expiresAt = currentUser?.preferences?.[PREF_QUARTERLY_PASS_EXPIRES_AT_KEY];
    if (typeof expiresAt !== "string") return { isActive: false };
    const expiresMs = Date.parse(expiresAt);
    if (Number.isNaN(expiresMs)) return { isActive: false };
    return { isActive: Date.now() < expiresMs, expiresAt };
  };

  const hasCourseAccess = (courseId: string): boolean => {
    if (!currentUser) return false;
    const owned = getOwnedCourses();
    if (owned.includes(courseId)) return true;
    return getQuarterlyPass().isActive;
  };

  const purchaseCourse = (courseId: string) => {
    if (!currentUser) return;
    const owned = new Set(getOwnedCourses());
    owned.add(courseId);
    updateUserPreferences({ [PREF_OWNED_COURSES_KEY]: Array.from(owned) });
  };

  const purchaseQuarterlyPass = () => {
    if (!currentUser) return;
    const expiresAt = new Date(Date.now() + QUARTERLY_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    updateUserPreferences({ [PREF_QUARTERLY_PASS_EXPIRES_AT_KEY]: expiresAt });
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateUserPreferences,
        purchaseCourse,
        purchaseQuarterlyPass,
        hasCourseAccess,
        getOwnedCourses,
        getQuarterlyPass,
        isLoading
      }}
    >
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