<template>
  <v-app id="inspire">
    <!--System bar-->
    <v-system-bar app>
      <v-spacer></v-spacer>
      <div class="mr-2"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
    </v-system-bar>
    <!--Main-->
    <v-main>
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
