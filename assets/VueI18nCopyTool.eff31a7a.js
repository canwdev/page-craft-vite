import{a as Y,f as x,d as T,u as ee,b as j,e as ne,g as te,h as w,i as oe,j as B,m as le,N as se,t as V,k as F,_ as O,o as m,l as f,w as t,n as l,p as h,q as p,r as D,s as P,v as z,x as N,y as ae,z as C,A as ie,B as re,C as I,c as k,D as S,F as b,E as ue,G as de,H as pe,I as me,J as H,K as L,L as U,M as G,O as ce,P as _e,Q as ve}from"./index.1d0e8e49.js";const fe=Y("collapse-transition",{width:"100%"},[x()]),he=Object.assign(Object.assign({},j.props),{show:{type:Boolean,default:!0},appear:Boolean,collapsed:{type:Boolean,default:void 0}}),ye=T({name:"CollapseTransition",props:he,inheritAttrs:!1,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:u,mergedRtlRef:d}=ee(e),i=j("CollapseTransition","-collapse-transition",fe,ne,e,n),a=te("CollapseTransition",d,n),o=w(()=>e.collapsed!==void 0?e.collapsed:e.show),r=w(()=>{const{self:{bezier:c}}=i.value;return{"--n-bezier":c}}),s=u?oe("collapse-transition",void 0,r,e):void 0;return{rtlEnabled:a,mergedShow:o,mergedClsPrefix:n,cssVars:u?void 0:r,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){return B(se,{appear:this.appear},{default:()=>{var e;if(!!this.mergedShow)return(e=this.onRender)===null||e===void 0||e.call(this),B("div",le({class:[`${this.mergedClsPrefix}-collapse-transition`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse-transition--rtl`,this.themeClass],style:this.cssVars},this.$attrs),this.$slots)}})}}),K=(e={})=>({key:e.key||"",value:e.value||""}),J=(e={})=>({namespace:e.namespace||"",children:e.children||[],translates:e.translates||[],parent:e.parent||null}),R=(e={},n=[],u=null)=>{if(!e)return[];if(!Array.isArray(e)&&typeof e=="object")for(let d in e){const i=e[d],a=[];if(i&&!Array.isArray(i)&&typeof i=="object"){const o=J({namespace:d,translates:a,parent:u});o.children=R(i,[],o),n.push(o)}else u&&u.translates&&u.translates.push(K({key:d,value:i}))}return console.log(n),n},E=(e,n={})=>(e.forEach(u=>{const d={};u.translates.forEach(i=>{d[i.key]=i.value}),E(u.children,d),n[u.namespace]=d}),n),ge=e=>e?(e=e.toLowerCase(),e=e.replace(/[^a-zA-Z0-9\s]+/g,""),e=e.replace(/\s/gi,"_"),e=e.slice(0,20),e):"",$e=T({name:"TranslateItem",components:{},props:{item:{type:Object,default:null},treeItem:{type:Object,default:null}},emits:["onRemove","previewArray"],setup(e){const{item:n,treeItem:u}=V(e),d=w(()=>{if(!u.value)return"";const a=[];let o=u.value;for(;o;)a.push(o.namespace),o=o.parent||null;return a.reverse().join(".")}),i=w(()=>{if(!n.value||!n.value.value)return"";let a=n.value.key;return d.value&&(a=d.value+"."+a),a});return{namespacePrefix:d,nameDisplay:i,handleCopy(a){let o=`$t('${i.value}')`;a==="html"?o=`{{ $t('${i.value}') }}`:a==="v-html"?o=`v-html="$t('${i.value}')"`:a==="js"&&(o=`this.$t('${i.value}')`),F(o),window.$message.success("Text Copied")},handleBlur(){n.value.key||(n.value.key=ge(n.value.value))}}}});const Ce=p("Array"),we=p(" Copy: "),ke=p(" H "),Te=p(" VH "),Ie=p(" JS "),Ae=p("Remove"),Se=p(" Remove Item? ");function be(e,n,u,d,i,a){const o=D,r=P,s=z,c=N,y=ae;return e.item?(m(),f(y,{key:0,size:"small",class:"translate-item"},{default:t(()=>[l(s,{size:"small",justify:"space-between"},{default:t(()=>[l(s,{size:"small",align:"center"},{default:t(()=>[l(o,{size:"small",class:"font-code",value:e.item.key,"onUpdate:value":n[0]||(n[0]=_=>e.item.key=_),placeholder:"key",clearable:""},null,8,["value"]),Array.isArray(e.item.value)?(m(),f(r,{key:1,title:e.item.value,size:"small",style:{width:"350px"},onClick:n[2]||(n[2]=_=>e.$emit("previewArray",e.item))},{default:t(()=>[Ce]),_:1},8,["title"])):(m(),f(o,{key:0,size:"small",style:{width:"350px"},value:e.item.value,"onUpdate:value":n[1]||(n[1]=_=>e.item.value=_),placeholder:"value",clearable:"",onBlur:e.handleBlur},null,8,["value","onBlur"])),e.nameDisplay?(m(),f(s,{key:2,size:"small"},{default:t(()=>[l(o,{class:"font-code",size:"small",style:{width:"300px"},value:`$t('${e.nameDisplay}')`,readonly:""},null,8,["value"]),l(r,{size:"small",type:"info",onClick:e.handleCopy,title:"Original"},{default:t(()=>[we]),_:1},8,["onClick"]),l(r,{size:"small",type:"info",onClick:n[3]||(n[3]=_=>e.handleCopy("html")),title:"HTML template"},{default:t(()=>[ke]),_:1}),l(r,{size:"small",type:"info",onClick:n[4]||(n[4]=_=>e.handleCopy("v-html")),title:"v-html template"},{default:t(()=>[Te]),_:1}),l(r,{size:"small",type:"info",onClick:n[5]||(n[5]=_=>e.handleCopy("js")),title:"JS Script"},{default:t(()=>[Ie]),_:1})]),_:1})):h("",!0)]),_:1}),l(s,null,{default:t(()=>[l(c,{onPositiveClick:n[6]||(n[6]=_=>e.$emit("onRemove"))},{trigger:t(()=>[l(r,{type:"error"},{default:t(()=>[Ae]),_:1})]),default:t(()=>[Se]),_:1})]),_:1})]),_:1})]),_:1})):h("",!0)}const M=O($e,[["render",be],["__scopeId","data-v-753dbc41"]]),Re=T({name:"TranslateTreeItem",components:{TranslateItem:M},props:{item:{type:Object,default:null},isRoot:{type:Boolean,default:!0}},emits:["onRemove"],setup(e){const{item:n}=V(e),u=()=>{console.log("[handleAddChildren]"),n.value.children.push(J({parent:n.value}))},d=()=>{console.log("[handleAddTranslate]"),n.value.translates.push(K())},i=C(!0),a=C(!1),o=ie(null),r=C(null);return re(a,s=>{s||(o.value=null,r.value=null)}),{handleAddChildren:u,handleAddTranslate:d,handleGetJSON(){const s=E([n.value]);console.log(s),F(JSON.stringify(s,null,2)),window.$message.success("JSON Copied")},handleRemoveTreeItem(s){const c=[...n.value.children];c.splice(s,1),n.value.children=c},handleRemoveItem(s){const c=[...n.value.translates];c.splice(s,1),n.value.translates=c},isExpand:i,isShowPreviewArray:a,currentPreviewItem:o,currentArrayString:r,handlePreviewArray(s){o.value=s,r.value=JSON.stringify(s.value,null,2),a.value=!0},handleSaveArray(){o.value&&(o.value.value=JSON.parse(r.value||"[]"),a.value=!1)}}}});const Oe=e=>(L("data-v-e5b40954"),e=e(),U(),e),Pe={style:{display:"flex"}},ze=p("Copy JSON"),Ne=p("Remove"),Je=p(" Remove Group? "),Ee=p(" Show "),Be=p(" Hide "),je=p("Add Translate"),Ve=Oe(()=>I("div",{style:{"border-top":"1px dashed darkseagreen","margin-top":"10px","margin-bottom":"10px"}},null,-1)),Fe=p("Add Children");function De(e,n,u,d,i,a){const o=D,r=P,s=N,c=ue,y=z,_=M,g=de,A=pe("TranslateTreeItem",!0),Q=ye,Z=me,W=H;return e.item?(m(),f(W,{key:0,size:"small",class:"tree-item"},{default:t(()=>[I("div",Pe,[l(o,{class:"font-code",value:e.item.namespace,"onUpdate:value":n[0]||(n[0]=v=>e.item.namespace=v),placeholder:"namespace",clearable:"",style:{flex:"1"}},null,8,["value"]),l(y,{style:{"margin-left":"10px"},align:"center"},{default:t(()=>[l(r,{type:"info",onClick:e.handleGetJSON},{default:t(()=>[ze]),_:1},8,["onClick"]),e.isRoot?h("",!0):(m(),f(s,{key:0,onPositiveClick:n[1]||(n[1]=v=>e.$emit("onRemove"))},{trigger:t(()=>[l(r,{type:"error"},{default:t(()=>[Ne]),_:1})]),default:t(()=>[Je]),_:1})),l(c,{value:e.isExpand,"onUpdate:value":n[2]||(n[2]=v=>e.isExpand=v)},{checked:t(()=>[Ee]),unchecked:t(()=>[Be]),_:1},8,["value"])]),_:1})]),l(Q,{show:e.isExpand},{default:t(()=>[e.item.translates&&e.item.translates.length?(m(),f(g,{key:0,size:"small",style:{"margin-top":"10px"}},{default:t(()=>[(m(!0),k(b,null,S(e.item.translates,(v,$)=>(m(),f(_,{item:v,"tree-item":e.item,key:$,onPreviewArray:e.handlePreviewArray,onOnRemove:X=>e.handleRemoveItem($)},null,8,["item","tree-item","onPreviewArray","onOnRemove"]))),128))]),_:1})):h("",!0),l(y,{justify:"space-between",align:"center",style:{"margin-top":"5px"}},{default:t(()=>[l(r,{type:"primary",onClick:e.handleAddTranslate},{default:t(()=>[je]),_:1},8,["onClick"])]),_:1}),Ve,e.item.children&&e.item.children.length?(m(!0),k(b,{key:1},S(e.item.children,(v,$)=>(m(),f(A,{item:v,key:$,"is-root":!1,onOnRemove:X=>e.handleRemoveTreeItem($),onPreviewArray:e.handlePreviewArray},null,8,["item","onOnRemove","onPreviewArray"]))),128)):h("",!0),l(r,{type:"primary",onClick:e.handleAddChildren},{default:t(()=>[Fe]),_:1},8,["onClick"])]),_:1},8,["show"]),l(Z,{style:{width:"80vw"},preset:"dialog","negative-text":"Cancel","positive-text":"Save",title:"Array Detail",onPositiveClick:e.handleSaveArray,show:e.isShowPreviewArray,"onUpdate:show":n[4]||(n[4]=v=>e.isShowPreviewArray=v)},{default:t(()=>[e.isShowPreviewArray&&e.currentArrayString?(m(),f(o,{key:0,type:"textarea",value:e.currentArrayString,"onUpdate:value":n[3]||(n[3]=v=>e.currentArrayString=v),class:"font-code",rows:"30",placeholder:"Array JSON String"},null,8,["value"])):h("",!0)]),_:1},8,["onPositiveClick","show"])]),_:1})):h("",!0)}const q=O(Re,[["render",De],["__scopeId","data-v-e5b40954"]]),He=T({name:"VueI18nCopyTool",components:{TranslateTreeItem:q,FileChooser:G},setup(){const e=C([J()]),n=C();return{treeRootList:e,handleImport:async d=>{const i=await ve(d),a=JSON.parse(i);e.value=R(a)},handleExport(){ce(_e(null,"i18n_export"),JSON.stringify(E(e.value),null,2),".json")},importFileChooserRef:n,loadDemo(){e.value=R({hello_world:{section_a:{test_str:"This is a test string","":"It's fast and cool"},section_b:{"":"Blur this input and it'll fill left blank automatically!"}}})}}}});const Le=e=>(L("data-v-b0a13074"),e=e(),U(),e),Ue={class:"vue-i18n-copy-tool"},Ge=p("Import JSON"),Ke=p("Export JSON"),Me=p("Demo"),qe=p(" Load Demo? This will override editing content. "),Qe=Le(()=>I("b",null,"VueI18nCopyTool",-1)),Ze=p("Home"),We={class:"_container"};function Xe(e,n,u,d,i,a){const o=P,r=N,s=z,c=H,y=q,_=G;return m(),k("div",Ue,[l(c,{size:"small",style:{position:"sticky",top:"0","z-index":"100","margin-bottom":"10px"}},{default:t(()=>[l(s,{align:"center",justify:"space-between"},{default:t(()=>[l(s,null,{default:t(()=>[l(o,{onClick:n[0]||(n[0]=g=>e.importFileChooserRef.chooseFile()),size:"tiny"},{default:t(()=>[Ge]),_:1}),l(o,{onClick:e.handleExport,size:"tiny"},{default:t(()=>[Ke]),_:1},8,["onClick"]),l(r,{onPositiveClick:e.loadDemo},{trigger:t(()=>[l(o,{size:"tiny"},{default:t(()=>[Me]),_:1})]),default:t(()=>[qe]),_:1},8,["onPositiveClick"])]),_:1}),Qe,l(s,null,{default:t(()=>[l(o,{type:"primary",onClick:n[1]||(n[1]=g=>e.$router.push({name:"HomeView"})),size:"tiny"},{default:t(()=>[Ze]),_:1})]),_:1})]),_:1})]),_:1}),I("div",We,[(m(!0),k(b,null,S(e.treeRootList,(g,A)=>(m(),f(y,{key:A,item:g},null,8,["item"]))),128))]),l(_,{ref:"importFileChooserRef",accept:"application/JSON",onSelected:e.handleImport},null,8,["onSelected"])])}const xe=O(He,[["render",Xe],["__scopeId","data-v-b0a13074"]]);export{xe as default};
