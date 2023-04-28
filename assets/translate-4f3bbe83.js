import{$ as Q,au as W,d as R,Y as Z,a4 as P,aL as X,a6 as x,a7 as k,a9 as ee,N as S,aM as ne,at as te,t as b,k as z,_ as N,o as d,c as v,a as l,e as r,n as $,q as m,F as A,J as h,x as ae,f as E,A as B,C as J,K as L,aN as le,r as w,s as se,w as oe,b as I,y as O,aO as ie,aP as re,aQ as ue,g as pe,E as de,L as me,M as ce}from"./index-45f096b0.js";const ve=Q("collapse-transition",{width:"100%"},[W()]),ye=Object.assign(Object.assign({},P.props),{show:{type:Boolean,default:!0},appear:Boolean,collapsed:{type:Boolean,default:void 0}}),fe=R({name:"CollapseTransition",props:ye,inheritAttrs:!1,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:s,mergedRtlRef:i}=Z(e),u=P("CollapseTransition","-collapse-transition",ve,X,e,n),p=x("CollapseTransition",i,n),t=k(()=>e.collapsed!==void 0?e.collapsed:e.show),a=k(()=>{const{self:{bezier:y}}=u.value;return{"--n-bezier":y}}),o=s?ee("collapse-transition",void 0,a,e):void 0;return{rtlEnabled:p,mergedShow:t,mergedClsPrefix:n,cssVars:s?void 0:a,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender}},render(){return S(te,{appear:this.appear},{default:()=>{var e;if(this.mergedShow)return(e=this.onRender)===null||e===void 0||e.call(this),S("div",ne({class:[`${this.mergedClsPrefix}-collapse-transition`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse-transition--rtl`,this.themeClass],style:this.cssVars},this.$attrs),this.$slots)}})}}),K=(e={})=>({key:e.key||"",value:e.value||""}),D=(e={})=>({namespace:e.namespace||"",children:e.children||[],translates:e.translates||[],parent:e.parent||null}),j=(e={},n=[],s=null)=>{if(!e)return[];if(!Array.isArray(e)&&typeof e=="object")for(let i in e){const u=e[i],p=[];if(u&&!Array.isArray(u)&&typeof u=="object"){const t=D({namespace:i,translates:p,parent:s});t.children=j(u,[],t),n.push(t)}else s&&s.translates&&s.translates.push(K({key:i,value:u}))}return n},T="__root__",he={parseWithRoot:(e={})=>j({[T]:e}),isRoot(e){return e?e.namespace===T:!1}},U=(e,n={})=>{if(typeof e=="object"&&!Array.isArray(e)&&(e=[e]),he.isRoot(e[0])){const s=e[0];s.translates.forEach(i=>{n[i.key]=i.value}),e=s.children}return e.forEach(s=>{const i={};s.translates.forEach(u=>{i[u.key]=u.value}),U(s.children,i),n[s.namespace]=i}),n},_e=e=>e?(e=e.toLowerCase(),e=e.replace(/[^a-zA-Z0-9\s]+/g,""),e=e.replace(/\s/gi,"_"),e=e.slice(0,20),e=e.replace(/_$|^_/g,""),e):"",ge=R({name:"TranslateItem",components:{},props:{item:{type:Object,default:null},treeItem:{type:Object,default:null},isLite:{type:Boolean,default:!1}},emits:["onRemove","previewArray","onKeyClick"],setup(e,{emit:n}){const{item:s,treeItem:i}=b(e),u=k(()=>{if(!i.value)return"";const t=[];let a=i.value;for(;a;)t.push(a.namespace),a=a.parent||null;return t.reverse().join(".")}),p=k(()=>{if(!s.value||!s.value.value&&!s.value.key)return"";let t=s.value.key;u.value&&(t=u.value+"."+t);const a=new RegExp(T+".","g");return t=t.replace(a,""),t});return{namespacePrefix:u,nameDisplay:p,handleCopy(t){let a=`$t('${p.value}')`;t==="html"?a=`{{ $t('${p.value}') }}`:t==="v-html"?a=`v-html="$t('${p.value}')"`:t==="js"&&(a=`this.$t('${p.value}')`),z(a),window.$message.success("Text Copied")},handleBlur(){s.value.key||(s.value.key=_e(s.value.value))},handleInputKeyClick(){n("onKeyClick",p.value)}}}});function Ce(e,n,s,i,u,p){const t=E,a=B,o=J,y=L,C=le;return e.item?(d(),v(C,{key:0,size:"small",class:"translate-item"},{default:l(()=>[r(o,{size:"small",justify:"space-between"},{default:l(()=>[r(o,{size:"small",align:"center"},{default:l(()=>[r(t,{size:"small",class:"font-code translate-item-input-key",value:e.item.key,"onUpdate:value":n[0]||(n[0]=f=>e.item.key=f),placeholder:"key",onClick:e.handleInputKeyClick},null,8,["value","onClick"]),e.isLite?h("",!0):(d(),$(A,{key:0},[Array.isArray(e.item.value)?(d(),v(a,{key:1,title:e.item.value,size:"small",style:{width:"350px"},onClick:n[2]||(n[2]=f=>e.$emit("previewArray",e.item))},{default:l(()=>[m(" 📝 Array ")]),_:1},8,["title"])):(d(),v(t,{key:0,type:"textarea",rows:"1",size:"small",style:{width:"350px"},value:e.item.value,"onUpdate:value":n[1]||(n[1]=f=>e.item.value=f),placeholder:"value",onBlur:e.handleBlur},null,8,["value","onBlur"]))],64)),!e.isLite&&e.nameDisplay?(d(),v(o,{key:1,size:"small"},{default:l(()=>[r(t,{class:"font-code",size:"small",style:{width:"300px"},value:`$t('${e.nameDisplay}')`,readonly:""},null,8,["value"]),r(a,{size:"small",onClick:e.handleCopy,title:"Copy Original $('')"},{default:l(()=>[m(" $() ")]),_:1},8,["onClick"]),r(a,{size:"small",type:"info",onClick:n[3]||(n[3]=f=>e.handleCopy("html")),title:"Copy HTML template"},{default:l(()=>[m(ae("{{ }}"))]),_:1}),r(a,{size:"small",type:"success",onClick:n[4]||(n[4]=f=>e.handleCopy("v-html")),title:"Copy v-html template"},{default:l(()=>[m(" v-html ")]),_:1}),r(a,{size:"small",type:"warning",onClick:n[5]||(n[5]=f=>e.handleCopy("js")),title:"Copy JavaScript"},{default:l(()=>[m(" this.$t ")]),_:1})]),_:1})):h("",!0),r(y,{onPositiveClick:n[6]||(n[6]=f=>e.$emit("onRemove"))},{trigger:l(()=>[r(a,{style:{"margin-left":"15px"},size:"small",type:"error"},{default:l(()=>[m("× Del")]),_:1})]),default:l(()=>[m(" Remove Item? ")]),_:1})]),_:1}),r(o)]),_:1})]),_:1})):h("",!0)}const V=N(ge,[["render",Ce],["__scopeId","data-v-f54d51a8"]]),ke=R({name:"TranslateTreeItem",components:{TranslateItem:V},props:{item:{type:Object,default:null},isRoot:{type:Boolean,default:!0},isLite:{type:Boolean,default:!1}},emits:["onRemove","onKeyClick"],setup(e){const{item:n}=b(e),s=()=>{console.log("[handleAddChildren]"),n.value.children.push(D({parent:n.value}))},i=()=>{console.log("[handleAddTranslate]"),n.value.translates.push(K())},u=w(!0),p=w(!1),t=se(null),a=w(null);return oe(p,o=>{o||(t.value=null,a.value=null)}),{handleAddChildren:s,handleAddTranslate:i,handleGetJSON(){const o=U([n.value]);console.log(o),z(JSON.stringify(o,null,2)),window.$message.success("JSON Copied")},handleRemoveTreeItem(o){const y=[...n.value.children];y.splice(o,1),n.value.children=y},handleRemoveItem(o){const y=[...n.value.translates];y.splice(o,1),n.value.translates=y},isExpand:u,isShowPreviewArray:p,currentPreviewItem:t,currentArrayString:a,handlePreviewArray(o){t.value=o,a.value=JSON.stringify(o.value,null,2),p.value=!0},handleSaveArray(){t.value&&(t.value.value=JSON.parse(a.value||"[]"),p.value=!1)}}}});const F=e=>(me("data-v-658ad540"),e=e(),ce(),e),we={style:{display:"flex"}},$e=F(()=>I("span",{style:{color:"darkseagreen"}},"§",-1)),Ae=F(()=>I("div",{style:{"border-top":"1px dashed darkseagreen","margin-top":"10px","margin-bottom":"10px"}},null,-1));function Te(e,n,s,i,u,p){const t=E,a=B,o=L,y=ie,C=J,f=V,M=re,G=ue("TranslateTreeItem",!0),H=fe,Y=pe,q=de;return e.item?(d(),v(q,{key:0,size:"small",class:"tree-item"},{default:l(()=>[I("div",we,[r(t,{disabled:e.isRoot,class:"font-code",value:e.item.namespace,"onUpdate:value":n[0]||(n[0]=c=>e.item.namespace=c),placeholder:"namespace",style:{flex:"1"}},{prefix:l(()=>[$e]),_:1},8,["disabled","value"]),r(C,{style:{"margin-left":"10px"},align:"center"},{default:l(()=>[e.isLite?h("",!0):(d(),v(a,{key:0,type:"info",onClick:e.handleGetJSON},{default:l(()=>[m("Copy JSON")]),_:1},8,["onClick"])),e.isRoot?h("",!0):(d(),v(o,{key:1,onPositiveClick:n[1]||(n[1]=c=>e.$emit("onRemove"))},{trigger:l(()=>[r(a,{type:"error"},{default:l(()=>[m("×")]),_:1})]),default:l(()=>[m(" Remove Group? ")]),_:1})),e.isLite?h("",!0):(d(),v(y,{key:2,value:e.isExpand,"onUpdate:value":n[2]||(n[2]=c=>e.isExpand=c)},{checked:l(()=>[m(" 👀 ")]),unchecked:l(()=>[m(" 🙈 ")]),_:1},8,["value"]))]),_:1})]),r(H,{show:e.isExpand},{default:l(()=>[e.item.translates&&e.item.translates.length?(d(),v(M,{key:0,size:"small",style:{"margin-top":"10px"}},{default:l(()=>[(d(!0),$(A,null,O(e.item.translates,(c,_)=>(d(),v(f,{item:c,"tree-item":e.item,key:_,"is-lite":e.isLite,onPreviewArray:e.handlePreviewArray,onOnRemove:g=>e.handleRemoveItem(_),onOnKeyClick:n[3]||(n[3]=g=>e.$emit("onKeyClick",g))},null,8,["item","tree-item","is-lite","onPreviewArray","onOnRemove"]))),128))]),_:1})):h("",!0),r(C,{justify:"space-between",align:"center",style:{"margin-top":"5px"}},{default:l(()=>[r(a,{type:"info",onClick:e.handleAddTranslate},{default:l(()=>[m("+ Translate")]),_:1},8,["onClick"])]),_:1}),Ae,e.item.children&&e.item.children.length?(d(!0),$(A,{key:1},O(e.item.children,(c,_)=>(d(),v(G,{item:c,key:_,"is-root":!1,"is-lite":e.isLite,onOnRemove:g=>e.handleRemoveTreeItem(_),onPreviewArray:e.handlePreviewArray,onOnKeyClick:n[4]||(n[4]=g=>e.$emit("onKeyClick",g))},null,8,["item","is-lite","onOnRemove","onPreviewArray"]))),128)):h("",!0),r(a,{type:"primary",onClick:e.handleAddChildren},{default:l(()=>[m("+ Children")]),_:1},8,["onClick"])]),_:1},8,["show"]),r(Y,{style:{width:"80vw"},preset:"dialog","negative-text":"Cancel","positive-text":"Save",title:"Array Detail",onPositiveClick:e.handleSaveArray,show:e.isShowPreviewArray,"onUpdate:show":n[6]||(n[6]=c=>e.isShowPreviewArray=c)},{default:l(()=>[e.isShowPreviewArray&&e.currentArrayString?(d(),v(t,{key:0,type:"textarea",value:e.currentArrayString,"onUpdate:value":n[5]||(n[5]=c=>e.currentArrayString=c),class:"font-code",rows:"30",placeholder:"Array JSON String"},null,8,["value"])):h("",!0)]),_:1},8,["onPositiveClick","show"])]),_:1})):h("",!0)}const Ie=N(ke,[["render",Te],["__scopeId","data-v-658ad540"]]),Se=""+new URL("translate-6e3a2b88.svg",import.meta.url).href;export{he as I,Ie as _,U as e,D as f,Se as i};