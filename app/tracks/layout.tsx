import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Tracks & Mastery Pathways",
  description: "Curated learning tracks inspired by top leadership institutions, tailored for character, values, and strategic effectiveness.",
  openGraph: {
    title: "Learning Tracks & Mastery Pathways | Origin by Mindvest",
    description: "Curated learning tracks inspired by top leadership institutions, tailored for character, values, and strategic effectiveness.",
  },
};

export default function TracksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
