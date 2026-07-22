import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Origin — Practical Education for Becoming",
  description: "Learn about Origin by Mindvest and our mission to provide human architecture and practical life education for personal mastery.",
  openGraph: {
    title: "About Origin | Origin by Mindvest",
    description: "Learn about Origin by Mindvest and our mission to provide human architecture and practical life education.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
