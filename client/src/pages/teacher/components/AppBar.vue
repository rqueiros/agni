<template>
  <div id="header" class="d-flex justify-center">
    <v-app-bar
      rounded
      height="auto"
      color="appbar"
      class="py-2 px-0"
      flat
      style="max-width: 1200px;"
    >
      <v-row no-gutters>
        <v-col cols="4" md="4" class="d-flex align-center">
          <v-tooltip bottom v-if="isCollectionType">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                text
                elevation="0"
                class="mr-1"
                @click="exit"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Back</span>
          </v-tooltip>

          <v-divider vertical v-if="isCollectionType" class="mr-4" />

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" style="font-size:22px">
                <span v-if="$vuetify.breakpoint.lgAndUp">
                  {{ componentText[component].title }}
                </span>
                <span v-else>
                  {{ componentText[component].titleShort }}
                </span>
              </span>
            </template>
            <span>{{ componentText[component].description }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="searchData.model"
            :items="searchItems"
            :loading="loading.search"
            :search-input.sync="searchData.input"
            hide-no-data
            hide-details
            hide-selected
            item-text="Description"
            item-value="API"
            label="Search"
            placeholder="Start typing to Search"
            return-object
            outlined
            dense
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar class="text-h5 font-weight-light white--text">
                <v-icon>
                  {{ getIcon(item.icon) }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.label" />
                <v-list-item-subtitle v-text="item.label2" />
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="4" md="5" class="d-flex align-center justify-end">
          <!-- Adds -->
          <v-tooltip bottom v-if="component == 'dashboardstudent'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                elevation="1"
                :rounded="$vuetify.breakpoint.mdAndUp"
                :fab="!$vuetify.breakpoint.mdAndUp"
                :small="!$vuetify.breakpoint.mdAndUp"
                color="primary"
                @click="addCollectionType('Occurrence')"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add</span>
          </v-tooltip>
          <v-menu offset-y auto v-if="component == 'content'">
            <template v-slot:activator="{ on, attrs }">
              <v-tooltip bottom>
                <template
                  v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }"
                >
                  <v-btn
                    elevation="1"
                    :rounded="$vuetify.breakpoint.mdAndUp"
                    :fab="!$vuetify.breakpoint.mdAndUp"
                    :small="!$vuetify.breakpoint.mdAndUp"
                    v-bind="{ ...attrs, ...tooltipAttrs }"
                    v-on="{ ...on, ...tooltipOn }"
                    color="primary"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in addList"
                :key="index"
                link
                @click="addCollectionType(item.title)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <div v-if="isCollectionType">
            <!-- Save -->
            <v-tooltip bottom v-if="isAuthor || component == 'occurrence'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="1"
                  class="mr-1"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary"
                  :disabled="!changed"
                  @click="save"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-progress-circular
                    :size="20"
                    v-if="loading.save"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Save</span>
            </v-tooltip>

            <!-- Publish -->
            <v-tooltip bottom v-if="isAuthor || component == 'occurrence'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="1"
                  class="mx-1"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary"
                  @click="publish"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="isNew"
                >
                  <v-progress-circular
                    :size="20"
                    v-if="loading.publish"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon v-if="isDraft">mdi-publish</v-icon>
                  <v-icon v-if="!isDraft">mdi-publish-off</v-icon>
                </v-btn>
              </template>
              <span v-if="isDraft">Publish</span>
              <span v-if="!isDraft">Unpublish</span>
            </v-tooltip>

            <!-- Clone -->
            <v-menu
              offset-y
              :nudge-width="350"
              v-if="component == 'course'"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-tooltip bottom>
                  <template
                    v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }"
                  >
                    <v-btn
                      elevation="1"
                      class="mx-1"
                      :rounded="$vuetify.breakpoint.mdAndUp"
                      :fab="!$vuetify.breakpoint.mdAndUp"
                      :small="!$vuetify.breakpoint.mdAndUp"
                      color="primary"
                      v-bind="{ ...attrs, ...tooltipAttrs }"
                      v-on="{ ...on, ...tooltipOn }"
                      @click="copyCourseMenu()"
                      :disabled="isNew"
                    >
                      <v-progress-circular
                        :size="20"
                        v-if="loading.copy"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                  </template>
                  <span>Clone</span>
                </v-tooltip>
              </template>
              <CopyCourseMenu :course="getCourse" />
            </v-menu>
            <v-tooltip bottom v-else>
              <template
                v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }"
              >
                <v-btn
                  elevation="1"
                  class="mx-1"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary"
                  v-bind="{ ...tooltipAttrs }"
                  v-on="{ ...tooltipOn }"
                  @click="copy()"
                  :disabled="isNew"
                >
                  <v-progress-circular
                    :size="20"
                    v-if="loading.delete"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </template>
              <span>Clone</span>
            </v-tooltip>

            <!-- Delete -->
            <v-tooltip bottom v-if="isAuthor || component == 'occurrence'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="1"
                  class="ml-1"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="error"
                  v-if="isAuthor"
                  v-bind="attrs"
                  v-on="on"
                  @click="remove()"
                  :disabled="isNew"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </div>

          <!-- Account -->
          <div v-if="component == 'account'">
            <v-tooltip bottom v-if="getAccountEditable">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="1"
                  class="mr-1"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary"
                  @click="saveAccount"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="true"
                >
                  <v-progress-circular
                    :size="20"
                    v-if="loading.save"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Save</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="1"
                  class="mr-1"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  :fab="!$vuetify.breakpoint.mdAndUp"
                  :small="!$vuetify.breakpoint.mdAndUp"
                  color="primary"
                  @click="setAccountEditable(true)"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="true"
                >
                  <v-progress-circular
                    :size="20"
                    v-if="loading.save"
                    indeterminate
                  ></v-progress-circular>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-app-bar>

    <YesNoDialog
      :dialog="yesNoDialog1.open"
      :question="yesNoDialog1.question"
      :buttons="yesNoDialog1.buttons"
      :dialogID="dialogID"
    />

    <DeleteDialog
      :dialog="deleteDialog.open"
      :collectionType="collectionType"
    />
  </div>
