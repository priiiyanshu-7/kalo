/* ============================================================
   Daily — bottom sheets: add-chooser, food, exercise, weight
   ============================================================ */

/* the + button opens this: choose food or workout */
function openAddSheet(){
  openSheet(`<div class="h2">Add to your day</div>
    <div class="addchoice">
      <button class="addopt" id="addFood"><span class="ai">🍽️</span><div><div class="at">Log food</div><div class="ad">Meals, snacks & drinks</div></div><span class="arr">›</span></button>
      <button class="addopt" id="addWorkout"><span class="ai">🏋️</span><div><div class="at">Log workout</div><div class="ad">Exercise & calories burnt</div></div><span class="arr">›</span></button>
    </div>
    <button class="ghost" id="addCancel">Cancel</button>`);
  $('addFood').onclick=openFoodSheet;       // openSheet replaces the sheet content
  $('addWorkout').onclick=openExSheet;
  $('addCancel').onclick=closeSheet;
}

function openFoodSheet(){
  let tab='library',selected=null,qty=1;
  openSheet(`<div class="h2">Log food</div><div class="stabs"><button data-t="library" class="on">Search</button><button data-t="custom">Add your own</button></div><div id="sb"></div>`);
  sheet.querySelector('.stabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.t;[...e.currentTarget.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');selected=null;qty=1;body();};
  body();
  function body(){tab==='library'?lib():custom();}
  function lib(){
    let sel={};   // name -> qty (multi-select cart; tap several, add at once)
    $('sb').innerHTML=`<div class="search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#B4B9C2" stroke-width="2"/><path d="M20 20l-3-3" stroke="#B4B9C2" stroke-width="2" stroke-linecap="round"/></svg><input id="q" placeholder="Search dal, paneer, egg…" autocomplete="off"></div><p class="sub" style="font-size:12px;text-align:center;margin:0 0 8px">Tap to add — pick as many as you like.</p><div class="picklist" id="pl"></div><button class="glass" id="cf">Add to day</button><button class="ghost" id="cc2">Cancel</button>`;
    const q=$('q');
    const count=()=>Object.values(sel).reduce((s,n)=>s+n,0);
    const kcal=()=>Object.keys(sel).reduce((s,n)=>{const f=FOODS.find(x=>x.name===n);return s+(f?f.cal*sel[n]:0);},0);
    const refreshBtn=()=>{const c=count();$('cf').textContent=c?`Add ${c} item${c>1?'s':''} · ${kcal()} kcal`:'Add to day';};
    const draw=()=>{const term=q.value.trim().toLowerCase();const items=FOODS.filter(f=>canEat(f.diet)).filter(f=>f.name.toLowerCase().includes(term));const pl=$('pl');
      if(!items.length){pl.innerHTML=`<div class="empty">No match. Try <b>Add your own</b>.</div>`;return;}
      pl.innerHTML=items.map(f=>{const qy=sel[f.name]||0;
        return `<div class="pick ${qy?'sel':''}" data-name="${f.name}"><div class="dot" style="width:10px;height:10px;border-radius:50%;background:${dietColor(f.diet)}"></div><div><div class="nm">${f.name}</div><div class="mt">${f.cal} kcal · ${f.p}g protein</div></div>`+
          (qy?`<div class="qstep"><button class="qm">−</button><span class="qn">${qy}</span><button class="qp">+</button></div>`:`<button class="addmini">Add</button>`)+`</div>`;}).join('');
      pl.querySelectorAll('.pick').forEach(el=>{const n=el.dataset.name;
        el.onclick=()=>{sel[n]=Math.min(20,(sel[n]||0)+1);draw();refreshBtn();};
        const qm=el.querySelector('.qm'),qp=el.querySelector('.qp');
        if(qm)qm.onclick=e=>{e.stopPropagation();sel[n]=(sel[n]||0)-1;if(sel[n]<=0)delete sel[n];draw();refreshBtn();};
        if(qp)qp.onclick=e=>{e.stopPropagation();sel[n]=Math.min(20,(sel[n]||0)+1);draw();refreshBtn();};});};
    q.oninput=draw;draw();refreshBtn();
    $('cf').onclick=()=>{const names=Object.keys(sel);if(!names.length){alert('Tap at least one food to add.');return;}
      names.forEach(n=>{const f=FOODS.find(x=>x.name===n);if(f)dayRec().log.push({name:f.name,cal:f.cal,p:f.p,c:f.c,fat:f.fat,diet:f.diet,qty:sel[n]});});
      const c=count();save();closeSheet();render();toast(`Added ${c} item${c>1?'s':''}`);};
    $('cc2').onclick=closeSheet;
  }
  function custom(){
    $('sb').innerHTML=`<p class="sub" style="text-align:center;margin:4px auto 16px;max-width:300px">Anything not in the list — homemade, a brand, a restaurant dish.</p>
      <div class="field"><span class="label">Food name</span><input id="cn" placeholder="Mom's rajma"></div>
      <div class="field"><span class="label">Calories</span><input id="ccal" type="number" inputmode="numeric" placeholder="320"></div>
      <div class="field"><span class="label">Protein · g (optional)</span><input id="cp" type="number" inputmode="numeric" placeholder="14"></div>
      <div class="field"><span class="label">Type</span><div class="seg" id="cd"><button data-v="veg" class="on">Veg</button><button data-v="egg">Egg</button><button data-v="nonveg">Non-veg</button></div></div>
      <button class="glass" id="sc">Add to day</button><button class="ghost" id="cc3">Cancel</button>`;
    let cd='veg';$('cd').onclick=e=>pick(e,'cd',v=>cd=v);
    $('sc').onclick=()=>{const name=$('cn').value.trim(),cal=+$('ccal').value,p=+$('cp').value||0;if(!name||!cal){alert('Add a name and calories.');return;}
      const food=fillMacros({name,cal,p,diet:cd});FOODS.push({name,cal,p:food.p,c:food.c,fat:food.fat,diet:cd});
      dayRec().log.push({name,cal,p:food.p,c:food.c,fat:food.fat,diet:cd,qty:1});save();closeSheet();render();toast('Added '+name);};
    $('cc3').onclick=closeSheet;
  }
}

