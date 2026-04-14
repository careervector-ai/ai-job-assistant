import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

const JobHistorySchema = new mongoose.Schema({
  email: String,
  score: Number,
  matched: [String],
  missing: [String],
  recommendation: String,
  pinned: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const JobHistory = mongoose.models.JobHistory || mongoose.model("JobHistory", JobHistorySchema);

// GET - fetch history for logged in user
export async function GET(req) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    await connectDB();

    // Auto delete unpinned jobs older than 24 hours
    await JobHistory.deleteMany({
      email: session.user.email,
      pinned: false,
      timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const history = await JobHistory.find({ email: session.user.email })
      .sort({ pinned: -1, timestamp: -1 })
      .limit(10);

    return new Response(JSON.stringify(history), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("❌ History fetch error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST - save job analysis
export async function POST(req) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { score, matched, missing, recommendation } = await req.json();

    await connectDB();

    const entry = await JobHistory.create({
      email: session.user.email,
      score,
      matched,
      missing,
      recommendation
    });

    return new Response(JSON.stringify({ message: "Saved", entry }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("❌ History save error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// PATCH - pin/unpin a job
export async function PATCH(req) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id, pinned } = await req.json();

    await connectDB();

    await JobHistory.findByIdAndUpdate(id, { pinned });

    return new Response(JSON.stringify({ message: "Updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("❌ Pin error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}