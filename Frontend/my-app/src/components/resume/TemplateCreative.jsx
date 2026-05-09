import React from 'react';

export default function TemplateCreative({ resume, primaryColor = '#10b981' }) {
  const getSection = (id) => resume.sections?.find(s => s.id === id);
  const SECTION_ORDER = ['summary', 'experience', 'projects', 'education', 'skills'];

  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif", 
      color: '#1e293b', 
      width: '100%', 
      minHeight: '29cm',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: '1.4',
      backgroundColor: '#fff',
      boxSizing: 'border-box'
    }}>
      {/* Bold Header */}
      <div style={{ 
        backgroundColor: primaryColor, 
        padding: '50px', 
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0', letterSpacing: '-2px', lineHeight: '1' }}>
          {resume.name}
        </h1>
        <p style={{ fontSize: '18px', fontWeight: '700', opacity: '0.9', margin: '0' }}>
          {resume.role}
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          fontSize: '12px', 
          fontWeight: '600',
          marginTop: '10px'
        }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.primaryLanguage && <span>{resume.primaryLanguage} (Native)</span>}
          {resume.secondaryLanguage && <span>{resume.secondaryLanguage}</span>}
        </div>
      </div>

      <div style={{ padding: '40px 50px', display: 'grid', gridTemplateColumns: '1fr 250px', gap: '40px' }}>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {['summary', 'experience', 'projects'].map(id => {
            const section = getSection(id);
            if (!section || !section.isEnabled || !section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;

            return (
              <div key={id}>
                <h2 style={{ 
                  fontSize: '14px', 
                  fontWeight: '900', 
                  color: primaryColor, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `3px solid ${primaryColor}` }} />
                  {id === 'summary' ? 'Overview' : id.toUpperCase()}
                </h2>

                {section.type === 'text' && (
                  <p style={{ fontSize: '11.5px', color: '#334155', margin: '0', lineHeight: '1.6' }}>
                    {section.content}
                  </p>
                )}

                {section.type === 'array' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
                            {item.position || item.title}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: primaryColor }}>
                            {item.start || item.year} — {item.end || 'PRESENT'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>
                          {item.company || item.institution}
                        </div>
                        
                        {item.description && (
                          <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.5' }}>
                            {item.description.split('\n').filter(l => l.trim()).map((bullet, bi) => (
                              <div key={bi} style={{ marginBottom: '4px', display: 'flex', gap: '10px' }}>
                                <span style={{ color: primaryColor }}>▸</span>
                                <span>{bullet.replace(/^[•\-\*]\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {['education', 'certifications', 'skills'].map(id => {
            const section = getSection(id);
            if (!section || !section.isEnabled || !section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;

            return (
              <div key={id}>
                <h2 style={{ 
                  fontSize: '14px', 
                  fontWeight: '900', 
                  color: primaryColor, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  marginBottom: '15px'
                }}>
                  {id.toUpperCase()}
                </h2>

                {id === 'skills' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(typeof section.content === 'string' ? section.content.split(/[,\n]/) : []).map((skill, i) => {
                      const trimmed = skill.trim().replace(/^[•\-\*]\s*/, '');
                      if (!trimmed) return null;
                      return (
                        <span key={i} style={{ 
                          fontSize: '10.5px', 
                          background: '#f8fafc', 
                          color: primaryColor, 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontWeight: '700'
                        }}>
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                )}

                {section.type === 'array' && (id === 'education' || id === 'certifications') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <div style={{ fontWeight: '800', fontSize: '12px', color: '#0f172a' }}>{item.degree || item.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{item.institution || item.issuer}</div>
                        <div style={{ fontSize: '11px', color: primaryColor, fontWeight: '700' }}>{item.year || item.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer / Extra - Pushed to bottom with Flex */}
      <footer style={{ 
        marginTop: 'auto',
        textAlign: 'center',
        paddingBottom: '20px'
      }}>
        <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0', fontWeight: '600' }}>Generated by EliteCV Resume Architect</p>
      </footer>
    </div>
  );
}
