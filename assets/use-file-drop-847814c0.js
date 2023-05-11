import{d as L,L as f,am as ee,P as te,Y as R,aT as oe,a0 as w,aU as ne,Z as $,W as Z,r as z,R as U,a5 as O,a2 as B,aV as ae,aW as re,w as T,a6 as se,a7 as G,aX as ie,o as le,av as de,aY as ce,aC as ue,aa as fe,aZ as pe,a_ as ve,a4 as he,ag as ge,aM as me,a as Y,b as q,n as be,i as V,f as j,l as K,k as P,y as _e,q as xe,z as ye,aI as ze,aN as ke,e as we,t as Se}from"./index-df3cdee3.js";const $e=L({name:"ArrowBack",render(){return f("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},f("path",{d:"M0 0h24v24H0V0z",fill:"none"}),f("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),D=ee&&"loading"in document.createElement("img"),Oe=(e={})=>{var t;const{root:r=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(t=e.threshold)!==null&&t!==void 0?t:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof r=="string"?document.querySelector(r):r)||document.documentElement})}},W=new WeakMap,A=new WeakMap,N=new WeakMap,Re=(e,t,r)=>{if(!e)return()=>{};const o=Oe(t),{root:s}=o.options;let a;const u=W.get(s);u?a=u:(a=new Map,W.set(s,a));let i,l;a.has(o.hash)?(l=a.get(o.hash),l[1].has(e)||(i=l[0],l[1].add(e),i.observe(e))):(i=new IntersectionObserver(d=>{d.forEach(h=>{if(h.isIntersecting){const m=A.get(h.target),b=N.get(h.target);m&&m(),b&&(b.value=!0)}})},o.options),i.observe(e),l=[i,new Set([e])],a.set(o.hash,l));let v=!1;const g=()=>{v||(A.delete(e),N.delete(e),v=!0,l[1].has(e)&&(l[0].unobserve(e),l[1].delete(e)),l[1].size<=0&&a.delete(o.hash),a.size||W.delete(s))};return A.set(e,g),N.set(e,r),g},Ce=te("n-avatar-group"),je=R("avatar",`
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
 `),$("text","line-height: 1.25")]),Ee=Object.assign(Object.assign({},B.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Ke=L({name:"Avatar",props:Ee,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:r}=Z(e),o=z(!1);let s=null;const a=z(null),u=z(null),i=()=>{const{value:n}=a;if(n&&(s===null||s!==n.innerHTML)){s=n.innerHTML;const{value:c}=u;if(c){const{offsetWidth:_,offsetHeight:p}=c,{offsetWidth:y,offsetHeight:H}=n,M=.9,F=Math.min(_/y*M,p/H*M,1);n.style.transform=`translateX(-50%) translateY(-50%) scale(${F})`}}},l=U(Ce,null),v=O(()=>{const{size:n}=e;if(n)return n;const{size:c}=l||{};return c||"medium"}),g=B("Avatar","-avatar",je,ae,e,t),d=U(re,null),h=O(()=>{if(l)return!0;const{round:n,circle:c}=e;return n!==void 0||c!==void 0?n||c:d?d.roundRef.value:!1}),m=O(()=>l?!0:e.bordered||!1),b=n=>{var c;if(!k.value)return;o.value=!0;const{onError:_,imgProps:p}=e;(c=p==null?void 0:p.onError)===null||c===void 0||c.call(p,n),_&&_(n)};T(()=>e.src,()=>o.value=!1);const S=O(()=>{const n=v.value,c=h.value,_=m.value,{color:p}=e,{self:{borderRadius:y,fontSize:H,color:M,border:F,colorModal:J,colorPopover:X},common:{cubicBezierEaseInOut:Q}}=g.value;let I;return typeof n=="number"?I=`${n}px`:I=g.value.self[se("height",n)],{"--n-font-size":H,"--n-border":_?F:"none","--n-border-radius":c?"50%":y,"--n-color":p||M,"--n-color-modal":p||J,"--n-color-popover":p||X,"--n-bezier":Q,"--n-merged-size":`var(--n-avatar-size-override, ${I})`}}),x=r?G("avatar",O(()=>{const n=v.value,c=h.value,_=m.value,{color:p}=e;let y="";return n&&(typeof n=="number"?y+=`a${n}`:y+=n[0]),c&&(y+="b"),_&&(y+="c"),p&&(y+=ie(p)),y}),S,e):void 0,k=z(!e.lazy);le(()=>{if(D)return;let n;const c=de(()=>{n==null||n(),n=void 0,e.lazy&&(n=Re(u.value,e.intersectionObserverOptions,k))});ce(()=>{c(),n==null||n()})});const C=z(!e.lazy);return{textRef:a,selfRef:u,mergedRoundRef:h,mergedClsPrefix:t,fitTextTransform:i,cssVars:r?void 0:S,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender,hasLoadError:o,handleError:b,shouldStartLoading:k,loaded:C,mergedOnLoad:n=>{var c;const{onLoad:_,imgProps:p}=e;_==null||_(n),(c=p==null?void 0:p.onLoad)===null||c===void 0||c.call(p,n),C.value=!0}}},render(){var e,t;const{$slots:r,src:o,mergedClsPrefix:s,lazy:a,onRender:u,mergedOnLoad:i,shouldStartLoading:l,loaded:v,hasLoadError:g}=this;u==null||u();let d;const h=!v&&!g&&(this.renderPlaceholder?this.renderPlaceholder():(t=(e=this.$slots).placeholder)===null||t===void 0?void 0:t.call(e));return this.hasLoadError?d=this.renderFallback?this.renderFallback():ue(r.fallback,()=>[f("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):d=fe(r.default,m=>{if(m)return f(pe,{onResize:this.fitTextTransform},{default:()=>f("span",{ref:"textRef",class:`${s}-avatar__text`},m)});if(o){const{imgProps:b}=this;return f("img",Object.assign(Object.assign({},b),{loading:D&&!this.intersectionObserverOptions&&a?"lazy":"eager",src:D||l||v?o:void 0,onLoad:i,"data-image-src":o,onError:this.handleError,style:[b==null?void 0:b.style,{objectFit:this.objectFit},h?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),f("span",{ref:"selfRef",class:[`${s}-avatar`,this.themeClass],style:this.cssVars},d,a&&h)}}),Le=w([R("page-header-header",`
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
 `,[w("&:not(:first-child)","margin-top: 20px;")])]),Me=Object.assign(Object.assign({},B.props),{title:String,subtitle:String,extra:String,onBack:Function}),Ze=L({name:"PageHeader",props:Me,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:r,inlineThemeDisabled:o}=Z(e),s=B("PageHeader","-page-header",Le,ve,e,t),a=he("PageHeader",r,t),u=O(()=>{const{self:{titleTextColor:l,subtitleTextColor:v,backColor:g,fontSize:d,titleFontSize:h,backSize:m,titleFontWeight:b,backColorHover:S,backColorPressed:x},common:{cubicBezierEaseInOut:k}}=s.value;return{"--n-title-text-color":l,"--n-title-font-size":h,"--n-title-font-weight":b,"--n-font-size":d,"--n-back-size":m,"--n-subtitle-text-color":v,"--n-back-color":g,"--n-back-color-hover":S,"--n-back-color-pressed":x,"--n-bezier":k}}),i=o?G("page-header",void 0,u,e):void 0;return{rtlEnabled:a,mergedClsPrefix:t,cssVars:o?void 0:u,themeClass:i==null?void 0:i.themeClass,onRender:i==null?void 0:i.onRender}},render(){var e;const{onBack:t,title:r,subtitle:o,extra:s,mergedClsPrefix:a,cssVars:u,$slots:i}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:l,subtitle:v,extra:g,default:d,header:h,avatar:m,footer:b,back:S}=i,x=t,k=r||l,C=o||v,n=s||g;return f("div",{style:u,class:[`${a}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${a}-page-header-wrapper--rtl`]},h?f("div",{class:`${a}-page-header-header`,key:"breadcrumb"},h()):null,(x||m||k||C||n)&&f("div",{class:`${a}-page-header`,key:"header"},f("div",{class:`${a}-page-header__main`,key:"back"},x?f("div",{class:`${a}-page-header__back`,onClick:t},S?S():f(ge,{clsPrefix:a},{default:()=>f($e,null)})):null,m?f("div",{class:`${a}-page-header__avatar`},m()):null,k?f("div",{class:`${a}-page-header__title`,key:"title"},r||l()):null,C?f("div",{class:`${a}-page-header__subtitle`,key:"subtitle"},o||v()):null),n?f("div",{class:`${a}-page-header__extra`},s||g()):null),d?f("div",{class:`${a}-page-header-content`,key:"content"},d()):null,b?f("div",{class:`${a}-page-header-footer`,key:"footer"},b()):null)}}),E={none:"none",text:"text",html:"html",json:"json"},Te=Object.values(E).map(e=>({label:e,value:e})),Pe=(e,t="text",r=!1)=>{if(e=e.trim().replace(/ /gi," "),r&&(e=e.replace(/^\s*[\r\n]/gm,"")),t===E.text)return e;let o=e.split(`
`);if(o=o.map(s=>s.trim()),t===E.json)return o.length===1?JSON.stringify(o[0]):JSON.stringify(o,null,2);if(t===E.html)return o.join("<br>")},Be=L({name:"DialogCopyFormat",props:{visible:{type:Boolean,default:!1}},setup(e,{emit:t}){const r=me(e,t,"visible"),o=z(""),s=z(""),a=z(E.json),u=z(!0);T(o,()=>{i()}),T(a,()=>{i()}),T(u,()=>{i()});const i=()=>{s.value=Pe(o.value,a.value,u.value)};return{mVisible:r,textInput:o,textOutput:s,CopyModeOptions:Te,mMode:a,isTrimEmptyLines:u}}});const He={class:"style-tools"},Fe={class:"common-card"},Ie={class:"main-box font-code"};function Ve(e,t,r,o,s,a){const u=_e,i=xe,l=ye,v=ze,g=ke;return q(),be(g,{show:e.mVisible,"onUpdate:show":t[4]||(t[4]=d=>e.mVisible=d),preset:"dialog",title:"Text transformer",style:{"min-width":"800px"}},{default:V(()=>[j(l,{align:"center",style:{"margin-bottom":"10px"}},{default:V(()=>[K(" Mode: "),j(u,{size:"small",value:e.mMode,"onUpdate:value":t[0]||(t[0]=d=>e.mMode=d),options:e.CopyModeOptions,style:{width:"100px"}},null,8,["value","options"]),j(i,{size:"small",checked:e.isTrimEmptyLines,"onUpdate:checked":t[1]||(t[1]=d=>e.isTrimEmptyLines=d)},{default:V(()=>[K("Trim empty lines")]),_:1},8,["checked"])]),_:1}),P("div",He,[P("div",Fe,[P("div",Ie,[j(v,{class:"input-text",type:"textarea",value:e.textInput,"onUpdate:value":t[2]||(t[2]=d=>e.textInput=d),placeholder:"Text Input"},null,8,["value"]),j(v,{class:"input-text",type:"textarea",value:e.textOutput,"onUpdate:value":t[3]||(t[3]=d=>e.textOutput=d),placeholder:"Text Output"},null,8,["value"])])])])]),_:1},8,["show"])}const Ge=Y(Be,[["render",Ve],["__scopeId","data-v-779945ae"]]),De=L({name:"DropZone",props:{text:{type:String,default:"Drop files here"}}});const We={class:"file-dropzone"},Ae={class:"border-dashed"};function Ne(e,t,r,o,s,a){return q(),we("div",We,[P("div",Ae,Se(e.text),1)])}const Ye=Y(De,[["render",Ne],["__scopeId","data-v-c4914fc9"]]),qe=({cbFiles:e,cb:t})=>{const r=z(!1);return{showDropzone:r,fileDragover(o){r.value=!0,o.preventDefault()},async fileDrop(o){o.preventDefault(),r.value=!1,typeof t=="function"&&t(o);const s=Array.from(o.dataTransfer.files);typeof e=="function"&&e(s)}}};export{E as C,Ge as _,Ye as a,Te as b,Ke as c,Ze as d,Pe as f,qe as u};
