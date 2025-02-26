<template>
  <div>
    <v-navigation-drawer
      app
      permanent
      :width="$vuetify.breakpoint.lgAndUp ? '140' : '70'"
      style="height: 100%;"
      color="teacherMenu"
      id="navDrawer"
      class="elevation-1"
    >
      <v-list nav minimum-height="10" dense>
        <v-list-item-group color="primary" v-model="selectedMenu">
          <v-list-item
            class="pointer pt-2"
            title="Account"
            value="account"
            @click="setPage('account,Account')"
          >
            <v-sheet
              class="d-flex flex-column align-center"
              color="teacherMenu"
            >
              <v-avatar
                color="primary"
                class="profile pa-2"
                :size="$vuetify.breakpoint.lgAndUp ? '45' : '35'"
              >
                <v-icon
                  v-if="
                    !'image' in getUser ||
                      getUser.image == null ||
                      ('data' in getUser.image && getUser.image.data == null)
                  "
                  style="color:white !important"
                  :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'large'"
                  >{{ getIcon("account") }}
                </v-icon>
                <v-img v-else :src="imageData" contain></v-img>
              </v-avatar>
              <div class="my-1 text-center" v-if="$vuetify.breakpoint.lgAndUp">
                {{ getUsername }}
              </div>
            </v-sheet>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            class="pointer mt-2"
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
            class="pointer"
            title="Student"
            value="student"
            @click="setPage('student,DashboardStudent')"
          >
            <v-icon
              class="mr-1"
              :size="$vuetify.breakpoint.lgAndUp ? 'x-large' : 'xx-large'"
              >{{ getIcon("student") }}
            </v-icon>
            <span v-if="$vuetify.breakpoint.lgAndUp">Student</span>
          </v-list-item>
          <v-list-item
            class="pointer"
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
            class="pointer"
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
      <div
        class="pa-2 d-flex justify-center"
        :class="
          $vuetify.breakpoint.lgAndUp ? '' : 'flex-column-reverse align-center'
        "
      >
        <v-btn
          icon
          class="ma-1"
          :large="$vuetify.breakpoint.lgAndUp"
          :medium="!$vuetify.breakpoint.lgAndUp"
          @click="logoutAction"
        >
          <v-icon>
            mdi-logout
          </v-icon>
        </v-btn>
        <v-btn
          icon
          class="ma-1"
          :large="$vuetify.breakpoint.lgAndUp"
          :medium="!$vuetify.breakpoint.lgAndUp"
          @click="toggleTheme"
        >
          <v-icon>
            mdi-white-balance-sunny
          </v-icon>
        </v-btn>
      </div>
    </v-navigation-drawer>

    <YesNoDialog
      :dialog="yesNoDialog.open"
      :question="yesNoDialog.question"
      :buttons="yesNoDialog.buttons"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { bus } from "@/main.js";

import YesNoDialog from "../../../components/gerneral/YesNoDialog.vue";

export default {
  name: "TeacherMenu",

  components: { YesNoDialog },

  data: () => ({
    resource: "home,Home",
    imageData: null,
    selectedMenu: "home",

    yesNoDialog: {
      open: false,
      question: "",
      buttons: [],
      resource: null
    }
  }),

  created() {
    if (!this.getUser.email.includes("evaluator")) {
      console.log(1111);
      bus.$emit("changePage", this.resource);
    }
    //bus.$emit("changePage", this.resource);
    this.loadImage();

    bus.$on("yesNoDialog", payload => {
      this.yesNoDialog.open = payload;
    });
    bus.$on("yesNoDialogResult", async payload => {
      this.yesNoDialog.open = false;
      if (payload == "save" && this.yesNoDialog.question != "") {
        const saveSuccess = await this.save();
        if (saveSuccess) {
          this.resource = this.yesNoDialog.resource;
          bus.$emit("changePage", this.yesNoDialog.resource);
          this.deleteStructure();
        }
      } else if (payload == "dontSave" && this.yesNoDialog.question != "") {
        this.resource = this.yesNoDialog.resource;
        bus.$emit("changePage", this.yesNoDialog.resource);
        this.deleteStructure();
      } else if (payload == "cancel") {
        this.selectedMenu = this.resource.split(",")[0];
      }
    });
  },

  watch: {
    "user.image"() {
      this.loadImage();
    },
    selectedMenu(newValue, oldValue) {
      if (newValue == null) {
        this.$nextTick(() => {
          this.selectedMenu = oldValue;
        });
      }
    }
  },

  computed: {
    ...mapState("main", { changed: state => state.changed }),
    ...mapState("request", { user: state => state.user }),
    ...mapGetters("request", ["getUsername", "getUser", "getDomain"]),
    ...mapGetters("style", ["getIcon", "getMesssage"]),
    ...mapGetters("main", [
      "getCoursesState",
      "getExpositivesState",
      "getEvaluativesState",
      "getQuestionsState"
    ])
  },

  methods: {
    ...mapMutations("main", ["deleteStructure"]),
    ...mapMutations("request", ["logout"]),
    ...mapActions("request", ["saveCollectionType"]),
    async save() {
      let collectionType;
      if (this.getCoursesState.length > 0) {
        collectionType = "courses";
      } else if (this.getEvaluativesState.length > 0) {
        collectionType = "evaluatives";
      } else if (this.getExpositivesState.length > 0) {
        collectionType = "expositives";
      } else if (this.getQuestionsState.length > 0) {
        collectionType = "questions";
      } else {
        collectionType = "occurrences";
      }
      try {
        await this.saveCollectionType(collectionType);
        bus.$emit(
          "successSnackbar",
          this.getMesssage([collectionType, "save", "success"])
        );
        return true;
      } catch (error) {
        console.log(error);
        if (error == "Missing Evaluative Type or Test Type") {
          bus.$emit("errorSnackbar", error);
        } else {
          bus.$emit(
            "errorSnackbar",
            this.getMesssage([collectionType, "save", "error"])
          );
        }
        return false;
      }
    },
    setPage(resource) {
      if (this.changed) {
        this.yesNoDialog = {
          open: true,
          question: "Do you want to save your changes before exiting?",
          buttons: [
            { name: "DON`T SAVE", msg: "dontSave" },
            { name: "SAVE", msg: "save" }
          ],
          resource: resource
        };
      } else {
        localStorage.setItem("contentCollType", "");
        localStorage.setItem("menuItem", resource.split(",")[0]);
        this.resource = resource;
        bus.$emit("changePage", this.resource);
      }
    },
    logoutAction() {
      this.logout();
      this.$router.push({ name: "Login" });
    },
    loadImage() {
      this.imageData = null;
      if (this.getUser && "image" in this.getUser) {
        const file = this.getUser.image;
        if (
          file != null &&
          !("data" in file && file.data == null) &&
          "url" in file
        ) {
          this.imageData = this.getDomain + this.getUser.image.url;
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
    }
  }
};
</script>

<style scoped>
#navDrawer >>> .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}
</style>
