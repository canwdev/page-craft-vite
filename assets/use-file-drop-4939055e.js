import{d as L,L as f,am as ee,P as te,Y as R,a_ as oe,a0 as w,a$ as ne,Z as $,W as G,r as z,R as U,a5 as O,a2 as B,b0 as re,b1 as ae,w as M,a6 as se,a7 as Z,b2 as ie,o as le,av as de,b3 as ce,aC as ue,aa as fe,b4 as pe,b5 as ve,a4 as he,ag as ge,aT as me,a as q,q as be,f as D,aU as _e,l as J,e as j,n as K,i as P,z as xe,x as ye,A as ze,aI as ke,b as we,t as Se}from"./index-a2667843.js";const $e=L({name:"ArrowBack",render(){return f("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},f("path",{d:"M0 0h24v24H0V0z",fill:"none"}),f("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),V=ee&&"loading"in document.createElement("img"),Oe=(e={})=>{var t;const{root:a=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(t=e.threshold)!==null&&t!==void 0?t:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof a=="string"?document.querySelector(a):a)||document.documentElement})}},A=new WeakMap,W=new WeakMap,N=new WeakMap,Re=(e,t,a)=>{if(!e)return()=>{};const o=Oe(t),{root:s}=o.options;let r;const u=A.get(s);u?r=u:(r=new Map,A.set(s,r));let i,l;r.has(o.hash)?(l=r.get(o.hash),l[1].has(e)||(i=l[0],l[1].add(e),i.observe(e))):(i=new IntersectionObserver(d=>{d.forEach(h=>{if(h.isIntersecting){const m=W.get(h.target),b=N.get(h.target);m&&m(),b&&(b.value=!0)}})},o.options),i.observe(e),l=[i,new Set([e])],r.set(o.hash,l));let v=!1;const g=()=>{v||(W.delete(e),N.delete(e),v=!0,l[1].has(e)&&(l[0].unobserve(e),l[1].delete(e)),l[1].size<=0&&r.delete(o.hash),r.size||A.delete(s))};return W.set(e,g),N.set(e,a),g},Ce=te("n-avatar-group"),je=R("avatar",`
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
`,[oe(w("&","--n-merged-color: var(--n-color-modal);")),ne(w("&","--n-merged-color: var(--n-color-popover);")),w("img",`
 width: 100%;
 height: 100%;
 `),$("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),R("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),$("text","line-height: 1.25")]),Ee=Object.assign(Object.assign({},B.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Ke=L({name:"Avatar",props:Ee,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:a}=G(e),o=z(!1);let s=null;const r=z(null),u=z(null),i=()=>{const{value:n}=r;if(n&&(s===null||s!==n.innerHTML)){s=n.innerHTML;const{value:c}=u;if(c){const{offsetWidth:_,offsetHeight:p}=c,{offsetWidth:y,offsetHeight:H}=n,T=.9,F=Math.min(_/y*T,p/H*T,1);n.style.transform=`translateX(-50%) translateY(-50%) scale(${F})`}}},l=U(Ce,null),v=O(()=>{const{size:n}=e;if(n)return n;const{size:c}=l||{};return c||"medium"}),g=B("Avatar","-avatar",je,re,e,t),d=U(ae,null),h=O(()=>{if(l)return!0;const{round:n,circle:c}=e;return n!==void 0||c!==void 0?n||c:d?d.roundRef.value:!1}),m=O(()=>l?!0:e.bordered||!1),b=n=>{var c;if(!k.value)return;o.value=!0;const{onError:_,imgProps:p}=e;(c=p==null?void 0:p.onError)===null||c===void 0||c.call(p,n),_&&_(n)};M(()=>e.src,()=>o.value=!1);const S=O(()=>{const n=v.value,c=h.value,_=m.value,{color:p}=e,{self:{borderRadius:y,fontSize:H,color:T,border:F,colorModal:Y,colorPopover:X},common:{cubicBezierEaseInOut:Q}}=g.value;let I;return typeof n=="number"?I=`${n}px`:I=g.value.self[se("height",n)],{"--n-font-size":H,"--n-border":_?F:"none","--n-border-radius":c?"50%":y,"--n-color":p||T,"--n-color-modal":p||Y,"--n-color-popover":p||X,"--n-bezier":Q,"--n-merged-size":`var(--n-avatar-size-override, ${I})`}}),x=a?Z("avatar",O(()=>{const n=v.value,c=h.value,_=m.value,{color:p}=e;let y="";return n&&(typeof n=="number"?y+=`a${n}`:y+=n[0]),c&&(y+="b"),_&&(y+="c"),p&&(y+=ie(p)),y}),S,e):void 0,k=z(!e.lazy);le(()=>{if(V)return;let n;const c=de(()=>{n==null||n(),n=void 0,e.lazy&&(n=Re(u.value,e.intersectionObserverOptions,k))});ce(()=>{c(),n==null||n()})});const C=z(!e.lazy);return{textRef:r,selfRef:u,mergedRoundRef:h,mergedClsPrefix:t,fitTextTransform:i,cssVars:a?void 0:S,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender,hasLoadError:o,handleError:b,shouldStartLoading:k,loaded:C,mergedOnLoad:n=>{var c;const{onLoad:_,imgProps:p}=e;_==null||_(n),(c=p==null?void 0:p.onLoad)===null||c===void 0||c.call(p,n),C.value=!0}}},render(){var e,t;const{$slots:a,src:o,mergedClsPrefix:s,lazy:r,onRender:u,mergedOnLoad:i,shouldStartLoading:l,loaded:v,hasLoadError:g}=this;u==null||u();let d;const h=!v&&!g&&(this.renderPlaceholder?this.renderPlaceholder():(t=(e=this.$slots).placeholder)===null||t===void 0?void 0:t.call(e));return this.hasLoadError?d=this.renderFallback?this.renderFallback():ue(a.fallback,()=>[f("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):d=fe(a.default,m=>{if(m)return f(pe,{onResize:this.fitTextTransform},{default:()=>f("span",{ref:"textRef",class:`${s}-avatar__text`},m)});if(o){const{imgProps:b}=this;return f("img",Object.assign(Object.assign({},b),{loading:V&&!this.intersectionObserverOptions&&r?"lazy":"eager",src:V||l||v?o:void 0,onLoad:i,"data-image-src":o,onError:this.handleError,style:[b==null?void 0:b.style,{objectFit:this.objectFit},h?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),f("span",{ref:"selfRef",class:[`${s}-avatar`,this.themeClass],style:this.cssVars},d,r&&h)}}),Le=w([R("page-header-header",`
 margin-bottom: 20px;
 `),R("page-header",`
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[$("main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `),$("back",`
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `,[w("&:hover","color: var(--n-back-color-hover);"),w("&:active","color: var(--n-back-color-pressed);")]),$("avatar",`
 display: flex;
 margin-right: 12px
 `),$("title",`
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `),$("subtitle",`
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]),R("page-header-content",`
 font-size: var(--n-font-size);
 `,[w("&:not(:first-child)","margin-top: 20px;")]),R("page-header-footer",`
 font-size: var(--n-font-size);
 `,[w("&:not(:first-child)","margin-top: 20px;")])]),Te=Object.assign(Object.assign({},B.props),{title:String,subtitle:String,extra:String,onBack:Function}),Ge=L({name:"PageHeader",props:Te,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:a,inlineThemeDisabled:o}=G(e),s=B("PageHeader","-page-header",Le,ve,e,t),r=he("PageHeader",a,t),u=O(()=>{const{self:{titleTextColor:l,subtitleTextColor:v,backColor:g,fontSize:d,titleFontSize:h,backSize:m,titleFontWeight:b,backColorHover:S,backColorPressed:x},common:{cubicBezierEaseInOut:k}}=s.value;return{"--n-title-text-color":l,"--n-title-font-size":h,"--n-title-font-weight":b,"--n-font-size":d,"--n-back-size":m,"--n-subtitle-text-color":v,"--n-back-color":g,"--n-back-color-hover":S,"--n-back-color-pressed":x,"--n-bezier":k}}),i=o?Z("page-header",void 0,u,e):void 0;return{rtlEnabled:r,mergedClsPrefix:t,cssVars:o?void 0:u,themeClass:i==null?void 0:i.themeClass,onRender:i==null?void 0:i.onRender}},render(){var e;const{onBack:t,title:a,subtitle:o,extra:s,mergedClsPrefix:r,cssVars:u,$slots:i}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:l,subtitle:v,extra:g,default:d,header:h,avatar:m,footer:b,back:S}=i,x=t,k=a||l,C=o||v,n=s||g;return f("div",{style:u,class:[`${r}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${r}-page-header-wrapper--rtl`]},h?f("div",{class:`${r}-page-header-header`,key:"breadcrumb"},h()):null,(x||m||k||C||n)&&f("div",{class:`${r}-page-header`,key:"header"},f("div",{class:`${r}-page-header__main`,key:"back"},x?f("div",{class:`${r}-page-header__back`,onClick:t},S?S():f(ge,{clsPrefix:r},{default:()=>f($e,null)})):null,m?f("div",{class:`${r}-page-header__avatar`},m()):null,k?f("div",{class:`${r}-page-header__title`,key:"title"},a||l()):null,C?f("div",{class:`${r}-page-header__subtitle`,key:"subtitle"},o||v()):null),n?f("div",{class:`${r}-page-header__extra`},s||g()):null),d?f("div",{class:`${r}-page-header-content`,key:"content"},d()):null,b?f("div",{class:`${r}-page-header-footer`,key:"footer"},b()):null)}}),E={none:"none",text:"text",html:"html",json:"json"},Me=Object.values(E).map(e=>({label:e,value:e})),Pe=(e,t="text",a=!1)=>{if(e=e.trim().replace(/ /gi," "),a&&(e=e.replace(/^\s*[\r\n]/gm,"")),t===E.text)return e;let o=e.split(`
`);if(o=o.map(s=>s.trim()),t===E.json)return o.length===1?JSON.stringify(o[0]):JSON.stringify(o,null,2);if(t===E.html)return o.join("<br>")},Be=L({name:"DialogCopyFormat",props:{visible:{type:Boolean,default:!1}},setup(e,{emit:t}){const a=me(e,t,"visible"),o=z(""),s=z(""),r=z(E.json),u=z(!0);M(o,()=>{i()}),M(r,()=>{i()}),M(u,()=>{i()});const i=()=>{s.value=Pe(o.value,r.value,u.value)};return{mVisible:a,textInput:o,textOutput:s,CopyModeOptions:Me,mMode:r,isTrimEmptyLines:u}}});const He={class:"style-tools"},Fe={class:"common-card"},Ie={class:"main-box font-code"};function De(e,t,a,o,s,r){const u=xe,i=ye,l=ze,v=ke,g=_e;return J(),be(g,{show:e.mVisible,"onUpdate:show":t[4]||(t[4]=d=>e.mVisible=d),preset:"dialog",title:"Text transformer",style:{"min-width":"800px"}},{default:D(()=>[j(l,{align:"center",style:{"margin-bottom":"10px"}},{default:D(()=>[K(" Mode: "),j(u,{size:"small",value:e.mMode,"onUpdate:value":t[0]||(t[0]=d=>e.mMode=d),options:e.CopyModeOptions,style:{width:"100px"}},null,8,["value","options"]),j(i,{size:"small",checked:e.isTrimEmptyLines,"onUpdate:checked":t[1]||(t[1]=d=>e.isTrimEmptyLines=d)},{default:D(()=>[K("Trim empty lines")]),_:1},8,["checked"])]),_:1}),P("div",He,[P("div",Fe,[P("div",Ie,[j(v,{class:"input-text",type:"textarea",value:e.textInput,"onUpdate:value":t[2]||(t[2]=d=>e.textInput=d),placeholder:"Text Input"},null,8,["value"]),j(v,{class:"input-text",type:"textarea",value:e.textOutput,"onUpdate:value":t[3]||(t[3]=d=>e.textOutput=d),placeholder:"Text Output"},null,8,["value"])])])])]),_:1},8,["show"])}const Ze=q(Be,[["render",De],["__scopeId","data-v-779945ae"]]),Ve=L({name:"DropZone",props:{text:{type:String,default:"Drop files here"}}});const Ae={class:"file-dropzone"},We={class:"border-dashed"};function Ne(e,t,a,o,s,r){return J(),we("div",Ae,[P("div",We,Se(e.text),1)])}const qe=q(Ve,[["render",Ne],["__scopeId","data-v-c4914fc9"]]),Je=({cbFiles:e,cb:t})=>{const a=z(!1);return{showDropzone:a,fileDragover(o){a.value=!0,o.preventDefault()},async fileDrop(o){o.preventDefault(),a.value=!1,typeof t=="function"&&t(o);const s=Array.from(o.dataTransfer.files);typeof e=="function"&&e(s)}}};export{Me as C,Ze as _,qe as a,E as b,Ke as c,Ge as d,Pe as f,Je as u};
