// Sample seed data for the Student Community Hub

export const SUBJECTS = [
  "Maths",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Social Science (SST)",
  "Information Technology & Artificial Intelligence",
];

export const CLASSES = ["Class 9", "Class 10", "Class 11", "Class 12"];

export interface SampleQuestion {
  id: number;
  title: string;
  description: string;
  subject: string;
  className: string;
  authorName: string;
  votes: number;
  answers: SampleAnswer[];
  isAnswered: boolean;
  createdAt: string;
  bookmarked: boolean;
  userVote: "up" | "down" | null;
}

export interface SampleAnswer {
  id: number;
  content: string;
  authorName: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  userVote: "up" | "down" | null;
}

export interface SampleNote {
  id: number;
  title: string;
  uploaderName: string;
  subject: string;
  className: string;
  description: string;
  downloadLink: string;
  votes: number;
  bookmarked: boolean;
  userVote: "up" | "down" | null;
  featured?: boolean;
}

export interface SampleGroup {
  id: number;
  name: string;
  subject: string;
  className: string;
  members: number;
  description: string;
  joined: boolean;
  creator: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  badges: string[];
  className: string;
  avatar: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
}

export interface SampleQuiz {
  id: number;
  title: string;
  subject: string;
  className: string;
  questions: QuizQuestion[];
}

export interface ExamPaper {
  id: number;
  title: string;
  subject: string;
  className: string;
  year: string;
  type: "sample" | "previous" | "revision";
  downloadLink: string;
}

export const sampleQuestions: SampleQuestion[] = [
  {
    id: 1,
    title: "How do I solve quadratic equations?",
    description:
      "I'm struggling with quadratic equations in my Class 10 Maths. Can someone explain the different methods — factoring, completing the square, and the quadratic formula? Which method is easiest for board exams?",
    subject: "Maths",
    className: "Class 10",
    authorName: "Rohit Kumar",
    votes: 24,
    isAnswered: true,
    createdAt: "2 hours ago",
    bookmarked: false,
    userVote: null,
    answers: [
      {
        id: 101,
        content:
          "The quadratic formula is the most reliable: x = (-b ± √(b²-4ac)) / 2a. For board exams, start by trying factoring — if the discriminant is a perfect square, factoring is fastest. Otherwise use the formula. Remember to check discriminant (b²-4ac): positive = 2 real roots, zero = 1 root, negative = no real roots.",
        authorName: "Prashant Kirad",
        votes: 15,
        isAccepted: true,
        createdAt: "1 hour ago",
        userVote: null,
      },
      {
        id: 102,
        content:
          "I recommend completing the square for understanding. Once you master that, the quadratic formula becomes obvious. Practice at least 20 problems of each type before the exam.",
        authorName: "Arjun Sharma",
        votes: 8,
        isAccepted: false,
        createdAt: "45 min ago",
        userVote: null,
      },
    ],
  },
  {
    id: 2,
    title: "What is photosynthesis?",
    description:
      "Can someone explain photosynthesis in detail? I need to understand the light-dependent and light-independent reactions for my Class 10 Science exam. Also, what is the role of chlorophyll?",
    subject: "Science",
    className: "Class 10",
    authorName: "Sneha Verma",
    votes: 18,
    isAnswered: true,
    createdAt: "5 hours ago",
    bookmarked: true,
    userVote: null,
    answers: [
      {
        id: 201,
        content:
          "Photosynthesis is the process by which plants make food using sunlight. The equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Chlorophyll absorbs red and blue light, reflects green (that's why plants look green). Light reactions happen in thylakoids, Calvin cycle in stroma.",
        authorName: "Meera Patel",
        votes: 12,
        isAccepted: true,
        createdAt: "4 hours ago",
        userVote: null,
      },
    ],
  },
  {
    id: 3,
    title: "Explain Newton's laws of motion",
    description:
      "My Class 11 Physics exam is next week and I'm confused about the three laws of Newton. Can someone give practical examples for each? Also how do they relate to each other?",
    subject: "Physics",
    className: "Class 11",
    authorName: "Karan Mehta",
    votes: 31,
    isAnswered: true,
    createdAt: "1 day ago",
    bookmarked: false,
    userVote: null,
    answers: [
      {
        id: 301,
        content:
          "1st Law (Inertia): Objects stay at rest or in motion unless acted upon by external force. Example: passenger jerks backward when bus suddenly moves forward. 2nd Law: F = ma. Force = mass × acceleration. 3rd Law: Every action has equal and opposite reaction. Example: rocket propulsion. They're all connected — inertia explains why F is needed, F=ma quantifies it, and reactions show forces always come in pairs.",
        authorName: "Prashant Kirad",
        votes: 22,
        isAccepted: true,
        createdAt: "22 hours ago",
        userVote: null,
      },
    ],
  },
  {
    id: 4,
    title: "How to write an essay introduction?",
    description:
      "I always struggle with essay introductions in Class 9 English. My teacher says my intros are too boring. What's the hook-bridge-thesis structure? Any tips for making intros engaging?",
    subject: "English",
    className: "Class 9",
    authorName: "Ananya Das",
    votes: 12,
    isAnswered: false,
    createdAt: "3 hours ago",
    bookmarked: false,
    userVote: null,
    answers: [],
  },
  {
    id: 5,
    title: "What is the difference between acid and base?",
    description:
      "Can someone explain acids and bases clearly? I want to understand pH scale, indicators, and examples from daily life. This is for my Class 10 Chemistry chapter.",
    subject: "Chemistry",
    className: "Class 10",
    authorName: "Vikram Singh",
    votes: 9,
    isAnswered: false,
    createdAt: "6 hours ago",
    bookmarked: false,
    userVote: null,
    answers: [],
  },
];

