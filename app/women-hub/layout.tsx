import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Empowerment & Leadership Hub",
  description: "Exclusive leadership tracks, mentorship circles, and capital development courses for female leaders and entrepreneurs.",
  openGraph: {
    title: "Women's Empowerment Hub | Origin by Mindvest",
    description: "Exclusive leadership tracks, mentorship circles, and capital development courses for female leaders and entrepreneurs.",
  },
};

export default function WomenHubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
