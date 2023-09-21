import{d as L,M as p,an as ae,Q as re,Z as T,b3 as se,a1 as $,b4 as le,$ as S,X as Y,r as y,S as Z,a6 as C,a3 as F,b5 as ie,b6 as de,w as R,a7 as ce,a8 as q,b7 as ue,o as fe,aw as pe,aN as ve,aD as me,ab as he,b8 as ge,b9 as be,a5 as _e,ah as ye,aY as xe,b as Q,x as G,i as A,aZ as ze,m as H,f as O,p as J,t as K,e as ee,I as X,F as ke,j as B,A as $e,y as we,aK as Se,B as Oe}from"./index-a24567b4.js";const Ce=L({name:"ArrowBack",render(){return p("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},p("path",{d:"M0 0h24v24H0V0z",fill:"none"}),p("path",{d:"M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"}))}}),V=ae&&"loading"in document.createElement("img"),Re=(e={})=>{var t;const{root:d=null}=e;return{hash:`${e.rootMargin||"0px 0px 0px 0px"}-${Array.isArray(e.threshold)?e.threshold.join(","):(t=e.threshold)!==null&&t!==void 0?t:"0"}`,options:Object.assign(Object.assign({},e),{root:(typeof d=="string"?document.querySelector(d):d)||document.documentElement})}},D=new WeakMap,W=new WeakMap,U=new WeakMap,Te=(e,t,d)=>{if(!e)return()=>{};const a=Re(t),{root:c}=a.options;let o;const s=D.get(c);s?o=s:(o=new Map,D.set(c,o));let l,r;o.has(a.hash)?(r=o.get(a.hash),r[1].has(e)||(l=r[0],r[1].add(e),l.observe(e))):(l=new IntersectionObserver(i=>{i.forEach(m=>{if(m.isIntersecting){const g=W.get(m.target),b=U.get(m.target);g&&g(),b&&(b.value=!0)}})},a.options),l.observe(e),r=[l,new Set([e])],o.set(a.hash,r));let f=!1;const h=()=>{f||(W.delete(e),U.delete(e),f=!0,r[1].has(e)&&(r[0].unobserve(e),r[1].delete(e)),r[1].size<=0&&o.delete(a.hash),o.size||D.delete(c))};return W.set(e,h),U.set(e,d),h},je=re("n-avatar-group"),Ee=T("avatar",`
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
 `),S("text","line-height: 1.25")]),Le=Object.assign(Object.assign({},F.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),Ge=L({name:"Avatar",props:Le,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:d}=Y(e),a=y(!1);let c=null;const o=y(null),s=y(null),l=()=>{const{value:n}=o;if(n&&(c===null||c!==n.innerHTML)){c=n.innerHTML;const{value:u}=s;if(u){const{offsetWidth:_,offsetHeight:v}=u,{offsetWidth:z,offsetHeight:P}=n,M=.9,I=Math.min(_/z*M,v/P*M,1);n.style.transform=`translateX(-50%) translateY(-50%) scale(${I})`}}},r=Z(je,null),f=C(()=>{const{size:n}=e;if(n)return n;const{size:u}=r||{};return u||"medium"}),h=F("Avatar","-avatar",Ee,ie,e,t),i=Z(de,null),m=C(()=>{if(r)return!0;const{round:n,circle:u}=e;return n!==void 0||u!==void 0?n||u:i?i.roundRef.value:!1}),g=C(()=>r?!0:e.bordered||!1),b=n=>{var u;if(!k.value)return;a.value=!0;const{onError:_,imgProps:v}=e;(u=v==null?void 0:v.onError)===null||u===void 0||u.call(v,n),_&&_(n)};R(()=>e.src,()=>a.value=!1);const w=C(()=>{const n=f.value,u=m.value,_=g.value,{color:v}=e,{self:{borderRadius:z,fontSize:P,color:M,border:I,colorModal:te,colorPopover:oe},common:{cubicBezierEaseInOut:ne}}=h.value;let N;return typeof n=="number"?N=`${n}px`:N=h.value.self[ce("height",n)],{"--n-font-size":P,"--n-border":_?I:"none","--n-border-radius":u?"50%":z,"--n-color":v||M,"--n-color-modal":v||te,"--n-color-popover":v||oe,"--n-bezier":ne,"--n-merged-size":`var(--n-avatar-size-override, ${N})`}}),x=d?q("avatar",C(()=>{const n=f.value,u=m.value,_=g.value,{color:v}=e;let z="";return n&&(typeof n=="number"?z+=`a${n}`:z+=n[0]),u&&(z+="b"),_&&(z+="c"),v&&(z+=ue(v)),z}),w,e):void 0,k=y(!e.lazy);fe(()=>{if(V)return;let n;const u=pe(()=>{n==null||n(),n=void 0,e.lazy&&(n=Te(s.value,e.intersectionObserverOptions,k))});ve(()=>{u(),n==null||n()})});const E=y(!e.lazy);return{textRef:o,selfRef:s,mergedRoundRef:m,mergedClsPrefix:t,fitTextTransform:l,cssVars:d?void 0:w,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender,hasLoadError:a,handleError:b,shouldStartLoading:k,loaded:E,mergedOnLoad:n=>{var u;const{onLoad:_,imgProps:v}=e;_==null||_(n),(u=v==null?void 0:v.onLoad)===null||u===void 0||u.call(v,n),E.value=!0}}},render(){var e,t;const{$slots:d,src:a,mergedClsPrefix:c,lazy:o,onRender:s,mergedOnLoad:l,shouldStartLoading:r,loaded:f,hasLoadError:h}=this;s==null||s();let i;const m=!f&&!h&&(this.renderPlaceholder?this.renderPlaceholder():(t=(e=this.$slots).placeholder)===null||t===void 0?void 0:t.call(e));return this.hasLoadError?i=this.renderFallback?this.renderFallback():me(d.fallback,()=>[p("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):i=he(d.default,g=>{if(g)return p(ge,{onResize:this.fitTextTransform},{default:()=>p("span",{ref:"textRef",class:`${c}-avatar__text`},g)});if(a){const{imgProps:b}=this;return p("img",Object.assign(Object.assign({},b),{loading:V&&!this.intersectionObserverOptions&&o?"lazy":"eager",src:V||r||f?a:void 0,onLoad:l,"data-image-src":a,onError:this.handleError,style:[b==null?void 0:b.style,{objectFit:this.objectFit},m?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),p("span",{ref:"selfRef",class:[`${c}-avatar`,this.themeClass],style:this.cssVars},i,o&&m)}}),Me=$([T("page-header-header",`
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
 `,[$("&:not(:first-child)","margin-top: 20px;")])]),He=Object.assign(Object.assign({},F.props),{title:String,subtitle:String,extra:String,onBack:Function}),Je=L({name:"PageHeader",props:He,setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:d,inlineThemeDisabled:a}=Y(e),c=F("PageHeader","-page-header",Me,be,e,t),o=_e("PageHeader",d,t),s=C(()=>{const{self:{titleTextColor:r,subtitleTextColor:f,backColor:h,fontSize:i,titleFontSize:m,backSize:g,titleFontWeight:b,backColorHover:w,backColorPressed:x},common:{cubicBezierEaseInOut:k}}=c.value;return{"--n-title-text-color":r,"--n-title-font-size":m,"--n-title-font-weight":b,"--n-font-size":i,"--n-back-size":g,"--n-subtitle-text-color":f,"--n-back-color":h,"--n-back-color-hover":w,"--n-back-color-pressed":x,"--n-bezier":k}}),l=a?q("page-header",void 0,s,e):void 0;return{rtlEnabled:o,mergedClsPrefix:t,cssVars:a?void 0:s,themeClass:l==null?void 0:l.themeClass,onRender:l==null?void 0:l.onRender}},render(){var e;const{onBack:t,title:d,subtitle:a,extra:c,mergedClsPrefix:o,cssVars:s,$slots:l}=this;(e=this.onRender)===null||e===void 0||e.call(this);const{title:r,subtitle:f,extra:h,default:i,header:m,avatar:g,footer:b,back:w}=l,x=t,k=d||r,E=a||f,n=c||h;return p("div",{style:s,class:[`${o}-page-header-wrapper`,this.themeClass,this.rtlEnabled&&`${o}-page-header-wrapper--rtl`]},m?p("div",{class:`${o}-page-header-header`,key:"breadcrumb"},m()):null,(x||g||k||E||n)&&p("div",{class:`${o}-page-header`,key:"header"},p("div",{class:`${o}-page-header__main`,key:"back"},x?p("div",{class:`${o}-page-header__back`,onClick:t},w?w():p(ye,{clsPrefix:o},{default:()=>p(Ce,null)})):null,g?p("div",{class:`${o}-page-header__avatar`},g()):null,k?p("div",{class:`${o}-page-header__title`,key:"title"},d||r()):null,E?p("div",{class:`${o}-page-header__subtitle`,key:"subtitle"},a||f()):null),n?p("div",{class:`${o}-page-header__extra`},c||h()):null),i?p("div",{class:`${o}-page-header-content`,key:"content"},i()):null,b?p("div",{class:`${o}-page-header-footer`,key:"footer"},b()):null)}}),j={none:"none",text:"text",html:"html",json:"json"},Be=Object.values(j).map(e=>({label:e,value:e})),Fe=(e,t="text",d={})=>{const{isTrimEmptyLines:a=!1,htmlTagName:c="",htmlAttrs:o=""}=d;if(e=e.trim().replace(/ /gi," "),a&&(e=e.replace(/^\s*[\r\n]/gm,"")),t===j.text)return e;let s=e.split(`
`);if(s=s.map(l=>l.trim()),t===j.json)return s.length===1?JSON.stringify(s[0]):JSON.stringify(s,null,2);if(t===j.html)return c?s.map(l=>`<${c}${o?` ${o}`:""}>${l}</${c}>`).join(`
`):s.join("<br>")},Pe=L({name:"DialogCopyFormat",props:{visible:{type:Boolean,default:!1}},setup(e,{emit:t}){const d=xe(e,t,"visible"),a=y(""),c=y(""),o=y(j.json),s=y(!0),l=y(""),r=y("");R(a,()=>{f()}),R(o,()=>{f()}),R(s,()=>{f()}),R(l,()=>{f()}),R(r,()=>{f()});const f=()=>{c.value=Fe(a.value,o.value,{isTrimEmptyLines:s.value,htmlTagName:l.value,htmlAttrs:r.value})};return{mVisible:d,textInput:a,textOutput:c,CopyMode:j,CopyModeOptions:Be,mMode:o,isTrimEmptyLines:s,htmlTagName:l,htmlAttrs:r}}});const Ie={class:"style-tools"},Ne={class:"common-card"},Ae={class:"main-box font-code"};function Ve(e,t,d,a,c,o){const s=$e,l=we,r=Se,f=Oe,h=ze;return H(),G(h,{show:e.mVisible,"onUpdate:show":t[6]||(t[6]=i=>e.mVisible=i),preset:"dialog",title:e.$t("common.text_transformer"),style:{"min-width":"800px"}},{default:A(()=>[O(f,{align:"center",style:{"margin-bottom":"10px"}},{default:A(()=>[J(K(e.$t("common.mode"))+": ",1),O(s,{size:"small",value:e.mMode,"onUpdate:value":t[0]||(t[0]=i=>e.mMode=i),options:e.CopyModeOptions,style:{width:"100px"}},null,8,["value","options"]),O(l,{size:"small",checked:e.isTrimEmptyLines,"onUpdate:checked":t[1]||(t[1]=i=>e.isTrimEmptyLines=i)},{default:A(()=>[J(K(e.$t("msgs.trim_empty_lines")),1)]),_:1},8,["checked"]),e.mMode===e.CopyMode.html?(H(),ee(ke,{key:0},[O(r,{value:e.htmlTagName,"onUpdate:value":t[2]||(t[2]=i=>e.htmlTagName=i),clearable:"",placeholder:"HTML Tag Name",size:"small"},null,8,["value"]),e.htmlTagName?(H(),G(r,{key:0,value:e.htmlAttrs,"onUpdate:value":t[3]||(t[3]=i=>e.htmlAttrs=i),clearable:"",placeholder:"HTML Attrs",size:"small"},null,8,["value"])):X("",!0)],64)):X("",!0)]),_:1}),B("div",Ie,[B("div",Ne,[B("div",Ae,[O(r,{class:"input-text",type:"textarea",value:e.textInput,"onUpdate:value":t[4]||(t[4]=i=>e.textInput=i),placeholder:"Text Input"},null,8,["value"]),O(r,{class:"input-text",type:"textarea",value:e.textOutput,"onUpdate:value":t[5]||(t[5]=i=>e.textOutput=i),placeholder:"Text Output"},null,8,["value"])])])])]),_:1},8,["show","title"])}const Xe=Q(Pe,[["render",Ve],["__scopeId","data-v-8bc57f37"]]),De=L({name:"DropZone",props:{text:{type:String,default:""}}});const We={class:"file-dropzone"},Ue={class:"border-dashed"};function Ke(e,t,d,a,c,o){return H(),ee("div",We,[B("div",Ue,K(e.text||e.$t("msgs.drop_files_here")),1)])}const Ye=Q(De,[["render",Ke],["__scopeId","data-v-41639bbe"]]),qe=({cbFiles:e,cb:t})=>{const d=y(!1);return{showDropzone:d,fileDragover(a){d.value=!0,a.preventDefault()},async fileDrop(a){a.preventDefault(),d.value=!1,typeof t=="function"&&t(a);const c=Array.from(a.dataTransfer.files);typeof e=="function"&&e(c)}}};export{j as C,Xe as _,Ye as a,Be as b,Ge as c,Je as d,Fe as f,qe as u};
