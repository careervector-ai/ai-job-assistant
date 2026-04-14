import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date
});

const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return Response.json({ error: "Email and OTP required" }, { status: 400 });
    }

    await connectDB();

    const record = await OTP.findOne({ email });

    if (!record) {
      return Response.json({ error: "OTP not found. Request a new one." }, { status: 400 });
    }

    // Check expiry
    if (new Date() > record.expiresAt) {
      await OTP.deleteMany({ email });
      return Response.json({ error: "OTP expired. Request a new one." }, { status: 400 });
    }

    // Check match
    if (record.otp !== otp) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Delete OTP after successful verify
    await OTP.deleteMany({ email });

    return Response.json({ message: "OTP verified", email });

  } catch (err) {
    console.error("❌ OTP verify error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}