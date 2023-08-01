import{d as j,L as p,am as ne,P as ae,Y as R,a_ as re,a0 as $,a$ as se,Z as S,W as J,r as y,R as K,a5 as T,a2 as P,b0 as le,b1 as ie,w as C,a6 as de,a7 as Y,b2 as ce,o as ue,av as fe,b3 as pe,aC as ve,aa as he,b4 as me,b5 as ge,a4 as be,ag as _e,aT as ye,a as X,q as G,f as N,aU as xe,l as H,e as O,n as Z,b as Q,H as q,F as ze,i as F,z as ke,x as $e,aI as we,A as Se,t as Oe}from"./index-e6b55280.js";const Te=j({name:"ArrowBack",render(){return p("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},p("path",{d:"M0 0h24v24H0V0z",fill:"none"}),p("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),V=ne&&"loading"in document.createElement("img"),Ce=(e={})=>{var t;const{root:d=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(t=e.threshold)!==null&&t!==void 0?t:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof d=="string"?document.querySelector(d):d)||document.documentElement})}},D=new WeakMap,W=new WeakMap,U=new WeakMap,Re=(e,t,d)=>{if(!e)return()=>{};const a=Ce(t),{root:c}=a.options;let o;const s=D.get(c);s?o=s:(o=new Map,D.set(c,o));let l,r;o.has(a.hash)?(r=o.get(a.hash),r[1].has(e)||(l=r[0],r[1].add(e),l.observe(e))):(l=new IntersectionObserver(i=>{i.forEach(h=>{if(h.isIntersecting){const g=W.get(h.target),b=U.get(h.target);g&&g(),b&&(b.value=!0)}})},a.options),l.observe(e),r=[l,new Set([e])],o.set(a.hash,r));let f=!1;const m=()=>{f||(W.delete(e),U.delete(e),f=!0,r[1].has(e)&&(r[0].unobserve(e),r[1].delete(e)),r[1].size<=0&&o.delete(a.hash),o.size||D.delete(c))};return W.set(e,m),U.set(e,d),m},Ee=ae("n-avatar-group"),Le=R("avatar",`
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
`,[re($("&","--n-merged-color: var(--n-color-modal);")),se($("&","--n-merged-color: var(--n-color-popover);")),$("img",`
 width: 100%;
 height: 100%;
 `),S("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),R("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),S("text","line-height: 1.25")]),je=Object.assign(Object.assign({},P.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Ze=j({name:"Avatar",props:je,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:d}=J(e),a=y(!1);let c=null;const o=y(null),s=y(null),l=()=>{const{value:n}=o;if(n&&(c===null||c!==n.innerHTML)){c=n.innerHTML;const{value:u}=s;if(u){const{offsetWidth:_,offsetHeight:v}=u,{offsetWidth:z,offsetHeight:B}=n,M=.9,I=Math.min(_/z*M,v/B*M,1);n.style.transform=`translateX(-50%) translateY(-50%) scale(${I})`}}},r=K(Ee,null),f=T(()=>{const{size:n}=e;if(n)return n;const{size:u}=r||{};return u||"medium"}),m=P("Avatar","-avatar",Le,le,e,t),i=K(ie,null),h=T(()=>{if(r)return!0;const{round:n,circle:u}=e;return n!==void 0||u!==void 0?n||u:i?i.roundRef.value:!1}),g=T(()=>r?!0:e.bordered||!1),b=n=>{var u;if(!k.value)return;a.value=!0;const{onError:_,imgProps:v}=e;(u=v==null?void 0:v.onError)===null||u===void 0||u.call(v,n),_&&_(n)};C(()=>e.src,()=>a.value=!1);const w=T(()=>{const n=f.value,u=h.value,_=g.value,{color:v}=e,{self:{borderRadius:z,fontSize:B,color:M,border:I,colorModal:ee,colorPopover:te},common:{cubicBezierEaseInOut:oe}}=m.value;let A;return typeof n=="number"?A=`${n}px`:A=m.value.self[de("height",n)],{"--n-font-size":B,"--n-border":_?I:"none","--n-border-radius":u?"50%":z,"--n-color":v||M,"--n-color-modal":v||ee,"--n-color-popover":v||te,"--n-bezier":oe,"--n-merged-size":`var(--n-avatar-size-override, ${A})`}}),x=d?Y("avatar",T(()=>{const n=f.value,u=h.value,_=g.value,{color:v}=e;let z="";return n&&(typeof n=="number"?z+=`a${n}`:z+=n[0]),u&&(z+="b"),_&&(z+="c"),v&&(z+=ce(v)),z}),w,e):void 0,k=y(!e.lazy);ue(()=>{if(V)return;let n;const u=fe(()=>{n==null||n(),n=void 0,e.lazy&&(n=Re(s.value,e.intersectionObserverOptions,k))});pe(()=>{u(),n==null||n()})});const L=y(!e.lazy);return{textRef:o,selfRef:s,mergedRoundRef:h,mergedClsPrefix:t,fitTextTransform:l,cssVars:d?void 0:w,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender,hasLoadError:a,handleError:b,shouldStartLoading:k,loaded:L,mergedOnLoad:n=>{var u;const{onLoad:_,imgProps:v}=e;_==null||_(n),(u=v==null?void 0:v.onLoad)===null||u===void 0||u.call(v,n),L.value=!0}}},render(){var e,t;const{$slots:d,src:a,mergedClsPrefix:c,lazy:o,onRender:s,mergedOnLoad:l,shouldStartLoading:r,loaded:f,hasLoadError:m}=this;s==null||s();let i;const h=!f&&!m&&(this.renderPlaceholder?this.renderPlaceholder():(t=(e=this.$slots).placeholder)===null||t===void 0?void 0:t.call(e));return this.hasLoadError?i=this.renderFallback?this.renderFallback():ve(d.fallback,()=>[p("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):i=he(d.default,g=>{if(g)return p(me,{onResize:this.fitTextTransform},{default:()=>p("span",{ref:"textRef",class:`${c}-avatar__text`},g)});if(a){const{imgProps:b}=this;return p("img",Object.assign(Object.assign({},b),{loading:V&&!this.intersectionObserverOptions&&o?"lazy":"eager",src:V||r||f?a:void 0,onLoad:l,"data-image-src":a,onError:this.handleError,style:[b==null?void 0:b.style,{objectFit:this.objectFit},h?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),p("span",{ref:"selfRef",class:[`${c}-avatar`,this.themeClass],style:this.cssVars},i,o&&h)}}),Me=$([R("page-header-header",`
 margin-bottom: 20px;
 `),R("page-header",`
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
 `,[$("&:hover","color: var(--n-back-color-hover);"),$("&:active","color: var(--n-back-color-pressed);")]),S("avatar",`
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
 `)]),R("page-header-content",`
 font-size: var(--n-font-size);
 `,[$("&:not(:first-child)","margin-top: 20px;")]),R("page-header-footer",`
 font-size: var(--n-font-size);
 `,[$("&:not(:first-child)","margin-top: 20px;")])]),He=Object.assign(Object.assign({},P.props),{title:String,subtitle:String,extra:String,onBack:Function}),qe=j({name:"PageHeader",props:He,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:d,inlineThemeDisabled:a}=J(e),c=P("PageHeader","-page-header",Me,ge,e,t),o=be("PageHeader",d,t),s=T(()=>{const{self:{titleTextColor:r,subtitleTextColor:f,backColor:m,fontSize:i,titleFontSize:h,backSize:g,titleFontWeight:b,backColorHover:w,backColorPressed:x},common:{cubicBezierEaseInOut:k}}=c.value;return{"--n-title-text-color":r,"--n-title-font-size":h,"--n-title-font-weight":b,"--n-font-size":i,"--n-back-size":g,"--n-subtitle-text-color":f,"--n-back-color":m,"--n-back-color-hover":w,"--n-back-color-pressed":x,"--n-bezier":k}}),l=a?Y("page-header",void 0,s,e):void 0;return{rtlEnabled:o,mergedClsPrefix:t,cssVars:a?void 0:s,themeClass:l==null?void 0:l.themeClass,onRender:l==null?void 0:l.onRender}},render(){var e;const{onBack:t,title:d,subtitle:a,extra:c,mergedClsPrefix:o,cssVars:s,$slots:l}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:r,subtitle:f,extra:m,default:i,header:h,avatar:g,footer:b,back:w}=l,x=t,k=d||r,L=a||f,n=c||m;return p("div",{style:s,class:[`${o}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${o}-page-header-wrapper--rtl`]},h?p("div",{class:`${o}-page-header-header`,key:"breadcrumb"},h()):null,(x||g||k||L||n)&&p("div",{class:`${o}-page-header`,key:"header"},p("div",{class:`${o}-page-header__main`,key:"back"},x?p("div",{class:`${o}-page-header__back`,onClick:t},w?w():p(_e,{clsPrefix:o},{default:()=>p(Te,null)})):null,g?p("div",{class:`${o}-page-header__avatar`},g()):null,k?p("div",{class:`${o}-page-header__title`,key:"title"},d||r()):null,L?p("div",{class:`${o}-page-header__subtitle`,key:"subtitle"},a||f()):null),n?p("div",{class:`${o}-page-header__extra`},c||m()):null),i?p("div",{class:`${o}-page-header-content`,key:"content"},i()):null,b?p("div",{class:`${o}-page-header-footer`,key:"footer"},b()):null)}}),E={none:"none",text:"text",html:"html",json:"json"},Fe=Object.values(E).map(e=>({label:e,value:e})),Pe=(e,t="text",d={})=>{const{isTrimEmptyLines:a=!1,htmlTagName:c="",htmlAttrs:o=""}=d;if(e=e.trim().replace(/ /gi," "),a&&(e=e.replace(/^\s*[\r\n]/gm,"")),t===E.text)return e;let s=e.split(`
`);if(s=s.map(l=>l.trim()),t===E.json)return s.length===1?JSON.stringify(s[0]):JSON.stringify(s,null,2);if(t===E.html)return c?s.map(l=>`<${c}${o?` ${o}`:""}>${l}</${c}>`).join(`
`):s.join("<br>")},Be=j({name:"DialogCopyFormat",props:{visible:{type:Boolean,default:!1}},setup(e,{emit:t}){const d=ye(e,t,"visible"),a=y(""),c=y(""),o=y(E.json),s=y(!0),l=y(""),r=y("");C(a,()=>{f()}),C(o,()=>{f()}),C(s,()=>{f()}),C(l,()=>{f()}),C(r,()=>{f()});const f=()=>{c.value=Pe(a.value,o.value,{isTrimEmptyLines:s.value,htmlTagName:l.value,htmlAttrs:r.value})};return{mVisible:d,textInput:a,textOutput:c,CopyMode:E,CopyModeOptions:Fe,mMode:o,isTrimEmptyLines:s,htmlTagName:l,htmlAttrs:r}}});const Ie={class:"style-tools"},Ae={class:"common-card"},Ne={class:"main-box font-code"};function Ve(e,t,d,a,c,o){const s=ke,l=$e,r=we,f=Se,m=xe;return H(),G(m,{show:e.mVisible,"onUpdate:show":t[6]||(t[6]=i=>e.mVisible=i),preset:"dialog",title:"Text transformer",style:{"min-width":"800px"}},{default:N(()=>[O(f,{align:"center",style:{"margin-bottom":"10px"}},{default:N(()=>[Z(" Mode: "),O(s,{size:"small",value:e.mMode,"onUpdate:value":t[0]||(t[0]=i=>e.mMode=i),options:e.CopyModeOptions,style:{width:"100px"}},null,8,["value","options"]),O(l,{size:"small",checked:e.isTrimEmptyLines,"onUpdate:checked":t[1]||(t[1]=i=>e.isTrimEmptyLines=i)},{default:N(()=>[Z("Trim empty lines")]),_:1},8,["checked"]),e.mMode===e.CopyMode.html?(H(),Q(ze,{key:0},[O(r,{value:e.htmlTagName,"onUpdate:value":t[2]||(t[2]=i=>e.htmlTagName=i),clearable:"",placeholder:"HTML Tag Name",size:"small"},null,8,["value"]),e.htmlTagName?(H(),G(r,{key:0,value:e.htmlAttrs,"onUpdate:value":t[3]||(t[3]=i=>e.htmlAttrs=i),clearable:"",placeholder:"HTML Attrs",size:"small"},null,8,["value"])):q("",!0)],64)):q("",!0)]),_:1}),F("div",Ie,[F("div",Ae,[F("div",Ne,[O(r,{class:"input-text",type:"textarea",value:e.textInput,"onUpdate:value":t[4]||(t[4]=i=>e.textInput=i),placeholder:"Text Input"},null,8,["value"]),O(r,{class:"input-text",type:"textarea",value:e.textOutput,"onUpdate:value":t[5]||(t[5]=i=>e.textOutput=i),placeholder:"Text Output"},null,8,["value"])])])])]),_:1},8,["show"])}const Je=X(Be,[["render",Ve],["__scopeId","data-v-0f37569f"]]),De=j({name:"DropZone",props:{text:{type:String,default:"Drop files here"}}});const We={class:"file-dropzone"},Ue={class:"border-dashed"};function Ke(e,t,d,a,c,o){return H(),Q("div",We,[F("div",Ue,Oe(e.text),1)])}const Ye=X(De,[["render",Ke],["__scopeId","data-v-c4914fc9"]]),Xe=({cbFiles:e,cb:t})=>{const d=y(!1);return{showDropzone:d,fileDragover(a){d.value=!0,a.preventDefault()},async fileDrop(a){a.preventDefault(),d.value=!1,typeof t=="function"&&t(a);const c=Array.from(a.dataTransfer.files);typeof e=="function"&&e(c)}}};export{E as C,Je as _,Ye as a,Fe as b,Ze as c,qe as d,Pe as f,Xe as u};
