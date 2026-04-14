require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =======================
// 🔥 MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// =======================
// 🗄️ MONGODB CONNECTION
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// =======================
// 📌 ROUTES
// =======================
app.use("/match", require("./routes/match"));
app.use("/upload", require("./routes/upload"));
app.use("/history", require("./routes/history"));

// =======================
// 🧪 TEST ROUTE
// =======================
app.get("/", (req, res) => res.send("🚀 AI Job Assistant Backend Running"));

// =======================
// 🚀 START SERVER
// =======================
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Server running at http://localhost:${PORT}`));