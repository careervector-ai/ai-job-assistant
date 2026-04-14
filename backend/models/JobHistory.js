const mongoose = require("mongoose");

const jobHistorySchema = new mongoose.Schema({
  score: Number,
  matched: [String],
  missing: [String],
  recommendation: String,
  pinned: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobHistory", jobHistorySchema);