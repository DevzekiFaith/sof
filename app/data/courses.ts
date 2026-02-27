import React from "react";
import {
  CapitalIcon,
  PersuasionIcon,
  DecisionIcon,
  TeamIcon,
} from "../components/Icons";

export interface ModuleDetail {
  title: string;
  description: string;
  objectives: string[];
  content: string;
  activities: string[];
  resources: string[];
  estimatedTime: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  ageRange: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgGradient: string;
  featured?: boolean;
  status?: string;
  duration?: string;
  priceUSD?: number;
  modules?: string[];
  outcomes?: string[];
  youtubeVideoUrl?: string; // Simple YouTube integration
  detailedModules?: ModuleDetail[]; // Detailed module content
}

export const QUARTERLY_PASS_PRICE_USD = 49;

export const courses: Course[] = [
  {
    id: "problem-solving",
    title: "Solution Mindset Development",
    description: "Develop a systematic approach to solving problems creatively and effectively. Learn critical thinking skills, analytical frameworks, and practical strategies for overcoming challenges in life and work.",
    fullDescription: "Problem solving is at the heart of success in every field. This course teaches you to approach problems systematically, think critically, and develop creative solutions. You'll learn proven frameworks, analytical tools, and mental models that help you tackle complex challenges with confidence and clarity.",
    ageRange: "12-45",
    icon: DecisionIcon,
    iconColor: "text-amber-600",
    bgGradient: "from-indigo-50 to-orange-50",
    featured: true,
    duration: "5 weeks",
    priceUSD: 14,
    modules: [
      "Problem Solving Fundamentals",
      "Critical Thinking Skills",
      "Analytical Frameworks",
      "Creative Problem Solving",
      "Decision Making Tools",
      "Overcoming Mental Blocks",
      "Collaborative Problem Solving",
      "Real-World Applications"
    ],
    outcomes: [
      "Approach problems systematically",
      "Think critically and analytically",
      "Generate creative solutions",
      "Make better decisions under pressure",
      "Solve complex real-world problems",
      "Build confidence in problem-solving"
    ],
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - replace with actual video
    detailedModules: [
      {
        title: "Problem Solving Fundamentals",
        description: "Learn the core principles of systematic problem solving and develop a structured approach to tackling challenges.",
        objectives: [
          "Understand what constitutes a problem",
          "Learn the difference between symptoms and root causes",
          "Develop a systematic approach to problem identification"
        ],
        content: `Problem solving is at the heart of innovation and progress. Every great invention, every successful business, and every personal breakthrough starts with the ability to identify and solve problems effectively.

In this module, you'll learn:

• **Problem Definition**: How to clearly articulate what the problem actually is
• **Root Cause Analysis**: Techniques to dig beyond surface-level symptoms
• **Problem Framing**: Different ways to look at the same problem
• **Solution Criteria**: How to know when you've found a good solution

The key insight is that most people jump to solutions without properly understanding the problem. This module teaches you to slow down, analyze thoroughly, and approach problems with clarity and confidence.`,
        activities: [
          "Identify 3 problems in your daily life and practice defining them clearly",
          "Use the 5-Why technique to find root causes of common issues",
          "Practice reframing a problem from 3 different perspectives"
        ],
        resources: [
          "Problem Definition Worksheet (PDF)",
          "Root Cause Analysis Template",
          "Problem Framing Exercise Guide"
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Critical Thinking Skills",
        description: "Develop your ability to analyze information objectively and make reasoned judgments.",
        objectives: [
          "Learn to evaluate information sources",
          "Develop logical reasoning skills",
          "Understand cognitive biases and how to avoid them"
        ],
        content: `Critical thinking is the foundation of good decision-making. It's the ability to objectively analyze information, question assumptions, and make reasoned judgments.

This module covers:

• **Information Evaluation**: How to assess the credibility of sources
• **Logical Reasoning**: Building arguments based on evidence
• **Cognitive Biases**: Common mental shortcuts that lead to poor decisions
• **Critical Questions**: What questions to ask when evaluating information

Critical thinking is a skill that improves with practice. The more you apply these techniques, the more natural they become.`,
        activities: [
          "Evaluate the credibility of 5 different news sources",
          "Practice identifying logical fallacies in arguments",
          "Create a critical thinking checklist for daily decisions"
        ],
        resources: [
          "Critical Thinking Checklist",
          "Cognitive Bias Identification Guide",
          "Information Evaluation Rubric"
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Analytical Frameworks",
        description: "Learn proven frameworks for breaking down complex problems and finding effective solutions.",
        objectives: [
          "Master different analytical frameworks",
          "Learn when to apply each framework",
          "Practice applying frameworks to real problems"
        ],
        content: `Different problems require different approaches. This module introduces you to several powerful analytical frameworks that can help you tackle any challenge.

You'll learn:

• **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
• **Fishbone Diagram**: Root cause analysis tool
• **Decision Matrix**: Systematic comparison of options
• **Mind Mapping**: Visual problem exploration
• **Force Field Analysis**: Understanding change drivers

Each framework has its strengths and is best applied to specific types of problems.`,
        activities: [
          "Apply SWOT analysis to a personal goal",
          "Use a decision matrix to choose between 3 options",
          "Create a mind map for a complex problem"
        ],
        resources: [
          "Framework Selection Guide",
          "SWOT Analysis Template",
          "Decision Matrix Calculator"
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Creative Problem Solving",
        description: "Unlock your creativity and learn techniques for generating innovative solutions.",
        objectives: [
          "Learn creative thinking techniques",
          "Overcome mental blocks",
          "Generate innovative solutions"
        ],
        content: `Creativity is not just for artists—it's essential for effective problem solving. This module teaches you how to break free from conventional thinking and generate innovative solutions.

You'll discover:

• **Brainstorming Techniques**: Rules for effective idea generation
• **Lateral Thinking**: Creative approaches to problem solving
• **SCAMPER Method**: Systematic creativity technique
• **Analogical Thinking**: Using metaphors and analogies
• **Mindfulness Practices**: Techniques to clear mental blocks

Creativity is a skill that can be developed and strengthened with practice.`,
        activities: [
          "Brainstorm 50 uses for a paperclip",
          "Use SCAMPER to improve a common product",
          "Practice a 10-minute mindfulness exercise"
        ],
        resources: [
          "Creativity Exercise Workbook",
          "SCAMPER Technique Guide",
          "Idea Generation Templates"
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Decision Making Tools",
        description: "Learn practical tools for making better decisions under pressure.",
        objectives: [
          "Master decision-making frameworks",
          "Learn to handle uncertainty",
          "Make confident decisions"
        ],
        content: `Good problem solving requires good decision making. This module provides you with practical tools and frameworks for making effective decisions, even in uncertain or high-pressure situations.

You'll learn:

• **Pros/Cons Analysis**: Balanced evaluation technique
• **Decision Trees**: Visual decision mapping
• **Expected Value**: Mathematical approach to uncertainty
• **Pre-mortem Analysis**: Anticipating potential failures
• **Satisficing**: Good enough decision making

These tools will help you make better decisions consistently.`,
        activities: [
          "Create a decision tree for a major life choice",
          "Conduct a pre-mortem analysis for a project",
          "Use expected value to evaluate a risky decision"
        ],
        resources: [
          "Decision Framework Toolkit",
          "Decision Tree Template",
          "Risk Assessment Calculator"
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Overcoming Mental Blocks",
        description: "Learn to identify and overcome common barriers to effective problem solving.",
        objectives: [
          "Identify personal mental blocks",
          "Learn techniques to overcome them",
          "Build problem-solving resilience"
        ],
        content: `Mental blocks can prevent us from solving problems effectively. This module helps you identify common barriers and develop strategies to overcome them.

You'll explore:

• **Cognitive Biases**: Hidden thinking traps
• **Emotional Barriers**: Fear, anxiety, frustration
• **Environmental Factors**: Distractions and constraints
• **Motivational Blocks**: Lack of confidence or interest
• **Time Pressure**: Decision fatigue and rushed thinking

Understanding these blocks is the first step to overcoming them.`,
        activities: [
          "Identify your top 3 mental blocks",
          "Practice a technique for each block type",
          "Create a personal mental block prevention plan"
        ],
        resources: [
          "Mental Block Identification Quiz",
          "Overcoming Barriers Guide",
          "Problem-Solving Resilience Plan"
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Collaborative Problem Solving",
        description: "Learn how to solve problems effectively with teams and groups.",
        objectives: [
          "Master group problem-solving techniques",
          "Handle team dynamics",
          "Facilitate effective collaboration"
        ],
        content: `Many problems are too complex for individuals to solve alone. This module teaches you how to harness the power of teams and groups for better problem solving.

You'll learn:

• **Group Dynamics**: Understanding team interactions
• **Facilitation Techniques**: Leading group problem-solving sessions
• **Conflict Resolution**: Managing disagreements constructively
• **Diverse Perspectives**: Leveraging different viewpoints
• **Consensus Building**: Reaching group agreement

Effective collaboration can lead to better solutions than any individual could create alone.`,
        activities: [
          "Facilitate a group problem-solving session",
          "Practice conflict resolution in a team setting",
          "Lead a consensus-building exercise"
        ],
        resources: [
          "Group Facilitation Guide",
          "Conflict Resolution Toolkit",
          "Team Dynamics Assessment"
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Real-World Applications",
        description: "Apply problem-solving skills to real-world scenarios and challenges.",
        objectives: [
          "Apply skills to complex real-world problems",
          "Learn from case studies",
          "Develop comprehensive problem-solving approach"
        ],
        content: `Theory is important, but application is where real learning happens. This final module brings together all the skills you've learned and applies them to real-world scenarios.

You'll explore:

• **Case Studies**: Real problem-solving successes and failures
• **Industry Applications**: Problem solving in different fields
• **Personal Challenges**: Applying skills to life problems
• **Systematic Approach**: Complete problem-solving methodology
• **Continuous Improvement**: Learning from experience

This module helps you integrate all the skills into a comprehensive problem-solving approach.`,
        activities: [
          "Analyze a famous problem-solving case study",
          "Apply the complete methodology to a personal problem",
          "Create a problem-solving action plan"
        ],
        resources: [
          "Case Study Collection",
          "Problem-Solving Methodology Guide",
          "Personal Action Plan Template"
        ],
        estimatedTime: "60 minutes"
      }
    ],
  },
  {
    id: "decision-making",
    title: "Decision-Making",
    description: "Develop critical thinking skills and frameworks for making better decisions under pressure. Learn to analyze situations, weigh options, and choose paths that lead to success.",
    fullDescription: "Every day, we make countless decisions that shape our lives. This course provides you with proven frameworks and tools to make better decisions, especially under pressure. You'll learn how to gather information effectively, analyze options objectively, and implement decisions with confidence.",
    ageRange: "12-45",
    icon: DecisionIcon,
    iconColor: "text-amber-600",
    bgGradient: "from-amber-50 to-orange-50",
    featured: false,
    duration: "5 weeks",
    priceUSD: 14,
    modules: [
      "Decision-Making Fundamentals",
      "Critical Thinking Skills",
      "Information Gathering",
      "Analysis Frameworks",
      "Risk Assessment",
      "Decision Implementation",
      "Learning from Outcomes",
      "Advanced Techniques"
    ],
    outcomes: [
      "Make faster, better decisions",
      "Reduce decision fatigue",
      "Handle pressure effectively",
      "Learn from past decisions",
      "Build confidence in your choices"
    ],
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - replace with actual video
    detailedModules: [
      {
        title: "Decision-Making Fundamentals",
        description: "Learn the basic principles of effective decision-making and understand the decision-making process.",
        objectives: [
          "Understand the decision-making process",
          "Learn to identify decision criteria",
          "Develop confidence in making choices"
        ],
        content: `Every day, we make countless decisions that shape our lives and futures. Effective decision-making is a skill that can be learned and improved with practice.

This foundational module covers:

• **Decision Types**: Understanding different kinds of decisions
• **Decision Criteria**: How to identify what matters most
• **Decision Process**: A systematic approach to making choices
• **Decision Quality**: How to know if you've made a good decision

The goal is to move from impulsive or emotional decisions to thoughtful, strategic choices that serve your long-term goals.`,
        activities: [
          "Categorize 10 recent decisions by type",
          "Create a personal decision-making framework",
          "Practice making a small decision using the framework"
        ],
        resources: [
          "Decision-Making Framework Template",
          "Decision Types Guide",
          "Decision Quality Checklist"
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Critical Thinking Skills",
        description: "Develop your ability to analyze information objectively and make reasoned judgments.",
        objectives: [
          "Learn to evaluate information sources",
          "Develop logical reasoning skills",
          "Understand cognitive biases and how to avoid them"
        ],
        content: `Critical thinking is the foundation of good decision-making. It's the ability to objectively analyze information, question assumptions, and make reasoned judgments.

This module covers:

• **Information Evaluation**: How to assess the credibility of sources
• **Logical Reasoning**: Building arguments based on evidence
• **Cognitive Biases**: Common mental shortcuts that lead to poor decisions
• **Critical Questions**: What questions to ask when evaluating information

Critical thinking is a skill that improves with practice. The more you apply these techniques, the more natural they become.`,
        activities: [
          "Evaluate the credibility of 5 different news sources",
          "Practice identifying logical fallacies in arguments",
          "Create a critical thinking checklist for daily decisions"
        ],
        resources: [
          "Critical Thinking Checklist",
          "Cognitive Bias Identification Guide",
          "Information Evaluation Rubric"
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Information Gathering",
        description: "Learn effective techniques for collecting and organizing information for better decisions.",
        objectives: [
          "Master information gathering techniques",
          "Learn to organize and prioritize information",
          "Avoid information overload"
        ],
        content: `Good decisions require good information. This module teaches you how to gather, organize, and prioritize information effectively.

You'll learn:

• **Research Techniques**: Systematic information gathering
• **Source Evaluation**: Assessing information quality
• **Data Organization**: Structuring information for analysis
• **Information Prioritization**: Focusing on what matters most
• **Avoiding Overload**: Managing information volume

The key is gathering the right information, not just more information.`,
        activities: [
          "Research a topic using multiple source types",
          "Create an information organization system",
          "Practice prioritizing information for a decision"
        ],
        resources: [
          "Research Techniques Guide",
          "Information Organization Template",
          "Source Evaluation Checklist"
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Analysis Frameworks",
        description: "Learn proven frameworks for analyzing information and evaluating options.",
        objectives: [
          "Master analytical frameworks",
          "Learn to compare options systematically",
          "Make evidence-based decisions"
        ],
        content: `Analysis turns information into insight. This module provides you with powerful frameworks for analyzing information and evaluating options.

You'll master:

• **Cost-Benefit Analysis**: Weighing pros and cons quantitatively
• **Multi-Criteria Decision Analysis**: Complex decision evaluation
• **Risk Analysis**: Assessing uncertainty and probability
• **Sensitivity Analysis**: Testing decision robustness
• **Gap Analysis**: Comparing current vs. desired states

These frameworks help you make decisions based on evidence rather than intuition.`,
        activities: [
          "Conduct a cost-benefit analysis for a purchase",
          "Use multi-criteria analysis for a career choice",
          "Perform risk analysis on a major decision"
        ],
        resources: [
          "Analysis Framework Toolkit",
          "Cost-Benefit Calculator",
          "Risk Assessment Template"
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Risk Assessment",
        description: "Learn to identify, evaluate, and manage risks in decision-making.",
        objectives: [
          "Identify decision risks",
          "Evaluate risk probability and impact",
          "Develop risk mitigation strategies"
        ],
        content: `Every decision involves some level of risk. This module teaches you how to identify, assess, and manage risks effectively.

You'll learn:

• **Risk Identification**: Finding potential problems
• **Risk Evaluation**: Assessing probability and impact
• **Risk Tolerance**: Understanding your risk preferences
• **Mitigation Strategies**: Reducing risk exposure
• **Contingency Planning**: Preparing for worst-case scenarios

Understanding risk helps you make more confident and realistic decisions.`,
        activities: [
          "Identify risks in 5 recent decisions",
          "Create a risk mitigation plan for a major decision",
          "Assess your personal risk tolerance"
        ],
        resources: [
          "Risk Assessment Matrix",
          "Risk Mitigation Strategy Guide",
          "Contingency Planning Template"
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Decision Implementation",
        description: "Learn how to execute decisions effectively and manage the implementation process.",
        objectives: [
          "Create action plans",
          "Manage implementation challenges",
          "Monitor decision outcomes"
        ],
        content: `Making a decision is only the beginning. This module focuses on effectively implementing decisions and managing the execution process.

You'll learn:

• **Action Planning**: Creating detailed implementation plans
• **Change Management**: Handling transitions and resistance
• **Progress Monitoring**: Tracking implementation success
• **Course Correction**: Adjusting when things go wrong
• **Stakeholder Management**: Keeping people informed and engaged

Successful implementation turns good decisions into great outcomes.`,
        activities: [
          "Create an action plan for a recent decision",
          "Monitor the implementation of a current decision",
          "Practice adjusting a plan when obstacles arise"
        ],
        resources: [
          "Action Planning Template",
          "Implementation Checklist",
          "Progress Monitoring Dashboard"
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Learning from Outcomes",
        description: "Develop the ability to learn from decision outcomes and improve future decision-making.",
        objectives: [
          "Analyze decision outcomes",
          "Learn from successes and failures",
          "Build decision-making wisdom"
        ],
        content: `Every decision provides an opportunity to learn and improve. This module teaches you how to analyze outcomes and build wisdom from experience.

You'll discover:

• **Outcome Analysis**: Evaluating what actually happened
• **Success Factors**: Understanding what worked well
• **Failure Analysis**: Learning from mistakes without blame
• **Pattern Recognition**: Identifying recurring themes
• **Continuous Improvement**: Building better decision-making habits

The goal is to get better at decision-making through deliberate learning.`,
        activities: [
          "Analyze the outcomes of 3 recent decisions",
          "Create a lessons-learned document",
          "Identify patterns in your decision-making history"
        ],
        resources: [
          "Outcome Analysis Framework",
          "Lessons Learned Template",
          "Decision Improvement Plan"
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Advanced Techniques",
        description: "Master advanced decision-making techniques for complex and high-stakes decisions.",
        objectives: [
          "Apply advanced decision techniques",
          "Handle complex multi-stakeholder decisions",
          "Make decisions under extreme uncertainty"
        ],
        content: `Complex decisions require sophisticated approaches. This advanced module introduces you to techniques for handling the most challenging decision scenarios.

You'll master:

• **Scenario Planning**: Preparing for multiple futures
• **Game Theory**: Strategic decision-making
• **Complex Systems Thinking**: Understanding interconnected decisions
• **Ethical Decision Frameworks**: Balancing competing values
• **Crisis Decision Making**: High-pressure decision techniques

These advanced techniques prepare you for the most demanding decision situations.`,
        activities: [
          "Develop scenarios for a major life decision",
          "Apply game theory to a competitive situation",
          "Practice crisis decision-making simulation"
        ],
        resources: [
          "Advanced Decision Toolkit",
          "Scenario Planning Guide",
          "Ethical Decision Framework"
        ],
        estimatedTime: "60 minutes"
      }
    ],
  },
  {
    id: "team-person",
    title: "Team Person",
    description: "Learn the fundamentals of teamwork: communication, trust, accountability, and collaboration—skills that work in school, life, and work.",
    fullDescription: "Teamwork is a life skill. In this course, you’ll learn how to communicate clearly, collaborate effectively, handle conflict, and build trust—so you can perform well in any group setting from age 10 to 45.",
    ageRange: "10-45",
    icon: TeamIcon,
    iconColor: "text-orange-600",
    bgGradient: "from-orange-50 to-cyan-50",
    featured: true,
    duration: "4 weeks",
    priceUSD: 14,
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    modules: [
      "Team Basics: Roles & Responsibility",
      "Communication in Teams",
      "Trust & Reliability",
      "Conflict Resolution",
      "Feedback & Growth",
      "Collaboration & Problem Solving",
      "Leadership & Followership",
      "Building Team Culture"
    ],
    outcomes: [
      "Communicate clearly in group settings",
      "Build trust and reliability",
      "Resolve conflict constructively",
      "Give and receive feedback well",
      "Contribute meaningfully to any team"
    ],
    detailedModules: [
      {
        title: "Team Basics: Roles & Responsibility",
        description: "Understand how teams work and what it means to be reliable.",
        objectives: ["Define team roles", "Build accountability habits", "Set expectations clearly"],
        content: "A team works when people know the goal, know their role, and do what they said they would do.\n\nIn this module you’ll learn how to clarify responsibilities, communicate expectations, and become dependable.",
        activities: ["Write a team role you’ve played before and what success looked like", "Create a simple responsibility checklist for a group task"],
        resources: ["Role & Responsibility worksheet", "Accountability checklist"],
        estimatedTime: "35 minutes"
      },
      {
        title: "Communication in Teams",
        description: "Learn simple communication habits that prevent confusion and improve collaboration.",
        objectives: ["Use clarity-first communication", "Ask better questions", "Confirm understanding"],
        content: "Most team problems are communication problems.\n\nYou’ll practice clarity-first language, confirming understanding, and asking better questions.",
        activities: ["Rewrite 3 unclear messages into clear messages", "Practice the ‘repeat back’ method in a conversation"],
        resources: ["Clear communication templates"],
        estimatedTime: "40 minutes"
      },
      {
        title: "Trust & Reliability",
        description: "Build trust by being consistent and predictable in the best way.",
        objectives: ["Understand trust drivers", "Build reliability habits", "Repair broken trust"],
        content: "Trust is built in small moments: showing up, following through, and being honest.\n\nYou’ll learn how to build and rebuild trust through consistent behavior.",
        activities: ["Identify 2 trust-building actions you can do this week", "Write a simple trust repair message"],
        resources: ["Trust-building tracker"],
        estimatedTime: "35 minutes"
      },
      {
        title: "Conflict Resolution",
        description: "Turn disagreements into progress instead of drama.",
        objectives: ["Separate people from problems", "Use calm language", "Find win-win outcomes"],
        content: "Conflict is normal. The goal is to handle it with respect.\n\nYou’ll learn calm scripts and a simple resolution process.",
        activities: ["Use the ‘I feel / I need’ script for a real situation", "Map a conflict into needs vs positions"],
        resources: ["Conflict scripts cheat sheet"],
        estimatedTime: "45 minutes"
      },
      {
        title: "Feedback & Growth",
        description: "Learn to give feedback that helps, and receive feedback without shutting down.",
        objectives: ["Give specific feedback", "Receive feedback productively", "Turn feedback into action"],
        content: "Feedback is information. When used well, it becomes fuel.\n\nYou’ll learn simple feedback frameworks and how to turn feedback into growth steps.",
        activities: ["Give one piece of feedback using a template", "Turn one feedback item into a 7‑day improvement plan"],
        resources: ["Feedback templates"],
        estimatedTime: "40 minutes"
      },
      {
        title: "Collaboration & Problem Solving",
        description: "Solve problems with others faster and better.",
        objectives: ["Brainstorm effectively", "Decide together", "Document decisions"],
        content: "Collaboration needs structure.\n\nYou’ll learn how to brainstorm, converge, and document decisions to avoid repeating meetings.",
        activities: ["Run a 10‑minute brainstorm using rules", "Create a decision note (who/what/when)"],
        resources: ["Collaboration meeting notes template"],
        estimatedTime: "45 minutes"
      },
      {
        title: "Leadership & Followership",
        description: "Lead when it’s your turn and support when it’s not.",
        objectives: ["Recognize leadership moments", "Support leaders well", "Share leadership responsibly"],
        content: "Teams win when leadership is shared.\n\nYou’ll learn how to step up, step back, and support outcomes.",
        activities: ["Identify 3 ways to support a leader this week", "Write a simple leadership plan for a group task"],
        resources: ["Leadership/followership checklist"],
        estimatedTime: "35 minutes"
      },
      {
        title: "Building Team Culture",
        description: "Create an environment where people do their best work together.",
        objectives: ["Define team values", "Set norms", "Maintain culture under pressure"],
        content: "Culture is what happens when no one is watching.\n\nYou’ll learn how to set team norms and protect culture during stress.",
        activities: ["Write 5 team norms for a group", "Create a ‘reset’ plan for stressful moments"],
        resources: ["Team norms worksheet"],
        estimatedTime: "40 minutes"
      }
    ]
  },
  {
    id: "personal-adaptability",
    title: "Personal Adaptability",
    description: "Learn the fundamentals of adapting to change: resilience, flexible thinking, and steady progress.",
    fullDescription: "Change is guaranteed. This course teaches the fundamentals of adaptability—how to stay calm, adjust quickly, and keep moving forward in school, life, and work (ages 10–45).",
    ageRange: "10-45",
    icon: DecisionIcon,
    iconColor: "text-teal-600",
    bgGradient: "from-teal-50 to-emerald-50",
    featured: false,
    duration: "4 weeks",
    priceUSD: 14,
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    modules: [
      "Understanding Change",
      "Resilience Basics",
      "Flexible Thinking",
      "Managing Stress & Energy",
      "Learning Fast",
      "Handling Setbacks",
      "Building Better Habits",
      "Planning for the Next Season"
    ],
    outcomes: [
      "Handle change calmly and confidently",
      "Recover faster from setbacks",
      "Build flexible thinking habits",
      "Keep momentum during uncertainty"
    ],
    detailedModules: Array.from({ length: 8 }).map((_, i) => ({
      title: `Module ${i + 1}`,
      description: "Detailed content coming soon.",
      objectives: [],
      content: "This module is being prepared.",
      activities: [],
      resources: [],
      estimatedTime: "TBD"
    }))
  },
  {
    id: "self-image",
    title: "Self-Image",
    description: "Build a strong self-image: confidence, identity, and the fundamentals of self-belief.",
    fullDescription: "Self-image shapes decisions, habits, and outcomes. This course teaches the fundamentals of self-image, confidence, and self-belief for ages 10–45.",
    ageRange: "10-45",
    icon: PersuasionIcon,
    iconColor: "text-purple-600",
    bgGradient: "from-purple-50 to-yellow-50",
    featured: true,
    duration: "4 weeks",
    priceUSD: 14,
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    modules: [
      "What Self-Image Is",
      "Confidence & Competence",
      "Self-Talk Fundamentals",
      "Identity & Values",
      "Boundaries & Respect",
      "Discipline & Consistency",
      "Resilience & Recovery",
      "Your Self-Image Plan"
    ],
    outcomes: [
      "Develop healthier self-talk",
      "Build real confidence through action",
      "Strengthen identity and values",
      "Create a personal self-image plan"
    ],
    detailedModules: Array.from({ length: 8 }).map((_, i) => ({
      title: `Module ${i + 1}`,
      description: "Detailed content coming soon.",
      objectives: [],
      content: "This module is being prepared.",
      activities: [],
      resources: [],
      estimatedTime: "TBD"
    }))
  },
  {
    id: "communication",
    title: "Communication",
    description: "Learn communication fundamentals: clarity, listening, confidence, and influence.",
    fullDescription: "Communication is the universal skill. This course teaches fundamentals—speaking clearly, listening deeply, and expressing ideas with confidence—for ages 10–45.",
    ageRange: "10-45",
    icon: PersuasionIcon,
    iconColor: "text-rose-600",
    bgGradient: "from-rose-50 to-orange-50",
    featured: false,
    duration: "4 weeks",
    priceUSD: 14,
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    modules: [
      "Clarity & Structure",
      "Listening Fundamentals",
      "Confidence in Speaking",
      "Asking Better Questions",
      "Difficult Conversations",
      "Non‑Verbal Communication",
      "Influence & Persuasion Basics",
      "Communication Habits for Life"
    ],
    outcomes: [
      "Speak with clarity and confidence",
      "Listen and respond effectively",
      "Handle difficult conversations",
      "Build lifelong communication habits"
    ],
    detailedModules: Array.from({ length: 8 }).map((_, i) => ({
      title: `Module ${i + 1}`,
      description: "Detailed content coming soon.",
      objectives: [],
      content: "This module is being prepared.",
      activities: [],
      resources: [],
      estimatedTime: "TBD"
    }))
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}