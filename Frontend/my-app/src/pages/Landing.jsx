import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, BarChart3, 
  FileText, CheckCircle2, Globe, Rocket, ChevronRight,
  MousePointer2, Layout, Layers, Heart
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="elite-landing-root">
      {/* Dynamic Background */}
      <div className="bg-grid-overlay" />
      <div className="bg-gradient-top" />

      {/* Navigation */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="brand" onClick={() => navigate("/")}>
            <div className="brand-icon"><Rocket size={20} /></div>
            <span>EliteCV</span>
          </div>
          
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#about">About</a>
          </div>

          <div className="nav-auth">
            <button onClick={() => navigate("/login")} className="btn-ghost">Sign In</button>
            <button onClick={() => navigate("/register")} className="btn-primary-premium">
              Create My Resume <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-text-content"
          >
            <div className="hero-badge">
              <Sparkles size={14} className="text-blue-500" />
              <span>Next-Gen Career Intelligence</span>
            </div>
            <h1>The smarter way to <br/> <span>get hired.</span></h1>
            <p className="hero-subtitle">
              EliteCV combines recruiter insights with precision design to build resumes that pass ATS filters and command attention. 
              Join 50,000+ professionals winning interviews at top companies.
            </p>
            
            <div className="hero-actions">
              <button onClick={() => navigate("/register")} className="btn-hero-main">
                Get Started for Free <ChevronRight size={18} />
              </button>
              <div className="hero-stats">
                <div className="stat"><strong>98%</strong> ATS Score</div>
                <div className="stat"><strong>15s</strong> Creation Time</div>
              </div>
            </div>
          </motion.div>

          {/* High-Fidelity Hero Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="hero-visual-wrapper"
          >
            <div className="builder-mockup-canvas">
              <div className="mockup-sidebar">
                <div className="mockup-item active" />
                <div className="mockup-item" />
                <div className="mockup-item" />
              </div>
              <div className="mockup-content">
                <div className="mockup-a4">
                  <div className="mockup-header" />
                  <div className="mockup-line" />
                  <div className="mockup-line" />
                  <div className="mockup-line mid" />
                  <div className="mockup-section" />
                  <div className="mockup-line" />
                  <div className="mockup-line" />
                </div>
                {/* Floating Micro-UI */}
                <div className="floating-ui f-1">
                  <CheckCircle2 size={16} /> <span>ATS Optimized</span>
                </div>
                <div className="floating-ui f-2">
                  <Sparkles size={16} /> <span>AI Rewrite</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-logos">
        <p>Trusted by candidates at industry leaders</p>
        <div className="logo-grid">
           <span>GOOGLE</span>
           <span>AMAZON</span>
           <span>META</span>
           <span>STRIPE</span>
           <span>AIRBNB</span>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="features-premium">
        <div className="section-header">
           <h2 className="section-title">Engineered for Success</h2>
           <p>Everything you need to stand out in a competitive job market.</p>
        </div>
        
        <div className="features-grid-u">
          {[
            { icon: Zap, title: "Lightning Fast Editor", desc: "Our real-time split-pane builder eliminates the friction of traditional forms." },
            { icon: ShieldCheck, title: "Recruiter-Approved", desc: "Each template is audited by HR professionals to ensure perfect readability." },
            { icon: BarChart3, title: "Live ATS Scoring", desc: "Get real-time feedback on your document's performance against job filters." }
          ].map((feature, i) => (
            <div key={i} className="feature-card-premium">
              <div className="f-icon"><feature.icon size={24} /></div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer-premium">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">Elite<span>CV</span></div>
            <p>Elevating professional identities worldwide.</p>
          </div>
          <div className="footer-copy">
            © 2024 EliteCV Inc. All rights reserved. Built with precision.
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        :root {
          --brand: #2563eb;
          --brand-dark: #1e40af;
          --bg-light: #ffffff;
          --bg-soft: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --glass: rgba(255, 255, 255, 0.8);
          --border-soft: rgba(226, 232, 240, 0.8);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Outfit', sans-serif;
          background: var(--bg-light);
          color: var(--text-main);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .elite-landing-root { position: relative; min-height: 100vh; }

        .bg-grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -1;
        }

        .bg-gradient-top {
          position: fixed;
          top: -20%;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
          z-index: -1;
        }

        /* Nav */
        .glass-nav {
          position: sticky;
          top: 0;
          height: 80px;
          background: var(--glass);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-soft);
          z-index: 1000;
          display: flex;
          align-items: center;
        }
        .nav-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand { display: flex; align-items: center; gap: 12px; cursor: pointer; font-weight: 800; font-size: 1.4rem; color: var(--text-main); }
        .brand-icon { background: var(--brand); color: white; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
        
        .nav-links { display: flex; gap: 40px; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-weight: 500; font-size: 0.95rem; transition: 0.2s; }
        .nav-links a:hover { color: var(--brand); }

        .nav-auth { display: flex; gap: 16px; }
        .btn-ghost { background: transparent; border: none; color: var(--text-main); font-weight: 600; font-size: 0.95rem; cursor: pointer; padding: 10px 20px; transition: 0.2s; border-radius: 10px; }
        .btn-ghost:hover { background: var(--bg-soft); }
        
        .btn-primary-premium {
          background: var(--text-main);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .btn-primary-premium:hover { background: var(--brand); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }

        /* Hero */
        .hero-premium { padding: 100px 0; perspective: 1000px; }
        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 80px;
        }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; color: var(--brand); padding: 8px 16px; border-radius: 100px; font-size: 0.85rem; font-weight: 700; margin-bottom: 24px; border: 1px solid rgba(37, 99, 235, 0.1); }
        .hero-text-content h1 { font-size: 4.5rem; font-weight: 800; color: var(--text-main); line-height: 1.1; letter-spacing: -2px; margin-bottom: 24px; }
        .hero-text-content h1 span { color: var(--brand); }
        .hero-subtitle { font-size: 1.25rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 40px; max-width: 540px; }
        
        .hero-actions { display: flex; align-items: center; gap: 32px; }
        .btn-hero-main { background: var(--brand); color: white; border: none; padding: 20px 40px; border-radius: 18px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.4); }
        .btn-hero-main:hover { background: var(--brand-dark); transform: scale(1.02) translateY(-4px); }
        
        .hero-stats { display: flex; gap: 24px; }
        .stat { font-size: 0.85rem; color: var(--text-muted); }
        .stat strong { color: var(--text-main); display: block; font-size: 1.1rem; }

        /* Visual Wrapper */
        .hero-visual-wrapper { position: relative; }
        .builder-mockup-canvas {
          background: white;
          border-radius: 24px;
          border: 1px solid var(--border-soft);
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.1), 0 30px 60px -30px rgba(0,0,0,0.1);
          height: 500px;
          display: flex;
          overflow: hidden;
        }
        .mockup-sidebar { width: 60px; background: #f1f5f9; padding: 20px 10px; display: flex; flex-direction: column; gap: 12px; border-right: 1px solid #e2e8f0; }
        .mockup-item { height: 10px; background: #cbd5e1; border-radius: 4px; }
        .mockup-item.active { background: var(--brand); }
        
        .mockup-content { flex: 1; background: #f8fafc; padding: 40px; position: relative; display: flex; justify-content: center; }
        .mockup-a4 { background: white; width: 220px; height: 300px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 24px; display: flex; flex-direction: column; gap: 8px; }
        .mockup-header { height: 30px; background: #f1f5f9; border-radius: 4px; margin-bottom: 8px; }
        .mockup-line { height: 6px; background: #f1f5f9; border-radius: 4px; width: 100%; }
        .mockup-line.mid { width: 60%; }
        .mockup-section { height: 12px; background: #eff6ff; border-radius: 4px; margin-top: 12px; }
        
        .floating-ui { position: absolute; background: white; padding: 12px 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px; font-size: 0.75rem; font-weight: 800; border: 1px solid #f1f5f9; z-index: 10; }
        .f-1 { top: 60px; right: 20px; color: #10b981; }
        .f-2 { bottom: 60px; left: 20px; color: var(--brand); }

        /* Feature Grid */
        .features-premium { padding: 120px 0; background: var(--bg-soft); }
        .section-header { text-align: center; margin-bottom: 80px; }
        .section-title { font-size: 3rem; font-weight: 800; color: var(--text-main); margin-bottom: 16px; }
        .section-header p { font-size: 1.1rem; color: var(--text-muted); }
        
        .features-grid-u { max-width: 1280px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .feature-card-premium { background: white; padding: 48px; border-radius: 32px; border: 1px solid var(--border-soft); transition: 0.3s; }
        .feature-card-premium:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); border-color: var(--brand); }
        .f-icon { width: 56px; height: 56px; background: #eff6ff; color: var(--brand); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .feature-card-premium h3 { font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin-bottom: 16px; }
        .feature-card-premium p { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; }

        /* Trust Logos */
        .trust-logos { text-align: center; padding: 60px 0; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); }
        .trust-logos p { font-size: 0.85rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 40px; }
        .logo-grid { display: flex; justify-content: center; gap: 80px; filter: grayscale(1) opacity(0.3); }
        .logo-grid span { font-weight: 900; font-size: 1.2rem; letter-spacing: 1px; }

        .footer-premium { padding: 80px 0; border-top: 1px solid var(--border-soft); }
        .footer-container { max-width: 1280px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
        .footer-brand .logo { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
        .footer-brand .logo span { color: var(--brand); }
        .footer-brand p { color: var(--text-muted); font-size: 0.9rem; }
        .footer-copy { color: #94a3b8; font-size: 0.85rem; font-weight: 500; }

        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; text-align: center; gap: 60px; }
          .hero-text-content h1 { font-size: 3.5rem; }
          .hero-subtitle { margin: 0 auto 40px; }
          .hero-actions { flex-direction: column; gap: 24px; }
          .features-grid-u { grid-template-columns: 1fr; }
          .logo-grid { gap: 40px; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
