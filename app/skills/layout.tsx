import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Life Skills Catalog & Matrix",
  description: "Browse essential human architecture skills: Problem Solving, Decision Making, Communication, Leadership, and Resilience.",
  openGraph: {
    title: "Core Life Skills Catalog | Origin by Mindvest",
    description: "Browse essential human architecture skills: Problem Solving, Decision Making, Communication, Leadership, and Resilience.",
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
