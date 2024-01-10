import{c as B,a as b,f as U,b as F,d as W,u as A,e as P,g as X,h as Z,i as G,j as h,N as Y,T as J,s as q,p as Q,k as ee,_ as K,l as ne,m as se,r as y,n as oe,o as te,w as ie,q as ae,C as $,t as le,v as re,x as j,y as z,z as ce,A as de,B as pe,D as x,E,F as l,G as p,H as I,I as V,J as M,K as ue,L as me,M as fe,O as S,P as k,Q as _e,R as ge,S as he,U as ye,V as ve,W as we,X as be,Y as Se,Z as ke}from"./index-6913cb41.js";import{_ as H,d as Ce,u as $e,a as ze,b as xe}from"./use-file-drop-f9104456.js";const Re=B([B("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),b("spin-container",{position:"relative"},[b("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[U()])]),b("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),b("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[F("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),b("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),b("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[F("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),Te={small:20,medium:18,large:16},Ne=Object.assign(Object.assign({},P.props),{description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0}}),Le=W({name:"Spin",props:Ne,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:r}=A(e),a=P("Spin","-spin",Re,q,e,o),u=X(()=>{const{size:i}=e,{common:{cubicBezierEaseInOut:d},self:v}=a.value,{opacitySpinning:f,color:C,textColor:_}=v,w=typeof i=="number"?Q(i):v[ee("size",i)];return{"--n-bezier":d,"--n-opacity-spinning":f,"--n-size":w,"--n-color":C,"--n-text-color":_}}),c=r?Z("spin",X(()=>{const{size:i}=e;return typeof i=="number"?String(i):i[0]}),u,e):void 0;return{mergedClsPrefix:o,compitableShow:G(e,["spinning","show"]),mergedStrokeWidth:X(()=>{const{strokeWidth:i}=e;if(i!==void 0)return i;const{size:d}=e;return Te[typeof d=="number"?"medium":d]}),cssVars:r?void 0:u,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender}},render(){var e,o;const{$slots:r,mergedClsPrefix:a,description:u}=this,c=r.icon&&this.rotate,i=(u||r.description)&&h("div",{class:`${a}-spin-description`},u||((e=r.description)===null||e===void 0?void 0:e.call(r))),d=r.icon?h("div",{class:[`${a}-spin-body`,this.themeClass]},h("div",{class:[`${a}-spin`,c&&`${a}-spin--rotate`],style:r.default?"":this.cssVars},r.icon()),i):h("div",{class:[`${a}-spin-body`,this.themeClass]},h(Y,{clsPrefix:a,style:r.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${a}-spin`}),i);return(o=this.onRender)===null||o===void 0||o.call(this),r.default?h("div",{class:[`${a}-spin-container`,this.themeClass],style:this.cssVars},h("div",{class:[`${a}-spin-content`,this.compitableShow&&`${a}-spin-content--spinning`]},r),h(J,{name:"fade-in-transition"},{default:()=>this.compitableShow?d:null})):d}}),De=""+new URL("excel-59df11bd.svg",import.meta.url).href,Xe=e=>e.tagName.toLowerCase()==="td",Ee=W({name:"ExcelCopyTool",components:{FileChooser:K,DropZone:H},setup(){const{t:e}=ne(),o=se(),r=y(),a=y(),u=y(!1),c=oe(),i=y([]),d=y(0),{metaTitle:v}=te();ie(d,()=>{_()});const f=()=>{if(!u.value){const n="XLSX Not Ready!";throw window.$message.error(n),new Error(n)}},C=n=>(i.value=n.SheetNames,n.Sheets[i.value[d.value]]),_=()=>{const n=c.value;if(!n){a.value.innerHTML="";return}const s=window.XLSX.utils.sheet_to_html(C(n));a.value.innerHTML=s},w=async n=>{if(f(),!/\.xlsx$/g.test(n.name)){window.$message.error("Only supports reading xlsx format!");return}const s=new FileReader;c.value=null,s.onload=function(t){const m=t.target.result;d.value=0,c.value=window.XLSX.read(m,{type:"binary"}),_()},s.readAsBinaryString(n)},N=y(!0);ae(async()=>{try{await Ce("//unpkg.com/xlsx@0.16.9/xlsx.mini.js")}catch(n){window.$message.error(n.message),console.error(n)}window.$message.success("XLSX Ready!"),console.log("XLSX ready",window.XLSX),u.value=!0});const g=y($.json),L=n=>{let s=n.target;if(!Xe(s)||!g.value||g.value===$.original||!s.innerText)return;let t=s.innerText;console.log(g.value);let m="";n.ctrlKey&&n.altKey?t=z(t,m=$.json):n.ctrlKey?t=z(t,m=$.text):n.altKey?t=z(t,m=$.html):t=z(t,m=g.value),j(t),window.$message.success(m+" "+e("msgs.copy_success"));const O=document.createRange();O.selectNode(s);const D=window.getSelection();D&&(D.removeAllRanges(),D.addRange(O))},R=()=>{if(!c.value){const t="Please open Excel file first!";throw window.$message.error(t),new Error(t)}const n=c.value,s={};return n.SheetNames.forEach(function(t){const m=window.XLSX.utils.sheet_to_row_object_array(n.Sheets[t]);m.length>0&&(s[t]=m)}),s},T=async()=>{const n=R();ce(await de(null,"excel_sheet_export"),JSON.stringify(n,null,2),".json")};return le(async()=>{await T()}),{metaTitle:v,iconExcel:De,sheetNames:i,sheetNameIndex:d,handleImport:w,importFileChooserRef:r,loadDemo(){f();const n=[["Name","Value","Num","Time"],["test001",`line1
line2`,123,new Date],["test001",`line1

line3`,-1,new Date]],s=window.XLSX.utils.aoa_to_sheet(n),t=window.XLSX.utils.book_new();window.XLSX.utils.book_append_sheet(t,s,"Sheet1"),d.value=0,c.value=t,_()},tableWrapperRef:a,handleClick:L,copyMode:g,CopyModeOptions:re,dropdownMenuOptions:[{label:"Copy Sheets JSON",props:{onClick:async()=>{const n=R();j(JSON.stringify(n,null,2)),window.$message.success("Sheet JSON Copied!")}}},{label:"Export Sheets JSON",props:{onClick:async()=>{T()}}}],formatMultipleLine:z,...$e({cbFiles:n=>{n.length&&w(n[0])}}),isTrimEmptyLines:N,mainStore:o,isReady:u}}});const Me={key:0,style:{"text-align":"center",padding:"20px"}};function Oe(e,o,r,a,u,c){const i=H,d=ze,v=he,f=ye,C=ve,_=we,w=be,N=xe,g=ue,L=Le,R=Se,T=ke,n=K;return x(),E("div",{class:"excel-copy-tool",onDragover:o[7]||(o[7]=M((...s)=>e.fileDragover&&e.fileDragover(...s),["prevent","stop"])),onDragleave:o[8]||(o[8]=M(s=>e.showDropzone=!1,["prevent","stop"])),onDrop:o[9]||(o[9]=M((...s)=>e.fileDrop&&e.fileDrop(...s),["prevent","stop"]))},[l(J,{name:"mc-fade"},{default:p(()=>[me(l(i,{text:"Drop Excel file here"},null,512),[[fe,e.showDropzone]])]),_:1}),I("div",null,[l(g,{size:"small"},{default:p(()=>[l(N,{subtitle:"",onBack:o[4]||(o[4]=s=>e.$router.push({name:"HomePage"}))},{title:p(()=>[S(k(e.metaTitle),1)]),avatar:p(()=>[l(d,{src:e.iconExcel,style:{background:"none"}},null,8,["src"])]),extra:p(()=>[l(_,null,{default:p(()=>[l(_,{size:"small",align:"center"},{default:p(()=>[l(v,{size:"small",checked:e.isTrimEmptyLines,"onUpdate:checked":o[0]||(o[0]=s=>e.isTrimEmptyLines=s)},{default:p(()=>[S(k(e.$t("msgs.trim_empty_lines")),1)]),_:1},8,["checked"]),l(f,{text:"",onClick:o[1]||(o[1]=s=>e.mainStore.isShowTextTransformer=!0)},{default:p(()=>[S(k(e.$t("common.text_transformer"))+":",1)]),_:1}),l(C,{size:"small",value:e.copyMode,"onUpdate:value":o[2]||(o[2]=s=>e.copyMode=s),options:e.CopyModeOptions,style:{width:"100px"}},null,8,["value","options"])]),_:1}),l(f,{type:"primary",disabled:!e.isReady,onClick:o[3]||(o[3]=s=>e.importFileChooserRef.chooseFile()),size:"small"},{default:p(()=>[S(k(e.$t("actions.open_excel")),1)]),_:1},8,["disabled"]),l(w,{options:e.dropdownMenuOptions,placement:"bottom-start","key-field":"label",disabled:!e.isReady},{default:p(()=>[l(f,{size:"small"},{default:p(()=>[S(k(e.$t("actions.export")),1)]),_:1})]),_:1},8,["options","disabled"]),l(f,{onClick:e.loadDemo,size:"small",disabled:!e.isReady},{default:p(()=>[S(k(e.$t("common.demo")),1)]),_:1},8,["onClick","disabled"])]),_:1})]),_:1})]),_:1}),e.isReady?(x(),V(g,{key:1,class:"sheet-name-card",size:"small"},{default:p(()=>[l(T,{size:"small",type:"card",animated:"",value:e.sheetNameIndex,"onUpdate:value":o[5]||(o[5]=s=>e.sheetNameIndex=s)},{default:p(()=>[(x(!0),E(_e,null,ge(e.sheetNames,(s,t)=>(x(),V(R,{style:{padding:"0"},name:t,tab:s,key:s},null,8,["name","tab"]))),128))]),_:1},8,["value"])]),_:1})):(x(),E("div",Me,[l(L)]))]),I("div",{ref:"tableWrapperRef",class:"excel-table-container",onClick:o[6]||(o[6]=(...s)=>e.handleClick&&e.handleClick(...s))},null,512),l(n,{ref:"importFileChooserRef",accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",onSelected:e.handleImport},null,8,["onSelected"])],32)}const je=pe(Ee,[["render",Oe],["__scopeId","data-v-d8f69e48"]]);export{je as default};
