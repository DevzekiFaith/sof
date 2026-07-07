"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface SMSTemplate {
  id: string;
  name: string;
  type: 'notification' | 'reminder' | 'content' | 'quiz';
  template: string;
  variables: string[];
}

export interface USSDMenu {
  id: string;
  title: string;
  options: {
    id: string;
    label: string;
    action: string;
    nextMenu?: string;
  }[];
}

export interface SMSLog {
  id: string;
  userId: string;
  phoneNumber: string;
  message: string;
  type: 'sent' | 'received';
  status: 'pending' | 'delivered' | 'failed';
  sentAt: Date;
}

interface SMSContextType {
  templates: SMSTemplate[];
  ussdMenus: USSDMenu[];
  smsLogs: SMSLog[];
  loading: boolean;
  sendSMS: (phoneNumber: string, templateId: string, variables: Record<string, string>) => Promise<void>;
  sendUSSD: (phoneNumber: string, menuId: string, optionId: string) => Promise<void>;
  getSMSLogs: (userId: string) => Promise<SMSLog[]>;
  refreshData: () => Promise<void>;
}

const SMSContext = createContext<SMSContextType | undefined>(undefined);

const DEFAULT_TEMPLATES: SMSTemplate[] = [
  {
    id: 'course_reminder',
    name: 'Course Reminder',
    type: 'reminder',
    template: 'Hi {{name}}, don\'t forget to continue your "{{course}}" course! You\'re on module {{module}}. Learn at {{url}}',
    variables: ['name', 'course', 'module', 'url'],
  },
  {
    id: 'streak_alert',
    name: 'Streak Alert',
    type: 'notification',
    template: '🔥 {{name}}, your {{streak}}-day streak is at risk! Complete a lesson today to keep it going.',
    variables: ['name', 'streak'],
  },
  {
    id: 'achievement_unlock',
    name: 'Achievement Unlocked',
    type: 'notification',
    template: '🎉 {{name}}, you unlocked "{{achievement}}"! Keep up the great work!',
    variables: ['name', 'achievement'],
  },
  {
    id: 'content_summary',
    name: 'Content Summary',
    type: 'content',
    template: 'Module {{module}} Summary: {{summary}}. Key points: {{points}}. Full content at {{url}}',
    variables: ['module', 'summary', 'points', 'url'],
  },
];

const DEFAULT_USSD_MENUS: USSDMenu[] = [
  {
    id: 'main',
    title: 'Origin Learning',
    options: [
      { id: '1', label: 'My Courses', action: 'list_courses', nextMenu: 'courses' },
      { id: '2', label: 'My Progress', action: 'show_progress' },
      { id: '3', label: 'Download Content', action: 'download_content', nextMenu: 'download' },
      { id: '4', label: 'Quiz', action: 'start_quiz', nextMenu: 'quiz' },
      { id: '5', label: 'Help', action: 'show_help', nextMenu: 'help' },
    ],
  },
  {
    id: 'courses',
    title: 'My Courses',
    options: [
      { id: '1', label: 'Decision-Making', action: 'view_course', nextMenu: 'course_detail' },
      { id: '2', label: 'Self-Image', action: 'view_course', nextMenu: 'course_detail' },
      { id: '3', label: 'Communication', action: 'view_course', nextMenu: 'course_detail' },
      { id: '0', label: 'Back', action: 'back', nextMenu: 'main' },
    ],
  },
  {
    id: 'download',
    title: 'Download Content',
    options: [
      { id: '1', label: 'Download Current Module', action: 'download_module' },
      { id: '2', label: 'Download Full Course', action: 'download_course' },
      { id: '0', label: 'Back', action: 'back', nextMenu: 'main' },
    ],
  },
  {
    id: 'help',
    title: 'Help',
    options: [
      { id: '1', label: 'How to Use', action: 'show_instructions' },
      { id: '2', label: 'Contact Support', action: 'contact_support' },
      { id: '0', label: 'Back', action: 'back', nextMenu: 'main' },
    ],
  },
];

export function SMSProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [templates, setTemplates] = useState<SMSTemplate[]>(DEFAULT_TEMPLATES);
  const [ussdMenus, setUSSDMenus] = useState<USSDMenu[]>(DEFAULT_USSD_MENUS);
  const [smsLogs, setSMSLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  const refreshData = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      // Load custom templates from Supabase
      const { data: templatesData, error: templatesError } = await supabase
        .from('sms_templates')
        .select('*');

      if (!templatesError && templatesData && templatesData.length > 0) {
        const formattedTemplates = templatesData.map((t: any) => ({
          id: t.id,
          name: t.name,
          type: t.type,
          template: t.template,
          variables: t.variables || [],
        }));
        setTemplates(formattedTemplates);
      }

      // Load custom USSD menus from Supabase
      const { data: menusData, error: menusError } = await supabase
        .from('ussd_menus')
        .select('*');

      if (!menusError && menusData && menusData.length > 0) {
        const formattedMenus = menusData.map((m: any) => ({
          id: m.id,
          title: m.title,
          options: m.options || [],
        }));
        setUSSDMenus(formattedMenus);
      }

      // Load SMS logs
      await getSMSLogs(currentUser.id);
    } catch (error) {
      // Error loading SMS data
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async (
    phoneNumber: string,
    templateId: string,
    variables: Record<string, string>
  ) => {
    if (!currentUser) return;

    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Replace variables in template
      let message = template.template;
      Object.entries(variables).forEach(([key, value]) => {
        message = message.replace(`{{${key}}}`, value);
      });

      // Log the SMS
      const { error } = await supabase.from('sms_logs').insert({
        user_id: currentUser.id,
        phone_number: phoneNumber,
        message,
        type: 'sent',
        status: 'pending',
      });

      if (error) throw error;

      // In production, integrate with SMS gateway (e.g., Twilio, Africa's Talking)
      // await smsGateway.send({ to: phoneNumber, message });

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const sendUSSD = async (phoneNumber: string, menuId: string, optionId: string) => {
    if (!currentUser) return;

    try {
      const menu = ussdMenus.find(m => m.id === menuId);
      if (!menu) {
        throw new Error('Menu not found');
      }

      const option = menu.options.find(o => o.id === optionId);
      if (!option) {
        throw new Error('Option not found');
      }

      // Log the USSD interaction
      const { error } = await supabase.from('ussd_logs').insert({
        user_id: currentUser.id,
        phone_number: phoneNumber,
        menu_id: menuId,
        option_id: optionId,
        action: option.action,
      });

      if (error) throw error;

      // In production, integrate with USSD gateway
      // await ussdGateway.execute({ phoneNumber, menuId, optionId });

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const getSMSLogs = async (userId: string): Promise<SMSLog[]> => {
    try {
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedLogs = (data || []).map((log: any) => ({
        id: log.id,
        userId: log.user_id,
        phoneNumber: log.phone_number,
        message: log.message,
        type: log.type,
        status: log.status,
        sentAt: new Date(log.sent_at),
      }));

      setSMSLogs(formattedLogs);
      return formattedLogs;
    } catch (error) {
      return [];
    }
  };

  return (
    <SMSContext.Provider
      value={{
        templates,
        ussdMenus,
        smsLogs,
        loading,
        sendSMS,
        sendUSSD,
        getSMSLogs,
        refreshData,
      }}
    >
      {children}
    </SMSContext.Provider>
  );
}

export function useSMS() {
  const context = useContext(SMSContext);
  if (context === undefined) {
    throw new Error('useSMS must be used within an SMSProvider');
  }
  return context;
}
