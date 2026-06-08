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
  priceUSD?: number;
  priceNGN?: number;
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
    id: "sciences-stem",
    title: "Sciences & STEM",
    emoji: "◽",
    tagline: "Think like a scientist",
    description: "Master mathematics, sciences and technology through rigorous, hands-on learning. The same STEM curriculum that Eton and Harrow demand from their students.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Engineering"],
    color: "#3B82F6",
    gradientFrom: "#1e3a5f",
    gradientTo: "#0f172a",
    courseCount: 6,
    ageRange: "5–18",
    etonHarrowLink: "Eton: 28 subjects including all sciences · Harrow: All 3 sciences compulsory in Year 9",
    priceUSD: 50,
    priceNGN: 75000,
    curriculum: [
      "Mathematical Foundations",
      "Scientific Method & Inquiry",
      "Physics: Motion & Forces",
      "Chemistry: Matter & Reactions",
      "Biology: Living Systems",
      "Computer Science Fundamentals",
      "Engineering Design Process",
      "Data Analysis & Statistics",
      "Laboratory Skills",
      "STEM Project-Based Learning"
    ],
    detailedContent: [
      {
        title: "Mathematical Foundations",
        description: "Build a strong mathematical foundation covering algebra, geometry, and calculus concepts essential for STEM.",
        duration: "8 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Algebra Fundamentals",
            description: "Master algebraic expressions, equations, and inequalities",
            duration: "45 min",
            type: "video",
            objectives: ["Solve linear equations", "Understand algebraic expressions", "Apply algebra to real-world problems"]
          },
          {
            title: "Geometry & Spatial Reasoning",
            description: "Explore geometric shapes, angles, and spatial relationships",
            duration: "50 min",
            type: "interactive",
            objectives: ["Identify geometric properties", "Calculate area and perimeter", "Understand transformations"]
          },
          {
            title: "Calculus Introduction",
            description: "Introduction to derivatives, integrals, and their applications",
            duration: "60 min",
            type: "video",
            objectives: ["Understand limits", "Calculate basic derivatives", "Apply calculus to motion problems"]
          },
          {
            title: "Math Assessment",
            description: "Test your understanding of mathematical concepts",
            duration: "30 min",
            type: "quiz",
            objectives: ["Demonstrate problem-solving skills", "Apply concepts to complex problems"]
          }
        ]
      },
      {
        title: "Scientific Method & Inquiry",
        description: "Learn the systematic approach to scientific investigation and critical thinking.",
        duration: "6 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "The Scientific Method",
            description: "Understanding the steps of scientific inquiry",
            duration: "40 min",
            type: "video",
            objectives: ["Identify scientific method steps", "Formulate hypotheses", "Design experiments"]
          },
          {
            title: "Data Collection & Analysis",
            description: "Techniques for gathering and analyzing scientific data",
            duration: "55 min",
            type: "interactive",
            objectives: ["Collect accurate data", "Analyze trends", "Draw valid conclusions"]
          },
          {
            title: "Research Project",
            description: "Conduct your own scientific investigation",
            duration: "2 weeks",
            type: "project",
            objectives: ["Apply scientific method", "Present findings", "Evaluate peer research"]
          }
        ]
      },
      {
        title: "Physics: Motion & Forces",
        description: "Explore the fundamental principles of motion, forces, and energy.",
        duration: "8 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Kinematics",
            description: "Study of motion without considering forces",
            duration: "50 min",
            type: "video",
            objectives: ["Understand velocity and acceleration", "Solve motion problems", "Analyze motion graphs"]
          },
          {
            title: "Newton's Laws",
            description: "Fundamental laws of motion and force",
            duration: "55 min",
            type: "interactive",
            objectives: ["Apply Newton's three laws", "Calculate forces", "Understand equilibrium"]
          },
          {
            title: "Energy & Work",
            description: "Conservation of energy and work principles",
            duration: "45 min",
            type: "video",
            objectives: ["Calculate work and power", "Understand energy conservation", "Apply energy principles"]
          },
          {
            title: "Physics Lab",
            description: "Hands-on experiments with motion and forces",
            duration: "90 min",
            type: "interactive",
            objectives: ["Conduct physics experiments", "Measure motion", "Analyze experimental data"]
          }
        ]
      }
    ],
  },
  {
    id: "arts-creativity",
    title: "Arts & Creativity",
    emoji: "◾",
    tagline: "Create, perform, express",
    description: "Drama, music, visual arts and creative writing are core at Eton and Harrow — not extras. At Origin, every child gets professional-standard creative education.",
    subjects: ["Drama & Theatre", "Music & Composition", "Visual Art", "Creative Writing", "Storytelling", "Film & Photography"],
    color: "#EC4899",
    gradientFrom: "#4a1942",
    gradientTo: "#0f172a",
    courseCount: 5,
    ageRange: "5–18",
    etonHarrowLink: "Eton: large-scale productions each term · Harrow: professional-standard theatre & music",
    priceUSD: 50,
    priceNGN: 75000,
    curriculum: [
      "Drama & Performance Techniques",
      "Music Theory & Composition",
      "Visual Arts Fundamentals",
      "Creative Writing Workshop",
      "Storytelling & Narrative Structure",
      "Film & Photography Basics",
      "Art History & Appreciation",
      "Creative Expression",
      "Portfolio Development",
      "Public Performance"
    ],
    detailedContent: [
      {
        title: "Drama & Performance Techniques",
        description: "Master the art of performance through acting techniques, stage presence, and character development.",
        duration: "8 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "Acting Fundamentals",
            description: "Introduction to acting techniques and methods",
            duration: "50 min",
            type: "video",
            objectives: ["Understand character development", "Practice vocal projection", "Learn stage presence"]
          },
          {
            title: "Scene Study",
            description: "Analyze and perform scenes from classic plays",
            duration: "60 min",
            type: "interactive",
            objectives: ["Analyze dramatic text", "Develop authentic characters", "Perform with emotional depth"]
          },
          {
            title: "Performance Project",
            description: "Prepare and perform a monologue or scene",
            duration: "2 weeks",
            type: "project",
            objectives: ["Apply acting techniques", "Receive and incorporate feedback", "Deliver polished performance"]
          }
        ]
      },
      {
        title: "Music Theory & Composition",
        description: "Learn music theory fundamentals and create your own compositions.",
        duration: "10 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "Music Fundamentals",
            description: "Notes, scales, intervals, and basic harmony",
            duration: "45 min",
            type: "video",
            objectives: ["Read musical notation", "Understand scales and keys", "Identify intervals"]
          },
          {
            title: "Composition Workshop",
            description: "Create your own musical pieces",
            duration: "90 min",
            type: "interactive",
            objectives: ["Apply music theory", "Compose melodies", "Arrange harmonies"]
          },
          {
            title: "Performance & Recording",
            description: "Record and perform your compositions",
            duration: "60 min",
            type: "project",
            objectives: ["Use digital audio tools", "Record compositions", "Present musical work"]
          }
        ]
      }
    ],
  },
  {
    id: "languages",
    title: "Languages",
    emoji: "○",
    tagline: "Speak the world's languages",
    description: "Eton offers 10 languages. Harrow requires students to choose two foreign languages from Year 9. Every Origin child starts their global communication journey here.",
    subjects: ["English Language & Literature", "French", "Spanish", "Mandarin Chinese", "Arabic", "Latin"],
    color: "#F59E0B",
    gradientFrom: "#4a3000",
    gradientTo: "#0f172a",
    courseCount: 6,
    ageRange: "5–18",
    etonHarrowLink: "Eton: 10 modern & classical languages offered · Harrow: 2 languages compulsory from Year 9",
    priceUSD: 50,
    priceNGN: 75000,
    curriculum: [
      "English Language Mastery",
      "French Language & Culture",
      "Spanish Language & Culture",
      "Mandarin Chinese Fundamentals",
      "Arabic Language & Script",
      "Latin Language & Literature",
      "Linguistics & Language Structure",
      "Cross-Cultural Communication",
      "Literature Analysis",
      "Translation & Interpretation"
    ],
    detailedContent: [
      {
        title: "English Language Mastery",
        description: "Achieve fluency in English language through comprehensive grammar, vocabulary, and communication skills.",
        duration: "12 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "Grammar Foundations",
            description: "Master English grammar rules and sentence structure",
            duration: "45 min",
            type: "video",
            objectives: ["Understand parts of speech", "Construct proper sentences", "Avoid common errors"]
          },
          {
            title: "Vocabulary Building",
            description: "Expand your vocabulary with advanced words and expressions",
            duration: "40 min",
            type: "interactive",
            objectives: ["Learn new vocabulary daily", "Use context clues", "Apply words in context"]
          },
          {
            title: "Writing Workshop",
            description: "Practice writing essays, reports, and creative pieces",
            duration: "60 min",
            type: "project",
            objectives: ["Write structured essays", "Develop writing style", "Edit and revise work"]
          }
        ]
      },
      {
        title: "French Language & Culture",
        description: "Learn French language while exploring French culture and civilization.",
        duration: "10 weeks",
        difficulty: "Intermediate",
        lessons: [
          {
            title: "French Basics",
            description: "Introduction to French pronunciation and basic phrases",
            duration: "50 min",
            type: "video",
            objectives: ["Master French pronunciation", "Learn essential phrases", "Understand basic grammar"]
          },
          {
            title: "Conversation Practice",
            description: "Practice speaking French in real-world scenarios",
            duration: "45 min",
            type: "interactive",
            objectives: ["Hold basic conversations", "Ask and answer questions", "Use common expressions"]
          },
          {
            title: "Cultural Project",
            description: "Explore French culture through research and presentation",
            duration: "2 weeks",
            type: "project",
            objectives: ["Research French culture", "Present findings in French", "Understand cultural context"]
          }
        ]
      }
    ],
  },
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
    id: "sport-wellbeing",
    title: "Sport & Wellbeing",
    emoji: "△",
    tagline: "A healthy body, a powerful mind",
    description: "At Eton and Harrow, sport is built into the weekly timetable — it is never optional. Origin treats physical and mental wellbeing as non-negotiable parts of a complete education.",
    subjects: ["Physical Education", "Mindfulness & Meditation", "Nutrition & Health", "Team Sports", "Mental Health", "Yoga & Movement"],
    color: "#10B981",
    gradientFrom: "#064e3b",
    gradientTo: "#0f172a",
    courseCount: 4,
    ageRange: "5–18",
    etonHarrowLink: "Harrow: sport embedded in weekly timetable · Eton: sports & aquatic centre, daily participation",
    priceUSD: 50,
    priceNGN: 75000,
    curriculum: [
      "Physical Fitness Training",
      "Mindfulness & Meditation Practices",
      "Nutrition & Healthy Eating",
      "Team Sports & Collaboration",
      "Mental Health Awareness",
      "Yoga & Movement Arts",
      "Athletic Development",
      "Stress Management",
      "Wellbeing Habits",
      "Sports Leadership"
    ],
    detailedContent: [
      {
        title: "Physical Fitness Training",
        description: "Develop strength, endurance, and flexibility through structured fitness programs.",
        duration: "8 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "Fitness Fundamentals",
            description: "Introduction to exercise physiology and proper form",
            duration: "45 min",
            type: "video",
            objectives: ["Understand exercise principles", "Learn proper form", "Create workout plans"]
          },
          {
            title: "Strength Training",
            description: "Build muscle and improve body composition",
            duration: "50 min",
            type: "interactive",
            objectives: ["Master strength exercises", "Progressive overload", "Track progress"]
          },
          {
            title: "Fitness Assessment",
            description: "Test your fitness levels and set goals",
            duration: "30 min",
            type: "quiz",
            objectives: ["Measure fitness metrics", "Set realistic goals", "Create improvement plan"]
          }
        ]
      },
      {
        title: "Mindfulness & Meditation Practices",
        description: "Learn mindfulness techniques for mental clarity and stress reduction.",
        duration: "6 weeks",
        difficulty: "Beginner",
        lessons: [
          {
            title: "Introduction to Mindfulness",
            description: "Understanding mindfulness and its benefits",
            duration: "40 min",
            type: "video",
            objectives: ["Understand mindfulness", "Practice basic techniques", "Apply to daily life"]
          },
          {
            title: "Meditation Practice",
            description: "Guided meditation sessions for beginners",
            duration: "30 min",
            type: "interactive",
            objectives: ["Practice meditation", "Develop focus", "Reduce stress"]
          },
          {
            title: "Mindfulness Challenge",
            description: "30-day mindfulness practice challenge",
            duration: "30 days",
            type: "project",
            objectives: ["Daily mindfulness practice", "Track progress", "Reflect on benefits"]
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
    priceUSD: 199,
    priceNGN: 298500,
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
