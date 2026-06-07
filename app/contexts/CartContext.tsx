"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Course } from "../data/courses";

interface CartItem extends Course {
  quantity: number;
  isGift?: boolean;
  recipientEmail?: string;
  recipientName?: string;
  giftMessage?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (course: Course) => void;
  addGiftToCart: (course: Course, recipientEmail: string, recipientName?: string, giftMessage?: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartTotalNGN: number;
  cartCount: number;
  mounted: boolean;
  cartTimestamp: number | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [cartTimestamp, setCartTimestamp] = useState<number | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("origin_cart");
    const savedTimestamp = localStorage.getItem("origin_cart_timestamp");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedTimestamp) {
      setCartTimestamp(parseInt(savedTimestamp));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("origin_cart", JSON.stringify(cart));
      localStorage.setItem("origin_cart_timestamp", Date.now().toString());
    }
  }, [cart, mounted]);

  const addToCart = (course: Course) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === course.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === course.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...course, quantity: 1 }];
    });
  };

  const addGiftToCart = (course: Course, recipientEmail: string, recipientName?: string, giftMessage?: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === course.id && item.isGift);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === course.id && item.isGift 
            ? { ...item, quantity: item.quantity + 1, recipientEmail, recipientName, giftMessage }
            : item
        );
      }
      return [...prevCart, { ...course, quantity: 1, isGift: true, recipientEmail, recipientName, giftMessage }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.priceUSD || 0) * item.quantity, 0);
  const cartTotalNGN = cartTotal * 1500;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addGiftToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartTotalNGN,
        cartCount,
        mounted,
        cartTimestamp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
