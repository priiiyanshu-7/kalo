/* ============================================================
   Daily — onboarding wizard (also reused to edit goal & stats)
   onboarding(true) runs in edit mode from the You tab.
   ============================================================ */
function onboarding(edit){
  const d=edit?{...state.profile}:{sex:'male',diet:'veg',activity:'moderate',goal:'maintain',pace:'steady'};
  let step=edit?1:0;
  const steps=['welcome','about','body','activity','goal','plan'];
  fnav.style.display='none';

  function show(){({welcome:wWelcome,about:wAbout,body:wBody,activity:wActivity,goal:wGoal,plan:wPlan}[steps[step]])();}
  const bar=()=>`<div class="prog">${steps.slice(1).map((_,i)=>`<i class="${i<step?'on':''}"></i>`).join('')}</div>`;
  const navBtns=(label,canBack)=>`<button class="glass" id="next" style="margin-top:18px">${label}</button>${canBack?`<button class="ghost" id="back">${step<=1&&edit?'Cancel':'Back'}</button>`:''}`;
  function wire(onNext){
    if($('next'))$('next').onclick=onNext;
    if($('back'))$('back').onclick=()=>{ if(step<=1&&edit){state.tab='you';render();return;} step--; show(); };
  }

  function wWelcome(){
    screen.innerHTML=`<div style="padding:40px 4px 0;text-align:center">
      <div class="orb">🔥</div><h1 class="h1">Welcome.</h1>
      <p class="sub" style="margin:14px auto 0;max-width:300px">Let's set up your plan. Takes about a minute.</p>
      <ul style="list-style:none;text-align:left;max-width:280px;margin:30px auto 0;display:flex;flex-direction:column;gap:16px">
        <li class="sub" style="display:flex;gap:12px;align-items:center"><span style="font-size:22px">🍽️</span> Personalised calorie & macro goals</li>
        <li class="sub" style="display:flex;gap:12px;align-items:center"><span style="font-size:22px">✨</span> Log meals & workouts by just typing</li>
        <li class="sub" style="display:flex;gap:12px;align-items:center"><span style="font-size:22px">📈</span> Track weight, water & streaks</li>
      </ul>
      <button class="glass" id="next" style="margin-top:34px">Get started</button></div>`;
    wire(()=>{step++;show();});
  }
  function wAbout(){
    screen.innerHTML=`<div style="padding:0 4px">${bar()}
      <h1 class="h1">About you</h1><p class="sub" style="margin:10px 0 24px">This tunes your daily calorie target.</p>
      <div class="field"><span class="label">I am</span><div class="seg" id="sexSeg"><button data-v="male" class="${d.sex==='male'?'on':''}">Male</button><button data-v="female" class="${d.sex==='female'?'on':''}">Female</button></div></div>
      <div class="field"><span class="label">Diet</span><div class="seg" id="dietSeg">
        <button data-v="veg" class="${d.diet==='veg'?'on':''}">Veg</button><button data-v="egg" class="${d.diet==='egg'?'on':''}">Eggetarian</button><button data-v="nonveg" class="${d.diet==='nonveg'?'on':''}">Non-veg</button></div></div>
      <div class="field"><span class="label">Age</span><input id="age" type="number" inputmode="numeric" placeholder="26" value="${d.age||''}"></div>
      ${navBtns('Continue',true)}</div>`;
    $('sexSeg').onclick=e=>pick(e,'sexSeg',v=>d.sex=v);
    $('dietSeg').onclick=e=>pick(e,'dietSeg',v=>d.diet=v);
    wire(()=>{const a=+$('age').value;if(!a||a<10||a>100){alert('Enter a valid age.');return;}d.age=a;step++;show();});
  }
  function wBody(){
    let hUnit=d.heightUnit||'cm';
    const toFtIn=cm=>{const ti=cm/2.54;const ft=Math.floor(ti/12);return {ft,inch:Math.round(ti-ft*12)};};
    const captureH=()=>{
      if(hUnit==='cm'){const v=+(($('hcm')||{}).value);if(v)d.height=v;}
      else{const ft=+(($('hft')||{}).value||0),inch=+(($('hin')||{}).value||0);if(ft||inch)d.height=Math.round((ft*12+inch)*2.54);}
    };
    const paint=()=>{
      const hi=d.height?toFtIn(d.height):{ft:'',inch:''};
      screen.innerHTML=`<div style="padding:0 4px">${bar()}
        <h1 class="h1">Your body</h1><p class="sub" style="margin:10px 0 24px">Used for your BMR — kept private to your account.</p>
        <div class="field"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="label">Height</span>
          <div class="unitseg" id="hUnit"><button data-v="cm" class="${hUnit==='cm'?'on':''}">cm</button><button data-v="ft" class="${hUnit==='ft'?'on':''}">ft / in</button></div></div>
          ${hUnit==='cm'
            ?`<input id="hcm" type="number" inputmode="numeric" placeholder="172" value="${d.height||''}">`
            :`<div style="display:flex;gap:10px"><input id="hft" type="number" inputmode="numeric" placeholder="5 ft" value="${hi.ft||''}" style="flex:1"><input id="hin" type="number" inputmode="numeric" placeholder="8 in" value="${hi.inch!==''?hi.inch:''}" style="flex:1"></div>`}
        </div>
        <div class="field"><span class="label">Weight · kg</span><input id="weight" type="number" inputmode="decimal" placeholder="70" value="${d.weight||''}"></div>
        ${navBtns('Continue',true)}</div>`;
      $('hUnit').onclick=e=>{const b=e.target.closest('button');if(!b||b.dataset.v===hUnit)return;captureH();hUnit=b.dataset.v;paint();};
      wire(()=>{captureH();const h=d.height,w=+$('weight').value;
        if(!h||h<100||h>250){alert('Enter a valid height.');return;}
        if(!w||w<25||w>300){alert('Enter a valid weight in kg.');return;}
        d.weight=w;d.heightUnit=hUnit;step++;show();});
    };
    paint();
  }
  function wActivity(){
    screen.innerHTML=`<div style="padding:0 4px">${bar()}
      <h1 class="h1">How active<br/>are you?</h1><p class="sub" style="margin:10px 0 24px">Outside of focused workouts too.</p>
      <div class="seg stack" id="actSeg">${Object.entries(ACTIVITY).map(([k,v])=>`<button data-v="${k}" class="${d.activity===k?'on':''}"><span class="opt-t">${v.split(' — ')[0]}</span><span class="opt-d">${v.includes('—')?v.split('— ')[1]:'&nbsp;'}</span></button>`).join('')}</div>
      ${navBtns('Continue',true)}</div>`;
    $('actSeg').onclick=e=>pick(e,'actSeg',v=>d.activity=v);
    wire(()=>{step++;show();});
  }
  function wGoal(){
    const sync=()=>{const tf=$('targetField');if(tf)tf.style.display=(d.goal==='lose'||d.goal==='gain')?'block':'none';const pf=$('paceField');if(pf)pf.style.display=(d.goal==='maintain')?'none':'block';};
    screen.innerHTML=`<div style="padding:0 4px">${bar()}
      <h1 class="h1">What's the<br/>goal?</h1><p class="sub" style="margin:10px 0 24px">You can change this anytime.</p>
      <div class="seg stack" id="goalSeg">${Object.entries(GOALS).map(([k,g])=>`<button data-v="${k}" class="${d.goal===k?'on':''}"><span class="opt-t">${g.t}</span><span class="opt-d">${g.d}</span></button>`).join('')}</div>
      <div class="field" id="paceField" style="display:none;margin-top:18px"><span class="label">Pace</span><div class="seg" id="paceSeg">
        <button data-v="relaxed" class="${d.pace==='relaxed'?'on':''}">Relaxed</button><button data-v="steady" class="${d.pace==='steady'?'on':''}">Steady</button><button data-v="aggressive" class="${d.pace==='aggressive'?'on':''}">Aggressive</button></div></div>
      <div class="field" id="targetField" style="display:none"><span class="label">Target weight · kg (optional)</span><input id="target" type="number" inputmode="decimal" placeholder="e.g. 65" value="${d.target||''}"></div>
      ${navBtns('See my plan',true)}</div>`;
    $('goalSeg').onclick=e=>pick(e,'goalSeg',v=>{d.goal=v;sync();});
    $('paceSeg').onclick=e=>pick(e,'paceSeg',v=>d.pace=v);
    sync();
    wire(()=>{d.target=(d.goal==='lose'||d.goal==='gain')&&+$('target').value?+$('target').value:null;if(d.goal==='maintain')d.pace='steady';step++;show();});
  }
  function wPlan(){
    const t=calc(d);
    const proj=t.adj?`${t.adj<0?'Lose':'Gain'} ≈ <b>${t.weeklyKg.toFixed(2)} kg</b> / week${t.weeks?` · reach ${d.target} kg in ~<b>${t.weeks} weeks</b>`:''}`:'Holding your current weight';
    screen.innerHTML=`<div style="padding:0 4px">${bar()}
      <div class="orb" style="margin-top:6px">🎯</div>
      <h1 class="h1" style="text-align:center">Your daily plan</h1>
      <p class="sub" style="text-align:center;margin:10px auto 22px;max-width:300px">${GOALS[d.goal].t} · ${proj}</p>
      <div class="ringcard"><div style="font-family:'Newsreader',serif;font-weight:500;font-size:64px;line-height:1">${t.target.toLocaleString('en-IN')}</div>
      <div class="sub" style="margin-top:2px">calories per day</div></div>
      <div class="macros" style="margin-top:24px">
        <div class="mchip"><div class="mv">${t.protein}<span style="font-size:12px;color:var(--grey)">g</span></div><div class="ml">Protein</div></div>
        <div class="mchip"><div class="mv">${t.carbs}<span style="font-size:12px;color:var(--grey)">g</span></div><div class="ml">Carbs</div></div>
        <div class="mchip"><div class="mv">${t.fat}<span style="font-size:12px;color:var(--grey)">g</span></div><div class="ml">Fat</div></div>
      </div>
      <div class="section"><div class="info-card"><div><div class="label" style="margin-bottom:3px">Maintenance</div><div class="sub" style="font-size:13px">Your BMI is ${t.bmi}</div></div><div class="v">${t.maintenance.toLocaleString('en-IN')}</div></div></div>
      ${navBtns(edit?'Save plan':'Start tracking',true)}</div>`;
    wire(()=>{
      const firstWeight=!state.weights||state.weights.length===0;
      state.profile=d;
      if(firstWeight)state.weights=[{date:todayKey(),kg:d.weight}];
      state.tab='today';state.viewDate=todayKey();save();render();
    });
  }
  show();
}
