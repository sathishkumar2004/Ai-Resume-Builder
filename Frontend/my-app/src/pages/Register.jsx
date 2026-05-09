import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, ArrowRight, Check, Rocket } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData.name, formData.email, formData.password);
    if (success) navigate("/login");
  };

  return (
    <div className="premium-auth-page">
      <div className="auth-bg-grid" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card-premium"
      >
        <div className="auth-header">
           <div className="auth-brand" onClick={() => navigate("/")}>
              <div className="brand-logo"><Rocket size={18} /></div>
              <span>EliteCV</span>
           </div>
           <h1>Create Account</h1>
           <p>Join the future of professional resume building</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error-msg">
              {error}
            </motion.div>
          )}

          <div className="auth-field">
            <label>Full Name</label>
            <div className="auth-input-wrap">
              <User size={16} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Johnathan Smith"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Professional Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@professional.com"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Security Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? "Creating Identity..." : "Create Professional Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .premium-auth-page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .auth-bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: 0;
        }

        .auth-card-premium {
          width: 100%;
          max-width: 440px;
          background: white;
          padding: 48px;
          border-radius: 32px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08);
          position: relative;
          z-index: 10;
        }

        .auth-header { text-align: center; margin-bottom: 40px; }
        .auth-brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 24px; cursor: pointer; }
        .brand-logo { background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .auth-brand span { font-weight: 800; font-size: 1.2rem; color: #0f172a; }
        
        .auth-header h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; letter-spacing: -1px; }
        .auth-header p { color: #64748b; font-size: 0.95rem; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .auth-field label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 8px; }
        
        .auth-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: 0.2s;
        }
        .auth-input-wrap:focus-within { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .auth-input-wrap svg { color: #94a3b8; }
        .auth-input-wrap input { flex: 1; background: transparent; border: none; outline: none; color: #0f172a; font-size: 0.95rem; }

        .btn-auth-submit {
          background: #0f172a;
          color: white;
          padding: 16px;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
          margin-top: 12px;
        }
        .btn-auth-submit:hover { background: #1e293b; transform: translateY(-2px); }

        .auth-error-msg { background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; text-align: center; }

        .auth-footer { margin-top: 32px; text-align: center; color: #64748b; font-size: 0.9rem; }
        .auth-footer a { color: #2563eb; font-weight: 700; text-decoration: none; margin-left: 4px; }
        .auth-footer a:hover { text-decoration: underline; }

        @media (max-width: 480px) {
          .premium-auth-page { padding: 16px; }
          .auth-card-premium { padding: 32px 24px; border-radius: 24px; }
          .auth-header h1 { font-size: 1.7rem; }
          .auth-input-wrap { padding: 12px 16px; }
          .btn-auth-submit { padding: 14px; font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}