require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractSkillsGemini(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert resume parser.
Extract ONLY technical skills that are explicitly mentioned in the text.
Do NOT infer or guess skills that aren't there.
Return ONLY a JSON array of lowercase strings. No explanation, no markdown.

Example output: ["javascript","react","node","sql"]

TEXT:
${text}
`;

  const result = await model.generateContent(prompt);
  let output = result.response.text().replace(/```json|```/g, "").trim();

  console.log("🤖 Gemini raw:", output);

  try {
    const parsed = JSON.parse(output);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    throw new Error("Empty or invalid array from Gemini");
  } catch {
    // Manual extraction as last resort
    const fallback = output
      .replace(/[\[\]"]/g, "")
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (fallback.length === 0) throw new Error("Gemini returned no skills");
    return fallback;
  }
}

module.exports = { extractSkillsGemini };