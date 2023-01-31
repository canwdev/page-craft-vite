import{d as I,C as s,D,E as _,G as U,H as k,I as X,J as w,K as A,r as E,L as W,M as R,N as O,O as Y,P as q,w as J,Q,R as V,S as Z,i as ee,T as te,U as re,V as oe,W as ne,X as ae,Y as se,Z as ie}from"./index.6b9976c6.js";const le=I({name:"ArrowBack",render(){return s("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},s("path",{d:"M0 0h24v24H0V0z",fill:"none"}),s("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),M=!1,de=(e={})=>{var i;const{root:d=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(i=e.threshold)!==null&&i!==void 0?i:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof d=="string"?document.querySelector(d):d)||document.documentElement})}},P=new WeakMap,T=new WeakMap,F=new WeakMap,ce=(e,i,d)=>{if(!e)return()=>{};const o=de(i),{root:c}=o.options;let r;const u=P.get(c);u?r=u:(r=new Map,P.set(c,r));let l,n;r.has(o.hash)?(n=r.get(o.hash),n[1].has(e)||(l=n[0],n[1].add(e),l.observe(e))):(l=new IntersectionObserver(g=>{g.forEach(f=>{if(f.isIntersecting){const h=T.get(f.target),z=F.get(f.target);h&&h(),z&&(z.value=!0)}})},o.options),l.observe(e),n=[l,new Set([e])],r.set(o.hash,n));let v=!1;const b=()=>{v||(T.delete(e),F.delete(e),v=!0,n[1].has(e)&&(n[0].unobserve(e),n[1].delete(e)),n[1].size<=0&&r.delete(o.hash),r.size||P.delete(c))};return T.set(e,b),F.set(e,d),b},ue=D("n-avatar-group"),fe=_("avatar",`
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
`,[U(k("&","--n-merged-color: var(--n-color-modal);")),X(k("&","--n-merged-color: var(--n-color-popover);")),k("img",`
 width: 100%;
 height: 100%;
 `),w("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),_("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),w("text","line-height: 1.25")]),he=Object.assign(Object.assign({},O.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,color:String}),me=I({name:"Avatar",props:he,setup(e){const{mergedClsPrefixRef:i,inlineThemeDisabled:d}=A(e),o=E(!1);let c=null;const r=E(null),u=E(null),l=()=>{const{value:t}=r;if(t&&(c===null||c!==t.innerHTML)){c=t.innerHTML;const{value:a}=u;if(a){const{offsetWidth:$,offsetHeight:y}=a,{offsetWidth:p,offsetHeight:L}=t,H=.9,j=Math.min($/p*H,y/L*H,1);t.style.transform=`translateX(-50%) translateY(-50%) scale(${j})`}}},n=W(ue,null),v=R(()=>{const{size:t}=e;if(t)return t;const{size:a}=n||{};return a||"medium"}),b=O("Avatar","-avatar",fe,Y,e,i),g=W(q,null),f=R(()=>{if(n)return!0;const{round:t,circle:a}=e;return t!==void 0||a!==void 0?t||a:g?g.roundRef.value:!1}),h=R(()=>n?!0:e.bordered||!1),z=t=>{if(!x.value)return;o.value=!0;const{onError:a}=e;a&&a(t)};J(()=>e.src,()=>o.value=!1);const S=R(()=>{const t=v.value,a=f.value,$=h.value,{color:y}=e,{self:{borderRadius:p,fontSize:L,color:H,border:j,colorModal:N,colorPopover:K},common:{cubicBezierEaseInOut:G}}=b.value;let B;return typeof t=="number"?B=`${t}px`:B=b.value.self[Q("height",t)],{"--n-font-size":L,"--n-border":$?j:"none","--n-border-radius":a?"50%":p,"--n-color":y||H,"--n-color-modal":y||N,"--n-color-popover":y||K,"--n-bezier":G,"--n-merged-size":`var(--n-avatar-size-override, ${B})`}}),m=d?V("avatar",R(()=>{const t=v.value,a=f.value,$=h.value,{color:y}=e;let p="";return t&&(typeof t=="number"?p+=`a${t}`:p+=t[0]),a&&(p+="b"),$&&(p+="c"),y&&(p+=Z(y)),p}),S,e):void 0,x=E(!e.lazy);ee(()=>{if(M)return;let t;const a=te(()=>{t==null||t(),t=void 0,e.lazy&&(t=ce(u.value,e.intersectionObserverOptions,x))});re(()=>{a(),t==null||t()})});const C=E(!e.lazy);return{textRef:r,selfRef:u,mergedRoundRef:f,mergedClsPrefix:i,fitTextTransform:l,cssVars:d?void 0:S,themeClass:m==null?void 0:m.themeClass,onRender:m==null?void 0:m.onRender,hasLoadError:o,handleError:z,shouldStartLoading:x,loaded:C,mergedOnLoad:t=>{const{onLoad:a}=e;a==null||a(t),C.value=!0}}},render(){var e,i;const{$slots:d,src:o,mergedClsPrefix:c,lazy:r,onRender:u,mergedOnLoad:l,shouldStartLoading:n,loaded:v,hasLoadError:b}=this;u==null||u();let g;const f=!v&&!b&&((i=(e=this.$slots).placeholder)===null||i===void 0?void 0:i.call(e));return this.hasLoadError?g=s("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}}):g=oe(d.default,h=>{if(h)return s(ne,{onResize:this.fitTextTransform},{default:()=>s("span",{ref:"textRef",class:`${c}-avatar__text`},h)});if(o)return s("img",{loading:M&&r?"lazy":"eager",src:M||n||v?o:void 0,onLoad:l,"data-image-src":o,onError:this.handleError,style:[{objectFit:this.objectFit},f?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]})}),s("span",{ref:"selfRef",class:[`${c}-avatar`,this.themeClass],style:this.cssVars},g,r&&f)}}),ve=k([_("page-header-header",`
 margin-bottom: 20px;
 `),_("page-header",`
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
 `)]),_("page-header-content",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")]),_("page-header-footer",`
 font-size: var(--n-font-size);
 `,[k("&:not(:first-child)","margin-top: 20px;")])]),ge=Object.assign(Object.assign({},O.props),{title:String,subtitle:String,extra:String,onBack:Function}),pe=I({name:"PageHeader",props:ge,setup(e){const{mergedClsPrefixRef:i,mergedRtlRef:d,inlineThemeDisabled:o}=A(e),c=O("PageHeader","-page-header",ve,ae,e,i),r=se("PageHeader",d,i),u=R(()=>{const{self:{titleTextColor:n,subtitleTextColor:v,backColor:b,fontSize:g,titleFontSize:f,backSize:h,titleFontWeight:z,backColorHover:S,backColorPressed:m},common:{cubicBezierEaseInOut:x}}=c.value;return{"--n-title-text-color":n,"--n-title-font-size":f,"--n-title-font-weight":z,"--n-font-size":g,"--n-back-size":h,"--n-subtitle-text-color":v,"--n-back-color":b,"--n-back-color-hover":S,"--n-back-color-pressed":m,"--n-bezier":x}}),l=o?V("page-header",void 0,u,e):void 0;return{rtlEnabled:r,mergedClsPrefix:i,cssVars:o?void 0:u,themeClass:l==null?void 0:l.themeClass,onRender:l==null?void 0:l.onRender}},render(){var e;const{onBack:i,title:d,subtitle:o,extra:c,mergedClsPrefix:r,cssVars:u,$slots:l}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:n,subtitle:v,extra:b,default:g,header:f,avatar:h,footer:z,back:S}=l,m=i,x=d||n,C=o||v,t=c||b;return s("div",{style:u,class:[`${r}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${r}-page-header-wrapper--rtl`]},f?s("div",{class:`${r}-page-header-header`,key:"breadcrumb"},f()):null,(m||h||x||C||t)&&s("div",{class:`${r}-page-header`,key:"header"},s("div",{class:`${r}-page-header__main`,key:"back"},m?s("div",{class:`${r}-page-header__back`,onClick:i},S?S():s(ie,{clsPrefix:r},{default:()=>s(le,null)})):null,h?s("div",{class:`${r}-page-header__avatar`},h()):null,x?s("div",{class:`${r}-page-header__title`,key:"title"},d||n()):null,C?s("div",{class:`${r}-page-header__subtitle`,key:"subtitle"},o||v()):null),t?s("div",{class:`${r}-page-header__extra`},c||b()):null),g?s("div",{class:`${r}-page-header-content`,key:"content"},g()):null,z?s("div",{class:`${r}-page-header-footer`,key:"footer"},z()):null)}});export{me as _,pe as a};
