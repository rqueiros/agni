(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-62e88db2"],{"0c18":function(e,t,s){},7797:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"header"}},[s("v-list-item",[s("v-list-item-content",[s("v-list-item-title",{staticClass:"display-1"},[e._v(" "+e._s(e.getModuleByResourceId(e.resource.id).name)+" ")]),e.getSheetByResourceId(e.resource.id)?s("v-list-item-subtitle",{staticClass:"title",staticStyle:{color:"red"}},[e._v(" "+e._s(e.getSheetByResourceId(e.resource.id).name))]):e._e(),s("v-list-item-subtitle",{staticClass:"title"},[e._v(e._s(e.resource.name))])],1),s("v-list-item-avatar",{attrs:{tile:"",size:"80",color:"red"}},[s("v-icon",{attrs:{large:"",color:"white"}},[e._v(" "+e._s(e.getIcon(e.resource))+" ")])],1)],1),s("v-card-text",{domProps:{innerHTML:e._s(e.resource.description)}}),void 0!=e.resource.html?s("v-alert",{attrs:{color:"#2A3B4D",dark:"",icon:"mdi-language-html5",dense:""}},[s("code",e._l(e.html_escape(e.resource.html),(function(t){return s("div",{key:t},[e._v(" "+e._s(t)+" ")])})),0)]):e._e()],1)},o=[],r=s("5530"),n=(s("ac1f"),s("1276"),s("2f62")),a={name:"Header",props:{resource:{type:Object}},mounted:function(){console.log("--\x3e>"+this.resource.html)},methods:{getIcon:function(e){var t;switch(e.type){case"video":t="mdi-video";break;case"code":switch(e.subtype){case"blank":t="mdi-text-box-outline";break;case"skeleton":t="mdi-text-box-plus-outline";break;case"buggy":t="mdi-bug";break;case"quiz":t="mdi-head-question-outline";break;default:t="mdi-code-json";break}break;case"sheet":t="mdi-nodejs";break;case"quiz":t="mdi-head-question-outline";break;case"pdf":t="mdi-file-pdf";break;default:break}return t},html_escape:function(e){var t=e.split("\n");return t}},computed:Object(r["a"])({},Object(n["b"])(["getModuleByResourceId","getSheetByResourceId"]))},c=a,l=s("2877"),d=s("6544"),u=s.n(d),h=s("ade3"),p=(s("caad"),s("0c18"),s("10d2")),m=s("afdd"),v=s("9d26"),b=s("f2e7"),f=s("7560"),g=s("2b0e"),_=g["a"].extend({name:"transitionable",props:{mode:String,origin:String,transition:String}}),y=s("58df"),B=s("d9bd"),C=Object(y["a"])(p["a"],b["a"],_).extend({name:"v-alert",props:{border:{type:String,validator:function(e){return["top","right","bottom","left"].includes(e)}},closeLabel:{type:String,default:"$vuetify.close"},coloredBorder:Boolean,dense:Boolean,dismissible:Boolean,closeIcon:{type:String,default:"$cancel"},icon:{default:"",type:[Boolean,String],validator:function(e){return"string"===typeof e||!1===e}},outlined:Boolean,prominent:Boolean,text:Boolean,type:{type:String,validator:function(e){return["info","error","success","warning"].includes(e)}},value:{type:Boolean,default:!0}},computed:{__cachedBorder:function(){if(!this.border)return null;var e={staticClass:"v-alert__border",class:Object(h["a"])({},"v-alert__border--".concat(this.border),!0)};return this.coloredBorder&&(e=this.setBackgroundColor(this.computedColor,e),e["class"]["v-alert__border--has-color"]=!0),this.$createElement("div",e)},__cachedDismissible:function(){var e=this;if(!this.dismissible)return null;var t=this.iconColor;return this.$createElement(m["a"],{staticClass:"v-alert__dismissible",props:{color:t,icon:!0,small:!0},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:function(){return e.isActive=!1}}},[this.$createElement(v["a"],{props:{color:t}},this.closeIcon)])},__cachedIcon:function(){return this.computedIcon?this.$createElement(v["a"],{staticClass:"v-alert__icon",props:{color:this.iconColor}},this.computedIcon):null},classes:function(){var e=Object(r["a"])(Object(r["a"])({},p["a"].options.computed.classes.call(this)),{},{"v-alert--border":Boolean(this.border),"v-alert--dense":this.dense,"v-alert--outlined":this.outlined,"v-alert--prominent":this.prominent,"v-alert--text":this.text});return this.border&&(e["v-alert--border-".concat(this.border)]=!0),e},computedColor:function(){return this.color||this.type},computedIcon:function(){return!1!==this.icon&&("string"===typeof this.icon&&this.icon?this.icon:!!["error","info","success","warning"].includes(this.type)&&"$".concat(this.type))},hasColoredIcon:function(){return this.hasText||Boolean(this.border)&&this.coloredBorder},hasText:function(){return this.text||this.outlined},iconColor:function(){return this.hasColoredIcon?this.computedColor:void 0},isDark:function(){return!(!this.type||this.coloredBorder||this.outlined)||f["a"].options.computed.isDark.call(this)}},created:function(){this.$attrs.hasOwnProperty("outline")&&Object(B["a"])("outline","outlined",this)},methods:{genWrapper:function(){var e=[this.$slots.prepend||this.__cachedIcon,this.genContent(),this.__cachedBorder,this.$slots.append,this.$scopedSlots.close?this.$scopedSlots.close({toggle:this.toggle}):this.__cachedDismissible],t={staticClass:"v-alert__wrapper"};return this.$createElement("div",t,e)},genContent:function(){return this.$createElement("div",{staticClass:"v-alert__content"},this.$slots["default"])},genAlert:function(){var e={staticClass:"v-alert",attrs:{role:"alert"},on:this.listeners$,class:this.classes,style:this.styles,directives:[{name:"show",value:this.isActive}]};if(!this.coloredBorder){var t=this.hasText?this.setTextColor:this.setBackgroundColor;e=t(this.computedColor,e)}return this.$createElement("div",e,[this.genWrapper()])},toggle:function(){this.isActive=!this.isActive}},render:function(e){var t=this.genAlert();return this.transition?e("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[t]):t}}),k=s("99d9"),I=s("132d"),$=s("da13"),x=s("8270"),S=s("5d23"),w=Object(l["a"])(c,i,o,!1,null,null,null);t["default"]=w.exports;u()(w,{VAlert:C,VCardText:k["b"],VIcon:I["a"],VListItem:$["a"],VListItemAvatar:x["a"],VListItemContent:S["a"],VListItemSubtitle:S["b"],VListItemTitle:S["c"]})}}]);
//# sourceMappingURL=chunk-62e88db2.3c16e9fd.js.map