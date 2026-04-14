import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { missingSkills } = await req.json();

    if (!missingSkills || missingSkills.length === 0) {
      return Response.json({ error: "No missing skills provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a career coach for final year Computer Science students in India.

A student is missing these skills for their target job: ${missingSkills.join(", ")}

Create a realistic week-by-week learning roadmap to acquire these skills.

For each week provide:
- What to learn
- One free resource (YouTube channel, official docs, or free course)
- A small practical task to complete

Return ONLY a JSON array. No markdown, no explanation.

Example format:
[
  {
    "week": 1,
    "skill": "Docker",
    "topic": "Docker basics - containers and images",
    "resource": "TechWorld with Nana - Docker Tutorial (YouTube)",
    "resourceUrl": "https://www.youtube.com/watch?v=3c-iBn73dDE",
    "task": "Containerize a simple Node.js app"
  }
]
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().replace(/```json|```/g, "").trim();

    const roadmap = JSON.parse(output);

    return Response.json({ roadmap });

  } catch (err) {
    console.error("❌ Roadmap error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}