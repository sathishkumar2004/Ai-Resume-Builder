import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useResumeStore from "../../store/resumeStore";
import {
  Sparkles, User, Briefcase, Rocket, GraduationCap,
  Award, Trash2, ChevronRight, ChevronLeft, Download,
  CheckCircle2, Zap, Layout, Eye, X, Check, Plus,
  Maximize2, FileText, Star, Printer, Share2,
  Wand2, RefreshCcw, Eraser, ZoomIn, ZoomOut, RotateCcw, Minus,
  Heart, ArrowRight, Search, Languages
} from "lucide-react";

import TemplateModern from "../resume/TemplateModern";
import TemplateExecutive from "../resume/TemplateExecutive";
import TemplateMinimal from "../resume/TemplateMinimal";
import TemplateCreative from "../resume/TemplateCreative";

// ─── Placeholder data shown when the user hasn't filled in their resume yet ───
const PLACEHOLDER_RESUME = {
  name: 'Sathish Kumar',
  role: 'Full-Stack Developer',
  email: 'sathish@example.com',
  phone: '+91 98765 43210',
  location: 'Chennai, TN',
  primaryLanguage: 'English',
  secondaryLanguage: 'Tamil',
  sections: [
    { id: 'summary', isEnabled: true, type: 'text', content: 'Passionate Full-Stack Developer with experience in building modern web applications using the MERN stack. Specialized in creating high-performance, user-centric interfaces and scalable backend systems.' },
    { id: 'skills', isEnabled: true, type: 'list', content: 'React, Node.js, MongoDB, Express, JavaScript, TypeScript, Tailwind CSS, Git' },
    { id: 'experience', isEnabled: true, type: 'array', content: [{ position: 'Software Engineer', company: 'Tech Solutions', location: 'Chennai', start: 'Jan 2022', end: 'Present', description: '• Developed and maintained multiple React applications.\n• Collaborated with team members to deliver high-quality code.' }] },
    { id: 'education', isEnabled: true, type: 'array', content: [{ degree: 'B.E. Computer Science', institution: 'Anna University', start: '2018', end: '2022', location: 'Chennai' }] },
    { id: 'certifications', isEnabled: true, type: 'array', content: [{ name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023' }] },
    { id: 'languages', isEnabled: true, type: 'text', content: 'English, Tamil' }
  ]
};

function isResumeEmpty(resume) {
  if (resume.name && resume.name.trim()) return false;
  if (resume.fatherName && resume.fatherName.trim()) return false;
  if (resume.dob && resume.dob.trim()) return false;
  if (resume.address && resume.address.trim()) return false;
  
  const hasSectionContent = (resume.sections || []).some(s => {
    if (!s.isEnabled) return false;
    if (Array.isArray(s.content)) return s.content.length > 0;
    return typeof s.content === 'string' && s.content.trim().length > 0;
  });
  return !hasSectionContent;
}

const EditorSection = ({ title, icon: Icon, sectionId, children }) => {
  const { resume, toggleSection } = useResumeStore();
  const section = sectionId ? resume.sections.find(s => s.id === sectionId) : null;
  const isEnabled = section ? section.isEnabled : true;

  return (
    <div className={`editor-step-card ${!isEnabled ? 'disabled-section' : ''}`}>
      <div className="step-header-u" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-box-u" style={{ opacity: isEnabled ? 1 : 0.4 }}><Icon size={20} /></div>
          <h2 style={{ opacity: isEnabled ? 1 : 0.4 }}>{title}</h2>
        </div>
        
        {sectionId && (
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            background: isEnabled ? '#eff6ff' : '#f1f5f9',
            padding: '6px 12px',
            borderRadius: '100px',
            border: `1px solid ${isEnabled ? '#bfdbfe' : '#e2e8f0'}`,
            transition: '0.2s'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isEnabled ? '#2563eb' : '#64748b' }}>
              {isEnabled ? 'ON' : 'OFF'}
            </span>
            <input 
              type="checkbox" 
              checked={isEnabled} 
              onChange={() => toggleSection(sectionId)} 
              style={{ display: 'none' }}
            />
            <div style={{
              width: '32px', height: '18px', background: isEnabled ? '#2563eb' : '#cbd5e1', borderRadius: '10px', position: 'relative', transition: '0.2s'
            }}>
              <div style={{
                width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isEnabled ? '16px' : '2px', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </div>
          </label>
        )}
      </div>
      
      {isEnabled ? (
        <div className="step-body-u">
          {children}
        </div>
      ) : (
        <div className="step-body-u" style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', background: '#f8fafc', borderRadius: '0 0 16px 16px' }}>
          This section is currently hidden from your resume. Toggle it ON to edit and display it.
        </div>
      )}
    </div>
  );
};

export default function UnifiedBuilder({ onExit, initialStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loadingAI, setLoadingAI] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [langInput, setLangInput] = useState("");
  const [langSuggestions, setLangSuggestions] = useState([]);
  const [showLangSuggestions, setShowLangSuggestions] = useState(false);

  // Common languages for suggestions
  const COMMON_LANGS = ["English (Native)", "English (Professional)", "English (Fluent)", "Spanish (Fluent)", "French (Intermediate)", "German (Basic)", "Hindi (Native)", "Tamil (Native)", "Mandarin (Basic)", "Japanese (Basic)"];

  // Common skills for local suggestions
  const COMMON_SKILLS = ["React", "JavaScript", "Node.js", "Python", "SQL", "AWS", "Docker", "Kubernetes", "TypeScript", "Tailwind CSS", "Redux", "Java", "C++", "HTML", "CSS", "Git", "GitHub", "Azure", "GCP", "PostgreSQL", "MongoDB", "Express.js", "REST API", "GraphQL"];

  const handleAutoSuggestSkills = async () => {
    setLoadingAI(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ai/suggest-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume })
      });
      const data = await response.json();
      if (data.success) {
        const currentSkills = (resume.sections.find(s => s.id === 'skills').content || '').split(',').filter(s => s.trim());
        const newSkills = data.skills.split(',').map(s => s.trim()).filter(s => !currentSkills.includes(s));
        updateSectionContent('skills', [...currentSkills, ...newSkills].join(', '));
      }
    } catch (err) {
      console.error("Auto-suggest skills failed:", err);
    } finally {
      setLoadingAI(false);
    }
  };
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleTimeString());
  const [previewScale, setPreviewScale] = useState(0.85);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navigate = useNavigate();

  const { resume, updateBasicDetails, updateSectionContent } = useResumeStore();

  const handleAIEnhance = async (sectionId, index = null) => {
    setLoadingAI(true);
    try {
      const section = resume.sections.find(s => s.id === sectionId);
      let value = section.content;
      if (index !== null) value = section.content[index].description;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/ai/enhance`, {
        field: sectionId,
        value,
        context: { role: resume.role, level: "Mid-Level" }
      });

      if (res.data.success) {
        if (index !== null) {
          const newContent = [...section.content];
          newContent[index].description = res.data.suggestion;
          updateSectionContent(sectionId, newContent);
        } else {
          updateSectionContent(sectionId, res.data.suggestion);
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoadingAI(false); }
  };

  const isEmpty = isResumeEmpty(resume);
  const displayResume = isEmpty ? { ...PLACEHOLDER_RESUME, template: resume.template } : resume;

  const renderTemplate = () => {
    const props = { resume: displayResume, primaryColor: "#2563eb" };
    switch (displayResume.template) {
      case 'modern': return <TemplateModern {...props} />;
      case 'executive': return <TemplateExecutive {...props} />;
      case 'minimal': return <TemplateMinimal {...props} />;
      case 'creative': return <TemplateCreative {...props} />;
      default: return <TemplateModern {...props} />;
    }
  };

  return (
    <div className="unified-builder-root">
      <div className="builder-workspace">

        {/* 1. Left Mini Nav */}
        <aside className="builder-mini-nav">
          <div className="nav-logo-u" onClick={onExit}><Rocket size={24} /></div>
          <div className="nav-steps-stack">
            {[1, 2, 3, 4, 5, 6, 7].map(step => (
              <button
                key={step}
                className={`step-dot ${currentStep === step ? 'active' : ''}`}
                onClick={() => setCurrentStep(step)}
              >
                <div className="dot-inner" />
                <span className="dot-label">
                  {step === 1 ? 'Personal' :
                   step === 2 ? 'Summary' :
                   step === 3 ? 'Work' :
                   step === 4 ? 'Education' :
                   step === 5 ? 'Skills' :
                   step === 6 ? 'Languages' : 'Certifications'}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* 2. Focused Editor Pane (Wizard Style) */}
        <main className={`editor-guided-pane ${showMobilePreview ? 'hidden-mobile' : ''}`}>
          <header className="guided-header">
            <div className="header-top-u">
              <button
                className="hamburger-toggle-u"
                onClick={() => setShowMobileNav(true)}
              >
                <div className="hamburger-line" />
                <div className="hamburger-line" />
                <div className="hamburger-line" />
              </button>
              <span className="step-indicator-pill">Step {currentStep} of 7</span>
              <div className="sync-status-u">
                <div className="pulse-dot" />
                {isSaving ? "Syncing..." : `Last saved: ${lastSaved}`}
              </div>
            </div>
            <div className="wizard-progress-track">
              <motion.div
                className="wizard-progress-fill"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>
          </header>

          <div className="guided-content-area scrollbar-hide">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="step-transition-wrapper"
              >
                {currentStep === 1 && (
                  <EditorSection title="Personal Information" icon={User}>
                    <div className="form-grid-u">
                      <div className="input-box-u">
                        <label>Full Name</label>
                        <input value={resume.name} onChange={e => updateBasicDetails({ name: e.target.value })} placeholder="Alex Johnson" />
                      </div>
                      <div className="input-box-u">
                        <label>Target Job Title</label>
                        <input value={resume.role} onChange={e => updateBasicDetails({ role: e.target.value })} placeholder="Software Engineer" />
                      </div>
                      <div className="input-box-u">
                        <label>Email Address</label>
                        <input value={resume.email} onChange={e => updateBasicDetails({ email: e.target.value })} placeholder="alex@example.com" />
                      </div>
                      <div className="input-box-u">
                        <label>Phone Number</label>
                        <input value={resume.phone} onChange={e => updateBasicDetails({ phone: e.target.value })} placeholder="+1 555 0123" />
                      </div>
                      <div className="input-box-u">
                        <label>Primary Language</label>
                        <input value={resume.primaryLanguage} onChange={e => updateBasicDetails({ primaryLanguage: e.target.value })} placeholder="e.g. English" />
                      </div>
                      <div className="input-box-u">
                        <label>Secondary Language</label>
                        <input value={resume.secondaryLanguage} onChange={e => updateBasicDetails({ secondaryLanguage: e.target.value })} placeholder="e.g. Spanish" />
                      </div>
                      <div className="input-box-u full">
                        <label>Current Location</label>
                        <input value={resume.location} onChange={e => updateBasicDetails({ location: e.target.value })} placeholder="New York, NY" />
                      </div>
                    </div>
                  </EditorSection>
                )}

                {currentStep === 2 && (
                  <EditorSection title="Professional Summary" icon={Sparkles} sectionId="summary">
                    <div className="ai-editor-box-u">
                      <div className="ai-toolbar-u">
                        <label>Executive Overview</label>
                        <button className="btn-ai-sparkle" onClick={() => handleAIEnhance('summary')} disabled={loadingAI}>
                          {loadingAI ? <RefreshCcw className="spin" size={12} /> : <Wand2 size={12} />}
                          Auto-write with AI
                        </button>
                      </div>
                      <textarea
                        className="summary-textarea-u"
                        rows={12}
                        value={resume.sections.find(s => s.id === 'summary').content}
                        onChange={e => updateSectionContent('summary', e.target.value)}
                        placeholder="Write a compelling summary of your career achievements..."
                      />
                      <div className="pro-tip-box-u">
                        <p><strong>Expert Tip:</strong> Focus on your top 3 achievements rather than just listing responsibilities. Keep it under 4 lines for maximum impact.</p>
                      </div>
                    </div>
                  </EditorSection>
                )}

                {currentStep === 3 && (
                  <EditorSection title="Work History" icon={Briefcase} sectionId="experience">
                    <div className="entries-list-u">
                      {resume.sections.find(s => s.id === 'experience').content.map((exp, i) => (
                        <div key={i} className="entry-card-u">
                          <div className="entry-head-u">
                            <div className="head-left-u">
                              <h3>Position #{i + 1}</h3>
                              <div className="role-type-toggle-u">
                                <button
                                  className={exp.type === 'Work' || !exp.type ? 'active' : ''}
                                  onClick={() => {
                                    const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                    newExp[i].type = 'Work';
                                    updateSectionContent('experience', newExp);
                                  }}
                                >Work</button>
                                <button
                                  className={exp.type === 'Internship' ? 'active' : ''}
                                  onClick={() => {
                                    const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                    newExp[i].type = 'Internship';
                                    updateSectionContent('experience', newExp);
                                  }}
                                >Internship</button>
                              </div>
                            </div>
                            <button className="btn-del-u" onClick={() => {
                              const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                              newExp.splice(i, 1);
                              updateSectionContent('experience', newExp);
                            }}><Trash2 size={14} /></button>
                          </div>
                          <div className="form-grid-u three-col">
                            <div className="input-box-u">
                              <label>Job Title</label>
                              <input value={exp.position} onChange={e => {
                                const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                newExp[i].position = e.target.value;
                                updateSectionContent('experience', newExp);
                              }} placeholder="e.g. Senior Software Engineer" />
                            </div>
                            <div className="input-box-u">
                              <label>Organization</label>
                              <input value={exp.company} onChange={e => {
                                const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                newExp[i].company = e.target.value;
                                updateSectionContent('experience', newExp);
                              }} placeholder="e.g. TechNova Solutions" />
                            </div>
                            <div className="input-box-u">
                              <label>Location</label>
                              <input value={exp.location || ''} onChange={e => {
                                const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                newExp[i].location = e.target.value;
                                updateSectionContent('experience', newExp);
                              }} placeholder="e.g. San Francisco, CA" />
                            </div>
                          </div>

                          <div className="date-grid-u">
                            <div className="date-group-u">
                              <label>Employment Period</label>
                              <div className="date-controls-row-u">
                                <div className="date-picker-group-u">
                                  <span className="date-sublabel-u">From</span>
                                  <div className="select-pair-u">
                                    <select
                                      value={exp.start?.split(' ')[0] || ''}
                                      className="custom-select-u"
                                      onChange={e => {
                                        const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                        const year = exp.start?.split(' ')[1] || '2024';
                                        newExp[i].start = `${e.target.value} ${year}`;
                                        updateSectionContent('experience', newExp);
                                      }}
                                    >
                                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select
                                      value={exp.start?.split(' ')[1] || ''}
                                      className="custom-select-u"
                                      onChange={e => {
                                        const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                        const month = exp.start?.split(' ')[0] || 'Jan';
                                        newExp[i].start = `${month} ${e.target.value}`;
                                        updateSectionContent('experience', newExp);
                                      }}
                                    >
                                      {Array.from({ length: 35 }, (_, idx) => 2026 - idx).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                </div>

                                <div className="date-picker-group-u">
                                  <div className="label-with-toggle-u">
                                    <span className="date-sublabel-u">To</span>
                                    <label className="present-switch-u">
                                      <input
                                        type="checkbox"
                                        checked={exp.end === 'Present'}
                                        onChange={e => {
                                          const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                          newExp[i].end = e.target.checked ? 'Present' : 'Jan 2024';
                                          updateSectionContent('experience', newExp);
                                        }}
                                      />
                                      <span className="switch-text-u">Present</span>
                                    </label>
                                  </div>

                                  {exp.end !== 'Present' ? (
                                    <div className="select-pair-u">
                                      <select
                                        value={exp.end?.split(' ')[0] || ''}
                                        className="custom-select-u"
                                        onChange={e => {
                                          const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                          const year = exp.end?.split(' ')[1] || '2024';
                                          newExp[i].end = `${e.target.value} ${year}`;
                                          updateSectionContent('experience', newExp);
                                        }}
                                      >
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                                      </select>
                                      <select
                                        value={exp.end?.split(' ')[1] || ''}
                                        className="custom-select-u"
                                        onChange={e => {
                                          const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                                          const month = exp.end?.split(' ')[0] || 'Jan';
                                          newExp[i].end = `${month} ${e.target.value}`;
                                          updateSectionContent('experience', newExp);
                                        }}
                                      >
                                        {Array.from({ length: 35 }, (_, idx) => 2026 - idx).map(y => <option key={y} value={y}>{y}</option>)}
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="present-badge-u">Currently Working Here</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="ai-editor-box-u experience-ai-box">
                            <div className="ai-toolbar-u mini">
                              <label>Description & Achievements</label>
                              <button className="btn-ai-sparkle mini" onClick={() => handleAIEnhance('experience', i)} disabled={loadingAI}>
                                {loadingAI ? <RefreshCcw className="spin" size={10} /> : <Wand2 size={10} />}
                                AI Enhance
                              </button>
                            </div>
                            <textarea rows={6} value={exp.description} onChange={e => {
                              const newExp = [...resume.sections.find(s => s.id === 'experience').content];
                              newExp[i].description = e.target.value;
                              updateSectionContent('experience', newExp);
                            }} placeholder="Briefly describe what you did..." />
                          </div>
                        </div>
                      ))}
                      <button className="btn-add-entry-u" onClick={() => {
                        const section = resume.sections.find(s => s.id === 'experience');
                        updateSectionContent('experience', [...section.content, { type: 'Work', position: '', company: '', location: '', start: 'Jan 2024', end: 'Present', description: '' }]);
                      }}>
                        <Plus size={16} /> Add Experience
                      </button>
                    </div>
                  </EditorSection>
                )}

                {currentStep === 4 && (
                  <EditorSection title="Education" icon={GraduationCap} sectionId="education">
                    <div className="entries-list-u">
                      {resume.sections.find(s => s.id === 'education').content.map((edu, i) => (
                        <div key={i} className="entry-card-u">
                          <div className="entry-head-u">
                            <h3>Academic Entry #{i + 1}</h3>
                            <button className="btn-del-u" onClick={() => {
                              const newEdu = [...resume.sections.find(s => s.id === 'education').content];
                              newEdu.splice(i, 1);
                              updateSectionContent('education', newEdu);
                            }}><Trash2 size={14} /></button>
                          </div>
                          <div className="form-grid-u">
                            <div className="input-box-u full">
                              <label>Degree / Certificate</label>
                              <input value={edu.degree} onChange={e => {
                                const newEdu = [...resume.sections.find(s => s.id === 'education').content];
                                newEdu[i].degree = e.target.value;
                                updateSectionContent('education', newEdu);
                              }} placeholder="Bachelor of Science in CS" />
                            </div>
                            <div className="input-box-u full">
                              <label>Institution Name</label>
                              <input value={edu.institution} onChange={e => {
                                const newEdu = [...resume.sections.find(s => s.id === 'education').content];
                                newEdu[i].institution = e.target.value;
                                updateSectionContent('education', newEdu);
                              }} placeholder="University of Technology" />
                            </div>
                            <div className="input-box-u">
                              <label>Start Date</label>
                              <input value={edu.start || edu.year?.split('–')[0]?.trim()} onChange={e => {
                                const newEdu = [...resume.sections.find(s => s.id === 'education').content];
                                newEdu[i].start = e.target.value;
                                updateSectionContent('education', newEdu);
                              }} placeholder="MM/YYYY" />
                            </div>
                            <div className="input-box-u">
                              <label>End Date</label>
                              <input value={edu.end || edu.year?.split('–')[1]?.trim()} onChange={e => {
                                const newEdu = [...resume.sections.find(s => s.id === 'education').content];
                                newEdu[i].end = e.target.value;
                                updateSectionContent('education', newEdu);
                              }} placeholder="MM/YYYY or Present" />
                            </div>
                            <div className="input-box-u full">
                              <label>Campus Location</label>
                              <input value={edu.location} onChange={e => {
                                const newEdu = [...resume.sections.find(s => s.id === 'education').content];
                                newEdu[i].location = e.target.value;
                                updateSectionContent('education', newEdu);
                              }} placeholder="City, Country" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="btn-add-entry-u" onClick={() => {
                        const section = resume.sections.find(s => s.id === 'education');
                        updateSectionContent('education', [...section.content, { degree: '', institution: '', start: '', end: '', location: '' }]);
                      }}>
                        <Plus size={16} /> Add Education
                      </button>
                    </div>
                  </EditorSection>
                )}

                {currentStep === 5 && (
                  <EditorSection title="Technical Skills" icon={Rocket} sectionId="skills">
                    <div className="ai-editor-box-u experience-ai-box">
                      <div className="ai-toolbar-u mini">
                        <label>Skill Management</label>
                        <button className="btn-ai-sparkle mini" onClick={handleAutoSuggestSkills} disabled={loadingAI}>
                          {loadingAI ? <RefreshCcw className="spin" size={10} /> : <Zap size={10} />}
                          Auto-Extract from Resume
                        </button>
                      </div>

                      <div className="skills-tag-container-u">
                        <div className="search-suggest-box-u">
                          <div className="skill-input-wrapper-u">
                            <Search size={16} className="search-icon-u" />
                            <input
                              type="text"
                              value={skillInput}
                              placeholder="Add a skill (e.g. React, Docker...)"
                              onChange={e => {
                                setSkillInput(e.target.value);
                                const filtered = COMMON_SKILLS.filter(s => s.toLowerCase().startsWith(e.target.value.toLowerCase()));
                                setSkillSuggestions(filtered.length > 0 ? filtered : []);
                                setShowSuggestions(true);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault();
                                  const val = e.target.value.trim();
                                  if (val) {
                                    const currentSkills = (resume.sections.find(s => s.id === 'skills').content || '').split(',').filter(s => s.trim());
                                    if (!currentSkills.includes(val)) {
                                      updateSectionContent('skills', [...currentSkills, val].join(', '));
                                    }
                                    setSkillInput("");
                                    setShowSuggestions(false);
                                  }
                                }
                              }}
                            />
                            {showSuggestions && skillInput && (
                              <div className="suggestions-dropdown-u">
                                {skillSuggestions.map(s => (
                                  <button key={s} onClick={() => {
                                    const currentSkills = (resume.sections.find(s => s.id === 'skills').content || '').split(',').filter(s => s.trim());
                                    if (!currentSkills.includes(s)) {
                                      updateSectionContent('skills', [...currentSkills, s].join(', '));
                                    }
                                    setSkillInput("");
                                    setShowSuggestions(false);
                                  }}>{s}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="tags-flex-u">
                          {(resume.sections.find(s => s.id === 'skills').content || '').split(',').filter(s => s.trim()).map((skill, idx) => (
                            <div key={idx} className="skill-chip-u">
                              <span>{skill.trim()}</span>
                              <button onClick={() => {
                                const currentSkills = (resume.sections.find(s => s.id === 'skills').content || '').split(',').filter(s => s.trim());
                                currentSkills.splice(idx, 1);
                                updateSectionContent('skills', currentSkills.join(', '));
                              }}><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                        <div className="skills-tip-u">
                          💡 <strong>Pro Tip:</strong> Click <strong>Auto-Extract</strong> to let AI analyze your experience and suggest matching skills instantly.
                        </div>
                      </div>
                    </div>
                  </EditorSection>
                )}

                {currentStep === 6 && (
                  <EditorSection title="Languages" icon={Languages} sectionId="languages">
                    <div className="ai-editor-box-u experience-ai-box">
                      <div className="ai-toolbar-u mini">
                        <label>Linguistic Proficiencies</label>
                      </div>
                      
                      <div className="skills-tag-container-u" style={{ padding: '20px' }}>
                        <div className="form-grid-u">
                          <div className="input-box-u full">
                            <label>Primary Language (Native/Fluent)</label>
                            <input 
                              value={resume.primaryLanguage || ''} 
                              onChange={e => updateBasicDetails({ primaryLanguage: e.target.value })}
                              placeholder="e.g. English (Native)"
                            />
                          </div>
                          <div className="input-box-u full">
                            <label>Secondary Languages</label>
                            <input 
                              value={resume.secondaryLanguage || ''} 
                              onChange={e => updateBasicDetails({ secondaryLanguage: e.target.value })}
                              placeholder="e.g. Spanish (Professional), French (Basic)"
                            />
                          </div>
                        </div>

                        <div className="skills-tip-u" style={{ marginTop: '20px' }}>
                          💡 <strong>Pro Tip:</strong> Clearly distinguishing your primary language helps recruiters understand your core communication strength, while secondary languages showcase your versatility.
                        </div>
                      </div>
                    </div>
                  </EditorSection>
                )}

                {currentStep === 7 && (
                  <EditorSection title="Certifications" icon={Award} sectionId="certifications">
                    <div className="entries-list-u">
                      {(resume.sections.find(s => s.id === 'certifications').content || []).map((cert, idx) => (
                        <div key={idx} className="entry-card-u">
                          <div className="entry-head-u">
                            <h3>Certification #{idx + 1}</h3>
                            <button className="btn-del-u" onClick={() => {
                              const newCerts = [...resume.sections.find(s => s.id === 'certifications').content];
                              newCerts.splice(idx, 1);
                              updateSectionContent('certifications', newCerts);
                            }}><Trash2 size={16} /></button>
                          </div>
                          <div className="form-grid-u">
                            <div className="input-box-u full">
                              <label>Course / Certification Name</label>
                              <input 
                                value={cert.name} 
                                onChange={e => {
                                  const newCerts = [...resume.sections.find(s => s.id === 'certifications').content];
                                  newCerts[idx] = { ...newCerts[idx], name: e.target.value };
                                  updateSectionContent('certifications', newCerts);
                                }}
                                placeholder="e.g. AWS Solutions Architect"
                              />
                            </div>
                            <div className="input-box-u">
                              <label>Issuing Institution</label>
                              <input 
                                value={cert.issuer} 
                                onChange={e => {
                                  const newCerts = [...resume.sections.find(s => s.id === 'certifications').content];
                                  newCerts[idx] = { ...newCerts[idx], issuer: e.target.value };
                                  updateSectionContent('certifications', newCerts);
                                }}
                                placeholder="e.g. Amazon Web Services"
                              />
                            </div>
                            <div className="input-box-u">
                              <label>Year / Date</label>
                              <input 
                                value={cert.date} 
                                onChange={e => {
                                  const newCerts = [...resume.sections.find(s => s.id === 'certifications').content];
                                  newCerts[idx] = { ...newCerts[idx], date: e.target.value };
                                  updateSectionContent('certifications', newCerts);
                                }}
                                placeholder="e.g. 2023"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="btn-add-entry-u" onClick={() => {
                        const current = resume.sections.find(s => s.id === 'certifications').content || [];
                        updateSectionContent('certifications', [...current, { name: '', issuer: '', date: '' }]);
                      }}>
                        <Plus size={18} /> Add Certification
                      </button>
                    </div>
                  </EditorSection>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="guided-footer-u">
            <button
              className={`nav-btn-wizard prev ${currentStep === 1 ? 'disabled' : ''}`}
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={18} /> Back
            </button>
            <div className="footer-dots-u">
              {[1, 2, 3, 4, 5, 6, 7].map(s => <div key={s} className={`f-dot ${currentStep === s ? 'active' : ''}`} />)}
            </div>
            {currentStep < 7 ? (
              <button
                className="nav-btn-wizard next"
                onClick={() => {
                  setIsSaving(true);
                  setTimeout(() => {
                    setCurrentStep(currentStep + 1);
                    setIsSaving(false);
                    setLastSaved(new Date().toLocaleTimeString());
                  }, 600);
                }}
              >
                {isSaving ? <RefreshCcw className="spin" size={18} /> : <>Save & Continue <ChevronRight size={18} /></>}
              </button>
            ) : (
              <button className="nav-btn-wizard finish" onClick={() => navigate("/preview")}>
                Finish <CheckCircle2 size={18} />
              </button>
            )}
          </footer>
        </main>

        {/* 2.1 Mobile Nav Drawer */}
        <AnimatePresence>
          {showMobileNav && (
            <>
              <motion.div
                className="drawer-overlay-u"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileNav(false)}
              />
              <motion.div
                className="mobile-nav-drawer-u"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="drawer-header-u">
                  <div className="logo-u">Elite<span>CV</span></div>
                  <button className="close-drawer-u" onClick={() => setShowMobileNav(false)}>
                    <X size={20} />
                  </button>
                             <div className="drawer-steps-u">
                  {[1, 2, 3, 4, 5, 6, 7].map(step => (
                    <button
                      key={step}
                      className={`drawer-step-item ${currentStep === step ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentStep(step);
                        setShowMobileNav(false);
                      }}
                    >
                      <div className="step-num-u">{step}</div>
                      <span className="step-text-u">
                        {step === 1 ? 'Personal Info' :
                          step === 2 ? 'Professional Summary' :
                            step === 3 ? 'Work History' :
                              step === 4 ? 'Education' : 
                                step === 5 ? 'Technical Skills' : 
                                  step === 6 ? 'Languages' : 'Certifications'}
                      </span>
                      {currentStep === step && <CheckCircle2 size={16} className="active-check" />}
                    </button>
                  ))}
                </div>
   </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <section className={`builder-preview-stage ${showMobilePreview ? 'visible-mobile' : ''}`}>
          {/* Floating Mobile Toggle */}
          <button
            className="mobile-preview-toggle"
            onClick={() => navigate('/preview')}
          >
            <Eye size={20} />
            <span>Preview</span>
          </button>
          <header className="preview-toolbar-u">
            <div className="zoom-controls-u">
              <button onClick={() => setPreviewScale(s => Math.max(0.5, s - 0.1))}><ZoomOut size={16} /></button>
              <span className="zoom-val">{Math.round(previewScale * 100)}%</span>
              <button onClick={() => setPreviewScale(s => Math.min(1.5, s + 0.1))}><ZoomIn size={16} /></button>
            </div>
            <div className="toolbar-actions-u">
              <button className="btn-utility-u" onClick={() => navigate("/preview")}><Eye size={16} /> Preview</button>
              <button className="btn-utility-u" onClick={() => window.print()}><Printer size={16} /> Print</button>
            </div>
          </header>

          <div className="preview-scroll-area scrollbar-hide">
            {isEmpty && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                background: 'rgba(251, 191, 36, 0.9)',
                color: '#78350f',
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
              }}>
                <Zap size={14} /> Live Sample Preview
              </div>
            )}
            <motion.div
              className="a4-canvas-u"
              style={{ scale: previewScale, transformOrigin: 'top center' }}
            >
              {renderTemplate()}
            </motion.div>
          </div>
        </section>

      </div>

      <style>{`
        .unified-builder-root {
          height: 100vh;
          width: 100vw;
          background: #f8fafc;
          overflow: hidden;
        }

        .builder-workspace {
          display: flex;
          height: 100%;
        }

        /* 1. Mini Nav */
        .builder-mini-nav {
          width: 72px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 0;
          z-index: 100;
        }
        .nav-logo-u { color: #2563eb; margin-bottom: 40px; cursor: pointer; transition: 0.3s; }
        .nav-logo-u:hover { transform: rotate(15deg) scale(1.1); }
        
        .nav-steps-stack { display: flex; flex-direction: column; gap: 24px; }
        .step-dot { 
          width: 12px; height: 12px; border-radius: 50%; background: #e2e8f0; border: none; cursor: pointer; position: relative; transition: 0.3s;
        }
        .step-dot.active { background: #2563eb; transform: scale(1.4); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .dot-label { position: absolute; left: 30px; top: 50%; transform: translateY(-50%); background: #1e293b; color: white; padding: 4px 10px; border-radius: 6px; font-size: 10px; opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap; }
        .step-dot:hover .dot-label { opacity: 1; left: 40px; }

        .skills-tip-u{
        padding: 10px 5px;
        }

        /* 2. Guided Editor */
        .editor-guided-pane {
          width: 500px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 10px 0 30px rgba(0,0,0,0.02);
        }
        .guided-header { padding: 32px; border-bottom: 1px solid #f1f5f9; }
        .header-top-u { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .step-indicator-pill { background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .sync-status-u { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #64748b; font-weight: 600; }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.5; } 100% { transform: scale(0.9); opacity: 1; } }

        .wizard-progress-track { width: 100%; height: 4px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .wizard-progress-fill { height: 100%; background: #2563eb; }

        .guided-content-area { flex: 1; overflow-y: auto; padding: 20px; }
        .editor-step-card h2 { font-size: 1.6rem; font-weight: 800; color: #0f172a;  letter-spacing: -0.5px; }
        .step-header-u { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .icon-box-u { width: 56px; height: 56px; background: #eff6ff; color: #2563eb; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08); }

        .form-grid-u { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-grid-u .full { grid-column: span 2; }
        .input-box-u { margin-bottom: 24px; }
        .input-box-u label { display: block; font-size: 0.7rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em; }
        .input-box-u input, .input-box-u textarea, .entry-card-u input, .entry-card-u textarea { 
          width: 100%; padding: 16px 20px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); color: #0f172a;
          width: 100%; padding: 16px 20px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; font-weight: 500; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); color: #0f172a;
        }
        .form-grid-u.three-col { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1200px) { .form-grid-u.three-col { grid-template-columns: 1fr; } }

        .input-box-u input:focus, .input-box-u textarea:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.1); transform: translateY(-1px); }
        .input-box-u input::placeholder { color: #94a3b8; }

        .date-controls-row-u { display: flex; gap: 32px; align-items: flex-end; }
        .date-picker-group-u { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .date-sublabel-u { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
        .select-pair-u { display: flex; gap: 8px; }
        .custom-select-u { flex: 1; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 0.85rem; font-weight: 600; color: #1e293b; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .custom-select-u:focus { border-color: #2563eb; background-color: white; outline: none; }
        
        .label-with-toggle-u { display: flex; justify-content: space-between; align-items: center; }
        .present-switch-u { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .present-switch-u input { width: 14px; height: 14px; accent-color: #2563eb; cursor: pointer; }
        .switch-text-u { font-size: 0.65rem; font-weight: 800; color: #2563eb; text-transform: uppercase; }
        .tags-flex-u { display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; align-items: center; padding: 8px; }
        .skill-chip-u { background: #f1f5f9; color: #1e293b; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; border: 1px solid #e2e8f0; transition: 0.2s; white-space: nowrap; }
        .skill-chip-u.language { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }
        
        .present-badge-u { height: 46px; background: #eff6ff; color: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; border: 1px dashed #bfdbfe; }

        .ai-editor-box-u {
          margin-top: 24px;
          background: #fcfdfe;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
        }
        .ai-editor-box-u:focus-within {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.12);
        }

        .ai-toolbar-u { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 18px 24px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .btn-ai-sparkle { 
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
          color: white; 
          border: none; 
          padding: 8px 18px; 
          border-radius: 10px; 
          font-size: 12px; 
          font-weight: 700; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          cursor: pointer; 
          transition: 0.3s;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .btn-ai-sparkle:hover { 
          transform: translateY(-2px) scale(1.02); 
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          filter: brightness(1.1);
        }
        .btn-ai-sparkle:active { transform: translateY(0); }

        .btn-ai-sparkle.mini { padding: 4px 10px; font-size: 10px; border-radius: 6px; }
        .ai-toolbar-u.mini { padding: 8px 16px; background: #f1f5f9; }
        .experience-ai-box { margin-top: 12px; border-radius: 12px; }
        .experience-ai-box textarea { border-top-left-radius: 0; border-top-right-radius: 0; min-height: 120px; font-size: 0.85rem width:100%; !important; line-height: 1.6 !important; }

        .search-suggest-box-u { margin-bottom: 15px; position: relative; padding:5px }
        .skill-input-wrapper-u { display: flex; align-items: center; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 0 18px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 6px rgba(0,0,0,0.03); }
        .skill-input-wrapper-u:focus-within { border-color: #2563eb; background: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08), 0 0 0 1px rgba(37, 99, 235, 0.1); transform: translateY(-1px); }
        .search-icon-u { color: #94a3b8; transition: 0.2s; }
        .skill-input-wrapper-u:focus-within .search-icon-u { color: #2563eb; }
        .skill-input-wrapper-u input { border: none !important; outline: none !important; box-shadow: none !important; padding: 16px 12px !important; flex: 1; font-size: 0.95rem; font-weight: 500; color: #1e293b; background: transparent !important; }
        .skill-input-wrapper-u input::placeholder { color: #94a3b8; font-weight: 400; }

        .suggestions-dropdown-u { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 50; overflow: hidden; }
        .suggestions-dropdown-u button { width: 100%; text-align: left; padding: 10px 16px; background: none; border: none; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; transition: 0.2s; border-bottom: 1px solid #f1f5f9; }
        .suggestions-dropdown-u button:hover { background: #f8fafc; color: #2563eb; }
        .suggestions-dropdown-u button:last-child { border-bottom: none; }

        .summary-textarea-u {
          width: 100%;
          min-height: 280px;
          padding: 24px !important;
          border: none !important;
          background: transparent !important;
          font-size: 1rem !important;
          line-height: 1.7 !important;
          resize: none;
          color: #334155;
          transition: 0.2s;
        }
        .summary-textarea-u:focus { box-shadow: none !important; transform: none !important; }
        .tip-icon { color: #f59e0b; padding-top: 2px; }
        .pro-tip-box-u p { font-size: 0.8rem; color: #92400e; line-height: 1.5; margin: 0; padding:10px }

        .entries-list-u { display: flex; flex-direction: column; gap: 24px; }
        .entry-card-u { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 16px; }
        .entry-head-u { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .head-left-u { display: flex; align-items: center; gap: 16px; }
        .role-type-toggle-u { display: flex; background: #f1f5f9; padding: 3px; border-radius: 8px; }
        .role-type-toggle-u button { padding: 4px 10px; border: none; background: none; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; border-radius: 6px; cursor: pointer; transition: 0.2s; color: #64748b; }
        .role-type-toggle-u button.active { background: white; color: #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        
        .entry-head-u h3 { font-size: 0.85rem; font-weight: 800; color: #1e293b; }
        .btn-del-u { color: #94a3b8; background: transparent; border: none; cursor: pointer; transition: 0.2s; }
        .btn-del-u:hover { color: #ef4444; }

        .btn-add-entry-u { width: 100%; padding: 14px; background: transparent; border: 2px dashed #e2e8f0; border-radius: 100px; color: #64748b; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; }
        .btn-add-entry-u:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

        .guided-footer-u { padding: 24px; border-top: 1px solid #f1f5f9; background: white; display: flex; justify-content: space-between; align-items: center; }
        .nav-btn-wizard { flex: 1; max-width: 150px; height: 44px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-btn-wizard.prev { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .nav-btn-wizard.prev:hover:not(.disabled) { background: #f1f5f9; color: #1e293b; transform: translateY(-1px); }
        .nav-btn-wizard.prev.disabled { opacity: 0.4; cursor: not-allowed; }
        .nav-btn-wizard.next { background: #2563eb; color: white; border: none; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15); }
        .nav-btn-wizard.next:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25); }
        .nav-btn-wizard.finish { background: #10b981; color: white; border: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15); }
        .nav-btn-wizard.finish:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); }
        
        .footer-dots-u { display: flex; gap: 12px; }
        .f-dot { width: 6px; height: 6px; border-radius: 50%; background: #e2e8f0; transition: 0.3s; }
        .f-dot.active { background: #2563eb; transform: scale(1.3); }

        /* 3. Preview Area */
        .builder-preview-stage { flex: 1; background: #f1f5f9; display: flex; flex-direction: column; position: relative; }
        .preview-toolbar-u { height: 72px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; padding: 0 40px; }
        .zoom-controls-u { display: flex; align-items: center; gap: 16px; background: #f8fafc; padding: 6px 16px; border-radius: 100px; border: 1px solid #e2e8f0; }
        .zoom-controls-u button { background: none; border: none; color: #64748b; cursor: pointer; transition: 0.2s; }
        .zoom-controls-u button:hover { color: #2563eb; }
        .zoom-val { font-size: 0.8rem; font-weight: 800; color: #1e293b; width: 40px; text-align: center; }

        .toolbar-actions-u { display: flex; gap: 12px; }
        .btn-utility-u { background: white; border: 1px solid #e2e8f0; color: #475569; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
        .btn-utility-u:hover { background: #f8fafc; transform: translateY(-1px); }

        .preview-scroll-area { flex: 1; overflow: auto; padding: 60px 40px; display: flex; justify-content: center; background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px); background-size: 24px 24px; }
        
        /* --- RESPONSIVE REFINEMENTS --- */
        
        .mobile-preview-toggle {
          display: none;
          position: fixed;
          bottom: 100px;
          right: 24px;
          z-index: 1000;
          background: #1e293b;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 100px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.3s;
        }

        @media (max-width: 1200px) {
          .builder-preview-stage { 
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            height: 100%;
            z-index: 2000;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .builder-preview-stage.visible-mobile { right: 0; }
          .mobile-preview-toggle { display: flex; }
          .editor-guided-pane { width: 100%; flex: none; }
        }

        @media (max-width: 768px) {
          .builder-mini-nav { display: none; }
          .guided-header { padding: 20px; }
          .guided-body-scroll { padding: 20px; }
          .guided-footer-u { 
            padding: 16px 20px; 
            flex-direction: row; 
            gap: 12px; 
            height: auto; 
            min-height: 80px;
            background: #ffffff;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.06);
            justify-content: space-between;
          }
          .nav-btn-wizard { 
            flex: 1;
            max-width: none; 
            height: 46px;
            font-size: 0.85rem;
            order: unset; 
          }
          .nav-btn-wizard.prev { background: white; border: 1.5px solid #e2e8f0; }
          .footer-dots-u { display: none; }
          .step-header-u { flex-direction: column; align-items: flex-start; gap: 12px; }
          .step-header-u h2 { font-size: 1.2rem; }
          .preview-toolbar-u { padding: 10px 20px; flex-direction: column; gap: 10px; height: auto; }
          .toolbar-actions-u { display: flex; width: 100%; justify-content: space-between; }
          .btn-utility-u { flex: 1; justify-content: center; }
          
          /* Fix form grids and inputs on mobile */
          .form-grid-u { grid-template-columns: 1fr; gap: 16px; }
          .form-grid-u .full { grid-column: 1; }
          .date-controls-row-u { flex-direction: column; align-items: stretch; gap: 16px; }
          
          /* Fix AI toolbar on mobile */
          .ai-toolbar-u { flex-direction: column; align-items: stretch; gap: 12px; text-align: left; }
          .btn-ai-sparkle { justify-content: center; }
        }

        @media (max-width: 480px) {
          .step-indicator-pill { display: none; }
          .sync-status-u { font-size: 0.7rem; }
          .entry-card-u { padding: 16px; }
          .head-left-u { flex-direction: column; align-items: flex-start; gap: 8px; }
        }

        .a4-canvas-u { background: white; width: 210mm; min-height: 297mm; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15); }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
