/* ============================================================
   Daily — AI proxy (Vercel serverless function)
   Receives { prompt } from the browser, calls Google Gemini
   (AI Studio) with a server-side key, returns { text }.

   Setup:
   1. Get a free key at https://aistudio.google.com/apikey
   2. In Vercel → your project → Settings → Environment Variables
      add  GEMINI_API_KEY = <your key>   (then redeploy)
   ============================================================ */
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(500).json({ error: "GEMINI_API_KEY not set in Vercel" }); return; }

  let prompt = "", model = DEFAULT_MODEL;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    prompt = body.prompt;
    if (body.model) model = body.model;   // optional override (for diagnostics)
  } catch (e) { /* ignore */ }
  if (!prompt || typeof prompt !== "string") { res.status(400).json({ error: "missing prompt" }); return; }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
      })
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: (data.error && data.error.message) || "Gemini error" });
      return;
    }
    const text = ((((data.candidates || [])[0] || {}).content || {}).parts || [])
      .map(p => p.text || "").join("");
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
