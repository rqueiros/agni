(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7d03a416","chunk-0fc38cb1","chunk-2d22c835"],{"0160":function(t,e,n){},"273a":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-card",{staticClass:"mx-auto",attrs:{outlined:""}},[n("v-list-item",[n("v-list-item-content",[n("v-list-item-title",{staticClass:"display-1"},[t._v(" TIMELINE ")]),n("v-list-item-subtitle",[t._v("Jump in the "+t._s(t.resource.type.toUpperCase())+" for specific topics!")])],1),n("v-list-item-avatar",{attrs:{tile:"",size:"80",color:"green"}},[n("v-icon",{attrs:{large:"",color:"white"}},[t._v(" mdi-timeline-clock ")])],1)],1),n("v-card-text",["video"==t.resource.type?n("v-subheader",[t._v(" Video length: "+t._s(t.convert(t.duration))+" ")]):n("v-subheader",[t._v("PDF length: "+t._s(t.resource.milestones.find((function(t){return"End"===t.label})).index)+" pages ")]),0!=t.resource.milestones.length?n("v-timeline",{attrs:{"align-top":"",dense:""}},t._l(t.resource.milestones,(function(e){return n("v-timeline-item",{key:e.index,staticClass:"milestone",attrs:{icon:t.getIcon(e),color:t.getColor(e)},nativeOn:{click:function(n){return t.goto(e.index)}}},[n("v-row",[n("v-col",{staticClass:"mt-1"},[n("strong",{staticClass:"subtitle-1",domProps:{innerHTML:t._s(t.convert(e.index)+" - "+e.label)}})])],1)],1)})),1):n("div",{staticClass:"overline text-center"},[t._v("no milestones found!")])],1)],1)},o=[],s=(n("99af"),n("b65f"),{props:{resource:Object},data:function(){return{selected:0,duration:0}},methods:{setDuration:function(t){this.duration=t},goto:function(t){this.selected=t,this.$emit("onMilestone",t)},convert:function(t){return"video"==this.resource.type?t<60?"".concat(t,"''"):"".concat(Math.trunc(t/60),"'").concat(Math.trunc(t%60),"''"):"".concat(t)},getColor:function(t){var e;return e=t.index==this.selected?"black":"Start"==t.label?"green":"End"==t.label?"red":"blue",e},getIcon:function(t){var e;return e="Start"==t.label||"End"==t.label?"mdi-flag-triangle":"mdi-play",e}}}),a=s,r=(n("6df4"),n("2877")),l=n("6544"),c=n.n(l),u=n("b0af"),d=n("99d9"),m=n("62ad"),v=n("132d"),h=n("da13"),f=n("8270"),p=n("5d23"),g=n("0fd9"),y=n("e0c7"),b=n("5530"),_=(n("26e9"),n("0160"),n("58df")),C=n("7560"),V=Object(_["a"])(C["a"]).extend({name:"v-timeline",provide:function(){return{timeline:this}},props:{alignTop:Boolean,dense:Boolean,reverse:Boolean},computed:{classes:function(){return Object(b["a"])({"v-timeline--align-top":this.alignTop,"v-timeline--dense":this.dense,"v-timeline--reverse":this.reverse},this.themeClasses)}},render:function(t){return t("div",{staticClass:"v-timeline",class:this.classes},this.$slots["default"])}}),x=(n("c96a"),n("9d26")),$=n("a9ad"),D=Object(_["a"])($["a"],C["a"]),I=D.extend().extend({name:"v-timeline-item",inject:["timeline"],props:{color:{type:String,default:"primary"},fillDot:Boolean,hideDot:Boolean,icon:String,iconColor:String,large:Boolean,left:Boolean,right:Boolean,small:Boolean},computed:{hasIcon:function(){return!!this.icon||!!this.$slots.icon}},methods:{genBody:function(){return this.$createElement("div",{staticClass:"v-timeline-item__body"},this.$slots["default"])},genIcon:function(){return this.$slots.icon?this.$slots.icon:this.$createElement(x["a"],{props:{color:this.iconColor,dark:!this.theme.isDark,small:this.small}},this.icon)},genInnerDot:function(){var t=this.setBackgroundColor(this.color);return this.$createElement("div",Object(b["a"])({staticClass:"v-timeline-item__inner-dot"},t),[this.hasIcon&&this.genIcon()])},genDot:function(){return this.$createElement("div",{staticClass:"v-timeline-item__dot",class:{"v-timeline-item__dot--small":this.small,"v-timeline-item__dot--large":this.large}},[this.genInnerDot()])},genDivider:function(){var t=[];return this.hideDot||t.push(this.genDot()),this.$createElement("div",{staticClass:"v-timeline-item__divider"},t)},genOpposite:function(){return this.$createElement("div",{staticClass:"v-timeline-item__opposite"},this.$slots.opposite)}},render:function(t){var e=[this.genBody(),this.genDivider()];return this.$slots.opposite&&e.push(this.genOpposite()),t("div",{staticClass:"v-timeline-item",class:Object(b["a"])({"v-timeline-item--fill-dot":this.fillDot,"v-timeline-item--before":this.timeline.reverse?this.right:this.left,"v-timeline-item--after":this.timeline.reverse?this.left:this.right},this.themeClasses)},e)}}),E=Object(r["a"])(a,i,o,!1,null,null,null);e["default"]=E.exports;c()(E,{VCard:u["a"],VCardText:d["b"],VCol:m["a"],VIcon:v["a"],VListItem:h["a"],VListItemAvatar:f["a"],VListItemContent:p["a"],VListItemSubtitle:p["b"],VListItemTitle:p["c"],VRow:g["a"],VSubheader:y["a"],VTimeline:V,VTimelineItem:I})},"6df4":function(t,e,n){"use strict";n("b165")},b165:function(t,e,n){},b65f:function(t,e,n){var i=n("23e7"),o=Math.ceil,s=Math.floor;i({target:"Math",stat:!0},{trunc:function(t){return(t>0?s:o)(t)}})},b761:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"player"}},[n("v-container",{attrs:{fluid:""}},[n("v-row",[n("v-col",{attrs:{cols:"7"}},[n("v-card",{staticClass:"mx-auto",attrs:{"max-width":"100%",outlined:""}},[n("Header",{attrs:{resource:t.resource}}),n("Player",{ref:"player",attrs:{resource:t.resource},on:{onDuration:t.setDuration}}),n("v-rating",{attrs:{"background-color":"orange lighten-3",color:"orange"},model:{value:t.rating,callback:function(e){t.rating=e},expression:"rating"}}),n("v-expansion-panels",[n("v-expansion-panel",[n("v-expansion-panel-header",{attrs:{"disable-icon-rotate":""},scopedSlots:t._u([{key:"actions",fn:function(){return[n("v-icon",{attrs:{color:"teal"}},[t._v(" mdi-comment-multiple ")])]},proxy:!0}])},[t._v(" Questions (0) ")]),n("v-expansion-panel-content",[n("code",[t._v("It will be possible to pose questions in future versions")])])],1)],1)],1)],1),n("v-col",{attrs:{cols:"5"}},[n("v-row",[n("v-col",{attrs:{cols:"12"}},[n("Timeline",{ref:"timeline",attrs:{resource:t.resource},on:{onMilestone:t.setMilestone}})],1)],1),n("v-row",[n("v-col",{attrs:{cols:"12"}})],1)],1)],1)],1)],1)},o=[],s=(n("99af"),n("b65f"),n("7797")),a=n("f40a"),r=n("273a"),l={name:"Video",components:{Header:s["default"],Player:a["default"],Timeline:r["default"]},props:{resource:{type:Object,default:function(){}}},data:function(){return{playerVars:{autoplay:1},duration:0,rating:""}},methods:{setDuration:function(t){this.duration=t,this.$refs.timeline.setDuration(this.duration)},convertSecondsToMinutes:function(t){return t<60?"".concat(t,"s"):"".concat(Math.trunc(t/60),"m ").concat(Math.trunc(t%60),"s")},setMilestone:function(t){console.log("video->"+t),this.$refs.player.go(t)}}},c=l,u=n("2877"),d=n("6544"),m=n.n(d),v=n("b0af"),h=n("62ad"),f=n("a523"),p=n("cd55"),g=n("49e2"),y=n("c865"),b=n("0393"),_=n("132d"),C=n("1d4d"),V=n("0fd9"),x=Object(u["a"])(c,i,o,!1,null,null,null);e["default"]=x.exports;m()(x,{VCard:v["a"],VCol:h["a"],VContainer:f["a"],VExpansionPanel:p["a"],VExpansionPanelContent:g["a"],VExpansionPanelHeader:y["a"],VExpansionPanels:b["a"],VIcon:_["a"],VRating:C["a"],VRow:V["a"]})},f40a:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"player"}},[n("vytia-player",{ref:"yt",attrs:{width:"100%",yturl:t.resource.url,playerVars:t.playerVars},on:{ready:t.onPlayerReady,playing:t.onPlayerPlay}})],1)},o=[],s={name:"Player",props:{resource:{type:Object,default:function(){}}},data:function(){return{playerVars:{autoplay:1},duration:0}},methods:{onPlayerReady:function(){},onPlayerPlay:function(){this.$emit("onDuration",this.$refs.yt.player.getDuration())},go:function(t){console.log("go->"+t),this.$refs.yt.player.seekTo(t)}}},a=s,r=n("2877"),l=Object(r["a"])(a,i,o,!1,null,null,null);e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-7d03a416.d97fe2f7.js.map