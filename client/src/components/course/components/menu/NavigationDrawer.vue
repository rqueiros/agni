<template>
  <v-navigation-drawer
    :hide-overlay="isTeacher"
    v-model="drawer"
    :absolute="isSMsmaller"
    :permanent="!isSMsmaller"
    class="rounded-r-0 rounded"
    :drawer="drawer"
    :height="isSMsmaller ? '100%' : ''"
    :style="'min-width: ' + (isSMsmaller ? '300px' : '25%')"
  >
    <v-sheet color="studentMenuAccout" class="px-4" :class="getSmallTextClass">
      <div v-if="isStudent" class="d-flex align-center">
        <div class="mr-3 py-3">
          <div class="mb-2">
            <v-btn icon small @click="logoutAction">
              <v-icon>
                mdi-logout
              </v-icon>
            </v-btn>
          </div>
          <v-btn icon small @click="toggleTheme">
            <v-icon>
              mdi-white-balance-sunny
            </v-icon>
          </v-btn>
        </div>
        <v-divider vertical />
        <div class="ml-4 py-3 flex-grow-1">
          <v-avatar color="red" :size="getAvatarSmallSize">
            <v-icon dark :size="getIconSmallSize">
              mdi-card-account-details
            </v-icon>
          </v-avatar>
          <div class="mt-1">{{ getUsername }}</div>
        </div>
      </div>
      <div v-if="isTeacher" class="py-3">Account</div>
    </v-sheet>

    <v-divider />

    <v-treeview
      dense
      open-on-click
      return-object
      hoverable
      activatable
      id="menuTreeView"
      color="error"
      item-disabled="locked"
      :items="items"
      :item-key="'idMenu'"
      :class="getSmallTextClass"
      @update:active="selectResource"
      @update:open="openUpdate"
      :active.sync="active"
      :open.sync="open"
    >
      <template v-slot:label="{ item }">
        <span v-if="isStudent || isViewer">
          {{ item.name }}
        </span>
        <div v-if="isAuthor">
          <div v-if="item.type == 'add'" class="pa-1">
            <v-btn
              @click="addButton(item.contentType, item.parentId)"
              :small="getButtonMediumSize == 'small'"
              :medium="getButtonMediumSize == 'medium'"
              color="button"
            >
              <v-icon :label="item">mdi-plus</v-icon>
              {{ item.name }}
            </v-btn>
          </div>
          <span v-else>
            <Editable
              :type="item.contentType"
              :value="item.name"
              :id="item.id"
              field="name"
              :placeholder="
                item.contentType.charAt(0).toUpperCase() +
                  item.contentType.slice(1) +
                  ' name'
              "
              @input="editableInput"
              onclick="event.stopPropagation()"
              :required="true"
            />
          </span>
        </div>
      </template>

      <template v-if="isStudent || isViewer" v-slot:prepend="{ item, open }">
        <v-icon v-if="item.contentType == 'course'" :size="getIconSmallSize">
          mdi-cloud-braces
        </v-icon>
        <v-icon
          v-else-if="item.contentType == 'module'"
          color="red"
          :size="getIconSmallSize"
        >
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else class="mr-1"> </v-icon>
        {{ item.contentType != "course" ? `${item.internalId}. ` : `` }}
      </template>

      <template v-if="isTeacher" v-slot:append="{ item }">
        <div v-if="isAuthor" class="d-flex align-center py-1">
          <span class="d-flex flex-column">
            <v-btn
              v-if="item.contentType != 'course' && item.type != 'add'"
              icon
              :x-small="getButtonSmallSize == 'x-small'"
              :small="getButtonSmallSize == 'small'"
              @click="moveButton(item.contentType, item.id, 'up')"
              onclick="event.stopPropagation()"
            >
              <v-icon :size="getIconSmallSize">
                mdi-arrow-up
              </v-icon>
            </v-btn>
            <v-btn
              v-if="item.contentType != 'course' && item.type != 'add'"
              icon
              :x-small="getButtonSmallSize == 'x-small'"
              :small="getButtonSmallSize == 'small'"
              @click="moveButton(item.contentType, item.id, 'down')"
              onclick="event.stopPropagation()"
            >
              <v-icon :size="getIconSmallSize">
                mdi-arrow-down
              </v-icon>
            </v-btn>
          </span>
          <v-btn
            v-if="item.type != 'add'"
            icon
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
            @click="openDialog(item)"
            onclick="event.stopPropagation()"
          >
            <v-icon :size="getIconSmallSize">
              {{ getIcon("edit") }}
            </v-icon>
          </v-btn>
          <v-btn
            v-if="item.contentType != 'course' && item.type != 'add'"
            icon
            :x-small="getButtonSmallSize == 'x-small'"
            :small="getButtonSmallSize == 'small'"
            @click="deleteButton(item.contentType, item.id)"
            onclick="event.stopPropagation()"
          >
            <v-icon :size="getIconSmallSize">
              {{ getIcon("delete") }}
            </v-icon>
          </v-btn>
        </div>

        <v-btn
          v-if="isViewer"
          icon
          :x-small="getButtonSmallSize == 'x-small'"
          :small="getButtonSmallSize == 'small'"
          @click="openDialog(item)"
          onclick="event.stopPropagation()"
        >
          <v-icon color="gray" :size="getIconSmallSize">
            mdi-information-outline
          </v-icon>
        </v-btn>
      </template>
    </v-treeview>

    <DialogCourse
      :dialogItem="dialogCourseItem"
      :dialog="dialogCourse"
      v-if="isTeacher"
    />
    <DialogModuleLesson
      :dialogItem="dialogModuleLessonItem"
      :dialog="dialogModuleLesson"
      v-if="isTeacher"
    />
  </v-navigation-drawer>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

