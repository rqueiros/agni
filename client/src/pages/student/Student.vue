<template>
  <v-app id="inspire">
    <!--System bar-->
    <v-system-bar app>
      <div>STUDENT</div>
      <v-spacer></v-spacer>
      <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>
    <!--Main-->
    <v-main style="padding:24px 0px 0px 0%;">
      <Menu @onResourceClicked="setResource" />
      <Resource v-if="resource" :resource="resource" />
      <div v-else>
        <Profile v-if="isResource != 0" :resource="isResource" :type="type"/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters } from "vuex";
import Menu from "./components/Menu.vue";
import Resource from "./components/resources/Resource.vue";
import Profile from "./components/profile/Profile.vue";

export default {
  components: {
    Menu,
    Resource,
    Profile
  },
  data: () => ({
    resource: null,
    isResource: 0,
    type:"",
  }),
  methods: {
    setResource(resourceId, type) {
      this.resource = null;
      this.isResource = resourceId;
      this.type = type
      if (resourceId > 0) {
        this.resource = this.getResourceById(resourceId, type);
      }
    }
  },
  created() {
    bus.$on("changeIt", payload => {
      this.setResource(payload[0], payload[1]);
    });
  },
  computed: {
    ...mapGetters(["getResourceById"])
  }
};
</script>

<style>
.resource{
  padding:0 0 0 25%;
}

.resource_title{
  font-size:2.4vw;
  font-weight: 400;
  text-align: left;
}
.resource_subtitle{
  font-size: 1.4vw;
  text-align: left;
  font-weight: 500
}
.resource_text{
  font-size: 1vw;
}

.header{
  text-align: left;
}

.right_box{
  padding-left:0
}

.box{
  height: 5.5vw !important;
  min-width: 0 !important;
  width: 5.5vw !important;
}
.box_icon{
  font-size: 2.5vw !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size:1vw;
  height: 3.5vw;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th{
  font-size: 0.8vw;
  height: 3.5vw;
}

.v-card__actions{
  flex-wrap: wrap;
  justify-content: center;
}
.v-data-footer, .v-data-footer__select .v-select__selections .v-select__selection--comma{
  font-size: 0.9vw;
}
.v-btn--icon.v-size--default .v-icon, .v-btn--fab.v-size--default .v-icon{
  font-size: 1.8vw;
}
.v-data-table .v-icon{
  font-size: 1.8vw;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th{
  padding:0 0.8vw;
}
.v-btn:not(.v-btn--round).v-size--default{
  min-width: 0;
  font-size: 0.9vw;
  height: 2.8vw;
}
.v-btn__content .v-icon.v-icon--left, .v-btn__content .v-icon.v-icon--right{
  font-size: 1.4vw;
  margin-left: 0.5vw;
}
.v-card__actions > .v-btn.v-btn{
  padding:0 1vw;
}
.v-application--is-ltr .v-data-footer__select {
  margin-right: 1vw;
}
.v-application--is-ltr .v-data-footer__pagination{
  margin-right: 1vw;
  margin-left: 1vw;
}
.v-application--is-ltr .v-data-footer__icons-before .v-btn:last-child{
  margin-right: 0.55vw;
}
.v-application--is-ltr .v-data-footer__icons-after .v-btn:first-child{
  margin-left: 0.55vw;
}

@media only screen and (max-width: 768px) {
  .resource{
    padding:60px 0 0 0;
  }
  .resource_title{
    font-size:5vw;
    font-weight: 400;
  }
  .resource_subtitle{
    font-size: 3vw;
    font-weight: 500
  }
  .resource_text{
    font-size: 2.5vw;
  }
  .box{
    height: 12vw !important;
    min-width: 0 !important;
    width: 12vw !important;
  }
  .box_icon{
    font-size: 5vw !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size:2.5vw;
    height: 9vw;
  }
  .v-data-table > .v-data-table__wrapper > table > thead > tr > th{
    font-size: 2.5vw;
    height: 9vw;
  }

  .v-btn--icon.v-size--default .v-icon, .v-btn--fab.v-size--default .v-icon{
    font-size: 4vw;
  }
  .v-btn:not(.v-btn--round).v-size--default{
    min-width: 0;
    font-size: 2vw;
    height: 5vw;
  }
  .v-card__actions > .v-btn.v-btn{
    padding:0 1vw;
  }
}


</style>