export const sampleNotes: SampleNote[] = [
  {
    id: 1,
    title: "Class 10 Science Complete Notes",
    uploaderName: "Prashant Kirad",
    subject: "Science",
    className: "Class 10",
    description:
      "Detailed notes covering important concepts and chapters of Class 10 Science useful for board exam preparation. Includes diagrams, formulas, and key points for all chapters.",
    downloadLink:
      "https://drive.google.com/drive/folders/1c-Q5vO6pKcNg7OKTc0G2bml8Uc2F0Cz0",
    votes: 47,
    bookmarked: true,
    userVote: null,
    featured: true,
  },
  {
    id: 2,
    title: "Maths Formula Sheet - All Chapters",
    uploaderName: "Arjun Sharma",
    subject: "Maths",
    className: "Class 10",
    description:
      "Complete formula sheet for Class 10 Maths covering algebra, geometry, trigonometry, and statistics. Perfect for quick revision before exams.",
    downloadLink: "https://drive.google.com/drive/folder",
    votes: 38,
    bookmarked: false,
    userVote: null,
  },
  {
    id: 3,
    title: "English Grammar Guide",
    uploaderName: "Meera Patel",
    subject: "English",
    className: "Class 9",
    description:
      "Comprehensive grammar guide with rules, examples, and practice exercises. Covers tenses, voice, narration, and parts of speech.",
    downloadLink: "https://drive.google.com/drive/folder",
    votes: 29,
    bookmarked: false,
    userVote: null,
  },
  {
    id: 4,
    title: "Physics Numericals Practice Set",
    uploaderName: "Rohan Gupta",
    subject: "Physics",
    className: "Class 11",
    description:
      "100+ solved numericals for Class 11 Physics covering mechanics, optics, and thermodynamics. Step-by-step solutions included.",
    downloadLink: "https://drive.google.com/drive/folder",
    votes: 33,
    bookmarked: false,
    userVote: null,
  },
  {
    id: 5,
    title: "Class 10 SST Complete Notes",
    uploaderName: "Prashant Kirad",
    subject: "Social Science (SST)",
    className: "Class 10",
    description:
      "Comprehensive Social Science notes covering History, Geography, Civics, and Economics for Class 10 board exam preparation.",
    downloadLink:
      "https://drive.google.com/drive/folders/1WeoPZNWNWG7atttMFXy7NhPyGYz7JJTc",
    votes: 31,
    bookmarked: false,
    userVote: null,
  },
  {
    id: 6,
    title: "Class 10 Maths Important Questions",
    uploaderName: "Prashant Kirad",
    subject: "Maths",
    className: "Class 10",
    description:
      "Important questions and practice problems for Class 10 Maths — all chapters covered with solutions. Perfect for last-minute revision.",
    downloadLink:
      "https://drive.google.com/file/d/1kPOkCJGBRXbRZ7EredBctGA3g9JJe_Xm/view",
    votes: 42,
    bookmarked: false,
    userVote: null,
  },
  {
    id: 7,
    title: "Class 10 English Notes",
    uploaderName: "Prashant Kirad",
    subject: "English",
    className: "Class 10",
    description:
      "Complete English notes including First Flight, Footprints Without Feet, grammar rules, letter writing, and essay formats for Class 10.",
    downloadLink:
      "https://drive.google.com/drive/folders/1sDS36DSjmqM0Ype5ySKEaNDvFDKJ21rh",
    votes: 28,
    bookmarked: false,
    userVote: null,
  },
  {
    id: 8,
    title: "Class 10 IT and AI Notes",
    uploaderName: "Prashant Kirad",
    subject: "Information Technology & Artificial Intelligence",
    className: "Class 10",
    description:
      "Detailed notes for Information Technology and Artificial Intelligence subject covering all units required for Class 10 exams.",
    downloadLink:
      "https://drive.google.com/drive/folders/1fn42pBpJo5Qgntd1SX1H3wz0nw57NP9s",
    votes: 19,
    bookmarked: false,
    userVote: null,
  },
];

