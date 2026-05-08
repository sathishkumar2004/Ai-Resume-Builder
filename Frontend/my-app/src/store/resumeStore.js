import { create } from 'zustand';

const DEFAULT_SECTIONS = [
  { 
    id: 'summary', 
    title: 'Professional Summary', 
    type: 'text', 
    content: 'Results-driven Senior Full-Stack Developer with over 5 years of experience in architecting and deploying scalable web applications using the MERN stack. Expert in designing RESTful APIs, implementing microservices, and optimizing database performance. Proven track record of leading cross-functional teams to deliver production-grade software that increases user engagement and operational efficiency. Adept at leveraging AI-driven development tools and modern DevOps practices to accelerate delivery cycles and ensure 99.9% application uptime.', 
    isEnabled: true, 
    order: 0 
  },
  { 
    id: 'skills', 
    title: 'Technical Skills', 
    type: 'list', 
    content: 'Frontend: React.js, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, Framer Motion\nBackend: Node.js, Express.js, GraphQL, REST APIs, Microservices, JWT/OAuth\nDatabases: MongoDB, PostgreSQL, Redis, Firebase, Data Modeling, Query Optimization\nDevOps & Tools: Git, Docker, Kubernetes, AWS (S3, EC2), CI/CD, Jest, Cypress\nSoft Skills: Technical Leadership, Agile/Scrum, Mentoring, Strategic Planning', 
    isEnabled: true, 
    order: 1 
  },
  { 
    id: 'experience', 
    title: 'Work Experience', 
    type: 'array', 
    content: [
      { 
        type: "Work", 
        company: "TechNova Solutions", 
        position: "Senior Full-Stack Engineer", 
        start: "Jan 2024", 
        end: "Present", 
        location: "Remote",
        description: "• Spearheaded the development of a cloud-native SaaS platform using React and Node.js, resulting in a 40% increase in user retention and $2M annual recurring revenue.\n• Optimized MongoDB aggregation pipelines and implemented Redis caching, reducing average API response times by 65% for high-traffic endpoints.\n• Architected a modular microservices ecosystem that streamlined cross-team deployments and reduced time-to-market for new features by 30%.\n• Integrated advanced AI features into core products, automating 50% of routine customer data analysis tasks." 
      },
      { 
        type: "Work", 
        company: "CreativeStream Inc.", 
        position: "Full-Stack Developer", 
        start: "Jun 2021", 
        end: "Dec 2023", 
        location: "Hybrid",
        description: "• Developed and maintained multiple high-performance web applications, ensuring cross-browser compatibility and mobile-first responsiveness.\n• Implemented secure JWT-based authentication and RBAC, safeguarding sensitive user data for over 100k active users.\n• Collaborated with UX/UI designers to build a reusable component library, improving design-to-development handoff efficiency by 45%.\n• Reduced production bugs by 25% by implementing automated unit and integration testing using Jest and RTL." 
      }
    ], 
    isEnabled: true, 
    order: 2 
  },
  { 
    id: 'internship', 
    title: 'Internship Experience', 
    type: 'array', 
    content: [
      { 
        type: "Internship", 
        company: "Innovation Hub", 
        position: "Software Engineering Intern", 
        start: "Jan 2021", 
        end: "May 2021", 
        location: "Kancheepuram",
        description: "• Assisted in building internal automation tools using Python and Django, saving the team 10+ hours of manual data entry per week.\n• Contributed to the migration of a legacy monolithic application to a React-based frontend, improving user experience scores by 20%." 
      }
    ], 
    isEnabled: true, 
    order: 3 
  },
  { 
    id: 'projects', 
    title: 'Projects', 
    type: 'array', 
    content: [
      { 
        title: "Enterprise AI CRM", 
        stack: "Next.js, Node.js, OpenAI API, PostgreSQL", 
        description: "• Built an AI-powered CRM that automates lead scoring and sentiment analysis, resulting in a 15% increase in sales conversion rates.\n• Designed a real-time dashboard with WebSocket integration for live data tracking and visualization." 
      },
      { 
        title: "Decentralized Finance Tracker", 
        stack: "React, Solidity, Ethers.js, Tailwind", 
        description: "• Developed a Web3 dashboard for tracking portfolio performance across multiple chains, supporting over 50+ DeFi protocols.\n• Integrated hardware wallet support and multi-sig security features for high-value transactions." 
      }
    ], 
    isEnabled: true, 
    order: 4 
  },
  { 
    id: 'education', 
    title: 'Education', 
    type: 'array', 
    content: [
      { 
        institution: "Sri Sankara Arts & Science College", 
        degree: "B.Sc. Computer Science", 
        year: "2018 – 2021", 
        location: "Kancheepuram" 
      }
    ], 
    isEnabled: true, 
    order: 5 
  },
  { 
    id: 'certifications', 
    title: 'Certifications', 
    type: 'array', 
    content: [
      { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2023' },
      { name: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta/Coursera', date: '2022' }
    ], 
    isEnabled: true, 
    order: 6 
  },
  { 
    id: 'languages', 
    title: 'Languages', 
    type: 'text', 
    content: '• English (Professional)\n• Spanish (Professional)\n• French (Basic)', 
    isEnabled: true, 
    order: 7 
  }
];

const useResumeStore = create((set) => ({
  resume: {
    template: 'modern',
    name: 'Sathishkumar S',
    role: 'Senior Full-Stack Developer',
    email: 'sathish@example.com',
    phone: '+91 98765 43210',
    location: 'Chennai, India',
    linkedin: 'linkedin.com/in/sathish',
    portfolio: 'sathish.dev',
    experienceLevel: 'Senior',
    primaryLanguage: 'English',
    secondaryLanguage: 'Tamil',
    sections: DEFAULT_SECTIONS
  },
  atsScore: 85,
  analysis: null,

  updateBasicDetails: (details) => set((state) => ({
    resume: { ...state.resume, ...details }
  })),

  updateSectionContent: (sectionId, content) => set((state) => ({
    resume: {
      ...state.resume,
      sections: state.resume.sections.map(s => 
        s.id === sectionId ? { ...s, content } : s
      )
    }
  })),

  toggleSection: (sectionId) => set((state) => ({
    resume: {
      ...state.resume,
      sections: state.resume.sections.map(s => 
        s.id === sectionId ? { ...s, isEnabled: !s.isEnabled } : s
      )
    }
  })),

  reorderSections: (newSections) => set((state) => ({
    resume: { ...state.resume, sections: newSections }
  })),

  setAtsData: (score, analysis) => set({ atsScore: score, analysis }),

  resetResume: () => set({
    resume: {
      template: 'modern',
      name: '',
      role: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      experienceLevel: 'Professional',
      sections: DEFAULT_SECTIONS.map(s => ({
        ...s,
        content: s.type === 'array' ? [] : '',
        isEnabled: s.id !== 'internship' // Standard sections on by default
      }))
    },
    atsScore: 0,
    analysis: null
  }),

  setFullResume: (newResumeData) => set((state) => ({
    resume: {
      ...state.resume,
      ...newResumeData,
      sections: state.resume.sections.map(s => {
        const newData = newResumeData.sections?.find(ns => ns.id === s.id);
        return newData ? { ...s, ...newData, isEnabled: true } : s;
      })
    },
    atsScore: 95
  }))
}));

export default useResumeStore;
