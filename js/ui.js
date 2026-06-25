/* ============================================================
   Daily — shared UI helpers: DOM refs, sheets, segments, charts
   ============================================================ */
const screen=document.getElementById('screen'),
      fnav=document.getElementById('fnav'),
      scrim=document.getElementById('scrim'),
      sheet=document.getElementById('sheet'),
      $=id=>document.getElementById(id);

/* bottom sheet */
function openSheet(html){sheet.innerHTML=`<div class="grab"></div>`+html;scrim.classList.add('show');requestAnimationFrame(()=>sheet.classList.add('show'));}
function closeSheet(){sheet.classList.remove('show');scrim.classList.remove('show');}
scrim.onclick=closeSheet;

/* segmented control selection */
function pick(e,id,set){const b=e.target.closest('button');if(!b)return;set(b.dataset.v);[...$(id).children].forEach(x=>x.classList.remove('on'));b.classList.add('on');}

/* macro chip */
function macro(label,val,goal,grad){
  const has=typeof val==='number';const pct=has&&goal?Math.min(val/goal,1)*100:0;
  return `<div class="mchip"><div class="mv">${has?Math.round(val):'—'}<span style="font-size:12px;color:var(--grey);font-family:Inter"> /${goal}g</span></div><div class="ml">${label}</div><div class="mt"><div class="mf" style="width:${pct}%;background:${grad}"></div></div></div>`;
}

/* date navigator used on Diet & Train (lets you edit past days) */
function dayNav(){
  const today=isViewingToday();
  const d=new Date(viewKey());
  const lbl=today?'Today':d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
  return `<div class="daynav">
    <button data-day="-1" aria-label="Previous day">‹</button>
    <div style="min-width:96px;text-align:center"><div class="date">${today?d.toLocaleDateString('en-IN',{day:'numeric',month:'long'}):'Editing'}</div><div style="font-weight:600">${lbl}</div></div>
    <button data-day="1" ${today?'disabled':''} aria-label="Next day">›</button>
  </div>`;
}
function wireDayNav(){screen.querySelectorAll('.daynav button[data-day]').forEach(b=>b.onclick=()=>shiftDay(+b.dataset.day));}

/* weight trend chart (svg line + fill). pts = array of numbers */
function trendChart(pts,h){
  h=h||72;const w=300;
  if(!pts||pts.length<2)return `<div class="empty" style="margin-top:6px">Log your weight a few times to see your trend.</div>`;
  const mn=Math.min(...pts),mx=Math.max(...pts),rng=(mx-mn)||1;
  const x=i=>(i/(pts.length-1))*(w-8)+4, y=v=>h-10-((v-mn)/rng)*(h-22);
  const P=pts.map((v,i)=>[x(i),y(v)]);
  const line=P.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=`M${P[0][0].toFixed(1)} ${h} L`+P.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+` L${P[P.length-1][0].toFixed(1)} ${h} Z`;
  const last=P[P.length-1];
  return `<div class="chartwrap"><svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="display:block">
    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#84AEF8" stop-opacity=".28"/><stop offset="1" stop-color="#84AEF8" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#cg)"/>
    <path d="${line}" fill="none" stroke="#4A78E0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="#4A78E0"/></svg></div>`;
}

/* small Google "G" mark for the sign-in button */
const GOOGLE_SVG=`<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