export const sampleGroups: SampleGroup[] = [
  {
    id: 1,
    name: "Maths Masters",
    subject: "Maths",
    className: "Class 10",
    members: 12,
    description:
      "Daily problem solving, formula revision, and exam strategy for Class 10 Maths. We meet virtually every evening.",
    joined: false,
    creator: "Arjun Sharma",
  },
  {
    id: 2,
    name: "Science Squad",
    subject: "Science",
    className: "Class 10",
    members: 9,
    description:
      "Collaborative learning for Class 10 Science. Share notes, ask doubts, and prepare together for boards.",
    joined: true,
    creator: "Prashant Kirad",
  },
  {
    id: 3,
    name: "Physics Pro",
    subject: "Physics",
    className: "Class 11",
    members: 7,
    description:
      "Advanced Physics group for Class 11 students targeting IIT-JEE. Regular mock tests and concept discussions.",
    joined: false,
    creator: "Rohan Gupta",
  },
  {
    id: 4,
    name: "English Excellence",
    subject: "English",
    className: "Class 9",
    members: 15,
    description:
      "Improve writing skills, grammar, and literature comprehension for Class 9 English board exams.",
    joined: false,
    creator: "Meera Patel",
  },
];

export const leaderboard: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Prashant Kirad",
    points: 450,
    badges: ["Top Helper", "Science Expert"],
    className: "Class 10",
    avatar: "PK",
  },
  {
    rank: 2,
    name: "Arjun Sharma",
    points: 380,
    badges: ["Maths Master"],
    className: "Class 10",
    avatar: "AS",
  },
  {
    rank: 3,
    name: "Meera Patel",
    points: 290,
    badges: ["Science Expert"],
    className: "Class 9",
    avatar: "MP",
  },
  {
    rank: 4,
    name: "Rohan Gupta",
    points: 210,
    badges: ["Top Helper"],
    className: "Class 11",
    avatar: "RG",
  },
  {
    rank: 5,
    name: "Sneha Singh",
    points: 180,
    badges: [],
    className: "Class 10",
    avatar: "SS",
  },
  {
    rank: 6,
    name: "Vikram Singh",
    points: 145,
    badges: [],
    className: "Class 10",
    avatar: "VS",
  },
  {
    rank: 7,
    name: "Ananya Das",
    points: 120,
    badges: [],
    className: "Class 9",
    avatar: "AD",
  },
];

