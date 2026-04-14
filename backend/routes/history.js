const express = require("express");
const router = express.Router();
const JobHistory = require("../models/JobHistory");

// Save job analysis
router.post("/", async (req, res) => {
  try {
    const { score, matched, missing, recommendation } = req.body;
    const entry = new JobHistory({ score, matched, missing, recommendation });
    await entry.save();
    res.json({ message: "Saved", entry });
  } catch (err) {
    console.error("❌ History save error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all job history
router.get("/", async (req, res) => {
  try {
    const history = await JobHistory.find()
      .sort({ pinned: -1, timestamp: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    console.error("❌ History fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Pin/unpin
router.patch("/", async (req, res) => {
  try {
    const { id, pinned } = req.body;
    await JobHistory.findByIdAndUpdate(id, { pinned });
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("❌ Pin error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;