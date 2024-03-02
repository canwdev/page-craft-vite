import{d as Q,r as L,b6 as pt,b7 as ut,Z as c,b8 as xe,b9 as vt,ba as Z,bb as ht,a2 as gt,a4 as ze,bc as xt,n as J,bd as mt,K as yt,as as wt,be as Ct,ax as St,bf as Rt,bg as Tt,aa as r,ac as s,ad as C,ab as A,ae as $t,a8 as zt,af as Pe,bh as me,aj as ae,a6 as Pt,w as re,o as _t,ag as Wt,a5 as k,bi as Bt,aF as Lt,ai as At,am as ye,bj as we,bk as Et,a9 as Y,aJ as kt,aN as ne,al as j,aG as q,G as jt,H as It,bl as Ot,bm as Ht}from"./index-0XlB2OG-.js";const Ft=xe(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[xe("&::-webkit-scrollbar",{width:0,height:0})]),Mt=Q({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=L(null);function n(l){!(l.currentTarget.offsetWidth<l.currentTarget.scrollWidth)||l.deltaY===0||(l.currentTarget.scrollLeft+=l.deltaY+l.deltaX,l.preventDefault())}const d=pt();return Ft.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:ut,ssr:d}),Object.assign({selfRef:e,handleWheel:n},{scrollTo(...l){var m;(m=e.value)===null||m===void 0||m.scrollTo(...l)}})},render(){return c("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var Dt=/\s/;function Nt(e){for(var n=e.length;n--&&Dt.test(e.charAt(n)););return n}var Vt=/^\s+/;function Xt(e){return e&&e.slice(0,Nt(e)+1).replace(Vt,"")}var Ce=NaN,Ut=/^[-+]0x[0-9a-f]+$/i,Gt=/^0b[01]+$/i,Kt=/^0o[0-7]+$/i,Yt=parseInt;function Se(e){if(typeof e=="number")return e;if(vt(e))return Ce;if(Z(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=Z(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=Xt(e);var d=Gt.test(e);return d||Kt.test(e)?Yt(e.slice(2),d?2:8):Ut.test(e)?Ce:+e}var oe=function(){return ht.Date.now()},qt="Expected a function",Jt=Math.max,Zt=Math.min;function Qt(e,n,d){var u,l,m,v,f,x,h=0,g=!1,_=!1,W=!0;if(typeof e!="function")throw new TypeError(qt);n=Se(n)||0,Z(d)&&(g=!!d.leading,_="maxWait"in d,m=_?Jt(Se(d.maxWait)||0,n):m,W="trailing"in d?!!d.trailing:W);function y(b){var R=u,F=l;return u=l=void 0,h=b,v=e.apply(F,R),v}function T(b){return h=b,f=setTimeout(P,n),g?y(b):v}function S(b){var R=b-x,F=b-h,N=n-R;return _?Zt(N,m-F):N}function z(b){var R=b-x,F=b-h;return x===void 0||R>=n||R<0||_&&F>=m}function P(){var b=oe();if(z(b))return $(b);f=setTimeout(P,S(b))}function $(b){return f=void 0,W&&u?y(b):(u=l=void 0,v)}function H(){f!==void 0&&clearTimeout(f),h=0,u=x=l=f=void 0}function B(){return f===void 0?v:$(oe())}function p(){var b=oe(),R=z(b);if(u=arguments,l=this,x=b,R){if(f===void 0)return T(x);if(_)return clearTimeout(f),f=setTimeout(P,n),y(x)}return f===void 0&&(f=setTimeout(P,n)),v}return p.cancel=H,p.flush=B,p}var ea="Expected a function";function ie(e,n,d){var u=!0,l=!0;if(typeof e!="function")throw new TypeError(ea);return Z(d)&&(u="leading"in d?!!d.leading:u,l="trailing"in d?!!d.trailing:l),Qt(e,n,{leading:u,maxWait:n,trailing:l})}const de=gt("n-tabs"),_e={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},oa=Q({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:_e,setup(e){const n=ze(de,null);return n||xt("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:n.paneStyleRef,class:n.paneClassRef,mergedClsPrefix:n.mergedClsPrefixRef}},render(){return c("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),ta=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Tt(_e,["displayDirective"])),le=Q({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:ta,setup(e){const{mergedClsPrefixRef:n,valueRef:d,typeRef:u,closableRef:l,tabStyleRef:m,addTabStyleRef:v,tabClassRef:f,addTabClassRef:x,tabChangeIdRef:h,onBeforeLeaveRef:g,triggerRef:_,handleAdd:W,activateTab:y,handleClose:T}=ze(de);return{trigger:_,mergedClosable:J(()=>{if(e.internalAddable)return!1;const{closable:S}=e;return S===void 0?l.value:S}),style:m,addStyle:v,tabClass:f,addTabClass:x,clsPrefix:n,value:d,type:u,handleClose(S){S.stopPropagation(),!e.disabled&&T(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){W();return}const{name:S}=e,z=++h.id;if(S!==d.value){const{value:P}=g;P?Promise.resolve(P(e.name,d.value)).then($=>{$&&h.id===z&&y(S)}):y(S)}}}},render(){const{internalAddable:e,clsPrefix:n,name:d,disabled:u,label:l,tab:m,value:v,mergedClosable:f,trigger:x,$slots:{default:h}}=this,g=l??m;return c("div",{class:`${n}-tabs-tab-wrapper`},this.internalLeftPadded?c("div",{class:`${n}-tabs-tab-pad`}):null,c("div",Object.assign({key:d,"data-name":d,"data-disabled":u?!0:void 0},mt({class:[`${n}-tabs-tab`,v===d&&`${n}-tabs-tab--active`,u&&`${n}-tabs-tab--disabled`,f&&`${n}-tabs-tab--closable`,e&&`${n}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:x==="click"?this.activateTab:void 0,onMouseenter:x==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),c("span",{class:`${n}-tabs-tab__label`},e?c(yt,null,c("div",{class:`${n}-tabs-tab__height-placeholder`}," "),c(wt,{clsPrefix:n},{default:()=>c(Ct,null)})):h?h():typeof g=="object"?g:St(g??d)),f&&this.type==="card"?c(Rt,{clsPrefix:n,class:`${n}-tabs-tab__close`,onClick:this.handleClose,disabled:u}):null))}}),aa=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[s("segment-type",[r("tabs-rail",[C("&.transition-disabled",[r("tabs-capsule",`
 transition: none;
 `)])])]),s("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),s("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),s("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),s("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),s("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: 0.3s;
 `),r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[s("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),C("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),s("flex",[r("tabs-nav",{width:"100%"},[r("tabs-wrapper",{width:"100%"},[r("tabs-tab",{marginRight:0})])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[A("prefix, suffix",`
 display: flex;
 align-items: center;
 `),A("prefix","padding-right: 16px;"),A("suffix","padding-left: 16px;")]),s("top, bottom",[r("tabs-nav-scroll-wrapper",[C("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),C("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),s("shadow-start",[C("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),s("shadow-end",[C("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),s("left, right",[r("tabs-nav-scroll-content",`
 flex-direction: column;
 `),r("tabs-nav-scroll-wrapper",[C("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),C("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),s("shadow-start",[C("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),s("shadow-end",[C("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[C("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),C("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[s("disabled",{cursor:"not-allowed"}),A("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),A("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[C("&.transition-disabled",`
 transition: none;
 `),s("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[C("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),C("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),C("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),C("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),C("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),s("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[C("&:hover",{color:"var(--n-tab-text-color-hover)"}),s("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),s("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[s("line-type",[s("top",[A("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),s("left",[A("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),s("right",[A("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),s("bottom",[A("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),A("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),s("card-type",[A("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[s("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[A("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),$t("disabled",[C("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),s("closable","padding-right: 8px;"),s("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),s("disabled","color: var(--n-tab-text-color-disabled);")]),r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),s("left, right",[r("tabs-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])])]),s("top",[s("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[s("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),s("left",[s("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[s("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),s("right",[s("card-type",[r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[s("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),s("bottom",[s("card-type",[r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[s("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),ra=Object.assign(Object.assign({},Pe.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),ia=Q({name:"Tabs",props:ra,setup(e,{slots:n}){var d,u,l,m;const{mergedClsPrefixRef:v,inlineThemeDisabled:f}=zt(e),x=Pe("Tabs","-tabs",aa,Et,e,v),h=L(null),g=L(null),_=L(null),W=L(null),y=L(null),T=L(null),S=L(!0),z=L(!0),P=me(e,["labelSize","size"]),$=me(e,["activeName","value"]),H=L((u=(d=$.value)!==null&&d!==void 0?d:e.defaultValue)!==null&&u!==void 0?u:n.default?(m=(l=ae(n.default())[0])===null||l===void 0?void 0:l.props)===null||m===void 0?void 0:m.name:null),B=Pt($,H),p={id:0},b=J(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});re(B,()=>{p.id=0,V(),be()});function R(){var a;const{value:t}=B;return t===null?null:(a=h.value)===null||a===void 0?void 0:a.querySelector(`[data-name="${t}"]`)}function F(a){if(e.type==="card")return;const{value:t}=g;if(!t)return;const o=t.style.opacity==="0";if(a){const i=`${v.value}-tabs-bar--disabled`,{barWidth:w,placement:I}=e;if(a.dataset.disabled==="true"?t.classList.add(i):t.classList.remove(i),["top","bottom"].includes(I)){if(ce(["top","maxHeight","height"]),typeof w=="number"&&a.offsetWidth>=w){const E=Math.floor((a.offsetWidth-w)/2)+a.offsetLeft;t.style.left=`${E}px`,t.style.maxWidth=`${w}px`}else t.style.left=`${a.offsetLeft}px`,t.style.maxWidth=`${a.offsetWidth}px`;t.style.width="8192px",o&&(t.style.transition="none"),t.offsetWidth,o&&(t.style.transition="",t.style.opacity="1")}else{if(ce(["left","maxWidth","width"]),typeof w=="number"&&a.offsetHeight>=w){const E=Math.floor((a.offsetHeight-w)/2)+a.offsetTop;t.style.top=`${E}px`,t.style.maxHeight=`${w}px`}else t.style.top=`${a.offsetTop}px`,t.style.maxHeight=`${a.offsetHeight}px`;t.style.height="8192px",o&&(t.style.transition="none"),t.offsetHeight,o&&(t.style.transition="",t.style.opacity="1")}}}function N(){if(e.type==="card")return;const{value:a}=g;a&&(a.style.opacity="0")}function ce(a){const{value:t}=g;if(t)for(const o of a)t.style[o]=""}function V(){if(e.type==="card")return;const a=R();a?F(a):N()}function be(a){var t;const o=(t=y.value)===null||t===void 0?void 0:t.$el;if(!o)return;const i=R();if(!i)return;const{scrollLeft:w,offsetWidth:I}=o,{offsetLeft:E,offsetWidth:G}=i;w>E?o.scrollTo({top:0,left:E,behavior:"smooth"}):E+G>w+I&&o.scrollTo({top:0,left:E+G-I,behavior:"smooth"})}const X=L(null);let ee=0,O=null;function We(a){const t=X.value;if(t){ee=a.getBoundingClientRect().height;const o=`${ee}px`,i=()=>{t.style.height=o,t.style.maxHeight=o};O?(i(),O(),O=null):O=i}}function Be(a){const t=X.value;if(t){const o=a.getBoundingClientRect().height,i=()=>{document.body.offsetHeight,t.style.maxHeight=`${o}px`,t.style.height=`${Math.max(ee,o)}px`};O?(O(),O=null,i()):O=i}}function Le(){const a=X.value;if(a){a.style.maxHeight="",a.style.height="";const{paneWrapperStyle:t}=e;if(typeof t=="string")a.style.cssText=t;else if(t){const{maxHeight:o,height:i}=t;o!==void 0&&(a.style.maxHeight=o),i!==void 0&&(a.style.height=i)}}}const fe={value:[]},pe=L("next");function Ae(a){const t=B.value;let o="next";for(const i of fe.value){if(i===t)break;if(i===a){o="prev";break}}pe.value=o,Ee(a)}function Ee(a){const{onActiveNameChange:t,onUpdateValue:o,"onUpdate:value":i}=e;t&&Y(t,a),o&&Y(o,a),i&&Y(i,a),H.value=a}function ke(a){const{onClose:t}=e;t&&Y(t,a)}function ue(){const{value:a}=g;if(!a)return;const t="transition-disabled";a.classList.add(t),V(),a.classList.remove(t)}const D=L(null);function ve({disabledTransition:a}){const t=h.value;if(!t)return;a&&t.classList.add("transition-disabled");const o=R();if(o&&D.value){const i=o.getBoundingClientRect();D.value.style.width=`${i.width}px`,D.value.style.height=`${i.height}px`,D.value.style.transform=`translateX(${i.left-t.getBoundingClientRect().left-kt(getComputedStyle(t).paddingLeft)}px)`}a&&t.classList.remove("transition-disabled")}re([B],()=>{e.type==="segment"&&ne(()=>{ve({disabledTransition:!1})})}),_t(()=>{e.type==="segment"&&ve({disabledTransition:!0})});let he=0;function je(a){var t;if(a.contentRect.width===0&&a.contentRect.height===0||he===a.contentRect.width)return;he=a.contentRect.width;const{type:o}=e;if((o==="line"||o==="bar")&&ue(),o!=="segment"){const{placement:i}=e;te((i==="top"||i==="bottom"?(t=y.value)===null||t===void 0?void 0:t.$el:T.value)||null)}}const Ie=ie(je,64);re([()=>e.justifyContent,()=>e.size],()=>{ne(()=>{const{type:a}=e;(a==="line"||a==="bar")&&ue()})});const U=L(!1);function Oe(a){var t;const{target:o,contentRect:{width:i}}=a,w=o.parentElement.offsetWidth;if(!U.value)w<i&&(U.value=!0);else{const{value:I}=W;if(!I)return;w-i>I.$el.offsetWidth&&(U.value=!1)}te(((t=y.value)===null||t===void 0?void 0:t.$el)||null)}const He=ie(Oe,64);function Fe(){const{onAdd:a}=e;a&&a(),ne(()=>{const t=R(),{value:o}=y;!t||!o||o.scrollTo({left:t.offsetLeft,top:0,behavior:"smooth"})})}function te(a){if(!a)return;const{placement:t}=e;if(t==="top"||t==="bottom"){const{scrollLeft:o,scrollWidth:i,offsetWidth:w}=a;S.value=o<=0,z.value=o+w>=i}else{const{scrollTop:o,scrollHeight:i,offsetHeight:w}=a;S.value=o<=0,z.value=o+w>=i}}const Me=ie(a=>{te(a.target)},64);Wt(de,{triggerRef:k(e,"trigger"),tabStyleRef:k(e,"tabStyle"),tabClassRef:k(e,"tabClass"),addTabStyleRef:k(e,"addTabStyle"),addTabClassRef:k(e,"addTabClass"),paneClassRef:k(e,"paneClass"),paneStyleRef:k(e,"paneStyle"),mergedClsPrefixRef:v,typeRef:k(e,"type"),closableRef:k(e,"closable"),valueRef:B,tabChangeIdRef:p,onBeforeLeaveRef:k(e,"onBeforeLeave"),activateTab:Ae,handleClose:ke,handleAdd:Fe}),Bt(()=>{V(),be()}),Lt(()=>{const{value:a}=_;if(!a)return;const{value:t}=v,o=`${t}-tabs-nav-scroll-wrapper--shadow-start`,i=`${t}-tabs-nav-scroll-wrapper--shadow-end`;S.value?a.classList.remove(o):a.classList.add(o),z.value?a.classList.remove(i):a.classList.add(i)});const De={syncBarPosition:()=>{V()}},ge=J(()=>{const{value:a}=P,{type:t}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[t],i=`${a}${o}`,{self:{barColor:w,closeIconColor:I,closeIconColorHover:E,closeIconColorPressed:G,tabColor:Ne,tabBorderColor:Ve,paneTextColor:Xe,tabFontWeight:Ue,tabBorderRadius:Ge,tabFontWeightActive:Ke,colorSegment:Ye,fontWeightStrong:qe,tabColorSegment:Je,closeSize:Ze,closeIconSize:Qe,closeColorHover:et,closeColorPressed:tt,closeBorderRadius:at,[j("panePadding",a)]:K,[j("tabPadding",i)]:rt,[j("tabPaddingVertical",i)]:nt,[j("tabGap",i)]:ot,[j("tabGap",`${i}Vertical`)]:it,[j("tabTextColor",t)]:st,[j("tabTextColorActive",t)]:lt,[j("tabTextColorHover",t)]:dt,[j("tabTextColorDisabled",t)]:ct,[j("tabFontSize",a)]:bt},common:{cubicBezierEaseInOut:ft}}=x.value;return{"--n-bezier":ft,"--n-color-segment":Ye,"--n-bar-color":w,"--n-tab-font-size":bt,"--n-tab-text-color":st,"--n-tab-text-color-active":lt,"--n-tab-text-color-disabled":ct,"--n-tab-text-color-hover":dt,"--n-pane-text-color":Xe,"--n-tab-border-color":Ve,"--n-tab-border-radius":Ge,"--n-close-size":Ze,"--n-close-icon-size":Qe,"--n-close-color-hover":et,"--n-close-color-pressed":tt,"--n-close-border-radius":at,"--n-close-icon-color":I,"--n-close-icon-color-hover":E,"--n-close-icon-color-pressed":G,"--n-tab-color":Ne,"--n-tab-font-weight":Ue,"--n-tab-font-weight-active":Ke,"--n-tab-padding":rt,"--n-tab-padding-vertical":nt,"--n-tab-gap":ot,"--n-tab-gap-vertical":it,"--n-pane-padding-left":q(K,"left"),"--n-pane-padding-right":q(K,"right"),"--n-pane-padding-top":q(K,"top"),"--n-pane-padding-bottom":q(K,"bottom"),"--n-font-weight-strong":qe,"--n-tab-color-segment":Je}}),M=f?At("tabs",J(()=>`${P.value[0]}${e.type[0]}`),ge,e):void 0;return Object.assign({mergedClsPrefix:v,mergedValue:B,renderedNames:new Set,segmentCapsuleElRef:D,tabsPaneWrapperRef:X,tabsElRef:h,barElRef:g,addTabInstRef:W,xScrollInstRef:y,scrollWrapperElRef:_,addTabFixed:U,tabWrapperStyle:b,handleNavResize:Ie,mergedSize:P,handleScroll:Me,handleTabsResize:He,cssVars:f?void 0:ge,themeClass:M==null?void 0:M.themeClass,animationDirection:pe,renderNameListRef:fe,yScrollElRef:T,onAnimationBeforeLeave:We,onAnimationEnter:Be,onAnimationAfterEnter:Le,onRender:M==null?void 0:M.onRender},De)},render(){const{mergedClsPrefix:e,type:n,placement:d,addTabFixed:u,addable:l,mergedSize:m,renderNameListRef:v,onRender:f,paneWrapperClass:x,paneWrapperStyle:h,$slots:{default:g,prefix:_,suffix:W}}=this;f==null||f();const y=g?ae(g()).filter(p=>p.type.__TAB_PANE__===!0):[],T=g?ae(g()).filter(p=>p.type.__TAB__===!0):[],S=!T.length,z=n==="card",P=n==="segment",$=!z&&!P&&this.justifyContent;v.value=[];const H=()=>{const p=c("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},$?null:c("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),S?y.map((b,R)=>(v.value.push(b.props.name),se(c(le,Object.assign({},b.props,{internalCreatedByPane:!0,internalLeftPadded:R!==0&&(!$||$==="center"||$==="start"||$==="end")}),b.children?{default:b.children.tab}:void 0)))):T.map((b,R)=>(v.value.push(b.props.name),se(R!==0&&!$?$e(b):b))),!u&&l&&z?Te(l,(S?y.length:T.length)!==0):null,$?null:c("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return c("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},z&&l?c(we,{onResize:this.handleTabsResize},{default:()=>p}):p,z?c("div",{class:`${e}-tabs-pad`}):null,z?null:c("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},B=P?"top":d;return c("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${n}-type`,`${e}-tabs--${m}-size`,$&&`${e}-tabs--flex`,`${e}-tabs--${B}`],style:this.cssVars},c("div",{class:[`${e}-tabs-nav--${n}-type`,`${e}-tabs-nav--${B}`,`${e}-tabs-nav`]},ye(_,p=>p&&c("div",{class:`${e}-tabs-nav__prefix`},p)),P?c("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},c("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},c("div",{class:`${e}-tabs-wrapper`},c("div",{class:`${e}-tabs-tab`}))),S?y.map((p,b)=>(v.value.push(p.props.name),c(le,Object.assign({},p.props,{internalCreatedByPane:!0,internalLeftPadded:b!==0}),p.children?{default:p.children.tab}:void 0))):T.map((p,b)=>(v.value.push(p.props.name),b===0?p:$e(p)))):c(we,{onResize:this.handleNavResize},{default:()=>c("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(B)?c(Mt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:H}):c("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},H()))}),u&&l&&z?Te(l,!0):null,ye(W,p=>p&&c("div",{class:`${e}-tabs-nav__suffix`},p))),S&&(this.animated&&(B==="top"||B==="bottom")?c("div",{ref:"tabsPaneWrapperRef",style:h,class:[`${e}-tabs-pane-wrapper`,x]},Re(y,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Re(y,this.mergedValue,this.renderedNames)))}});function Re(e,n,d,u,l,m,v){const f=[];return e.forEach(x=>{const{name:h,displayDirective:g,"display-directive":_}=x.props,W=T=>g===T||_===T,y=n===h;if(x.key!==void 0&&(x.key=h),y||W("show")||W("show:lazy")&&d.has(h)){d.has(h)||d.add(h);const T=!W("if");f.push(T?jt(x,[[It,y]]):x)}}),v?c(Ot,{name:`${v}-transition`,onBeforeLeave:u,onEnter:l,onAfterEnter:m},{default:()=>f}):f}function Te(e,n){return c(le,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:n,disabled:typeof e=="object"&&e.disabled})}function $e(e){const n=Ht(e);return n.props?n.props.internalLeftPadded=!0:n.props={internalLeftPadded:!0},n}function se(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{oa as _,ia as a};
