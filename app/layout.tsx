import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { SocialProvider } from "./contexts/SocialContext";
import { CommunityProvider } from "./contexts/CommunityContext";
import { RecommendationProvider } from "./contexts/RecommendationContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { OfflineProvider } from "./contexts/OfflineContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SyncProvider } from "./contexts/SyncContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { TeacherProvider } from "./contexts/TeacherContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { WomenHubProvider } from "./contexts/WomenHubContext";
import { AIRecommendationProvider } from "./contexts/AIRecommendationContext";
import { SMSProvider } from "./contexts/SMSContext";
import { PodcastProvider } from "./contexts/PodcastContext";
import { ToastProvider } from "./contexts/ToastContext";
import { CartProvider } from "./contexts/CartContext";
import SimplifiedHeader from "./components/layout/SimplifiedHeader";
import SimplifiedFooter from "./components/layout/SimplifiedFooter";
import WhatsAppWidget from "./components/ui/WhatsAppWidget";

const geistSans = { variable: "font-sans" };
const geistMono = { variable: "font-mono" };

export const metadata: Metadata = {
  metadataBase: new URL('https://sof-beta.vercel.app'),
  title: {
    default: "Origin by Mindvest — Practical Education for Becoming",
    template: "%s | Origin by Mindvest",
  },
  description: "Master life's essential skills with human architecture, accelerator programs, and practical learning designed for personal transformation.",
  keywords: [
    "Origin",
    "Mindvest",
    "Human Architecture",
    "Practical Education",
    "JUMPSTART Accelerator",
    "Personal Mastery",
    "Solution Mindset",
    "Decision Making",
    "Leadership Skills",
    "Character Development",
  ],
  authors: [{ name: "Mindvest Faculty", url: "https://sof-beta.vercel.app" }],
  creator: "Mindvest",
  publisher: "Origin by Mindvest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/origin.png",
    apple: "/origin.png",
  },
  openGraph: {
    title: "Origin by Mindvest — Practical Education for Becoming",
    description: "Practical education for becoming. Transformative learning designed around human architecture.",
    url: "https://sof-beta.vercel.app",
    siteName: "Origin by Mindvest",
    images: [
      {
        url: "/jumpstart_cover.png",
        width: 1200,
        height: 630,
        alt: "Origin by Mindvest — Practical Education for Becoming",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin by Mindvest — Practical Education for Becoming",
    description: "Practical education for becoming. Transformative learning designed around human architecture.",
    images: ["/jumpstart_cover.png"],
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://sof-beta.vercel.app/#organization",
      "name": "Origin by Mindvest",
      "url": "https://sof-beta.vercel.app",
      "logo": "https://sof-beta.vercel.app/origin.png",
      "description": "Practical education for becoming through human architecture and transformative learning programs.",
      "sameAs": [
        "https://sof-beta.vercel.app"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://sof-beta.vercel.app/#website",
      "url": "https://sof-beta.vercel.app",
      "name": "Origin by Mindvest",
      "description": "Master life's essential skills with human architecture.",
      "publisher": {
        "@id": "https://sof-beta.vercel.app/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <UserProvider>
          <ThemeProvider>
            <GamificationProvider>
              <SocialProvider>
                <CommunityProvider>
                  <RecommendationProvider>
                    <ProgressProvider>
                      <OfflineProvider>
                        <LanguageProvider>
                          <SyncProvider>
                            <PaymentProvider>
                              <TeacherProvider>
                                <AccessibilityProvider>
                                  <WomenHubProvider>
                                    <AIRecommendationProvider>
                                      <SMSProvider>
                                        <PodcastProvider>
                                          <ToastProvider>
                                            <CartProvider>
                                              <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white">
                                                <SimplifiedHeader />
                                                <main className="flex-1">
                                                  {children}
                                                </main>
                                                <SimplifiedFooter />
                                                <WhatsAppWidget />
                                              </div>
                                            </CartProvider>
                                          </ToastProvider>
                                        </PodcastProvider>
                                      </SMSProvider>
                                    </AIRecommendationProvider>
                                  </WomenHubProvider>
                                </AccessibilityProvider>
                              </TeacherProvider>
                            </PaymentProvider>
                          </SyncProvider>
                        </LanguageProvider>
                      </OfflineProvider>
                    </ProgressProvider>
                  </RecommendationProvider>
                </CommunityProvider>
              </SocialProvider>
            </GamificationProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