</template>

<script>
import { bus } from "@/main.js";

import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

import DeleteDialog from "../../../components/gerneral/DeleteDialog.vue";
import YesNoDialog from "../../../components/gerneral/YesNoDialog.vue";
import CopyCourseMenu from "../../../components/gerneral/CopyCourseMenu.vue";

export default {
  name: "Header",

  props: {
    resource: {
      type: String,
      default: () => null
    }
  },

  components: {
    YesNoDialog,
    DeleteDialog,
    CopyCourseMenu
  },

  data() {
    return {
      searchData: {
        model: null,
        input: null,
        entries: []
      },

      addList: [
        { title: "Course" },
        { title: "Expositive" },
        { title: "Evaluative" },
        { title: "Question" }
      ],

      componentText: {
        dashboardstudent: {
          title: "OCCURRENCES",
          titleShort: "OCCURRENCES",
          description: "Manage your current, draft and past Occurrences"
        },
        occurrence: {
          title: "OCCURRENCE",
          titleShort: "OCCURRENCE",
          description: "Create, edit or view this Occurrence"
        },
        content: {
          title: "CONTENT",
          titleShort: "CONTENT",
          description:
            "Manage Courses, Expositives (pdf,..), Evaluatives (progEx, quiz) and Questions"
        },
        course: {
          title: "COURSE",
          titleShort: "COURSE",
          description: "Create, edit or view this Course"
        },
        expositive: {
          title: "EXPOSITIVE",
          titleShort: "EXPOSITIVE",
          description: "Create, edit or view this Expositive"
        },
        evaluative: {
          title: "EVALUATIVE",
          titleShort: "EVALUATIVE",
          description: "Create, edit or view this Evaluative"
        },
        question: {
          title: "QUESTION",
          titleShort: "QUESTION",
          description: "Create, edit or view this Question"
        },
        home: {
          title: "WELCOME TO AGNI",
          titleShort: "WELCOME",
          description:
            "A Virtual Learning Environment for practicing JavaScript"
        },
        account: {
          title: "ACCOUNT",
          titleShort: "ACCOUNT",
          description: "Manage your Account"
        },
        settings: {
          title: "SETTINGS",
          titleShort: "SETTINGS",
          description: "Informations, Questions, or Feedback?"
        }
      },

      deleteDialog: {
        open: false,
        item: null
      },

      dialogID: "1",
      yesNoDialog1: {
        open: false,
        question: "",
        buttons: []
      },

      loading: {
        save: false,
        publish: false,
        copy: false,
        delete: false,
        search: false
      }
    };
  },

  created() {
    bus.$on("yesNoDialog1", payload => {
      this.yesNoDialog1.open = payload;
    });
    bus.$on("deleteDialog", payload => {
      this.deleteDialog.open = payload;
    });
    bus.$on("yesNoDialogResult1", async payload => {
      this.yesNoDialog1.open = false;
      if (payload == "save" && this.yesNoDialog1.question != "") {
        const saveSuccess = await this.save();
        if (saveSuccess) {
          this.exitContentType();
        }
      } else if (payload == "dontSave" && this.yesNoDialog1.question != "") {
        this.exitContentType();
      } // else if (payload == "cancel") {}
    });
    bus.$on("deleteDialogResult", async payload => {
      this.deleteDialog.open = false;
      if (this.deleteDialog.item && payload == "ok") {
        this.loading.delete = true;
        await this.delete();
        this.deleteDialog.item = null;
        this.loading.delete = false;
      } // else if (payload == "cancel") {}
    });
  },

  watch: {
    "searchData.model"(newValue) {
      if (newValue != null) {
        this.openCollectionType(newValue);
        this.searchData.model = null;
        this.searchData.input = "";
      }
    },
    async "searchData.input"(newValue) {
      if (this.searchData.input) {
        if (this.loading.search) return;
        this.loading.search = true;
        await this.search(newValue);
        this.loading.search = false;
      }
    }
  },

  computed: {
    ...mapState("main", { changed: state => state.changed }),
    ...mapGetters("style", ["getIcon", "getMesssage"]),
    ...mapGetters("main", [
      "getPublishedAt",
      "getCourse",
      "getExpositive",
      "getEvaluative",
      "getQuestion",
      "getOccurrence"
    ]),
    ...mapGetters("request", ["isAuthor", "getAccountEditable"]),
    component() {
      return this.resource.split(",")[1].toLowerCase();
    },
    isCollectionType() {
      if (
        this.component == "occurrence" ||
        this.component == "course" ||
        this.component == "expositive" ||
        this.component == "evaluative" ||
        this.component == "question"
      ) {
        return true;
      } else {
        return false;
      }
    },
    collectionType() {
      return this.resource.split(",")[1].toLowerCase() + "s";
    },
    isDraft() {
      if (this.isCollectionType) {
        return this.getPublishedAt(this.collectionType) == null;
      } else {
        return false;
      }
    },
    isNew() {
      switch (this.collectionType) {
        case "courses":
          return this.getCourse ? this.getCourse.new : false;
        case "expositives":
          return this.getExpositive ? this.getExpositive.new : false;
        case "evaluatives":
          return this.getEvaluative ? this.getEvaluative.new : false;
        case "questions":
          return this.getQuestion ? this.getQuestion.new : false;
        default:
          return false;
      }
    },
    searchItems() {
      return this.searchData.entries.map(entry => {
        let Description = entry.label + entry.label2;
        return Object.assign({}, entry, { Description });
      });
    }
  },

  methods: {
    ...mapActions("request", [
      "fetchContents",
      "fetchPrepareCollectionType",
      "deleteCollectionType",
      "saveCollectionType",
      "publishCollectionType",
      "copyCollectionType",
      "updateUser"
    ]),
    ...mapActions("main", ["createNewCollectionType"]),
    ...mapMutations("main", ["deleteStructure"]),
    ...mapMutations("request", ["setAccountEditable"]),
    async saveAccount() {
      this.setAccountEditable(false);
      this.updateUser();
    },
    async copy() {
      let id = 0;
      if (this.collectionType == "courses") {
        id = this.getCourse.id;
      } else if (this.collectionType == "expositives") {
        id = this.getExpositive.id;
      } else if (this.collectionType == "evaluatives") {
        id = this.getEvaluative.id;
      } else if (this.collectionType == "questions") {
        id = this.getQuestion.id;
      }

      try {
        this.loading.copy = true;
        await this.copyCollectionType([id, this.collectionType]);
        bus.$emit(
          "successSnackbar",
          this.getMesssage([this.component, "copy", "success"])
        );
      } catch (error) {
        console.log(error);
        bus.$emit(
          "errorSnackbar",
          this.getMesssage([this.component, "copy", "error"])
        );
      }
      this.loading.copy = false;
    },
    async publish() {
      try {
        this.loading.publish = true;
        let pub = await this.publishCollectionType(this.collectionType);
        bus.$emit(
          "successSnackbar",
          this.getMesssage([this.component, pub, "success"])
        );
      } catch (error) {
        console.log(error);
        const pub = this.isDraft ? "publishing" : "unpublishing";
        bus.$emit(
          "errorSnackbar",
          this.getMesssage([this.component, pub, "error"])
        );
      }
      this.loading.publish = false;
    },
    async save() {
      try {
        this.loading.save = true;
        await this.saveCollectionType(this.collectionType);
        bus.$emit(
          "successSnackbar",
          this.getMesssage([this.component, "save", "success"])
        );
        this.loading.save = false;
        return true;
      } catch (error) {
        console.log(error);
        if (error == "Missing Evaluative Type or Test Type") {
          bus.$emit("errorSnackbar", error);
        } else {
          bus.$emit(
            "errorSnackbar",
            this.getMesssage([this.component, "save", "error"])
          );
        }
        this.loading.save = false;
        return false;
      }
    },
    async delete() {
      try {
        await this.deleteCollectionType([
          this.deleteDialog.item.id,
          this.collectionType
        ]);
        bus.$emit(
          "successSnackbar",
          this.getMesssage([this.component, "delete", "success"])
        );
        this.exitContentType();
      } catch (error) {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage([this.component, "delete", "error"])
        );
      }
    },
    async exit() {
      if (!this.changed) {
        this.exitContentType();
      } else {
        this.help = true;
        this.yesNoDialog1 = {
          open: true,
          question: "Do you want to save your changes before exiting?",
          buttons: [
            { name: "DON`T SAVE", msg: "dontSave" },
            { name: "SAVE", msg: "save" }
          ]
        };
      }
    },
    async search(input) {
      try {
        let params = {
          filters: {
            name: {
              $containsi: input
            }
          }
        };
        this.searchData.entries = await this.fetchContents(params);
      } catch (error) {
        bus.$emit("errorSnackbar", this.getMesssage(["", "search", "error"]));
      }
    },
    async exitContentType() {
      let contentCollType = localStorage.getItem("menuItem") || "";
      if (this.collectionType == "occurrences") {
        if (contentCollType == "student") {
          await bus.$emit("changePage", "student,DashboardStudent");
        } else {
          await bus.$emit("changePage", "home,Home");
        }
      } else {
        if (contentCollType == "home") {
          await bus.$emit("changePage", "home,Home");
        } else {
          await bus.$emit("changePage", "content,Content");
        }
      }
      this.deleteStructure();
    },
    addCollectionType(item) {
      this.createNewCollectionType(item.toLowerCase());
      if (item == "Occurrence") {
        bus.$emit("changePage", "student,Occurrence");
      } else {
        bus.$emit("changePage", `content,${item}`);
      }
    },
    async openCollectionType(item) {
      try {
        await this.fetchPrepareCollectionType([item.id, item.collectionType]);
        let name =
          item.collectionType.charAt(0).toUpperCase() +
          item.collectionType.slice(1, -1);
        bus.$emit("changePage", `content,${name}`);
      } catch (error) {
        console.log(error);
        bus.$emit(
          "errorSnackbar",
          this.getMesssage([this.component, "get", "error"])
        );
      }
    },
    remove() {
      this.deleteDialog.open = true;
      if (this.collectionType == "courses") {
        this.deleteDialog.item = this.getCourse;
      } else if (this.collectionType == "expositives") {
        this.deleteDialog.item = this.getExpositive;
      } else if (this.collectionType == "evaluatives") {
        this.deleteDialog.item = this.getEvaluative;
      } else if (this.collectionType == "questions") {
        this.deleteDialog.item = this.getQuestion;
      } else if (this.collectionType == "occurrences") {
        this.deleteDialog.item = this.getOccurrence;
      }
    }
  }
};
</script>

<style scoped>
#header >>> .v-toolbar__content,
.v-toolbar__extension {
  padding: 0 !important;
}

#header >>> .v-text-field fieldset,
.v-text-field .v-input__control,
.v-text-field .v-input__slot {
  border-radius: 20px !important;
}
</style>
