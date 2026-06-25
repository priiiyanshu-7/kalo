/* ============================================================
   Daily — app state, persistence & per-day helpers
   Local persistence is always on (localStorage cache). When the
   user is signed in to Supabase, save() also syncs to the cloud
   (see cloud.js). State is one JSON blob per user.
   ============================================================ */
const SKEY='daily.v2';
const fresh=()=>({profile:null,days:{},weights:[],tab:'today',viewDate:null});
let state=fresh();

function migrate(s){
  if(!s||typeof s!=='object')return null;
  s.days=s.days||{};s.weights=s.weights||[];s.tab=s.tab||'today';
  return s;
}
/* cache key is per-account so two Google accounts on one device never mix */
function localKey(){return (typeof currentUser!=='undefined' && currentUser && currentUser.id) ? SKEY+'.'+currentUser.id : SKEY;}
function loadLocal(){try{return migrate(JSON.parse(localStorage.getItem(localKey())));}catch(e){return null;}}
function saveLocal(s){try{localStorage.setItem(localKey(),JSON.stringify(s));}catch(e){}}

/* save = local immediately, cloud debounced (if signed in) */
function save(){saveLocal(state);if(typeof cloudPush==='function')cloudPush();}

/* ---- date helpers ---- */
const dkey=d=>{const z=new Date(d);z.setMinutes(z.getMinutes()-z.getTimezoneOffset());return z.toISOString().slice(0,10);};
const todayKey=()=>dkey(new Date());
const viewKey=()=>state.viewDate||todayKey();
const isViewingToday=()=>viewKey()===todayKey();

/* ---- per-day record (today's log/exercises/water live here) ---- */
function dayRec(key=viewKey()){
  const d=state.days[key]||(state.days[key]={});
  if(!d.log)d.log=[];
  if(!d.exercises)d.exercises=[];
  if(d.water==null)d.water=0;
  return d;
}
const hasActivity=r=>!!(r&&((r.log&&r.log.length)||(r.exercises&&r.exercises.length)));

function shiftDay(n){
  const d=new Date(viewKey());d.setDate(d.getDate()+n);
  const k=dkey(d);
  if(k>todayKey())return;            // never go past today
  state.viewDate=k;render();
}
function goToday(){state.viewDate=todayKey();render();}

/* ---- diet helpers ---- */
const canEat=foodDiet=>{const pref=state.profile.diet;if(pref==='nonveg')return true;if(pref==='egg')return foodDiet==='veg'||foodDiet==='egg';return foodDiet==='veg';};
const dietColor=d=>d==='nonveg'?'var(--clay)':d==='egg'?'var(--egg)':'var(--leaf)';

/* fill carbs/fat when a custom or AI item is missing them */
function fillMacros(it){
  const cal=+it.cal||0,p=+it.p||+it.protein||0;
  if(it.fat==null)it.fat=Math.max(Math.round(Math.max(cal-p*4,0)*0.3/9),0);
  if(it.c==null)it.c=Math.max(Math.round((cal-p*4-it.fat*9)/4),0);
  it.p=p;return it;
}

/* daily water goal in 250ml glasses, from body weight */
function waterGoal(){return Math.min(Math.max(Math.round((state.profile.weight*35)/250),6),12);}
