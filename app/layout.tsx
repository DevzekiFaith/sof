import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Origin — The Education of Spotify",
  description: "Master life's essential skills with our six universal courses. Personalized learning like your favorite music.",
  icons: {
    icon: "/origin.png",
    apple: "/origin.png",
  },
  openGraph: {
    title: "Origin — The Education of Spotify",
    description: "Personalized learning like your favorite music. Six universal courses for life success.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin — The Education of Spotify",
    description: "Personalized learning like your favorite music.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
