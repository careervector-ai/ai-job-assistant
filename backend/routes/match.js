const express = require("express");
const router = express.Router();
const { calculateMatch } = require("../utils/skillMatcher");

router.post("/", (req, res) => {
  const { jobDescription, userSkills } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ error: "No job description provided" });
  }

  const skills = Array.isArray(userSkills) ? userSkills : [];
  const result = calculateMatch(jobDescription, skills);

  const recommendation =
    result.score >= 70 ? "APPLY 🚀" :
    result.score >= 40 ? "MAYBE 🤔" :
    "SKIP ❌";

  res.json({
    matchScore: result.score,
    matchedSkills: result.matched,
    missingSkills: result.missing,
    recommendation
  });
});

module.exports = router;