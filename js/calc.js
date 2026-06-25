/* ============================================================
   Daily — goal maths (BMR, targets, macros, projections)
   ============================================================ */
function calc(p){
  const bmr=10*p.weight+6.25*p.height-5*p.age+(p.sex==='male'?5:-161);
  const af={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,athlete:1.9}[p.activity]||1.55;
  const maintenance=Math.round(bmr*af);
  const delta={
    lose:{relaxed:-275,steady:-500,aggressive:-750},
    gain:{relaxed:175,steady:300,aggressive:450},
    maintain:{steady:0},
    recomp:{relaxed:-150,steady:-200,aggressive:-300},
  };
  const adj=(delta[p.goal]||{})[p.pace]??0;
  const floor=p.sex==='male'?1500:1200;
  const target=Math.max(maintenance+adj,floor);
  const ppk=p.goal==='gain'?2.0:p.goal==='recomp'?2.2:1.8;
  const protein=Math.round(p.weight*ppk);
  const fat=Math.max(Math.round(target*0.27/9),1);
  const carbs=Math.max(Math.round((target-protein*4-fat*9)/4),0);
  const weeklyKg=Math.abs(adj)*7/7700;          // ~7700 kcal per kg
  let weeks=null,toGo=null;
  if(p.target&&(p.goal==='lose'||p.goal==='gain')&&adj){
    toGo=Math.abs(p.weight-p.target);
    weeks=Math.max(Math.round(toGo*7700/(Math.abs(adj)*7)),1);
  }
  const bmi=+(p.weight/Math.pow(p.height/100,2)).toFixed(1);
  return{maintenance,target,protein,fat,carbs,adj,weeklyKg,weeks,toGo,bmi};
}

/* totals for the currently-viewed day */
const eaten=()=>{const L=dayRec().log;return{
  cal:L.reduce((s,f)=>s+f.cal*f.qty,0),
  protein:L.reduce((s,f)=>s+(f.p||0)*f.qty,0),
  carbs:L.reduce((s,f)=>s+(f.c||0)*f.qty,0),
  fat:L.reduce((s,f)=>s+(f.fat||0)*f.qty,0),
};};
const burntToday=()=>dayRec().exercises.reduce((s,e)=>s+e.burnt,0);
