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