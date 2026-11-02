import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('dist/library.json','utf8'));
for(const e of data){for(const k of ['id','name','group','equipment','instructions','source','license','author','media','poster'])if(!e[k])throw Error(`${e.id}: missing ${k}`);for(const k of ['media','poster'])if(!fs.existsSync(`dist/${e[k]}`))throw Error(`Missing ${e[k]}`);if(!e.alternatives.every(id=>data.some(a=>a.id===id&&a.group===e.group)))throw Error('Invalid alternative');}
for(const f of ['index.html','app.js','core.js','style.css','sw.js','manifest.webmanifest','icon-192.png','icon-512.png'])if(!fs.existsSync('dist/'+f))throw Error('Missing '+f);
console.log(`PersonFit: ${data.length} exercícios, mídias, alternativas e arquivos PWA verificados.`);
