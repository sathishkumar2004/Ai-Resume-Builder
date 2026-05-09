import React from 'react';

export default function TemplateModern({ resume, primaryColor = '#2563eb' }) {
  const getSection = (id) => resume.sections?.find(s => s.id === id);
  const SECTION_ORDER = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'];
  
  const SECTION_TITLES = { 
    summary: 'Professional Summary', 
    skills: 'Skills & Expertise', 
    experience: 'Professional Experience', 
    projects: 'Technical Projects', 
    education: 'Education', 
    certifications: 'Certifications',
    languages: 'Languages'
  };

  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif", 
      color: '#1e293b', 
      width: '100%', 
      lineHeight: '1.5',
      padding: '40px',
      backgroundColor: '#fff'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '800', 
          color: '#0f172a', 
          textTransform: 'uppercase', 
          letterSpacing: '-1px', 
          margin: '0 0 4px 0' 
        }}>
          {resume.name}
        </h1>
        <p style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: primaryColor, 
          margin: '0 0 12px 0',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {resume.role}
        </p>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '12px', 
          fontSize: '11px', 
          color: '#64748b',
          fontWeight: '500'
        }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>• {resume.phone}</span>}
          {resume.location && <span>• {resume.location}</span>}
          {resume.portfolio && <span>• {resume.portfolio.replace(/^https?:\/\//,'')}</span>}
          {resume.linkedin && <span>• {resume.linkedin.replace(/^https?:\/\//,'')}</span>}
        </div>
        
        {/* Languages in Header (Optional) */}
        {(resume.primaryLanguage || resume.secondaryLanguage) && (
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px', fontWeight: '600' }}>
            {resume.primaryLanguage && <span>{resume.primaryLanguage} (Native)</span>}
            {resume.primaryLanguage && resume.secondaryLanguage && <span> | </span>}
            {resume.secondaryLanguage && <span>{resume.secondaryLanguage}</span>}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {SECTION_ORDER.map(id => {
          const section = getSection(id);
          if (!section || !section.isEnabled || !section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;
          
          return (
            <section key={id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px' }}>
              <h2 style={{ 
                fontSize: '11px', 
                fontWeight: '900', 
                color: primaryColor, 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                margin: '0',
                paddingTop: '2px'
              }}>
                {SECTION_TITLES[id]}
              </h2>

              <div style={{ borderLeft: `1.5px solid #f1f5f9`, paddingLeft: '20px' }}>
                {/* Text Section (Summary) */}
                {section.type === 'text' && id !== 'skills' && id !== 'languages' && (
                  <p style={{ fontSize: '11px', color: '#334155', margin: '0', textAlign: 'justify', lineHeight: '1.6' }}>
                    {section.content}
                  </p>
                )}

                {/* Skills & Languages Section */}
                {(id === 'skills' || id === 'languages') && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', fontSize: '11px', color: '#334155', fontWeight: '600', lineHeight: '1.6' }}>
                    {(typeof section.content === 'string' ? section.content.split(/[,\n]/) : []).map((item, i, arr) => {
                      const trimmed = item.trim().replace(/^[•\-\*]\s*/, '');
                      if (!trimmed) return null;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>{trimmed}</span>
                          {i < arr.length - 1 && <span style={{ color: primaryColor, opacity: 0.6 }}>•</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Array Sections (Experience, Education, Projects, Certifications) */}
                {section.type === 'array' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: '800', fontSize: '12.5px', color: '#0f172a' }}>
                              {item.position || item.title || item.degree || item.name}
                            </span>
                            {(item.company || item.institution || item.issuer) && (
                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                                &nbsp; | &nbsp;{item.company || item.institution || item.issuer}
                                {item.location && <span style={{ fontStyle: 'italic', opacity: 0.8 }}>, {item.location}</span>}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginLeft: '10px', whiteSpace: 'nowrap' }}>
                            {item.start || item.year || item.date || ''} 
                            {(item.start || item.year || item.date) && (item.end || item.isCurrent) ? ' — ' : ''}
                            {item.isCurrent ? 'Present' : (item.end || '')}
                          </span>
                        </div>
                        
                        {item.description && (
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', listStyleType: 'square' }}>
                            {item.description.split('\n').filter(l => l.trim()).map((bullet, bi) => (
                              <li key={bi} style={{ fontSize: '10.5px', color: '#334155', marginBottom: '2px' }}>
                                {bullet.trim().replace(/^[•\-\*]\s*/, '')}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer / Extra */}
      <footer style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0' }}>Generated by EliteCV Resume Architect</p>
      </footer>
    </div>
  );
}
