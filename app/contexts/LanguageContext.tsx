"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export type Language = 'en' | 'fr' | 'sw' | 'ar' | 'yo' | 'ha' | 'ig' | 'am';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.library': 'Your Library',
    'nav.cart': 'Cart',
    'nav.alerts': 'Alerts',
    'nav.friends': 'Friends',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Course
    'course.modules': 'Course Modules',
    'course.start': 'Start Learning',
    'course.resume': 'Resume',
    'course.progress': 'Progress',
    'course.completed': 'Completed',
    'course.duration': 'Duration',
    
    // Offline
    'offline.download': 'Download',
    'offline.downloading': 'Downloading',
    'offline.remove': 'Remove',
    'offline.available': 'Available Offline',
    'offline.settings': 'Offline Settings',
    'offline.dataSaver': 'Data Saver Mode',
    'offline.wifiOnly': 'WiFi Only',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.success': 'Success',
    'general.cancel': 'Cancel',
    'general.save': 'Save',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.search': 'Rechercher',
    'nav.library': 'Votre Bibliothèque',
    'nav.cart': 'Panier',
    'nav.alerts': 'Alertes',
    'nav.friends': 'Amis',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    
    // Course
    'course.modules': 'Modules du Cours',
    'course.start': 'Commencer',
    'course.resume': 'Reprendre',
    'course.progress': 'Progression',
    'course.completed': 'Terminé',
    'course.duration': 'Durée',
    
    // Offline
    'offline.download': 'Télécharger',
    'offline.downloading': 'Téléchargement',
    'offline.remove': 'Supprimer',
    'offline.available': 'Disponible hors ligne',
    'offline.settings': 'Paramètres hors ligne',
    'offline.dataSaver': 'Mode économie de données',
    'offline.wifiOnly': 'WiFi uniquement',
    
    // General
    'general.loading': 'Chargement...',
    'general.error': 'Erreur',
    'general.success': 'Succès',
    'general.cancel': 'Annuler',
    'general.save': 'Enregistrer',
    'general.delete': 'Supprimer',
    'general.edit': 'Modifier',
  },
  sw: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.search': 'Tafuta',
    'nav.library': 'Maktaba Yako',
    'nav.cart': 'Kapu',
    'nav.alerts': 'Matangazo',
    'nav.friends': 'Marafiki',
    'nav.profile': 'Wasifu',
    'nav.settings': 'Mipangilio',
    
    // Course
    'course.modules': 'Vitabu vya Kozi',
    'course.start': 'Anza Kujifunza',
    'course.resume': 'Endelea',
    'course.progress': 'Maendeleo',
    'course.completed': 'Imekamilika',
    'course.duration': 'Muda',
    
    // Offline
    'offline.download': 'Pakua',
    'offline.downloading': 'Inapakua',
    'offline.remove': 'Ondoa',
    'offline.available': 'Inapatikana nje ya mtandao',
    'offline.settings': 'Mipangilio ya nje ya mtandao',
    'offline.dataSaver': 'Hifadhi data',
    'offline.wifiOnly': 'WiFi tu',
    
    // General
    'general.loading': 'Inapakia...',
    'general.error': 'Hitilafu',
    'general.success': 'Mafanikio',
    'general.cancel': 'Ghairi',
    'general.save': 'Hifadhi',
    'general.delete': 'Futa',
    'general.edit': 'Hariri',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.search': 'بحث',
    'nav.library': 'مكتبتك',
    'nav.cart': 'السلة',
    'nav.alerts': 'التنبيهات',
    'nav.friends': 'الأصدقاء',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'الإعدادات',
    
    // Course
    'course.modules': 'وحدات الدورة',
    'course.start': 'ابدأ التعلم',
    'course.resume': 'متابعة',
    'course.progress': 'التقدم',
    'course.completed': 'مكتمل',
    'course.duration': 'المدة',
    
    // Offline
    'offline.download': 'تحميل',
    'offline.downloading': 'جاري التحميل',
    'offline.remove': 'إزالة',
    'offline.available': 'متاح دون اتصال',
    'offline.settings': 'إعدادات عدم الاتصال',
    'offline.dataSaver': 'وضع توفير البيانات',
    'offline.wifiOnly': 'WiFi فقط',
    
    // General
    'general.loading': 'جاري التحميل...',
    'general.error': 'خطأ',
    'general.success': 'نجح',
    'general.cancel': 'إلغاء',
    'general.save': 'حفظ',
    'general.delete': 'حذف',
    'general.edit': 'تعديل',
  },
  yo: {
    // Navigation
    'nav.home': 'Ile',
    'nav.search': 'Wa',
    'nav.library': 'Ibuko Re',
    'nav.cart': 'Apo',
    'nav.alerts': 'Iwole',
    'nav.friends': 'Are',
    'nav.profile': 'Ara',
    'nav.settings': 'Eto',
    
    // Course
    'course.modules': 'Eko Iwe',
    'course.start': 'Bere Ko',
    'course.resume': 'Tesiwaju',
    'course.progress': 'Igbega',
    'course.completed': 'Pare',
    'course.duration': 'Aala',
    
    // Offline
    'offline.download': 'Gba',
    'offline.downloading': 'N gba',
    'offline.remove': 'Yo',
    'offline.available': 'Ni lori ayelujara',
    'offline.settings': 'Eto ayelujara',
    'offline.dataSaver': 'Afi data',
    'offline.wifiOnly': 'WiFi nikan',
    
    // General
    'general.loading': 'N gba...',
    'general.error': 'Sise',
    'general.success': 'Aseyori',
    'general.cancel': 'Fagile',
    'general.save': 'Fi pamo',
    'general.delete': 'Pa',
    'general.edit': 'Se',
  },
  ha: {
    // Navigation
    'nav.home': 'Gida',
    'nav.search': 'Bincike',
    'nav.library': 'Laburinka',
    'nav.cart': 'Kofa',
    'nav.alerts': 'Sanarwa',
    'nav.friends': 'Abokai',
    'nav.profile': 'Profile',
    'nav.settings': 'Saituna',
    
    // Course
    'course.modules': 'Darussan Kwas',
    'course.start': 'Fara Karatu',
    'course.resume': 'Cigaba',
    'course.progress': 'Ci gaba',
    'course.completed': 'An kammala',
    'course.duration': 'Lokaci',
    
    // Offline
    'offline.download': 'Zazzage',
    'offline.downloading': 'Ana zazzage',
    'offline.remove': 'Cire',
    'offline.available': 'Akwai ba tare da intanet',
    'offline.settings': 'Saitunan ba tare da intanet',
    'offline.dataSaver': 'Ajiye bayanai',
    'offline.wifiOnly': 'WiFi kawai',
    
    // General
    'general.loading': 'Ana loda...',
    'general.error': 'Kuskure',
    'general.success': 'Nasara',
    'general.cancel': 'Soke',
    'general.save': 'Ajiye',
    'general.delete': 'Share',
    'general.edit': 'Gyara',
  },
  ig: {
    // Navigation
    'nav.home': 'Ulo',
    'nav.search': 'Choo',
    'nav.library': 'Oba akwukwo gi',
    'nav.cart': 'Ntu',
    'nav.alerts': 'Niwu',
    'nav.friends': 'Enyi',
    'nav.profile': 'Profailu',
    'nav.settings': 'Ntola',
    
    // Course
    'course.modules': 'Modulu Nkuzi',
    'course.start': 'Bido Imu',
    'course.resume': 'Gaa nhu',
    'course.progress': 'Mmepe',
    'course.completed': 'Emechara',
    'course.duration': 'Oge',
    
    // Offline
    'offline.download': 'Budata',
    'offline.downloading': 'Na budata',
    'offline.remove': 'Wepu',
    'offline.available': 'Enweta nintaneti',
    'offline.settings': 'Ntola nintaneti',
    'offline.dataSaver': 'Chekwaa data',
    'offline.wifiOnly': 'WiFi naani',
    
    // General
    'general.loading': 'Na budata...',
    'general.error': 'Mmejo',
    'general.success': 'Nke oma',
    'general.cancel': 'Kagbuo',
    'general.save': 'Chekwaa',
    'general.delete': 'Hichapu',
    'general.edit': 'Dezie',
  },
  am: {
    // Navigation
    'nav.home': 'ቤት',
    'nav.search': 'ፈልግ',
    'nav.library': 'የእርስዎ ቤተ መጻህፍት',
    'nav.cart': 'ማሽከሪያ',
    'nav.alerts': 'ማስታወሻዎች',
    'nav.friends': 'ጓደኞች',
    'nav.profile': 'መገለጫ',
    'nav.settings': 'ቅንብሮች',
    
    // Course
    'course.modules': 'የኮርስ ክፍሎች',
    'course.start': 'መማር ጀምር',
    'course.resume': 'ቀጥል',
    'course.progress': 'እድገት',
    'course.completed': 'ተጠናቅቋል',
    'course.duration': 'ጊዜ',
    
    // Offline
    'offline.download': 'አውርድ',
    'offline.downloading': 'በመያዣ ላይ',
    'offline.remove': 'አስወግድ',
    'offline.available': 'የኦፍላይን ይገኛል',
    'offline.settings': 'የኦፍላይን ቅንብሮች',
    'offline.dataSaver': 'የውሂብ አስተካከል',
    'offline.wifiOnly': 'WiFi ብቻ',
    
    // General
    'general.loading': 'በመያዣ ላይ...',
    'general.error': 'ስህተት',
    'general.success': 'ስኬት',
    'general.cancel': 'ሰርዝ',
    'general.save': 'አስቀምጥ',
    'general.delete': 'ሰርዝ',
    'general.edit': 'አርትዕ',
  },
};

const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
  { code: 'sw' as Language, name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' },
  { code: 'yo' as Language, name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ha' as Language, name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ig' as Language, name: 'Igbo', nativeName: 'Igbo' },
  { code: 'am' as Language, name: 'Amharic', nativeName: 'አማርኛ' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadLanguage = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('language')
        .eq('id', currentUser.id)
        .single();

      if (!error && data?.language) {
        setLanguageState(data.language as Language);
      }
    };

    loadLanguage();
  }, [currentUser]);

  // Save language preference to Supabase
  useEffect(() => {
    if (!currentUser) return;

    const saveLanguage = async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ language })
        .eq('id', currentUser.id);
    };

    saveLanguage();
  }, [language, currentUser]);

  // Auto-detect from browser settings on first load
  useEffect(() => {
    if (!currentUser) {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (availableLanguages.find(l => l.code === browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, [currentUser]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
