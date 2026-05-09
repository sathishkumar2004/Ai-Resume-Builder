import React from 'react';

export default function TemplateMinimal({ resume, primaryColor = '#1e293b' }) {
  const getSection = (id) => resume.sections?.find(s => s.id === id);
  const SECTION_ORDER = ['summary', 'experience', 'education', 'certifications', 'skills'];

  return (
    <div style={{ 
      fontFamily: "'Times New Roman', serif", 
      color: '#000', 
      width: '100%', 
      lineHeight: '1.4',
      padding: '50px',
      backgroundColor: '#fff'
    }}>
      {/* Name and Contact */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '400', margin: '0 0 8px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {resume.name}
        </h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          fontSize: '11px', 
          color: '#333',
          fontFamily: 'serif',
          fontStyle: 'italic'
        }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.primaryLanguage && <span>{resume.primaryLanguage} (Native)</span>}
          {resume.secondaryLanguage && <span>{resume.secondaryLanguage}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {SECTION_ORDER.map(id => {
          const section = getSection(id);
          if (!section || !section.isEnabled || !section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;

          return (
            <div key={id}>
              <h2 style={{ 
                fontSize: '11px', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                borderBottom: '1px solid #eee', 
                paddingBottom: '4px',
                marginBottom: '10px'
              }}>
                {id === 'summary' ? 'Profile' : id.toUpperCase()}
              </h2>

              <div style={{ paddingLeft: '4px' }}>
                {section.type === 'text' && (
                  <p style={{ fontSize: '11.5px', color: '#1a1a1a', margin: '0', textAlign: 'justify' }}>
                    {section.content}
                  </p>
                )}

                {id === 'skills' && (
                  <div style={{ fontSize: '11.5px', color: '#1a1a1a', margin: '0', lineHeight: '1.6', display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                    {(typeof section.content === 'string' ? section.content.split(/[,\n]/) : []).map((item, i, arr) => {
                      const trimmed = item.trim().replace(/^[•\-\*]\s*/, '');
                      if (!trimmed) return null;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{trimmed}</span>
                          {i < arr.length - 1 && <span>•</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {section.type === 'array' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontWeight: '700', fontSize: '12px' }}>
                            {item.company || item.institution || item.issuer}
                          </span>
                          <span style={{ fontSize: '11px', fontStyle: 'italic' }}>
                            {item.start || item.year || item.date} 
                            {(item.start || item.year || item.date) && (item.end || item.isCurrent) ? ' — ' : ''}
                            {item.isCurrent ? 'Present' : (item.end || '')}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', marginBottom: '6px', fontWeight: '500' }}>
                          {item.position || item.title || item.degree || item.name}
                        </div>
                        
                        {item.description && (
                          <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.5' }}>
                            {item.description.split('\n').filter(l => l.trim()).map((bullet, bi) => (
                              <div key={bi} style={{ marginBottom: '2px' }}>
                                — {bullet.replace(/^[•\-\*]\s*/, '')}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer / Extra */}
      <footer style={{ marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #eee', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#888', margin: '0', fontStyle: 'italic' }}>Generated by EliteCV Resume Architect</p>
      </footer>
    </div>
  );
}
