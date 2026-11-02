const SHELL='personfit-shell-v1',MEDIA='personfit-media-v1';
const FILES=['./','./index.html','./app.js','./core.js','./style.css','./library.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./ATTRIBUTIONS.md'];
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith((async()=>{let u=new URL(e.request.url),isMedia=u.pathname.includes('/media/');
 if(isMedia){let c=await caches.open(MEDIA),r=await c.match(e.request.url);if(!r)return fetch(e.request);let range=e.request.headers.get('Range');if(!range)return r;let b=await r.arrayBuffer(),m=/bytes=(\d*)-(\d*)/.exec(range);if(!m)return new Response(null,{status:416});let start=m[1]?Number(m[1]):Math.max(0,b.byteLength-Number(m[2])),end=m[1]?(m[2]?Math.min(Number(m[2]),b.byteLength-1):b.byteLength-1):b.byteLength-1;if(start>=b.byteLength||start>end)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${b.byteLength}`}});return new Response(b.slice(start,end+1),{status:206,headers:{'Content-Type':r.headers.get('Content-Type')||'video/mp4','Content-Range':`bytes ${start}-${end}/${b.byteLength}`,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}})}
 let c=await caches.open(SHELL);if(e.request.mode==='navigate'){try{return await fetch(e.request)}catch{return await c.match(new URL('./index.html',self.registration.scope))||Response.error()}}
 return await c.match(e.request)||fetch(e.request);
 })());
});
