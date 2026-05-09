import { create } from 'zustand';

const DEFAULT_SECTIONS = [
  { id: 'summary', title: 'Professional Summary', type: 'text', content: '', isEnabled: true, order: 0 },
  { id: 'skills', title: 'Technical Skills', type: 'list', content: '', isEnabled: true, order: 1 },
  { id: 'experience', title: 'Work Experience', type: 'array', content: [], isEnabled: true, order: 2 },
  { id: 'internship', title: 'Internship Experience', type: 'array', content: [], isEnabled: false, order: 3 },
  { id: 'projects', title: 'Projects', type: 'array', content: [], isEnabled: true, order: 4 },
  { id: 'education', title: 'Education', type: 'array', content: [], isEnabled: true, order: 5 },
  { id: 'certifications', title: 'Certifications', type: 'array', content: [], isEnabled: true, order: 6 },
  { id: 'languages', title: 'Languages', type: 'text', content: '', isEnabled: true, order: 7 }
];

const useResumeStore = create((set) => ({
  resume: {
    template: 'modern',
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    fatherName: '',
    dob: '',
    address: '',
    nationality: '',
    declaration: '',
    profileImage: '',
    isWizard: false,
    experienceLevel: 'Professional',
    primaryLanguage: '',
    secondaryLanguage: '',
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
