(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e429b4ea","chunk-0fc38cb1"],{"0160":function(e,t,i){},"273a":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-card",{staticClass:"mx-auto",attrs:{outlined:""}},[i("v-list-item",[i("v-list-item-content",[i("v-list-item-title",{staticClass:"display-1"},[e._v(" TIMELINE ")]),i("v-list-item-subtitle",[e._v("Jump in the "+e._s(e.resource.type.toUpperCase())+" for specific topics!")])],1),i("v-list-item-avatar",{attrs:{tile:"",size:"80",color:"green"}},[i("v-icon",{attrs:{large:"",color:"white"}},[e._v(" mdi-timeline-clock ")])],1)],1),i("v-card-text",["video"==e.resource.type?i("v-subheader",[e._v(" Video length: "+e._s(e.convert(e.duration))+" ")]):i("v-subheader",[e._v("PDF length: "+e._s(e.resource.milestones.find((function(e){return"End"===e.label})).index)+" pages ")]),0!=e.resource.milestones.length?i("v-timeline",{attrs:{"align-top":"",dense:""}},e._l(e.resource.milestones,(function(t){return i("v-timeline-item",{key:t.index,staticClass:"milestone",attrs:{icon:e.getIcon(t),color:e.getColor(t)},nativeOn:{click:function(i){return e.goto(t.index)}}},[i("v-row",[i("v-col",{staticClass:"mt-1"},[i("strong",{staticClass:"subtitle-1",domProps:{innerHTML:e._s(e.convert(t.index)+" - "+t.label)}})])],1)],1)})),1):i("div",{staticClass:"overline text-center"},[e._v("no milestones found!")])],1)],1)},s=[],o=(i("99af"),i("b65f"),{props:{resource:Object},data:function(){return{selected:0,duration:0}},methods:{setDuration:function(e){this.duration=e},goto:function(e){this.selected=e,this.$emit("onMilestone",e)},convert:function(e){return"video"==this.resource.type?e<60?"".concat(e,"''"):"".concat(Math.trunc(e/60),"'").concat(Math.trunc(e%60),"''"):"".concat(e)},getColor:function(e){var t;return t=e.index==this.selected?"black":"Start"==e.label?"green":"End"==e.label?"red":"blue",t},getIcon:function(e){var t;return t="Start"==e.label||"End"==e.label?"mdi-flag-triangle":"mdi-play",t}}}),a=o,r=(i("6df4"),i("2877")),l=i("6544"),c=i.n(l),u=i("b0af"),d=i("99d9"),m=i("62ad"),v=i("132d"),h=i("da13"),f=i("8270"),p=i("5d23"),g=i("0fd9"),b=i("e0c7"),_=i("5530"),C=(i("26e9"),i("0160"),i("58df")),x=i("7560"),V=Object(C["a"])(x["a"]).extend({name:"v-timeline",provide:function(){return{timeline:this}},props:{alignTop:Boolean,dense:Boolean,reverse:Boolean},computed:{classes:function(){return Object(_["a"])({"v-timeline--align-top":this.alignTop,"v-timeline--dense":this.dense,"v-timeline--reverse":this.reverse},this.themeClasses)}},render:function(e){return e("div",{staticClass:"v-timeline",class:this.classes},this.$slots["default"])}}),I=(i("c96a"),i("9d26")),y=i("a9ad"),E=Object(C["a"])(y["a"],x["a"]),$=E.extend().extend({name:"v-timeline-item",inject:["timeline"],props:{color:{type:String,default:"primary"},fillDot:Boolean,hideDot:Boolean,icon:String,iconColor:String,large:Boolean,left:Boolean,right:Boolean,small:Boolean},computed:{hasIcon:function(){return!!this.icon||!!this.$slots.icon}},methods:{genBody:function(){return this.$createElement("div",{staticClass:"v-timeline-item__body"},this.$slots["default"])},genIcon:function(){return this.$slots.icon?this.$slots.icon:this.$createElement(I["a"],{props:{color:this.iconColor,dark:!this.theme.isDark,small:this.small}},this.icon)},genInnerDot:function(){var e=this.setBackgroundColor(this.color);return this.$createElement("div",Object(_["a"])({staticClass:"v-timeline-item__inner-dot"},e),[this.hasIcon&&this.genIcon()])},genDot:function(){return this.$createElement("div",{staticClass:"v-timeline-item__dot",class:{"v-timeline-item__dot--small":this.small,"v-timeline-item__dot--large":this.large}},[this.genInnerDot()])},genDivider:function(){var e=[];return this.hideDot||e.push(this.genDot()),this.$createElement("div",{staticClass:"v-timeline-item__divider"},e)},genOpposite:function(){return this.$createElement("div",{staticClass:"v-timeline-item__opposite"},this.$slots.opposite)}},render:function(e){var t=[this.genBody(),this.genDivider()];return this.$slots.opposite&&t.push(this.genOpposite()),e("div",{staticClass:"v-timeline-item",class:Object(_["a"])({"v-timeline-item--fill-dot":this.fillDot,"v-timeline-item--before":this.timeline.reverse?this.right:this.left,"v-timeline-item--after":this.timeline.reverse?this.left:this.right},this.themeClasses)},t)}}),w=Object(r["a"])(a,n,s,!1,null,null,null);t["default"]=w.exports;c()(w,{VCard:u["a"],VCardText:d["b"],VCol:m["a"],VIcon:v["a"],VListItem:h["a"],VListItemAvatar:f["a"],VListItemContent:p["a"],VListItemSubtitle:p["b"],VListItemTitle:p["c"],VRow:g["a"],VSubheader:b["a"],VTimeline:V,VTimelineItem:$})},"6df4":function(e,t,i){"use strict";i("b165")},aaf5:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"pdf"}},[i("v-container",{attrs:{fluid:""}},[i("v-row",[i("v-col",{attrs:{cols:"7"}},[i("v-card",{staticClass:"mx-auto",attrs:{"max-width":"100%",outlined:""}},[i("Header",{attrs:{resource:e.resource}}),i("Player",{ref:"player",attrs:{resource:e.resource}}),i("v-expansion-panels",[i("v-expansion-panel",[i("v-expansion-panel-header",{attrs:{"disable-icon-rotate":""},scopedSlots:e._u([{key:"actions",fn:function(){return[i("v-icon",{attrs:{color:"teal"}},[e._v(" mdi-comment-multiple ")])]},proxy:!0}])},[e._v(" Questions (0) ")]),i("v-expansion-panel-content",[i("code",[e._v("It will be possible to pose questions in future versions")])])],1)],1)],1)],1),i("v-col",{attrs:{cols:"5"}},[i("v-row",[i("v-col",{attrs:{cols:"12"}},[i("Timeline",{ref:"timeline",attrs:{resource:e.resource},on:{onMilestone:e.setMilestone}})],1)],1),i("v-row",[i("v-col",{attrs:{cols:"12"}})],1)],1)],1)],1)],1)},s=[],o=i("7797"),a=i("cd29"),r=i("273a"),l={name:"Pdf",components:{Header:o["default"],Player:a["default"],Timeline:r["default"]},props:{resource:{type:Object,default:function(){}}},data:function(){return{}},methods:{setMilestone:function(e){this.$refs.player.pageUrl(e)}}},c=l,u=i("2877"),d=i("6544"),m=i.n(d),v=i("b0af"),h=i("62ad"),f=i("a523"),p=i("cd55"),g=i("49e2"),b=i("c865"),_=i("0393"),C=i("132d"),x=i("0fd9"),V=Object(u["a"])(c,n,s,!1,null,null,null);t["default"]=V.exports;m()(V,{VCard:v["a"],VCol:h["a"],VContainer:f["a"],VExpansionPanel:p["a"],VExpansionPanelContent:g["a"],VExpansionPanelHeader:b["a"],VExpansionPanels:_["a"],VIcon:C["a"],VRow:x["a"]})},b165:function(e,t,i){},b65f:function(e,t,i){var n=i("23e7"),s=Math.ceil,o=Math.floor;n({target:"Math",stat:!0},{trunc:function(e){return(e>0?o:s)(e)}})}}]);
//# sourceMappingURL=chunk-e429b4ea.2083d1cb.js.map