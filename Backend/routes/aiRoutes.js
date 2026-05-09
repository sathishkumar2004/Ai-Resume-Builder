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
      prompt = `
        You are a Senior Technical Resume Editor.
        Task: Enhance the following text for a ${context.role} role.
        
        CRITICAL CONSTRAINT: 
        1. Keep the output extremely concise to perfectly fit into a modern one-page resume template without overflowing.
        ${field === 'summary' ? '2. STRICT LENGTH LIMIT: MAXIMUM 200 CHARACTERS TOTAL. OUTPUT MUST BE A SINGLE PARAGRAPH. NO BULLET POINTS. NO NEW LINES.' : '2. STRICT LENGTH LIMIT: MAXIMUM 100 CHARACTERS PER BULLET POINT. Output a maximum of 2 bullet points.'}
        3. ONLY improve the professional wording, vocabulary, metrics, and impact.
        4. DO NOT output introductory or conversational text. ONLY output the enhanced text itself.
        5. DO NOT generate additional sections like "Summary" or "Skills". ONLY return the improved text for this specific field.
        
        Original Text to Enhance: "${value}"
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
      
      Output ONLY a JSON object with this exact structure:
      {
        "role": "${role}",
        "sections": [
          { "id": "summary", "content": "Professional summary with metrics (STRICT LIMIT: MAXIMUM 200 CHARACTERS TOTAL)" },
          { "id": "skills", "content": "List of top tech skills as a comma-separated string (e.g., React, Node.js, AWS)" },
          { "id": "experience", "content": [ { "company": "...", "position": "...", "start": "...", "end": "...", "location": "...", "description": "Bullet points with metrics (STRICT LIMIT: max 3 bullets, MAXIMUM 100 CHARACTERS PER BULLET)" } ] },
          { "id": "projects", "content": [ { "title": "...", "stack": "...", "description": "Bullet points (STRICT LIMIT: max 2 bullets, MAXIMUM 100 CHARACTERS PER BULLET)" } ] }
        ]
      }
      Ensure all descriptions are highly concise, impactful, result-oriented, and use strong action verbs. The experience section should have 2-3 entries.
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

// POST /api/ai/wizard-generate
router.post("/wizard-generate", async (req, res) => {
  try {
    const { type, formData } = req.body;

    let prompt = "";

    if (type === "fresher") {
      const { name, role, college, degree, yearOfPassing, skills, languages, dob, address, nationality, fatherName } = formData;
      prompt = `
        You are an expert resume writer. Generate a complete professional resume for a FRESHER student with ZERO work experience.
        
        Candidate Info:
        - Name: ${name}
        - Role Applying For: ${role}
        - College: ${college}
        - Degree: ${degree}
        - Year of Passing: ${yearOfPassing}
        - Skills: ${skills}
        - Languages: ${languages}

        Output ONLY a valid JSON object with this exact structure (no extra text, no markdown):
        {
          "summary": "A single ATS-friendly career objective paragraph. STRICT LIMIT: 180 characters max.",
          "skills": "comma-separated skills list (max 12 skills)",
          "education": [{ "degree": "${degree}", "institution": "${college}", "start": "", "end": "${yearOfPassing}", "location": "" }],
          "certifications": [],
          "experience": [],
          "projects": [{ "title": "Academic Project relevant to ${role}", "stack": "relevant tech stack", "description": "• Brief impactful description (max 90 chars)." }]
        }
        
        Rules:
        - Summary must be a CAREER OBJECTIVE, NOT a work summary. Fresher-friendly tone.
        - Skills: add implied skills based on the degree and role. Keep it to 10-15 items.
        - Projects: generate 1 realistic academic/personal project relevant to the role.
        - NEVER fabricate work experience.
        - All content must fit a single A4 page.
      `;
    } else {
      const { name, role, experienceYears, currentCompany, skills, education } = formData;
      prompt = `
        You are an expert resume writer. Generate a complete professional resume for an EXPERIENCED candidate.
        
        Candidate Info:
        - Name: ${name}
        - Target Role: ${role}
        - Years of Experience: ${experienceYears}
        - Current/Last Company: ${currentCompany}
        - Skills: ${skills}
        - Education: ${education}

        Output ONLY a valid JSON object (no extra text, no markdown):
        {
          "summary": "Single powerful paragraph. STRICT LIMIT: 200 characters max.",
          "skills": "comma-separated top 15 skills",
          "experience": [
            { "company": "${currentCompany}", "position": "${role}", "start": "Jan 2022", "end": "Present", "location": "Remote", "description": "• Achievement bullet 1 (max 90 chars).\\n• Achievement bullet 2 (max 90 chars).\\n• Achievement bullet 3 (max 90 chars)." }
          ],
          "education": [{ "degree": "${education}", "institution": "University", "start": "", "end": "2020", "location": "" }],
          "projects": [],
          "certifications": []
        }
        Rules:
        - Summary must be professional and metrics-driven.
        - Experience: max 3 bullet points, each under 90 characters.
        - All content must fit a single A4 page.
      `;
    }

    const response = await callAI(prompt, "You are a Professional Resume Architect. Always output valid JSON only.");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    if (!result) throw new Error("AI failed to generate structured resume.");
    res.json({ success: true, resume: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

