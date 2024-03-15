import{d as P,X as i,am as X,a1 as q,a2 as y,bM as U,ab as k,bN as Y,aa as O,a5 as I,r as $,ae as W,m as S,a4 as C,a8 as M,o as Q,aw as A,l as Z,w as J,ay as ee,be as te,bf as ne,bO as oe,bP as se,bh as D,bQ as re,av as ae,ac as ie,bR as le,bS as ce,a3 as V,bb as de,ak as ue,A as fe,bT as ve,aq as he,b as pe,c as ge,x as me,B as be,I as ye,a_ as ze,bU as xe}from"./index-dNtyXyiZ.js";const ke=P({name:"ArrowBack",render(){return i("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},i("path",{d:"M0 0h24v24H0V0z",fill:"none"}),i("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),Se=X&&"loading"in document.createElement("img"),_e=(e={})=>{var a;const{root:s=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(a=e.threshold)!==null&&a!==void 0?a:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof s=="string"?document.querySelector(s):s)||document.documentElement})}},H=new WeakMap,L=new WeakMap,F=new WeakMap,we=(e,a,s)=>{if(!e)return()=>{};const o=_e(a),{root:d}=o.options;let n;const f=H.get(d);f?n=f:(n=new Map,H.set(d,n));let l,r;n.has(o.hash)?(r=n.get(o.hash),r[1].has(e)||(l=r[0],r[1].add(e),l.observe(e))):(l=new IntersectionObserver(g=>{g.forEach(h=>{if(h.isIntersecting){const p=L.get(h.target),b=F.get(h.target);p&&p(),b&&(b.value=!0)}})},o.options),l.observe(e),r=[l,new Set([e])],n.set(o.hash,r));let u=!1;const v=()=>{u||(L.delete(e),F.delete(e),u=!0,r[1].has(e)&&(r[0].unobserve(e),r[1].delete(e)),r[1].size<=0&&n.delete(o.hash),n.size||H.delete(d))};return L.set(e,v),F.set(e,s),v},Re=q("n-avatar-group"),Oe=y("avatar",`
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
`,[U(k("&","--n-merged-color: var(--n-color-modal);")),Y(k("&","--n-merged-color: var(--n-color-popover);")),k("img",`
 width: 100%;
 height: 100%;
 `),O("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),y("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),O("text","line-height: 1.25")]),$e=Object.assign(Object.assign({},C.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Ie=P({name:"Avatar",props:$e,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:s}=I(e),o=$(!1);let d=null;const n=$(null),f=$(null),l=()=>{const{value:t}=n;if(t&&(d===null||d!==t.innerHTML)){d=t.innerHTML;const{value:c}=f;if(c){const{offsetWidth:m,offsetHeight:w}=c,{offsetWidth:x,offsetHeight:B}=t,E=.9,T=Math.min(m/x*E,w/B*E,1);t.style.transform=`translateX(-50%) translateY(-50%) scale(${T})`}}},r=W(Re,null),u=S(()=>{const{size:t}=e;if(t)return t;const{size:c}=r||{};return c||"medium"}),v=C("Avatar","-avatar",Oe,oe,e,a),g=W(se,null),h=S(()=>{if(r)return!0;const{round:t,circle:c}=e;return t!==void 0||c!==void 0?t||c:g?g.roundRef.value:!1}),p=S(()=>r?!0:e.bordered||!1),b=S(()=>{const t=u.value,c=h.value,m=p.value,{color:w}=e,{self:{borderRadius:x,fontSize:B,color:E,border:T,colorModal:N,colorPopover:K},common:{cubicBezierEaseInOut:G}}=v.value;let j;return typeof t=="number"?j=`${t}px`:j=v.value.self[D("height",t)],{"--n-font-size":B,"--n-border":m?T:"none","--n-border-radius":c?"50%":x,"--n-color":w||E,"--n-color-modal":w||N,"--n-color-popover":w||K,"--n-bezier":G,"--n-merged-size":`var(--n-avatar-size-override, ${j})`}}),z=s?M("avatar",S(()=>{const t=u.value,c=h.value,m=p.value,{color:w}=e;let x="";return t&&(typeof t=="number"?x+=`a${t}`:x+=t[0]),c&&(x+="b"),m&&(x+="c"),w&&(x+=re(w)),x}),b,e):void 0,_=$(!e.lazy);Q(()=>{if(e.lazy&&e.intersectionObserverOptions){let t;const c=A(()=>{t==null||t(),t=void 0,e.lazy&&(t=we(f.value,e.intersectionObserverOptions,_))});Z(()=>{c(),t==null||t()})}}),J(()=>{var t;return e.src||((t=e.imgProps)===null||t===void 0?void 0:t.src)},()=>{o.value=!1});const R=$(!e.lazy);return{textRef:n,selfRef:f,mergedRoundRef:h,mergedClsPrefix:a,fitTextTransform:l,cssVars:s?void 0:b,themeClass:z==null?void 0:z.themeClass,onRender:z==null?void 0:z.onRender,hasLoadError:o,shouldStartLoading:_,loaded:R,mergedOnError:t=>{if(!_.value)return;o.value=!0;const{onError:c,imgProps:{onError:m}={}}=e;c==null||c(t),m==null||m(t)},mergedOnLoad:t=>{const{onLoad:c,imgProps:{onLoad:m}={}}=e;c==null||c(t),m==null||m(t),R.value=!0}}},render(){var e,a;const{$slots:s,src:o,mergedClsPrefix:d,lazy:n,onRender:f,loaded:l,hasLoadError:r,imgProps:u={}}=this;f==null||f();let v;const g=!l&&!r&&(this.renderPlaceholder?this.renderPlaceholder():(a=(e=this.$slots).placeholder)===null||a===void 0?void 0:a.call(e));return this.hasLoadError?v=this.renderFallback?this.renderFallback():ee(s.fallback,()=>[i("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):v=te(s.default,h=>{if(h)return i(ne,{onResize:this.fitTextTransform},{default:()=>i("span",{ref:"textRef",class:`${d}-avatar__text`},h)});if(o||u.src){const p=this.src||u.src;return i("img",Object.assign(Object.assign({},u),{loading:Se&&!this.intersectionObserverOptions&&n?"lazy":"eager",src:n&&this.intersectionObserverOptions?this.shouldStartLoading?p:void 0:p,"data-image-src":p,onLoad:this.mergedOnLoad,onError:this.mergedOnError,style:[u.style||"",{objectFit:this.objectFit},g?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),i("span",{ref:"selfRef",class:[`${d}-avatar`,this.themeClass],style:this.cssVars},v,n&&g)}}),Ce=k([y("page-header-header",`
 margin-bottom: 20px;
 `),y("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[O("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),O("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[k("&:hover","color: var(--n-back-color-hover);"),k("&:active","color: var(--n-back-color-pressed);")]),O("avatar",`
 display: flex;
 margin-right: 12px
 `),O("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),O("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),y("page-header-content",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")]),y("page-header-footer",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")])]),Pe=Object.assign(Object.assign({},C.props),{title:String,subtitle:String,extra:String,onBack:Function}),Me=P({name:"PageHeader",props:Pe,setup(e){const{mergedClsPrefixRef:a,mergedRtlRef:s,inlineThemeDisabled:o}=I(e),d=C("PageHeader","-page-header",Ce,le,e,a),n=ae("PageHeader",s,a),f=S(()=>{const{self:{titleTextColor:r,subtitleTextColor:u,backColor:v,fontSize:g,titleFontSize:h,backSize:p,titleFontWeight:b,backColorHover:z,backColorPressed:_},common:{cubicBezierEaseInOut:R}}=d.value;return{"--n-title-text-color":r,"--n-title-font-size":h,"--n-title-font-weight":b,"--n-font-size":g,"--n-back-size":p,"--n-subtitle-text-color":u,"--n-back-color":v,"--n-back-color-hover":z,"--n-back-color-pressed":_,"--n-bezier":R}}),l=o?M("page-header",void 0,f,e):void 0;return{rtlEnabled:n,mergedClsPrefix:a,cssVars:o?void 0:f,themeClass:l==null?void 0:l.themeClass,onRender:l==null?void 0:l.onRender}},render(){var e;const{onBack:a,title:s,subtitle:o,extra:d,mergedClsPrefix:n,cssVars:f,$slots:l}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:r,subtitle:u,extra:v,default:g,header:h,avatar:p,footer:b,back:z}=l,_=a,R=s||r,t=o||u,c=d||v;return i("div",{style:f,class:[`${n}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${n}-page-header-wrapper--rtl`]},h?i("div",{class:`${n}-page-header-header`,key:"breadcrumb"},h()):null,(_||p||R||t||c)&&i("div",{class:`${n}-page-header`,key:"header"},i("div",{class:`${n}-page-header__main`,key:"back"},_?i("div",{class:`${n}-page-header__back`,onClick:a},z?z():i(ie,{clsPrefix:n},{default:()=>i(ke,null)})):null,p?i("div",{class:`${n}-page-header__avatar`},p()):null,R?i("div",{class:`${n}-page-header__title`,key:"title"},s||r()):null,t?i("div",{class:`${n}-page-header__subtitle`,key:"subtitle"},o||u()):null),c?i("div",{class:`${n}-page-header__extra`},d||v()):null),g?i("div",{class:`${n}-page-header-content`,key:"content"},g()):null,b?i("div",{class:`${n}-page-header-footer`,key:"footer"},b()):null)}}),Ee=k([k("@keyframes spin-rotate",`
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
 `)])]),Be={small:20,medium:18,large:16},Te=Object.assign(Object.assign({},C.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),We=P({name:"Spin",props:Te,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:s}=I(e),o=C("Spin","-spin",Ee,ve,e,a),d=S(()=>{const{size:r}=e,{common:{cubicBezierEaseInOut:u},self:v}=o.value,{opacitySpinning:g,color:h,textColor:p}=v,b=typeof r=="number"?he(r):v[D("size",r)];return{"--n-bezier":u,"--n-opacity-spinning":g,"--n-size":b,"--n-color":h,"--n-text-color":p}}),n=s?M("spin",S(()=>{const{size:r}=e;return typeof r=="number"?String(r):r[0]}),d,e):void 0,f=de(e,["spinning","show"]),l=$(!1);return A(r=>{let u;if(f.value){const{delay:v}=e;if(v){u=window.setTimeout(()=>{l.value=!0},v),r(()=>{clearTimeout(u)});return}}l.value=f.value}),{mergedClsPrefix:a,active:l,mergedStrokeWidth:S(()=>{const{strokeWidth:r}=e;if(r!==void 0)return r;const{size:u}=e;return Be[typeof u=="number"?"medium":u]}),cssVars:s?void 0:d,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e,a;const{$slots:s,mergedClsPrefix:o,description:d}=this,n=s.icon&&this.rotate,f=(d||s.description)&&i("div",{class:`${o}-spin-description`},d||((e=s.description)===null||e===void 0?void 0:e.call(s))),l=s.icon?i("div",{class:[`${o}-spin-body`,this.themeClass]},i("div",{class:[`${o}-spin`,n&&`${o}-spin--rotate`],style:s.default?"":this.cssVars},s.icon()),f):i("div",{class:[`${o}-spin-body`,this.themeClass]},i(ue,{clsPrefix:o,style:s.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${o}-spin`}),f);return(a=this.onRender)===null||a===void 0||a.call(this),s.default?i("div",{class:[`${o}-spin-container`,this.themeClass],style:this.cssVars},i("div",{class:[`${o}-spin-content`,this.active&&`${o}-spin-content--spinning`,this.contentClass],style:this.contentStyle},s),i(fe,{name:"fade-in-transition"},{default:()=>this.active?l:null})):l}}),je=P({name:"DropZone",props:{text:{type:String,default:""},positionFixed:{type:Boolean,default:!1}}}),He={class:"border-dashed"};function Le(e,a,s,o,d,n){return ge(),me("div",{class:ze(["file-dropzone",{"position-fixed":e.positionFixed}])},[be("div",He,ye(e.text||e.$t("msgs.drop_files_here")),1)],2)}const Ve=pe(je,[["render",Le],["__scopeId","data-v-0861eaf5"]]),Ae=({cbFiles:e,cb:a})=>{const s=$(!1);return{showDropzone:s,fileDragover(o){s.value=!0,o.preventDefault()},async fileDrop(o){o.preventDefault(),s.value=!1,typeof a=="function"&&a(o);const d=Array.from(o.dataTransfer.files);typeof e=="function"&&e(d)}}},De=()=>({metaTitle:xe().meta.title});export{Ve as _,Ae as a,Ie as b,Me as c,We as d,De as u};
