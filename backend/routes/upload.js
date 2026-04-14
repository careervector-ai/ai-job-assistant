const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { extractSkillsFromResume } = require("../utils/resumeParser");

router.post("/", async (req, res) => {
  let filePath = null;

  try {
    const { fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "No file data received" });
    }

    // Ensure uploads dir exists
    const uploadsDir = path.join(__dirname, "../uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    // Unique filename — prevents race condition
    filePath = path.join(uploadsDir, `resume_${Date.now()}.pdf`);

    const base64Data = fileData.split(",")[1];
    fs.writeFileSync(filePath, base64Data, "base64");

    console.log("📁 File saved:", filePath);

    const skills = await extractSkillsFromResume(filePath);

    res.json({ message: "Resume processed", skills });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    // Always delete file whether success or failure
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

module.exports = router;