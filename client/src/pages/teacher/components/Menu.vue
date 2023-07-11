<template>
  <v-navigation-drawer
    app
    permanent
    :width="$vuetify.breakpoint.lgAndUp ? '180' : '70'"
    style="height: 100%; background-color: #DDDDDD;"
  >
    <v-list nav minimum-height="10" dense>
      <v-list-item-group color="primary">
        <v-list-item
          class="menu_links pt-2"
          title="Account"
          value="account"
          @click="setPage('account,Account')"
        >
          <v-sheet
            style="background-color: #DDDDDD;"
          >
            <v-avatar 
              color="primary" 
              class="profile" 
              :size="$vuetify.breakpoint.lgAndUp ? '45' : '35'"
            >
              <v-icon 
                style="color:white !important"
                :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'large'"
              >{{ getIcon("account") }}
              </v-icon>
            </v-avatar>
            <div 
              class="mt-1" 
              v-if="$vuetify.breakpoint.lgAndUp"
            >{{ getUsername }}
            </div>
          </v-sheet>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          class="menu_links mt-2"
          title="Home"
          value="home"
          @click="setPage('home,Home')"
        >
          <v-icon 
            class="mr-1" 
            :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'"
          >{{ getIcon("home") }}
          </v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Home</span>
        </v-list-item>
        <v-list-item
          class="menu_links"
          title="Student"
          value="class"
          @click="setPage('student,Occurrences')"
        >
          <v-icon 
            class="mr-1" 
            :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'"
          >{{ getIcon("student") }}
          </v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Student</span>
        </v-list-item>
        <v-list-item
          class="menu_links"
          title="Content"
          value="content"
          @click="setPage('content,Content')"
        >
          <v-icon 
            class="mr-1" 
            :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'"
          >{{ getIcon("content") }}
          </v-icon>
          <span v-if="$vuetify.breakpoint.lgAndUp">Content</span>
        </v-list-item>
        <v-list-item
          class="menu_links"
          title="Settings"
          value="settings"
          @click="setPage('settings,Settings')"
        >
          <v-icon 
            class="mr-1" 
            :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'"
          >{{ getIcon("settings") }}
          </v-icon>
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
  }),

  created() {
    bus.$emit("changePage", this.resource);
  },

  computed: {
    ...mapGetters("main",["getUsername"]),
    ...mapGetters("style",["getIcon"])
  },

  methods: {
    setPage(resource) {
      localStorage.setItem('contentCollType', "");
      this.resource = resource;
      bus.$emit("changePage", this.resource);
    }
  }
};
</script>

<style>
.menu_links:hover {
  cursor: pointer;
}
</style>
