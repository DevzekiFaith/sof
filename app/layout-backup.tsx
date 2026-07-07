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
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import NowLearningBar from "./components/ui/NowLearningBar";
import DownloadManager from "./components/ui/DownloadManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Origin — Formation for Life",
  description: "Origin empowers individuals aged 10–45 with essential life and professional skills through structured, stage-based learning. Capital development, persuasion, decision-making, teamwork, and more.",
  icons: {
    icon: "/origin.png",
    apple: "/origin.png",
  },
  openGraph: {
    title: "Origin — Formation for Life",
    description: "Structured, Jesuit-inspired skill formation for every stage of life.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin — Formation for Life",
    description: "Structured, stage-based learning for real-world skills.",
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
                                              <div className="flex flex-col md:flex-row min-h-screen bg-[#121212] text-white">
                                                <Sidebar />
                                                <main className="flex-1 flex flex-col min-w-0 pb-[80px] md:pb-20 relative">
                                                  {children}
                                                </main>
                                                <NowLearningBar />
                                                <BottomNav />
                                                <DownloadManager />
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