function openExSheet(){
  let selected=null,minutes=30;
  openSheet(`<div class="orb" style="width:74px;height:74px;margin:6px auto 14px;font-size:32px;background:radial-gradient(circle at 32% 28%,#FFF0E6,#E0805A 70%,#C25E37)">🏋️</div>
    <div class="h2">Log a workout</div>
    <div class="picklist" id="exl" style="max-height:30vh"></div>
    <div id="exq"></div>
    <button class="glass" id="ce">Add to day</button><button class="ghost" id="cce">Cancel</button>`);
  const draw=()=>{$('exl').innerHTML=EXERCISES.map(x=>`<div class="pick ${selected===x.name?'sel':''}" data-name="${x.name}"><div class="dot" style="width:10px;height:10px;border-radius:50%;background:#E0805A"></div><div><div class="nm">${x.name}</div><div class="mt">~${x.rate} kcal/min</div></div></div>`).join('');
    $('exl').querySelectorAll('.pick').forEach(el=>el.onclick=()=>{selected=el.dataset.name;draw();drawQ();});};
  const drawQ=()=>{const q=$('exq');if(!selected){q.innerHTML='';return;}const ex=EXERCISES.find(x=>x.name===selected);
    q.innerHTML=`<div class="qtybar"><span class="ql">Minutes</span><div class="stepper"><button id="m1">−</button><span class="qn">${minutes}</span><button id="m2">+</button></div></div><div class="preview">≈ <b>${ex.rate*minutes} kcal</b> burnt</div>`;
    $('m1').onclick=()=>{minutes=Math.max(5,minutes-5);drawQ();};$('m2').onclick=()=>{minutes=Math.min(240,minutes+5);drawQ();};};
  draw();
  $('ce').onclick=()=>{if(!selected){alert('Pick an exercise.');return;}const ex=EXERCISES.find(x=>x.name===selected);dayRec().exercises.push({name:ex.name,minutes,burnt:ex.rate*minutes});save();closeSheet();render();toast('Workout logged 💪');};
  $('cce').onclick=closeSheet;
}

function openWeightSheet(){
  const cur=state.weights.length?state.weights[state.weights.length-1].kg:state.profile.weight;
  openSheet(`<div class="orb" style="width:74px;height:74px;margin:6px auto 14px;font-size:32px">⚖️</div>
    <div class="h2">Log your weight</div>
    <p class="sub" style="text-align:center;margin:8px auto 18px">Today, ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</p>
    <div class="field"><span class="label">Weight · kg</span><input id="wkg" type="number" inputmode="decimal" placeholder="${cur}" value="${cur}"></div>
    <button class="glass" id="sw">Save</button><button class="ghost" id="cw">Cancel</button>`);
  $('wkg').focus();
  $('sw').onclick=()=>{const kg=+$('wkg').value;if(!kg||kg<25||kg>300){alert('Enter a valid weight.');return;}
    const k=todayKey();const i=state.weights.findIndex(w=>w.date===k);
    if(i>=0)state.weights[i].kg=kg;else state.weights.push({date:k,kg});
    state.weights.sort((a,b)=>a.date<b.date?-1:1);
    state.profile.weight=kg;save();closeSheet();render();toast('Weight saved ✓');};
  $('cw').onclick=closeSheet;
}
