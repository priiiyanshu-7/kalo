/* ============================================================
   Daily — Supabase cloud layer (Google sign-in + sync)
   • One row per user in table `app_state` (jsonb blob).
   • If config keys are missing, CLOUD stays false and the app
     runs purely on localStorage (still fully functional).
   ============================================================ */
let sb=null, CLOUD=false, currentUser=null, _syncTimer=null;

function cloudConfigured(){
  const c=window.DAILY_CONFIG||{};
  return c.SUPABASE_URL && !c.SUPABASE_URL.includes('PASTE') &&
         c.SUPABASE_ANON_KEY && !c.SUPABASE_ANON_KEY.includes('PASTE');
}
function initCloud(){
  if(!cloudConfigured()||!window.supabase){CLOUD=false;return false;}
  try{
    sb=window.supabase.createClient(window.DAILY_CONFIG.SUPABASE_URL,window.DAILY_CONFIG.SUPABASE_ANON_KEY,
      {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    CLOUD=true;return true;
  }catch(e){CLOUD=false;return false;}
}

async function cloudSignInGoogle(){
  if(!CLOUD)return;
  const redirectTo=location.origin+location.pathname;
  await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo}});
}
async function cloudSignOut(){
  if(!CLOUD)return;
  await sb.auth.signOut();
}

async function cloudPull(){
  if(!CLOUD||!currentUser)return null;
  const {data,error}=await sb.from('app_state').select('data').eq('user_id',currentUser.id).maybeSingle();
  if(error)throw error;
  return data?migrate(data.data):null;
}
async function cloudSaveNow(){
  if(!CLOUD||!currentUser)return;
  const payload={user_id:currentUser.id,data:state,updated_at:new Date().toISOString()};
  await sb.from('app_state').upsert(payload,{onConflict:'user_id'});
}
/* debounced push, called from save() */
function cloudPush(){
  if(!CLOUD||!currentUser)return;
  clearTimeout(_syncTimer);
  _syncTimer=setTimeout(()=>{cloudSaveNow().catch(()=>{});},800);
}

/* current user's display info from Google metadata */
function userInfo(){
  if(!currentUser)return null;
  const m=currentUser.user_metadata||{};
  return{name:m.full_name||m.name||(currentUser.email||'').split('@')[0]||'You',
         email:currentUser.email||'',avatar:m.avatar_url||m.picture||''};
}
