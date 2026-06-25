/* ============================================================
   Kalo — AI proxy (Vercel serverless function)
   Receives { prompt } from the browser, calls Google Gemini
   (AI Studio) with a server-side key, returns { text }.

   Resilient: tries several free-tier models and retries on
   transient "overloaded / high demand" (503) errors, so a busy
   model doesn't surface as "AI unavailable".

   Setup:
   1. Free key: https://aistudio.google.com/apikey
   2. Vercel → Settings → Environment Variables:
        GEMINI_API_KEY = <your key>   (then redeploy)
   ============================================================ */
const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function extractText(data) {
  return ((((data.candidates || [])[0] || {}).content || {}).parts || [])
    .map(p => p.text || "").join("");
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(500).json({ error: "GEMINI_API_KEY not set in Vercel" }); return; }

  let prompt = "", forced = null;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    prompt = body.prompt;
    if (body.model) forced = body.model;
  } catch (e) { /* ignore */ }
  if (!prompt || typeof prompt !== "string") { res.status(400).json({ error: "missing prompt" }); return; }

  const models = forced ? [forced]
                        : [process.env.GEMINI_MODEL || FALLBACK_MODELS[0],
                           ...FALLBACK_MODELS.filter(m => m !== (process.env.GEMINI_MODEL || FALLBACK_MODELS[0]))];

  let lastErr = "AI temporarily unavailable";
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5 } })
        });
        const data = await r.json();
        if (r.ok) {
          const text = extractText(data);
          if (text) { res.status(200).json({ text }); return; }
          lastErr = "empty response";
        } else {
          lastErr = (data.error && data.error.message) || `error ${r.status}`;
          // 503 = overloaded → retry same model; 429/quota/404 → move to next model
          if (r.status === 503) { await sleep(450); continue; }
          break;
        }
      } catch (e) { lastErr = String(e); await sleep(300); }
    }
  }
  res.status(503).json({ error: lastErr });
}
