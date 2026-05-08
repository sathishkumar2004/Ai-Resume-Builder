import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, BarChart3, Clock, Settings, LogOut, 
  User, Search, Bell, Plus, Star, ShieldCheck, Eye,
  Heart, ArrowRight, Minus, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useResumeStore from "../store/resumeStore";
import TemplateModern from "../components/resume/TemplateModern";
import TemplateExecutive from "../components/resume/TemplateExecutive";
import TemplateMinimal from "../components/resume/TemplateMinimal";
import TemplateCreative from "../components/resume/TemplateCreative";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { updateBasicDetails } = useResumeStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Rich mock resume for high-density previews
  const mockResume = {
    name: 'SATHISHKUMAR S',
    role: 'Senior Full-Stack Developer',
    email: 'sathish@example.com',
    phone: '+91 90870 07104',
    location: 'Chennai, TN',
    primaryLanguage: 'English',
    secondaryLanguage: 'Tamil',
    sections: [
      { id: 'summary', isEnabled: true, type: 'text', content: 'Results-driven Senior Developer with 5+ years of experience in architecting scalable MERN applications. Expert in React, Node.js, and AI-driven development practices.' },
      { id: 'skills', isEnabled: true, type: 'list', content: 'React, Node.js, MongoDB, TypeScript, AWS, Docker, GraphQL' },
      { id: 'experience', isEnabled: true, type: 'array', content: [
        { position: 'Senior Full-Stack Engineer', company: 'TechNova Solutions', start: '2021', end: 'Present', description: '• Led development of SaaS platform.\n• Optimized API performance by 40%.\n• Managed team of 5 developers.' },
        { position: 'Full-Stack Developer', company: 'Innovation Lab', start: '2018', end: '2021', description: '• Built responsive web dashboards.\n• Integrated payment gateways.' }
      ] },
      { id: 'education', isEnabled: true, type: 'array', content: [{ degree: 'B.Sc. Computer Science', institution: 'SSAS College', start: '2015', end: '2018', location: 'India' }] },
      { id: 'projects', isEnabled: true, type: 'array', content: [{ title: 'AI Resume Builder', description: 'Built an automated resume generator using OpenAI.' }] }
    ]
  };

  const renderTemplateMini = (id, color) => {
    const props = { resume: mockResume, primaryColor: color };
    let content;
    switch(id) {
      case 'modern': content = <TemplateModern {...props} />; break;
      case 'executive': content = <TemplateExecutive {...props} />; break;
      case 'minimal': content = <TemplateMinimal {...props} />; break;
      case 'creative': content = <TemplateCreative {...props} />; break;
      default: content = <TemplateModern {...props} />;
    }
    return (
      <div className="mini-tmpl-scale">
         {content}
      </div>
    );
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1500);
  };

  const stats = [
    { title: "Avg. ATS Score", value: "84%", icon: BarChart3, color: "#2563eb" },
    { title: "Resumes Built", value: "12", icon: FileText, color: "#10b981" },
    { title: "Profile Status", value: "Senior", icon: ShieldCheck, color: "#6366f1" },
  ];

  const myResumes = [
    { id: 101, title: 'Senior Full-Stack Developer', date: '2 days ago', template: 'modern', score: 92 },
    { id: 102, title: 'Lead Frontend Engineer', date: '1 week ago', template: 'executive', score: 88 },
    { id: 103, title: 'Node.js Specialist', date: '2 weeks ago', template: 'minimal', score: 95 },
    { id: 104, title: 'Product Architect', date: '1 month ago', template: 'creative', score: 91 },
  ];

  return (
    <div className="dashboard-page">
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="logout-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="logout-modal"
            >
              <div className="spinner" />
              <h3>Securing session...</h3>
              <p>Professional workspace closing</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

       <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            className="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="logo" onClick={() => navigate("/")}>Elite<span>CV</span></div>

        <div className="user-section">
          <div className="avatar">
            <User size={18} />
          </div>
          <div className="info">
            <p className="name">{user?.name || "Professional User"}</p>
            <p className="role">Senior Developer</p>
          </div>
        </div>

        <nav className="side-nav">
          <button className="active"><FileText size={16} /> Documents</button>
          <button><BarChart3 size={16} /> Performance</button>
          <button><Clock size={16} /> Recent Activity</button>
          <button><Settings size={16} /> Preferences</button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> <span>Sign Out</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <div className="header-left">
            <button className="menu-toggle-btn" onClick={() => setIsMobileSidebarOpen(true)}>
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </button>
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search your documents..." />
            </div>
          </div>
          <div className="header-actions">
            <button className="utility-btn desktop-only"><Bell size={18} /></button>
            <button className="create-btn" onClick={() => navigate("/builder")}>
              <Plus size={16} /> <span className="desktop-only">Create New</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content scrollbar-hide">
              <div className="hero-section">
                <h1>Welcome back, {user?.name?.split(' ')[0] || "Professional"}</h1>
                <p>You have <strong>{myResumes.length} active resumes</strong> in your workspace. Your latest version is performing well.</p>
              </div>

              <div className="stats-grid">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="stat-card"
                  >
                    <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}10` }}>
                      <stat.icon size={20} />
                    </div>
                    <div className="stat-info">
                      <p className="stat-label">{stat.title}</p>
                      <p className="stat-value">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <section className="premium-marketplace">
                <div className="marketplace-header">
                  <h2 className="title-gradient">Select a Template</h2>
                  <p className="subtitle">All templates ({myResumes.length}) — Engineered for ATS success.</p>
                </div>

                <div className="template-grid-modern">
                  {myResumes.map((resume, i) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="template-card-premium"
                    >
                      <div className="template-visual-container">
                        {/* Status Badges */}
                        <div className="status-badges">
                           {resume.id === 101 && <span className="badge-pill recommended">Recommended</span>}
                        </div>

                        {/* Centered Plus Hover Overlay */}
                        <div className="template-hover-plus" onClick={() => { updateBasicDetails({ template: resume.template }); navigate("/preview"); }}>
                           <div className="plus-circle"><Plus size={24}/></div>
                        </div>

                        <div className="template-preview-frame">
                           <div className="preview-scaler">
                             {renderTemplateMini(resume.template, selectedColor)}
                           </div>
                        </div>
                      </div>

                      <div className="template-info-area">
                        <button className="btn-choose-gradient" onClick={() => { updateBasicDetails({ template: resume.template }); navigate("/builder"); }}>
                          <span>Choose Template</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --bg: #f1f5f9;
          --sidebar: #ffffff;
          --border: #e2e8f0;
          --text: #0f172a;
          --text-muted: #64748b;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-page {
          height: 100vh;
          background: var(--bg);
          color: var(--text);
          display: flex;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .sidebar {
          width: 260px;
          background: var(--sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px;
          flex-shrink: 0;
          box-shadow: 4px 0 15px rgba(0,0,0,0.02);
        }

        .logo { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px; cursor: pointer; color: #1e293b; transition: var(--transition); }
        .logo:hover { opacity: 0.8; }
        .logo span { color: var(--primary); }

        .user-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 12px;
          margin-bottom: 32px;
          transition: var(--transition);
          border: 1px solid transparent;
        }
        .user-section:hover { background: #e2e8f0; border-color: #cbd5e1; }

        .avatar {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }

        .user-section .name { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
        .user-section .role { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }

        .side-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .side-nav button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .side-nav button:hover { background: #f1f5f9; color: var(--text); transform: translateX(4px); }
        .side-nav button.active { background: #eff6ff; color: var(--primary); }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          color: #ef4444;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .logout-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }

        .dashboard-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        .main-header {
          height: 72px;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border-bottom: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .search-box {
          background: #f1f5f9;
          padding: 0 16px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 300px;
          color: var(--text-muted);
          transition: var(--transition);
          border: 1px solid transparent;
        }
        .search-box:focus-within { background: white; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.05); }

        .search-box input { background: transparent; border: none; color: var(--text); outline: none; width: 100%; font-size: 0.85rem; }

        .header-actions { display: flex; gap: 12px; align-items: center; }
        .utility-btn { width: 40px; height: 40px; border-radius: 10px; background: white; border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .utility-btn:hover { color: var(--text); border-color: var(--text-muted); transform: rotate(15deg); }

        .create-btn {
          background: #1e293b;
          color: white;
          padding: 0 16px;
          height: 40px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }
        .create-btn:hover { background: var(--primary); }

        .dashboard-content { flex: 1; overflow-y: auto; padding: 40px; }

        .hero-section { margin-bottom: 40px; }
        .hero-section h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; color: #1e293b; }
        .hero-section p { color: var(--text-muted); font-size: 0.95rem; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }
        .stat-card { background: white; border: 1px solid var(--border); padding: 20px; border-radius: 16px; display: flex; align-items: center; gap: 16px; transition: var(--transition); }
        .stat-card:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .stat-card:hover .stat-icon { transform: scale(1.1); }
        .stat-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; }
        .stat-value { font-size: 1.4rem; font-weight: 800; color: #1e293b; }        
        
        .section-intro { margin-bottom: 32px; }
        .section-intro h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        .section-intro p { color: var(--text-muted); font-size: 0.95rem; }

        /* Template Grid Large */
        .template-grid-large { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 24px; 
          padding-bottom: 40px;
        }

        .template-large-card { 
          background: white; 
          border: 1px solid var(--border); 
          border-radius: 20px; 
          overflow: hidden; 
          cursor: pointer; 
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .template-large-card:hover { 
          transform: translateY(-8px); 
          border-color: var(--primary); 
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08); 
        }

        .tmpl-visual { 
          height: 320px; 
          position: relative; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          overflow: hidden;
          background: #f1f5f9;
        }

        .tmpl-live-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 20px;
          background: rgba(0,0,0,0.02);
        }

        .mini-tmpl-scale {
          transform: scale(0.35);
          transform-origin: top center;
          width: 794px; /* A4 width */
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          pointer-events: none;
        }

        .tmpl-badge { 
          position: absolute; 
          top: 12px; 
          left: 12px; 
          background: #1e293b;
          color: white; 
          padding: 4px 10px; 
          border-radius: 6px; 
          font-size: 9px; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .start-btn-hover { 
          position: absolute; 
          bottom: -50px; 
          padding: 10px 24px; 
          background: var(--primary); 
          color: white; 
          border-radius: 12px; 
          font-weight: 800; 
          font-size: 0.85rem; 
          border: none; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
          z-index: 20;
        }

        .template-large-card:hover .start-btn-hover { bottom: 20px; }

        .tmpl-body { padding: 16px 20px; flex: 1; display: flex; flex-direction: column; background: white; border-top: 1px solid var(--border); }
        .tmpl-body h3 { font-size: 0.95rem; font-weight: 800; color: #1e293b; }
        
        .rating { display: flex; align-items: center; gap: 4px; background: #fffbeb; color: #f59e0b; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
        
        .tmpl-body p { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px; flex: 1; }
        
        .tmpl-action-btn-mini { 
          width: 100%; 
          padding: 10px; 
          background: #f8fafc; 
          color: #64748b; 
          border: 1px solid var(--border);
          border-radius: 10px; 
          font-weight: 700; 
          font-size: 0.8rem; 
          cursor: pointer; 
          transition: var(--transition);
        }
        .template-large-card:hover .tmpl-action-btn-mini { background: #eff6ff; color: var(--primary); border-color: #bfdbfe; }

        .logout-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .logout-modal { text-align: center; }
        .logout-modal h3 { font-size: 1.4rem; font-weight: 800; margin-top: 16px; color: #1e293b; }
        .logout-modal p { color: var(--text-muted); font-size: 0.9rem; }

        .spinner { width: 48px; height: 48px; border: 3px solid #f1f5f9; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .scrollbar-hide::-webkit-scrollbar { display: none; }

        /* Premium Marketplace Section */
        .premium-marketplace { margin-top: 40px; padding-bottom: 80px; }
        .marketplace-header { margin-bottom: 32px; }
        .title-gradient { font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 0.95rem; color: #64748b; margin-top: 4px; font-weight: 500; }

        .template-grid-modern { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 24px; 
          justify-content: flex-start;
          padding-bottom: 40px;
        }

        .template-card-premium { 
          background: white; 
          border-radius: 20px; 
          height: 400px;
          width: 290px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          padding: 10px;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
          position: relative;
        }
        .template-card-premium:hover { 
          transform: translateY(-6px); 
          box-shadow: 0 20px 40px -12px rgba(37, 99, 235, 0.15);
          border-color: rgba(37, 99, 235, 0.2);
        }

        .template-visual-container {
          background: #f8fafc;
          height: 310px;
          border-radius: 12px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          cursor: pointer;
        }

        .status-badges { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 4px; z-index: 20; }
        .badge-pill { padding: 6px 14px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
        .badge-pill.recommended { background: #dbeafe; color: #1e40af; border: none; }

        .template-hover-plus {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: 0.3s ease;
          z-index: 30;
        }
        .template-visual-container:hover .template-hover-plus { opacity: 1; }

        .plus-circle {
          width: 50px;
          height: 50px;
          background: white;
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transform: scale(0.8);
          transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .template-visual-container:hover .plus-circle { transform: scale(1); }

        .mini-tmpl-scale { 
          width: 794px; 
          min-height: 1123px; 
          background: white; 
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          transform: scale(0.36);
          transform-origin: top center;
        }

        .preview-scaler {
          width: 794px; 
          flex-shrink: 0;
          display: flex;
          justify-content: center;
        }

        .template-info-area { padding: 20px 0 8px; }

        .btn-choose-gradient {
          width: 100%;
          height: 40px;
          background: #2563eb;
          color: white;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }
        .btn-choose-gradient:hover { background: #1d4ed8; transform: translateY(-2px); }

        /* Filter Bar Premium */
        .filter-bar-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border);
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .filter-group { display: flex; align-items: center; gap: 12px; }
        .filter-label { font-size: 0.8rem; font-weight: 700; color: #1e293b; white-space: nowrap; }
        
        .filter-select {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: #f8fafc;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          outline: none;
          cursor: pointer;
          transition: 0.2s;
          min-width: 130px;
        }
        .filter-select:focus { border-color: var(--primary); background: white; }

        .color-picker-group { display: flex; align-items: center; gap: 16px; }
        .color-swatches { display: flex; gap: 8px; }
        .swatch { 
          width: 22px; 
          height: 22px; 
          border-radius: 50%; 
          cursor: pointer; 
          transition: 0.2s; 
          border: 2px solid white;
          box-shadow: 0 0 0 1px #e2e8f0;
        }
        .swatch:hover { transform: scale(1.2); box-shadow: 0 0 0 1px var(--primary); }

        .gallery-meta { margin-bottom: 24px; font-size: 0.85rem; font-weight: 700; color: #64748b; }

        /* Floating Color Picker Inside Preview */
        .preview-color-overlay {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 8px;
          border-radius: 100px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 30;
          transition: var(--transition);
        }

        .template-large-card:hover .preview-color-overlay { transform: scale(1.05); }

        .swatch-mini {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 0 1px #e2e8f0;
          transition: 0.2s;
        }
        .swatch-mini:hover { transform: scale(1.3); }
        .swatch-mini.active { box-shadow: 0 0 0 2px var(--primary); transform: scale(1.2); }
        .swatch-mini.active { box-shadow: 0 0 0 2px var(--primary); transform: scale(1.2); }

        /* --- DASHBOARD RESPONSIVE REFINEMENTS --- */

        .menu-toggle-btn {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }
        .menu-toggle-btn .bar { width: 18px; height: 2px; background: #1e293b; border-radius: 2px; }

        .mobile-sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
          z-index: 999;
        }

        .header-left { display: flex; align-items: center; gap: 12px; flex: 1; }
        .desktop-only { display: inline; }

        @media (max-width: 1024px) {
          .sidebar { 
            position: fixed;
            left: -260px;
            top: 0;
            bottom: 0;
            z-index: 1000;
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .sidebar.open { left: 0; }
          .menu-toggle-btn { display: flex; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .template-grid-modern { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
        }

        @media (max-width: 768px) {
          .dashboard-main { padding: 20px; }
          .main-header { padding: 16px 20px; }
          .hero-section h1 { font-size: 1.5rem; }
          .hero-section p { font-size: 0.9rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .desktop-only { display: none; }
          .search-box { display: none; }
          .template-visual-container { height: 260px; }
          .mini-tmpl-scale { transform: scale(0.3); }
        }

        @media (max-width: 480px) {
          .template-grid-modern { grid-template-columns: 1fr; }
          .hero-section { padding: 24px 20px; }
          .dashboard-content { padding-top: 10px; }
        }
      `}</style>

    </div>
  );
}
