import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, User, GraduationCap, Briefcase, CheckCircle2, Loader2, Wand2, X, Plus } from "lucide-react";
import useResumeStore from "../store/resumeStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SUGGESTED_SKILLS = {
  fresher: ["MS Office","Excel","Communication","HTML/CSS","Problem Solving","Typing","Python","Java","Photoshop","Teamwork","Time Management","Research"],
  tech: ["React","Node.js","JavaScript","TypeScript","Python","Java","SQL","MongoDB","AWS","Docker","Git","REST API"],
};

const STEP_LABELS_FRESHER = ["Who Are You?","Education","Skills","Personal","Generate"];
const STEP_LABELS_EXP = ["Who Are You?","Experience","Skills","Generate"];

export default function AIWizard() {
  const navigate = useNavigate();
  const { updateBasicDetails, updateSectionContent, toggleSection } = useResumeStore();
  const [candidateType, setCandidateType] = useState(null); // 'fresher' | 'experienced'
  const [step, setStep] = useState(0); // 0 = type selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedOk, setGeneratedOk] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // Fresher form
  const [fresher, setFresher] = useState({
    name: "", email: "", phone: "", location: "",
    role: "", college: "", degree: "", yearOfPassing: "",
    skills: [], languages: "",
    fatherName: "", dob: "", address: "", nationality: "",
  });

  // Experienced form
  const [exp, setExp] = useState({
    name: "", email: "", phone: "", location: "",
    role: "", experienceYears: "", currentCompany: "",
    skills: [], education: "",
  });

  const isFresher = candidateType === "fresher";
  const form = isFresher ? fresher : exp;
  const setForm = isFresher ? setFresher : setExp;
  const totalSteps = isFresher ? 5 : 4;

  const addSkill = (s) => {
    const trimmed = s.trim();
    if (!trimmed) return;
    const key = isFresher ? "fresher" : "exp";
    const current = isFresher ? fresher.skills : exp.skills;
    if (!current.includes(trimmed)) setForm(p => ({ ...p, skills: [...p.skills, trimmed] }));
    setSkillInput("");
  };
  const removeSkill = (s) => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = { ...form, skills: form.skills.join(", ") };
      const res = await fetch(`${API}/api/ai/wizard-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: candidateType, formData }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const r = data.resume;

      // Populate the resume store
      updateBasicDetails({
        name: form.name, email: form.email, phone: form.phone,
        location: form.location, role: form.role, template: "modern",
        primaryLanguage: (isFresher ? fresher.languages : "English").split(",")[0]?.trim() || "English",
      });
      if (r.summary) updateSectionContent("summary", r.summary);
      if (r.skills) updateSectionContent("skills", r.skills);
      if (r.experience?.length) updateSectionContent("experience", r.experience);
      if (r.education?.length) updateSectionContent("education", r.education);
      if (r.projects?.length) updateSectionContent("projects", r.projects);
      if (r.certifications?.length) updateSectionContent("certifications", r.certifications);

      setGeneratedOk(true);
    } catch (e) {
      setError("AI generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const next = () => setStep(s => s + 1);
  const back = () => step === 1 ? (setCandidateType(null), setStep(0)) : setStep(s => s - 1);

  // ─── Step 0: Choose type ─────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={S.page} className="wizard-page">
        <button onClick={() => navigate("/dashboard")} style={S.backBtn}><ArrowLeft size={18}/> Dashboard</button>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={S.center}>
          <div style={S.wizardBadge}><Wand2 size={16}/> AI Resume Wizard</div>
          <h1 style={S.h1}>Build Your Resume in Minutes</h1>
          <p style={S.sub}>Answer a few questions and AI will generate a professional resume for you instantly.</p>
          <div style={S.typeGrid} className="wizard-type-grid">
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} style={S.typeCard} onClick={() => { setCandidateType("fresher"); setStep(1); }}>
              <GraduationCap size={40} color="#2563eb"/>
              <h3 style={{margin:"12px 0 6px",color:"#1e293b"}}>🎓 Fresher / Student</h3>
              <p style={{color:"#64748b",fontSize:"0.85rem"}}>No work experience? No problem. Perfect for students and fresh graduates.</p>
              <div style={S.pillBlue}>Get Started →</div>
            </motion.button>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} style={S.typeCard} onClick={() => { setCandidateType("experienced"); setStep(1); }}>
              <Briefcase size={40} color="#6366f1"/>
              <h3 style={{margin:"12px 0 6px",color:"#1e293b"}}>💼 Experienced Professional</h3>
              <p style={{color:"#64748b",fontSize:"0.85rem"}}>Have work experience? Showcase your career achievements professionally.</p>
              <div style={{...S.pillBlue, background:"#6366f1"}}>Get Started →</div>
            </motion.button>
          </div>
        </motion.div>
        <style>{globalCSS}</style>
      </div>
    );
  }

  const stepLabels = isFresher ? STEP_LABELS_FRESHER : STEP_LABELS_EXP;

  // ─── Progress bar ────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div style={S.progressWrap}>
      {stepLabels.map((label, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
              <div style={{...S.dot, background: done ? "#10b981" : active ? "#2563eb" : "#e2e8f0", color: (done||active) ? "white" : "#94a3b8"}}>
                {done ? <CheckCircle2 size={14}/> : i+1}
              </div>
              <span style={{fontSize:"0.62rem",marginTop:"4px",color:active?"#2563eb":done?"#10b981":"#94a3b8",fontWeight:active?"700":"500",textAlign:"center"}}>{label}</span>
            </div>
            {i < stepLabels.length - 1 && <div style={{height:"2px",flex:2,background:done?"#10b981":"#e2e8f0",margin:"0 4px",marginBottom:"18px"}}/>}
          </div>
        );
      })}
    </div>
  );

  // ─── Input helper ────────────────────────────────────────────────────────
  const Field = ({ label, placeholder, field, type="text", half }) => (
    <div style={{...S.fieldWrap, ...(half ? {flex:"1 1 45%"} : {})}}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} placeholder={placeholder} value={form[field]||""}
        onChange={e => setForm(p => ({...p, [field]: e.target.value}))} />
    </div>
  );

  // ─── Skills picker ───────────────────────────────────────────────────────
  const SkillsPicker = () => {
    const suggestions = isFresher ? SUGGESTED_SKILLS.fresher : SUGGESTED_SKILLS.tech;
    return (
      <div>
        <label style={S.label}>Skills (click to add or type your own)</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"12px"}}>
          {suggestions.filter(s => !form.skills.includes(s)).map(s => (
            <button key={s} style={S.suggChip} onClick={() => addSkill(s)}><Plus size={11}/> {s}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
          <input style={{...S.input,flex:1}} placeholder="Type a skill & press Enter" value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"){ e.preventDefault(); addSkill(skillInput); }}} />
          <button style={S.addBtn} onClick={() => addSkill(skillInput)}>Add</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
          {form.skills.map(s => (
            <div key={s} style={S.chip}>{s}<button onClick={() => removeSkill(s)} style={{background:"none",border:"none",cursor:"pointer",padding:"0 0 0 4px",color:"#2563eb"}}><X size={11}/></button></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={S.page}>
      <button onClick={back} style={S.backBtn}><ArrowLeft size={18}/> {step === 1 ? "Change Type" : "Back"}</button>

      <div style={S.wizardWrap} className="wizard-page">
        <div style={S.wizardCard} className="wizard-card">
          <ProgressBar/>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{x:30,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-30,opacity:0}} transition={{duration:0.25}}>

              {/* ── FRESHER STEPS ─────────────────────────────────── */}
              {isFresher && step === 1 && (
                <div>
                  <h2 style={S.stepTitle}>👤 Personal Information</h2>
                  <div style={S.row} className="wizard-row"><Field label="Full Name *" placeholder="e.g. Priya Sharma" field="name" half/>
                  <Field label="Role Applying For *" placeholder="e.g. Frontend Developer" field="role" half/></div>
                  <div style={S.row} className="wizard-row"><Field label="Email Address *" placeholder="priya@email.com" field="email" type="email" half/>
                  <Field label="Phone Number *" placeholder="+91 98765 43210" field="phone" half/></div>
                  <Field label="Current Location" placeholder="Chennai, India" field="location"/>
                </div>
              )}
              {isFresher && step === 2 && (
                <div>
                  <h2 style={S.stepTitle}>🎓 Education Details</h2>
                  <Field label="College / School Name *" placeholder="Anna University" field="college"/>
                  <div style={S.row} className="wizard-row"><Field label="Degree / Course *" placeholder="B.E. Computer Science" field="degree" half/>
                  <Field label="Year of Passing *" placeholder="2025" field="yearOfPassing" half/></div>
                </div>
              )}
              {isFresher && step === 3 && (
                <div>
                  <h2 style={S.stepTitle}>🛠 Skills & Languages</h2>
                  <SkillsPicker/>
                  <div style={{marginTop:"16px"}}><Field label="Languages Known" placeholder="English, Tamil, Hindi" field="languages"/></div>
                </div>
              )}
              {isFresher && step === 4 && (
                <div>
                  <h2 style={S.stepTitle}>📋 Personal Details <span style={{fontSize:"0.75rem",color:"#64748b",fontWeight:"400"}}>(Optional)</span></h2>
                  <div style={S.row} className="wizard-row"><Field label="Father's Name" placeholder="Mr. Rajesh Sharma" field="fatherName" half/>
                  <Field label="Date of Birth" placeholder="DD/MM/YYYY" field="dob" half/></div>
                  <div style={S.row} className="wizard-row"><Field label="Nationality" placeholder="Indian" field="nationality" half/>
                  <Field label="Address" placeholder="123 Main St, Chennai" field="address" half/></div>
                  <div style={{...S.tipBox,marginTop:"16px"}}>
                    💡 <strong>Tip:</strong> Personal details like Date of Birth and Father's Name are optional for most private sector jobs. Include them for government job applications.
                  </div>
                </div>
              )}
              {isFresher && step === 5 && (
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  {!generatedOk ? (
                    <>
                      <Sparkles size={48} color="#2563eb" style={{marginBottom:"16px"}}/>
                      <h2 style={S.stepTitle}>Ready to Generate!</h2>
                      <p style={{color:"#64748b",marginBottom:"24px"}}>AI will create a professional resume for <strong>{fresher.name || "you"}</strong> applying for <strong>{fresher.role || "the role"}</strong>.</p>
                      <div style={S.summaryBox}>
                        <div style={S.summaryRow}><span>👤 Name</span><strong>{fresher.name || "—"}</strong></div>
                        <div style={S.summaryRow}><span>🎯 Role</span><strong>{fresher.role || "—"}</strong></div>
                        <div style={S.summaryRow}><span>🎓 College</span><strong>{fresher.college || "—"}</strong></div>
                        <div style={S.summaryRow}><span>🛠 Skills</span><strong>{fresher.skills.slice(0,5).join(", ") || "—"}</strong></div>
                      </div>
                      {error && <div style={S.errorBox}>{error}</div>}
                      <button style={S.generateBtn} onClick={handleGenerate} disabled={loading}>
                        {loading ? <><Loader2 size={18} className="spin-icon"/> Generating...</> : <><Wand2 size={18}/> Generate My Resume with AI</>}
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={56} color="#10b981" style={{marginBottom:"16px"}}/>
                      <h2 style={{...S.stepTitle,color:"#10b981"}}>Resume Generated! 🎉</h2>
                      <p style={{color:"#64748b",marginBottom:"24px"}}>Your professional resume is ready. You can preview it or continue editing.</p>
                      <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
                        <button style={{...S.generateBtn,background:"white",color:"#2563eb",border:"2px solid #2563eb"}} onClick={() => navigate("/builder")}>✏️ Edit Resume</button>
                        <button style={S.generateBtn} onClick={() => navigate("/preview")}>👁 Preview Resume</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── EXPERIENCED STEPS ─────────────────────────────── */}
              {!isFresher && step === 1 && (
                <div>
                  <h2 style={S.stepTitle}>👤 Personal Information</h2>
                  <div style={S.row} className="wizard-row"><Field label="Full Name *" placeholder="e.g. Arjun Kumar" field="name" half/>
                  <Field label="Target Role *" placeholder="e.g. Senior Backend Developer" field="role" half/></div>
                  <div style={S.row} className="wizard-row"><Field label="Email Address *" placeholder="arjun@email.com" field="email" type="email" half/>
                  <Field label="Phone Number" placeholder="+91 98765 43210" field="phone" half/></div>
                  <Field label="Current Location" placeholder="Bangalore, India" field="location"/>
                </div>
              )}
              {!isFresher && step === 2 && (
                <div>
                  <h2 style={S.stepTitle}>💼 Work Experience</h2>
                  <div style={S.row} className="wizard-row"><Field label="Years of Experience *" placeholder="e.g. 4" field="experienceYears" half/>
                  <Field label="Current / Last Company *" placeholder="e.g. Infosys Ltd" field="currentCompany" half/></div>
                  <Field label="Highest Education" placeholder="B.E. Computer Science, Anna University" field="education"/>
                  <div style={S.tipBox}>💡 AI will generate realistic, ATS-optimized bullet points for your experience based on your role.</div>
                </div>
              )}
              {!isFresher && step === 3 && (
                <div>
                  <h2 style={S.stepTitle}>🛠 Technical Skills</h2>
                  <SkillsPicker/>
                </div>
              )}
              {!isFresher && step === 4 && (
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  {!generatedOk ? (
                    <>
                      <Sparkles size={48} color="#6366f1" style={{marginBottom:"16px"}}/>
                      <h2 style={S.stepTitle}>Ready to Generate!</h2>
                      <p style={{color:"#64748b",marginBottom:"24px"}}>AI will craft a professional resume for <strong>{exp.name || "you"}</strong>.</p>
                      <div style={S.summaryBox}>
                        <div style={S.summaryRow}><span>👤 Name</span><strong>{exp.name || "—"}</strong></div>
                        <div style={S.summaryRow}><span>🎯 Role</span><strong>{exp.role || "—"}</strong></div>
                        <div style={S.summaryRow}><span>🏢 Company</span><strong>{exp.currentCompany || "—"}</strong></div>
                        <div style={S.summaryRow}><span>⏱ Experience</span><strong>{exp.experienceYears ? `${exp.experienceYears} years` : "—"}</strong></div>
                      </div>
                      {error && <div style={S.errorBox}>{error}</div>}
                      <button style={{...S.generateBtn,background:"#6366f1"}} onClick={handleGenerate} disabled={loading}>
                        {loading ? <><Loader2 size={18} className="spin-icon"/> Generating...</> : <><Wand2 size={18}/> Generate My Resume with AI</>}
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={56} color="#10b981" style={{marginBottom:"16px"}}/>
                      <h2 style={{...S.stepTitle,color:"#10b981"}}>Resume Generated! 🎉</h2>
                      <p style={{color:"#64748b",marginBottom:"24px"}}>Your professional resume is ready.</p>
                      <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
                        <button style={{...S.generateBtn,background:"white",color:"#6366f1",border:"2px solid #6366f1"}} onClick={() => navigate("/builder")}>✏️ Edit Resume</button>
                        <button style={{...S.generateBtn,background:"#6366f1"}} onClick={() => navigate("/preview")}>👁 Preview Resume</button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {!(step === totalSteps) && (
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"24px"}} className="wizard-next-row">
              <button style={S.nextBtn} onClick={next}>
                {step === totalSteps - 1 ? "Review & Generate" : "Next"} <ArrowRight size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
      `}</style>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight:"100vh", background:"linear-gradient(135deg,#f0f4ff 0%,#f8fafc 100%)", padding:"24px 16px", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" },
  backBtn: { display:"inline-flex",alignItems:"center",gap:"8px",background:"white",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"8px 16px",cursor:"pointer",color:"#475569",fontWeight:"600",fontSize:"0.85rem",marginBottom:"24px",transition:"0.2s" },
  center: { maxWidth:"720px", margin:"0 auto", textAlign:"center" },
  wizardBadge: { display:"inline-flex",alignItems:"center",gap:"6px",background:"#eff6ff",color:"#2563eb",padding:"6px 14px",borderRadius:"100px",fontSize:"0.8rem",fontWeight:"700",marginBottom:"16px" },
  h1: { fontSize:"clamp(1.4rem,5vw,2.4rem)", fontWeight:"800", color:"#0f172a", margin:"0 0 12px" },
  sub: { color:"#64748b", fontSize:"clamp(0.85rem,3vw,1rem)", marginBottom:"32px" },
  typeGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"16px", textAlign:"left" },
  typeCard: { background:"white", border:"2px solid #e2e8f0", borderRadius:"20px", padding:"24px 20px", cursor:"pointer", textAlign:"center", transition:"0.2s", boxShadow:"0 4px 20px rgba(0,0,0,0.04)", width:"100%", boxSizing:"border-box" },
  pillBlue: { display:"inline-block", marginTop:"16px", background:"#2563eb", color:"white", borderRadius:"100px", padding:"8px 20px", fontSize:"0.85rem", fontWeight:"700" },
  wizardWrap: { maxWidth:"680px", margin:"0 auto", width:"100%" },
  wizardCard: { background:"white", borderRadius:"20px", padding:"24px", boxShadow:"0 20px 60px rgba(0,0,0,0.08)", border:"1px solid #e2e8f0", boxSizing:"border-box", overflowX:"hidden" },
  progressWrap: { display:"flex", alignItems:"flex-start", marginBottom:"28px", overflowX:"auto", paddingBottom:"4px" },
  dot: { width:"26px", height:"26px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", fontWeight:"700", flexShrink:0 },
  stepTitle: { fontSize:"clamp(1rem,4vw,1.25rem)", fontWeight:"800", color:"#0f172a", marginBottom:"18px" },
  row: { display:"flex", gap:"10px", flexWrap:"wrap" },
  fieldWrap: { marginBottom:"14px", flex:"1 1 100%", minWidth:"0", boxSizing:"border-box" },
  label: { display:"block", fontSize:"0.8rem", fontWeight:"700", color:"#475569", marginBottom:"6px" },
  input: { width:"100%", boxSizing:"border-box", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"16px", color:"#1e293b", background:"white", transition:"0.2s" },
  suggChip: { background:"#f1f5f9", border:"1px dashed #cbd5e1", borderRadius:"8px", padding:"6px 10px", fontSize:"0.78rem", cursor:"pointer", color:"#475569", display:"flex", alignItems:"center", gap:"4px", transition:"0.2s" },
  chip: { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"8px", padding:"5px 10px", fontSize:"0.8rem", color:"#1e40af", fontWeight:"600", display:"flex", alignItems:"center", gap:"4px" },
  addBtn: { background:"#2563eb", color:"white", border:"none", borderRadius:"10px", padding:"11px 16px", cursor:"pointer", fontWeight:"700", fontSize:"0.85rem", flexShrink:0 },
  tipBox: { background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"10px", padding:"12px 16px", fontSize:"0.82rem", color:"#92400e", marginTop:"12px", lineHeight:"1.5" },
  summaryBox: { background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"12px", padding:"14px", marginBottom:"20px", textAlign:"left" },
  summaryRow: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", padding:"6px 0", borderBottom:"1px solid #f1f5f9", fontSize:"0.82rem", color:"#64748b", flexWrap:"wrap" },
  generateBtn: { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"10px", background:"#2563eb", color:"white", border:"none", borderRadius:"12px", padding:"14px 24px", fontSize:"0.95rem", fontWeight:"700", cursor:"pointer", transition:"0.2s", width:"100%", maxWidth:"360px", boxSizing:"border-box" },
  errorBox: { background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"12px 16px", color:"#dc2626", fontSize:"0.85rem", marginBottom:"16px", textAlign:"left" },
  nextBtn: { display:"flex", alignItems:"center", gap:"8px", background:"#2563eb", color:"white", border:"none", borderRadius:"10px", padding:"12px 24px", fontWeight:"700", fontSize:"0.9rem", cursor:"pointer" },
};

const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Mobile fixes for AI Wizard */
@media (max-width: 600px) {
  .wizard-row { flex-direction: column !important; }
  .wizard-row > div { flex: 1 1 100% !important; min-width: 0 !important; }
  .wizard-type-grid { grid-template-columns: 1fr !important; }
  .wizard-action-btns { flex-direction: column !important; align-items: stretch !important; }
  .wizard-action-btns button { width: 100% !important; justify-content: center !important; }
  .wizard-next-row { justify-content: stretch !important; }
  .wizard-next-row button { width: 100% !important; justify-content: center !important; }
  .wizard-generate-btn { width: 100% !important; max-width: none !important; }
  .wizard-sugg-chips { gap: 6px !important; }
  .wizard-card { padding: 16px !important; border-radius: 16px !important; }
  .wizard-page { padding: 16px 12px !important; }
}
`;
