/* ============================================================
   Daily — app bootstrap, router, auth session & PWA install
   ============================================================ */
let guestMode=false;   // chose "continue without account" in this session

/* ---- router ---- */
function hideSplash(){const s=document.getElementById('splash');if(s&&!s.classList.contains('hide')){s.classList.add('hide');setTimeout(()=>s.remove(),600);}}

function render(){
  const fab=$('fab');
  screen.classList.remove('anim');void screen.offsetWidth;screen.classList.add('anim'); // retrigger fade-in
  // gate: cloud configured + not signed in + not a guest → auth screen
  if(CLOUD && !currentUser && !guestMode){ if(fab)fab.style.display='none'; return renderAuth(); }
  if(state.profile)save();
  if(!state.profile){ fnav.style.display='none'; if(fab)fab.style.display='none'; return onboarding(); }
  fnav.style.display='flex';
  [...fnav.children].forEach(b=>b.classList.toggle('on',b.dataset.tab===state.tab));
  if(state.tab==='today')renderToday();
  else if(state.tab==='train')renderTrain();
  else if(state.tab==='streak')renderStreak();
  else renderYou();
  // floating + : opens a chooser (food or workout)
  if(fab){
    if(state.tab==='today'||state.tab==='train'){fab.style.display='flex';fab.onclick=openAddSheet;}
    else fab.style.display='none';
  }
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
    // cloud is the source of truth; else fall back ONLY to this account's own cache,
    // else a clean slate (→ onboarding). Never inherit another account's data.
    state=cloud||loadLocal()||fresh();
    state.viewDate=todayKey();
    saveLocal(state);
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
  setTimeout(hideSplash,650);
}

boot();
