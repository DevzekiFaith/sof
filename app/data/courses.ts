import React from "react";
import {
  Zap,
  Target,
  Briefcase,
  TrendingUp,
  Shield,
  Heart,
  Search,
  ChevronRight,
  PlayCircle
} from "lucide-react";

export interface Resource {
  name: string;
  url: string;
}

export interface ModuleDetail {
  title: string;
  description: string;
  objectives: string[];
  content: string;
  topics?: string[]; // New structured topics
  activities: string[];
  resources: Resource[];
  estimatedTime: string;
  icon?: React.ComponentType<{ className?: string }>;
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
  imageUrl?: string;
  featured?: boolean;
  status?: string;
  duration?: string;
  priceUSD?: number;
  isFree?: boolean; // Indicates if course is available to free users
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
    icon: Zap,
    iconColor: "text-[#1ed760]",
    bgGradient: "from-[#1ed760]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    featured: true,
    duration: "5 weeks",
    priceUSD: 14,
    isFree: true,
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
    youtubeVideoUrl: "https://www.youtube.com/watch?v=J-gKJDk0E7Y", // "How to solve any problem" video
    detailedModules: [
      {
        title: "Problem Solving Fundamentals",
        icon: Zap,
        description: "Learn the core principles of systematic problem solving and develop a structured approach to tackling challenges.",
        objectives: [
          "Understand what constitutes a problem",
          "Learn the difference between symptoms and root causes",
          "Develop a systematic approach to problem identification"
        ],
        topics: [
          "Problem Definition: Articulating the core issue",
          "Root Cause Analysis: Digging beyond symptoms",
          "Problem Framing: Multi-perspective analysis",
          "Solution Criteria: Evaluating success"
        ],
        content: `Problem solving is at the heart of innovation and progress. Every great invention, every successful business, and every personal breakthrough starts with the ability to identify and solve problems effectively.

The key insight is that most people jump to solutions without properly understanding the problem. This module teaches you to slow down, analyze thoroughly, and approach problems with clarity and confidence.`,
        activities: [
          "Identify 3 problems in your daily life and practice defining them clearly",
          "Use the 5-Why technique to find root causes of common issues",
          "Practice reframing a problem from 3 different perspectives"
        ],
        resources: [
          { name: "5 Whys Technique Explained (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" },
          { name: "Problem Definition Framework (Article)", url: "https://hbr.org/2021/06/how-to-define-a-problem" },
          { name: "Root Cause Analysis Guide (Article)", url: "https://asq.org/quality-resources/root-cause-analysis" }
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
        topics: [
          "Information Evaluation: Assessing credibility",
          "Logical Reasoning: Building evidence-based arguments",
          "Cognitive Biases: Avoiding thinking traps",
          "Critical Questions: Essential analytical inquiries"
        ],
        content: `Critical thinking is the foundation of good decision-making. It's the ability to objectively analyze information, question assumptions, and make reasoned judgments.

Critical thinking is a skill that improves with practice. The more you apply these techniques, the more natural they become.`,
        activities: [
          "Evaluate the credibility of 5 different news sources",
          "Practice identifying logical fallacies in arguments",
          "Create a critical thinking checklist for daily decisions"
        ],
        resources: [
          { name: "Critical Thinking Explained (Video)", url: "https://www.youtube.com/watch?v=6dl_UJcOy1I" },
          { name: "Cognitive Bias Guide (Article)", url: "https://thedecisionlab.com/bias-directory/" },
          { name: "Logical Fallacies Guide (Article)", url: "https://yourlogicalfallacyis.com/" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Analytical Frameworks",
        icon: TrendingUp,
        description: "Learn proven frameworks for breaking down complex problems and finding effective solutions.",
        objectives: [
          "Master different analytical frameworks",
          "Learn when to apply each framework",
          "Practice applying frameworks to real problems"
        ],
        topics: [
          "SWOT Analysis: Strategic assessment",
          "Fishbone Diagram: Root cause mapping",
          "Decision Matrix: Comparative evaluation",
          "Mind Mapping: Visual exploration",
          "Force Field Analysis: Change drivers"
        ],
        content: `Different problems require different approaches. This module introduces you to several powerful analytical frameworks that can help you tackle any challenge.

Each framework has its strengths and is best applied to specific types of problems.`,
        activities: [
          "Apply SWOT analysis to a personal goal",
          "Use a decision matrix to choose between 3 options",
          "Create a mind map for a complex problem"
        ],
        resources: [
          { name: "SWOT Analysis Guide (Article)", url: "https://www.mindtools.com/pages/article/newTMC_05.htm" },
          { name: "Decision Matrix Template (Tool)", url: "https://www.vertex42.com/ExcelTemplates/decision-matrix.html" },
          { name: "Mind Mapping Tutorial (Video)", url: "https://www.youtube.com/watch?v=MlabrWv25q0" }
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Creative Problem Solving",
        icon: PlayCircle,
        description: "Unlock your creativity and learn techniques for generating innovative solutions.",
        objectives: [
          "Learn creative thinking techniques",
          "Overcome mental blocks",
          "Generate innovative solutions"
        ],
        content: `Creativity is not just for artists—it's essential for effective problem solving. This module teaches you how to break free from conventional thinking and generate innovative solutions.

You'll discover:

Brainstorming Techniques: Rules for effective idea generation
Lateral Thinking: Creative approaches to problem solving
SCAMPER Method: Systematic creativity technique
Analogical Thinking: Using metaphors and analogies
Mindfulness Practices: Techniques to clear mental blocks

Creativity is a skill that can be developed and strengthened with practice.`,
        activities: [
          "Brainstorm 50 uses for a paperclip",
          "Use SCAMPER to improve a common product",
          "Practice a 10-minute mindfulness exercise"
        ],
        resources: [
          { name: "SCAMPER Technique Explained (Article)", url: "https://www.mindtools.com/pages/article/newCT_02.htm" },
          { name: "Brainstorming Techniques (Video)", url: "https://www.youtube.com/watch?v=zD3Fg_g4h3Y" },
          { name: "Mindfulness for Creativity (Article)", url: "https://positivepsychology.com/mindfulness-creativity/" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Decision Making Tools",
        icon: Target,
        description: "Learn practical tools for making better decisions under pressure.",
        objectives: [
          "Master decision-making frameworks",
          "Learn to handle uncertainty",
          "Make confident decisions"
        ],
        content: `Good problem solving requires good decision making. This module provides you with practical tools and frameworks for making effective decisions, even in uncertain or high-pressure situations.

You'll learn:

Pros/Cons Analysis: Balanced evaluation technique
Decision Trees: Visual decision mapping
Expected Value: Mathematical approach to uncertainty
Pre-mortem Analysis: Anticipating potential failures
Satisficing: Good enough decision making

These tools will help you make better decisions consistently.`,
        activities: [
          "Create a decision tree for a major life choice",
          "Conduct a pre-mortem analysis for a project",
          "Use expected value to evaluate a risky decision"
        ],
        resources: [
          { name: "Decision Tree Tutorial (Video)", url: "https://www.youtube.com/watch?v=Na8A9E5e1fM" },
          { name: "Pre-mortem Analysis Guide (Article)", url: "https://hbr.org/2007/09/performing-a-project-premortem" },
          { name: "Expected Value Calculator (Tool)", url: "https://www.omnicalculator.com/statistics/expected-value" }
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

Cognitive Biases: Hidden thinking traps
Emotional Barriers: Fear, anxiety, frustration
Environmental Factors: Distractions and constraints
Motivational Blocks: Lack of confidence or interest
Time Pressure: Decision fatigue and rushed thinking

Understanding these blocks is the first step to overcoming them.`,
        activities: [
          "Identify your top 3 mental blocks",
          "Practice a technique for each block type",
          "Create a personal mental block prevention plan"
        ],
        resources: [
          { name: "Overcoming Mental Blocks (Article)", url: "https://www.verywellmind.com/overcoming-mental-blocks-3145179" },
          { name: "Cognitive Bias Examples (Article)", url: "https://thedecisionlab.com/bias-directory/" },
          { name: "Building Resilience (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
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

Group Dynamics: Understanding team interactions
Facilitation Techniques: Leading group problem-solving sessions
Conflict Resolution: Managing disagreements constructively
Diverse Perspectives: Leveraging different viewpoints
Consensus Building: Reaching group agreement

Effective collaboration can lead to better solutions than any individual could create alone.`,
        activities: [
          "Facilitate a group problem-solving session",
          "Practice conflict resolution in a team setting",
          "Lead a consensus-building exercise"
        ],
        resources: [
          { name: "Group Facilitation Guide (Article)", url: "https://www.mindtools.com/pages/article/group-facilitation.htm" },
          { name: "Conflict Resolution Techniques (Video)", url: "https://www.youtube.com/watch?v=KY5a1aJ8b3I" },
          { name: "Team Building Activities (Article)", url: "https://www.teambuilding.co.uk/" }
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

Case Studies: Real problem-solving successes and failures
Industry Applications: Problem solving in different fields
Personal Challenges: Applying skills to life problems
Systematic Approach: Complete problem-solving methodology
Continuous Improvement: Learning from experience

This module helps you integrate all the skills into a comprehensive problem-solving approach.`,
        activities: [
          "Analyze a famous problem-solving case study",
          "Apply the complete methodology to a personal problem",
          "Create a problem-solving action plan"
        ],
        resources: [
          { name: "Problem-Solving Case Studies (Article)", url: "https://hbr.org/topic/problem-solving" },
          { name: "Action Plan Template (Tool)", url: "https://www.atlassian.com/software/confluence/templates/action-plan" },
          { name: "Systematic Problem Solving (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
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
    icon: Target,
    iconColor: "text-[#1ed760]",
    bgGradient: "from-[#1ed760]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    featured: false,
    duration: "5 weeks",
    priceUSD: 14,
    isFree: true,
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

Decision Types: Understanding different kinds of decisions
Decision Criteria: How to identify what matters most
Decision Process: A systematic approach to making choices
Decision Quality: How to know if you've made a good decision

The goal is to move from impulsive or emotional decisions to thoughtful, strategic choices that serve your long-term goals.`,
        activities: [
          "Categorize 10 recent decisions by type",
          "Create a personal decision-making framework",
          "Practice making a small decision using the framework"
        ],
        resources: [
          { name: "Decision-Making Framework (Article)", url: "https://hbr.org/2019/06/how-to-make-better-decisions" },
          { name: "Decision Types Explained (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" },
          { name: "Decision Quality Checklist (Tool)", url: "https://www.mindtools.com/pages/article/newTED_00.htm" }
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

Information Evaluation: How to assess the credibility of sources
Logical Reasoning: Building arguments based on evidence
Cognitive Biases: Common mental shortcuts that lead to poor decisions
Critical Questions: What questions to ask when evaluating information

Critical thinking is a skill that improves with practice. The more you apply these techniques, the more natural they become.`,
        activities: [
          "Evaluate the credibility of 5 different news sources",
          "Practice identifying logical fallacies in arguments",
          "Create a critical thinking checklist for daily decisions"
        ],
        resources: [
          { name: "Critical Thinking Explained (Video)", url: "https://www.youtube.com/watch?v=6dl_UJcOy1I" },
          { name: "Cognitive Bias Guide (Article)", url: "https://thedecisionlab.com/bias-directory/" },
          { name: "Logical Fallacies Guide (Article)", url: "https://yourlogicalfallacyis.com/" }
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

Research Techniques: Systematic information gathering
Source Evaluation: Assessing information quality
Data Organization: Structuring information for analysis
Information Prioritization: Focusing on what matters most
Avoiding Overload: Managing information volume

The key is gathering the right information, not just more information.`,
        activities: [
          "Research a topic using multiple source types",
          "Create an information organization system",
          "Practice prioritizing information for a decision"
        ],
        resources: [
          { name: "Research Methods Guide (Article)", url: "https://libguides.mit.edu/researchmethods" },
          { name: "Information Organization Tools (Article)", url: "https://www.notion.so/product/notion-ai" },
          { name: "Source Evaluation Checklist (Tool)", url: "https://www.craaptest.org/" }
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

Cost-Benefit Analysis: Weighing pros and cons quantitatively
Multi-Criteria Decision Analysis: Complex decision evaluation
Risk Analysis: Assessing uncertainty and probability
Sensitivity Analysis: Testing decision robustness
Gap Analysis: Comparing current vs. desired states

These frameworks help you make decisions based on evidence rather than intuition.`,
        activities: [
          "Conduct a cost-benefit analysis for a purchase",
          "Use multi-criteria analysis for a career choice",
          "Perform risk analysis on a major decision"
        ],
        resources: [
          { name: "Cost-Benefit Analysis Guide (Article)", url: "https://www.mindtools.com/pages/article/newTED_08.htm" },
          { name: "Multi-Criteria Analysis Tool (Template)", url: "https://www.vertex42.com/ExcelTemplates/multi-criteria-decision-matrix.html" },
          { name: "Risk Assessment Template (Tool)", url: "https://www.projectmanagement.com/templates/risk-assessment-template" }
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

Risk Identification: Finding potential problems
Risk Evaluation: Assessing probability and impact
Risk Tolerance: Understanding your risk preferences
Mitigation Strategies: Reducing risk exposure
Contingency Planning: Preparing for worst-case scenarios

Understanding risk helps you make more confident and realistic decisions.`,
        activities: [
          "Identify risks in 5 recent decisions",
          "Create a risk mitigation plan for a major decision",
          "Assess your personal risk tolerance"
        ],
        resources: [
          { name: "Risk Assessment Matrix (Tool)", url: "https://www.projectmanagement.com/templates/risk-assessment-matrix" },
          { name: "Risk Mitigation Strategies (Article)", url: "https://hbr.org/2021/06/risk-intelligence" },
          { name: "Contingency Planning Guide (Article)", url: "https://www.ready.gov/business-continuity-planning" }
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

Action Planning: Creating detailed implementation plans
Change Management: Handling transitions and resistance
Progress Monitoring: Tracking implementation success
Course Correction: Adjusting when things go wrong
Stakeholder Management: Keeping people informed and engaged

Successful implementation turns good decisions into great outcomes.`,
        activities: [
          "Create an action plan for a recent decision",
          "Monitor the implementation of a current decision",
          "Practice adjusting a plan when obstacles arise"
        ],
        resources: [
          { name: "Action Plan Template (Tool)", url: "https://www.atlassian.com/software/confluence/templates/action-plan" },
          { name: "Implementation Checklist (Article)", url: "https://hbr.org/2021/06/how-to-execute-a-strategy" },
          { name: "Progress Tracking Tools (Article)", url: "https://www.monday.com/templates/project-management" }
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

Outcome Analysis: Evaluating what actually happened
Success Factors: Understanding what worked well
Failure Analysis: Learning from mistakes without blame
Pattern Recognition: Identifying recurring themes
Continuous Improvement: Building better decision-making habits

The goal is to get better at decision-making through deliberate learning.`,
        activities: [
          "Analyze the outcomes of 3 recent decisions",
          "Create a lessons-learned document",
          "Identify patterns in your decision-making history"
        ],
        resources: [
          { name: "Outcome Analysis Framework (Article)", url: "https://hbr.org/2021/06/how-to-learn-from-your-mistakes" },
          { name: "Lessons Learned Template (Tool)", url: "https://www.atlassian.com/software/confluence/templates/lessons-learned" },
          { name: "Decision Improvement Plan (Article)", url: "https://hbr.org/2021/06/how-to-make-better-decisions" }
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

Scenario Planning: Preparing for multiple futures
Game Theory: Strategic decision-making
Complex Systems Thinking: Understanding interconnected decisions
Ethical Decision Frameworks: Balancing competing values
Crisis Decision Making: High-pressure decision techniques

These advanced techniques prepare you for the most demanding decision situations.`,
        activities: [
          "Develop scenarios for a major life decision",
          "Apply game theory to a competitive situation",
          "Practice crisis decision-making simulation"
        ],
        resources: [
          { name: "Scenario Planning Guide (Article)", url: "https://hbr.org/2021/06/scenario-planning" },
          { name: "Game Theory Explained (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" },
          { name: "Ethical Decision Framework (Article)", url: "https://www.markkulacenter.org/ethics/ethics-decision-making-model" }
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
    icon: Briefcase,
    iconColor: "text-[#1ed760]",
    bgGradient: "from-[#1ed760]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
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
        icon: Briefcase,
        description: "Understand how teams work and what it means to be reliable.",
        objectives: ["Define team roles", "Build accountability habits", "Set expectations clearly"],
        content: "A team works when people know the goal, know their role, and do what they said they would do.\n\nIn this module you’ll learn how to clarify responsibilities, communicate expectations, and become dependable.",
        activities: ["Write a team role you’ve played before and what success looked like", "Create a simple responsibility checklist for a group task"],
        resources: [
          { name: "Team Roles Guide (Article)", url: "https://www.mindtools.com/pages/article/role-clarity.htm" },
          { name: "Accountability Framework (Article)", url: "https://hbr.org/2021/06/building-accountability" }
        ],
        estimatedTime: "35 minutes"
      },
      {
        title: "Communication in Teams",
        icon: Heart,
        description: "Learn simple communication habits that prevent confusion and improve collaboration.",
        objectives: ["Use clarity-first communication", "Ask better questions", "Confirm understanding"],
        content: "Most team problems are communication problems.\n\nYou’ll practice clarity-first language, confirming understanding, and asking better questions.",
        activities: ["Rewrite 3 unclear messages into clear messages", "Practice the ‘repeat back’ method in a conversation"],
        resources: [
          { name: "Effective Communication Guide (Article)", url: "https://hbr.org/2021/06/how-to-communicate-effectively" }
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Trust & Reliability",
        icon: Shield,
        description: "Build trust by being consistent and predictable in the best way.",
        objectives: ["Understand trust drivers", "Build reliability habits", "Repair broken trust"],
        content: "Trust is built in small moments: showing up, following through, and being honest.\n\nYou’ll learn how to build and rebuild trust through consistent behavior.",
        activities: ["Identify 2 trust-building actions you can do this week", "Write a simple trust repair message"],
        resources: [
          { name: "Building Trust Guide (Article)", url: "https://hbr.org/2021/06/the-trust-equation" }
        ],
        estimatedTime: "35 minutes"
      },
      {
        title: "Conflict Resolution",
        icon: Target,
        description: "Turn disagreements into progress instead of drama.",
        objectives: ["Separate people from problems", "Use calm language", "Find win-win outcomes"],
        content: "Conflict is normal. The goal is to handle it with respect.\n\nYou’ll learn calm scripts and a simple resolution process.",
        activities: ["Use the ‘I feel / I need’ script for a real situation", "Map a conflict into needs vs positions"],
        resources: [
          { name: "Conflict Resolution Techniques (Video)", url: "https://www.youtube.com/watch?v=KY5a1aJ8b3I" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Feedback & Growth",
        icon: TrendingUp,
        description: "Learn to give feedback that helps, and receive feedback without shutting down.",
        objectives: ["Give specific feedback", "Receive feedback productively", "Turn feedback into action"],
        content: "Feedback is information. When used well, it becomes fuel.\n\nYou’ll learn simple feedback frameworks and how to turn feedback into growth steps.",
        activities: ["Give one piece of feedback using a template", "Turn one feedback item into a 7‑day improvement plan"],
        resources: [
          { name: "Giving Feedback Guide (Article)", url: "https://hbr.org/2021/06/how-to-give-feedback" }
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Collaboration & Problem Solving",
        description: "Solve problems with others faster and better.",
        objectives: ["Brainstorm effectively", "Decide together", "Document decisions"],
        content: "Collaboration needs structure.\n\nYou’ll learn how to brainstorm, converge, and document decisions to avoid repeating meetings.",
        activities: ["Run a 10‑minute brainstorm using rules", "Create a decision note (who/what/when)"],
        resources: [
          { name: "Brainstorming Techniques (Article)", url: "https://www.mindtools.com/pages/article/newCT_00.htm" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Leadership & Followership",
        description: "Lead when it’s your turn and support when it’s not.",
        objectives: ["Recognize leadership moments", "Support leaders well", "Share leadership responsibly"],
        content: "Teams win when leadership is shared.\n\nYou’ll learn how to step up, step back, and support outcomes.",
        activities: ["Identify 3 ways to support a leader this week", "Write a simple leadership plan for a group task"],
        resources: [
          { name: "Leadership Skills Guide (Article)", url: "https://hbr.org/2021/06/what-is-leadership" }
        ],
        estimatedTime: "35 minutes"
      },
      {
        title: "Building Team Culture",
        description: "Create an environment where people do their best work together.",
        objectives: ["Define team values", "Set norms", "Maintain culture under pressure"],
        content: "Culture is what happens when no one is watching.\n\nYou’ll learn how to set team norms and protect culture during stress.",
        activities: ["Write 5 team norms for a group", "Create a ‘reset’ plan for stressful moments"],
        resources: [
          { name: "Team Culture Guide (Article)", url: "https://hbr.org/2021/06/how-to-build-team-culture" }
        ],
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
    icon: TrendingUp,
    iconColor: "text-teal-600",
    bgGradient: "from-[#1ed760]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
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
    detailedModules: [
      {
        title: "Understanding Change",
        description: "Learn why change happens and how to prepare for it mentally and emotionally.",
        objectives: [
          "Understand the nature of change",
          "Recognize your change response patterns",
          "Prepare mentally for transitions"
        ],
        content: `Change is inevitable, but how we respond to it determines our success. This module helps you understand the psychology of change and develop the mindset needed to navigate transitions effectively.`,
        activities: [
          "Identify 3 major changes you've experienced and how you handled them",
          "Create a personal change response journal",
          "Practice a grounding technique for stressful transitions"
        ],
        resources: [
          { name: "Understanding Change Psychology (Article)", url: "https://hbr.org/2021/06/how-to-handle-change" },
          { name: "Change Management Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Resilience Basics",
        description: "Build the foundation for bouncing back from setbacks and challenges.",
        objectives: [
          "Define resilience in your own words",
          "Identify your resilience strengths",
          "Practice basic resilience techniques"
        ],
        content: `Resilience is not about avoiding stress—it's about recovering from it. This module teaches you the foundational skills for building mental and emotional resilience.`,
        activities: [
          "Create a resilience inventory of your strengths",
          "Practice a 5-minute resilience exercise",
          "Identify 3 people who support your resilience"
        ],
        resources: [
          { name: "Building Resilience (Article)", url: "https://www.apa.org/topics/resilience" },
          { name: "Resilience Training (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Flexible Thinking",
        description: "Develop cognitive flexibility to adapt your thinking to new situations.",
        objectives: [
          "Practice reframing situations",
          "Challenge fixed mindsets",
          "Develop multiple perspectives"
        ],
        content: `Flexible thinking is the ability to adapt your mental approach to different situations. This module teaches you techniques for developing cognitive flexibility.`,
        activities: [
          "Reframe 3 negative situations into opportunities",
          "Practice the 'six thinking hats' technique",
          "Challenge one fixed belief you hold"
        ],
        resources: [
          { name: "Cognitive Flexibility Guide (Article)", url: "https://www.psychologytoday.com/us/basics/cognitive-flexibility" },
          { name: "Reframing Techniques (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Managing Stress & Energy",
        description: "Learn practical techniques for managing stress and maintaining energy during change.",
        objectives: [
          "Identify personal stress triggers",
          "Practice stress management techniques",
          "Build energy management habits"
        ],
        content: `Stress management is essential for adaptability. This module provides practical techniques for handling stress and maintaining energy during transitions.`,
        activities: [
          "Create a personal stress trigger map",
          "Practice 3 stress management techniques",
          "Design an energy management routine"
        ],
        resources: [
          { name: "Stress Management Techniques (Article)", url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management" },
          { name: "Energy Management Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Learning Fast",
        description: "Develop rapid learning skills to adapt quickly to new information and situations.",
        objectives: [
          "Practice accelerated learning techniques",
          "Develop information filtering skills",
          "Build quick adaptation habits"
        ],
        content: `The ability to learn quickly is a superpower in a changing world. This module teaches you techniques for rapid learning and adaptation.`,
        activities: [
          "Practice the Feynman technique on a new topic",
          "Create a personal learning system",
          "Complete a 24-hour learning challenge"
        ],
        resources: [
          { name: "Accelerated Learning Guide (Article)", url: "https://www.mindtools.com/pages/article/accelerated-learning.htm" },
          { name: "Feynman Technique Explained (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Handling Setbacks",
        description: "Learn to bounce back from failures and disappointments with grace and determination.",
        objectives: [
          "Develop a setback recovery process",
          "Practice constructive self-reflection",
          "Build failure resilience"
        ],
        content: `Setbacks are inevitable, but they don't have to define you. This module teaches you how to handle failures constructively and bounce back stronger.`,
        activities: [
          "Create a setback recovery plan",
          "Practice constructive failure analysis",
          "Write a 'lessons learned' document from a recent setback"
        ],
        resources: [
          { name: "Bouncing Back from Failure (Article)", url: "https://hbr.org/2021/06/how-to-bounce-back-from-failure" },
          { name: "Growth Mindset Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Building Better Habits",
        description: "Create habits that support adaptability and continuous improvement.",
        objectives: [
          "Understand habit formation science",
          "Design adaptive habits",
          "Build habit maintenance systems"
        ],
        content: `Habits are the foundation of sustainable change. This module teaches you how to build habits that support adaptability and continuous growth.`,
        activities: [
          "Use the habit loop to design one new habit",
          "Create a habit tracking system",
          "Practice habit stacking for better routines"
        ],
        resources: [
          { name: "Atomic Habits Summary (Article)", url: "https://jamesclear.com/atomic-habits" },
          { name: "Habit Formation Science (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Planning for the Next Season",
        description: "Develop strategic planning skills to prepare for future changes and opportunities.",
        objectives: [
          "Practice scenario planning",
          "Create adaptive goal systems",
          "Build future-readiness habits"
        ],
        content: `The best way to handle the future is to prepare for it. This module teaches you strategic planning techniques for navigating uncertainty.`,
        activities: [
          "Create 3 scenarios for your next 6 months",
          "Design adaptive goals for different outcomes",
          "Build a future-readiness checklist"
        ],
        resources: [
          { name: "Scenario Planning Guide (Article)", url: "https://hbr.org/2021/06/scenario-planning" },
          { name: "Strategic Planning Tools (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "55 minutes"
      }
    ]
  },
  {
    id: "self-image",
    title: "Self-Image",
    description: "Build a strong self-image: confidence, identity, and the fundamentals of self-belief.",
    fullDescription: "Self-image shapes decisions, habits, and outcomes. This course teaches the fundamentals of self-image, confidence, and self-belief for ages 10–45.",
    ageRange: "10-45",
    icon: Shield,
    iconColor: "text-purple-600",
    bgGradient: "from-[#1ed760]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
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
    detailedModules: [
      {
        title: "What Self-Image Is",
        description: "Understand the concept of self-image and how it shapes your life.",
        objectives: [
          "Define self-image in your own words",
          "Understand how self-image affects behavior",
          "Identify your current self-image"
        ],
        content: `Self-image is the mental picture you hold of yourself. It influences every decision you make and every action you take. This module helps you understand and reshape your self-image for better outcomes.`,
        activities: [
          "Write a description of your current self-image",
          "Identify 3 ways your self-image affects your decisions",
          "Create a vision of your ideal self-image"
        ],
        resources: [
          { name: "Self-Image Psychology (Article)", url: "https://www.verywellmind.com/what-is-self-image-2797910" },
          { name: "Self-Concept Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Confidence & Competence",
        description: "Build real confidence through skill development and achievement.",
        objectives: [
          "Understand the confidence-competence loop",
          "Develop skills that build confidence",
          "Practice confidence-building actions"
        ],
        content: `True confidence comes from competence. This module teaches you how to build real confidence through skill development and meaningful achievements.`,
        activities: [
          "Identify 3 skills you want to develop",
          "Create a skill-building plan",
          "Practice one confidence-building action daily"
        ],
        resources: [
          { name: "Building Real Confidence (Article)", url: "https://hbr.org/2021/06/how-to-build-confidence" },
          { name: "Competence-Confidence Loop (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Self-Talk Fundamentals",
        description: "Transform your inner dialogue from critical to supportive.",
        objectives: [
          "Identify negative self-talk patterns",
          "Practice positive self-talk techniques",
          "Build supportive inner dialogue habits"
        ],
        content: `Your inner dialogue shapes your reality. This module teaches you how to transform negative self-talk into supportive, empowering inner dialogue.`,
        activities: [
          "Track your self-talk for one day",
          "Practice reframing negative thoughts",
          "Create positive self-talk affirmations"
        ],
        resources: [
          { name: "Positive Self-Talk Guide (Article)", url: "https://www.verywellmind.com/positive-self-talk" },
          { name: "Cognitive Restructuring (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Identity & Values",
        description: "Clarify who you are and what matters most to you.",
        objectives: [
          "Identify your core values",
          "Clarify your identity",
          "Align actions with values"
        ],
        content: `Knowing who you are and what you value is essential for a strong self-image. This module helps you clarify your identity and live in alignment with your values.`,
        activities: [
          "Complete a values assessment exercise",
          "Write a personal identity statement",
          "Identify areas where your actions don't match your values"
        ],
        resources: [
          { name: "Values Assessment Tool (Article)", url: "https://www.mindtools.com/pages/article/newTED_01.htm" },
          { name: "Identity Formation Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Boundaries & Respect",
        description: "Learn to set healthy boundaries that protect your self-image.",
        objectives: [
          "Understand the importance of boundaries",
          "Practice setting boundaries",
          "Learn to respect others' boundaries"
        ],
        content: `Healthy boundaries protect your self-image and self-respect. This module teaches you how to set and maintain boundaries that support your wellbeing.`,
        activities: [
          "Identify 3 areas where you need better boundaries",
          "Practice setting a boundary in a relationship",
          "Create a personal boundary framework"
        ],
        resources: [
          { name: "Setting Healthy Boundaries (Article)", url: "https://www.psychologytoday.com/us/blog/the-intelligence-divide/201805/why-boundaries-are-important" },
          { name: "Boundary Setting Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Discipline & Consistency",
        description: "Build the discipline to maintain positive self-image habits.",
        objectives: [
          "Understand the science of discipline",
          "Build consistency habits",
          "Practice self-discipline techniques"
        ],
        content: `Discipline is the bridge between goals and achievement. This module teaches you how to build the self-discipline needed to maintain positive self-image habits.`,
        activities: [
          "Create a daily discipline routine",
          "Practice the 5-second rule for motivation",
          "Build a consistency tracking system"
        ],
        resources: [
          { name: "Building Self-Discipline (Article)", url: "https://hbr.org/2021/06/how-to-build-self-discipline" },
          { name: "Consistency Habits (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Resilience & Recovery",
        description: "Learn to bounce back from setbacks without damaging your self-image.",
        objectives: [
          "Develop resilience strategies",
          "Practice self-compassion",
          "Build recovery routines"
        ],
        content: `Setbacks can damage your self-image if you let them. This module teaches you how to bounce back from challenges while maintaining a positive self-image.`,
        activities: [
          "Practice self-compassion after a setback",
          "Create a recovery routine",
          "Identify your resilience strengths"
        ],
        resources: [
          { name: "Building Resilience (Article)", url: "https://www.apa.org/topics/resilience" },
          { name: "Self-Compassion Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Your Self-Image Plan",
        description: "Create a comprehensive plan for building and maintaining a strong self-image.",
        objectives: [
          "Integrate all self-image concepts",
          "Create a personal development plan",
          "Build long-term maintenance strategies"
        ],
        content: `This final module brings everything together. You'll create a comprehensive plan for building and maintaining a strong, healthy self-image over the long term.`,
        activities: [
          "Create a self-image development plan",
          "Design a maintenance routine",
          "Set long-term self-image goals"
        ],
        resources: [
          { name: "Personal Development Planning (Article)", url: "https://hbr.org/2021/06/how-to-create-a-personal-development-plan" },
          { name: "Goal Setting Framework (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "60 minutes"
      }
    ]
  },
  {
    id: "communication",
    title: "Communication",
    description: "Learn communication fundamentals: clarity, listening, confidence, and influence.",
    fullDescription: "Communication is the universal skill. This course teaches fundamentals—speaking clearly, listening deeply, and expressing ideas with confidence—for ages 10–45.",
    ageRange: "10-45",
    icon: Heart,
    iconColor: "text-rose-600",
    bgGradient: "from-[#1ed760]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
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
    detailedModules: [
      {
        title: "Clarity & Structure",
        description: "Learn to structure your communication for maximum clarity and impact.",
        objectives: [
          "Master the clarity-first principle",
          "Structure messages effectively",
          "Eliminate confusion in communication"
        ],
        content: `Clear communication starts with clear thinking. This module teaches you how to structure your thoughts and messages for maximum clarity and impact.`,
        activities: [
          "Practice the pyramid principle for structuring messages",
          "Rewrite 3 unclear messages into clear ones",
          "Create a personal communication template"
        ],
        resources: [
          { name: "Clarity in Communication (Article)", url: "https://hbr.org/2021/06/how-to-communicate-with-clarity" },
          { name: "Message Structure Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Listening Fundamentals",
        description: "Develop active listening skills that make others feel heard and understood.",
        objectives: [
          "Practice active listening techniques",
          "Develop empathetic listening habits",
          "Improve comprehension and retention"
        ],
        content: `Listening is the most important communication skill. This module teaches you how to listen actively, empathetically, and effectively.`,
        activities: [
          "Practice active listening in 3 conversations",
          "Use the 'reflect and confirm' technique",
          "Identify your listening barriers"
        ],
        resources: [
          { name: "Active Listening Guide (Article)", url: "https://www.mindtools.com/pages/article/active-listening.htm" },
          { name: "Listening Skills Training (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Confidence in Speaking",
        description: "Build the confidence to speak up in any situation.",
        objectives: [
          "Overcome speaking anxiety",
          "Develop vocal presence",
          "Practice confident speaking techniques"
        ],
        content: `Confidence in speaking is a skill that can be learned. This module provides techniques for building speaking confidence and overcoming anxiety.`,
        activities: [
          "Practice vocal exercises for presence",
          "Use the 3-second rule for speaking up",
          "Record and review your speaking practice"
        ],
        resources: [
          { name: "Building Speaking Confidence (Article)", url: "https://hbr.org/2021/06/how-to-speak-with-confidence" },
          { name: "Public Speaking Tips (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Asking Better Questions",
        description: "Learn to ask questions that unlock information and build relationships.",
        objectives: [
          "Master different question types",
          "Practice open-ended questioning",
          "Use questions strategically"
        ],
        content: `Good questions unlock information and build relationships. This module teaches you how to ask better questions in any situation.`,
        activities: [
          "Practice converting closed questions to open ones",
          "Use questioning frameworks in conversations",
          "Create a personal question bank"
        ],
        resources: [
          { name: "Art of Questioning (Article)", url: "https://hbr.org/2021/06/how-to-ask-better-questions" },
          { name: "Questioning Techniques (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "40 minutes"
      },
      {
        title: "Difficult Conversations",
        description: "Learn to handle challenging conversations with grace and effectiveness.",
        objectives: [
          "Prepare for difficult conversations",
          "Manage emotions during tough talks",
          "Achieve positive outcomes"
        ],
        content: `Difficult conversations are inevitable, but they don't have to be destructive. This module teaches you how to handle challenging conversations effectively.`,
        activities: [
          "Use the 'prepare, discuss, resolve' framework",
          "Practice emotional regulation techniques",
          "Role-play a difficult conversation scenario"
        ],
        resources: [
          { name: "Difficult Conversations Guide (Article)", url: "https://hbr.org/2021/06/how-to-have-difficult-conversations" },
          { name: "Conflict Resolution Skills (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "55 minutes"
      },
      {
        title: "Non‑Verbal Communication",
        description: "Understand and use body language to enhance your communication.",
        objectives: [
          "Read non-verbal cues effectively",
          "Use body language strategically",
          "Align verbal and non-verbal messages"
        ],
        content: `Non-verbal communication conveys more than words. This module teaches you to read and use body language effectively.`,
        activities: [
          "Practice mirroring techniques",
          "Record and analyze your body language",
          "Identify non-verbal cues in others"
        ],
        resources: [
          { name: "Body Language Guide (Article)", url: "https://www.scienceofpeople.com/body-language" },
          { name: "Non-Verbal Communication (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "45 minutes"
      },
      {
        title: "Influence & Persuasion Basics",
        description: "Learn ethical techniques for influencing others and building consensus.",
        objectives: [
          "Understand influence principles",
          "Practice ethical persuasion",
          "Build consensus effectively"
        ],
        content: `Influence is about helping others see your perspective. This module teaches ethical techniques for influencing and persuading others.`,
        activities: [
          "Practice the 'reciprocity' principle",
          "Use storytelling for influence",
          "Apply Cialdini's principles in real situations"
        ],
        resources: [
          { name: "Influence Psychology (Article)", url: "https://hbr.org/2021/06/how-to-influence-people" },
          { name: "Persuasion Techniques (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "50 minutes"
      },
      {
        title: "Communication Habits for Life",
        description: "Build sustainable communication habits that serve you for a lifetime.",
        objectives: [
          "Create a communication improvement plan",
          "Build daily communication practices",
          "Develop long-term growth strategies"
        ],
        content: `Communication is a lifelong skill. This final module helps you create sustainable habits and a plan for continuous improvement.`,
        activities: [
          "Create a personal communication development plan",
          "Design daily communication practices",
          "Set long-term communication goals"
        ],
        resources: [
          { name: "Communication Mastery (Article)", url: "https://hbr.org/2021/06/how-to-master-communication" },
          { name: "Habit Building Guide (Video)", url: "https://www.youtube.com/watch?v=7TJn5k4X5gk" }
        ],
        estimatedTime: "60 minutes"
      }
    ]
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}