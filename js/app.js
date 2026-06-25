/* ============================================================
   Daily — app bootstrap, router, auth session & PWA install
   ============================================================ */
let guestMode=false;   // chose "continue without account" in this session

/* ---- router ---- */
function render(){
  // gate: cloud configured + not signed in + not a guest → auth screen
  if(CLOUD && !currentUser && !guestMode){ return renderAuth(); }
  if(state.profile)save();
  if(!state.profile){ fnav.style.display='none'; return onboarding(); }
  fnav.style.display='flex';
  [...fnav.children].forEach(b=>b.classList.toggle('on',b.dataset.tab===state.tab));
  if(state.tab==='today')renderToday();
  else if(state.tab==='train')renderTrain();
  else if(state.tab==='streak')renderStreak();
  else renderYou();
}
fnav.onclick=e=>{const b=e.target.closest('button');if(!b)return;state.tab=b.dataset.tab;if(b.dataset.tab!=='today'&&b.dataset.tab!=='train')state.viewDate=todayKey();render();screen.scrollTop=0;};

/* ---- PWA: install prompt + service worker ---- */
window.deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.deferredPrompt=e;if(state.profile&&state.tab==='you')render();});
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

/* ---- auth session handling ---- */
async function applySession(session){
  currentUser=session?session.user:null;
  if(currentUser){
    guestMode=false;
    let cloud=null;
    try{cloud=await cloudPull();}catch(e){}
    const local=loadLocal();
    state=cloud||local||fresh();
    state.viewDate=todayKey();
    saveLocal(state);
    if(!cloud&&local&&local.profile){cloudSaveNow().catch(()=>{});} // first cloud write from local data
  }
  render();
}

async function boot(){
  const ready=initCloud();
  if(ready){
    try{
      const {data}=await sb.auth.getSession();
      sb.auth.onAuthStateChange((_evt,session)=>{applySession(session);});
      await applySession(data?data.session:null);
    }catch(e){
      // cloud failed → fall back to local
      CLOUD=false;state=loadLocal()||fresh();state.viewDate=todayKey();render();
    }
  }else{
    // local-only mode
    state=loadLocal()||fresh();state.viewDate=todayKey();render();
  }
}

boot();
