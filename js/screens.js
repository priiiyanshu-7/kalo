/* ============================================================
   Daily — screens: Diet (Today), Train, Streak, You
   ============================================================ */

/* ---------------- DIET / TODAY ---------------- */
function renderToday(){
  const p=state.profile,t=calc(p),e=eaten();
  const remaining=Math.max(t.target-e.cal,0),pct=Math.min(e.cal/t.target,1);
  const over=e.cal>t.target;   // diet is food-only; workout burn is tracked separately on Train
  const R=104,C=2*Math.PI*R,dash=C*pct;
  const dietLabel={veg:'Veg',egg:'Eggetarian',nonveg:'Non-veg'}[p.diet];
  const dietPill={veg:'pill-veg',egg:'pill-egg',nonveg:'pill-non'}[p.diet];
  const wg=waterGoal(),water=dayRec().water;
  screen.innerHTML=`
    ${dayNav()}
    <div style="text-align:center;margin:-8px 0 14px"><span class="pill ${dietPill}">${dietLabel}</span></div>
    ${isViewingToday()?'':`<div class="pastbar">You're editing a past day<button id="jumpToday">Back to today</button></div>`}
    <div class="ringcard"><div class="ringwrap">
      <svg width="240" height="240" viewBox="0 0 240 240"><defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9D2FF"/><stop offset="1" stop-color="#6F9BF2"/></linearGradient>
        <filter id="glow"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#7FA8F8" flood-opacity="0.45"/></filter></defs>
        <circle cx="120" cy="120" r="${R}" fill="none" stroke="#EDF1F7" stroke-width="18"/>
        <circle cx="120" cy="120" r="${R}" fill="none" stroke="url(#bg)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${dash} ${C}" transform="rotate(-90 120 120)" filter="url(#glow)"/></svg>
      <div class="ctr"><div class="big" style="${over?'color:var(--clay)':''}">${over?'+'+(e.cal-t.target).toLocaleString('en-IN'):remaining.toLocaleString('en-IN')}</div><div class="cap">${over?'over goal':'calories left'}</div></div></div>
      <div class="ringline"><b>${e.cal.toLocaleString('en-IN')}</b> eaten · <b>${t.target.toLocaleString('en-IN')}</b> goal</div>
      <div class="macros">
        ${macro('Protein',e.protein,t.protein,'linear-gradient(90deg,#57B894,#3FA37E)')}
        ${macro('Carbs',e.carbs,t.carbs,'linear-gradient(90deg,#84AEF8,#6F9BF2)')}
        ${macro('Fat',e.fat,t.fat,'linear-gradient(90deg,#E0805A,#D46E45)')}
      </div></div>

    <div class="section"><div class="aibox">
      <div class="ai-h">✨ Log with AI</div>
      <div class="ai-d">Just type what you ate — AI estimates the calories.</div>
      <div class="ai-row"><input id="aiFood" placeholder="2 rotis, dal and a bowl of curd" autocomplete="off"><button class="sparkbtn" id="aiFoodBtn">➜</button></div>
      <div id="aiFoodStatus"></div>
      <div class="chips">
        <span class="chip" data-ex="2 boiled eggs and a banana">2 eggs + banana</span>
        <span class="chip" data-ex="plate of rajma chawal">rajma chawal</span>
        <span class="chip" data-ex="paneer tikka 200g">paneer tikka</span>
      </div>
    </div></div>

    <div class="section"><div class="section-head"><div class="h2">Eaten</div><button class="link" id="manualAdd">+ Add manually</button></div><div id="log"></div></div>

    <div class="section"><div class="section-head"><div class="h2">Water</div></div>
      <div class="watercard">
        <div class="waterhead"><div class="wv">${water}<span> / ${wg} glasses</span></div><div class="sub" style="font-size:13px">${(water*250/1000).toFixed(2)} L of ${(wg*250/1000).toFixed(1)} L</div></div>
        <div class="glasses" id="glasses">${Array.from({length:Math.max(wg,water)},(_,i)=>`<button class="gls ${i<water?'full':''}" data-i="${i}" aria-label="Glass ${i+1}"></button>`).join('')}</div>
      </div>
    </div>

    <div class="section"><div class="section-head"><div class="h2">For you</div><button class="link" id="aiSuggest">✨ Refresh with AI</button></div><div id="sugg"></div></div>

    <div class="section"><div class="section-head"><div class="h2">Calorie budget</div></div>
      <div class="budget">
        <div class="brow"><span class="bl"><span class="sw" style="background:var(--blue)"></span>Daily goal</span><span class="bv">${t.target.toLocaleString('en-IN')}</span></div>
        <div class="brow"><span class="bl"><span class="sw" style="background:var(--leaf)"></span>Eaten</span><span class="bv">−${e.cal.toLocaleString('en-IN')}</span></div>
        <div class="brow total"><span class="bl">${over?'Over by':'Remaining'}</span><span class="bv" style="${over?'color:var(--clay)':'color:var(--blue-deep)'}">${over?(e.cal-t.target).toLocaleString('en-IN'):remaining.toLocaleString('en-IN')}</span></div>
      </div>
      <p class="sub" style="font-size:12px;text-align:center;margin-top:12px">${t.adj?`On plan: ${t.adj<0?'losing':'gaining'} ≈ ${t.weeklyKg.toFixed(2)} kg/week · maintenance ${t.maintenance.toLocaleString('en-IN')} kcal`:`Maintenance ${t.maintenance.toLocaleString('en-IN')} kcal`}</p>
    </div>`;
  wireDayNav();
  if($('jumpToday'))$('jumpToday').onclick=goToday;
  renderLog(); renderSugg(t,remaining); wireWater();
  $('manualAdd').onclick=openFoodSheet;
  const run=()=>aiLogFood($('aiFood').value.trim());
  $('aiFoodBtn').onclick=run;
  $('aiFood').onkeydown=ev=>{if(ev.key==='Enter')run();};
  screen.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{$('aiFood').value=c.dataset.ex;run();});
  $('aiSuggest').onclick=()=>aiSuggestMeals(t,remaining);
}
function wireWater(){
  $('glasses').querySelectorAll('.gls').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i, rec=dayRec();
    rec.water=(rec.water===i+1)?i:i+1;   // tap filled top glass to remove one
    save();renderToday();
  });
}
function renderLog(){
  const box=$('log');const L=dayRec().log;
  if(!L.length){box.innerHTML=`<div class="empty">Nothing logged yet. Use AI above or add manually.</div>`;return;}
  box.innerHTML=L.map((f,i)=>`<div class="row"><div class="dot" style="background:${dietColor(f.diet)}"></div>
    <div><div class="nm">${f.name}${f.qty>1?` <span style="color:var(--grey)">×${f.qty}</span>`:''}</div><div class="mt">${Math.round((f.p||0)*f.qty)}g protein</div></div>
    <div class="cal">${f.cal*f.qty}</div><button class="rm" data-i="${i}" aria-label="Remove">×</button></div>`).join('');
  box.querySelectorAll('.rm').forEach(b=>b.onclick=()=>{dayRec().log.splice(+b.dataset.i,1);save();render();});
}
function renderSugg(t,remaining,expanded){
  // protein-first picks that fit the calories you have left → help you hit your goal
  let pool=FOODS.filter(f=>canEat(f.diet)).filter(f=>f.cal<=Math.max(remaining,200)).sort((a,b)=>b.p-a.p);
  const limit=expanded?12:4;
  const picks=pool.slice(0,limit);
  if(!picks.length){$('sugg').innerHTML=`<div class="empty">Goal reached — nice. A cup of curd is a light top-up.</div>`;return;}
  $('sugg').innerHTML=picks.map(f=>suggRow(f)).join('')
    + (pool.length>limit&&!expanded?`<button class="ghost" id="moreSugg" style="padding:10px 0">View ${Math.min(pool.length-limit,8)} more</button>`:'');
  wireSugg();
  if($('moreSugg'))$('moreSugg').onclick=()=>renderSugg(t,remaining,true);
}
function suggRow(f){return `<div class="row"><div class="dot" style="background:${dietColor(f.diet||'veg')}"></div>
  <div><div class="nm">${f.name}</div><div class="mt">${f.cal} kcal · ${f.p}g protein</div></div>
  <button class="addmini" data-food='${JSON.stringify(f).replace(/'/g,"&#39;")}'>Add</button></div>`;}
