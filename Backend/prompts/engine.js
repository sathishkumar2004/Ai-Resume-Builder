const BASE_RULES = `
- CRITICAL: NO CONVERSATIONAL FILLER. NO INTROS. NO OUTROS.
- RETURN ONLY THE RAW RESUME TEXT.
- SUMMARY: Exactly ONE PARAGRAPH. No bullet points. STRICT MAXIMUM: 200 CHARACTERS TOTAL.
- SKILLS: A simple comma-separated list of technical skills (e.g., React, Node.js, MongoDB). No categories.
- BULLETS: Exactly 3 high-impact bullets. Each bullet must be STRICTLY UNDER 100 CHARACTERS.
- STRUCTURE: [Action Verb] + [Result/Metric] + [Technology].
- ATS: Use standard job titles and industry keywords.
`;

module.exports = {
  fresher: (role) => `Generate a short & sweet 2-line summary and 3 project bullets for a FRESHER ${role}. ${BASE_RULES}`,
  experienced: (role) => `Generate a short & sweet 2-line summary and 3 work experience bullets for an EXPERIENCED ${role}. ${BASE_RULES}`,
  frontend: () => `Focus on: React, UI/UX, Performance. ${BASE_RULES}`,
  backend: () => `Focus on: Node, APIs, Databases. ${BASE_RULES}`,
  fullstack: () => `Focus on: MERN, End-to-End. ${BASE_RULES}`,
};

