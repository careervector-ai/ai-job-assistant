// =======================
// 🔧 MASTER SKILL LIST
// =======================
const allSkills = [
  "javascript",
  "react",
  "node",
  "python",
  "sql",
  "mongodb",
  "html",
  "css",
  "java",
  "c++",
  "docker",
  "aws",
  "rest api"
];

// =======================
// 🔍 Extract Skills from Job Description
// =======================
function extractSkills(text) {
  const lowerText = text.toLowerCase();

  const detected = allSkills.filter(skill =>
    lowerText.includes(skill)
  );

  // Remove duplicates (safety)
  return [...new Set(detected)];
}

// =======================
// 🧠 Calculate Match
// =======================
function calculateMatch(jobDescription, userSkills = []) {
  const jobSkills = extractSkills(jobDescription);

  // Normalize user skills
  const normalizedUserSkills = userSkills.map(skill =>
    skill.toLowerCase().trim()
  );

  // 🚨 Handle case: no skills detected
  if (jobSkills.length === 0) {
    return {
      score: 0,
      matched: [],
      missing: [],
      message: "No recognizable skills found in job description"
    };
  }

  // ✅ Matched skills
  const matched = jobSkills.filter(skill =>
    normalizedUserSkills.includes(skill)
  );

  // ❌ Missing skills
  const missing = jobSkills.filter(skill =>
    !normalizedUserSkills.includes(skill)
  );

  // 📊 Score calculation
  const score = Math.round((matched.length / jobSkills.length) * 100);

  return {
    score,
    matched,
    missing
  };
}

module.exports = { calculateMatch };