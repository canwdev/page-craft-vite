import{d as P,Z as l,ay as X,a2 as Y,aa as y,bM as Z,ad as S,bN as q,ab as C,a8 as I,r as O,a4 as W,n as k,af as $,ai as M,o as J,aF as D,m as Q,w as U,aH as ee,am as te,bj as ne,bO as oe,bP as se,al as N,bQ as re,ah as ae,as as ie,bR as le,bS as ce,ac as V,bh as de,aw as ue,B as fe,bT as he,aB as ve,b as pe,c as ge,y as me,C as be,J as ye,b4 as ze}from"./index-mqCekWp6.js";const xe=P({name:"ArrowBack",render(){return l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},l("path",{d:"M0 0h24v24H0V0z",fill:"none"}),l("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),Se=X&&"loading"in document.createElement("img"),ke=(e={})=>{var a;const{root:s=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(a=e.threshold)!==null&&a!==void 0?a:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof s=="string"?document.querySelector(s):s)||document.documentElement})}},L=new WeakMap,T=new WeakMap,F=new WeakMap,_e=(e,a,s)=>{if(!e)return()=>{};const o=ke(a),{root:i}=o.options;let t;const f=L.get(i);f?t=f:(t=new Map,L.set(i,t));let c,r;t.has(o.hash)?(r=t.get(o.hash),r[1].has(e)||(c=r[0],r[1].add(e),c.observe(e))):(c=new IntersectionObserver(g=>{g.forEach(v=>{if(v.isIntersecting){const p=T.get(v.target),b=F.get(v.target);p&&p(),b&&(b.value=!0)}})},o.options),c.observe(e),r=[c,new Set([e])],t.set(o.hash,r));let u=!1;const h=()=>{u||(T.delete(e),F.delete(e),u=!0,r[1].has(e)&&(r[0].unobserve(e),r[1].delete(e)),r[1].size<=0&&t.delete(o.hash),t.size||L.delete(i))};return T.set(e,h),F.set(e,s),h},we=Y("n-avatar-group"),Re=y("avatar",`
 width: var(--n-merged-size);
 height: var(--n-merged-size);
 color: #FFF;
 font-size: var(--n-font-size);
 display: inline-flex;
 position: relative;
 overflow: hidden;
 text-align: center;
 border: var(--n-border);
 border-radius: var(--n-border-radius);
 --n-merged-color: var(--n-color);
 background-color: var(--n-merged-color);
 transition:
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[Z(S("&","--n-merged-color: var(--n-color-modal);")),q(S("&","--n-merged-color: var(--n-color-popover);")),S("img",`
 width: 100%;
 height: 100%;
 `),C("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),y("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),C("text","line-height: 1.25")]),Ce=Object.assign(Object.assign({},$.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Fe=P({name:"Avatar",props:Ce,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:s}=I(e),o=O(!1);let i=null;const t=O(null),f=O(null),c=()=>{const{value:n}=t;if(n&&(i===null||i!==n.innerHTML)){i=n.innerHTML;const{value:d}=f;if(d){const{offsetWidth:m,offsetHeight:w}=d,{offsetWidth:x,offsetHeight:B}=n,E=.9,j=Math.min(m/x*E,w/B*E,1);n.style.transform=`translateX(-50%) translateY(-50%) scale(${j})`}}},r=W(we,null),u=k(()=>{const{size:n}=e;if(n)return n;const{size:d}=r||{};return d||"medium"}),h=$("Avatar","-avatar",Re,oe,e,a),g=W(se,null),v=k(()=>{if(r)return!0;const{round:n,circle:d}=e;return n!==void 0||d!==void 0?n||d:g?g.roundRef.value:!1}),p=k(()=>r?!0:e.bordered||!1),b=k(()=>{const n=u.value,d=v.value,m=p.value,{color:w}=e,{self:{borderRadius:x,fontSize:B,color:E,border:j,colorModal:A,colorPopover:K},common:{cubicBezierEaseInOut:G}}=h.value;let H;return typeof n=="number"?H=`${n}px`:H=h.value.self[N("height",n)],{"--n-font-size":B,"--n-border":m?j:"none","--n-border-radius":d?"50%":x,"--n-color":w||E,"--n-color-modal":w||A,"--n-color-popover":w||K,"--n-bezier":G,"--n-merged-size":`var(--n-avatar-size-override, ${H})`}}),z=s?M("avatar",k(()=>{const n=u.value,d=v.value,m=p.value,{color:w}=e;let x="";return n&&(typeof n=="number"?x+=`a${n}`:x+=n[0]),d&&(x+="b"),m&&(x+="c"),w&&(x+=re(w)),x}),b,e):void 0,_=O(!e.lazy);J(()=>{if(e.lazy&&e.intersectionObserverOptions){let n;const d=D(()=>{n==null||n(),n=void 0,e.lazy&&(n=_e(f.value,e.intersectionObserverOptions,_))});Q(()=>{d(),n==null||n()})}}),U(()=>{var n;return e.src||((n=e.imgProps)===null||n===void 0?void 0:n.src)},()=>{o.value=!1});const R=O(!e.lazy);return{textRef:t,selfRef:f,mergedRoundRef:v,mergedClsPrefix:a,fitTextTransform:c,cssVars:s?void 0:b,themeClass:z==null?void 0:z.themeClass,onRender:z==null?void 0:z.onRender,hasLoadError:o,shouldStartLoading:_,loaded:R,mergedOnError:n=>{if(!_.value)return;o.value=!0;const{onError:d,imgProps:{onError:m}={}}=e;d==null||d(n),m==null||m(n)},mergedOnLoad:n=>{const{onLoad:d,imgProps:{onLoad:m}={}}=e;d==null||d(n),m==null||m(n),R.value=!0}}},render(){var e,a;const{$slots:s,src:o,mergedClsPrefix:i,lazy:t,onRender:f,loaded:c,hasLoadError:r,imgProps:u={}}=this;f==null||f();let h;const g=!c&&!r&&(this.renderPlaceholder?this.renderPlaceholder():(a=(e=this.$slots).placeholder)===null||a===void 0?void 0:a.call(e));return this.hasLoadError?h=this.renderFallback?this.renderFallback():ee(s.fallback,()=>[l("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):h=te(s.default,v=>{if(v)return l(ne,{onResize:this.fitTextTransform},{default:()=>l("span",{ref:"textRef",class:`${i}-avatar__text`},v)});if(o||u.src){const p=this.src||u.src;return l("img",Object.assign(Object.assign({},u),{loading:Se&&!this.intersectionObserverOptions&&t?"lazy":"eager",src:t&&this.intersectionObserverOptions?this.shouldStartLoading?p:void 0:p,"data-image-src":p,onLoad:this.mergedOnLoad,onError:this.mergedOnError,style:[u.style||"",{objectFit:this.objectFit},g?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),l("span",{ref:"selfRef",class:[`${i}-avatar`,this.themeClass],style:this.cssVars},h,t&&g)}}),Oe=S([y("page-header-header",`
 margin-bottom: 20px;
 `),y("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[C("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),C("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[S("&:hover","color: var(--n-back-color-hover);"),S("&:active","color: var(--n-back-color-pressed);")]),C("avatar",`
 display: flex;
 margin-right: 12px
 `),C("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),C("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),y("page-header-content",`
 font-size: var(--n-font-size);
 `,[S("&:not(:first-child)","margin-top: 20px;")]),y("page-header-footer",`
 font-size: var(--n-font-size);
 `,[S("&:not(:first-child)","margin-top: 20px;")])]),$e=Object.assign(Object.assign({},$.props),{title:String,subtitle:String,extra:String,onBack:Function}),Ie=P({name:"PageHeader",props:$e,setup(e){const{mergedClsPrefixRef:a,mergedRtlRef:s,inlineThemeDisabled:o}=I(e),i=$("PageHeader","-page-header",Oe,le,e,a),t=ae("PageHeader",s,a),f=k(()=>{const{self:{titleTextColor:r,subtitleTextColor:u,backColor:h,fontSize:g,titleFontSize:v,backSize:p,titleFontWeight:b,backColorHover:z,backColorPressed:_},common:{cubicBezierEaseInOut:R}}=i.value;return{"--n-title-text-color":r,"--n-title-font-size":v,"--n-title-font-weight":b,"--n-font-size":g,"--n-back-size":p,"--n-subtitle-text-color":u,"--n-back-color":h,"--n-back-color-hover":z,"--n-back-color-pressed":_,"--n-bezier":R}}),c=o?M("page-header",void 0,f,e):void 0;return{rtlEnabled:t,mergedClsPrefix:a,cssVars:o?void 0:f,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender}},render(){var e;const{onBack:a,title:s,subtitle:o,extra:i,mergedClsPrefix:t,cssVars:f,$slots:c}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:r,subtitle:u,extra:h,default:g,header:v,avatar:p,footer:b,back:z}=c,_=a,R=s||r,n=o||u,d=i||h;return l("div",{style:f,class:[`${t}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${t}-page-header-wrapper--rtl`]},v?l("div",{class:`${t}-page-header-header`,key:"breadcrumb"},v()):null,(_||p||R||n||d)&&l("div",{class:`${t}-page-header`,key:"header"},l("div",{class:`${t}-page-header__main`,key:"back"},_?l("div",{class:`${t}-page-header__back`,onClick:a},z?z():l(ie,{clsPrefix:t},{default:()=>l(xe,null)})):null,p?l("div",{class:`${t}-page-header__avatar`},p()):null,R?l("div",{class:`${t}-page-header__title`,key:"title"},s||r()):null,n?l("div",{class:`${t}-page-header__subtitle`,key:"subtitle"},o||u()):null),d?l("div",{class:`${t}-page-header__extra`},i||h()):null),g?l("div",{class:`${t}-page-header-content`,key:"content"},g()):null,b?l("div",{class:`${t}-page-header-footer`,key:"footer"},b()):null)}}),Pe=S([S("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),y("spin-container",`
 position: relative;
 `,[y("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[ce()])]),y("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),y("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[V("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),y("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),y("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[V("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),Ee={small:20,medium:18,large:16},Be=Object.assign(Object.assign({},$.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),Me=P({name:"Spin",props:Be,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:s}=I(e),o=$("Spin","-spin",Pe,he,e,a),i=k(()=>{const{size:r}=e,{common:{cubicBezierEaseInOut:u},self:h}=o.value,{opacitySpinning:g,color:v,textColor:p}=h,b=typeof r=="number"?ve(r):h[N("size",r)];return{"--n-bezier":u,"--n-opacity-spinning":g,"--n-size":b,"--n-color":v,"--n-text-color":p}}),t=s?M("spin",k(()=>{const{size:r}=e;return typeof r=="number"?String(r):r[0]}),i,e):void 0,f=de(e,["spinning","show"]),c=O(!1);return D(r=>{let u;if(f.value){const{delay:h}=e;if(h){u=window.setTimeout(()=>{c.value=!0},h),r(()=>{clearTimeout(u)});return}}c.value=f.value}),{mergedClsPrefix:a,active:c,mergedStrokeWidth:k(()=>{const{strokeWidth:r}=e;if(r!==void 0)return r;const{size:u}=e;return Ee[typeof u=="number"?"medium":u]}),cssVars:s?void 0:i,themeClass:t==null?void 0:t.themeClass,onRender:t==null?void 0:t.onRender}},render(){var e,a;const{$slots:s,mergedClsPrefix:o,description:i}=this,t=s.icon&&this.rotate,f=(i||s.description)&&l("div",{class:`${o}-spin-description`},i||((e=s.description)===null||e===void 0?void 0:e.call(s))),c=s.icon?l("div",{class:[`${o}-spin-body`,this.themeClass]},l("div",{class:[`${o}-spin`,t&&`${o}-spin--rotate`],style:s.default?"":this.cssVars},s.icon()),f):l("div",{class:[`${o}-spin-body`,this.themeClass]},l(ue,{clsPrefix:o,style:s.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${o}-spin`}),f);return(a=this.onRender)===null||a===void 0||a.call(this),s.default?l("div",{class:[`${o}-spin-container`,this.themeClass],style:this.cssVars},l("div",{class:[`${o}-spin-content`,this.active&&`${o}-spin-content--spinning`,this.contentClass],style:this.contentStyle},s),l(fe,{name:"fade-in-transition"},{default:()=>this.active?c:null})):c}}),je=P({name:"DropZone",props:{text:{type:String,default:""},positionFixed:{type:Boolean,default:!1}}}),He={class:"border-dashed"};function Le(e,a,s,o,i,t){return ge(),me("div",{class:ze(["file-dropzone",{"position-fixed":e.positionFixed}])},[be("div",He,ye(e.text||e.$t("msgs.drop_files_here")),1)],2)}const We=pe(je,[["render",Le],["__scopeId","data-v-0861eaf5"]]),Ve=e=>new Promise((a,s)=>{if(document.getElementById(e))a();else{const i=document.createElement("script");i.src=e,i.id=e,i.onload=function(){this.onerror=this.onload=null,a()},i.onerror=function(t){this.onerror=this.onload=null,s(t)},document.body.appendChild(i)}}),De=({cbFiles:e,cb:a})=>{const s=O(!1);return{showDropzone:s,fileDragover(o){s.value=!0,o.preventDefault()},async fileDrop(o){o.preventDefault(),s.value=!1,typeof a=="function"&&a(o);const i=Array.from(o.dataTransfer.files);typeof e=="function"&&e(i)}}};export{We as _,Fe as a,Ie as b,Me as c,Ve as d,De as u};