export const sampleQuizzes: SampleQuiz[] = [
  {
    id: 1,
    title: "Class 10 Science Quiz",
    subject: "Science",
    className: "Class 10",
    questions: [
      {
        id: 1,
        question: "What gas do plants absorb during photosynthesis?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctOption: 1,
      },
      {
        id: 2,
        question: "What is the chemical formula for water?",
        options: ["H2O2", "CO2", "H2O", "NaCl"],
        correctOption: 2,
      },
      {
        id: 3,
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
        correctOption: 2,
      },
      {
        id: 4,
        question: "What is the SI unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        correctOption: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Class 10 Maths Quiz",
    subject: "Maths",
    className: "Class 10",
    questions: [
      {
        id: 1,
        question: "What is the value of π (pi) approximately?",
        options: ["3.14", "2.71", "1.41", "1.73"],
        correctOption: 0,
      },
      {
        id: 2,
        question: "What is the sum of angles in a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        correctOption: 1,
      },
      {
        id: 3,
        question: "Solve: If 2x + 4 = 10, what is x?",
        options: ["2", "3", "4", "5"],
        correctOption: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Class 11 Physics Quiz",
    subject: "Physics",
    className: "Class 11",
    questions: [
      {
        id: 1,
        question: "What does Newton's Second Law state?",
        options: ["F = mv", "F = ma", "F = m/a", "F = a/m"],
        correctOption: 1,
      },
      {
        id: 2,
        question: "What is the unit of electric current?",
        options: ["Volt", "Ohm", "Ampere", "Watt"],
        correctOption: 2,
      },
      {
        id: 3,
        question: "The speed of light in vacuum is approximately:",
        options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"],
        correctOption: 1,
      },
    ],
  },
];

export const examPapers: ExamPaper[] = [
  {
    id: 1,
    title: "CBSE Class 10 Science Sample Paper 2024",
    subject: "Science",
    className: "Class 10",
    year: "2024",
    type: "sample",
    downloadLink: "#",
  },
  {
    id: 2,
    title: "CBSE Class 10 Maths Previous Year Paper 2023",
    subject: "Maths",
    className: "Class 10",
    year: "2023",
    type: "previous",
    downloadLink: "#",
  },
  {
    id: 3,
    title: "Class 11 Physics Mid-Term Sample Paper",
    subject: "Physics",
    className: "Class 11",
    year: "2024",
    type: "sample",
    downloadLink: "#",
  },
  {
    id: 4,
    title: "Class 9 English Grammar Quick Revision",
    subject: "English",
    className: "Class 9",
    year: "2024",
    type: "revision",
    downloadLink: "#",
  },
  {
    id: 5,
    title: "CBSE Class 10 Maths Sample Paper 2024",
    subject: "Maths",
    className: "Class 10",
    year: "2024",
    type: "sample",
    downloadLink: "#",
  },
  {
    id: 6,
    title: "Class 10 Science Previous Year Paper 2022",
    subject: "Science",
    className: "Class 10",
    year: "2022",
    type: "previous",
    downloadLink: "#",
  },
];

export const AI_SUGGESTIONS: Record<string, string> = {
  Maths:
    "💡 **AI Tip for Maths:** Start by identifying the type of problem (algebra, geometry, trigonometry). Write down all given information and what you need to find. For equations, always check your answer by substituting back. Break complex problems into smaller steps.",
  Science:
    "💡 **AI Tip for Science:** Use diagrams and flowcharts to remember processes. For chemical equations, always balance atoms on both sides. Connect concepts to real-world examples for better retention. Practice labeling diagrams from memory.",
  Physics:
    "💡 **AI Tip for Physics:** Always write the formula first, then substitute values with units. Check dimensional consistency before calculating. For numerical problems, draw a diagram. Remember: Physics is applied Maths — if you're stuck, think about which formula connects the given quantities.",
  Chemistry:
    "💡 **AI Tip for Chemistry:** Learn the periodic table trends (electronegativity, atomic radius, etc.). Balance equations step-by-step. For organic chemistry, focus on functional groups and reaction types. Use mnemonics for element groups.",
  Biology:
    "💡 **AI Tip for Biology:** Create comparison tables for similar processes (mitosis vs meiosis, aerobic vs anaerobic). Learn diagrams by drawing them repeatedly. Understand the 'why' behind each process — this helps you answer application questions.",
  English:
    "💡 **AI Tip for English:** For essays, follow the structure: Hook → Context → Thesis → Body paragraphs (one idea each) → Conclusion. Read the question carefully to understand if it asks for opinion, explanation, or argument. Good vocabulary can elevate your writing significantly.",
  History:
    "💡 **AI Tip for History:** Create timelines for events. Understand cause-and-effect relationships rather than just memorizing dates. Connect historical events to their long-term consequences. Use newspaper headlines style to remember key events.",
  Geography:
    "💡 **AI Tip for Geography:** Always refer to maps when studying. Understand why geographical features form (not just what they are). Connect physical geography to human activities. Practice map pointing for exams.",
  "Computer Science":
    "💡 **AI Tip for Computer Science:** Practice writing code by hand for exams. Trace through algorithms step-by-step with sample inputs. Understand time complexity concepts. For theory questions, use examples to illustrate your points.",
  default:
    "💡 **AI Tip:** Break this topic into smaller subtopics and study each one systematically. Create notes in your own words after reading. Test yourself with practice questions. Teach the concept to someone else — if you can explain it, you've understood it!",
};
