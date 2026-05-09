const express = require("express");
const router = express.Router();
const prompts = require("../prompts/engine");

// Helper: call AI
async function callAI(prompt, systemRole = "You are a Senior HR Manager and Resume Expert.") {
  const key = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("No API key found.");

  const endpoint = key.startsWith("gsk_") ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
  const model = key.startsWith("gsk_") ? "llama-3.1-8b-instant" : "gpt-3.5-turbo";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemRole },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
    }),
  });
  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim();
}

// POST /api/ai/enhance
router.post("/enhance", async (req, res) => {
  try {
    const { field, value, context, mode } = req.body;
    let prompt = "";

    if (mode === "compact") {
      prompt = `Compact this text for a one-page resume without losing key impact: "${value}". Keep it under 15 words.`;
    } else {
      const basePrompt = context.level === "Fresher" ? prompts.fresher(context.role) : prompts.experienced(context.role);
      const roleFocus = context.role.toLowerCase().includes("frontend") ? prompts.frontend() : 
                        context.role.toLowerCase().includes("backend") ? prompts.backend() : prompts.fullstack();
      
      prompt = `
        ${basePrompt} 
        ${roleFocus} 
        
        ${prompts.baseRules}
        
        CRITICAL TASK: 
        1. Keep the output extremely concise to perfectly fit into a modern one-page resume template without overflowing.
        ${field === 'summary' ? '2. STRICT LENGTH LIMIT: 120-320 characters. Maximum 3 concise sentences. OUTPUT MUST BE A SINGLE PARAGRAPH.' : '2. STRICT LENGTH LIMIT: 40-120 characters per bullet point. Maintain the exact same number of bullet points as the input.'}
        3. ONLY improve the professional wording, vocabulary, metrics, and impact.
        4. DO NOT add fabricated achievements or remove existing meaning. DO NOT output introductory text.
        
        Original ${field}: "${value}"
        Improved Version:`;
    }

    const suggestion = await callAI(prompt);
    res.json({ success: true, suggestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/analyze-ats
router.post("/analyze-ats", async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const prompt = `
      Analyze this resume against the following job description (if provided).
      Resume Data: ${JSON.stringify(resumeData)}
      Job Description: ${jobDescription || "N/A"}

      Provide a JSON response with:
      - score (0-100)
      - missingKeywords (array)
      - readability (Excellent/Good/Fair)
      - conciseness (Excellent/Good/Fair)
      - warnings (array of strings)
      - positives (array of strings)
      - matchPercentage (if JD provided)
    `;

    const analysis = await callAI(prompt, "You are an ATS (Applicant Tracking System) Analyzer.");
    // Attempt to parse JSON from AI response
    try {
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse analysis" };
      res.json({ success: true, ...result });
    } catch (e) {
      res.json({ success: true, raw: analysis });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/generate-full
router.post("/generate-full", async (req, res) => {
  try {
    const { role, level } = req.body;
    const prompt = `
      Create a highly professional, high-density, ATS-optimized resume structure for a ${level} level candidate applying for a ${role} position.
      
      ${prompts.baseRules}
      
      Output ONLY a valid JSON object matching this exact structure:
      {
        "role": "${role}",
        "sections": [
          { "id": "summary", "content": "Professional summary with metrics (120-320 characters, max 3 sentences)" },
          { "id": "skills", "content": "Comma-separated string of 6-18 skills (max 20 chars per skill)" },
          { "id": "experience", "content": [ { "company": "...", "position": "...", "start": "...", "end": "...", "location": "...", "description": "Bullet points with metrics (2-4 bullets, 40-120 characters each)" } ] },
          { "id": "projects", "content": [ { "title": "...", "stack": "...", "description": "Bullet points (max 2 bullets, 60-180 characters each)" } ] }
        ]
      }
      Ensure all descriptions are highly concise, impactful, result-oriented, and use strong action verbs.
    `;

    const response = await callAI(prompt, "You are a Professional Resume Architect.");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!result) throw new Error("Failed to generate structured resume.");
    res.json({ success: true, resume: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/suggest-skills
router.post("/suggest-skills", async (req, res) => {
  try {
    const { resumeData } = req.body;
    const prompt = `
      Analyze the following resume data (Summary, Experience, and Projects).
      Identify the top 15-20 specific technical skills, tools, and technologies mentioned or implied.
      Return ONLY a comma-separated list of these skills. No categories, just the names.
      Example: React, Node.js, AWS, MongoDB, TypeScript
      
      Resume Data: ${JSON.stringify(resumeData)}
    `;

    const suggestion = await callAI(prompt, "You are a Technical Skill Analyst.");
    res.json({ success: true, skills: suggestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

