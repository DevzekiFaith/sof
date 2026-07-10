import { Book, Shirt, PenTool, Award, LucideIcon } from "lucide-react";

export interface StoreProduct {
  id: number;
  name: string;
  category: "journals" | "ebooks" | "merch" | "hardcopy" | "courses";
  price: number;
  rating: number;
  reviews: number;
  icon: LucideIcon;
  gradient: string;
  imageUrl?: string;
  description: string;
  rawDescription?: string;
  pdfUrl?: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 1,
    name: "The Excellence Journal",
    category: "journals",
    price: 24.99,
    rating: 4.8,
    reviews: 234,
    icon: PenTool,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    description: "Daily journal for personal growth and reflection",
    rawDescription: "<h3>Daily journal for personal growth and reflection</h3><p>Optimize your daily routines, track your progress, and develop high-performance habits with The Excellence Journal. Built for thinkers, builders, and high achievers.</p>"
  },
  {
    id: 3,
    name: "Origin Hoodie",
    category: "merch",
    price: 49.99,
    rating: 4.7,
    reviews: 189,
    icon: Shirt,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    description: "Premium quality hoodie with Origin branding",
    rawDescription: "<h3>Premium quality hoodie with Origin branding</h3><p>Comfort meets purpose. This premium heavyweight hoodie features minimalist design with high-quality embroidery. Perfect for work, study, or travel.</p>"
  },
  {
    id: 4,
    name: "The Art of Becoming (Hardcopy)",
    category: "hardcopy",
    price: 29.99,
    rating: 4.8,
    reviews: 412,
    icon: Book,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    description: "Transform your life through intentional growth",
    rawDescription: "<h3>Transform your life through intentional growth</h3><p>The definitive guide to identity shift, personal architecture, and building systems that ensure growth. Hardcover premium print edition.</p>"
  },
  {
    id: 5,
    name: "Goal Setting Planner",
    category: "journals",
    price: 29.99,
    rating: 4.6,
    reviews: 321,
    icon: PenTool,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
    description: "Plan and track your goals effectively",
    rawDescription: "<h3>Plan and track your goals effectively</h3><p>Set yearly, quarterly, and monthly milestones. Includes review check-ins, focus sheets, and daily planning grids designed to double your productivity.</p>"
  },
  {
    id: 7,
    name: "MONEY FARMING",
    category: "ebooks",
    price: 4.06,
    rating: 4.9,
    reviews: 128,
    icon: Book,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "/poi1-2.png",
    description: "Stop Chasing Money. Start Farming It. Discover the 7 timeless principles to plant, grow, and harvest sustainable wealth—without the financial stress.",
    pdfUrl: "/documents/money-farming.pdf",
    rawDescription: `<h1>Stop Chasing Money. Start Farming It.</h1><p><br></p><h3>Discover the 7 timeless principles to plant, grow, and harvest sustainable wealth—without the financial stress.</h3><p><br></p><h3>The Reality Check</h3><p>Most people spend their lives treating money like a wild animal to be chased. If they stop running, the income stops flowing.</p><p>But the wealthiest people in the world don't chase money. <strong>They farm it.</strong></p><p>They intentionally plant value—skills, assets, and relationships—and nurture them systematically until a massive harvest becomes inevitable. In <strong>Money Farming</strong>, master framework builder Zeki Ubor hands you the exact 7-step blueprint to shift from an exhausted "hunter" to a wealthy "farmer".</p><p><br></p><h3>What You Get Inside (50–70 Pages of Pure Strategy)</h3><p>No fluff. Just highly actionable, simple frameworks to transform your finances:</p><ul><li><strong>The Farming Mindset:</strong> Why money is a harvest, not a mystery.</li><li><strong>Soil Preparation:</strong> Getting your mindset and vision ready for wealth.</li><li><strong>Planting Seeds:</strong> How to seed your life with high-value skills and opportunities.</li><li><strong>Weed Control:</strong> Aggressively eliminating the habits and debts choking your growth.</li><li><strong>The Harvest:</strong> Multiplying your income and building generational systems.</li></ul><p><br></p><h3>Choose Your Blueprint</h3><ul><li><strong>Seed Edition ($9.99 value):</strong> The full <em>Money Farming</em> E-Book.</li><li><strong>Harvest Bundle ($19.99 value):</strong> E-Book + Companion Implementation Worksheet.</li><li><strong>Generational Pass ($49.99 value):</strong> E-Book, Worksheet, + Ticket to the live Masterclass on <strong>June 27, 2026</strong>.</li></ul><p><br></p><p><strong>The ground is ready. The seeds are in your hands.</strong></p><p>Are you going to keep running after paychecks, or are you ready to cultivate permanent wealth?</p>`
  },
  {
    id: 8,
    name: "8 Q&A TO SELLING",
    category: "ebooks",
    price: 3.00,
    rating: 4.8,
    reviews: 94,
    icon: Book,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "/8-qa-to-selling.png",
    description: "For Those Ready to Share Their Unique Value. Articulate your worth and ascend into the elite zone of singular contribution and scale.",
    pdfUrl: "/documents/8-qa-to-selling.pdf",
    rawDescription: `<h1>8 Q&A TO SELLING</h1><p><em>For Those Ready to Share Their Unique Value</em></p><p><br></p><p><strong>By Zeki Ubor</strong></p><p><br></p><p>About the Book</p><p>In a hyper-saturated global marketplace, raw ambition and hard work are no longer enough. The modern economy disproportionately rewards one specific metric: <strong>the strategic exchange of high-tier value.</strong> If you cannot clearly articulate your worth, the market will default to treating your expertise as a cheap, interchangeable commodity.</p><p>In <strong>8 Q&A to Selling</strong>, professional human architect and systems engineer Zeki Ubor strips away passive self-help cliches and transactional sales fluff to deliver a definitive, engineered blueprint for market authority. Built around a highly tactical 8-part question-and-answer framework, this book shifts your paradigm away from standard marketplace competition and pulls you into the elite zone of singular contribution and scale.</p><p>Whether you are an entrepreneur, creator, freelancer, or professional looking to break through income ceilings, this book provides the exact linguistic and operational tools required to transform your specialized skills into a world-class institutional asset.</p><p><br></p><h3>What You Will Discover Inside:</h3><ul><li><strong>The Blueprint of a Specialized Trade:</strong> How to identify, audit, and engineer your unique capability into an undeniable market solution.</li><li><strong>Precision Messaging Frameworks:</strong> The exact steps to reframe your copy and messaging so you cut through the digital noise and pull premium clients inbound pre-sold on your value.</li><li><strong>The 3 Pillars of Market Positioning:</strong> How to ascend from a low-tier commodity provider to a premium, legacy-defining category of one.</li><li><strong>The Physics of Momentum:</strong> Strategies to build data-driven stamina, eliminate operational friction, and generate an unstoppable acceleration loop in your business.</li><li><strong>Scalable Value Liquidity:</strong> How to build systems that distribute immense upfront value to thousands of people simultaneously, establishing an unassailable trust monopoly.</li></ul><p><br></p><h3>Who This Book Is For:</h3><ul><li><strong>Entrepreneurs & Founders</strong> looking to scale their value distribution and dominate their industry vertical.</li><li><strong>Freelancers & Consultants</strong> tired of fighting in a race-to-the-bottom price war who are ready to command premium pricing.</li><li><strong>High-Performing Outliers</strong> ready to stop trading physical hours for money and start architecting a multi-generational legacy.</li></ul><br><blockquote><strong>"The marketplace is waiting—not for perfection, but for authenticity. What will you bring to it?"</strong></blockquote><br><h3>Claim Your Copy Now</h3><p>Stop blending into the noise. Scroll up, click <strong>Buy Now</strong>, and unlock the definitive engineering manual to mastering your trade, capturing your market, and maximizing your unique value.</p>`
  },
  {
    id: 9,
    name: "House of Choice",
    category: "ebooks",
    price: 4.50,
    rating: 4.9,
    reviews: 112,
    icon: Book,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://files.selar.co/product-images/2026/products/zeki-faith1/house-of-choice-selar.com-69f0b5db3bbb2.jpg",
    description: "Discover how your choices shape your essence and master the art of making decisions that align with your true self.",
    pdfUrl: "/documents/house-of-choice.pdf",
    rawDescription: `<h3>Inside the pages of House of Choice, you will:</h3><ul><li>Discover how your choices shape your essence – Understand the profound connection between your decisions and your personal development.</li><li>Master the art of making decisions that align with your true self – Learn practical strategies to ensure your choices support your long-term happiness, success, and fulfillment.</li><li>Overcome internal barriers – Break through limiting beliefs and habits that keep you from making empowering decisions.</li><li>Reshape your mindset – Learn how to create a mindset of growth, confidence, and resilience.</li></ul><p>Whether you are facing major life decisions or simply want to deepen your understanding of how your choices influence your life, House of Choice provides you with the tools and insights to make every decision with clarity and purpose.</p><p><br></p><p><strong>How this Book Will Benefit You:</strong></p><ul><li>Gain the confidence to make choices that align with your true purpose and values.</li><li>Transform limiting beliefs into empowering actions.</li><li>Learn how to unlock your potential and step into your most authentic self.</li><li>Receive a roadmap for navigating life’s toughest decisions with ease and alignment.</li></ul><p>If you’re ready to stop being a passive observer in your own life and begin creating the future you deserve, House of Choice is the book for you. Take the first step toward reshaping your decisions and transforming your essence today!</p>`
  },
  {
    id: 10,
    name: "Deep-Remake",
    category: "ebooks",
    price: 4.50,
    rating: 4.8,
    reviews: 86,
    icon: Book,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://files.selar.co/product-images/2026/products/zeki-faith1/deep-remake-selar.com-69f0b0c556158.jpg",
    description: "A powerful transformation journey that empowers individuals to break free from limiting beliefs and societal labels.",
    pdfUrl: "/documents/deep-remake.pdf",
    rawDescription: `<p>Deep Re-Make by Zeki Faith offers a powerful transformation journey that empowers individuals to break free from limiting beliefs and societal labels. </p><p>It identifies the hidden barriers that prevent growth—referred to as "personal tokenism"—and provides practical solutions for overcoming these constraints. </p><p>By challenging your internalized fears and self-doubt, this book encourages you to reshape your identity and cultivate new, empowering thoughts. </p><p>It's a guide to unlocking your true potential, aligning your actions with your goals, and creating a fulfilling life that reflects your highest aspirations. Start today, and embrace the power of thought to design your own destiny.</p><p><br></p><p><strong>what you can gain from Deep Re-Make by Zeki Faith:</strong></p><ul><li><strong>Break Free from Limiting Beliefs</strong>: Learn to identify and eliminate self-imposed barriers that hold you back from achieving your full potential.</li><li><strong>Cultivate a Growth-Oriented Mindset</strong>: Shift from a fixed mindset to one that embraces challenges, resilience, and continuous learning.</li><li><strong>Design Your Life with Intention</strong>: Gain the tools to consciously create and work toward a life that aligns with your purpose and values.</li><li><strong>Build Discipline through Daily Habits</strong>: Discover practical strategies for developing consistency and discipline in your daily routines that shape long-term success.</li><li><strong>Harness the Power of Vision and Purpose</strong>: Learn how to craft a division and discover your deeper purpose, driving you toward a life of fulfillment and impact.</li></ul><p>This book provides the blueprint for transforming your life by shifting your mindset and aligning your actions with your deepest aspirations.</p>`
  },
  {
    id: 11,
    name: "A FREE GUIDE TO REBUILDING",
    category: "ebooks",
    price: 0.00,
    rating: 4.9,
    reviews: 215,
    icon: Book,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "https://files.selar.co/product-images/2025/products/zeki-faith1/a-free-guide-to-rebuildin-selar.com-68f80c4215991.png",
    description: "Life may have broken your plans, but it hasn't broken your purpose. Discover 5 timeless principles to rebuild your life.",
    pdfUrl: "/documents/a-free-guide-to-rebuilding.pdf",
    rawDescription: `<p>Life may have broken your plans, but it hasn’t broken your purpose.</p><p>It’s time to rise again — stronger, wiser, and different.</p><p>In this short yet powerful guide, “Rebuild Like Ezra,” you’ll discover 5 timeless principles for rebuilding your life, business, and purpose when everything seems lost.</p><p>It’s raw. It’s real. And it’s written for you.</p><ul><li>💡 Rebuild your mindset.</li><li>🔥 Reignite your faith.</li><li>🌱 Redefine your story.</li></ul>`
  },
  {
    id: 12,
    name: "MASTERCLASS: Becoming a Person of Interest(POI) - Money Farmer",
    category: "courses",
    price: 11.06,
    rating: 4.9,
    reviews: 340,
    icon: Award,
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    imageUrl: "/poi1-3.png",
    description: "Stop Blending In. Start Architecting Your Influence. GoogleMeet LIVE intensive 3-hour masterclass by Zeki Ubor.",
    rawDescription: `<h1>Stop Blending In. Start Architecting Your Influence.</h1><p>If your brand could speak right now... <em>what would it be saying?</em></p><p>Is it <strong>clear or confusing</strong>? Is it <strong>intentional or random</strong>? Is it <strong>premium or basic</strong>?</p><p>In a crowded professional landscape, talent alone is no longer enough. You can be the most skilled architect, engineer, or professional in your field, but if your structural design—your personal brand and professional strategy—is flawed, your career will inevitably stall.</p><p>You don’t have a lack of skill. You have a lack of strategic architecture.</p><p><strong>Secure Your Seat for June 27th</strong></p><br><h2>Introducing the Concept of Human Architecture</h2><p>This is not a motivational talk filled with generic cliches. This is a <strong>structural audit</strong> for your professional life.</p><p>As an architect and frontend engineer with over a decade of experience optimizing systems and designing spaces that stand the test of time, I am bringing those exact blueprint principles to your personal capital development.</p><p>We are going to treat your reputation, your visibility, and your income potential like a high-end monument: built with precision, engineered for scale, and designed to last.</p><br><h2>What You Will Master in This 3-Hour Live Intensive</h2><p>Inside this systematic masterclass, we will deep-dive into three critical phases:</p><ul><li><strong>Phase 1: Audit Your Foundation:</strong> Identify the hidden structural flaws in your current positioning that are actively preventing you from being recognized as a premium authority.</li><li><strong>Phase 2: Refactor Your Professional 'UI/UX':</strong> Optimize how you package your skills, communicate your high ticket value, and organically attract premium clients and global networks.</li><li><strong>Phase 3: Launch Your Growth Sprint:</strong> Walk away with an actionable execution blueprint for your first 21-day \"Refactor\" and 21-day \"Optimization\" cycles so you can maintain long-term momentum.</li></ul><br><h2>Who This Is For</h2><ul><li><strong>Professionals, Architects, and Engineers</strong> who know they are under-leveraging their potential and leaving money on the table.</li><li><strong>Corporate & Creative Experts</strong> ready to transition from being invisible, hard-working employees to highly sought-after industry assets.</li><li><strong>Anyone Tired of Guessing</strong> how to grow and ready for a predictable, engineering-based framework for personal transformation.</li></ul><br><h2>Your Limited-Time Investment</h2><p>We are opening the doors for our upcoming cohort with exclusive tiered pricing. Once slots are full, registration closes automatically to ensure a high-quality workshop experience.</p><ul><li><strong>Standard Pass:</strong> ~~₦65,000~~</li><li><strong>Live Stream Discount:</strong> <strong>₦25,000</strong></li><li><strong>Early-Bird Special:</strong> <strong>₦15,000</strong> <em>(Available for a limited time only)</em></li></ul><br><h3><strong>Event Details</strong></h3><ul><li><strong>Platform:</strong> GoogleMeet LIVE</li><li><strong>Date:</strong> Last Saturday of the Month — <strong>June 27, 2026</strong></li><li><strong>Host:</strong> Zeki Ubor (<em>Founder, The Becoming Institute</em>)</li></ul><br><h3><strong>The Blueprint Is Ready. Are You?</strong></h3><p>Stop leaving your professional success to chance. Start building with intention.</p><p><strong>REGISTER NOW FOR THE MASTERCLASS</strong></p>`
  },
];

export function getProductById(id: string | number): StoreProduct | null {
  const numericId = typeof id === "string" ? parseInt(id.replace("store-", "")) : id;
  return STORE_PRODUCTS.find((p) => p.id === numericId) || null;
}