function wireSugg(){$('sugg').querySelectorAll('.addmini').forEach(b=>b.onclick=()=>{const f=fillMacros(JSON.parse(b.dataset.food.replace(/&#39;/g,"'")));dayRec().log.push({name:f.name,cal:f.cal,p:f.p,c:f.c,fat:f.fat,diet:f.diet||'veg',qty:1});save();render();toast('Added '+f.name);});}

async function aiLogFood(text){
  if(!text)return;
  const s=$('aiFoodStatus'),btn=$('aiFoodBtn');
  s.innerHTML=`<div class="ai-status"><span class="spin"></span> Reading "${text}"…</div>`;btn.disabled=true;
  try{
    const out=await askClaude(`You estimate nutrition for Indian foods. The person ate: "${text}".
Respond with ONLY a JSON array (no markdown, no words before or after). Each element:
{"name": short label, "cal": number (total kcal), "p": number (protein g), "c": number (carbs g), "fat": number (fat g), "diet": "veg"|"egg"|"nonveg"}.
Use realistic Indian portion estimates. If amount is unclear, assume one standard serving.`);
    const items=parseJSON(out).slice(0,8).filter(x=>x&&x.name&&x.cal);
    if(!items.length)throw new Error("empty");
    items.forEach(x=>{const it=fillMacros({name:String(x.name),cal:Math.round(+x.cal),p:Math.round(+x.p||0),c:x.c!=null?Math.round(+x.c):null,fat:x.fat!=null?Math.round(+x.fat):null});
      dayRec().log.push({name:it.name,cal:it.cal,p:it.p,c:it.c,fat:it.fat,diet:['veg','egg','nonveg'].includes(x.diet)?x.diet:'veg',qty:1});});
    save();render();toast('Logged with AI ✨');
  }catch(err){ s.innerHTML=`<div class="ai-status" style="color:var(--clay)">Couldn't reach AI here. You can add it manually instead.</div>`;btn.disabled=false; }
}
async function aiSuggestMeals(t,remaining){
  const box=$('sugg');const proteinLeft=Math.max(Math.round(t.protein-eaten().protein),0);
  const goalText={lose:'lose fat',gain:'build muscle',recomp:'lose fat and build muscle',maintain:'maintain weight'}[state.profile.goal]||'reach their goal';
  box.innerHTML=`<div class="ai-status"><span class="spin"></span> Finding ${state.profile.diet} meals to hit your goal…</div>`;
  try{
    const out=await askClaude(`You are a friendly nutrition coach. Suggest 6 specific ${state.profile.diet} foods or simple Indian-friendly meals to help the person ${goalText} today.
Diet rule: veg = no egg/meat; egg = veg + eggs ok; nonveg = anything.
They have about ${remaining} kcal and ${proteinLeft} g protein left today. Prefer high-protein, satisfying options that fit within the remaining calories. Vary the suggestions.
Respond with ONLY a JSON array (no markdown, no commentary). Each element:
{"name": short label with portion (e.g. "Grilled chicken 150g"), "cal": number, "p": number, "c": number, "fat": number, "diet": "veg"|"egg"|"nonveg"}.`);
    const items=parseJSON(out).slice(0,8).filter(x=>x&&x.name&&x.cal);
    if(!items.length)throw new Error("empty");
    box.innerHTML=items.map(x=>{const f=fillMacros({name:String(x.name),cal:Math.round(+x.cal),p:Math.round(+x.p||0),c:x.c!=null?Math.round(+x.c):null,fat:x.fat!=null?Math.round(+x.fat):null,diet:x.diet||'veg'});return suggRow(f);}).join('');
    wireSugg();
  }catch(err){ renderSugg(t,remaining); box.insertAdjacentHTML('beforeend',`<div class="sub" style="font-size:12px;text-align:center;margin-top:6px">AI's busy right now — showing smart picks instead. Tap ✨ to retry.</div>`); }
}

/* ---------------- TRAIN ---------------- */
function renderTrain(){
  const burnt=burntToday(),t=calc(state.profile),goal=t.burnGoal;
  const pct=Math.min(goal?burnt/goal:0,1),R=104,C=2*Math.PI*R,dash=C*pct;
  const left=Math.max(goal-burnt,0),reached=burnt>=goal;
  screen.innerHTML=`
    ${dayNav()}
    ${isViewingToday()?'':`<div class="pastbar">You're editing a past day<button id="jumpToday">Back to today</button></div>`}
    <div class="ringcard"><div class="ringwrap">
      <svg width="240" height="240" viewBox="0 0 240 240"><defs>
        <linearGradient id="bo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2B79A"/><stop offset="1" stop-color="#D46E45"/></linearGradient>
        <filter id="glowo"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#E0805A" flood-opacity="0.4"/></filter></defs>
        <circle cx="120" cy="120" r="${R}" fill="none" stroke="#F4ECE8" stroke-width="18"/>
        <circle cx="120" cy="120" r="${R}" fill="none" stroke="url(#bo)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${dash} ${C}" transform="rotate(-90 120 120)" filter="url(#glowo)"/></svg>
      <div class="ctr"><div class="big">${burnt.toLocaleString('en-IN')}</div><div class="cap">of ${goal} kcal goal</div></div></div>
      <div class="ringline">${reached?'<b>Burn goal smashed</b> 💪':`<b>${left.toLocaleString('en-IN')}</b> kcal left to burn today`}</div>
    </div>
    <div class="section"><div class="aibox">
      <div class="ai-h">✨ Log a workout with AI</div>
      <div class="ai-d">Type what you did — AI estimates the burn.</div>
      <div class="ai-row"><input id="aiEx" placeholder="ran 30 min and 20 min weights" autocomplete="off"><button class="sparkbtn" id="aiExBtn">➜</button></div>
      <div id="aiExStatus"></div>
    </div></div>
    <div class="section"><div class="section-head"><div class="h2">Exercises</div><button class="link" id="manualEx">+ Add manually</button></div><div id="exlog"></div></div>`;
  wireDayNav();
  if($('jumpToday'))$('jumpToday').onclick=goToday;
  renderExLog();
  $('manualEx').onclick=openExSheet;
  const run=()=>aiLogExercise($('aiEx').value.trim());
  $('aiExBtn').onclick=run;$('aiEx').onkeydown=ev=>{if(ev.key==='Enter')run();};
}
function renderExLog(){
  const box=$('exlog');const X=dayRec().exercises;
  if(!X.length){box.innerHTML=`<div class="empty">No workout logged. Use AI above or add manually.</div>`;return;}
  box.innerHTML=X.map((x,i)=>`<div class="row"><div class="dot" style="background:#E0805A"></div>
    <div><div class="nm">${x.name}</div><div class="mt">${x.minutes} min</div></div>
    <div class="cal">${x.burnt}</div><button class="rm" data-i="${i}" aria-label="Remove">×</button></div>`).join('');
  box.querySelectorAll('.rm').forEach(b=>b.onclick=()=>{dayRec().exercises.splice(+b.dataset.i,1);save();render();});
}
async function aiLogExercise(text){
  if(!text)return;const s=$('aiExStatus'),btn=$('aiExBtn');
  s.innerHTML=`<div class="ai-status"><span class="spin"></span> Reading "${text}"…</div>`;btn.disabled=true;
  try{
    const out=await askClaude(`Estimate calories burnt for a workout described as: "${text}".
Assume an average adult. Respond ONLY as a JSON array (no markdown). Each element:
{"name": short label, "minutes": number, "burnt": number (kcal)}.`);
    const items=parseJSON(out).slice(0,6).filter(x=>x&&x.name&&x.burnt);
    if(!items.length)throw new Error("empty");
    items.forEach(x=>dayRec().exercises.push({name:String(x.name),minutes:Math.round(+x.minutes||0),burnt:Math.round(+x.burnt)}));
    save();render();toast('Workout logged 💪');
  }catch(err){ s.innerHTML=`<div class="ai-status" style="color:var(--clay)">Couldn't reach AI here. Add it manually instead.</div>`;btn.disabled=false; }
}

/* ---------------- STREAK ---------------- */
function activeDays(){return Object.keys(state.days).filter(k=>hasActivity(state.days[k]));}
function getStreak(){let n=0;let d=new Date();if(!hasActivity(state.days[dkey(d)]))d.setDate(d.getDate()-1);while(hasActivity(state.days[dkey(d)])){n++;d.setDate(d.getDate()-1);}return n;}
function bestStreak(){const keys=activeDays().sort();let best=0,run=0,prev=null;
  keys.forEach(k=>{if(prev){const diff=(new Date(k)-new Date(prev))/86400000;run=diff===1?run+1:1;}else run=1;best=Math.max(best,run);prev=k;});return best;}
function renderStreak(){
  const streak=getStreak();
  const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d);}
  const dn=['S','M','T','W','T','F','S'];
  const ws=state.weights||[];
  const recentW=ws.slice(-10);
  let wDelta=null;
  if(ws.length>=2){const cutoff=new Date();cutoff.setDate(cutoff.getDate()-7);
    const wk=dkey(cutoff);const past=ws.filter(w=>w.date<=wk).slice(-1)[0]||ws[0];
    wDelta=+(ws[ws.length-1].kg-past.kg).toFixed(1);}
  screen.innerHTML=`
    <div class="head"><div><div class="date">Keep it going</div><div class="h1">Streak</div></div></div>
    <div class="streakhero"><div class="flame">${streak?'🔥':'🌱'}</div><div class="n">${streak}</div><div class="l">day${streak===1?'':'s'} in a row</div></div>
    <div class="section"><div class="gymcard">
      <div class="label" style="margin-bottom:4px">This week</div>
      <div class="weekstrip">${days.map(d=>{const k=dkey(d);const done=hasActivity(state.days[k]);const isToday=k===todayKey();
        return `<div class="day"><div class="dn">${dn[d.getDay()]}</div><div class="dc ${done?'done':''} ${isToday?'today':''}" data-k="${k}">${done?'✓':''}</div></div>`;}).join('')}</div>
    </div></div>
    <div class="statgrid">
      <div class="stat"><div class="sv">${bestStreak()}</div><div class="sl">Best streak</div></div>
      <div class="stat"><div class="sv">${activeDays().length}</div><div class="sl">Total days logged</div></div>
    </div>
    <div class="section"><div class="section-head"><div class="h2">Weight trend</div>${wDelta!=null?`<span class="sub" style="font-size:13px">${wDelta>0?'+':''}${wDelta} kg / 7d</span>`:''}</div>
      <div class="gymcard">${trendChart(recentW.map(w=>w.kg),84)}
        ${recentW.length>=2?`<div class="chartlabels"><span>${new Date(recentW[0].date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span><span>${recentW[recentW.length-1].kg} kg</span></div>`:''}
      </div>
    </div>
    <p class="sub" style="font-size:12px;text-align:center;margin-top:22px">Tap any past day above to view or edit it.<br/>Log any food or workout to keep today's flame lit.</p>`;
  screen.querySelectorAll('.dc[data-k]').forEach(el=>el.onclick=()=>{state.viewDate=el.dataset.k;state.tab='today';render();screen.scrollTop=0;});
}

/* ---------------- YOU / PROFILE ---------------- */
function greeting(){const h=new Date().getHours();return h<5?'Up late':h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Winding down';}
function userLevel(){
  const d=activeDays().length;
  const L=[[0,'Newbie','🌱'],[3,'Warming up','🔥'],[7,'On a roll','⚡'],[14,'Consistent','💪'],[30,'Committed','🏆'],[60,'Unstoppable','👑'],[100,'Legend','🌟']];
  let i=0;for(let k=0;k<L.length;k++){if(d>=L[k][0])i=k;}
  const cur=L[i],nxt=L[i+1]||null;
  const pct=nxt?Math.min(100,Math.round((d-cur[0])/(nxt[0]-cur[0])*100)):100;
  return {days:d,t:cur[1],icon:cur[2],next:nxt?nxt[1]:null,toNext:nxt?nxt[0]-d:0,pct};
}
function renderYou(){
  const p=state.profile,t=calc(p);
  const ws=state.weights||[];const cur=ws.length?ws[ws.length-1].kg:p.weight;const start=ws.length?ws[0].kg:p.weight;
  const change=+(cur-start).toFixed(1);
  const toTarget=p.target?+(cur-p.target).toFixed(1):null;
  const u=(typeof userInfo==='function')?userInfo():null;
  const installable=!!window.deferredPrompt;
  const streak=getStreak(),logged=activeDays().length,lvl=userLevel();
  const initial=((u?u.name:'Y')||'Y').trim().charAt(0).toUpperCase();
  screen.innerHTML=`
    <div class="head"><div><div class="date">Your profile</div><div class="h1">You</div></div></div>
    <div class="profcard">
      <div class="profhead">
        <div class="avatar ring">${u&&u.avatar?`<img src="${u.avatar}" alt="">`:initial}</div>
        <div><div class="greet">${greeting()} 👋</div><div class="pn">${u?u.name:'Guest'}</div><div class="pe">${u?u.email:(CLOUD?'Not signed in':'On this device')}</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
        <span class="pill ${ {veg:'pill-veg',egg:'pill-egg',nonveg:'pill-non'}[p.diet] }">${ {veg:'Veg',egg:'Eggetarian',nonveg:'Non-veg'}[p.diet] }</span>
        <span class="pill" style="background:var(--blue-tint);color:var(--blue-ink)">${GOALS[p.goal].t}</span>
        ${CLOUD&&currentUser?`<span class="synced">● Synced</span>`:''}
      </div>
      <div class="funstats">
        <div><div class="fs-ic">${streak?'🔥':'🌱'}</div><b>${streak}</b><small>day streak</small></div>
        <div><div class="fs-ic">📅</div><b>${logged}</b><small>days logged</small></div>
        <div><div class="fs-ic">${lvl.icon}</div><b style="font-size:14px">${lvl.t}</b><small>your level</small></div>
      </div>
      <div class="levelbar"><i style="width:${lvl.pct}%"></i></div>
      <div class="levelrow"><span>${lvl.next?`<b>${lvl.toNext}</b> more day${lvl.toNext===1?'':'s'} to <b>${lvl.next}</b>`:'Max level — legend! 🌟'}</span><span>${logged} days</span></div>
    </div>

    <div class="section"><div class="kgrid">
      <div class="kchip"><div class="kv">${t.target.toLocaleString('en-IN')}</div><div class="kl">Daily kcal</div></div>
      <div class="kchip"><div class="kv">${t.protein}g</div><div class="kl">Protein goal</div></div>
      <div class="kchip"><div class="kv">${t.bmi}</div><div class="kl">BMI</div></div>
    </div></div>

    ${!CLOUD?`<div class="banner" style="margin-top:16px">⚠️ Cloud sync is off. Add your Supabase keys in <b>js/config.js</b> to enable Google sign-in and sync across devices.</div>`:''}

    <div class="section"><div class="section-head"><div class="h2">Weight</div><button class="link" id="logW">+ Log weight</button></div>
      <div class="gymcard">
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div><div style="font-family:'Newsreader',serif;font-weight:500;font-size:40px;line-height:1">${cur}<span style="font-size:18px;color:var(--grey)"> kg</span></div>
          <div class="sub" style="font-size:13px;margin-top:4px">${change===0?'No change yet':(change>0?'+':'')+change+' kg since start'}</div></div>
          ${p.target?`<div style="text-align:right"><div class="label">Target</div><div style="font-family:'Newsreader',serif;font-size:22px">${p.target} kg</div><div class="sub" style="font-size:12px">${toTarget===0?'reached 🎉':Math.abs(toTarget)+' kg to go'}</div></div>`:''}
        </div>
        ${trendChart(ws.map(w=>w.kg))}
      </div>
    </div>

    <div class="section"><div class="h2" style="margin-bottom:14px">Settings</div>
      <div class="listcard">
        <div class="listrow" id="editGoal"><span class="ic">🎯</span> Edit goal & stats <span class="arr">›</span></div>
        ${installable?`<div class="listrow" id="install"><span class="ic">📲</span> Install app <span class="arr">›</span></div>`:''}
        <div class="listrow" id="exportData"><span class="ic">⬇️</span> Export my data <span class="arr">›</span></div>
        ${CLOUD&&currentUser?`<div class="listrow" id="signOut"><span class="ic">🚪</span> Sign out <span class="arr">›</span></div>`:''}
        ${CLOUD&&!currentUser?`<div class="listrow" id="signIn"><span class="ic">🔐</span> Sign in with Google <span class="arr">›</span></div>`:''}
        <div class="listrow" id="resetApp" style="color:var(--clay)"><span class="ic">🗑️</span> Reset everything <span class="arr">›</span></div>
      </div>
      <p class="sub" style="font-size:12px;text-align:center;margin-top:16px">${CLOUD&&currentUser?'Your data is securely synced to your account.':'Your data is stored on this device.'}</p>
    </div>`;
  $('logW').onclick=openWeightSheet;
  $('editGoal').onclick=()=>onboarding(true);
  $('exportData').onclick=exportData;
  $('resetApp').onclick=()=>{ if(confirm('This erases your profile, logs and weight history. Continue?')){state=fresh();state.viewDate=todayKey();save();render();} };
  if($('install'))$('install').onclick=async()=>{ if(!window.deferredPrompt)return;window.deferredPrompt.prompt();await window.deferredPrompt.userChoice;window.deferredPrompt=null;render(); };
  if($('signOut'))$('signOut').onclick=async()=>{ if(confirm('Sign out of Kalo?\n\nYour data stays safely synced to your account — it\'ll all be here when you sign back in.')){toast('Signing out…');try{await cloudSignOut();}catch(e){} location.reload();} };
  if($('signIn'))$('signIn').onclick=()=>cloudSignInGoogle();
}
function exportData(){
  try{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download='daily-backup-'+todayKey()+'.json';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){alert('Export not available here.');}
}
