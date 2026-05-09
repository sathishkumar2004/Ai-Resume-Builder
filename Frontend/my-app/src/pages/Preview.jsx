import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, Share2, ZoomIn, ZoomOut, RotateCcw, Loader2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import useResumeStore from "../store/resumeStore";
import TemplateModern from "../components/resume/TemplateModern";
import TemplateExecutive from "../components/resume/TemplateExecutive";
import TemplateMinimal from "../components/resume/TemplateMinimal";
import TemplateCreative from "../components/resume/TemplateCreative";

export default function Preview() {
  const { resume } = useResumeStore();
  const [zoom, setZoom] = React.useState(0.85);
  const [hasManuallyZoomed, setHasManuallyZoomed] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const navigate = useNavigate();

  const fitZoom = React.useCallback(() => {
    const A4_WIDTH = 794;
    const availableWidth = window.innerWidth < 768 ? window.innerWidth * 0.92 : window.innerWidth * 0.45;
    const calculatedZoom = availableWidth / A4_WIDTH;
    setZoom(Math.max(0.2, Math.min(1.5, calculatedZoom)));
  }, []);

  // Auto-fit on mount or resize
  React.useEffect(() => {
    if (!hasManuallyZoomed) {
      fitZoom();
    }
    window.addEventListener('resize', () => {
      if (!hasManuallyZoomed) fitZoom();
    });
    return () => window.removeEventListener('resize', fitZoom);
  }, [hasManuallyZoomed, fitZoom]);

  const renderSelectedTemplate = () => {
    const props = { resume, primaryColor: "#2563eb" };
    switch (resume.template) {
      case "modern": return <TemplateModern {...props} />;
      case "executive": return <TemplateExecutive {...props} />;
      case "minimal": return <TemplateMinimal {...props} />;
      case "creative": return <TemplateCreative {...props} />;
      default: return <TemplateModern {...props} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const originalElement = document.querySelector(".resume-canvas-u");
    if (!originalElement) return;
    
    setIsDownloading(true);
    
    // Create a temporary container to render the resume at 1:1 scale for the PDF
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    document.body.appendChild(tempContainer);

    const clone = originalElement.cloneNode(true);
    // Reset any transforms or absolute positioning that might interfere with html2pdf
    clone.style.transform = "none";
    clone.style.position = "relative";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.margin = "0";
    clone.style.width = "794px";
    clone.style.height = "1122px"; // Exactly A4 height to prevent spillover
    clone.style.overflow = "hidden";
    
    tempContainer.appendChild(clone);

    const options = {
      margin: 0,
      filename: `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: 'avoid-all' }
    };

    try {
      await html2pdf().set(options).from(clone).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      document.body.removeChild(tempContainer);
      setIsDownloading(false);
    }
  };

  return (
    <div className="preview-page-container">
      {/* Sticky Top Bar */}
      <nav className="preview-nav-u no-print">
        <div className="nav-left">
          <button className="back-btn-u" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> <span className="hide-mobile">Back to Editor</span>
          </button>
        </div>
        <div className="nav-center">
          <div className="zoom-bar-u">
            <button className="zoom-btn-u" onClick={() => { setZoom(z => Math.max(0.3, z - 0.1)); setHasManuallyZoomed(true); }}><ZoomOut size={16} /></button>
            <input 
              type="range" 
              min="0.3" 
              max="1.5" 
              step="0.05" 
              value={zoom} 
              onChange={(e) => { setZoom(parseFloat(e.target.value)); setHasManuallyZoomed(true); }}
              className="zoom-slider-u"
            />
            <span className="zoom-value-u">{Math.round(zoom * 100)}%</span>
            <button className="zoom-btn-u" onClick={() => { setZoom(z => Math.min(1.5, z + 0.1)); setHasManuallyZoomed(true); }}><ZoomIn size={16} /></button>
            <div className="v-divider" />
            <button className="zoom-btn-u reset" title="Auto-Fit" onClick={() => { setHasManuallyZoomed(false); fitZoom(); }}><RotateCcw size={14} /></button>
          </div>
        </div>
        <div className="nav-right">
          <button className="nav-btn-u secondary" onClick={handlePrint}>
            <Printer size={18} /> <span className="hide-mobile">Print</span>
          </button>
          <button 
            className="nav-btn-u primary" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 size={18} className="spin" /> : <Download size={18} />}
            <span className="hide-mobile">{isDownloading ? "Generating..." : "Download PDF"}</span>
          </button>
        </div>
      </nav>

      {/* Preview Stage */}
      <main className="preview-stage-u">
        <div 
          className="resume-wrapper-u" 
          style={{ 
            width: `${794 * zoom}px`, 
            height: `${1123 * zoom}px`
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: zoom }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="resume-canvas-u"
            style={{ 
              transformOrigin: 'top left' 
            }}
          >
            {renderSelectedTemplate()}
          </motion.div>
        </div>
      </main>

      <style>{`
        .preview-page-container {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          flex-direction: column;
        }

        .preview-nav-u {
          position: sticky;
          top: 0;
          height: 64px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .back-btn-u {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .back-btn-u:hover { color: #1e293b; transform: translateX(-4px); }

        .preview-badge-u {
          background: #eff6ff;
          color: #2563eb;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-right { display: flex; gap: 12px; }
        .nav-btn-u {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .nav-btn-u.secondary { background: white; border: 1px solid #e2e8f0; color: #475569; }
        .nav-btn-u.secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
        .nav-btn-u.primary { background: #2563eb; border: none; color: white; }
        .nav-btn-u.primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }

        .preview-stage-u {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          overflow: auto;
          background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          min-height: 0;
          min-width: 0;
        }

        .resume-wrapper-u {
          position: relative;
          flex-shrink: 0;
          margin: 0 auto 80px auto;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15);
          background: white;
          transform: translateZ(0); /* Hardware acceleration */
        }

        .resume-canvas-u {
          background: white;
          width: 794px;
          min-width: 794px;
          height: 1123px;
          min-height: 1123px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Zoom Bar */
        .zoom-bar-u { display: flex; align-items: center; gap: 8px; background: #f1f5f9; padding: 4px 12px; border-radius: 100px; border: 1px solid #e2e8f0; }
        .zoom-btn-u { background: none; border: none; color: #64748b; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .zoom-btn-u:hover { background: white; color: #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .zoom-btn-u.reset { color: #94a3b8; }
        .zoom-value-u { font-size: 0.7rem; font-weight: 800; color: #1e293b; width: 38px; text-align: center; font-variant-numeric: tabular-nums; }
        .v-divider { width: 1px; height: 16px; background: #cbd5e1; margin: 0 4px; }
        
        .zoom-slider-u {
          width: 80px;
          height: 4px;
          -webkit-appearance: none;
          background: #cbd5e1;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        .zoom-slider-u::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .preview-nav-u { padding: 0 12px; height: 60px; gap: 8px; }
          .hide-mobile { display: none; }
          .nav-btn-u { padding: 8px; min-width: 40px; border-radius: 10px; }
          .back-btn-u { width: 40px; height: 40px; justify-content: center; background: #f8fafc; border-radius: 10px; }
          .zoom-bar-u { gap: 2px; padding: 2px 8px; }
          .zoom-slider-u { display: none; }
          .zoom-value-u { width: 32px; font-size: 0.65rem; }
          .preview-stage-u { padding: 30px 10px; }
          .resume-wrapper-u { box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin: 0 auto 40px; }
        }

        @media (max-width: 480px) {
          .preview-nav-u { gap: 4px; }
          .nav-center { flex: 1; display: flex; justify-content: center; }
          .zoom-bar-u { transform: scale(0.85); margin: 0 auto; }
        }

        @media print {
          .no-print { display: none !important; }
          .preview-stage-u { padding: 0 !important; background: none !important; }
          .resume-canvas-u { box-shadow: none !important; width: 100% !important; margin: 0 !important; }
          .preview-page-container { background: white !important; }
        }
      `}</style>
    </div>
  );
}
