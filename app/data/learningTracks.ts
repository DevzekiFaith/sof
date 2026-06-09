export interface LearningTrack {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  subjects: string[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  courseCount: number;
  ageRange: string;
  etonHarrowLink: string; // Which elite school subject area this maps to
  curriculum?: string[]; // Track-specific curriculum content
  detailedContent?: Module[]; // Detailed module content with lessons
  priceUSD?: number; // One-time purchase price
  priceNGN?: number; // One-time purchase price
  skillId?: string; // Associated skill for progress tracking
  // Udemy/Domestika style metadata
  instructor?: string;
  instructorTitle?: string;
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  thumbnailUrl?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  language?: string;
  lastUpdated?: string;
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  difficulty: string;
}

export interface Lesson {
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'interactive' | 'quiz' | 'project';
  objectives: string[];
}

export const learningTracks: LearningTrack[] = [
  {
    id: "character-values",
    title: "Character & Values",
    emoji: "●",
    tagline: "Courage · Honour · Humility · Fellowship",
    description: "Harrow's four core values — Courage, Honour, Humility and Fellowship — are the backbone of character education. We bring this structured moral development to every child.",
    subjects: ["Ethics & Philosophy", "Emotional Intelligence", "PSHE", "Resilience", "Integrity", "Community Service"],
    color: "#8B5CF6",
    gradientFrom: "#2d1b69",
    gradientTo: "#0f172a",
    courseCount: 4,
    ageRange: "5–18",
    etonHarrowLink: "Harrow core values: Courage, Honour, Humility, Fellowship · Eton: PSHE & character development",
    priceUSD: 50,
    priceNGN: 75000,
    skillId: 'leadership',
    instructor: 'Dr. Sarah Mitchell',
    instructorTitle: 'Former Harrow Housemistress',
    rating: 4.8,
    reviewCount: 1247,
    studentCount: 8542,
    duration: '12 hours',
    level: 'All Levels',
    isBestseller: true,
    language: 'English',
    lastUpdated: 'June 2024',
    curriculum: [
      "Ethics & Moral Philosophy",
      "Emotional Intelligence Development",
      "Personal, Social & Health Education",
      "Resilience & Mental Toughness",
      "Integrity & Ethical Decision-Making",
      "Community Service & Citizenship",
      "Self-Awareness & Reflection",
      "Values-Based Leadership",
      "Character Development",
      "Social Responsibility"
    ],
    detailedContent: [
      {
        title: "Ethics & Moral Philosophy",
        description: "Explore ethical frameworks and develop moral reasoning skills.",
        duration: "8 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Ethical Theories",
            description: "Introduction to major ethical frameworks",
            duration: "50 min",
            type: "video",
            objectives: ["Understand utilitarianism", "Learn deontological ethics", "Apply virtue ethics"]
          },
          {
            title: "Moral Dilemmas",
            description: "Analyze and discuss complex moral situations",
            duration: "60 min",
            type: "interactive",
            objectives: ["Identify ethical conflicts", "Apply ethical frameworks", "Make reasoned decisions"]
          },
          {
            title: "Ethics Project",
            description: "Research and present on an ethical issue",
            duration: "2 weeks",
            type: "project",
            objectives: ["Research ethical issues", "Develop ethical arguments", "Present findings"]
          }
        ]
      },
      {
        title: "Emotional Intelligence Development",
        description: "Build self-awareness, empathy, and emotional regulation skills.",
        duration: "10 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "Self-Awareness",
            description: "Understanding your own emotions and triggers",
            duration: "45 min",
            type: "video",
            objectives: ["Identify emotions", "Recognize triggers", "Practice self-reflection"]
          },
          {
            title: "Empathy Building",
            description: "Develop ability to understand others' perspectives",
            duration: "50 min",
            type: "interactive",
            objectives: ["Practice active listening", "Understand different viewpoints", "Show compassion"]
          },
          {
            title: "Emotional Regulation",
            description: "Learn techniques to manage emotions effectively",
            duration: "40 min",
            type: "video",
            objectives: ["Identify coping strategies", "Practice mindfulness", "Develop emotional control"]
          }
        ]
      }
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    emoji: "▲",
    tagline: "Develop the next generation of leaders",
    description: "Both Eton and Harrow have produced Prime Ministers, heads of state and CEOs. Their leadership development is systematic, starting from age 13. We start even earlier.",
    subjects: ["Leadership Fundamentals", "Entrepreneurship", "Public Speaking & Debate", "Community Leadership", "Project Management", "Decision Making Under Pressure"],
    color: "#F97316",
    gradientFrom: "#431407",
    gradientTo: "#0f172a",
    courseCount: 5,
    ageRange: "5–18",
    etonHarrowLink: "Eton: CCF, 80+ societies, student-led leadership · Harrow: Harrow Prize, community service",
    priceUSD: 50,
    priceNGN: 75000,
    skillId: 'leadership',
    instructor: 'Dr. Sarah Mitchell',
    instructorTitle: 'Former Harrow Housemistress',
    rating: 4.8,
    reviewCount: 1247,
    studentCount: 8542,
    duration: '12 hours',
    level: 'All Levels',
    isBestseller: true,
    language: 'English',
    lastUpdated: 'June 2024',
    curriculum: [
      "Leadership Fundamentals",
      "Entrepreneurship & Innovation",
      "Public Speaking & Debate",
      "Community Leadership",
      "Project Management",
      "Decision Making Under Pressure",
      "Team Building & Management",
      "Strategic Thinking",
      "Ethical Leadership",
      "Global Leadership Perspectives"
    ],
    detailedContent: [
      {
        title: "Leadership Fundamentals",
        description: "Understand core leadership principles and develop your leadership style.",
        duration: "8 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "Leadership Styles",
            description: "Explore different leadership approaches and when to use them",
            duration: "50 min",
            type: "video",
            objectives: ["Identify leadership styles", "Understand situational leadership", "Develop personal style"]
          },
          {
            title: "Communication Skills",
            description: "Master effective communication for leaders",
            duration: "45 min",
            type: "interactive",
            objectives: ["Practice active listening", "Deliver clear messages", "Handle difficult conversations"]
          },
          {
            title: "Leadership Project",
            description: "Lead a team project from start to finish",
            duration: "4 weeks",
            type: "project",
            objectives: ["Apply leadership principles", "Manage team dynamics", "Deliver results"]
          }
        ]
      },
      {
        title: "Entrepreneurship & Innovation",
        description: "Learn to think like an entrepreneur and turn ideas into reality.",
        duration: "10 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Ideation & Innovation",
            description: "Generate and evaluate business ideas",
            duration: "55 min",
            type: "interactive",
            objectives: ["Brainstorm creative solutions", "Validate ideas", "Develop business concepts"]
          },
          {
            title: "Business Planning",
            description: "Create a comprehensive business plan",
            duration: "60 min",
            type: "video",
            objectives: ["Structure business plans", "Financial projections", "Market analysis"]
          },
          {
            title: "Startup Pitch",
            description: "Present your business idea to investors",
            duration: "30 min",
            type: "project",
            objectives: ["Create compelling pitch", "Answer questions confidently", "Persuade effectively"]
          }
        ]
      }
    ],
  },
  {
    id: "classical-thinking",
    title: "Classical Thinking",
    emoji: "◇",
    tagline: "Logic, Philosophy & the Ancient World",
    description: "Both Eton and Harrow require Latin, Philosophy and Ancient History. Classical education builds the sharpest, most disciplined minds. This is the secret weapon of elite education.",
    subjects: ["Philosophy & Ethics", "Logic & Reasoning", "Ancient History", "Latin", "Rhetoric", "Critical Analysis"],
    color: "#D4AF37",
    gradientFrom: "#3d2d00",
    gradientTo: "#0f172a",
    courseCount: 3,
    ageRange: "8–18",
    etonHarrowLink: "Harrow: Latin & Ancient History compulsory Year 9, Philosophy compulsory · Eton: Classics, Greek, Latin",
    priceUSD: 50,
    priceNGN: 75000,
    skillId: 'leadership',
    instructor: 'Dr. Sarah Mitchell',
    instructorTitle: 'Former Harrow Housemistress',
    rating: 4.8,
    reviewCount: 1247,
    studentCount: 8542,
    duration: '12 hours',
    level: 'All Levels',
    isBestseller: true,
    language: 'English',
    lastUpdated: 'June 2024',
    curriculum: [
      "Philosophy & Ethics",
      "Logic & Reasoning",
      "Ancient History",
      "Latin Language & Literature",
      "Rhetoric & Persuasion",
      "Critical Analysis",
      "Classical Literature",
      "Philosophical Inquiry",
      "Historical Thinking",
      "Classical Civilizations"
    ],
    detailedContent: [
      {
        title: "Philosophy & Ethics",
        description: "Study ancient philosophical traditions and their modern applications.",
        duration: "10 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Ancient Greek Philosophy",
            description: "Introduction to Socrates, Plato, and Aristotle",
            duration: "55 min",
            type: "video",
            objectives: ["Understand key philosophers", "Analyze philosophical arguments", "Apply ancient wisdom"]
          },
          {
            title: "Ethical Reasoning",
            description: "Develop skills in ethical analysis and decision-making",
            duration: "50 min",
            type: "interactive",
            objectives: ["Apply ethical frameworks", "Analyze moral dilemmas", "Develop reasoned arguments"]
          },
          {
            title: "Philosophy Essay",
            description: "Write an essay on a philosophical topic",
            duration: "2 weeks",
            type: "project",
            objectives: ["Research philosophical concepts", "Construct arguments", "Write clearly and persuasively"]
          }
        ]
      },
      {
        title: "Logic & Reasoning",
        description: "Master formal logic and critical thinking skills.",
        duration: "8 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Propositional Logic",
            description: "Understanding logical operators and arguments",
            duration: "45 min",
            type: "video",
            objectives: ["Identify logical structures", "Construct valid arguments", "Detect fallacies"]
          },
          {
            title: "Critical Thinking",
            description: "Apply logic to analyze arguments and claims",
            duration: "50 min",
            type: "interactive",
            objectives: ["Evaluate evidence", "Identify biases", "Make sound judgments"]
          },
          {
            title: "Logic Assessment",
            description: "Test your logical reasoning abilities",
            duration: "30 min",
            type: "quiz",
            objectives: ["Solve logic puzzles", "Analyze arguments", "Identify fallacies"]
          }
        ]
      }
    ],
  },
  {
    id: "university-prep",
    title: "University Prep",
    emoji: "⬡",
    tagline: "Oxford · Cambridge · Ivy League ready",
    description: "From Year 9, Eton and Harrow are preparing their students for Oxford, Cambridge and the US Ivy League. Origin gives every child that same multi-year head start.",
    subjects: ["Study Skills & Research", "University Application", "Interview Preparation", "Extended Projects (EPQ)", "UCAS & US Applications", "Academic Writing"],
    color: "#6366F1",
    gradientFrom: "#1e1b4b",
    gradientTo: "#0f172a",
    courseCount: 4,
    ageRange: "12–18",
    etonHarrowLink: "Eton: dedicated university prep, Oxbridge + US Ivies · Harrow: university-style Electives programme",
    priceUSD: 50,
    priceNGN: 75000,
    skillId: 'leadership',
    instructor: 'Dr. Sarah Mitchell',
    instructorTitle: 'Former Harrow Housemistress',
    rating: 4.8,
    reviewCount: 1247,
    studentCount: 8542,
    duration: '12 hours',
    level: 'All Levels',
    isBestseller: true,
    language: 'English',
    lastUpdated: 'June 2024',
    curriculum: [
      "Study Skills & Research Methods",
      "University Application Strategy",
      "Interview Preparation",
      "Extended Projects (EPQ)",
      "UCAS & US Applications",
      "Academic Writing",
      "Standardized Test Prep",
      "Personal Statement Writing",
      "University Selection Strategy",
      "Campus Transition Skills"
    ],
    detailedContent: [
      {
        title: "Study Skills & Research Methods",
        description: "Master advanced study techniques and academic research skills.",
        duration: "8 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Advanced Study Techniques",
            description: "Learn effective note-taking, time management, and memory techniques",
            duration: "50 min",
            type: "video",
            objectives: ["Master note-taking methods", "Develop study schedules", "Improve memory retention"]
          },
          {
            title: "Research Methods",
            description: "Conduct academic research and evaluate sources",
            duration: "55 min",
            type: "interactive",
            objectives: ["Find reliable sources", "Evaluate credibility", "Cite properly"]
          },
          {
            title: "Research Project",
            description: "Complete an independent research project",
            duration: "3 weeks",
            type: "project",
            objectives: ["Formulate research question", "Conduct literature review", "Present findings"]
          }
        ]
      },
      {
        title: "University Application Strategy",
        description: "Navigate the university application process for top-tier institutions.",
        duration: "12 weeks",
        difficulty: "Advanced",
        lessons: [
          {
            title: "Application Overview",
            description: "Understanding application requirements for different systems",
            duration: "45 min",
            type: "video",
            objectives: ["Understand UCAS system", "Know US application requirements", "Compare university systems"]
          },
          {
            title: "Personal Statement",
            description: "Craft compelling personal statements",
            duration: "60 min",
            type: "interactive",
            objectives: ["Write engaging narratives", "Highlight achievements", "Demonstrate fit"]
          },
          {
            title: "Interview Preparation",
            description: "Prepare for university interviews",
            duration: "50 min",
            type: "video",
            objectives: ["Practice common questions", "Develop responses", "Build confidence"]
          }
        ]
      }
    ],
  },
];

