(this["webpackJsonpproverbs-box"]=this["webpackJsonpproverbs-box"]||[]).push([[47],{111:function(t,e,o){"use strict";o.r(e),o.d(e,"ion_checkbox",(function(){return c}));var i=o(35),n=(o(11),o(22)),r=o(176),c=function(){function t(t){var e=this;Object(i.k)(this,t),this.inputId="ion-cb-"+a++,this.name=this.inputId,this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.value="on",this.onClick=function(){e.setFocus(),e.checked=!e.checked,e.indeterminate=!1},this.onFocus=function(){e.ionFocus.emit()},this.onBlur=function(){e.ionBlur.emit()},this.ionChange=Object(i.e)(this,"ionChange",7),this.ionFocus=Object(i.e)(this,"ionFocus",7),this.ionBlur=Object(i.e)(this,"ionBlur",7),this.ionStyle=Object(i.e)(this,"ionStyle",7)}return t.prototype.componentWillLoad=function(){this.emitStyle()},t.prototype.checkedChanged=function(t){this.ionChange.emit({checked:t,value:this.value}),this.emitStyle()},t.prototype.disabledChanged=function(){this.emitStyle()},t.prototype.emitStyle=function(){this.ionStyle.emit({"checkbox-checked":this.checked,"interactive-disabled":this.disabled})},t.prototype.setFocus=function(){this.buttonEl&&this.buttonEl.focus()},t.prototype.render=function(){var t,e=this,o=this,c=o.inputId,a=o.indeterminate,s=o.disabled,h=o.checked,b=o.value,d=o.color,u=o.el,l=c+"-lbl",k=Object(i.d)(this),p=Object(n.f)(u);p&&(p.id=l),Object(n.a)(!0,u,this.name,h?b:"",s);var f=a?Object(i.i)("path",{d:"M6 12L18 12"}):Object(i.i)("path",{d:"M5.9,12.5l3.8,3.8l8.8-8.8"});return"md"===k&&(f=a?Object(i.i)("path",{d:"M2 12H22"}):Object(i.i)("path",{d:"M1.73,12.91 8.1,19.28 22.79,4.59"})),Object(i.i)(i.a,{onClick:this.onClick,role:"checkbox","aria-disabled":s?"true":null,"aria-checked":""+h,"aria-labelledby":l,class:Object.assign(Object.assign({},Object(r.a)(d)),(t={},t[k]=!0,t["in-item"]=Object(r.c)("ion-item",u),t["checkbox-checked"]=h,t["checkbox-disabled"]=s,t["checkbox-indeterminate"]=a,t.interactive=!0,t))},Object(i.i)("svg",{class:"checkbox-icon",viewBox:"0 0 24 24"},f),Object(i.i)("button",{type:"button",onFocus:this.onFocus,onBlur:this.onBlur,disabled:this.disabled,ref:function(t){return e.buttonEl=t}}))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(i.f)(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{checked:["checkedChanged"],disabled:["disabledChanged"]}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return":host{--background-checked:var(--ion-color-primary,#3880ff);--border-color-checked:var(--ion-color-primary,#3880ff);--checkmark-color:var(--ion-color-primary-contrast,#fff);--checkmark-width:1;--transition:none;display:inline-block;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}:host(.ion-color){--background-checked:var(--ion-color-base);--border-color-checked:var(--ion-color-base);--checkmark-color:var(--ion-color-contrast)}button{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none}:host-context([dir=rtl]) button,[dir=rtl] button{left:unset;right:unset;right:0}button::-moz-focus-inner{border:0}.checkbox-icon{border-radius:var(--border-radius);display:block;position:relative;width:100%;height:100%;-webkit-transition:var(--transition);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-sizing:border-box;box-sizing:border-box}.checkbox-icon path{fill:none;stroke:var(--checkmark-color);stroke-width:var(--checkmark-width);opacity:0}:host(.checkbox-checked) .checkbox-icon,:host(.checkbox-indeterminate) .checkbox-icon{border-color:var(--border-color-checked);background:var(--background-checked)}:host(.checkbox-checked) .checkbox-icon path,:host(.checkbox-indeterminate) .checkbox-icon path{opacity:1}:host(.checkbox-disabled){pointer-events:none}:host{--border-radius:calc(var(--size) * .125);--border-width:2px;--border-style:solid;--border-color:rgba(var(--ion-text-color-rgb,0,0,0),0.51);--checkmark-width:3;--background:var(--ion-item-background,var(--ion-background-color,#fff));--transition:background 180ms cubic-bezier(0.4,0,0.2,1);--size:18px;width:var(--size);height:var(--size)}.checkbox-icon path{stroke-dasharray:30;stroke-dashoffset:30}:host(.checkbox-checked) .checkbox-icon path,:host(.checkbox-indeterminate) .checkbox-icon path{stroke-dashoffset:0;-webkit-transition:stroke-dashoffset 90ms linear 90ms;transition:stroke-dashoffset 90ms linear 90ms}:host(.checkbox-disabled){opacity:.3}:host(.in-item){margin-left:0;margin-right:0;margin-top:18px;margin-bottom:18px;display:block;position:static}:host(.in-item[slot=start]){margin-left:4px;margin-right:36px;margin-top:18px;margin-bottom:18px}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host(.in-item[slot=start]){margin-left:unset;margin-right:unset;-webkit-margin-start:4px;margin-inline-start:4px;-webkit-margin-end:36px;margin-inline-end:36px}}"},enumerable:!0,configurable:!0}),t}(),a=0},176:function(t,e,o){"use strict";o.d(e,"a",(function(){return r})),o.d(e,"b",(function(){return c})),o.d(e,"c",(function(){return n})),o.d(e,"d",(function(){return s}));var i=o(2),n=function(t,e){return null!==e.closest(t)},r=function(t){var e;return"string"===typeof t&&t.length>0?((e={"ion-color":!0})["ion-color-"+t]=!0,e):void 0},c=function(t){var e={};return function(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter((function(t){return null!=t})).map((function(t){return t.trim()})).filter((function(t){return""!==t})):[]}(t).forEach((function(t){return e[t]=!0})),e},a=/^[a-z][a-z0-9+\-.]*:/,s=function(t,e,o){return Object(i.a)(void 0,void 0,void 0,(function(){var n;return Object(i.c)(this,(function(i){return null!=t&&"#"!==t[0]&&!a.test(t)&&(n=document.querySelector("ion-router"))?(null!=e&&e.preventDefault(),[2,n.push(t,o)]):[2,!1]}))}))}}}]);
//# sourceMappingURL=47.25c4afc9.chunk.js.map