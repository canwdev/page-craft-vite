if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let f={};const o=e=>n(e,c),t={module:{uri:c},exports:f,require:o};i[c]=Promise.all(s.map((e=>t[e]||o(e)))).then((e=>(r(...e),f)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.4ed16993.js",revision:null},{url:"assets/index.f0cdcfba.css",revision:null},{url:"index.html",revision:"c80b9cd8df63490999e7de543ee67a7e"},{url:"lib/juice.min.js",revision:"9511938d32392c09eca932a92a66a85f"},{url:"lib/typeface-minecraft/index.css",revision:"14a78c8456df5fda1ec75b80360cb4d5"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon.png",revision:"4c664febe29f0ca75ac519f0465be466"},{url:"favicon-192.png",revision:"508b0f5c79d2e7bfa753872b34be38b3"},{url:"favicon-512.png",revision:"4f53c8e7ff940e35bbf79b2ab9f751ab"},{url:"manifest.webmanifest",revision:"f84028eab47a050a5f821d09afe28323"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