export const sofClubs = [
  { id: "debate", name: "Debate Club", emoji: "🗣️", members: 1240, description: "Argue both sides of any issue" },
  { id: "coding", name: "Coding Society", emoji: "💻", members: 2100, description: "Build real apps and games" },
  { id: "entrepreneur", name: "Entrepreneurship Hub", emoji: "🚀", members: 890, description: "Launch your first business idea" },
  { id: "philosophy", name: "Philosophy Circle", emoji: "🧠", members: 560, description: "Ask the big questions of life" },
  { id: "writing", name: "Creative Writing", emoji: "✍️", members: 1450, description: "Tell stories that matter" },
  { id: "science", name: "Science Explorers", emoji: "⚗️", members: 1780, description: "Experiment and discover" },
  { id: "music", name: "Music Makers", emoji: "🎵", members: 920, description: "Compose and perform music" },
  { id: "model-un", name: "Model UN", emoji: "🌐", members: 430, description: "Solve the world's problems" },
  { id: "art", name: "Art Studio", emoji: "🖌️", members: 1100, description: "Express yourself visually" },
  { id: "environment", name: "Eco Warriors", emoji: "🌱", members: 770, description: "Lead environmental change" },
];

export const stretchChallenges = [
  {
    id: "financial-literacy",
    title: "Financial Literacy for Teens",
    description: "Understand money, investing and wealth-building the way elite school graduates do. Build your financial foundations before you turn 18.",
    level: "Challenge",
    levelColor: "#F5C518",
    emoji: "💰",
    duration: "3 weeks",
    for: "Ages 13–18",
  },
  {
    id: "public-speaking",
    title: "Public Speaking Masterclass",
    description: "Learn to speak with authority, persuade any audience, and own any room. Taught to the standard of Eton's debating societies.",
    level: "Expert",
    levelColor: "#EF4444",
    emoji: "🎤",
    duration: "4 weeks",
    for: "Ages 10–18",
  },
  {
    id: "leadership-pressure",
    title: "Leadership Under Pressure",
    description: "How do you lead when everything is going wrong? Study real case studies from military leaders, CEOs and heads of state.",
    level: "Expert",
    levelColor: "#EF4444",
    emoji: "⚡",
    duration: "4 weeks",
    for: "Ages 14–18",
  },
];
