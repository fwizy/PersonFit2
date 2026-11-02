export const GROUPS=['peito','costas','tríceps','pernas','bíceps','ombros'];
export const EQUIPMENT=['halteres','barra','máquinas','polia','barra fixa'];
export const GOALS={mass:['Ganhar massa muscular','Foco no desenvolvimento dos músculos.'],strength:['Ganhar força','Foco em melhorar a capacidade de levantar cargas.'],fitness:['Melhorar o condicionamento','Foco em resistência e disposição para o esforço.']};
export const uid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function dateAdd(s,n){let d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return localDate(d)}
export function defaultGroups(n){return n===1?[GROUPS.slice()]:n===2?[['peito','costas','tríceps','bíceps','ombros'],['pernas']]:n===3?[['peito','ombros','tríceps'],['costas','bíceps'],['pernas']]:n===4?[['peito','tríceps'],['costas','bíceps'],['pernas'],['ombros','peito']]:n===5?[['peito','tríceps'],['costas','bíceps'],['pernas'],['ombros'],['pernas','costas']]:[['peito','tríceps'],['costas','bíceps'],['pernas'],['ombros','peito'],['costas','bíceps'],['pernas']];}
export function prescription(p){return p.goal==='strength'?{sets:p.experience==='new'?3:4,reps:'5–8',rest:120}:p.goal==='fitness'?{sets:2,reps:'12–15',rest:45}:{sets:3,reps:'8–12',rest:75}}
export function minutes(exs){return Math.ceil(5+exs.reduce((s,e)=>{let ns=e.reps.match(/\d+/g)?.map(Number)||[10];let avg=ns.reduce((a,b)=>a+b,0)/ns.length;return s+e.sets*(avg*3+e.rest)/60+1},0))}
export function candidates(p,lib){return lib.filter(e=>p.equipment.includes(e.equipment)&&e.complexity<=(p.experience==='new'?1:2)&&!(p.excluded||[]).includes(e.id))}
export function generate(p,lib,today=localDate()){
 if(!GOALS[p.goal]||!p.equipment.length)throw Error('Escolha um objetivo e pelo menos um equipamento.');
 if(!Number.isInteger(p.days)||p.days<1||p.days>6)throw Error('Escolha de 1 a 6 dias por semana.');
 let base=defaultGroups(p.days), av=candidates(p,lib), pres=prescription(p);
 if(p.division==='muscle'){base=p.groups;if(!Array.isArray(base)||base.length!==p.days)throw Error('Revise os grupos de cada dia.');let missing=GROUPS.filter(g=>!base.flat().includes(g));if(missing.length)throw Error('Inclua na divisão: '+missing.join(', ')+'.');}
 let patterns;
 if(p.division==='movement'&&p.days>=3)patterns=[{name:'Empurrar',groups:['peito','ombros','tríceps'],movement:'empurrar'},{name:'Puxar',groups:['costas','bíceps','ombros'],movement:'puxar'},{name:'Pernas',groups:['pernas'],movement:'pernas'}];
 else patterns=base.map((groups,i)=>({name:p.days===1?'Corpo inteiro':groups.map(g=>g[0].toUpperCase()+g.slice(1)).join(' + '),groups}));
 let templates=patterns.map((pattern,i)=>{
  let pool=av.filter(e=>pattern.groups.includes(e.group)&&(!pattern.movement||e.movement===pattern.movement));
  let required=pattern.groups.filter(g=>g!=='ombros'||pattern.movement!=='puxar');
  let missing=required.filter(g=>!pool.some(e=>e.group===g));if(missing.length)throw Error(`${pattern.name}: não há demonstrações compatíveis para ${missing.join(', ')} com seus equipamentos e exclusões. Ajuste os equipamentos ou a divisão.`);
  let count=p.count==='auto'?Math.min(6,Math.max(3,Math.floor((p.time-5)/(pres.sets*((p.goal==='strength'?6.5:p.goal==='fitness'?13.5:10)*3+pres.rest)/60+1)))):Number(p.count);
  if(p.count==='auto')count=Math.min(pool.length,Math.max(count,required.length));
  if(count<required.length)throw Error(`${pattern.name} precisa de pelo menos ${required.length} exercícios para incluir todos os grupos escolhidos. Aumente a quantidade ou distribua em mais dias.`);
  if(count>pool.length)throw Error(`${pattern.name}: há ${pool.length} exercícios compatíveis. Escolha até ${pool.length}, amplie os equipamentos ou combine grupos.`);
  let selected=required.map(g=>pool.find(e=>e.group===g));
  let rest=pool.filter(e=>!selected.includes(e));
  // Round-robin remaining groups avoids filling a session with one group only.
  while(selected.length<count){for(let g of pattern.groups){let e=rest.find(e=>e.group===g);if(e&&selected.length<count){selected.push(e);rest=rest.filter(a=>a!==e)}}}
  let exercises=selected.map(e=>({id:e.id,...pres}));let duration=minutes(exercises);
  if(duration>p.time)throw Error(`${pattern.name}: ${count} exercícios levam cerca de ${duration} min com estes descansos. Aumente o tempo para ${duration} min ou reduza a quantidade.`);
  return {id:uid(),name:pattern.name,groups:pattern.groups,exercises,duration};
 });
 let offsets={1:[0],2:[0,3],3:[0,2,4],4:[0,1,3,5],5:[0,1,2,4,5],6:[0,1,2,3,4,5]}[p.days],index=0,calendar=[];
 for(let n=0;n<28;n++){let train=offsets.includes(n%7);calendar.push({date:dateAdd(today,n),templateId:train?templates[index++%templates.length].id:null})}
 if(p.division==='muscle'){let training=calendar.filter(d=>d.templateId);for(let i=1;i<training.length;i++){let prev=training[i-1],next=training[i];if(dateAdd(prev.date,1)===next.date){let a=templates.find(t=>t.id===prev.templateId),b=templates.find(t=>t.id===next.templateId),overlap=a.groups.filter(g=>b.groups.includes(g));if(overlap.length)throw Error(`Os dias ${a.name} e ${b.name} repetem ${overlap.join(', ')} em dias seguidos. Redistribua esses grupos na etapa Divisão ou restaure a sugestão.`)}}}
 return {id:uid(),createdAt:today,templates,calendar,version:1};
}
export function parseLoad(s){if(s==='')return '';if(!/^\d{1,4}([,.]\d{0,2})?$/.test(s))throw Error('Use um valor de 0 a 9999,99 kg.');return Number(s.replace(',','.'))}
export function newSession(plan,day,template){return {id:uid(),planId:plan.id,date:day.date,name:template.name,templateId:template.id,startedAt:null,finishedAt:null,exercises:template.exercises.map(e=>({...e,done:false,load:'',bodyweight:false,setsLoads:Array(e.sets).fill('')}))}}
export function validateBackup(b,lib){
 const fail=()=>{throw Error('Backup inválido ou incompatível. Nenhum dado foi alterado.')};
 if(!b||b.schema!==1||!Array.isArray(b.sessions)||b.sessions.length>20000||!['system','light','dark'].includes(b.theme))fail();
 let ids=new Set(lib.map(e=>e.id));const checkEx=e=>{if(!e||!ids.has(e.id)||!Number.isInteger(e.sets)||e.sets<1||e.sets>8||typeof e.reps!=='string'||!/^\d{1,2}(?:[–-]\d{1,2})?$/.test(e.reps)||!Number.isFinite(e.rest)||e.rest<15||e.rest>600)fail()};
 if(b.profile){let p=b.profile;if(!GOALS[p.goal]||!['new','regular','advanced'].includes(p.experience)||!Number.isInteger(p.days)||p.days<1||p.days>6||![30,45,60,75,90].includes(p.time)||!['movement','muscle'].includes(p.division)||!Array.isArray(p.equipment)||!p.equipment.every(e=>EQUIPMENT.includes(e))||!(p.count==='auto'||Number.isInteger(+p.count)&&+p.count>=3&&+p.count<=10))fail();}
 const dateOk=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(s+'T12:00:00'));
 const safeId=s=>typeof s==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(s);let seen=new Set();for(let s of b.sessions){if(!s||!safeId(s.id)||seen.has(s.id)||!dateOk(s.date)||typeof s.name!=='string'||s.name.length>300||!Array.isArray(s.exercises)||s.exercises.length>20)fail();seen.add(s.id);s.exercises.forEach(e=>{checkEx(e);if(typeof e.done!=='boolean'||typeof e.bodyweight!=='boolean'||!Array.isArray(e.setsLoads)||e.setsLoads.length!==e.sets)fail();for(let n of [e.load,...e.setsLoads])if(n!==''&&(typeof n!=='number'||n<0||n>9999.99||!Number.isFinite(n)))fail()});if(s.startedAt!==null&&!Number.isFinite(Date.parse(s.startedAt)))fail();if(s.finishedAt!==null&&!Number.isFinite(Date.parse(s.finishedAt)))fail()}
 if(b.plan){let p=b.plan;if(!safeId(p.id)||!Array.isArray(p.templates)||!p.templates.length||p.templates.length>6||!Array.isArray(p.calendar)||p.calendar.length!==28)fail();for(let t of p.templates){if(!safeId(t.id)||typeof t.name!=='string'||t.name.length>300||!Array.isArray(t.exercises)||t.exercises.length<1||t.exercises.length>10)fail();t.exercises.forEach(checkEx)}for(let d of p.calendar)if(!dateOk(d.date)||d.templateId!==null&&!p.templates.some(t=>t.id===d.templateId))fail()}
 if(b.profile){let p=b.profile;if(typeof p.restrictions!=='string'||p.restrictions.length>1000||!Array.isArray(p.excluded)||!p.excluded.every(id=>ids.has(id))||!Array.isArray(p.groups)||p.groups.length!==p.days||!p.groups.every(gs=>Array.isArray(gs)&&gs.every(g=>GROUPS.includes(g))))fail()}
 if(b.sessions.some(s=>!s.finishedAt&&(!b.plan||s.planId!==b.plan.id||!b.plan.calendar.some(d=>d.date===s.date&&d.templateId===s.templateId))))fail();
 return JSON.parse(JSON.stringify({schema:1,profile:b.profile||null,plan:b.plan||null,sessions:b.sessions,theme:b.theme}));
}
export function resetPlan(state,reuse=true){return {...state,profile:reuse?state.profile:null,plan:null,sessions:state.sessions.filter(s=>s.finishedAt)}}
