import{_ as S,I as u,i as N,e as h}from"./translate.30dba4db.js";import{_ as T,u as O,a as z,b as $}from"./use-file-drop.6c6ee6ce.js";import{d as J,r as V,s as E,i as R,a5 as B,_ as j,o as d,n as g,e as i,a,p as P,v as W,T as H,q as c,x,c as y,a6 as A,b,F as L,y as M,z as m,A as Z,a7 as q,C as U,E as G,a8 as K,a9 as Q}from"./index.710af264.js";const k={types:[{description:"JSON",accept:{"application/JSON":[".json"]}}]},X=J({name:"VueI18nEditTool",components:{TranslateTreeItem:S,DropZone:T},setup(){const e=V(u.parseWithRoot()),t=E(),p=async n=>{const o=await B(n),s=JSON.parse(o);e.value=u.parseWithRoot(s)},f=async()=>{const[n]=await window.showOpenFilePicker(k);t.value=n;const o=await n.getFile();p(o)},v=async()=>{if(!t.value)return;const n=await t.value.createWritable(),o=JSON.stringify(h(e.value),null,2);await n.write(o),await n.close(),window.$message.success("Saved!")},w=async()=>{var r;console.log(e.value);const n=JSON.stringify(h(e.value),null,2),s=await(await window.showSaveFilePicker({suggestedName:(r=t.value)==null?void 0:r.name,...k})).createWritable();await s.write(n),await s.close(),window.$message.success("Saved!")},{metaTitle:_}=R();return{metaTitle:_,translateTreeRoot:e,fileHandle:t,handleImport:p,handleSelectFile:f,handleSaveFile:v,handleExport:w,loadDemo(){e.value=u.parseWithRoot({hello_world:{section_a:{test_str:"This is a test string","":"It's fast and cool"},section_b:{"":"Blur this input and it'll fill left blank automatically!"}}})},iconTranslate:N,...O({cb:async n=>{for(const o of n.dataTransfer.items)if(o.kind==="file"){const s=await o.getAsFileSystemHandle();if(s.kind!=="directory"){t.value=s;const r=await s.getFile();await p(r)}}}})}}});const Y=e=>(K("data-v-e43dd5b8"),e=e(),Q(),e),ee=c(" Open JSON "),te=c("Save"),oe=c("Save as..."),ne=c("Demo"),ae=c(" Load Demo? This will override editing content. "),se={class:"_container"},ie=Y(()=>b("div",{style:{height:"500px"}},null,-1));function le(e,t,p,f,v,w){const _=T,n=z,o=Z,s=q,r=U,D=$,I=G,F=S;return d(),g("div",{class:"vue-i18n-copy-tool",onDragover:t[1]||(t[1]=m((...l)=>e.fileDragover&&e.fileDragover(...l),["prevent","stop"])),onDragleave:t[2]||(t[2]=m(l=>e.showDropzone=!1,["prevent","stop"])),onDrop:t[3]||(t[3]=m((...l)=>e.fileDrop&&e.fileDrop(...l),["prevent","stop"]))},[i(H,{name:"fade"},{default:a(()=>[P(i(_,{text:"Drop json file here"},null,512),[[W,e.showDropzone]])]),_:1}),i(I,{size:"small",style:{position:"sticky",top:"0","z-index":"100","margin-bottom":"10px"}},{default:a(()=>[i(D,{subtitle:"",onBack:t[0]||(t[0]=l=>e.$router.push({name:"HomeView"}))},{title:a(()=>[c(x(e.metaTitle),1)]),avatar:a(()=>[i(n,{src:e.iconTranslate,style:{background:"none"}},null,8,["src"])]),extra:a(()=>[i(r,null,{default:a(()=>[i(o,{type:"primary",onClick:e.handleSelectFile,size:"small"},{default:a(()=>[ee]),_:1},8,["onClick"]),e.fileHandle?(d(),y(o,{key:0,onClick:e.handleSaveFile,size:"small",type:"info"},{default:a(()=>[te]),_:1},8,["onClick"])):A("",!0),i(o,{onClick:e.handleExport,size:"small"},{default:a(()=>[oe]),_:1},8,["onClick"]),i(s,{onPositiveClick:e.loadDemo},{trigger:a(()=>[i(o,{size:"small"},{default:a(()=>[ne]),_:1})]),default:a(()=>[ae]),_:1},8,["onPositiveClick"])]),_:1})]),_:1})]),_:1}),b("div",se,[(d(!0),g(L,null,M(e.translateTreeRoot,(l,C)=>(d(),y(F,{key:C,item:l},null,8,["item"]))),128))]),ie],32)}const de=j(X,[["render",le],["__scopeId","data-v-e43dd5b8"]]);export{de as default};
