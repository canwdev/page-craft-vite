import{d as u,_ as r,u as l,a as S,o as _,L as n,s as p,b as g,c as d,e as i}from"./index-0XlB2OG-.js";const m=u({name:"CraftPlayground",components:{MainPlayground:r},setup(){const s=l(),{loadCurCompStyle:e}=S();async function t(a){try{return await p(a)}catch(o){return console.error("[_sassToCSS]",o),""}}_(async()=>{const a=localStorage.getItem(n.GLOBAL_STYLE)||"";s.globalCSS=await t(a);let o=localStorage.getItem(n.VARIABLES_STYLE)||"";o=o+`
`+e(),s.currentCSS=await t(o)})}});function y(s,e,t,a,o,C){const c=r;return d(),i(c,{style:{height:"100%",overflow:"auto"}})}const L=g(m,[["render",y]]);export{L as default};