import Editable from "../../../gerneral/Editable.vue";
import DialogCourse from "./DialogCourse.vue";
import DialogModuleLesson from "./DialogModuleLesson.vue";

export default {
  components: {
    Editable,
    DialogCourse,
    DialogModuleLesson,
  },

  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    items: [],
    active: [],
    open: [],
    dialogCourse: false,
    dialogModuleLesson: false,
    dialogCourseItem: {},
    dialogModuleLessonItem: {},
  }),

  created() {
    this.setCourse();
    bus.$on("dialogCourseChange", (payload) => {
      this.dialogCourse = payload;
    });
    bus.$on("dialogModuleLessonChange", (payload) => {
      this.dialogModuleLesson = payload;
    });
    bus.$on("openCourse", (payload) => {
      this.open = [this.items[0], this.items[0].children[0]];
      this.active =
        payload == "no"
          ? [this.items[0].children[0].children[0]]
          : [this.items[0].children[0].children[1]];
    });
  },

  watch: {
    courses() {
      this.setCourse();
    },
  },

  computed: {
    ...mapState("main", { courses: (state) => state.courses }),
    ...mapGetters("main", [
      "getCoursesState",
      "getCompletationStatusBySheetID",
    ]),
    ...mapGetters("request", [
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
      "getUsername",
    ]),
    ...mapGetters("style", [
      "getIconSmallSize",
      "getButtonSmallSize",
      "getSmallTextClass",
      "getButtonMediumSize",
      "getAvatarSmallSize",
      "isSMsmaller",
      "getIcon",
    ]),
  },

  methods: {
    ...mapActions("main", [
      "addLessonByModuleID",
      "deleteLessonByModuleID",
      "addModuleByCourseID",
      "deleteModuleByID",
      "addConditionByLMID",
      "moveLesson",
      "moveModule",
      "editableInput",
    ]),
    ...mapMutations("request", ["logout"]),

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },

    logoutAction() {
      this.logout();
      this.$router.push({ name: "Login" });
    },

    setCourse() {
      this.items = this.getCoursesState;
    },

    getCompletationStatus(item) {
      if (item.file == "sheet") {
        return this.getCompletationStatusBySheetID(item.id) == 100
          ? "mdi-book-check"
          : "";
      }
    },

    selectResource(item) {
      let id = item == -1 ? item : item.length > 0 ? item[0].id : 0;
      let type =
        item == -1 ? "-1" : item.length > 0 ? item[0].contentType : "0";
      this.$emit("onResourceClicked", id, type);
    },

    openUpdate(item) {
      let possibleActiveIds = item
        .filter((i) => i.contentType == "module")
        .flatMap((m) => m.children)
        .map((l) => l.id);
      if (
        this.active.length > 0 &&
        !possibleActiveIds.includes(this.active[0].id)
      ) {
        this.active = [];
        this.selectResource([]);
      }
    },

    addButton(type, parentId) {
      if (type == "lesson") {
        this.addLessonByModuleID(parentId);
      } else if (type == "module") {
        this.addModuleByCourseID(parentId);
      }
    },

    deleteButton(type, id) {
      if (type == "lesson") {
        if (this.active.length > 0 && this.active[0].id == id) {
          this.selectResource([]);
        }
        this.deleteLessonByModuleID(id);
      } else if (type == "module") {
        let lessonIds = this.items[0].children
          .find((m) => m.id == id)
          .children.map((l) => l.id);
        if (this.active.length > 0 && lessonIds.includes(this.active[0].id)) {
          this.selectResource([]);
        }
        this.deleteModuleByID(id);
      }
    },

    moveButton(type, id, direction) {
      if (type == "lesson") {
        this.moveLesson([id, direction]);
        let possibleActiveIds = this.open
          .filter((o) => o.contentType == "module")
          .flatMap((m) => m.children)
          .map((l) => l.id);
        if (!possibleActiveIds.includes(id)) {
          let parent = this.items[0].children.find((m) =>
            m.children.map((l) => l.id).includes(id)
          );
          this.open.push(parent);
        }
      } else if (type == "module") {
        this.moveModule([id, direction]);
      }
    },
    
    async openDialog(item) {
      if (item.contentType != "course") {
        if (item.condition == null) {
          await this.addConditionByLMID([item.id, item.contentType]);
        }
        this.dialogModuleLesson = true;
        this.dialogModuleLessonItem = item;
      } else {
        this.dialogCourse = true;
        this.dialogCourseItem = item;
      }
    },
  },
};
</script>
