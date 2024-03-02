import{_ as I,a as J,i as A}from"./translate-K7ioj8Qr.js";import{_ as B,d as N,u as W,c as E,a as M,b as U}from"./use-file-drop-0KARi1mj.js";import{d as P,c as u,y as S,C as k,g as L,h as Z,r as C,S as h,i as G,j as K,l as Q,o as X,U as Y,V as q,W as O,b as x,X as ee,z as l,A as o,B as R,K as ne,M as oe,E as D,F as te,D as y,G as se,H as ae,I as d,J as _,e as f,O as le,Y as ie,Q as re}from"./index-0XlB2OG-.js";const ce={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 20 20"},de=k("g",{fill:"none"},[k("path",{d:"M3 5a2 2 0 0 1 2-2h8.379a2 2 0 0 1 1.414.586l1.621 1.621A2 2 0 0 1 17 6.621V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1v-4.5A1.5 1.5 0 0 1 6.5 10h7a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 0 1-1V6.621a1 1 0 0 0-.293-.707l-1.621-1.621A1 1 0 0 0 13.379 4H13v2.5A1.5 1.5 0 0 1 11.5 8h-4A1.5 1.5 0 0 1 6 6.5V4H5zm2 0v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V4H7zm7 12v-4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V16h8z",fill:"currentColor"})],-1),ue=[de],me=P({name:"Save20Regular",render:function(t,m){return u(),S("svg",ce,ue)}}),j={types:[{description:"JSON",accept:{"application/JSON":[".json"]}}]},pe=P({name:"VueI18nEditTool",components:{I18nToolSettings:I,TranslateTreeItem:J,DropZone:B,Save20Regular:me},setup(){const{t:e}=L(),t=Z(),m=C(h.parseWithRoot()),i=C(!1),r=G(),g=async s=>{try{i.value=!0;const n=await q(s),p=JSON.parse(n);m.value=h.parseWithRoot(p)}catch(n){console.error(n),window.$message.error(n.message)}finally{i.value=!1}},$=async()=>{const[s]=await window.showOpenFilePicker(j);r.value=s;const n=await s.getFile();await g(n)},T=()=>{r.value=void 0,m.value=h.parseWithRoot()},v=async()=>{try{if(i.value=!0,!r.value)return;const s=await r.value.createWritable(),n=JSON.stringify(O(m.value),null,2);await s.write(n),await s.close(),window.$message.success(e("msgs.saved"))}catch(s){console.error(s),window.$message.error(s.message)}finally{i.value=!1}},c=async()=>{var s;try{i.value=!0,console.log(m.value);const n=JSON.stringify(O(m.value),null,2),a=await(await window.showSaveFilePicker({suggestedName:(s=r.value)==null?void 0:s.name,...j})).createWritable();await a.write(n),await a.close(),window.$message.success(e("msgs.saved"))}catch(n){console.error(n),window.$message.error(n.message)}finally{i.value=!1}},{metaTitle:w}=K();Q(()=>{if(r.value){v();return}c()}),X(async()=>{console.log(import.meta),await N("./lib/pinyinjs/pinyin_dict_notone.min.js"),await N("./lib/pinyinjs/pinyinUtil.js")}),Y(()=>!!r.value);const b=C(!1);return{metaTitle:w,translateTreeRoot:m,fileHandle:r,handleImport:g,handleSelectFile:$,handleCloseFile:T,handleSaveFile:v,handleExport:c,loadDemo:()=>{m.value=h.parseWithRoot({hello_world:{section_a:{test_str:"This is a test string",test_arr:["line 1","line 2","line 3"],test_number:114514},section_b:{"":"Blur this input and it'll generate the key automatically!"},section_c:{"":"中文 is Supported"}}})},iconTranslate:A,...W({cb:async s=>{try{i.value=!0;for(const n of s.dataTransfer.items)if(n.kind==="file"){const p=await n.getAsFileSystemHandle();if(p.kind!=="directory"){r.value=p;const a=await p.getFile();await g(a)}else window.$message.error("Please drag and drop a json file here!")}}catch(n){console.error(n),window.$message.error(n.message)}finally{i.value=!1}}}),mainStore:t,isShowToolSettings:b,isLoading:i}}}),_e={key:0,class:"mc-loading-container position-fixed"},fe={class:"_container"},ge=k("div",{class:"height-placeholder"},null,-1);function ve(e,t,m,i,r,g){const $=E,T=B,v=M,c=le,w=ie,b=ee("Save20Regular"),F=re,z=U,s=te,n=J,p=I;return u(),S("div",{class:"vue-i18n-edit-tool",onDragover:t[4]||(t[4]=D((...a)=>e.fileDragover&&e.fileDragover(...a),["prevent","stop"])),onDragleave:t[5]||(t[5]=D(a=>e.showDropzone=!1,["prevent","stop"])),onDrop:t[6]||(t[6]=D((...a)=>e.fileDrop&&e.fileDrop(...a),["prevent","stop"]))},[l(R,{name:"mc-fade"},{default:o(()=>[e.isLoading?(u(),S("div",_e,[l($)])):y("",!0)]),_:1}),l(R,{name:"mc-fade"},{default:o(()=>[se(l(T,{"position-fixed":"",text:e.$t("msgs.drag_folder_here")},null,8,["text"]),[[ae,e.showDropzone]])]),_:1}),l(s,{size:"small",style:{position:"sticky",top:"0","z-index":"100","margin-bottom":"10px"}},{default:o(()=>[l(z,{subtitle:"",onBack:t[2]||(t[2]=a=>e.$router.push({name:"HomePage"}))},{title:o(()=>[d(_(e.metaTitle),1)]),avatar:o(()=>[l(v,{src:e.iconTranslate,style:{background:"none"}},null,8,["src"])]),extra:o(()=>[l(F,null,{default:o(()=>[l(c,{secondary:"",size:"small",onClick:t[0]||(t[0]=a=>e.isShowToolSettings=!0)},{default:o(()=>[d(_(e.$t("common.settings")),1)]),_:1}),l(c,{secondary:"",size:"small",onClick:t[1]||(t[1]=a=>e.mainStore.isShowTextTransformer=!0)},{default:o(()=>[d(_(e.$t("common.text_transformer")),1)]),_:1}),e.fileHandle?(u(),f(w,{key:0,onPositiveClick:e.handleCloseFile},{trigger:o(()=>[e.fileHandle?(u(),f(c,{key:0,secondary:"",type:"primary",size:"small"},{default:o(()=>[d(" Close JSON ")]),_:1})):y("",!0)]),default:o(()=>[d(" Confirm close JSON? Unsaved contents will be lost. ")]),_:1},8,["onPositiveClick"])):(u(),f(c,{key:1,type:"primary",onClick:e.handleSelectFile,size:"small"},{default:o(()=>[d(_(e.$t("actions.open_json")),1)]),_:1},8,["onClick"])),e.fileHandle?(u(),f(c,{key:2,onClick:e.handleSaveFile,size:"small",type:"info"},{icon:o(()=>[l(b)]),default:o(()=>[d(" "+_(e.$t("actions.save")),1)]),_:1},8,["onClick"])):y("",!0),l(c,{secondary:"",onClick:e.handleExport,size:"small"},{default:o(()=>[d(_(e.$t("actions.save_as"))+"... ",1)]),_:1},8,["onClick"]),e.fileHandle?y("",!0):(u(),f(w,{key:3,onPositiveClick:e.loadDemo},{trigger:o(()=>[l(c,{tertiary:"",size:"small"},{default:o(()=>[d(_(e.$t("common.demo")),1)]),_:1})]),default:o(()=>[d(" "+_(e.$t("msgs.load_demo_this_will")),1)]),_:1},8,["onPositiveClick"]))]),_:1})]),_:1})]),_:1}),k("div",fe,[(u(!0),S(ne,null,oe(e.translateTreeRoot,(a,V)=>{var H;return u(),f(n,{key:V,item:a,index:V,title:(H=e.fileHandle)==null?void 0:H.name},null,8,["item","index","title"])}),128))]),ge,l(p,{visible:e.isShowToolSettings,"onUpdate:visible":t[3]||(t[3]=a=>e.isShowToolSettings=a)},null,8,["visible"])],32)}const Se=x(pe,[["render",ve]]);export{Se as default};