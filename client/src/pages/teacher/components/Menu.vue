<template>
  <v-navigation-drawer
    app
    permanent
    :width="$vuetify.breakpoint.lgAndUp ? '180' : '70'"
    style="height: 100%;"
    color="teacherMenu"
    id="navDrawer"
    class="elevation-1"
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
            color="teacherMenu"
          >
            <v-avatar 
              color="primary" 
              class="profile pa-2" 
              :size="$vuetify.breakpoint.lgAndUp ? '45' : '35'"
            >
              <v-icon 
              v-if="(!'image' in getUser) || getUser.image == null || ('data' in getUser.image &&  getUser.image.data == null)"
                style="color:white !important"
                :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'large'"
              >{{ getIcon("account") }}
              </v-icon>
              <v-img v-else :src="imageData" contain></v-img>
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
    <v-spacer></v-spacer>
    <div class="pa-2 d-flex justify-center" :class="$vuetify.breakpoint.lgAndUp ? '' : 'flex-column-reverse align-center'">
      <v-btn icon class="ma-1" :large="$vuetify.breakpoint.lgAndUp" :medium="!$vuetify.breakpoint.lgAndUp" @click="logoutAction">
        <v-icon>
          mdi-logout
        </v-icon>
      </v-btn>
      <v-btn icon class="ma-1" :large="$vuetify.breakpoint.lgAndUp" :medium="!$vuetify.breakpoint.lgAndUp" @click="toggleTheme">
        <v-icon>
          mdi-white-balance-sunny
        </v-icon>
        <!--
        <v-icon>
          mdi-moon-waning-crescent
        </v-icon>-->
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { bus } from "@/main.js";

export default {
  name: "TeacherMenu",

  components: {},

  data: () => ({
    resource: "home,Home",
    imageData: null,
  }),

  created() {
    bus.$emit("changePage", this.resource);
    this.loadImage()
  },

  watch:{
    'user.image'(){
      this.loadImage()
    }
  },

  computed: {
    ...mapState("main", { user: state => state.user }),
    ...mapGetters("main",["getUsername", "getUser", "getDomain"]),
    ...mapGetters("style",["getIcon"])
  },

  methods: {
    ...mapMutations("main", ["logout"]),
    setPage(resource) {
      localStorage.setItem('contentCollType', "");
      this.resource = resource;
      bus.$emit("changePage", this.resource);
    },
    logoutAction(){
      this.logout()
      this.$router.push({ name: "Login" });
    },
    loadImage() {
      this.imageData = null
      if (this.getUser && "image" in this.getUser) {
        const file = this.getUser.image;
        if (file != null && !("data" in file && file.data == null) && "url" in file) {
          this.imageData =
            this.getDomain +
            this.getUser.image.url;
        } else if (file != null && "name" in file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imageData = reader.result;
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        }
      }
    },
    toggleTheme() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  }
};
</script>

<style scoped>
.menu_links:hover {
  cursor: pointer;
}

#navDrawer>>>.v-navigation-drawer__content{
  display: flex;
  flex-direction: column;
}
</style>
