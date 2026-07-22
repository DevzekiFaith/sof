import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Accelerator Masterclasses",
  description: "Browse upcoming live strategy sessions, workshops, webinars, and the JUMPSTART Accelerator program by Mindvest.",
  openGraph: {
    title: "Events & Accelerator Masterclasses | Origin by Mindvest",
    description: "Interactive strategy sessions, workshops, and accelerator masterclasses for human architecture.",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
