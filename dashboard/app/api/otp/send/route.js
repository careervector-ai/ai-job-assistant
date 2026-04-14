import nodemailer from "nodemailer";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

// OTP Schema
const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date
});

const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await connectDB();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp, expiresAt });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your AI Job Assistant OTP",
      html: `
        <h2>Your OTP Code</h2>
        <p>Use this code to login:</p>
        <h1 style="color:#00ffcc; letter-spacing:8px;">${otp}</h1>
        <p>Expires in 10 minutes. Do not share this code.</p>
      `
    });

    return Response.json({ message: "OTP sent" });

  } catch (err) {
    console.error("❌ OTP send error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}