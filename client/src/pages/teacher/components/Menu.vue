<template>
  <v-navigation-drawer app width="15%" permanent style="height: 100%; background-color: #DDDDDD;">
    
    <v-sheet class="pa-4 menu_links" style="background-color: #DDDDDD;" @click="setPage('account,Account', 'account')">
      <v-avatar color="primary" class="profile">
        <v-icon dark> mdi-card-account-details </v-icon>
      </v-avatar>
      <div>{{ getUsername }}</div>
    </v-sheet>

    <v-list nav minimum-height="10">
      <v-list-item-group color="primary">
        <v-divider></v-divider>
        <v-list-item class="menu_list-item menu_links mt-2" title="Main" value="main"
          @click="setPage('main,Main', 'main')">
          <v-icon class="mr-1">mdi-home-variant</v-icon>
          Home
        </v-list-item>
        <v-list-item class="menu_list-item menu_links" title="Class Managing" value="class"
          @click="setPage('class,Class', 'class')">
          <v-icon class="mr-1">mdi-account-school</v-icon>
          Student
        </v-list-item>
        <v-list-item class="menu_list-item menu_links" title="Content Managing" value="content"
          @click="setPage('content,Content', 'content')">
          <v-icon class="mr-1">mdi-content-save-edit</v-icon>
          Content
        </v-list-item>
        <v-list-item class="menu_list-item menu_links" title="Settings" value="settings"
          @click="setPage('settings,Settings', 'settings')">
          <v-icon class="mr-1">mdi-cog</v-icon>
          Settings
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="menu_list-item">
          <v-text-field label="Search"></v-text-field>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { bus } from "@/main.js";

export default {
  name:"TeacherMenu",

  components: {},

  data: () => ({
    resource: "main,Main",
    header: "main"
  }),

  created() {
    bus.$emit("changePage", [this.resource, this.header]);
  },

  computed:{
    ...mapGetters(["getUsername"])
  },

  methods: {
    setPage(resource, header) {
      this.resource = resource;
      this.header = header;

      bus.$emit("changePage", [this.resource, this.header]);
    }
  },

};
</script>

<style>
.menu_list-item {
  min-height: 36px;
}

.menu_links:hover {
  cursor: pointer;
}
</style>
