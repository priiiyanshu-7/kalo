/* ============================================================
   Daily — auth screen (Google sign-in)
   Shown only when Supabase is configured and no user is signed in.
   ============================================================ */
function renderAuth(){
  fnav.style.display='none';
  screen.innerHTML=`<div class="authwrap">
    <div class="orb">🔥</div>
    <h1 class="h1">Daily.</h1>
    <p class="sub" style="margin:14px auto 0;max-width:300px">Your calories, protein and workouts — synced to your account, on every device.</p>
    <div style="margin:34px 0 0">
      <button class="gbtn" id="gsignin">${GOOGLE_SVG} Continue with Google</button>
    </div>
    <p class="sub" style="font-size:12px;margin-top:18px">By continuing you agree this is an estimate tool,<br/>not medical advice.</p>
    <button class="ghost" id="localOnly" style="margin-top:10px">Continue without an account</button>
  </div>`;
  $('gsignin').onclick=async()=>{
    $('gsignin').innerHTML=`<span class="spin"></span> Redirecting…`;$('gsignin').disabled=true;
    try{await cloudSignInGoogle();}catch(e){alert('Could not start Google sign-in. If you are opening the file directly, host it over http(s) first.');$('gsignin').disabled=false;$('gsignin').innerHTML=`${GOOGLE_SVG} Continue with Google`;}
  };
  $('localOnly').onclick=()=>{ guestMode=true; state=loadLocal()||fresh(); state.viewDate=todayKey(); render(); };
}
