import{C as Oe}from"./CommonNavbar-CXa7dYOx.js";/* empty css             *//* empty css               *//* empty css                      *//* empty css                  *//* empty css                   */import{D as M,v as Ce,f as E,w as K,I as m,G as z,u as e,V as J,Q as Y,a6 as pe,P as d,i as re,L as c,k as P,J as D,N,X as I,M as T,H as W,O as ee,R as Ne,at as je,au as Me,a8 as O,ab as Be,q as te,s as qe,B as Ge,T as Ve,U as Je,ag as ze,av as Ke,E as ce,aa as Qe}from"./ui-CSZC0Zoz.js";import{j as xe,h as ne,f as $e,a9 as We,_ as ae,aa as Xe,$ as ye,ab as Ye,ac as Ze,u as et,ad as tt,k as st,G as de,g as Ie,Q as nt,i as at}from"./index-CUQlBJJE.js";/* empty css                   */import{_ as ot}from"./MarkdownRender.vue_vue_type_script_setup_true_lang-BnJ2stsE.js";import{a as Z,u as lt,m as it,A as ue,g as fe,c as rt,d as ct}from"./use-common-ai-Bx-MO55g.js";import{u as be}from"./useIDBKeyval-MUv7WYgB.js";import{a as dt}from"./prompts-DAsHJb5I.js";import{_ as _e}from"./monaco-UqvmWITJ.js";import{_ as Ee}from"./DropdownMenu.vue_vue_type_style_index_0_lang-CKDGyi-G.js";import{_ as Te}from"./index.vue_vue_type_script_setup_true_lang-Uslkj3ui.js";import{b as ut}from"./base64-utils-CmZqEc2r.js";import{A as V}from"./enum-CFuYk4Gd.js";import{_ as pt}from"./index.vue_vue_type_style_index_0_lang-BfZYfUj8.js";import"./utils-Dnh6i_59.js";import"./index-CT4fuZuP.js";import"./VueRender.vue_vue_type_script_lang-BHrxGf1R.js";import"./RectSwitch.vue_vue_type_style_index_0_lang-DD3gkKbd.js";const we=M({__name:"TextContent",props:{isDark:{type:Boolean,default:!1},isEditing:{type:Boolean,default:!1},text:{default:""}},emits:["update:text"],setup(f,{emit:t}){const l=f,{text:s,isEditing:n}=Ce(l),b=xe(l,"text",t),o=E();return K(n,()=>{setTimeout(()=>{o.value&&(o.value.scrollIntoView({behavior:"smooth"}),o.value.focus())})}),(h,v)=>e(n)?(c(),m("div",{key:0,class:J(["chat-content vgo-bg",{"markdown-body-dark":h.isDark}]),style:{width:"100%",padding:"0",display:"flex","border-radius":"2px"}},[Y(d("textarea",{class:"vgo-input font-code","onUpdate:modelValue":v[0]||(v[0]=p=>re(b)?b.value=p:null),rows:"14",ref_key:"editInputRef",ref:o,style:{width:"100%","font-size":"14px","box-sizing":"border-box"}},null,512),[[pe,e(b)]])],2)):(c(),z(ot,{key:1,class:"chat-content vgo-bg",dark:h.isDark,text:e(b)},null,8,["dark","text"]))}}),mt=["innerHTML"],ht={class:"chat-side"},vt={class:"chat-header"},gt=["title"],yt=["src","alt"],ft={key:1},bt={key:1,class:"chat-username"},_t={key:2,class:"chat-username _character"},wt={style:{width:"50px",height:"50px"},"element-loading-background":"transparent"},kt={key:0,class:"chat-images"},Ct={class:"chat-actions"},jt={key:0,class:"chat-date font-code"},xt=M({__name:"ChatBubble",props:{isDark:{type:Boolean,default:!1},allowDelete:{type:Boolean,default:!1},allowEdit:{type:Boolean},allowRetry:{type:Boolean,default:!1},isLoading:{type:Boolean,default:!1},character:{},item:{}},emits:["delete","retry"],setup(f,{emit:t}){const l=t,s=f,{item:n,character:a}=Ce(s),{t:b}=ne(),o=E(!1),h=E();K(o,()=>{setTimeout(()=>{h.value&&(h.value.scrollIntoView({behavior:"smooth"}),h.value.focus())})});const v=P(()=>n.value.role==="assistant"),p=P(()=>a.value&&a.value.avatar),x=E(),k=()=>{const g=x.value;g.parentElement.scrollTo({top:g.offsetTop-10,behavior:"smooth"})},S=()=>{const g=x.value,r=g.parentElement;r.scrollTo({top:g.offsetTop+g.offsetHeight-r.offsetHeight+10,behavior:"smooth"})},_=P(()=>{if(!n.value)return[];if(Array.isArray(n.value.content)){const g=n.value.content,r=[];return g.forEach(B=>{const{type:A,image_url:C}=B;A==="image_url"&&r.push(C)}),r}return[]}),L=P(()=>_.value.map(g=>g.url)),i=()=>{console.log(JSON.parse(JSON.stringify(n.value)))},y=g=>{window.$dialog.confirm("Delete item?",b("actions.confirm"),{type:"warning"}).then(()=>{l("delete",g)})},j=g=>{window.$mcUtils.handleExportFile("",g,"_chat.md")};return(g,r)=>{const B=je,A=Be;return e(n).role==="system"?(c(),m("div",{key:0,ref_key:"rootRef",ref:x,class:J(["ai-chat-bubble-system",{isEditing:e(o)}]),onClick:r[2]||(r[2]=C=>o.value=!0)},[e(o)?Y((c(),m("textarea",{key:0,ref_key:"editInputRef",ref:h,class:"vgo-input","onUpdate:modelValue":r[0]||(r[0]=C=>e(n).content=C),rows:"6",onBlur:r[1]||(r[1]=C=>o.value=!1)},null,544)),[[pe,e(n).content]]):e(n).content?(c(),m("div",{key:1,class:J(["chat-content",{"markdown-body-dark":g.isDark}]),innerHTML:`[${e(n).role}] ${e(n).content}`},null,10,mt)):D("",!0)],2)):(c(),m("div",{key:1,ref_key:"rootRef",ref:x,class:J(["ai-chat-bubble",{"no-avatar-image":!e(p),"is-reply":e(v),"is-editing":e(o)}])},[d("div",ht,[d("div",vt,[d("div",{class:"chat-avatar",onClick:i,title:`[${e(n).role}]
`+(e(a)?`${e(a).name}
[${e(a).provider}/${e(a).model}]`:"")},[e(a)?(c(),m(N,{key:0},[e(a).avatar?(c(),m("img",{key:0,src:e(a).avatar,alt:e(n).role},null,8,yt)):e(a).name?(c(),m("span",ft,I(e(a).name[0]),1)):D("",!0)],64)):(c(),m("span",bt,I(e(n).role),1)),e(a)?(c(),m("span",_t,I(e(a).name)+" ["+I(`${e(a).provider}/${e(a).model}`)+"]",1)):D("",!0)],8,gt),d("div",{class:"btn-jump-wrap"},[d("button",{class:"btn-no-style btn-jump",onClick:k},r[9]||(r[9]=[d("span",{class:"mdi mdi-chevron-up"},null,-1)])),d("button",{class:"btn-no-style btn-jump",onClick:S},r[10]||(r[10]=[d("span",{class:"mdi mdi-chevron-down"},null,-1)]))])])]),d("div",{class:J(["chat-body",{isEditing:e(o)}])},[T(Me,{name:"fade"},{default:W(()=>[g.isLoading?(c(),m("div",{key:0,class:J(["chat-content markdown-body vgo-bg",{"markdown-body-dark":g.isDark}])},[Y(d("div",wt,null,512),[[A,!0]])],2)):typeof e(n).content=="string"?(c(),z(we,{key:1,text:e(n).content,"onUpdate:text":r[3]||(r[3]=C=>e(n).content=C),"is-dark":g.isDark,"is-editing":e(o)},null,8,["text","is-dark","is-editing"])):Array.isArray(e(n).content)?(c(),m(N,{key:2},[(c(!0),m(N,null,ee(e(n).content,(C,R)=>(c(),m(N,{key:R},[C.type==="text"?Y((c(),z(we,{key:0,text:C.text,"onUpdate:text":Q=>C.text=Q,"is-dark":g.isDark,"is-editing":e(o)},null,8,["text","onUpdate:text","is-dark","is-editing"])),[[Ne,e(o)||!!C.text]]):D("",!0)],64))),128)),e(_).length?(c(),m("div",kt,[(c(!0),m(N,null,ee(e(_),(C,R)=>(c(),z(B,{key:R,src:C.url,alt:C.detail,"preview-src-list":e(L),"initial-index":R,"preview-teleported":!0,fit:"contain"},null,8,["src","alt","preview-src-list","initial-index"]))),128))])):D("",!0)],64)):D("",!0)]),_:1}),d("div",Ct,[e(n).timestamp?(c(),m("div",jt,I(e($e)(e(n).timestamp)),1)):D("",!0),e(o)?(c(),m("button",{key:1,class:"btn-no-style",onClick:r[4]||(r[4]=C=>o.value=!1)},[r[11]||(r[11]=d("span",{class:"mdi mdi-check"},null,-1)),O(" "+I(e(b)("actions.done")),1)])):(c(),m(N,{key:2},[d("button",{class:"btn-no-style",onClick:r[5]||(r[5]=C=>e(We)(e(n).content))},[r[12]||(r[12]=d("span",{class:"mdi mdi-content-copy"},null,-1)),O(" "+I(e(b)("actions.copy")),1)]),d("button",{class:"btn-no-style",onClick:r[6]||(r[6]=C=>j(e(n).content))},[r[13]||(r[13]=d("span",{class:"mdi mdi-download"},null,-1)),O(" "+I(e(b)("actions.download")),1)]),g.allowRetry?(c(),m("button",{key:0,class:"btn-no-style",onClick:r[7]||(r[7]=C=>g.$emit("retry"))},[r[14]||(r[14]=d("span",{class:"mdi mdi-refresh"},null,-1)),O(" "+I(e(b)("actions.retry")),1)])):D("",!0),g.allowEdit?(c(),m("button",{key:1,class:"btn-no-style",onClick:r[8]||(r[8]=C=>o.value=!0)},[r[15]||(r[15]=d("span",{class:"mdi mdi-pencil"},null,-1)),O(" "+I(e(b)("actions.edit")),1)])):D("",!0),g.allowDelete?(c(),m("button",{key:2,class:"btn-no-style",onClick:y},[r[16]||(r[16]=d("span",{class:"mdi mdi-delete-forever"},null,-1)),O(" "+I(e(b)("actions.delete")),1)])):D("",!0)],64))])],2)],2))}}}),ke=ae(xt,[["__scopeId","data-v-d1ef6389"]]),me=(f,t)=>{const l=new Map(f.map(s=>[s.id,s]));return t.forEach(s=>{l.set(s.id,s)}),Array.from(l.values()).map(te)},$t=Xe(()=>{const{data:f,isFinished:t}=be(ye.PAGE_CRAFT_AI_CHARACTERS,[]),{data:l,isFinished:s}=be(ye.PAGE_CRAFT_AI_HISTORY_GROUP,[]);return{characterList:f,allChatHistory:l,isCharacterListFinished:t,isAllChatHistory:s}}),he=()=>{const f=Z(),{characterList:t,allChatHistory:l,isCharacterListFinished:s,isAllChatHistory:n}=$t(),a=async()=>await(await fetch("./resources/ai-preset-characters.json")).json(),b=async()=>{t.value=me(t.value,await a()),window.$message.success({message:"Preset characters updated!"})},o=P(()=>t.value.find(p=>p.id===f.currentCharacterId)),h=P(()=>l.value.length?o.value?l.value.filter(p=>p.cid===o.value.id).reverse():[]:[]),v=P(()=>{if(h.value.length)return h.value.find(p=>p.id===f.currentChatHistoryId)});return{getPresetCharacters:a,updatePresetCharacters:b,characterList:t,allChatHistory:l,isCharacterListFinished:s,isAllChatHistory:n,currentCharacter:o,currentHistoryGroup:h,currentHistory:v}},It={class:"image-picker"},Et=["disabled"],Tt={class:"image-list"},St=["onClick"],At=M({__name:"ImagePicker",props:{images:{},disabled:{type:Boolean,default:!1}},emits:["update:images"],setup(f,{emit:t}){const n=xe(f,"images",t),a=o=>{n.value.splice(o,1)},b=async()=>{try{const o=await window.showOpenFilePicker({multiple:!0,types:[{description:"Image files",accept:{"image/*":[".png",".jpg",".jpeg",".gif",".webp"]}}]});for(const h of o){const v=await h.getFile();if(v.size<=5*1024*1024){const p=new FileReader;p.onload=x=>{x.target&&n.value.push(x.target.result)},p.readAsDataURL(v)}else window.$message.warning(`File ${v.name} is larger than 5MB and has been ignored.`)}}catch(o){console.error("Error picking files: ",o)}};return(o,h)=>{const v=je;return c(),m("div",It,[d("button",{class:"vgo-button",disabled:o.disabled,onClick:b,title:"Upload image..."},h[0]||(h[0]=[d("span",{class:"mdi mdi-image"},null,-1)]),8,Et),d("div",Tt,[(c(!0),m(N,null,ee(o.images,(p,x)=>(c(),m("div",{key:x,class:"image-item vgo-panel"},[T(v,{"preview-src-list":o.images,"initial-index":x,src:p,"preview-teleported":!0,fit:"contain"},null,8,["preview-src-list","initial-index","src"]),d("button",{onClick:k=>a(x),class:"btn-no-style",title:"Remove"},"✖",8,St)]))),128))])])}}}),Dt=ae(At,[["__scopeId","data-v-0329a659"]]),Se=async(f,t)=>{let l="";l+=`<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${t}</title>`;const n=(await _e(()=>import("./github-markdown-j42aQ9NS.js"),[],import.meta.url)).default,b=(await _e(()=>Promise.resolve().then(()=>Ht),void 0,import.meta.url)).default;return l+=`<style>body { font-family: Arial, sans-serif; }
* {box-sizing: border-box;}
${n}
${b}
.ai-chat-bubble-system {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #dddddd;
    font-size: 12px;
    color: #8a8a8a;
}
.btn-jump-wrap {
    display: none;
}
.chat-actions button {
    display: none;
}
.chat-date {
    margin-top: 10px;
    opacity: .5;
}
.chat-header {
    margin: -10px -10px 10px;
    padding: 4px 10px;
    background-color: #F6F8FA;
}
.chat-avatar {
    display: flex;
    align-items: center;
    height: 32px;
    gap: 10px;
}
.chat-avatar img {
    width: 32px;
    height: 32px;
}
.chat-username {
    font-weight: bold;
}
.ai-chat-bubble {
    border: 1px solid #dddddd;
    margin: 10px 0;
    padding: 10px;
}
._js-action-button {
    display: none;
}
pre.hljs-code-container {
    padding: 0;
}
.hljs-code-header {
    padding: 2px 10px;
    opacity: .5;
    white-space: normal;
}
.markdown-body pre > code {
    white-space: pre-wrap;
    padding: 10px;
}
img {
    max-width: 100%;
}
</style>`,l+="</head><body>",l+=f.innerHTML,l+=`<div style="opacity: .5;font-size: 12px;">Generated by <a href="${Ye}" target="_blank">${Ze()}</a></div>`,l+="</body></html>",l},Pt=async(f,t="")=>{const l=document.createElement("iframe");l.style.position="absolute",l.style.width="0",l.style.height="0",l.style.border="none",document.body.appendChild(l);const s=l.contentWindow,n=s.document;n.open(),n.write(await Se(f,t)),n.close(),setTimeout(()=>{const a=document.title;document.title=t,s.print(),document.body.removeChild(l),document.title=a},500)},Rt=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/
.hljs {
  color: #c9d1d9;
  background: #0d1117
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #ff7b72
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #d2a8ff
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #79c0ff
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #a5d6ff
}
.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #ffa657
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #8b949e
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #7ee787
}
.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #c9d1d9
}
.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #1f6feb;
  font-weight: bold
}
.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #f2cc60
}
.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #c9d1d9;
  font-style: italic
}
.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #c9d1d9;
  font-weight: bold
}
.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #aff5b4;
  background-color: #033a16
}
.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffdcd7;
  background-color: #67060c
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
  
}`,Ae=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub
  Description: Light theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-light
  Current colors taken from GitHub's CSS
*/
.hljs {
  color: #24292e;
  background: #ffffff
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #d73a49
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #6f42c1
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #005cc5
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #032f62
}
.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #e36209
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #6a737d
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #22863a
}
.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #24292e
}
.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #005cc5;
  font-weight: bold
}
.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #735c0f
}
.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #24292e;
  font-style: italic
}
.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #24292e;
  font-weight: bold
}
.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #22863a;
  background-color: #f0fff4
}
.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #b31d28;
  background-color: #ffeef0
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
  
}`,Ht=Object.freeze(Object.defineProperty({__proto__:null,default:Ae},Symbol.toStringTag,{value:"Module"})),Lt={key:0,class:"chat-gpt-wrap vgo-bg"},Ut={class:"request-below"},Ft=["placeholder"],Ot={class:"request-actions"},Nt={class:"action-side"},Mt=["disabled"],Bt={class:"action-side"},qt=["disabled"],Gt=M({__name:"ChatContent",setup(f){const{t}=ne(),l=et(),s=Z(),{currentCharacter:n,currentHistory:a}=he(),{css:b}=tt("",{id:"highlight-js-code-theme"});K(()=>l.isAppDarkMode,w=>{b.value=w?Rt:Ae},{immediate:!0});const o=E(!1),h=E(""),v=E(null),p=()=>({role:"system",content:n.value.systemPrompt,timestamp:Date.now()}),x=()=>{!n.value||!a.value||(a.value.history=[p()],v.value=null)},k=E(),S=E(),_=({behavior:w="smooth"}={})=>{k.value&&setTimeout(()=>{const u=k.value;u.scrollTo({top:u.scrollHeight,behavior:w})})},L=(w=!0)=>{k.value&&setTimeout(()=>{k.value.scrollTo({top:0,behavior:"smooth"})})},i=()=>{setTimeout(()=>{S.value?.focus()})},y=()=>{v.value=null,setTimeout(()=>{i(),_({behavior:"auto"})})};st(de.ON_AI_CHARACTER_UPDATE,()=>{a.value&&(a.value.history.shift(),a.value.history.unshift(p()))});const{requestChatStream:j,requestChatMessage:g}=lt(),r=async()=>{if(!(!a.value||!a.value.history.length)&&!a.value.title)try{const w=[...a.value.history];w.shift(),a.value.title=await g({provider:s.provider,model:s.model,messages:dt(w)})}catch(w){console.error(w)}},B=P(()=>it[n.value?.model]!==!1),A=E([]),C=P(()=>!n.value||!a.value||o.value?!1:!!(h.value||A.value.length)),R=qe(null),Q=async(w=!1)=>{if(!w){if(!C.value)return}try{if(_({behavior:"auto"}),o.value=!0,v.value={role:"assistant",content:""},!w){let H;B&&A.value.length?H=[{text:h.value,type:"text"},...A.value.map(ie=>({type:"image_url",image_url:{detail:"auto",url:ie}}))]:H=h.value,a.value.history.push({role:"user",content:H,timestamp:Date.now()}),h.value="",A.value=[]}if(!k.value)throw new Error("respContainerRef.value is null");const u=k.value;let U=0,F=u.scrollTop>0;console.log("containerEl",u,u.scrollTop,F),setTimeout(()=>{U=u.scrollTop+u.offsetHeight*(2/3)});let $=1;const q=()=>{if(F){if(u.scrollTop>=U){F=!1;return}u.scrollTo({top:U,behavior:"smooth"}),$++}},G=new AbortController,{signal:le}=G;R.value=G;const X=n.value.provider||ue.OPEN_AI,ve=n.value.model,ge=a.value.history.map(H=>({content:H.content,role:H.role}));if(s.stream){await j(X,ve,ge,ie=>{v.value.content+=ie,q()},{signal:le});const H=v.value;v.value=null,H.timestamp=Date.now(),a.value.history.push(H)}else{const H=await g({provider:X,model:ve,messages:ge});v.value=null,a.value.history.push({role:"assistant",content:H||"",timestamp:Date.now()})}r()}catch(u){if(R.value){const{signal:U}=R.value;if(U.aborted){window.$message.warning("Fetch request was aborted");return}}console.error(u),v.value={role:"assistant",content:u.message,timestamp:Date.now()}}finally{o.value=!1,R.value=null,i()}},De=w=>{w.key==="Enter"&&(s.isEnterSend?w.shiftKey||(w.preventDefault(),Q()):w.ctrlKey&&(w.preventDefault(),Q()))},Pe=w=>{if(!B.value)return;const u=w.clipboardData;console.log("clipboardData",u);const U=u.items;for(let F=0;F<U.length;F++){const $=U[F];if(/^image/i.test($.type)){const q=$.getAsFile(),G=new FileReader;G.onload=function(le){const X=le.target.result;X&&A.value.push(X)},G.readAsDataURL(q)}}},Re=(w,u)=>{a.value&&(w.role==="assistant"&&a.value.history.splice(u,1),Q(!0))},oe=()=>{R.value&&(R.value.abort(),s.stream||(v.value=null))};Ge(()=>{oe()}),K(a,()=>{oe(),a.value&&(a.value.history.length||x(),y())},{immediate:!0});const He=async()=>{await Pt(k.value,a.value?.title||"Chat")},Le=async()=>{const w=a.value?.title||"Chat";window.$mcUtils.handleExportFile(w,await Se(k.value,w),".html")},Ue=E([{label:"Print to PDF...",iconClass:"mdi mdi-printer",props:{onClick(){He()}}},{label:"Save HTML file",iconClass:"mdi mdi-language-html5",props:{onClick(){Le()}}},{split:!0},{label:"Import JSON",iconClass:"mdi mdi-import",props:{async onClick(){a.value.history=await window.$mcUtils.handleImportJson(),window.$message.success(t("msgs.import_success"))}}},{label:"Export JSON",iconClass:"mdi mdi-export",props:{async onClick(){window.$mcUtils.handleExportFile(await window.$mcUtils.promptGetFileName(null,a.value?.title||"Chat"),JSON.stringify(a.value.history,null,2),".json")}}}]),Fe=()=>{Ie.emit(de.OPEN_SETTINGS,nt.AI)};return(w,u)=>{const U=ze,F=Ke;return c(),z(Ve,{name:"fade",mode:"in-out"},{default:W(()=>[e(a)&&e(n)?(c(),m("div",Lt,[d("div",{ref_key:"respContainerRef",ref:k,class:"response-container"},[(c(!0),m(N,null,ee(e(a).history,($,q)=>(c(),z(ke,{key:$.timestamp,item:$,"is-dark":e(l).isAppDarkMode,onDelete:G=>e(a).history.splice(q,1),onRetry:G=>Re($,q),"allow-delete":"","allow-edit":"","allow-retry":q===e(a).history.length-1,character:$.role==="assistant"?e(n):void 0},null,8,["item","is-dark","onDelete","onRetry","allow-retry","character"]))),128)),e(v)?(c(),z(ke,{key:0,item:e(v),"is-dark":e(l).isAppDarkMode,character:e(n),"is-loading":!e(v).content},null,8,["item","is-dark","character","is-loading"])):D("",!0)],512),d("div",Ut,[Y(d("textarea",{ref_key:"inputRef",ref:S,class:"vgo-input question-input","onUpdate:modelValue":u[0]||(u[0]=$=>re(h)?h.value=$:null),type:"textarea",placeholder:e(s).isEnterSend?e(t)("ai.enter_send_tips_1"):e(t)("ai.enter_send_tips_2"),onKeydown:De,onPaste:Pe},null,40,Ft),[[pe,e(h)]]),d("div",Ot,[d("div",Nt,[d("button",{class:"vgo-button",title:"Settings",onClick:Fe},u[5]||(u[5]=[d("span",{class:"mdi mdi-cog"},null,-1)])),T(Ee,{options:e(Ue)},{default:W(()=>u[6]||(u[6]=[d("button",{class:"vgo-button",title:"Export"},[d("span",{class:"mdi mdi-tray-arrow-down"})],-1)])),_:1,__:[6]},8,["options"]),d("button",{onClick:u[1]||(u[1]=$=>_()),onContextmenu:u[2]||(u[2]=Je($=>L(),["prevent"])),class:"vgo-button",title:"Scroll to bottom, right click scroll to top"},u[7]||(u[7]=[d("span",{class:"mdi mdi-unfold-more-horizontal"},null,-1)]),32),T(U,{onConfirm:x,title:"Confirm clear chat history?",teleported:!1},{reference:W(()=>[d("button",{class:"vgo-button",disabled:e(o)},I(e(t)("actions.clear")),9,Mt)]),_:1})]),d("div",Bt,[T(F,null,{default:W(()=>[O(I(e(n).model),1)]),_:1}),T(Dt,{images:e(A),"onUpdate:images":u[3]||(u[3]=$=>re(A)?A.value=$:null),disabled:e(o)||!e(B)},null,8,["images","disabled"]),e(o)?(c(),m("button",{key:0,class:"vgo-button",onClick:oe},[u[8]||(u[8]=d("span",{class:"mdi mdi-stop-circle-outline"},null,-1)),O(" "+I(e(t)("ai.stop_generation")),1)])):(c(),m("button",{key:1,class:"vgo-button primary",disabled:!e(C),onClick:u[4]||(u[4]=$=>Q())},[u[9]||(u[9]=d("span",{class:"mdi mdi-send"},null,-1)),O(" "+I(e(t)("actions.send")),1)],8,qt))])])])])):D("",!0)]),_:1})}}}),Vt=ae(Gt,[["__scopeId","data-v-46682a0a"]]),Jt=({index:f,cb:t})=>{const l=s=>s.target.closest(".sub-item");return{draggable:!0,onDragstart:s=>{s.dataTransfer.setData("data-transfer-index",f)},onDragover:s=>{s.preventDefault(),l(s).classList.add("_drag-over")},onDragleave:s=>{s.preventDefault(),l(s).classList.remove("_drag-over")},onDrop:s=>{s.preventDefault(),l(s).classList.remove("_drag-over");const a=Number(s.dataTransfer.getData("data-transfer-index"));t(a,f,s)}}},se=(f=[],t)=>ce(Ee,{options:f,props:t}),zt={class:"ai-side-characters"},Kt=M({__name:"SideCharacters",setup(f){const{t}=ne(),l=Z(),{characterList:s,allChatHistory:n,updatePresetCharacters:a,isCharacterListFinished:b}=he(),o=E(!1),h=E(!1),v=(i={})=>({id:i.id||"",name:i.name||"",desc:i.desc||"",avatar:i.avatar||"",provider:i.provider||ue.OPEN_AI,model:i.model||ct,systemPrompt:i.systemPrompt||""}),p=E(v()),x=(i,y)=>{const j=[...s.value];if(i<0||i>=j.length||y<0||y>=j.length||i===y)return;const[g]=j.splice(i,1),r=i<y?y-1:y;j.splice(r,0,g),s.value=j.map(te)},k=P(()=>[{label:t("ai.characters"),key:"characters",hideExpandIcon:!0,actionRender:()=>se([{label:`➕ ${t("actions.create")}`,props:{onClick:()=>{o.value=!0,p.value=v(),h.value=!0}}},{label:`📤 ${t("actions.export")} JSON...`,props:{onClick:async()=>{window.$mcUtils.handleExportFile(await window.$mcUtils.promptGetFileName("AICharacters"),JSON.stringify(s.value,null,2),".json")}}},{label:`📥 ${t("actions.import")} JSON...`,props:{onClick:async()=>{const i=await window.$mcUtils.handleImportJson();s.value=me(s.value,i||[]),window.$message.success("Import success!")}}},{label:`🗑️ ${t("actions.delete_all")}`,props:{onClick:()=>{window.$dialog.confirm(t("msgs.que_ren_shan_chu_ci")+" !!All chat records will be deleted!!",t("actions.delete_all"),{type:"warning"}).then(()=>{s.value=[],n.value=[]}).catch()}}},{label:t("ai.geng_xin_yu_she_jue"),iconClass:"mdi mdi-shape-plus-outline",props:{onClick:()=>{a()}}}]),children:s.value.map((i,y)=>({key:i.id,label:`${i.name}`,subtitle:`${i.desc} [${i.model}]`,icon:i.avatar,iconClass:"mdi mdi-account-circle-outline",cls:l.currentCharacterId===i.id?"active":"",clickFn:()=>{l.currentCharacterId=i.id},itemProps:Jt({index:y,cb:x}),actionRender:()=>se([{label:`✏️ ${t("actions.edit")}`,props:{onClick:()=>{o.value=!1,p.value=v(i),h.value=!0}}},{label:`📄 ${t("actions.duplicate")}...`,props:{onClick:async()=>{o.value=!0,p.value=v(i),h.value=!0}}},{label:`🗑️ ${t("actions.delete")}`,props:{onClick:()=>{window.$dialog.confirm(t("msgs.que_ren_shan_chu_ci")+" !!Chat records will be deleted!!",t("actions.confirm"),{type:"warning"}).then(()=>{n.value=n.value.filter(j=>j.cid!==i.id).map(te),s.value.splice(y,1)}).catch()}}}])}))}]);K(b,i=>{i&&(s.value.length||a(),setTimeout(()=>{document.querySelectorAll(".ai-option-ui .sub-item.active").forEach(y=>{y.scrollIntoView({behavior:"smooth",block:"center"})})},600))});const S=E({id:{required:!0,trigger:"blur",validator:(i,y)=>y?o.value&&s.value.findIndex(g=>g.id===y)>-1?new Error("id can not be same"):!0:new Error("id is required")},provider:{required:!0,trigger:"blur"},model:{required:!0,trigger:"blur"},name:{required:!0,trigger:"blur"}}),_=P(()=>{const i=fe(p.value.provider),y=p.value.provider===ue.OPEN_AI_COMPATIBLE;return[[{type:V.INPUT,key:"name",label:t("ai.name"),props:{onChange:()=>{if(o.value){const j=p.value.name.trim();p.value.name=j,!p.value.id&&j&&(p.value.id=window.$mcUtils.formatI18nKey(j))}}}},{type:V.INPUT,key:"avatar",label:`${t("ai.avatar")} URL`,props:{clearable:!0},render:()=>ce("button",{type:"button",class:"btn-no-style mdi mdi-image-plus",onClick:async()=>{const j=await ut.chooseFileToBase64({accept:"image/*"});typeof j=="string"&&(p.value.avatar=j)}})}],[{type:V.INPUT,key:"id",label:`ID (${t("ai.chuang_jian_hou_bu_k")})`,disabled:!o.value},{type:V.INPUT,key:"desc",label:t("common.bei_zhu"),placeholder:""}],[{type:V.SELECT,options:rt,key:"provider",label:t("ai.ti_gong_shang"),props:{filterable:!0,onChange(){p.value.model=fe(p.value.provider)[0].value}}},{type:V.SELECT,options:i,key:"model",label:t("ai.model")+` ${p.value.model}`,props:{allowCreate:!0,defaultFirstOption:!0,filterable:!0},render:y?()=>ce("button",{type:"button",class:"btn-no-style mdi mdi-help-circle-outline",onClick:()=>{window.open("https://aihubmix.com/models","_blank","noopener,noreferrer")}}):null}],{type:V.INPUT,key:"systemPrompt",label:t("ai.system_prompt"),props:{type:"textarea",rows:8}}]}),L=()=>{if(h.value=!1,o.value){s.value.push(p.value);return}const i=s.value.findIndex(y=>y.id===p.value.id);i>-1&&s.value.splice(i,1,p.value),Ie.emit(de.ON_AI_CHARACTER_UPDATE)};return(i,y)=>{const j=Qe;return c(),m("div",zt,[T(Te,{class:"ai-option-ui","option-list":k.value},null,8,["option-list"]),T(j,{draggable:"",top:"10vh",width:"700",modelValue:h.value,"onUpdate:modelValue":y[0]||(y[0]=g=>h.value=g),title:o.value?e(t)("actions.create"):e(t)("actions.edit")},{default:W(()=>[T(pt,{"form-schema":{model:p.value,rules:S.value,props:{labelPosition:"top"},formItems:_.value},onOnSubmit:L},null,8,["form-schema"])]),_:1},8,["modelValue","title"])])}}}),Qt={class:"ai-side-history"},Wt=M({__name:"SideHistory",setup(f){const{t}=ne(),l=Z(),{currentCharacter:s,allChatHistory:n,isCharacterListFinished:a,isAllChatHistory:b,currentHistoryGroup:o,currentHistory:h}=he(),v=()=>{if(!s.value)return;console.log("[isCharacterListFinished]",a.value),console.log("[isAllChatHistory]",b.value);const k=at(),S={id:k,cid:s.value.id,title:"",timestamp:Date.now(),history:[]};n.value.push(S),l.currentChatHistoryId=k};K(s,k=>{!a.value||!b.value||p()}),K(b,k=>{k&&p()});const p=()=>{setTimeout(()=>{s.value&&!o.value.length&&v(),!h.value&&o.value.length&&(l.currentChatHistoryId=o.value[0].id)})},x=P(()=>{if(!s.value)return[];const k=t("ai.yu_current_character",[s.value.name]),S=()=>{n.value=n.value.filter(_=>_.cid!==s.value.id).map(te)};return[{label:k,key:"history",hideExpandIcon:!0,actionRender:()=>se([{label:`📤 ${t("actions.export")} JSON...`,props:{onClick:async()=>{const _=n.value.filter(L=>L.cid===s.value.id);window.$mcUtils.handleExportFile(await window.$mcUtils.promptGetFileName(k),JSON.stringify(_,null,2),".json")}}},{label:`📥 ${t("actions.import")} JSON...`,props:{onClick:async()=>{const _=await window.$mcUtils.handleImportJson();n.value=_||[];const L=n.value.filter(y=>y.cid===s.value.id),i=me(L,_);S(),n.value=i,window.$message.success("Import success!")}}},{label:`🗑️ ${t("actions.delete_all")}`,props:{onClick:()=>{window.$dialog.confirm(t("msgs.que_ren_shan_chu_ci"),t("actions.delete_all"),{type:"warning"}).then(()=>{S()}).catch()}}}]),children:[{label:`${t("ai.new_chat")}`,iconClass:"mdi mdi-plus",clickFn:()=>{v()}},...o.value.map((_,L)=>({key:_.id,label:_.title||k,subtitle:$e(_.timestamp),cls:l.currentChatHistoryId===_.id?"active":"",clickFn:()=>{l.currentChatHistoryId=_.id},actionRender:()=>se([{label:`✍️ ${t("actions.rename")}`,props:{onClick:async()=>{const i=await window.$mcUtils.showInputPrompt({title:`${t("actions.rename")}: ${_.title}`,value:_.title});_.title=i}}},{label:`🗑️ ${t("actions.delete")}`,props:{onClick:()=>{const i=n.value.findIndex(y=>y.id===_.id);i>-1&&n.value.splice(i,1)}}}])}))]}]});return(k,S)=>(c(),m("div",Qt,[T(Te,{class:"ai-option-ui","option-list":e(x)},null,8,["option-list"])]))}}),Xt={class:"ai-chat-root vgo-panel"},Yt={key:0,class:"mdi mdi-chevron-right"},Zt={key:1,class:"mdi mdi-chevron-left"},es=M({__name:"ChatRoot",setup(f){const t=Z();return(l,s)=>(c(),m("div",Xt,[d("div",{class:J(["chat-sidebar",{_expand:e(t).isSidebarExpand}])},[T(Kt),T(Wt),d("button",{class:"btn-toggle-expand btn-no-style",onClick:s[0]||(s[0]=n=>e(t).isSidebarExpand=!e(t).isSidebarExpand)},[e(t).isSidebarExpand?(c(),m("span",Zt)):(c(),m("span",Yt))])],2),T(Vt)]))}}),ts={class:"ai-page scrollbar-mini"},ss=M({__name:"AiPage",setup(f){return(t,l)=>(c(),m("div",ts,[T(Oe),T(es)]))}}),$s=ae(ss,[["__scopeId","data-v-003ae9b4"]]);export{$s as default};
