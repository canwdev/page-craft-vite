import{d as P,j as d,az as G,ab as q,a as E,bh as Z,c as k,bi as J,ai as w,u as D,r as R,ad as A,g as $,e as j,bw as U,w as X,h as W,q as Y,aF as Q,a_ as ee,aJ as te,ao as oe,bx as re,by as ne,k as ae,bz as se,al as ie,au as le,bA as de,B as ce,D as ue,E as fe,H as he,P as ve}from"./index-6913cb41.js";const ge=P({name:"ArrowBack",render(){return d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},d("path",{d:"M0 0h24v24H0V0z",fill:"none"}),d("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),F=G&&"loading"in document.createElement("img"),be=(e={})=>{var n;const{root:s=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(n=e.threshold)!==null&&n!==void 0?n:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof s=="string"?document.querySelector(s):s)||document.documentElement})}},T=new WeakMap,M=new WeakMap,I=new WeakMap,pe=(e,n,s)=>{if(!e)return()=>{};const r=be(n),{root:a}=r.options;let o;const f=T.get(a);f?o=f:(o=new Map,T.set(a,o));let c,l;o.has(r.hash)?(l=o.get(r.hash),l[1].has(e)||(c=l[0],l[1].add(e),c.observe(e))):(c=new IntersectionObserver(p=>{p.forEach(h=>{if(h.isIntersecting){const v=M.get(h.target),g=I.get(h.target);v&&v(),g&&(g.value=!0)}})},r.options),c.observe(e),l=[c,new Set([e])],o.set(r.hash,l));let b=!1;const m=()=>{b||(M.delete(e),I.delete(e),b=!0,l[1].has(e)&&(l[0].unobserve(e),l[1].delete(e)),l[1].size<=0&&o.delete(r.hash),o.size||T.delete(a))};return M.set(e,m),I.set(e,s),m},me=q("n-avatar-group"),ze=E("avatar",`
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
`,[Z(k("&","--n-merged-color: var(--n-color-modal);")),J(k("&","--n-merged-color: var(--n-color-popover);")),k("img",`
 width: 100%;
 height: 100%;
 `),w("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),E("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),w("text","line-height: 1.25")]),xe=Object.assign(Object.assign({},j.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Ee=P({name:"Avatar",props:xe,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:s}=D(e),r=R(!1);let a=null;const o=R(null),f=R(null),c=()=>{const{value:t}=o;if(t&&(a===null||a!==t.innerHTML)){a=t.innerHTML;const{value:i}=f;if(i){const{offsetWidth:z,offsetHeight:u}=i,{offsetWidth:_,offsetHeight:H}=t,C=.9,B=Math.min(z/_*C,u/H*C,1);t.style.transform=`translateX(-50%) translateY(-50%) scale(${B})`}}},l=A(me,null),b=$(()=>{const{size:t}=e;if(t)return t;const{size:i}=l||{};return i||"medium"}),m=j("Avatar","-avatar",ze,ne,e,n),p=A(U,null),h=$(()=>{if(l)return!0;const{round:t,circle:i}=e;return t!==void 0||i!==void 0?t||i:p?p.roundRef.value:!1}),v=$(()=>l?!0:e.bordered||!1),g=t=>{var i;if(!y.value)return;r.value=!0;const{onError:z,imgProps:u}=e;(i=u==null?void 0:u.onError)===null||i===void 0||i.call(u,t),z&&z(t)};X(()=>e.src,()=>r.value=!1);const S=$(()=>{const t=b.value,i=h.value,z=v.value,{color:u}=e,{self:{borderRadius:_,fontSize:H,color:C,border:B,colorModal:V,colorPopover:N},common:{cubicBezierEaseInOut:K}}=m.value;let L;return typeof t=="number"?L=`${t}px`:L=m.value.self[ae("height",t)],{"--n-font-size":H,"--n-border":z?B:"none","--n-border-radius":i?"50%":_,"--n-color":u||C,"--n-color-modal":u||V,"--n-color-popover":u||N,"--n-bezier":K,"--n-merged-size":`var(--n-avatar-size-override, ${L})`}}),x=s?W("avatar",$(()=>{const t=b.value,i=h.value,z=v.value,{color:u}=e;let _="";return t&&(typeof t=="number"?_+=`a${t}`:_+=t[0]),i&&(_+="b"),z&&(_+="c"),u&&(_+=se(u)),_}),S,e):void 0,y=R(!e.lazy);Y(()=>{if(F)return;let t;const i=Q(()=>{t==null||t(),t=void 0,e.lazy&&(t=pe(f.value,e.intersectionObserverOptions,y))});ee(()=>{i(),t==null||t()})});const O=R(!e.lazy);return{textRef:o,selfRef:f,mergedRoundRef:h,mergedClsPrefix:n,fitTextTransform:c,cssVars:s?void 0:S,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender,hasLoadError:r,handleError:g,shouldStartLoading:y,loaded:O,mergedOnLoad:t=>{var i;const{onLoad:z,imgProps:u}=e;z==null||z(t),(i=u==null?void 0:u.onLoad)===null||i===void 0||i.call(u,t),O.value=!0}}},render(){var e,n;const{$slots:s,src:r,mergedClsPrefix:a,lazy:o,onRender:f,mergedOnLoad:c,shouldStartLoading:l,loaded:b,hasLoadError:m}=this;f==null||f();let p;const h=!b&&!m&&(this.renderPlaceholder?this.renderPlaceholder():(n=(e=this.$slots).placeholder)===null||n===void 0?void 0:n.call(e));return this.hasLoadError?p=this.renderFallback?this.renderFallback():te(s.fallback,()=>[d("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):p=oe(s.default,v=>{if(v)return d(re,{onResize:this.fitTextTransform},{default:()=>d("span",{ref:"textRef",class:`${a}-avatar__text`},v)});if(r){const{imgProps:g}=this;return d("img",Object.assign(Object.assign({},g),{loading:F&&!this.intersectionObserverOptions&&o?"lazy":"eager",src:F||l||b?r:void 0,onLoad:c,"data-image-src":r,onError:this.handleError,style:[g==null?void 0:g.style,{objectFit:this.objectFit},h?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),d("span",{ref:"selfRef",class:[`${a}-avatar`,this.themeClass],style:this.cssVars},p,o&&h)}}),_e=k([E("page-header-header",`
 margin-bottom: 20px;
 `),E("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[w("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),w("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[k("&:hover","color: var(--n-back-color-hover);"),k("&:active","color: var(--n-back-color-pressed);")]),w("avatar",`
 display: flex;
 margin-right: 12px
 `),w("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),w("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),E("page-header-content",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")]),E("page-header-footer",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")])]),ye=Object.assign(Object.assign({},j.props),{title:String,subtitle:String,extra:String,onBack:Function}),Oe=P({name:"PageHeader",props:ye,setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:s,inlineThemeDisabled:r}=D(e),a=j("PageHeader","-page-header",_e,de,e,n),o=ie("PageHeader",s,n),f=$(()=>{const{self:{titleTextColor:l,subtitleTextColor:b,backColor:m,fontSize:p,titleFontSize:h,backSize:v,titleFontWeight:g,backColorHover:S,backColorPressed:x},common:{cubicBezierEaseInOut:y}}=a.value;return{"--n-title-text-color":l,"--n-title-font-size":h,"--n-title-font-weight":g,"--n-font-size":p,"--n-back-size":v,"--n-subtitle-text-color":b,"--n-back-color":m,"--n-back-color-hover":S,"--n-back-color-pressed":x,"--n-bezier":y}}),c=r?W("page-header",void 0,f,e):void 0;return{rtlEnabled:o,mergedClsPrefix:n,cssVars:r?void 0:f,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender}},render(){var e;const{onBack:n,title:s,subtitle:r,extra:a,mergedClsPrefix:o,cssVars:f,$slots:c}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:l,subtitle:b,extra:m,default:p,header:h,avatar:v,footer:g,back:S}=c,x=n,y=s||l,O=r||b,t=a||m;return d("div",{style:f,class:[`${o}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${o}-page-header-wrapper--rtl`]},h?d("div",{class:`${o}-page-header-header`,key:"breadcrumb"},h()):null,(x||v||y||O||t)&&d("div",{class:`${o}-page-header`,key:"header"},d("div",{class:`${o}-page-header__main`,key:"back"},x?d("div",{class:`${o}-page-header__back`,onClick:n},S?S():d(le,{clsPrefix:o},{default:()=>d(ge,null)})):null,v?d("div",{class:`${o}-page-header__avatar`},v()):null,y?d("div",{class:`${o}-page-header__title`,key:"title"},s||l()):null,O?d("div",{class:`${o}-page-header__subtitle`,key:"subtitle"},r||b()):null),t?d("div",{class:`${o}-page-header__extra`},a||m()):null),p?d("div",{class:`${o}-page-header-content`,key:"content"},p()):null,g?d("div",{class:`${o}-page-header-footer`,key:"footer"},g()):null)}}),ke=P({name:"DropZone",props:{text:{type:String,default:""}}});const Se={class:"file-dropzone"},we={class:"border-dashed"};function Re(e,n,s,r,a,o){return ue(),fe("div",Se,[he("div",we,ve(e.text||e.$t("msgs.drop_files_here")),1)])}const Ce=ce(ke,[["render",Re],["__scopeId","data-v-41639bbe"]]),Pe=e=>new Promise((n,s)=>{if(document.getElementById(e))n();else{const a=document.createElement("script");a.src=e,a.id=e,a.onload=function(){this.onerror=this.onload=null,n()},a.onerror=function(o){this.onerror=this.onload=null,s(o)},document.body.appendChild(a)}}),je=({cbFiles:e,cb:n})=>{const s=R(!1);return{showDropzone:s,fileDragover(r){s.value=!0,r.preventDefault()},async fileDrop(r){r.preventDefault(),s.value=!1,typeof n=="function"&&n(r);const a=Array.from(r.dataTransfer.files);typeof e=="function"&&e(a)}}};export{Ce as _,Ee as a,Oe as b,Pe as d,je as u};
