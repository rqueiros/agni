<template>
  <v-navigation-drawer
    app
    permanent
    :width="$vuetify.breakpoint.lgAndUp ? '180' : '70'"
    style="height: 100%; background-color: #DDDDDD;"
  >
    <v-sheet
      class="pa-4 pb-1 menu_links"
      style="background-color: #DDDDDD;"
      @click="setPage('account,Account', 'account')"
    >
      <v-avatar color="primary" class="profile" :size="$vuetify.breakpoint.lgAndUp ? '45' : '35'">
        <v-icon dark :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'large'"> mdi-card-account-details </v-icon>
      </v-avatar>
      <div class="mt-1" v-if="$vuetify.breakpoint.lgAndUp">{{ getUsername }}</div>
    </v-sheet>

    <v-list nav minimum-height="10" dense>
      <v-list-item-group color="primary">
        <v-divider></v-divider>
        <v-list-item
          class="menu_links mt-2"
          title="Main"
          value="main"
          @click="setPage('home,Home', 'home')"
        >
          <v-icon class="mr-1" :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'">mdi-home-variant</v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Home</span>
        </v-list-item>
        <v-list-item
          class="menu_links"
          title="Class Managing"
          value="class"
          @click="setPage('student,Class', 'class')"
        >
          <v-icon class="mr-1" :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'">mdi-account-school</v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Student</span>
        </v-list-item>
        <v-list-item
          class="menu_links"
          title="Content Managing"
          value="content"
          @click="setPage('content,Content', 'content')"
        >
          <v-icon class="mr-1" :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'">mdi-content-save-edit</v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Content</span>
        </v-list-item>
        <v-list-item
          class="menu_links"
          title="Settings"
          value="settings"
          @click="setPage('settings,Settings', 'settings')"
        >
          <v-icon class="mr-1" :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'">mdi-cog</v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Settings</span>
        </v-list-item>
        <v-divider></v-divider>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { bus } from "@/main.js";

export default {
  name: "TeacherMenu",

  components: {},

  data: () => ({
    resource: "home,Home",
    header: "home"
  }),

  created() {
    bus.$emit("changePage", [this.resource, this.header]);
  },

  computed: {
    ...mapGetters(["getUsername"]),
  },

  methods: {
    setPage(resource, header) {
      this.resource = resource;
      this.header = header;

      bus.$emit("changePage", [this.resource, this.header]);
    }
  }
};
</script>

<style>


.menu_links:hover {
  cursor: pointer;
}
</style>
