import{d as j,N as l,ap as G,R as U,$ as O,aR as Y,a2 as k,aS as X,a0 as w,Y as A,r as R,U as D,a7 as $,a4 as H,aT as Z,aU as q,w as J,a8 as Q,a9 as W,aV as ee,j as te,ay as re,aW as oe,aF as ae,ac as ne,aX as se,aY as ie,a6 as le,ai as ce,_ as de,o as ue,n as fe,b as ve,x as he}from"./index-45f096b0.js";const ge=j({name:"ArrowBack",render(){return l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},l("path",{d:"M0 0h24v24H0V0z",fill:"none"}),l("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),F=G&&"loading"in document.createElement("img"),pe=(e={})=>{var a;const{root:s=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(a=e.threshold)!==null&&a!==void 0?a:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof s=="string"?document.querySelector(s):s)||document.documentElement})}},T=new WeakMap,M=new WeakMap,I=new WeakMap,be=(e,a,s)=>{if(!e)return()=>{};const o=pe(a),{root:c}=o.options;let r;const f=T.get(c);f?r=f:(r=new Map,T.set(c,r));let d,i;r.has(o.hash)?(i=r.get(o.hash),i[1].has(e)||(d=i[0],i[1].add(e),d.observe(e))):(d=new IntersectionObserver(b=>{b.forEach(v=>{if(v.isIntersecting){const h=M.get(v.target),g=I.get(v.target);h&&h(),g&&(g.value=!0)}})},o.options),d.observe(e),i=[d,new Set([e])],r.set(o.hash,i));let p=!1;const m=()=>{p||(M.delete(e),I.delete(e),p=!0,i[1].has(e)&&(i[0].unobserve(e),i[1].delete(e)),i[1].size<=0&&r.delete(o.hash),r.size||T.delete(c))};return M.set(e,m),I.set(e,s),m},me=U("n-avatar-group"),xe=O("avatar",`
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
`,[Y(k("&","--n-merged-color: var(--n-color-modal);")),X(k("&","--n-merged-color: var(--n-color-popover);")),k("img",`
 width: 100%;
 height: 100%;
 `),w("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),O("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),w("text","line-height: 1.25")]),ze=Object.assign(Object.assign({},H.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Oe=j({name:"Avatar",props:ze,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:s}=A(e),o=R(!1);let c=null;const r=R(null),f=R(null),d=()=>{const{value:t}=r;if(t&&(c===null||c!==t.innerHTML)){c=t.innerHTML;const{value:n}=f;if(n){const{offsetWidth:x,offsetHeight:u}=n,{offsetWidth:_,offsetHeight:P}=t,E=.9,L=Math.min(x/_*E,u/P*E,1);t.style.transform=`translateX(-50%) translateY(-50%) scale(${L})`}}},i=D(me,null),p=$(()=>{const{size:t}=e;if(t)return t;const{size:n}=i||{};return n||"medium"}),m=H("Avatar","-avatar",xe,Z,e,a),b=D(q,null),v=$(()=>{if(i)return!0;const{round:t,circle:n}=e;return t!==void 0||n!==void 0?t||n:b?b.roundRef.value:!1}),h=$(()=>i?!0:e.bordered||!1),g=t=>{var n;if(!y.value)return;o.value=!0;const{onError:x,imgProps:u}=e;(n=u==null?void 0:u.onError)===null||n===void 0||n.call(u,t),x&&x(t)};J(()=>e.src,()=>o.value=!1);const S=$(()=>{const t=p.value,n=v.value,x=h.value,{color:u}=e,{self:{borderRadius:_,fontSize:P,color:E,border:L,colorModal:V,colorPopover:N},common:{cubicBezierEaseInOut:K}}=m.value;let B;return typeof t=="number"?B=`${t}px`:B=m.value.self[Q("height",t)],{"--n-font-size":P,"--n-border":x?L:"none","--n-border-radius":n?"50%":_,"--n-color":u||E,"--n-color-modal":u||V,"--n-color-popover":u||N,"--n-bezier":K,"--n-merged-size":`var(--n-avatar-size-override, ${B})`}}),z=s?W("avatar",$(()=>{const t=p.value,n=v.value,x=h.value,{color:u}=e;let _="";return t&&(typeof t=="number"?_+=`a${t}`:_+=t[0]),n&&(_+="b"),x&&(_+="c"),u&&(_+=ee(u)),_}),S,e):void 0,y=R(!e.lazy);te(()=>{if(F)return;let t;const n=re(()=>{t==null||t(),t=void 0,e.lazy&&(t=be(f.value,e.intersectionObserverOptions,y))});oe(()=>{n(),t==null||t()})});const C=R(!e.lazy);return{textRef:r,selfRef:f,mergedRoundRef:v,mergedClsPrefix:a,fitTextTransform:d,cssVars:s?void 0:S,themeClass:z==null?void 0:z.themeClass,onRender:z==null?void 0:z.onRender,hasLoadError:o,handleError:g,shouldStartLoading:y,loaded:C,mergedOnLoad:t=>{var n;const{onLoad:x,imgProps:u}=e;x==null||x(t),(n=u==null?void 0:u.onLoad)===null||n===void 0||n.call(u,t),C.value=!0}}},render(){var e,a;const{$slots:s,src:o,mergedClsPrefix:c,lazy:r,onRender:f,mergedOnLoad:d,shouldStartLoading:i,loaded:p,hasLoadError:m}=this;f==null||f();let b;const v=!p&&!m&&(this.renderPlaceholder?this.renderPlaceholder():(a=(e=this.$slots).placeholder)===null||a===void 0?void 0:a.call(e));return this.hasLoadError?b=this.renderFallback?this.renderFallback():ae(s.fallback,()=>[l("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):b=ne(s.default,h=>{if(h)return l(se,{onResize:this.fitTextTransform},{default:()=>l("span",{ref:"textRef",class:`${c}-avatar__text`},h)});if(o){const{imgProps:g}=this;return l("img",Object.assign(Object.assign({},g),{loading:F&&!this.intersectionObserverOptions&&r?"lazy":"eager",src:F||i||p?o:void 0,onLoad:d,"data-image-src":o,onError:this.handleError,style:[g==null?void 0:g.style,{objectFit:this.objectFit},v?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),l("span",{ref:"selfRef",class:[`${c}-avatar`,this.themeClass],style:this.cssVars},b,r&&v)}}),_e=k([O("page-header-header",`
 margin-bottom: 20px;
 `),O("page-header",`
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
 `)]),O("page-header-content",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")]),O("page-header-footer",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")])]),ye=Object.assign(Object.assign({},H.props),{title:String,subtitle:String,extra:String,onBack:Function}),Ce=j({name:"PageHeader",props:ye,setup(e){const{mergedClsPrefixRef:a,mergedRtlRef:s,inlineThemeDisabled:o}=A(e),c=H("PageHeader","-page-header",_e,ie,e,a),r=le("PageHeader",s,a),f=$(()=>{const{self:{titleTextColor:i,subtitleTextColor:p,backColor:m,fontSize:b,titleFontSize:v,backSize:h,titleFontWeight:g,backColorHover:S,backColorPressed:z},common:{cubicBezierEaseInOut:y}}=c.value;return{"--n-title-text-color":i,"--n-title-font-size":v,"--n-title-font-weight":g,"--n-font-size":b,"--n-back-size":h,"--n-subtitle-text-color":p,"--n-back-color":m,"--n-back-color-hover":S,"--n-back-color-pressed":z,"--n-bezier":y}}),d=o?W("page-header",void 0,f,e):void 0;return{rtlEnabled:r,mergedClsPrefix:a,cssVars:o?void 0:f,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){var e;const{onBack:a,title:s,subtitle:o,extra:c,mergedClsPrefix:r,cssVars:f,$slots:d}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:i,subtitle:p,extra:m,default:b,header:v,avatar:h,footer:g,back:S}=d,z=a,y=s||i,C=o||p,t=c||m;return l("div",{style:f,class:[`${r}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${r}-page-header-wrapper--rtl`]},v?l("div",{class:`${r}-page-header-header`,key:"breadcrumb"},v()):null,(z||h||y||C||t)&&l("div",{class:`${r}-page-header`,key:"header"},l("div",{class:`${r}-page-header__main`,key:"back"},z?l("div",{class:`${r}-page-header__back`,onClick:a},S?S():l(ce,{clsPrefix:r},{default:()=>l(ge,null)})):null,h?l("div",{class:`${r}-page-header__avatar`},h()):null,y?l("div",{class:`${r}-page-header__title`,key:"title"},s||i()):null,C?l("div",{class:`${r}-page-header__subtitle`,key:"subtitle"},o||p()):null),t?l("div",{class:`${r}-page-header__extra`},c||m()):null),b?l("div",{class:`${r}-page-header-content`,key:"content"},b()):null,g?l("div",{class:`${r}-page-header-footer`,key:"footer"},g()):null)}}),ke=j({name:"DropZone",props:{text:{type:String,default:"Drop files here"}}});const Se={class:"file-dropzone"},we={class:"border-dashed"};function Re(e,a,s,o,c,r){return ue(),fe("div",Se,[ve("div",we,he(e.text),1)])}const Ee=de(ke,[["render",Re],["__scopeId","data-v-c4914fc9"]]),je=({cbFiles:e,cb:a})=>{const s=R(!1);return{showDropzone:s,fileDragover(o){s.value=!0,o.preventDefault()},async fileDrop(o){o.preventDefault(),s.value=!1,typeof a=="function"&&a(o);const c=Array.from(o.dataTransfer.files);typeof e=="function"&&e(c)}}};export{Ee as _,Oe as a,Ce as b,je as u};
