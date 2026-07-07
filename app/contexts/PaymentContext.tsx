"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export type MobileMoneyProvider = 'mpesa' | 'mtn' | 'airtel' | 'orange' | 'vodafone';

export interface InstallmentPlan {
  id: string;
  months: number;
  multiplier: number; // e.g., 1.1 for 10% interest
  monthlyAmount: number;
  totalAmount: number;
}

export interface PaymentContextType {
  selectedProvider: MobileMoneyProvider | null;
  selectedInstallment: InstallmentPlan | null;
  processing: boolean;
  setProvider: (provider: MobileMoneyProvider) => void;
  setInstallment: (plan: InstallmentPlan) => void;
  initiateMobileMoneyPayment: (amount: number, phone: string, provider: MobileMoneyProvider) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  initiateInstallmentPayment: (amount: number, phone: string, provider: MobileMoneyProvider, months: number) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  getInstallmentPlans: (amount: number) => InstallmentPlan[];
  clearPayment: () => void;
}

const providers = {
  mpesa: { name: 'M-Pesa', countries: ['Kenya', 'Tanzania', 'DRC'], currency: 'KES' },
  mtn: { name: 'MTN Mobile Money', countries: ['Nigeria', 'Ghana', 'Uganda', 'Cameroon'], currency: 'NGN' },
  airtel: { name: 'Airtel Money', countries: ['Nigeria', 'Kenya', 'Uganda', 'Zambia'], currency: 'NGN' },
  orange: { name: 'Orange Money', countries: ['Senegal', 'Ivory Coast', 'Mali', 'Cameroon'], currency: 'XOF' },
  vodafone: { name: 'Vodafone Cash', countries: ['Ghana', 'Egypt'], currency: 'GHS' },
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [selectedProvider, setSelectedProvider] = useState<MobileMoneyProvider | null>(null);
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentPlan | null>(null);
  const [processing, setProcessing] = useState(false);

  const setProvider = (provider: MobileMoneyProvider) => {
    setSelectedProvider(provider);
  };

  const setInstallment = (plan: InstallmentPlan) => {
    setSelectedInstallment(plan);
  };

  const clearPayment = () => {
    setSelectedProvider(null);
    setSelectedInstallment(null);
  };

  const getInstallmentPlans = (amount: number): InstallmentPlan[] => {
    return [
      {
        id: '3-month',
        months: 3,
        multiplier: 1.05,
        monthlyAmount: Math.round((amount * 1.05) / 3),
        totalAmount: Math.round(amount * 1.05),
      },
      {
        id: '6-month',
        months: 6,
        multiplier: 1.1,
        monthlyAmount: Math.round((amount * 1.1) / 6),
        totalAmount: Math.round(amount * 1.1),
      },
      {
        id: '12-month',
        months: 12,
        multiplier: 1.15,
        monthlyAmount: Math.round((amount * 1.15) / 12),
        totalAmount: Math.round(amount * 1.15),
      },
    ];
  };

  const initiateMobileMoneyPayment = async (
    amount: number,
    phone: string,
    provider: MobileMoneyProvider
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    setProcessing(true);

    try {
      // In production, this would call the actual mobile money API
      // For now, we'll simulate the payment process
      
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: currentUser.id,
          amount,
          currency: providers[provider].currency,
          provider,
          phone,
          status: 'pending',
          payment_type: 'mobile_money',
        })
        .select()
        .single();

      if (paymentError) {
        return { success: false, error: paymentError.message };
      }

      // Simulate STK push / payment request
      // In production: await mobileMoneyAPI.initiatePayment({ amount, phone, provider });
      
      // Simulate payment confirmation after delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', payment.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, transactionId: payment.id };
    } catch (error: any) {
      return { success: false, error: error.message || 'Payment failed' };
    } finally {
      setProcessing(false);
    }
  };

  const initiateInstallmentPayment = async (
    amount: number,
    phone: string,
    provider: MobileMoneyProvider,
    months: number
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    setProcessing(true);

    try {
      const plans = getInstallmentPlans(amount);
      const plan = plans.find(p => p.months === months);
      
      if (!plan) {
        return { success: false, error: 'Invalid installment plan' };
      }

      // Create installment payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: currentUser.id,
          amount: plan.monthlyAmount,
          total_amount: plan.totalAmount,
          currency: providers[provider].currency,
          provider,
          phone,
          status: 'pending',
          payment_type: 'installment',
          installment_months: months,
          installment_plan_id: plan.id,
        })
        .select()
        .single();

      if (paymentError) {
        return { success: false, error: paymentError.message };
      }

      // Create individual installment records
      const installments = [];
      for (let i = 0; i < months; i++) {
        installments.push({
          payment_id: payment.id,
          user_id: currentUser.id,
          installment_number: i + 1,
          amount: plan.monthlyAmount,
          due_date: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: i === 0 ? 'pending' : 'scheduled',
        });
      }

      const { error: installmentsError } = await supabase
        .from('payment_installments')
        .insert(installments);

      if (installmentsError) {
        return { success: false, error: installmentsError.message };
      }

      // Process first installment
      const firstResult = await initiateMobileMoneyPayment(plan.monthlyAmount, phone, provider);
      
      if (!firstResult.success) {
        return firstResult;
      }

      return { success: true, transactionId: payment.id };
    } catch (error: any) {
      return { success: false, error: error.message || 'Payment failed' };
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        selectedProvider,
        selectedInstallment,
        processing,
        setProvider,
        setInstallment,
        initiateMobileMoneyPayment,
        initiateInstallmentPayment,
        getInstallmentPlans,
        clearPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
