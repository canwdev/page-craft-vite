import{f as gn,i as bn,e as vn,p as yn,_ as mn}from"./translate.8354cc9a.js";import{d as G,C as k,ac as Tt,ad as pn,ae as yt,D as Fe,af as Nt,r as D,L as he,ag as P,ah as me,ai as Y,K as Ie,aj as z,E as w,J as E,ak as B,H as q,al as ye,N as se,am as He,Y as Kt,M as A,Q as mt,R as Ye,an as xn,ao as kn,V as Cn,ap as Sn,aq as wn,ar as pt,as as Dt,at as lt,Z as Bt,au as Rn,av as et,aw as _n,ax as Tn,ay as Nn,az as tt,aA as Kn,i as Dn,aB as Bn,aC as xt,aD as Fn,a4 as In,a1 as kt,aE as nt,aF as Pn,aG as En,T as Ke,w as Be,aH as ot,aI as Ct,aJ as $n,aK as Ln,aL as An,aM as St,aN as zn,aO as On,s as Mn,$ as Un,_ as jn,o as de,m as De,e as ee,a as Q,F as Me,n as wt,c as Ue,b as je,aP as Vn,a5 as Rt,p as Pe,q as Hn,x as Yn,z as qn,f as Wn}from"./index.6b9976c6.js";import{_ as Gn,a as Xn}from"./PageHeader.73889cca.js";function Ft(e){return typeof e=="string"?`s-${e}`:`n-${e}`}const Jn=G({name:"Switcher",render(){return k("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32"},k("path",{d:"M12 8l10 8l-10 8z"}))}}),Qn=e=>{const{borderColor:t,primaryColor:o,baseColor:l,textColorDisabled:a,inputColorDisabled:i,textColor2:d,opacityDisabled:x,borderRadius:s,fontSizeSmall:g,fontSizeMedium:m,fontSizeLarge:v,heightSmall:b,heightMedium:c,heightLarge:h,lineHeight:u}=e;return Object.assign(Object.assign({},pn),{labelLineHeight:u,buttonHeightSmall:b,buttonHeightMedium:c,buttonHeightLarge:h,fontSizeSmall:g,fontSizeMedium:m,fontSizeLarge:v,boxShadow:`inset 0 0 0 1px ${t}`,boxShadowActive:`inset 0 0 0 1px ${o}`,boxShadowFocus:`inset 0 0 0 1px ${o}, 0 0 0 2px ${yt(o,{alpha:.2})}`,boxShadowHover:`inset 0 0 0 1px ${o}`,boxShadowDisabled:`inset 0 0 0 1px ${t}`,color:l,colorDisabled:i,colorActive:"#0000",textColor:d,textColorDisabled:a,dotColorActive:o,dotColorDisabled:t,buttonBorderColor:t,buttonBorderColorActive:o,buttonBorderColorHover:t,buttonColor:l,buttonColorActive:l,buttonTextColor:d,buttonTextColorActive:o,buttonTextColorHover:o,opacityDisabled:x,buttonBoxShadowFocus:`inset 0 0 0 1px ${o}, 0 0 0 2px ${yt(o,{alpha:.3})}`,buttonBoxShadowHover:"inset 0 0 0 1px #0000",buttonBoxShadow:"inset 0 0 0 1px #0000",buttonBorderRadius:s})},Zn={name:"Radio",common:Tt,self:Qn},eo=Zn,to={name:String,value:{type:[String,Number,Boolean],default:"on"},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},It=Fe("n-radio-group");function no(e){const t=Nt(e,{mergedSize(R){const{size:F}=e;if(F!==void 0)return F;if(d){const{mergedSizeRef:{value:_}}=d;if(_!==void 0)return _}return R?R.mergedSize.value:"medium"},mergedDisabled(R){return!!(e.disabled||d!=null&&d.disabledRef.value||R!=null&&R.disabled.value)}}),{mergedSizeRef:o,mergedDisabledRef:l}=t,a=D(null),i=D(null),d=he(It,null),x=D(e.defaultChecked),s=P(e,"checked"),g=me(s,x),m=Y(()=>d?d.valueRef.value===e.value:g.value),v=Y(()=>{const{name:R}=e;if(R!==void 0)return R;if(d)return d.nameRef.value}),b=D(!1);function c(){if(d){const{doUpdateValue:R}=d,{value:F}=e;z(R,F)}else{const{onUpdateChecked:R,"onUpdate:checked":F}=e,{nTriggerFormInput:_,nTriggerFormChange:N}=t;R&&z(R,!0),F&&z(F,!0),_(),N(),x.value=!0}}function h(){l.value||m.value||c()}function u(){h()}function C(){b.value=!1}function K(){b.value=!0}return{mergedClsPrefix:d?d.mergedClsPrefixRef:Ie(e).mergedClsPrefixRef,inputRef:a,labelRef:i,mergedName:v,mergedDisabled:l,uncontrolledChecked:x,renderSafeChecked:m,focus:b,mergedSize:o,handleRadioInputChange:u,handleRadioInputBlur:C,handleRadioInputFocus:K}}const oo=w("radio-group",`
 display: inline-block;
 font-size: var(--n-font-size);
`,[E("splitor",`
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `,[B("checked",{backgroundColor:"var(--n-button-border-color-active)"}),B("disabled",{opacity:"var(--n-opacity-disabled)"})]),B("button-group",`
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[w("radio-button",{height:"var(--n-height)",lineHeight:"var(--n-height)"}),E("splitor",{height:"var(--n-height)"})]),w("radio-button",`
 vertical-align: bottom;
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-block;
 box-sizing: border-box;
 padding-left: 14px;
 padding-right: 14px;
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-button-text-color);
 border-top: 1px solid var(--n-button-border-color);
 border-bottom: 1px solid var(--n-button-border-color);
 `,[w("radio-input",`
 pointer-events: none;
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 `),E("state-border",`
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `),q("&:first-child",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `,[E("state-border",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]),q("&:last-child",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `,[E("state-border",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]),ye("disabled",`
 cursor: pointer;
 `,[q("&:hover",[E("state-border",`
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `),ye("checked",{color:"var(--n-button-text-color-hover)"})]),B("focus",[q("&:not(:active)",[E("state-border",{boxShadow:"var(--n-button-box-shadow-focus)"})])])]),B("checked",`
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `),B("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]);function ro(e,t,o){var l;const a=[];let i=!1;for(let d=0;d<e.length;++d){const x=e[d],s=(l=x.type)===null||l===void 0?void 0:l.name;s==="RadioButton"&&(i=!0);const g=x.props;if(s!=="RadioButton"){a.push(x);continue}if(d===0)a.push(x);else{const m=a[a.length-1].props,v=t===m.value,b=m.disabled,c=t===g.value,h=g.disabled,u=(v?2:0)+(b?0:1),C=(c?2:0)+(h?0:1),K={[`${o}-radio-group__splitor--disabled`]:b,[`${o}-radio-group__splitor--checked`]:v},R={[`${o}-radio-group__splitor--disabled`]:h,[`${o}-radio-group__splitor--checked`]:c},F=u<C?R:K;a.push(k("div",{class:[`${o}-radio-group__splitor`,F]}),x)}}return{children:a,isButtonGroup:i}}const lo=Object.assign(Object.assign({},se.props),{name:String,value:[String,Number,Boolean],defaultValue:{type:[String,Number,Boolean],default:null},size:String,disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),ao=G({name:"RadioGroup",props:lo,setup(e){const t=D(null),{mergedSizeRef:o,mergedDisabledRef:l,nTriggerFormChange:a,nTriggerFormInput:i,nTriggerFormBlur:d,nTriggerFormFocus:x}=Nt(e),{mergedClsPrefixRef:s,inlineThemeDisabled:g,mergedRtlRef:m}=Ie(e),v=se("Radio","-radio-group",oo,eo,e,s),b=D(e.defaultValue),c=P(e,"value"),h=me(c,b);function u(N){const{onUpdateValue:T,"onUpdate:value":I}=e;T&&z(T,N),I&&z(I,N),b.value=N,a(),i()}function C(N){const{value:T}=t;!T||T.contains(N.relatedTarget)||x()}function K(N){const{value:T}=t;!T||T.contains(N.relatedTarget)||d()}He(It,{mergedClsPrefixRef:s,nameRef:P(e,"name"),valueRef:h,disabledRef:l,mergedSizeRef:o,doUpdateValue:u});const R=Kt("Radio",m,s),F=A(()=>{const{value:N}=o,{common:{cubicBezierEaseInOut:T},self:{buttonBorderColor:I,buttonBorderColorActive:te,buttonBorderRadius:W,buttonBoxShadow:ae,buttonBoxShadowFocus:M,buttonBoxShadowHover:Se,buttonColorActive:X,buttonTextColor:oe,buttonTextColorActive:re,buttonTextColorHover:we,opacityDisabled:Z,[mt("buttonHeight",N)]:y,[mt("fontSize",N)]:$}}=v.value;return{"--n-font-size":$,"--n-bezier":T,"--n-button-border-color":I,"--n-button-border-color-active":te,"--n-button-border-radius":W,"--n-button-box-shadow":ae,"--n-button-box-shadow-focus":M,"--n-button-box-shadow-hover":Se,"--n-button-color-active":X,"--n-button-text-color":oe,"--n-button-text-color-hover":we,"--n-button-text-color-active":re,"--n-height":y,"--n-opacity-disabled":Z}}),_=g?Ye("radio-group",A(()=>o.value[0]),F,e):void 0;return{selfElRef:t,rtlEnabled:R,mergedClsPrefix:s,mergedValue:h,handleFocusout:K,handleFocusin:C,cssVars:g?void 0:F,themeClass:_==null?void 0:_.themeClass,onRender:_==null?void 0:_.onRender}},render(){var e;const{mergedValue:t,mergedClsPrefix:o,handleFocusin:l,handleFocusout:a}=this,{children:i,isButtonGroup:d}=ro(xn(kn(this)),t,o);return(e=this.onRender)===null||e===void 0||e.call(this),k("div",{onFocusin:l,onFocusout:a,ref:"selfElRef",class:[`${o}-radio-group`,this.rtlEnabled&&`${o}-radio-group--rtl`,this.themeClass,d&&`${o}-radio-group--button-group`],style:this.cssVars},i)}}),io=G({name:"RadioButton",props:to,setup:no,render(){const{mergedClsPrefix:e}=this;return k("label",{class:[`${e}-radio-button`,this.mergedDisabled&&`${e}-radio-button--disabled`,this.renderSafeChecked&&`${e}-radio-button--checked`,this.focus&&[`${e}-radio-button--focus`]]},k("input",{ref:"inputRef",type:"radio",class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur}),k("div",{class:`${e}-radio-button__state-border`}),Cn(this.$slots.default,t=>!t&&!this.label?null:k("div",{ref:"labelRef",class:`${e}-radio__label`},t||this.label)))}}),so=e=>{const{baseColor:t,textColor2:o,bodyColor:l,cardColor:a,dividerColor:i,actionColor:d,scrollbarColor:x,scrollbarColorHover:s,invertedColor:g}=e;return{textColor:o,textColorInverted:"#FFF",color:l,colorEmbedded:d,headerColor:a,headerColorInverted:g,footerColor:d,footerColorInverted:g,headerBorderColor:i,headerBorderColorInverted:g,footerBorderColor:i,footerBorderColorInverted:g,siderBorderColor:i,siderBorderColorInverted:g,siderColor:a,siderColorInverted:g,siderToggleButtonBorder:`1px solid ${i}`,siderToggleButtonColor:t,siderToggleButtonIconColor:o,siderToggleButtonIconColorInverted:o,siderToggleBarColor:pt(l,x),siderToggleBarColorHover:pt(l,s),__invertScrollbar:"true"}},co=Sn({name:"Layout",common:Tt,peers:{Scrollbar:wn},self:so}),Pt=co,uo=Fe("n-layout-sider"),Et={type:String,default:"static"},fo=w("layout",`
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[w("layout-scroll-container",`
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `),B("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),ho={embedded:Boolean,position:Et,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentStyle:{type:[String,Object],default:""},hasSider:Boolean,siderPlacement:{type:String,default:"left"}},$t=Fe("n-layout");function Lt(e){return G({name:e?"LayoutContent":"Layout",props:Object.assign(Object.assign({},se.props),ho),setup(t){const o=D(null),l=D(null),{mergedClsPrefixRef:a,inlineThemeDisabled:i}=Ie(t),d=se("Layout","-layout",fo,Pt,t,a);function x(u,C){if(t.nativeScrollbar){const{value:K}=o;K&&(C===void 0?K.scrollTo(u):K.scrollTo(u,C))}else{const{value:K}=l;K&&K.scrollTo(u,C)}}He($t,t);let s=0,g=0;const m=u=>{var C;const K=u.target;s=K.scrollLeft,g=K.scrollTop,(C=t.onScroll)===null||C===void 0||C.call(t,u)};Dt(()=>{if(t.nativeScrollbar){const u=o.value;u&&(u.scrollTop=g,u.scrollLeft=s)}});const v={display:"flex",flexWrap:"nowrap",width:"100%",flexDirection:"row"},b={scrollTo:x},c=A(()=>{const{common:{cubicBezierEaseInOut:u},self:C}=d.value;return{"--n-bezier":u,"--n-color":t.embedded?C.colorEmbedded:C.color,"--n-text-color":C.textColor}}),h=i?Ye("layout",A(()=>t.embedded?"e":""),c,t):void 0;return Object.assign({mergedClsPrefix:a,scrollableElRef:o,scrollbarInstRef:l,hasSiderStyle:v,mergedTheme:d,handleNativeElScroll:m,cssVars:i?void 0:c,themeClass:h==null?void 0:h.themeClass,onRender:h==null?void 0:h.onRender},b)},render(){var t;const{mergedClsPrefix:o,hasSider:l}=this;(t=this.onRender)===null||t===void 0||t.call(this);const a=l?this.hasSiderStyle:void 0,i=[this.themeClass,e&&`${o}-layout-content`,`${o}-layout`,`${o}-layout--${this.position}-positioned`];return k("div",{class:i,style:this.cssVars},this.nativeScrollbar?k("div",{ref:"scrollableElRef",class:`${o}-layout-scroll-container`,style:[this.contentStyle,a],onScroll:this.handleNativeElScroll},this.$slots):k(lt,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentStyle:[this.contentStyle,a]}),this.$slots))}})}const go=Lt(!1),bo=Lt(!0),vo=w("layout-sider",`
 flex-shrink: 0;
 box-sizing: border-box;
 position: relative;
 z-index: 1;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 min-width .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: flex;
 justify-content: flex-end;
`,[B("bordered",[E("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),E("left-placement",[B("bordered",[E("border",`
 right: 0;
 `)])]),B("right-placement",`
 justify-content: flex-start;
 `,[B("bordered",[E("border",`
 left: 0;
 `)]),B("collapsed",[w("layout-toggle-button",[w("base-icon",`
 transform: rotate(180deg);
 `)]),w("layout-toggle-bar",[q("&:hover",[E("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),E("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),w("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[w("base-icon",`
 transform: rotate(0);
 `)]),w("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[q("&:hover",[E("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),E("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),B("collapsed",[w("layout-toggle-bar",[q("&:hover",[E("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),E("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),w("layout-toggle-button",[w("base-icon",`
 transform: rotate(0);
 `)])]),w("layout-toggle-button",`
 transition:
 color .3s var(--n-bezier),
 right .3s var(--n-bezier),
 left .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 cursor: pointer;
 width: 24px;
 height: 24px;
 position: absolute;
 top: 50%;
 right: 0;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 18px;
 color: var(--n-toggle-button-icon-color);
 border: var(--n-toggle-button-border);
 background-color: var(--n-toggle-button-color);
 box-shadow: 0 2px 4px 0px rgba(0, 0, 0, .06);
 transform: translateX(50%) translateY(-50%);
 z-index: 1;
 `,[w("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),w("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[E("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),E("bottom",`
 position: absolute;
 top: 34px;
 `),q("&:hover",[E("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),E("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),E("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),q("&:hover",[E("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),E("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),w("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),B("show-content",[w("layout-sider-scroll-container",{opacity:1})]),B("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),yo=G({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return k("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},k(Bt,{clsPrefix:e},{default:()=>k(Rn,null)}))}}),mo=G({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return k("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},k("div",{class:`${e}-layout-toggle-bar__top`}),k("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),po={position:Et,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerStyle:[String,Object],collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},xo=G({name:"LayoutSider",props:Object.assign(Object.assign({},se.props),po),setup(e){const t=he($t),o=D(null),l=D(null),a=A(()=>et(s.value?e.collapsedWidth:e.width)),i=A(()=>e.collapseMode!=="transform"?{}:{minWidth:et(e.width)}),d=A(()=>t?t.siderPlacement:"left"),x=D(e.defaultCollapsed),s=me(P(e,"collapsed"),x);function g(N,T){if(e.nativeScrollbar){const{value:I}=o;I&&(T===void 0?I.scrollTo(N):I.scrollTo(N,T))}else{const{value:I}=l;I&&I.scrollTo(N,T)}}function m(){const{"onUpdate:collapsed":N,onUpdateCollapsed:T,onExpand:I,onCollapse:te}=e,{value:W}=s;T&&z(T,!W),N&&z(N,!W),x.value=!W,W?I&&z(I):te&&z(te)}let v=0,b=0;const c=N=>{var T;const I=N.target;v=I.scrollLeft,b=I.scrollTop,(T=e.onScroll)===null||T===void 0||T.call(e,N)};Dt(()=>{if(e.nativeScrollbar){const N=o.value;N&&(N.scrollTop=b,N.scrollLeft=v)}}),He(uo,{collapsedRef:s,collapseModeRef:P(e,"collapseMode")});const{mergedClsPrefixRef:h,inlineThemeDisabled:u}=Ie(e),C=se("Layout","-layout-sider",vo,Pt,e,h);function K(N){var T,I;N.propertyName==="max-width"&&(s.value?(T=e.onAfterLeave)===null||T===void 0||T.call(e):(I=e.onAfterEnter)===null||I===void 0||I.call(e))}const R={scrollTo:g},F=A(()=>{const{common:{cubicBezierEaseInOut:N},self:T}=C.value,{siderToggleButtonColor:I,siderToggleButtonBorder:te,siderToggleBarColor:W,siderToggleBarColorHover:ae}=T,M={"--n-bezier":N,"--n-toggle-button-color":I,"--n-toggle-button-border":te,"--n-toggle-bar-color":W,"--n-toggle-bar-color-hover":ae};return e.inverted?(M["--n-color"]=T.siderColorInverted,M["--n-text-color"]=T.textColorInverted,M["--n-border-color"]=T.siderBorderColorInverted,M["--n-toggle-button-icon-color"]=T.siderToggleButtonIconColorInverted,M.__invertScrollbar=T.__invertScrollbar):(M["--n-color"]=T.siderColor,M["--n-text-color"]=T.textColor,M["--n-border-color"]=T.siderBorderColor,M["--n-toggle-button-icon-color"]=T.siderToggleButtonIconColor),M}),_=u?Ye("layout-sider",A(()=>e.inverted?"a":"b"),F,e):void 0;return Object.assign({scrollableElRef:o,scrollbarInstRef:l,mergedClsPrefix:h,mergedTheme:C,styleMaxWidth:a,mergedCollapsed:s,scrollContainerStyle:i,siderPlacement:d,handleNativeElScroll:c,handleTransitionend:K,handleTriggerClick:m,inlineThemeDisabled:u,cssVars:F,themeClass:_==null?void 0:_.themeClass,onRender:_==null?void 0:_.onRender},R)},render(){var e;const{mergedClsPrefix:t,mergedCollapsed:o,showTrigger:l}=this;return(e=this.onRender)===null||e===void 0||e.call(this),k("aside",{class:[`${t}-layout-sider`,this.themeClass,`${t}-layout-sider--${this.position}-positioned`,`${t}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${t}-layout-sider--bordered`,o&&`${t}-layout-sider--collapsed`,(!o||this.showCollapsedContent)&&`${t}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:et(this.width)}]},this.nativeScrollbar?k("div",{class:`${t}-layout-sider-scroll-container`,onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):k(lt,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),l?l==="bar"?k(mo,{clsPrefix:t,style:o?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):k(yo,{clsPrefix:t,style:o?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?k("div",{class:`${t}-layout-sider__border`}):null)}}),ko=Object.assign(Object.assign({},se.props),{trigger:String,xScrollable:Boolean,onScroll:Function}),Co=G({name:"Scrollbar",props:ko,setup(){const e=D(null);return Object.assign(Object.assign({},{scrollTo:(...o)=>{var l;(l=e.value)===null||l===void 0||l.scrollTo(o[0],o[1])},scrollBy:(...o)=>{var l;(l=e.value)===null||l===void 0||l.scrollBy(o[0],o[1])}}),{scrollbarInstRef:e})},render(){return k(lt,Object.assign({ref:"scrollbarInstRef"},this.$props),this.$slots)}}),So=Co,At=Fe("n-tree-select"),Ee=Fe("n-tree"),wo=G({name:"NTreeSwitcher",props:{clsPrefix:{type:String,required:!0},expanded:Boolean,hide:Boolean,loading:Boolean,onClick:Function},setup(e){const{renderSwitcherIconRef:t}=he(Ee,null);return()=>{const{clsPrefix:o}=e;return k("span",{"data-switcher":!0,class:[`${o}-tree-node-switcher`,{[`${o}-tree-node-switcher--expanded`]:e.expanded,[`${o}-tree-node-switcher--hide`]:e.hide}],onClick:e.onClick},k("div",{class:`${o}-tree-node-switcher__icon`},k(_n,null,{default:()=>{if(e.loading)return k(Tn,{clsPrefix:o,key:"loading",radius:85,strokeWidth:20});const{value:l}=t;return l?l():k(Bt,{clsPrefix:o,key:"switcher"},{default:()=>k(Jn,null)})}})))}}}),Ro=G({name:"NTreeNodeCheckbox",props:{clsPrefix:{type:String,required:!0},right:Boolean,focusable:Boolean,disabled:Boolean,checked:Boolean,indeterminate:Boolean,onCheck:Function},setup(e){const t=he(Ee);function o(a){const{onCheck:i}=e;if(i)return i(a)}function l(a){e.indeterminate?o(!1):o(a)}return{handleUpdateValue:l,mergedTheme:t.mergedThemeRef}},render(){const{clsPrefix:e,mergedTheme:t,checked:o,indeterminate:l,disabled:a,focusable:i,handleUpdateValue:d}=this;return k("span",{class:[`${e}-tree-node-checkbox`,this.right&&`${e}-tree-node-checkbox--right`],"data-checkbox":!0},k(Nn,{focusable:i,disabled:a,theme:t.peers.Checkbox,themeOverrides:t.peerOverrides.Checkbox,checked:o,indeterminate:l,onUpdateChecked:d}))}}),_o=G({name:"TreeNodeContent",props:{clsPrefix:{type:String,required:!0},disabled:Boolean,checked:Boolean,selected:Boolean,onClick:Function,onDragstart:Function,tmNode:{type:Object,required:!0},nodeProps:Object},setup(e){const{renderLabelRef:t,renderPrefixRef:o,renderSuffixRef:l,labelFieldRef:a}=he(Ee),i=D(null);function d(s){const{onClick:g}=e;g&&g(s)}function x(s){d(s)}return{selfRef:i,renderLabel:t,renderPrefix:o,renderSuffix:l,labelField:a,handleClick:x}},render(){const{clsPrefix:e,labelField:t,nodeProps:o,checked:l=!1,selected:a=!1,renderLabel:i,renderPrefix:d,renderSuffix:x,handleClick:s,onDragstart:g,tmNode:{rawNode:m,rawNode:{prefix:v,suffix:b,[t]:c}}}=this;return k("span",Object.assign({},o,{ref:"selfRef",class:[`${e}-tree-node-content`,o==null?void 0:o.class],onClick:s,draggable:g===void 0?void 0:!0,onDragstart:g}),d||v?k("div",{class:`${e}-tree-node-content__prefix`},d?d({option:m,selected:a,checked:l}):tt(v)):null,k("div",{class:`${e}-tree-node-content__text`},i?i({option:m,selected:a,checked:l}):tt(c)),x||b?k("div",{class:`${e}-tree-node-content__suffix`},x?x({option:m,selected:a,checked:l}):tt(b)):null)}});function _t({position:e,offsetLevel:t,indent:o,el:l}){const a={position:"absolute",boxSizing:"border-box",right:0};if(e==="inside")a.left=0,a.top=0,a.bottom=0,a.borderRadius="inherit",a.boxShadow="inset 0 0 0 2px var(--n-drop-mark-color)";else{const i=e==="before"?"top":"bottom";a[i]=0,a.left=`${l.offsetLeft+6-t*o}px`,a.height="2px",a.backgroundColor="var(--n-drop-mark-color)",a.transformOrigin=i,a.borderRadius="1px",a.transform=e==="before"?"translateY(-4px)":"translateY(4px)"}return k("div",{style:a})}function To({dropPosition:e,node:t}){return t.isLeaf===!1||t.children?!0:e!=="inside"}function fe(e,t){return!!e.rawNode[t]}function zt(e,t,o,l){e==null||e.forEach(a=>{o(a),zt(a[t],t,o,l),l(a)})}function No(e,t,o,l,a){const i=new Set,d=new Set,x=[];return zt(e,l,s=>{if(x.push(s),a(t,s)){d.add(s[o]);for(let g=x.length-2;g>=0;--g)if(!i.has(x[g][o]))i.add(x[g][o]);else return}},()=>{x.pop()}),{expandedKeys:Array.from(i),highlightKeySet:d}}if(Kn&&Image){const e=new Image;e.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}function Ko(e,t,o,l,a){const i=new Set,d=new Set,x=new Set,s=[],g=[],m=[];function v(c){c.forEach(h=>{if(m.push(h),t(o,h)){i.add(h[l]),x.add(h[l]);for(let C=m.length-2;C>=0;--C){const K=m[C][l];if(!d.has(K))d.add(K),i.has(K)&&i.delete(K);else break}}const u=h[a];u&&v(u),m.pop()})}v(e);function b(c,h){c.forEach(u=>{const C=u[l],K=i.has(C),R=d.has(C);if(!K&&!R)return;const F=u[a];if(F)if(K)h.push(u);else{s.push(C);const _=Object.assign(Object.assign({},u),{[a]:[]});h.push(_),b(F,_[a])}else h.push(u)})}return b(e,g),{filteredTree:g,highlightKeySet:x,expandedKeys:s}}const Do=G({name:"TreeNode",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const t=he(Ee),{droppingNodeParentRef:o,droppingMouseNodeRef:l,draggingNodeRef:a,droppingPositionRef:i,droppingOffsetLevelRef:d,nodePropsRef:x,indentRef:s,blockLineRef:g,checkboxPlacementRef:m,checkOnClickRef:v,disabledFieldRef:b}=t,c=Y(()=>!!e.tmNode.rawNode.checkboxDisabled),h=Y(()=>fe(e.tmNode,b.value)),u=Y(()=>t.disabledRef.value||h.value),C=A(()=>{const{value:y}=x;if(!!y)return y({option:e.tmNode.rawNode})}),K=D(null),R={value:null};Dn(()=>{R.value=K.value.$el});function F(){const{tmNode:y}=e;if(!y.isLeaf&&!y.shallowLoaded){if(!t.loadingKeysRef.value.has(y.key))t.loadingKeysRef.value.add(y.key);else return;const{onLoadRef:{value:$}}=t;$&&$(y.rawNode).then(()=>{t.handleSwitcherClick(y)}).finally(()=>{t.loadingKeysRef.value.delete(y.key)})}else t.handleSwitcherClick(y)}const _=Y(()=>!h.value&&t.selectableRef.value&&(t.internalTreeSelect?t.mergedCheckStrategyRef.value!=="child"||t.multipleRef.value&&t.cascadeRef.value||e.tmNode.isLeaf:!0)),N=Y(()=>t.checkableRef.value&&(t.cascadeRef.value||t.mergedCheckStrategyRef.value!=="child"||e.tmNode.isLeaf)),T=Y(()=>t.displayedCheckedKeysRef.value.includes(e.tmNode.key)),I=Y(()=>{const{value:y}=N;if(!y)return!1;const{value:$}=v;return typeof $=="boolean"?$:$(e.tmNode.rawNode)});function te(y){const{value:$}=t.expandOnClickRef,{value:U}=_,{value:pe}=I;if(!U&&!$&&!pe||xt(y,"checkbox")||xt(y,"switcher"))return;const{tmNode:ge}=e;U&&t.handleSelect(ge),$&&!ge.isLeaf&&F(),pe&&M(!T.value)}function W(y){var $,U;g.value||(u.value||te(y),(U=($=C.value)===null||$===void 0?void 0:$.onClick)===null||U===void 0||U.call($,y))}function ae(y){var $,U;!g.value||(u.value||te(y),(U=($=C.value)===null||$===void 0?void 0:$.onClick)===null||U===void 0||U.call($,y))}function M(y){t.handleCheck(e.tmNode,y)}function Se(y){t.handleDragStart({event:y,node:e.tmNode})}function X(y){y.currentTarget===y.target&&t.handleDragEnter({event:y,node:e.tmNode})}function oe(y){y.preventDefault(),t.handleDragOver({event:y,node:e.tmNode})}function re(y){t.handleDragEnd({event:y,node:e.tmNode})}function we(y){y.currentTarget===y.target&&t.handleDragLeave({event:y,node:e.tmNode})}function Z(y){y.preventDefault(),i.value!==null&&t.handleDrop({event:y,node:e.tmNode,dropPosition:i.value})}return{showDropMark:Y(()=>{const{value:y}=a;if(!y)return;const{value:$}=i;if(!$)return;const{value:U}=l;if(!U)return;const{tmNode:pe}=e;return pe.key===U.key}),showDropMarkAsParent:Y(()=>{const{value:y}=o;if(!y)return!1;const{tmNode:$}=e,{value:U}=i;return U==="before"||U==="after"?y.key===$.key:!1}),pending:Y(()=>t.pendingNodeKeyRef.value===e.tmNode.key),loading:Y(()=>t.loadingKeysRef.value.has(e.tmNode.key)),highlight:Y(()=>{var y;return(y=t.highlightKeySetRef.value)===null||y===void 0?void 0:y.has(e.tmNode.key)}),checked:T,indeterminate:Y(()=>t.displayedIndeterminateKeysRef.value.includes(e.tmNode.key)),selected:Y(()=>t.mergedSelectedKeysRef.value.includes(e.tmNode.key)),expanded:Y(()=>t.mergedExpandedKeysRef.value.includes(e.tmNode.key)),disabled:u,checkable:N,mergedCheckOnClick:I,checkboxDisabled:c,selectable:_,expandOnClick:t.expandOnClickRef,internalScrollable:t.internalScrollableRef,draggable:t.draggableRef,blockLine:g,nodeProps:C,checkboxFocusable:t.internalCheckboxFocusableRef,droppingPosition:i,droppingOffsetLevel:d,indent:s,checkboxPlacement:m,contentInstRef:K,contentElRef:R,handleCheck:M,handleDrop:Z,handleDragStart:Se,handleDragEnter:X,handleDragOver:oe,handleDragEnd:re,handleDragLeave:we,handleLineClick:ae,handleContentClick:W,handleSwitcherClick:F}},render(){const{tmNode:e,clsPrefix:t,checkable:o,expandOnClick:l,selectable:a,selected:i,checked:d,highlight:x,draggable:s,blockLine:g,indent:m,disabled:v,pending:b,internalScrollable:c,nodeProps:h,checkboxPlacement:u}=this,C=s&&!v?{onDragenter:this.handleDragEnter,onDragleave:this.handleDragLeave,onDragend:this.handleDragEnd,onDrop:this.handleDrop,onDragover:this.handleDragOver}:void 0,K=c?Ft(e.key):void 0,R=u==="right",F=o?k(Ro,{right:R,focusable:this.checkboxFocusable,disabled:v||this.checkboxDisabled,clsPrefix:t,checked:this.checked,indeterminate:this.indeterminate,onCheck:this.handleCheck}):null;return k("div",Object.assign({class:`${t}-tree-node-wrapper`},C),k("div",Object.assign({},g?h:void 0,{class:[`${t}-tree-node`,{[`${t}-tree-node--selected`]:i,[`${t}-tree-node--checkable`]:o,[`${t}-tree-node--highlight`]:x,[`${t}-tree-node--pending`]:b,[`${t}-tree-node--disabled`]:v,[`${t}-tree-node--selectable`]:a,[`${t}-tree-node--clickable`]:a||l||this.mergedCheckOnClick},h==null?void 0:h.class],"data-key":K,draggable:s&&g,onClick:this.handleLineClick,onDragstart:s&&g&&!v?this.handleDragStart:void 0}),Bn(e.level,k("div",{class:`${t}-tree-node-indent`},k("div",{style:{width:`${m}px`}}))),k(wo,{clsPrefix:t,expanded:this.expanded,loading:this.loading,hide:e.isLeaf,onClick:this.handleSwitcherClick}),R?null:F,k(_o,{ref:"contentInstRef",clsPrefix:t,checked:d,selected:i,onClick:this.handleContentClick,nodeProps:g?void 0:h,onDragstart:s&&!g&&!v?this.handleDragStart:void 0,tmNode:e}),s?this.showDropMark?_t({el:this.contentElRef.value,position:this.droppingPosition,offsetLevel:this.droppingOffsetLevel,indent:m}):this.showDropMarkAsParent?_t({el:this.contentElRef.value,position:"inside",offsetLevel:this.droppingOffsetLevel,indent:m}):null:null,R?F:null))}}),Ot=Do;function Bo({props:e,fNodesRef:t,mergedExpandedKeysRef:o,mergedSelectedKeysRef:l,handleSelect:a,handleSwitcherClick:i}){const{value:d}=l,x=he(At,null),s=x?x.pendingNodeKeyRef:D(d.length?d[d.length-1]:null);function g(m){if(!e.keyboard)return;const{value:v}=s;if(v===null){if((m.key==="ArrowDown"||m.key==="ArrowUp")&&m.preventDefault(),["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"].includes(m.key)&&v===null){const{value:b}=t;let c=0;for(;c<b.length;){if(!b[c].disabled){s.value=b[c].key;break}c+=1}}}else{const{value:b}=t;let c=b.findIndex(h=>h.key===v);if(!~c)return;if(m.key==="Enter")a(b[c]);else if(m.key==="ArrowDown")for(m.preventDefault(),c+=1;c<b.length;){if(!b[c].disabled){s.value=b[c].key;break}c+=1}else if(m.key==="ArrowUp")for(m.preventDefault(),c-=1;c>=0;){if(!b[c].disabled){s.value=b[c].key;break}c-=1}else if(m.key==="ArrowLeft"){const h=b[c];if(h.isLeaf||!o.value.includes(v)){const u=h.getParent();u&&(s.value=u.key)}else i(h)}else if(m.key==="ArrowRight"){const h=b[c];if(h.isLeaf)return;if(!o.value.includes(v))i(h);else for(c+=1;c<b.length;){if(!b[c].disabled){s.value=b[c].key;break}c+=1}}}}return{pendingNodeKeyRef:s,handleKeydown:g}}const Fo=G({name:"TreeMotionWrapper",props:{clsPrefix:{type:String,required:!0},height:Number,nodes:{type:Array,required:!0},mode:{type:String,required:!0},onAfterEnter:{type:Function,required:!0}},render(){const{clsPrefix:e}=this;return k(In,{onAfterEnter:this.onAfterEnter,appear:!0,reverse:this.mode==="collapse"},{default:()=>k("div",{class:[`${e}-tree-motion-wrapper`,`${e}-tree-motion-wrapper--${this.mode}`],style:{height:Fn(this.height)}},this.nodes.map(t=>k(Ot,{clsPrefix:e,tmNode:t})))})}}),Io=w("tree",`
 font-size: var(--n-font-size);
 outline: none;
`,[q("ul, li",`
 margin: 0;
 padding: 0;
 list-style: none;
 `),q(">",[w("tree-node",[q("&:first-child",{marginTop:0})])]),w("tree-node-indent",`
 flex-grow: 0;
 flex-shrink: 0;
 height: 0;
 `),w("tree-motion-wrapper",[B("expand",[kt({duration:"0.2s"})]),B("collapse",[kt({duration:"0.2s",reverse:!0})])]),w("tree-node-wrapper",`
 box-sizing: border-box;
 padding: 3px 0;
 `),w("tree-node",`
 position: relative;
 display: flex;
 border-radius: var(--n-node-border-radius);
 transition: background-color .3s var(--n-bezier);
 `,[B("highlight",[w("tree-node-content",[E("text",{borderBottomColor:"var(--n-node-text-color-disabled)"})])]),B("disabled",[w("tree-node-content",`
 color: var(--n-node-text-color-disabled);
 cursor: not-allowed;
 `)]),ye("disabled",[B("clickable",[w("tree-node-content",`
 cursor: pointer;
 `)])])]),B("block-node",[w("tree-node-content",`
 flex: 1;
 min-width: 0;
 `)]),ye("block-line",[w("tree-node",[ye("disabled",[w("tree-node-content",[q("&:hover",{backgroundColor:"var(--n-node-color-hover)"})]),B("selectable",[w("tree-node-content",[q("&:active",{backgroundColor:"var(--n-node-color-pressed)"})])]),B("pending",[w("tree-node-content",`
 background-color: var(--n-node-color-hover);
 `)]),B("selected",[w("tree-node-content",{backgroundColor:"var(--n-node-color-active)"})])])])]),B("block-line",[w("tree-node",[ye("disabled",[q("&:hover",{backgroundColor:"var(--n-node-color-hover)"}),B("pending",`
 background-color: var(--n-node-color-hover);
 `),B("selectable",[ye("selected",[q("&:active",{backgroundColor:"var(--n-node-color-pressed)"})])]),B("selected",{backgroundColor:"var(--n-node-color-active)"})]),B("disabled",`
 cursor: not-allowed;
 `)])]),w("tree-node-switcher",`
 cursor: pointer;
 display: inline-flex;
 flex-shrink: 0;
 height: 24px;
 width: 24px;
 align-items: center;
 justify-content: center;
 transition: transform .15s var(--n-bezier);
 vertical-align: bottom;
 `,[E("icon",`
 position: relative;
 height: 14px;
 width: 14px;
 display: flex;
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 font-size: 14px;
 `,[w("icon",[nt()]),w("base-loading",`
 color: var(--n-loading-color);
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `,[nt()]),w("base-icon",[nt()])]),B("hide",{visibility:"hidden"}),B("expanded",{transform:"rotate(90deg)"})]),w("tree-node-checkbox",`
 display: inline-flex;
 height: 24px;
 width: 16px;
 vertical-align: bottom;
 align-items: center;
 justify-content: center;
 margin-right: 4px;
 `,[B("right","margin-left: 4px;")]),B("checkable",[w("tree-node-content",`
 padding: 0 6px;
 `)]),w("tree-node-content",`
 position: relative;
 display: inline-flex;
 align-items: center;
 min-height: 24px;
 box-sizing: border-box;
 line-height: 1.5;
 vertical-align: bottom;
 padding: 0 6px 0 4px;
 cursor: default;
 border-radius: var(--n-node-border-radius);
 text-decoration-color: #0000;
 text-decoration-line: underline;
 color: var(--n-node-text-color);
 transition:
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[q("&:last-child",{marginBottom:0}),E("prefix",`
 display: inline-flex;
 margin-right: 8px;
 `),E("text",`
 border-bottom: 1px solid #0000;
 transition: border-color .3s var(--n-bezier);
 flex-grow: 1;
 max-width: 100%;
 `),E("suffix",`
 display: inline-flex;
 `)]),E("empty","margin: auto;")]);var Po=globalThis&&globalThis.__awaiter||function(e,t,o,l){function a(i){return i instanceof o?i:new o(function(d){d(i)})}return new(o||(o=Promise))(function(i,d){function x(m){try{g(l.next(m))}catch(v){d(v)}}function s(m){try{g(l.throw(m))}catch(v){d(v)}}function g(m){m.done?i(m.value):a(m.value).then(x,s)}g((l=l.apply(e,t||[])).next())})};const Ve=30;function Eo(e,t,o){return{getIsGroup(){return!1},getKey(l){return l[e]},getChildren(l){return l[t]},getDisabled(l){return!!(l[o]||l.checkboxDisabled)}}}const $o={allowCheckingNotLoaded:Boolean,filter:Function,defaultExpandAll:Boolean,expandedKeys:Array,keyField:{type:String,default:"key"},labelField:{type:String,default:"label"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandedKeys:{type:Array,default:()=>[]},indeterminateKeys:Array,renderSwitcherIcon:Function,onUpdateIndeterminateKeys:[Function,Array],"onUpdate:indeterminateKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],"onUpdate:expandedKeys":[Function,Array]},Lo=Object.assign(Object.assign(Object.assign(Object.assign({},se.props),{accordion:Boolean,showIrrelevantNodes:{type:Boolean,default:!0},data:{type:Array,default:()=>[]},expandOnDragenter:{type:Boolean,default:!0},expandOnClick:Boolean,checkOnClick:{type:[Boolean,Function],default:!1},cancelable:{type:Boolean,default:!0},checkable:Boolean,draggable:Boolean,blockNode:Boolean,blockLine:Boolean,disabled:Boolean,checkedKeys:Array,defaultCheckedKeys:{type:Array,default:()=>[]},selectedKeys:Array,defaultSelectedKeys:{type:Array,default:()=>[]},multiple:Boolean,pattern:{type:String,default:""},onLoad:Function,cascade:Boolean,selectable:{type:Boolean,default:!0},indent:{type:Number,default:16},allowDrop:{type:Function,default:To},animated:{type:Boolean,default:!0},checkboxPlacement:{type:String,default:"left"},virtualScroll:Boolean,watchProps:Array,renderLabel:Function,renderPrefix:Function,renderSuffix:Function,nodeProps:Function,keyboard:{type:Boolean,default:!0},onDragenter:[Function,Array],onDragleave:[Function,Array],onDragend:[Function,Array],onDragstart:[Function,Array],onDragover:[Function,Array],onDrop:[Function,Array],onUpdateCheckedKeys:[Function,Array],"onUpdate:checkedKeys":[Function,Array],onUpdateSelectedKeys:[Function,Array],"onUpdate:selectedKeys":[Function,Array]}),$o),{internalTreeSelect:Boolean,internalScrollable:Boolean,internalScrollablePadding:String,internalRenderEmpty:Function,internalHighlightKeySet:Object,internalUnifySelectCheck:Boolean,internalCheckboxFocusable:{type:Boolean,default:!0},internalFocusable:{type:Boolean,default:!0},checkStrategy:{type:String,default:"all"},leafOnly:Boolean}),Ao=G({name:"Tree",props:Lo,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o,mergedRtlRef:l}=Ie(e),a=Kt("Tree",l,t),i=se("Tree","-tree",Io,Pn,e,t),d=D(null),x=D(null),s=D(null);function g(){var n;return(n=s.value)===null||n===void 0?void 0:n.listElRef}function m(){var n;return(n=s.value)===null||n===void 0?void 0:n.itemsElRef}const v=A(()=>{const{pattern:n}=e;return n?!n.length||!qe.value?{filteredTree:e.data,highlightKeySet:null,expandedKeys:void 0}:Ko(e.data,qe.value,n,e.keyField,e.childrenField):{filteredTree:e.data,highlightKeySet:null,expandedKeys:void 0}}),b=A(()=>En(e.showIrrelevantNodes?e.data:v.value.filteredTree,Eo(e.keyField,e.childrenField,e.disabledField))),c=he(At,null),h=e.internalTreeSelect?c.dataTreeMate:b,{watchProps:u}=e,C=D([]);u!=null&&u.includes("defaultCheckedKeys")?Ke(()=>{C.value=e.defaultCheckedKeys}):C.value=e.defaultCheckedKeys;const K=P(e,"checkedKeys"),R=me(K,C),F=A(()=>h.value.getCheckedKeys(R.value,{cascade:e.cascade,allowNotLoaded:e.allowCheckingNotLoaded})),_=A(()=>e.leafOnly?"child":e.checkStrategy),N=A(()=>F.value.checkedKeys),T=A(()=>{const{indeterminateKeys:n}=e;return n!==void 0?n:F.value.indeterminateKeys}),I=D([]);u!=null&&u.includes("defaultSelectedKeys")?Ke(()=>{I.value=e.defaultSelectedKeys}):I.value=e.defaultSelectedKeys;const te=P(e,"selectedKeys"),W=me(te,I),ae=D([]),M=n=>{ae.value=e.defaultExpandAll?h.value.getNonLeafKeys():n===void 0?e.defaultExpandedKeys:n};u!=null&&u.includes("defaultExpandedKeys")?Ke(()=>M(void 0)):Ke(()=>M(e.defaultExpandedKeys));const Se=P(e,"expandedKeys"),X=me(Se,ae),oe=A(()=>b.value.getFlattenedNodes(X.value)),{pendingNodeKeyRef:re,handleKeydown:we}=Bo({props:e,mergedSelectedKeysRef:W,fNodesRef:oe,mergedExpandedKeysRef:X,handleSelect:Je,handleSwitcherClick:ct});let Z=null,y=null;const $=D(new Set),U=A(()=>e.internalHighlightKeySet||v.value.highlightKeySet),pe=me(U,$),ge=D(new Set),Mt=A(()=>X.value.filter(n=>!ge.value.has(n)));let at=0;const Re=D(null),$e=D(null),Le=D(null),Ae=D(null),ze=D(0),Ut=A(()=>{const{value:n}=$e;return n?n.parent:null}),qe=A(()=>{const{filter:n}=e;if(n)return n;const{labelField:r}=e;return(f,p)=>{if(!f.length)return!0;const S=p[r];return typeof S=="string"?S.toLowerCase().includes(f.toLowerCase()):!1}});Be(P(e,"data"),()=>{ge.value.clear(),re.value=null,Te()},{deep:!1});let We=!1;const Ge=()=>{We=!0,ot(()=>{We=!1})};let _e;Be(P(e,"pattern"),(n,r)=>{if(e.showIrrelevantNodes)if(_e=void 0,n){const{expandedKeys:f,highlightKeySet:p}=No(e.data,e.pattern,e.keyField,e.childrenField,qe.value);$.value=p,Ge(),ke(f,ne(f))}else $.value=new Set;else if(!n.length)_e!==void 0&&(Ge(),ke(_e,ne(_e)));else{r.length||(_e=X.value);const{expandedKeys:f}=v.value;f!==void 0&&(Ge(),ke(f,ne(f)))}});function it(n){return Po(this,void 0,void 0,function*(){const{onLoad:r}=e;if(!r)return yield Promise.resolve();const{value:f}=ge;return yield new Promise(p=>{f.has(n.key)||(f.add(n.key),r(n.rawNode).then(()=>{f.delete(n.key),p()}).catch(S=>{console.error(S),Ne()}))})})}Ke(()=>{var n;const{value:r}=b;if(!r)return;const{getNode:f}=r;(n=X.value)===null||n===void 0||n.forEach(p=>{const S=f(p);S&&!S.shallowLoaded&&it(S)})});const xe=D(!1),ce=D([]);Be(Mt,(n,r)=>{if(!e.animated||We){ot(Oe);return}const f=new Set(r);let p=null,S=null;for(const O of n)if(!f.has(O)){if(p!==null)return;p=O}const V=new Set(n);for(const O of r)if(!V.has(O)){if(S!==null)return;S=O}if(p===null&&S===null)return;const{virtualScroll:j}=e,ie=(j?s.value.listElRef:d.value).offsetHeight,ve=Math.ceil(ie/Ve)+1;let le;if(p!==null&&(le=r),S!==null&&(le===void 0?le=n:le=le.filter(O=>O!==S)),xe.value=!0,ce.value=b.value.getFlattenedNodes(le),p!==null){const O=ce.value.findIndex(H=>H.key===p);if(~O){const H=ce.value[O].children;if(H){const ue=Ct(H,n);ce.value.splice(O+1,0,{__motion:!0,mode:"expand",height:j?ue.length*Ve:void 0,nodes:j?ue.slice(0,ve):ue})}}}if(S!==null){const O=ce.value.findIndex(H=>H.key===S);if(~O){const H=ce.value[O].children;if(!H)return;xe.value=!0;const ue=Ct(H,n);ce.value.splice(O+1,0,{__motion:!0,mode:"collapse",height:j?ue.length*Ve:void 0,nodes:j?ue.slice(0,ve):ue})}}});const jt=A(()=>$n(oe.value)),Vt=A(()=>xe.value?ce.value:oe.value);function Oe(){const{value:n}=x;n&&n.sync()}function Ht(){xe.value=!1,e.virtualScroll&&ot(Oe)}function ne(n){const{getNode:r}=h.value;return n.map(f=>{var p;return((p=r(f))===null||p===void 0?void 0:p.rawNode)||null})}function ke(n,r){const{"onUpdate:expandedKeys":f,onUpdateExpandedKeys:p}=e;ae.value=n,f&&z(f,n,r),p&&z(p,n,r)}function dt(n,r){const{"onUpdate:checkedKeys":f,onUpdateCheckedKeys:p}=e;C.value=n,p&&z(p,n,r),f&&z(f,n,r)}function Yt(n,r){const{"onUpdate:indeterminateKeys":f,onUpdateIndeterminateKeys:p}=e;f&&z(f,n,r),p&&z(p,n,r)}function Xe(n,r){const{"onUpdate:selectedKeys":f,onUpdateSelectedKeys:p}=e;I.value=n,p&&z(p,n,r),f&&z(f,n,r)}function qt(n){const{onDragenter:r}=e;r&&z(r,n)}function Wt(n){const{onDragleave:r}=e;r&&z(r,n)}function Gt(n){const{onDragend:r}=e;r&&z(r,n)}function Xt(n){const{onDragstart:r}=e;r&&z(r,n)}function Jt(n){const{onDragover:r}=e;r&&z(r,n)}function Qt(n){const{onDrop:r}=e;r&&z(r,n)}function Te(){Zt(),be()}function Zt(){Re.value=null}function be(){ze.value=0,$e.value=null,Le.value=null,Ae.value=null,Ne()}function Ne(){Z&&(window.clearTimeout(Z),Z=null),y=null}function st(n,r){if(e.disabled||fe(n,e.disabledField))return;if(e.internalUnifySelectCheck&&!e.multiple){Je(n);return}const{checkedKeys:f,indeterminateKeys:p}=h.value[r?"check":"uncheck"](n.key,N.value,{cascade:e.cascade,checkStrategy:_.value,allowNotLoaded:e.allowCheckingNotLoaded});dt(f,ne(f)),Yt(p,ne(p))}function en(n){if(e.disabled)return;const{key:r}=n,{value:f}=X,p=f.findIndex(S=>S===r);if(~p){const S=Array.from(f);S.splice(p,1),ke(S,ne(S))}else{const S=b.value.getNode(r);if(!S||S.isLeaf)return;let V;if(e.accordion){const j=new Set(n.siblings.map(({key:ie})=>ie));V=f.filter(ie=>!j.has(ie)),V.push(r)}else V=f.concat(r);ke(V,ne(V))}}function ct(n){e.disabled||xe.value||en(n)}function Je(n){if(!(e.disabled||!e.selectable)){if(re.value=n.key,e.internalUnifySelectCheck){const{value:{checkedKeys:r,indeterminateKeys:f}}=F;e.multiple?st(n,!(r.includes(n.key)||f.includes(n.key))):dt([n.key],ne([n.key]))}if(e.multiple){const r=Array.from(W.value),f=r.findIndex(p=>p===n.key);~f?e.cancelable&&r.splice(f,1):~f||r.push(n.key),Xe(r,ne(r))}else W.value.includes(n.key)?e.cancelable&&Xe([],[]):Xe([n.key],ne([n.key]))}}function tn(n){if(Z&&(window.clearTimeout(Z),Z=null),n.isLeaf)return;y=n.key;const r=()=>{if(y!==n.key)return;const{value:f}=Le;if(f&&f.key===n.key&&!X.value.includes(n.key)){const p=X.value.concat(n.key);ke(p,ne(p))}Z=null,y=null};n.shallowLoaded?Z=window.setTimeout(()=>{r()},1e3):Z=window.setTimeout(()=>{it(n).then(()=>{r()})},1e3)}function nn({event:n,node:r}){!e.draggable||e.disabled||fe(r,e.disabledField)||(ut({event:n,node:r},!1),qt({event:n,node:r.rawNode}))}function on({event:n,node:r}){!e.draggable||e.disabled||fe(r,e.disabledField)||Wt({event:n,node:r.rawNode})}function rn(n){n.target===n.currentTarget&&be()}function ln({event:n,node:r}){Te(),!(!e.draggable||e.disabled||fe(r,e.disabledField))&&Gt({event:n,node:r.rawNode})}function an({event:n,node:r}){!e.draggable||e.disabled||fe(r,e.disabledField)||(at=n.clientX,Re.value=r,Xt({event:n,node:r.rawNode}))}function ut({event:n,node:r},f=!0){var p;if(!e.draggable||e.disabled||fe(r,e.disabledField))return;const{value:S}=Re;if(!S)return;const{allowDrop:V,indent:j}=e;f&&Jt({event:n,node:r.rawNode});const ie=n.currentTarget,{height:ve,top:le}=ie.getBoundingClientRect(),O=n.clientY-le;let H;V({node:r.rawNode,dropPosition:"inside",phase:"drag"})?O<=8?H="before":O>=ve-8?H="after":H="inside":O<=ve/2?H="before":H="after";const{value:hn}=jt;let L,J;const Qe=hn(r.key);if(Qe===null){be();return}let gt=!1;H==="inside"?(L=r,J="inside"):H==="before"?r.isFirstChild?(L=r,J="before"):(L=oe.value[Qe-1],J="after"):(L=r,J="after"),!L.isLeaf&&X.value.includes(L.key)&&(gt=!0,J==="after"&&(L=oe.value[Qe+1],L?J="before":(L=r,J="inside")));const bt=L;if(Le.value=bt,!gt&&S.isLastChild&&S.key===L.key&&(J="after"),J==="after"){let vt=at-n.clientX,Ze=0;for(;vt>=j/2&&L.parent!==null&&L.isLastChild&&Ze<1;)vt-=j,Ze+=1,L=L.parent;ze.value=Ze}else ze.value=0;if((S.contains(L)||J==="inside"&&((p=S.parent)===null||p===void 0?void 0:p.key)===L.key)&&!(S.key===bt.key&&S.key===L.key)){be();return}if(!V({node:L.rawNode,dropPosition:J,phase:"drag"})){be();return}if(S.key===L.key)Ne();else if(y!==L.key)if(J==="inside"){if(e.expandOnDragenter){if(tn(L),!L.shallowLoaded&&y!==L.key){Te();return}}else if(!L.shallowLoaded){Te();return}}else Ne();else J!=="inside"&&Ne();Ae.value=J,$e.value=L}function dn({event:n,node:r,dropPosition:f}){if(!e.draggable||e.disabled||fe(r,e.disabledField))return;const{value:p}=Re,{value:S}=$e,{value:V}=Ae;if(!(!p||!S||!V)&&!!e.allowDrop({node:S.rawNode,dropPosition:V,phase:"drag"})&&p.key!==S.key){if(V==="before"){const j=p.getNext({includeDisabled:!0});if(j&&j.key===S.key){be();return}}if(V==="after"){const j=p.getPrev({includeDisabled:!0});if(j&&j.key===S.key){be();return}}Qt({event:n,node:S.rawNode,dragNode:p.rawNode,dropPosition:f}),Te()}}function sn(){Oe()}function cn(){Oe()}function un(n){var r;if(e.virtualScroll||e.internalScrollable){const{value:f}=x;if(!((r=f==null?void 0:f.containerRef)===null||r===void 0)&&r.contains(n.relatedTarget))return;re.value=null}else{const{value:f}=d;if(f!=null&&f.contains(n.relatedTarget))return;re.value=null}}Be(re,n=>{var r,f;if(n!==null){if(e.virtualScroll)(r=s.value)===null||r===void 0||r.scrollTo({key:n});else if(e.internalScrollable){const{value:p}=x;if(p===null)return;const S=(f=p.contentRef)===null||f===void 0?void 0:f.querySelector(`[data-key="${Ft(n)}"]`);if(!S)return;p.scrollTo({el:S})}}}),He(Ee,{loadingKeysRef:ge,highlightKeySetRef:pe,displayedCheckedKeysRef:N,displayedIndeterminateKeysRef:T,mergedSelectedKeysRef:W,mergedExpandedKeysRef:X,mergedThemeRef:i,mergedCheckStrategyRef:_,nodePropsRef:P(e,"nodeProps"),disabledRef:P(e,"disabled"),checkableRef:P(e,"checkable"),selectableRef:P(e,"selectable"),expandOnClickRef:P(e,"expandOnClick"),onLoadRef:P(e,"onLoad"),draggableRef:P(e,"draggable"),blockLineRef:P(e,"blockLine"),indentRef:P(e,"indent"),cascadeRef:P(e,"cascade"),checkOnClickRef:P(e,"checkOnClick"),checkboxPlacementRef:e.checkboxPlacement,droppingMouseNodeRef:Le,droppingNodeParentRef:Ut,draggingNodeRef:Re,droppingPositionRef:Ae,droppingOffsetLevelRef:ze,fNodesRef:oe,pendingNodeKeyRef:re,disabledFieldRef:P(e,"disabledField"),internalScrollableRef:P(e,"internalScrollable"),internalCheckboxFocusableRef:P(e,"internalCheckboxFocusable"),internalTreeSelect:e.internalTreeSelect,renderLabelRef:P(e,"renderLabel"),renderPrefixRef:P(e,"renderPrefix"),renderSuffixRef:P(e,"renderSuffix"),renderSwitcherIconRef:P(e,"renderSwitcherIcon"),labelFieldRef:P(e,"labelField"),multipleRef:P(e,"multiple"),handleSwitcherClick:ct,handleDragEnd:ln,handleDragEnter:nn,handleDragLeave:on,handleDragStart:an,handleDrop:dn,handleDragOver:ut,handleSelect:Je,handleCheck:st});function fn(n){var r;(r=s.value)===null||r===void 0||r.scrollTo(n)}const ft={handleKeydown:we,scrollTo:fn},ht=A(()=>{const{common:{cubicBezierEaseInOut:n},self:{fontSize:r,nodeBorderRadius:f,nodeColorHover:p,nodeColorPressed:S,nodeColorActive:V,arrowColor:j,loadingColor:ie,nodeTextColor:ve,nodeTextColorDisabled:le,dropMarkColor:O}}=i.value;return{"--n-arrow-color":j,"--n-loading-color":ie,"--n-bezier":n,"--n-font-size":r,"--n-node-border-radius":f,"--n-node-color-active":V,"--n-node-color-hover":p,"--n-node-color-pressed":S,"--n-node-text-color":ve,"--n-node-text-color-disabled":le,"--n-drop-mark-color":O}}),Ce=o?Ye("tree",void 0,ht,e):void 0;return{mergedClsPrefix:t,mergedTheme:i,rtlEnabled:a,fNodes:Vt,aip:xe,selfElRef:d,virtualListInstRef:s,scrollbarInstRef:x,handleFocusout:un,handleDragLeaveTree:rn,handleScroll:sn,getScrollContainer:g,getScrollContent:m,handleAfterEnter:Ht,handleResize:cn,handleKeydown:ft.handleKeydown,scrollTo:ft.scrollTo,cssVars:o?void 0:ht,themeClass:Ce==null?void 0:Ce.themeClass,onRender:Ce==null?void 0:Ce.onRender}},render(){var e;const{fNodes:t,internalRenderEmpty:o}=this;if(!t.length&&o)return o();const{mergedClsPrefix:l,blockNode:a,blockLine:i,draggable:d,disabled:x,internalFocusable:s,checkable:g,handleKeydown:m,rtlEnabled:v,handleFocusout:b}=this,c=s&&!x,h=c?"0":void 0,u=[`${l}-tree`,v&&`${l}-tree--rtl`,g&&`${l}-tree--checkable`,(i||a)&&`${l}-tree--block-node`,i&&`${l}-tree--block-line`],C=R=>"__motion"in R?k(Fo,{height:R.height,nodes:R.nodes,clsPrefix:l,mode:R.mode,onAfterEnter:this.handleAfterEnter}):k(Ot,{key:R.key,tmNode:R,clsPrefix:l});if(this.virtualScroll){const{mergedTheme:R,internalScrollablePadding:F}=this,_=Ln(F||"0");return k(St,{ref:"scrollbarInstRef",onDragleave:d?this.handleDragLeaveTree:void 0,container:this.getScrollContainer,content:this.getScrollContent,class:u,theme:R.peers.Scrollbar,themeOverrides:R.peerOverrides.Scrollbar,tabindex:h,onKeydown:c?m:void 0,onFocusout:c?b:void 0},{default:()=>{var N;return(N=this.onRender)===null||N===void 0||N.call(this),k(An,{ref:"virtualListInstRef",items:this.fNodes,itemSize:Ve,ignoreItemResize:this.aip,paddingTop:_.top,paddingBottom:_.bottom,class:this.themeClass,style:[this.cssVars,{paddingLeft:_.left,paddingRight:_.right}],onScroll:this.handleScroll,onResize:this.handleResize,showScrollbar:!1,itemResizable:!0},{default:({item:T})=>C(T)})}})}const{internalScrollable:K}=this;return u.push(this.themeClass),(e=this.onRender)===null||e===void 0||e.call(this),K?k(St,{class:u,tabindex:h,onKeydown:c?m:void 0,onFocusout:c?b:void 0,style:this.cssVars,contentStyle:{padding:this.internalScrollablePadding}},{default:()=>k("div",{onDragleave:d?this.handleDragLeaveTree:void 0,ref:"selfElRef"},this.fNodes.map(C))}):k("div",{class:u,tabindex:h,ref:"selfElRef",style:this.cssVars,onKeydown:c?m:void 0,onFocusout:c?b:void 0,onDragleave:d?this.handleDragLeaveTree:void 0},t.length?t.map(C):zn(this.$slots.empty,()=>[k(On,{class:`${l}-tree__empty`,theme:this.mergedTheme.peers.Empty,themeOverrides:this.mergedTheme.peerOverrides.Empty})]))}});let rt=0;const zo=G({name:"VueI18nDirTool",components:{},setup(){const e=Mn([]),t=async(v,b=0,c=[])=>{rt++;let h=0;for await(const u of v.values())if(h++,u.kind==="directory"){let C=[];c.push({key:`${rt}-D-${b}-${h}`,kind:u.kind,label:u.name,entry:u,children:C}),await t(u,b+1,C)}else c.push({key:`${rt}-F-${b}-${h}`,kind:u.kind,label:u.name,entry:u,children:null});return c},o=async()=>{const v=await window.showDirectoryPicker();e.value=await t(v)},l=D(!1),a=D(null),i=D(null),d=async()=>{try{const v=a.value;if(!v)return;const b=await v.getFile(),c=await v.createWritable();s.value==="gui"&&(i.value=JSON.stringify(vn(g.value),null,2)),await c.write(i.value),await c.close(),window.$message.success("Saved!")}catch(v){console.error(v),window.$message.error("Save Failed!"+v.message)}},x=["text","gui","batch"],s=D("gui"),g=D([gn()]),m=()=>{if(s.value!=="text"){if(!i.value){g.value=[];return}const v=JSON.parse(i.value);g.value=yn(v)}};return Be(s,v=>{m()}),{iconTranslate:bn,handlePickDir:o,dirTree:e,nodeProps:({option:v})=>({async onClick(){if(v.kind==="file"){const b=v.entry;a.value=b;const c=await Un(await b.getFile());i.value=c,l.value=!0,m()}}}),isShowFileEdit:l,currentEditText:i,handleSaveFile:d,editMode:s,editModeList:x,translateTreeRoot:g}}});const Oo={class:"vue-i18n-copy-tool"},Mo=Pe(" Vue i18n Dir Tool "),Uo=Pe(" Edit Mode:"),jo=Pe(" Pick i18n Directory "),Vo={class:"_container"},Ho={class:"main-edit-wrap"},Yo={class:"action-row"},qo=Pe("Save File"),Wo={class:"edit-content-wrap"},Go=Pe(" batch ");function Xo(e,t,o,l,a,i){const d=Gn,x=io,s=ao,g=Hn,m=Yn,v=Xn,b=qn,c=Ao,h=So,u=xo,C=Wn,K=mn,R=bo,F=go;return de(),De("div",Oo,[ee(b,{size:"small"},{default:Q(()=>[ee(v,{subtitle:"",onBack:t[1]||(t[1]=_=>e.$router.push({name:"HomeView"}))},{title:Q(()=>[Mo]),avatar:Q(()=>[ee(d,{src:e.iconTranslate,style:{background:"none"}},null,8,["src"])]),extra:Q(()=>[ee(m,{align:"center"},{default:Q(()=>[Uo,ee(s,{size:"small",value:e.editMode,"onUpdate:value":t[0]||(t[0]=_=>e.editMode=_)},{default:Q(()=>[(de(!0),De(Me,null,wt(e.editModeList,_=>(de(),Ue(x,{key:_,value:_,label:_.toUpperCase()},null,8,["value","label"]))),128))]),_:1},8,["value"]),ee(g,{type:"primary",size:"small",onClick:e.handlePickDir},{default:Q(()=>[jo]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1}),je("div",Vo,[ee(F,{style:{height:"100%"},"has-sider":""},{default:Q(()=>[ee(u,{"collapse-mode":"width","collapsed-width":0,width:300,"show-trigger":"arrow-circle","content-style":"padding: 10px;",bordered:""},{default:Q(()=>[ee(h,{style:{height:"100%"}},{default:Q(()=>[ee(c,{"block-line":"",data:e.dirTree,"node-props":e.nodeProps,"default-expand-all":"","expand-on-click":"",selectable:""},null,8,["data","node-props"])]),_:1})]),_:1}),ee(R,null,{default:Q(()=>[je("div",Ho,[e.isShowFileEdit?(de(),De(Me,{key:0},[je("div",Yo,[ee(g,{type:"primary",onClick:e.handleSaveFile},{default:Q(()=>[qo]),_:1},8,["onClick"])]),je("div",Wo,[e.editMode==="text"?(de(),Ue(C,{key:0,type:"textarea",value:e.currentEditText,"onUpdate:value":t[2]||(t[2]=_=>e.currentEditText=_),class:"font-code",style:{height:"100%"},placeholder:"Edit Text"},null,8,["value"])):(de(),De(Me,{key:1},[ee(h,{style:Vn([{height:"100%"},{width:e.editMode==="batch"?"400px":"100%"}])},{default:Q(()=>[(de(!0),De(Me,null,wt(e.translateTreeRoot,(_,N)=>(de(),Ue(K,{key:N,item:_,"is-lite":e.editMode==="batch"},null,8,["item","is-lite"]))),128))]),_:1},8,["style"]),e.editMode==="batch"?(de(),Ue(h,{key:0,style:{height:"100%"}},{default:Q(()=>[Go]),_:1})):Rt("",!0)],64))])],64)):Rt("",!0)])]),_:1})]),_:1})])])}const er=jn(zo,[["render",Xo],["__scopeId","data-v-af474822"]]);export{er as default};
