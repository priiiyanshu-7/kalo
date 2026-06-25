/* ============================================================
   Daily — AI helper
   Calls our own serverless proxy (/api/ai) which talks to
   Google Gemini (AI Studio) using a server-side key. The key
   is NEVER exposed to the browser. Set GEMINI_API_KEY in Vercel.
   On hosts without the function, callers fall back to manual.
   ============================================================ */
async function askClaude(prompt){
  const res=await fetch("/api/ai",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({prompt})
  });
  if(!res.ok) throw new Error("AI request failed");
  const data=await res.json();
  if(!data || !data.text) throw new Error("empty AI response");
  return data.text;
}
function parseJSON(text){
  const clean=text.replace(/```json/gi,'').replace(/```/g,'').trim();
  const start=clean.indexOf('['), end=clean.lastIndexOf(']');
  return JSON.parse(start>=0?clean.slice(start,end+1):clean);
}
