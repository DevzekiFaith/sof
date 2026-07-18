import { STORE_PRODUCTS, StoreProduct } from "./store-products";

export interface CourseEbookMapping {
  courseId: string;
  productId: number;
  badgeText: string;
  hookText: string;
}

export const COURSE_EBOOK_MAPPINGS: CourseEbookMapping[] = [
  {
    courseId: "decision-making",
    productId: 9, // House of Choice
    badgeText: "Recommended eBook",
    hookText: "Align your choices with your true self"
  },
  {
    courseId: "problem-solving",
    productId: 7, // Money Farming
    badgeText: "Wealth Framework",
    hookText: "Stop chasing money. Start farming it."
  },
  {
    courseId: "communication",
    productId: 8, // 8 Q&A to Selling
    badgeText: "Value Exchange",
    hookText: "Articulate your worth and scale your trade"
  },
  {
    courseId: "self-image",
    productId: 10, // Deep-Remake
    badgeText: "Identity Remake",
    hookText: "Break free from limiting beliefs"
  },
  {
    courseId: "personal-adaptability",
    productId: 11, // A FREE GUIDE TO REBUILDING
    badgeText: "Life Rebuilder",
    hookText: "5 timeless principles to rise again"
  },
  {
    courseId: "team-person",
    productId: 1, // Origin Journal
    badgeText: "Growth Journal",
    hookText: "Daily reflection framework for high performance"
  }
];

export function getCompanionProductForCourse(courseId: string): (StoreProduct & { badgeText: string; hookText: string }) | null {
  const mapping = COURSE_EBOOK_MAPPINGS.find((m) => m.courseId === courseId);
  if (!mapping) return null;

  const product = STORE_PRODUCTS.find((p) => p.id === mapping.productId);
  if (!product) return null;

  return {
    ...product,
    badgeText: mapping.badgeText,
    hookText: mapping.hookText
  };
}
