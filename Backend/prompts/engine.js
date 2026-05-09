const BASE_RULES = `
Create a premium ATS-friendly single-page resume with strict content length optimization for A4 desktop layout and responsive mobile preview.

IMPORTANT RULES:
* Keep all content concise, modern, readable, and professional.
* Resume must always fit within a clean single-page A4 layout.
* Avoid long paragraphs, excessive buzzwords, and overly verbose AI-generated text.
* Focus on measurable impact, technologies used, and readability.
* Use compact, premium-quality formatting suitable for modern resume templates.

SECTION CHARACTER LIMITS:
1. Full Name: 3-40 characters
2. Job Title / Headline: 5-45 characters
3. Professional Summary / Profile: 120-320 characters (Max 3 concise sentences, one paragraph)
4. Experience Section (Per Job): Company Name max 40 chars, Role Title max 45 chars, Duration max 25 chars. Bullet Rules: Min 2, Max 4 bullets. Each bullet 40-120 characters. Avoid long enterprise-style wording.
5. Projects Section: Title 5-35 chars, Description 60-180 chars. Max 2 bullets per project.
6. Skills Section: 6-18 skills. Each skill max 20 characters. Prefer short tech stack names.
7. Education: Degree max 50 chars, College Name max 60 chars. Optional desc max 120 chars.
8. Certifications: Certification Name max 70 chars.
9. Languages: Max 4 languages.
10. Contact Links: Portfolio URL max 40 chars, LinkedIn URL max 50 chars.

GLOBAL RESUME RULES:
* Total resume content should stay between 1800-3500 characters. Absolute maximum 4500 characters.
* Prevent unnecessary line wrapping. Ensure no overflow in A4 preview.
* Keep generated content compact while preserving professionalism and ATS optimization.

AI CONTENT STYLE: Professional, Minimal, Modern, ATS-friendly, Human-like, Quantified achievements, Avoid repetitive wording, Avoid generic filler text.

OUTPUT REQUIREMENT:
Generate only clean, production-ready resume content without any conversational filler, intros, or outros.
`;

module.exports = {
  fresher: (role) => `Generate a structured resume for a FRESHER ${role}. ${BASE_RULES}`,
  experienced: (role) => `Generate a structured resume for an EXPERIENCED ${role}. ${BASE_RULES}`,
  frontend: () => `Focus on: React, UI/UX, Performance.`,
  backend: () => `Focus on: Node, APIs, Databases.`,
  fullstack: () => `Focus on: MERN, End-to-End.`,
  baseRules: BASE_RULES
};

