import{d as j,M as p,an as ae,Q as re,Z as T,b4 as se,a1 as $,b5 as le,$ as S,X as q,r as y,S as Z,a6 as C,a3 as F,b6 as ie,b7 as de,w as R,a7 as ce,a8 as Q,b8 as ue,o as fe,aw as pe,aN as ve,aD as me,ab as he,b9 as ge,ba as be,a5 as _e,ah as ye,aZ as xe,b as Y,x as G,i as A,a_ as ze,m as B,f as O,p as J,t as K,e as ee,I as X,F as ke,j as H,A as $e,y as we,aK as Se,B as Oe}from"./index-66297b3d.js";const Ce=j({name:"ArrowBack",render(){return p("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},p("path",{d:"M0 0h24v24H0V0z",fill:"none"}),p("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),V=ae&&"loading"in document.createElement("img"),Re=(e={})=>{var t;const{root:i=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(t=e.threshold)!==null&&t!==void 0?t:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof i=="string"?document.querySelector(i):i)||document.documentElement})}},D=new WeakMap,W=new WeakMap,U=new WeakMap,Te=(e,t,i)=>{if(!e)return()=>{};const a=Re(t),{root:r}=a.options;let o;const l=D.get(r);l?o=l:(o=new Map,D.set(r,o));let d,s;o.has(a.hash)?(s=o.get(a.hash),s[1].has(e)||(d=s[0],s[1].add(e),d.observe(e))):(d=new IntersectionObserver(c=>{c.forEach(m=>{if(m.isIntersecting){const g=W.get(m.target),b=U.get(m.target);g&&g(),b&&(b.value=!0)}})},a.options),d.observe(e),s=[d,new Set([e])],o.set(a.hash,s));let f=!1;const h=()=>{f||(W.delete(e),U.delete(e),f=!0,s[1].has(e)&&(s[0].unobserve(e),s[1].delete(e)),s[1].size<=0&&o.delete(a.hash),o.size||D.delete(r))};return W.set(e,h),U.set(e,i),h},Ee=re("n-avatar-group"),Le=T("avatar",`
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
`,[se($("&","--n-merged-color: var(--n-color-modal);")),le($("&","--n-merged-color: var(--n-color-popover);")),$("img",`
 width: 100%;
 height: 100%;
 `),S("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),T("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),S("text","line-height: 1.25")]),je=Object.assign(Object.assign({},F.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Je=j({name:"Avatar",props:je,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:i}=q(e),a=y(!1);let r=null;const o=y(null),l=y(null),d=()=>{const{value:n}=o;if(n&&(r===null||r!==n.innerHTML)){r=n.innerHTML;const{value:u}=l;if(u){const{offsetWidth:_,offsetHeight:v}=u,{offsetWidth:z,offsetHeight:P}=n,M=.9,I=Math.min(_/z*M,v/P*M,1);n.style.transform=`translateX(-50%) translateY(-50%) scale(${I})`}}},s=Z(Ee,null),f=C(()=>{const{size:n}=e;if(n)return n;const{size:u}=s||{};return u||"medium"}),h=F("Avatar","-avatar",Le,ie,e,t),c=Z(de,null),m=C(()=>{if(s)return!0;const{round:n,circle:u}=e;return n!==void 0||u!==void 0?n||u:c?c.roundRef.value:!1}),g=C(()=>s?!0:e.bordered||!1),b=n=>{var u;if(!k.value)return;a.value=!0;const{onError:_,imgProps:v}=e;(u=v==null?void 0:v.onError)===null||u===void 0||u.call(v,n),_&&_(n)};R(()=>e.src,()=>a.value=!1);const w=C(()=>{const n=f.value,u=m.value,_=g.value,{color:v}=e,{self:{borderRadius:z,fontSize:P,color:M,border:I,colorModal:te,colorPopover:oe},common:{cubicBezierEaseInOut:ne}}=h.value;let N;return typeof n=="number"?N=`${n}px`:N=h.value.self[ce("height",n)],{"--n-font-size":P,"--n-border":_?I:"none","--n-border-radius":u?"50%":z,"--n-color":v||M,"--n-color-modal":v||te,"--n-color-popover":v||oe,"--n-bezier":ne,"--n-merged-size":`var(--n-avatar-size-override, ${N})`}}),x=i?Q("avatar",C(()=>{const n=f.value,u=m.value,_=g.value,{color:v}=e;let z="";return n&&(typeof n=="number"?z+=`a${n}`:z+=n[0]),u&&(z+="b"),_&&(z+="c"),v&&(z+=ue(v)),z}),w,e):void 0,k=y(!e.lazy);fe(()=>{if(V)return;let n;const u=pe(()=>{n==null||n(),n=void 0,e.lazy&&(n=Te(l.value,e.intersectionObserverOptions,k))});ve(()=>{u(),n==null||n()})});const L=y(!e.lazy);return{textRef:o,selfRef:l,mergedRoundRef:m,mergedClsPrefix:t,fitTextTransform:d,cssVars:i?void 0:w,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender,hasLoadError:a,handleError:b,shouldStartLoading:k,loaded:L,mergedOnLoad:n=>{var u;const{onLoad:_,imgProps:v}=e;_==null||_(n),(u=v==null?void 0:v.onLoad)===null||u===void 0||u.call(v,n),L.value=!0}}},render(){var e,t;const{$slots:i,src:a,mergedClsPrefix:r,lazy:o,onRender:l,mergedOnLoad:d,shouldStartLoading:s,loaded:f,hasLoadError:h}=this;l==null||l();let c;const m=!f&&!h&&(this.renderPlaceholder?this.renderPlaceholder():(t=(e=this.$slots).placeholder)===null||t===void 0?void 0:t.call(e));return this.hasLoadError?c=this.renderFallback?this.renderFallback():me(i.fallback,()=>[p("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):c=he(i.default,g=>{if(g)return p(ge,{onResize:this.fitTextTransform},{default:()=>p("span",{ref:"textRef",class:`${r}-avatar__text`},g)});if(a){const{imgProps:b}=this;return p("img",Object.assign(Object.assign({},b),{loading:V&&!this.intersectionObserverOptions&&o?"lazy":"eager",src:V||s||f?a:void 0,onLoad:d,"data-image-src":a,onError:this.handleError,style:[b==null?void 0:b.style,{objectFit:this.objectFit},m?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),p("span",{ref:"selfRef",class:[`${r}-avatar`,this.themeClass],style:this.cssVars},c,o&&m)}}),Me=$([T("page-header-header",`
 margin-bottom: 20px;
 `),T("page-header",`
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
 `)]),T("page-header-content",`
 font-size: var(--n-font-size);
 `,[$("&:not(:first-child)","margin-top: 20px;")]),T("page-header-footer",`
 font-size: var(--n-font-size);
 `,[$("&:not(:first-child)","margin-top: 20px;")])]),Be=Object.assign(Object.assign({},F.props),{title:String,subtitle:String,extra:String,onBack:Function}),Xe=j({name:"PageHeader",props:Be,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:i,inlineThemeDisabled:a}=q(e),r=F("PageHeader","-page-header",Me,be,e,t),o=_e("PageHeader",i,t),l=C(()=>{const{self:{titleTextColor:s,subtitleTextColor:f,backColor:h,fontSize:c,titleFontSize:m,backSize:g,titleFontWeight:b,backColorHover:w,backColorPressed:x},common:{cubicBezierEaseInOut:k}}=r.value;return{"--n-title-text-color":s,"--n-title-font-size":m,"--n-title-font-weight":b,"--n-font-size":c,"--n-back-size":g,"--n-subtitle-text-color":f,"--n-back-color":h,"--n-back-color-hover":w,"--n-back-color-pressed":x,"--n-bezier":k}}),d=a?Q("page-header",void 0,l,e):void 0;return{rtlEnabled:o,mergedClsPrefix:t,cssVars:a?void 0:l,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){var e;const{onBack:t,title:i,subtitle:a,extra:r,mergedClsPrefix:o,cssVars:l,$slots:d}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:s,subtitle:f,extra:h,default:c,header:m,avatar:g,footer:b,back:w}=d,x=t,k=i||s,L=a||f,n=r||h;return p("div",{style:l,class:[`${o}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${o}-page-header-wrapper--rtl`]},m?p("div",{class:`${o}-page-header-header`,key:"breadcrumb"},m()):null,(x||g||k||L||n)&&p("div",{class:`${o}-page-header`,key:"header"},p("div",{class:`${o}-page-header__main`,key:"back"},x?p("div",{class:`${o}-page-header__back`,onClick:t},w?w():p(ye,{clsPrefix:o},{default:()=>p(Ce,null)})):null,g?p("div",{class:`${o}-page-header__avatar`},g()):null,k?p("div",{class:`${o}-page-header__title`,key:"title"},i||s()):null,L?p("div",{class:`${o}-page-header__subtitle`,key:"subtitle"},a||f()):null),n?p("div",{class:`${o}-page-header__extra`},r||h()):null),c?p("div",{class:`${o}-page-header-content`,key:"content"},c()):null,b?p("div",{class:`${o}-page-header-footer`,key:"footer"},b()):null)}}),E={none:"none",text:"text",html:"html",json:"json"},He=Object.values(E).map(e=>({label:e,value:e})),Fe=(e,t="text",i={})=>{const{isTrimEmptyLines:a=!1,htmlTagName:r="",htmlAttrs:o=""}=i;if(e=e.trim().replace(/ /gi," "),a&&(e=e.replace(/^\s*[\r\n]/gm,"")),t===E.text)return e;let l=e.split(`
`);if(l=l.map(d=>d.trim()),t===E.json)return l.length===1?JSON.stringify(l[0]):JSON.stringify(l,null,2);if(t===E.html)return r?l.map(d=>`<${r}${o?` ${o}`:""}>${d}</${r}>`).join(`
`):l.join("<br>")},Pe=j({name:"DialogCopyFormat",props:{visible:{type:Boolean,default:!1}},setup(e,{emit:t}){const i=xe(e,t,"visible"),a=y(""),r=y(""),o=y(E.json),l=y(!0),d=y(""),s=y("");R(a,()=>{f()}),R(o,()=>{f()}),R(l,()=>{f()}),R(d,()=>{f()}),R(s,()=>{f()});const f=()=>{r.value=Fe(a.value,o.value,{isTrimEmptyLines:l.value,htmlTagName:d.value,htmlAttrs:s.value})};return{mVisible:i,textInput:a,textOutput:r,CopyMode:E,CopyModeOptions:He,mMode:o,isTrimEmptyLines:l,htmlTagName:d,htmlAttrs:s}}});const Ie={class:"style-tools"},Ne={class:"common-card"},Ae={class:"main-box font-code"};function Ve(e,t,i,a,r,o){const l=$e,d=we,s=Se,f=Oe,h=ze;return B(),G(h,{show:e.mVisible,"onUpdate:show":t[6]||(t[6]=c=>e.mVisible=c),preset:"dialog",title:e.$t("common.text_transformer"),style:{"min-width":"800px"}},{default:A(()=>[O(f,{align:"center",style:{"margin-bottom":"10px"}},{default:A(()=>[J(K(e.$t("common.mode"))+": ",1),O(l,{size:"small",value:e.mMode,"onUpdate:value":t[0]||(t[0]=c=>e.mMode=c),options:e.CopyModeOptions,style:{width:"100px"}},null,8,["value","options"]),O(d,{size:"small",checked:e.isTrimEmptyLines,"onUpdate:checked":t[1]||(t[1]=c=>e.isTrimEmptyLines=c)},{default:A(()=>[J(K(e.$t("msgs.trim_empty_lines")),1)]),_:1},8,["checked"]),e.mMode===e.CopyMode.html?(B(),ee(ke,{key:0},[O(s,{value:e.htmlTagName,"onUpdate:value":t[2]||(t[2]=c=>e.htmlTagName=c),clearable:"",placeholder:"HTML Tag Name",size:"small"},null,8,["value"]),e.htmlTagName?(B(),G(s,{key:0,value:e.htmlAttrs,"onUpdate:value":t[3]||(t[3]=c=>e.htmlAttrs=c),clearable:"",placeholder:"HTML Attrs",size:"small"},null,8,["value"])):X("",!0)],64)):X("",!0)]),_:1}),H("div",Ie,[H("div",Ne,[H("div",Ae,[O(s,{class:"input-text",type:"textarea",value:e.textInput,"onUpdate:value":t[4]||(t[4]=c=>e.textInput=c),placeholder:"Text Input"},null,8,["value"]),O(s,{class:"input-text",type:"textarea",value:e.textOutput,"onUpdate:value":t[5]||(t[5]=c=>e.textOutput=c),placeholder:"Text Output"},null,8,["value"])])])])]),_:1},8,["show","title"])}const qe=Y(Pe,[["render",Ve],["__scopeId","data-v-8bc57f37"]]),De=j({name:"DropZone",props:{text:{type:String,default:""}}});const We={class:"file-dropzone"},Ue={class:"border-dashed"};function Ke(e,t,i,a,r,o){return B(),ee("div",We,[H("div",Ue,K(e.text||e.$t("msgs.drop_files_here")),1)])}const Qe=Y(De,[["render",Ke],["__scopeId","data-v-41639bbe"]]),Ze=e=>new Promise((t,i)=>{if(document.getElementById(e))t();else{const r=document.createElement("script");r.src=e,r.id=e,r.onload=function(){this.onerror=this.onload=null,t()},r.onerror=function(o){this.onerror=this.onload=null,i(o)},document.body.appendChild(r)}}),Ye=Ze,et=({cbFiles:e,cb:t})=>{const i=y(!1);return{showDropzone:i,fileDragover(a){i.value=!0,a.preventDefault()},async fileDrop(a){a.preventDefault(),i.value=!1,typeof t=="function"&&t(a);const r=Array.from(a.dataTransfer.files);typeof e=="function"&&e(r)}}};export{E as C,qe as _,Qe as a,He as b,Je as c,Ye as d,Xe as e,Fe as f,et as u};
