import{d as H,I as i,J as G,K as $,L as Z,M as y,N as U,O as S,P as A,r as w,Q as D,R,S as L,U as X,V as Y,w as q,W as J,X as W,Y as Q,j as ee,Z as te,$ as re,a0 as oe,a1 as ne,a2 as ae,a3 as se,a4 as ie,_ as le,o as ce,n as de,b as ue,x as fe}from"./index.710af264.js";const ve=H({name:"ArrowBack",render(){return i("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},i("path",{d:"M0 0h24v24H0V0z",fill:"none"}),i("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),P=!1,he=(e={})=>{var n;const{root:l=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(n=e.threshold)!==null&&n!==void 0?n:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof l=="string"?document.querySelector(l):l)||document.documentElement})}},T=new WeakMap,I=new WeakMap,F=new WeakMap,ge=(e,n,l)=>{if(!e)return()=>{};const o=he(n),{root:c}=o.options;let r;const u=T.get(c);u?r=u:(r=new Map,T.set(c,r));let d,a;r.has(o.hash)?(a=r.get(o.hash),a[1].has(e)||(d=a[0],a[1].add(e),d.observe(e))):(d=new IntersectionObserver(g=>{g.forEach(f=>{if(f.isIntersecting){const v=I.get(f.target),x=F.get(f.target);v&&v(),x&&(x.value=!0)}})},o.options),d.observe(e),a=[d,new Set([e])],r.set(o.hash,a));let h=!1;const p=()=>{h||(I.delete(e),F.delete(e),h=!0,a[1].has(e)&&(a[0].unobserve(e),a[1].delete(e)),a[1].size<=0&&r.delete(o.hash),r.size||T.delete(c))};return I.set(e,p),F.set(e,l),p},pe=G("n-avatar-group"),be=$("avatar",`
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
`,[Z(y("&","--n-merged-color: var(--n-color-modal);")),U(y("&","--n-merged-color: var(--n-color-popover);")),y("img",`
 width: 100%;
 height: 100%;
 `),S("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),$("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),S("text","line-height: 1.25")]),me=Object.assign(Object.assign({},L.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,color:String}),Re=H({name:"Avatar",props:me,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:l}=A(e),o=w(!1);let c=null;const r=w(null),u=w(null),d=()=>{const{value:t}=r;if(t&&(c===null||c!==t.innerHTML)){c=t.innerHTML;const{value:s}=u;if(s){const{offsetWidth:E,offsetHeight:_}=s,{offsetWidth:m,offsetHeight:j}=t,O=.9,B=Math.min(E/m*O,_/j*O,1);t.style.transform=`translateX(-50%) translateY(-50%) scale(${B})`}}},a=D(pe,null),h=R(()=>{const{size:t}=e;if(t)return t;const{size:s}=a||{};return s||"medium"}),p=L("Avatar","-avatar",be,X,e,n),g=D(Y,null),f=R(()=>{if(a)return!0;const{round:t,circle:s}=e;return t!==void 0||s!==void 0?t||s:g?g.roundRef.value:!1}),v=R(()=>a?!0:e.bordered||!1),x=t=>{if(!z.value)return;o.value=!0;const{onError:s}=e;s&&s(t)};q(()=>e.src,()=>o.value=!1);const k=R(()=>{const t=h.value,s=f.value,E=v.value,{color:_}=e,{self:{borderRadius:m,fontSize:j,color:O,border:B,colorModal:V,colorPopover:N},common:{cubicBezierEaseInOut:K}}=p.value;let M;return typeof t=="number"?M=`${t}px`:M=p.value.self[J("height",t)],{"--n-font-size":j,"--n-border":E?B:"none","--n-border-radius":s?"50%":m,"--n-color":_||O,"--n-color-modal":_||V,"--n-color-popover":_||N,"--n-bezier":K,"--n-merged-size":`var(--n-avatar-size-override, ${M})`}}),b=l?W("avatar",R(()=>{const t=h.value,s=f.value,E=v.value,{color:_}=e;let m="";return t&&(typeof t=="number"?m+=`a${t}`:m+=t[0]),s&&(m+="b"),E&&(m+="c"),_&&(m+=Q(_)),m}),k,e):void 0,z=w(!e.lazy);ee(()=>{if(P)return;let t;const s=te(()=>{t==null||t(),t=void 0,e.lazy&&(t=ge(u.value,e.intersectionObserverOptions,z))});re(()=>{s(),t==null||t()})});const C=w(!e.lazy);return{textRef:r,selfRef:u,mergedRoundRef:f,mergedClsPrefix:n,fitTextTransform:d,cssVars:l?void 0:k,themeClass:b==null?void 0:b.themeClass,onRender:b==null?void 0:b.onRender,hasLoadError:o,handleError:x,shouldStartLoading:z,loaded:C,mergedOnLoad:t=>{const{onLoad:s}=e;s==null||s(t),C.value=!0}}},render(){var e,n;const{$slots:l,src:o,mergedClsPrefix:c,lazy:r,onRender:u,mergedOnLoad:d,shouldStartLoading:a,loaded:h,hasLoadError:p}=this;u==null||u();let g;const f=!h&&!p&&((n=(e=this.$slots).placeholder)===null||n===void 0?void 0:n.call(e));return this.hasLoadError?g=i("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}}):g=oe(l.default,v=>{if(v)return i(ne,{onResize:this.fitTextTransform},{default:()=>i("span",{ref:"textRef",class:`${c}-avatar__text`},v)});if(o)return i("img",{loading:P&&r?"lazy":"eager",src:P||a||h?o:void 0,onLoad:d,"data-image-src":o,onError:this.handleError,style:[{objectFit:this.objectFit},f?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]})}),i("span",{ref:"selfRef",class:[`${c}-avatar`,this.themeClass],style:this.cssVars},g,r&&f)}}),xe=y([$("page-header-header",`
 margin-bottom: 20px;
 `),$("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[S("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),S("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[y("&:hover","color: var(--n-back-color-hover);"),y("&:active","color: var(--n-back-color-pressed);")]),S("avatar",`
 display: flex;
 margin-right: 12px
 `),S("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),S("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),$("page-header-content",`
 font-size: var(--n-font-size);
 `,[y("&:not(:first-child)","margin-top: 20px;")]),$("page-header-footer",`
 font-size: var(--n-font-size);
 `,[y("&:not(:first-child)","margin-top: 20px;")])]),ze=Object.assign(Object.assign({},L.props),{title:String,subtitle:String,extra:String,onBack:Function}),$e=H({name:"PageHeader",props:ze,setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:l,inlineThemeDisabled:o}=A(e),c=L("PageHeader","-page-header",xe,ae,e,n),r=se("PageHeader",l,n),u=R(()=>{const{self:{titleTextColor:a,subtitleTextColor:h,backColor:p,fontSize:g,titleFontSize:f,backSize:v,titleFontWeight:x,backColorHover:k,backColorPressed:b},common:{cubicBezierEaseInOut:z}}=c.value;return{"--n-title-text-color":a,"--n-title-font-size":f,"--n-title-font-weight":x,"--n-font-size":g,"--n-back-size":v,"--n-subtitle-text-color":h,"--n-back-color":p,"--n-back-color-hover":k,"--n-back-color-pressed":b,"--n-bezier":z}}),d=o?W("page-header",void 0,u,e):void 0;return{rtlEnabled:r,mergedClsPrefix:n,cssVars:o?void 0:u,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){var e;const{onBack:n,title:l,subtitle:o,extra:c,mergedClsPrefix:r,cssVars:u,$slots:d}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:a,subtitle:h,extra:p,default:g,header:f,avatar:v,footer:x,back:k}=d,b=n,z=l||a,C=o||h,t=c||p;return i("div",{style:u,class:[`${r}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${r}-page-header-wrapper--rtl`]},f?i("div",{class:`${r}-page-header-header`,key:"breadcrumb"},f()):null,(b||v||z||C||t)&&i("div",{class:`${r}-page-header`,key:"header"},i("div",{class:`${r}-page-header__main`,key:"back"},b?i("div",{class:`${r}-page-header__back`,onClick:n},k?k():i(ie,{clsPrefix:r},{default:()=>i(ve,null)})):null,v?i("div",{class:`${r}-page-header__avatar`},v()):null,z?i("div",{class:`${r}-page-header__title`,key:"title"},l||a()):null,C?i("div",{class:`${r}-page-header__subtitle`,key:"subtitle"},o||h()):null),t?i("div",{class:`${r}-page-header__extra`},c||p()):null),g?i("div",{class:`${r}-page-header-content`,key:"content"},g()):null,x?i("div",{class:`${r}-page-header-footer`,key:"footer"},x()):null)}}),_e=H({name:"DropZone",props:{text:{type:String,default:"Drop files here"}}});const ye={class:"file-dropzone"},ke={class:"border-dashed"};function Se(e,n,l,o,c,r){return ce(),de("div",ye,[ue("div",ke,fe(e.text),1)])}const Ce=le(_e,[["render",Se],["__scopeId","data-v-c4914fc9"]]),Ee=({cbFiles:e,cb:n})=>{const l=w(!1);return{showDropzone:l,fileDragover(o){l.value=!0,o.preventDefault()},async fileDrop(o){o.preventDefault(),l.value=!1,typeof n=="function"&&n(o);const c=Array.from(o.dataTransfer.files);typeof e=="function"&&e(c)}}};export{Ce as _,Re as a,$e as b,Ee as u};
