/* ============================================================
   Daily — AI helper (calls Claude directly)
   Works inside claude.ai; elsewhere callers fall back to manual.
   ============================================================ */
async function askClaude(prompt){
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]})
  });
  if(!res.ok) throw new Error("AI request failed");
  const data=await res.json();
  return data.content.filter(b=>b.type==='text').map(b=>b.text).join('');
}
function parseJSON(text){
  const clean=text.replace(/```json/gi,'').replace(/```/g,'').trim();
  const start=clean.indexOf('['), end=clean.lastIndexOf(']');
  return JSON.parse(start>=0?clean.slice(start,end+1):clean);
}
