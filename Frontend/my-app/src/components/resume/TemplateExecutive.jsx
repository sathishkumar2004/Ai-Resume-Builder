import React from 'react';

export default function TemplateExecutive({ resume, primaryColor = '#1e293b' }) {
  const getSection = (id) => resume.sections?.find(s => s.id === id);
  const SECTION_ORDER = ['summary', 'experience', 'education', 'skills', 'certifications'];

  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif", 
      color: '#1a1a1a', 
      width: '100%', 
      lineHeight: '1.4',
      padding: '50px',
      backgroundColor: '#fff'
    }}>
      {/* Name and Title */}
      <div style={{ borderBottom: `3px solid ${primaryColor}`, paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#000', margin: '0 0 4px 0', letterSpacing: '-1px' }}>
          {resume.name}
        </h1>
        <p style={{ fontSize: '16px', fontWeight: '700', color: primaryColor, margin: '0' }}>
          {resume.role}
        </p>
      </div>

      {/* Contact Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        gap: '20px', 
        fontSize: '11px', 
        color: '#444', 
        marginBottom: '24px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {resume.email && <span>{resume.email}</span>}
        {resume.phone && <span>{resume.phone}</span>}
        {resume.location && <span>{resume.location}</span>}
        {resume.primaryLanguage && <span>{resume.primaryLanguage} (Native)</span>}
        {resume.secondaryLanguage && <span>{resume.secondaryLanguage}</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {SECTION_ORDER.map(id => {
          const section = getSection(id);
          if (!section || !section.isEnabled || !section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;

          return (
            <div key={id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '30px' }}>
              <h2 style={{ 
                fontSize: '11px', 
                fontWeight: '900', 
                color: primaryColor, 
                textTransform: 'uppercase', 
                letterSpacing: '2px',
                margin: '0',
                paddingTop: '2px'
              }}>
                {id === 'summary' ? 'Profile' : id.toUpperCase()}
              </h2>

              <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '30px' }}>
                {section.type === 'text' && (
                  <p style={{ fontSize: '11.5px', color: '#333', margin: '0', lineHeight: '1.6' }}>
                    {section.content}
                  </p>
                )}

                {id === 'skills' && (
                  <div style={{ fontSize: '11.5px', color: '#333', lineHeight: '1.6', display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                    {(typeof section.content === 'string' ? section.content.split(/[,\n]/) : []).map((item, i, arr) => {
                      const trimmed = item.trim().replace(/^[•\-\*]\s*/, '');
                      if (!trimmed) return null;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: '600' }}>{trimmed}</span>
                          {i < arr.length - 1 && <span style={{ color: primaryColor, opacity: 0.5 }}>|</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {section.type === 'array' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '800', fontSize: '13px', color: '#000' }}>
                            {item.position || item.title || item.degree || item.name}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#666' }}>
                            {item.start || item.year || item.date} 
                            {(item.start || item.year || item.date) && (item.end || item.isCurrent) ? ' — ' : ''}
                            {item.isCurrent ? 'PRESENT' : (item.end || '')}
                          </span>
                        </div>
                        {(item.company || item.institution || item.issuer) && (
                          <div style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, marginBottom: '8px' }}>
                            {item.company || item.institution || item.issuer}
                          </div>
                        )}
                        
                        {item.description && (
                          <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.5' }}>
                            {item.description.split('\n').filter(l => l.trim()).map((bullet, bi) => (
                              <div key={bi} style={{ marginBottom: '4px', display: 'flex', gap: '8px' }}>
                                <span>•</span>
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
            </div>
          );
        })}
      </div>
      
      {/* Footer / Extra */}
      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0', fontWeight: '600', letterSpacing: '0.5px' }}>Generated by EliteCV Resume Architect</p>
      </footer>
    </div>
  );
}
