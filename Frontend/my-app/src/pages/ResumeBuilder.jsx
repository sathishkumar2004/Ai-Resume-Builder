import React from "react";
import { useNavigate } from "react-router-dom";
import UnifiedBuilder from "../components/dashboard/UnifiedBuilder";

export default function ResumeBuilder() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fullscreen-builder-page">
      <UnifiedBuilder onExit={handleExit} />
      
      <style>{`
        .fullscreen-builder-page {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: white;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
