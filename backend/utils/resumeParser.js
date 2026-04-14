const fs = require("fs");
const pdfParse = require("pdf-parse");
const { extractSkillsGemini } = require("./geminiExtractor");

const keywordFallback = [
  "java", "python", "javascript", "typescript", "react", "vue", "angular",
  "node", "express", "spring", "django", "flask", "nextjs", "next.js",
  "sql", "mysql", "postgresql", "mongodb", "firebase", "redis",
  "html", "css", "tailwind", "bootstrap", "sass",
  "docker", "kubernetes", "aws", "azure", "gcp",
  "git", "github", "rest api", "graphql",
  "machine learning", "tensorflow", "pytorch"
];

async function extractSkillsFromResume(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text || "";

  console.log("📄 Text length:", text.length);

  if (!text.trim()) {
    throw new Error("Could not extract text from PDF. File may be scanned or corrupted.");
  }

  let skills = [];

  try {
    skills = await extractSkillsGemini(text);
  } catch (err) {
    console.warn("⚠️ Gemini failed:", err.message);
  }

  if (!skills || skills.length === 0) {
    console.log("⚠️ Using keyword fallback");
    const lower = text.toLowerCase();
    skills = keywordFallback.filter(skill => lower.includes(skill));
  }

  if (!skills || skills.length === 0) {
    throw new Error("No skills could be extracted from this resume.");
  }

  console.log("✅ Final skills:", skills);
  return skills;
}

module.exports = { extractSkillsFromResume };