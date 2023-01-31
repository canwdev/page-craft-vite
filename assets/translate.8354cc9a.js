import{E as M,a1 as q,d as T,K as Y,N as I,a2 as Z,Y as Q,M as C,R as W,C as A,a3 as X,a4 as x,t as S,j as b,_ as P,o as p,c as v,a as s,e as i,m as $,F as k,a5 as y,p as m,f as O,q as z,x as B,a0 as N,a6 as ee,r as w,s as ne,w as te,b as E,n as R,a7 as se,a8 as ae,a9 as le,g as oe,z as re,aa as ie,ab as ue}from"./index.6b9976c6.js";const de=M("collapse-transition",{width:"100%"},[q()]),pe=Object.assign(Object.assign({},I.props),{show:{type:Boolean,default:!0},appear:Boolean,collapsed:{type:Boolean,default:void 0}}),me=T({name:"CollapseTransition",props:pe,inheritAttrs:!1,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:u,mergedRtlRef:d}=Y(e),o=I("CollapseTransition","-collapse-transition",de,Z,e,n),l=Q("CollapseTransition",d,n),t=C(()=>e.collapsed!==void 0?e.collapsed:e.show),r=C(()=>{const{self:{bezier:f}}=o.value;return{"--n-bezier":f}}),a=u?W("collapse-transition",void 0,r,e):void 0;return{rtlEnabled:l,mergedShow:t,mergedClsPrefix:n,cssVars:u?void 0:r,themeClass:a==null?void 0:a.themeClass,onRender:a==null?void 0:a.onRender}},render(){return A(x,{appear:this.appear},{default:()=>{var e;if(!!this.mergedShow)return(e=this.onRender)===null||e===void 0||e.call(this),A("div",X({class:[`${this.mergedClsPrefix}-collapse-transition`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse-transition--rtl`,this.themeClass],style:this.cssVars},this.$attrs),this.$slots)}})}}),L=(e={})=>({key:e.key||"",value:e.value||""}),J=(e={})=>({namespace:e.namespace||"",children:e.children||[],translates:e.translates||[],parent:e.parent||null}),ce=(e={},n=[],u=null)=>{if(!e)return[];if(!Array.isArray(e)&&typeof e=="object")for(let d in e){const o=e[d],l=[];if(o&&!Array.isArray(o)&&typeof o=="object"){const t=J({namespace:d,translates:l,parent:u});t.children=ce(o,[],t),n.push(t)}else u&&u.translates&&u.translates.push(L({key:d,value:o}))}return console.log(n),n},j=(e,n={})=>(e.forEach(u=>{const d={};u.translates.forEach(o=>{d[o.key]=o.value}),j(u.children,d),n[u.namespace]=d}),n),ve=e=>e?(e=e.toLowerCase(),e=e.replace(/[^a-zA-Z0-9\s]+/g,""),e=e.replace(/\s/gi,"_"),e=e.slice(0,20),e):"",fe=T({name:"TranslateItem",components:{},props:{item:{type:Object,default:null},treeItem:{type:Object,default:null},isLite:{type:Boolean,default:!1}},emits:["onRemove","previewArray"],setup(e){const{item:n,treeItem:u}=S(e),d=C(()=>{if(!u.value)return"";const l=[];let t=u.value;for(;t;)l.push(t.namespace),t=t.parent||null;return l.reverse().join(".")}),o=C(()=>{if(!n.value||!n.value.value)return"";let l=n.value.key;return d.value&&(l=d.value+"."+l),l});return{namespacePrefix:d,nameDisplay:o,handleCopy(l){let t=`$t('${o.value}')`;l==="html"?t=`{{ $t('${o.value}') }}`:l==="v-html"?t=`v-html="$t('${o.value}')"`:l==="js"&&(t=`this.$t('${o.value}')`),b(t),window.$message.success("Text Copied")},handleBlur(){n.value.key||(n.value.key=ve(n.value.value))}}}});const _e=m("\u{1F4DD} Array"),ye=m(" Copy: "),he=m(" H "),ge=m(" VH "),Ce=m(" JS "),we=m("\u274C"),$e=m(" Remove Item? ");function ke(e,n,u,d,o,l){const t=O,r=z,a=B,f=N,g=ee;return e.item?(p(),v(g,{key:0,size:"small",class:"translate-item"},{default:s(()=>[i(a,{size:"small",justify:"space-between"},{default:s(()=>[i(a,{size:"small",align:"center"},{default:s(()=>[i(t,{size:"small",class:"font-code",value:e.item.key,"onUpdate:value":n[0]||(n[0]=_=>e.item.key=_),placeholder:"key",clearable:""},null,8,["value"]),e.isLite?y("",!0):(p(),$(k,{key:0},[Array.isArray(e.item.value)?(p(),v(r,{key:1,title:e.item.value,size:"small",style:{width:"350px"},onClick:n[2]||(n[2]=_=>e.$emit("previewArray",e.item))},{default:s(()=>[_e]),_:1},8,["title"])):(p(),v(t,{key:0,type:"textarea",rows:"1",size:"small",style:{width:"350px"},value:e.item.value,"onUpdate:value":n[1]||(n[1]=_=>e.item.value=_),placeholder:"value",clearable:"",onBlur:e.handleBlur},null,8,["value","onBlur"]))],64)),!e.isLite&&e.nameDisplay?(p(),v(a,{key:1,size:"small"},{default:s(()=>[i(t,{class:"font-code",size:"small",style:{width:"300px"},value:`$t('${e.nameDisplay}')`,readonly:""},null,8,["value"]),i(r,{size:"small",type:"info",onClick:e.handleCopy,title:"Original"},{default:s(()=>[ye]),_:1},8,["onClick"]),i(r,{size:"small",type:"info",onClick:n[3]||(n[3]=_=>e.handleCopy("html")),title:"HTML template"},{default:s(()=>[he]),_:1}),i(r,{size:"small",type:"info",onClick:n[4]||(n[4]=_=>e.handleCopy("v-html")),title:"v-html template"},{default:s(()=>[ge]),_:1}),i(r,{size:"small",type:"info",onClick:n[5]||(n[5]=_=>e.handleCopy("js")),title:"JS Script"},{default:s(()=>[Ce]),_:1})]),_:1})):y("",!0)]),_:1}),e.isLite?y("",!0):(p(),v(a,{key:0},{default:s(()=>[i(f,{onPositiveClick:n[6]||(n[6]=_=>e.$emit("onRemove"))},{trigger:s(()=>[i(r,{type:"error"},{default:s(()=>[we]),_:1})]),default:s(()=>[$e]),_:1})]),_:1}))]),_:1})]),_:1})):y("",!0)}const V=P(fe,[["render",ke],["__scopeId","data-v-fcc32e28"]]),Te=T({name:"TranslateTreeItem",components:{TranslateItem:V},props:{item:{type:Object,default:null},isRoot:{type:Boolean,default:!0},isLite:{type:Boolean,default:!1}},emits:["onRemove"],setup(e){const{item:n}=S(e),u=()=>{console.log("[handleAddChildren]"),n.value.children.push(J({parent:n.value}))},d=()=>{console.log("[handleAddTranslate]"),n.value.translates.push(L())},o=w(!0),l=w(!1),t=ne(null),r=w(null);return te(l,a=>{a||(t.value=null,r.value=null)}),{handleAddChildren:u,handleAddTranslate:d,handleGetJSON(){const a=j([n.value]);console.log(a),b(JSON.stringify(a,null,2)),window.$message.success("JSON Copied")},handleRemoveTreeItem(a){const f=[...n.value.children];f.splice(a,1),n.value.children=f},handleRemoveItem(a){const f=[...n.value.translates];f.splice(a,1),n.value.translates=f},isExpand:o,isShowPreviewArray:l,currentPreviewItem:t,currentArrayString:r,handlePreviewArray(a){t.value=a,r.value=JSON.stringify(a.value,null,2),l.value=!0},handleSaveArray(){t.value&&(t.value.value=JSON.parse(r.value||"[]"),l.value=!1)}}}});const Ae=e=>(ie("data-v-6914b9c3"),e=e(),ue(),e),Re={style:{display:"flex"}},Ie=m("Copy JSON"),Se=m("\u274C"),be=m(" Remove Group? "),Pe=m(" \u{1F440} "),Oe=m(" \u{1F648} "),ze=m("\u2795 Translate"),Be=Ae(()=>E("div",{style:{"border-top":"1px dashed darkseagreen","margin-top":"10px","margin-bottom":"10px"}},null,-1)),Ne=m("\u2795 Children");function Ee(e,n,u,d,o,l){const t=O,r=z,a=N,f=se,g=B,_=V,D=ae,U=le("TranslateTreeItem",!0),F=me,H=oe,G=re;return e.item?(p(),v(G,{key:0,size:"small",class:"tree-item"},{default:s(()=>[E("div",Re,[i(t,{class:"font-code",value:e.item.namespace,"onUpdate:value":n[0]||(n[0]=c=>e.item.namespace=c),placeholder:"namespace",clearable:"",style:{flex:"1"}},null,8,["value"]),e.isLite?y("",!0):(p(),v(g,{key:0,style:{"margin-left":"10px"},align:"center"},{default:s(()=>[i(r,{type:"info",onClick:e.handleGetJSON},{default:s(()=>[Ie]),_:1},8,["onClick"]),e.isRoot?y("",!0):(p(),v(a,{key:0,onPositiveClick:n[1]||(n[1]=c=>e.$emit("onRemove"))},{trigger:s(()=>[i(r,{type:"error"},{default:s(()=>[Se]),_:1})]),default:s(()=>[be]),_:1})),i(f,{value:e.isExpand,"onUpdate:value":n[2]||(n[2]=c=>e.isExpand=c)},{checked:s(()=>[Pe]),unchecked:s(()=>[Oe]),_:1},8,["value"])]),_:1}))]),i(F,{show:e.isExpand},{default:s(()=>[e.item.translates&&e.item.translates.length?(p(),v(D,{key:0,size:"small",style:{"margin-top":"10px"}},{default:s(()=>[(p(!0),$(k,null,R(e.item.translates,(c,h)=>(p(),v(_,{item:c,"tree-item":e.item,key:h,"is-lite":e.isLite,onPreviewArray:e.handlePreviewArray,onOnRemove:K=>e.handleRemoveItem(h)},null,8,["item","tree-item","is-lite","onPreviewArray","onOnRemove"]))),128))]),_:1})):y("",!0),i(g,{justify:"space-between",align:"center",style:{"margin-top":"5px"}},{default:s(()=>[i(r,{type:"info",onClick:e.handleAddTranslate},{default:s(()=>[ze]),_:1},8,["onClick"])]),_:1}),Be,e.item.children&&e.item.children.length?(p(!0),$(k,{key:1},R(e.item.children,(c,h)=>(p(),v(U,{item:c,key:h,"is-root":!1,"is-lite":e.isLite,onOnRemove:K=>e.handleRemoveTreeItem(h),onPreviewArray:e.handlePreviewArray},null,8,["item","is-lite","onOnRemove","onPreviewArray"]))),128)):y("",!0),i(r,{type:"primary",onClick:e.handleAddChildren},{default:s(()=>[Ne]),_:1},8,["onClick"])]),_:1},8,["show"]),i(H,{style:{width:"80vw"},preset:"dialog","negative-text":"Cancel","positive-text":"Save",title:"Array Detail",onPositiveClick:e.handleSaveArray,show:e.isShowPreviewArray,"onUpdate:show":n[4]||(n[4]=c=>e.isShowPreviewArray=c)},{default:s(()=>[e.isShowPreviewArray&&e.currentArrayString?(p(),v(t,{key:0,type:"textarea",value:e.currentArrayString,"onUpdate:value":n[3]||(n[3]=c=>e.currentArrayString=c),class:"font-code",rows:"30",placeholder:"Array JSON String"},null,8,["value"])):y("",!0)]),_:1},8,["onPositiveClick","show"])]),_:1})):y("",!0)}const Je=P(Te,[["render",Ee],["__scopeId","data-v-6914b9c3"]]),je=""+new URL("translate.6e3a2b88.svg",import.meta.url).href;export{Je as _,j as e,J as f,je as i,ce as p};
