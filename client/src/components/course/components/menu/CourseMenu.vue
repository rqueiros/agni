<template>
  <div id="courseMenu">
    <!-- Toolbar for small screen -->
    <v-toolbar
      absolute
      right
      height="40px"
      width="100vw"
      :color="isStudent ? 'grey lighten-2' : ''"
      elevation="1"
      :class="isSMsmaller ? 'd-block' : 'd-none'"
      rounded="t"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" small class="ml-n1"/>
      <v-spacer></v-spacer>
      <div v-if="isStudent" class="mr-2">
        <v-icon class="mr-2">mdi-school</v-icon>
        learnJS v0.7.7
      </div>
    </v-toolbar>

    <v-navigation-drawer
      :hide-overlay="isTeacher"
      app
      v-model="drawer"
      :width="isSMsmaller ? '50%' : '25%'"
      :permanent="!isSMsmaller"
    >
      <v-sheet 
        color="grey lighten-4" 
        class="px-4 py-3"
        :class="getSmallTextClass"
      >
        <!--Student-->
        <div v-if="isStudent" class="m-profile">
          <v-avatar
            color="red"
            :size="getAvatarSmallSize"
            @click="selectResource(-1)"
          >
            <v-icon dark :size="getIconSmallSize">
              mdi-card-account-details
            </v-icon>
          </v-avatar>
          <div class="mt-1">{{ getUsername }}</div>
        </div>
        <!--Teacher-->
        <div v-if="isTeacher">Account</div>
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
          <!--Student + Viewer-->
          <span v-if="isStudent || isViewer">
            {{ item.name }}
          </span>
          <!--Author-->
          <div v-if="isAuthor">
            <div v-if="item.type == 'add'" class="pa-1">
              <v-btn 
                @click="addButton(item.contentType, item.parentId)"
                :small="getButtonMediumSize=='small'"
                :medium="getButtonMediumSize=='medium'"
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
                :field="'name'"
                :placeholder="
                  item.contentType.charAt(0).toUpperCase() +
                    item.contentType.slice(1) +
                    ' name'
                "
                @input="editableInput"
                onclick="event.stopPropagation()"
              />
            </span>
          </div>
        </template>

        <!--Student + Viewer-->
        <template v-if="isStudent || isViewer" v-slot:prepend="{ item, open }">
          <v-icon
            v-if="item.contentType == 'course'"
            color="black"
            :size="getIconSmallSize"
          >
            mdi-cloud-braces
          </v-icon>
          <v-icon
            v-else-if="item.contentType == 'module'"
            color="red"
            :size="getIconSmallSize"
          >
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else class="mr-1">
          </v-icon>
          {{ item.contentType != "course" ? `${item.internalId}. ` : `` }}
        </template>

        <!--Teacher-->
        <template v-if="isTeacher" v-slot:append="{ item }">
          <!--Author-->
          <div v-if="isAuthor" class="d-flex align-center py-1"> 
            <span class="d-flex flex-column">
              <v-btn
                v-if="item.contentType != 'course' && item.type != 'add'"
                icon
                :x-small="getButtonSmallSize=='x-small'"
                :small="getButtonSmallSize=='small'"
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
                :x-small="getButtonSmallSize=='x-small'"
                :small="getButtonSmallSize=='small'"
                @click="moveButton(item.contentType, item.id, 'down')"
                onclick="event.stopPropagation()"
              >
                <v-icon 
                :size="getIconSmallSize">
                  mdi-arrow-down
                </v-icon>
              </v-btn>
            </span>
            <v-btn
              v-if="item.type != 'add'"
              icon
              :x-small="getButtonSmallSize=='x-small'"
                :small="getButtonSmallSize=='small'"
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
              :x-small="getButtonSmallSize=='x-small'"
              :small="getButtonSmallSize=='small'"
              @click="deleteButton(item.contentType, item.id)"
              onclick="event.stopPropagation()"
            >
              <v-icon :size="getIconSmallSize">
                {{ getIcon("delete") }}
              </v-icon>
            </v-btn>
          </div>

          <!--Viewer-->
          <v-btn
            v-if="isViewer"
            icon
            :x-small="getButtonSmallSize=='x-small'"
            :small="getButtonSmallSize=='small'"
            @click="openDialog(item)"
            onclick="event.stopPropagation()"
          >
            <v-icon color="gray" :size="getIconSmallSize">
              mdi-information-outline
            </v-icon>
          </v-btn>
        </template>
      </v-treeview>
    </v-navigation-drawer>

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

  </div>
</template>


<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations, mapState } from "vuex";

import Editable from "../../../gerneral/Editable.vue";
import DialogCourse from "./DialogCourse.vue";
import DialogModuleLesson from "./DialogModuleLesson.vue";

export default {
  name: "CourseMenu",

  components: {
    Editable,
    DialogCourse,
    DialogModuleLesson
  },

  props: {},

  data: () => ({
    drawer: false,
    items: [],
    active:[],
    open:[],
    
    dialogCourse: false,
    dialogModuleLesson: false,
    dialogCourseItem: {},
    dialogModuleLessonItem: {}
  }),

  created() {
    bus.$on("dialogCourseChange", payload => {
      this.dialogCourse = payload;
    });
    bus.$on("dialogModuleLessonChange", payload => {
      this.dialogModuleLesson = payload;
    });
    this.setCourse()
  },

  watch: {
    courses() {
      this.setCourse();
    },
  },

  computed: {
    ...mapState("main", { courses: state => state.courses }),
    ...mapGetters("main",[
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
      "getCourses",
      "getCompletationStatusBySheetId",
      "getUsername",
    ]),
    ...mapGetters("style",[
      "getIconSmallSize",
      "getButtonSmallSize",
      "getSmallTextClass",
      "getButtonMediumSize",
      "getAvatarSmallSize",
      "isSMsmaller",
      "getIcon"
    ])
  },

  methods: {
    ...mapMutations("main",[
      "addLessonByModuleId",
      "deleteLesson",
      "moveLesson",
      "addModuleByCourseId",
      "deleteModule",
      "moveModule",
      "editableInput",
      "addConditionByLMId"
    ]),

    //--------------------------Student-----------------------------------------
    setCourse() {
      this.items = this.getCourses;
    },
    getCompletationStatus(item) {
      //TODO reimplemet it
      if (item.file == "sheet") {
        if (this.getCompletationStatusBySheetId(item.id) == 100)
          return "mdi-book-check";
        else return "";
      }
    },
    selectResource(item) {
      let id;
      let type;
      if (item == -1) {
        id = item;
        type = -1;
      } else {
        if (item.length > 0) {
          id = item[0].id;
          type = item[0].contentType;
        } else {
          id = 0;
          type = 0;
        }
      }
      this.$emit("onResourceClicked", id, type);
    },
    openUpdate(item){
      let possibleActiveIds = item.filter(i => i.contentType == "module")
        .flatMap(m => m.children)
        .map(l => l.id)
      if (this.active.length > 0 &&
      !possibleActiveIds.includes(this.active[0].id)){
        this.active = []
        this.selectResource([])
      }
    },  

    //--------------------------Teacher-----------------------------------------
    addButton(type, parentId) {
      if (type == "lesson") {
        this.addLessonByModuleId(parentId);
      } else if (type == "module") {
        this.addModuleByCourseId(parentId);
      }
    },
    deleteButton(type, id) {
      if (type == "lesson") {
        if (this.active.length > 0 && this.active[0].id == id){
          this.selectResource([])
        }
        this.deleteLesson(id);
      } else if (type == "module") {
        let lessonIds = this.items[0]
          .children.find(m => m.id == id)
          .children.map(l => l.id)
        if (this.active.length > 0 && lessonIds.includes(this.active[0].id)){
          this.selectResource([])
        }
        this.deleteModule(id);
      }
    },
    moveButton(type, id, direction) {
      if (type == "lesson") {
        this.moveLesson([id, direction]);
        let possibleActiveIds = this.open.filter(o => o.contentType=="module")
          .flatMap(m => m.children).map(l => l.id)
        if (!possibleActiveIds.includes(id)){
          let parent = this.items[0].children
            .find(m => m.children.map(l => l.id).includes(id))
          this.open.push(parent)
        }
      } else if (type == "module") {
        this.moveModule([id, direction]);
      }
    },
    async openDialog(item) {
      if (item.contentType != "course") {
        if (item.condition == null){
          await this.addConditionByLMId([item.id, item.contentType]);
        }
        this.dialogModuleLesson = true
        this.dialogModuleLessonItem = item
      } else {
        this.dialogCourse = true
        this.dialogCourseItem = item
      }
    }
  }
};
</script>


<style scoped>
.m-profile:hover {
  cursor: pointer;
}

/* Disable Transition of Nav Bar */
#courseMenu>>>.v-treeview-node__children{
  transition:none !important
}
#courseMenu>>>.v-navigation-drawer{
  transition-duration: 0s;
  transform:none !important;

  position: absolute;
  top: 0 !important;
  max-height: 100% !important;
  height: 100% !important;
  border-radius: 4px 0 0 4px;
}
#courseMenu>>>.v-card{
  transition-property: none !important;
}
#courseMenu>>>.v-treeview-node__root::before{
  transition: none !important;
}

/* Treeview before-icons and spaces */
#menuTreeView >>> .v-icon.v-icon {
  font-size: 1.5em;
}
#menuTreeView >>> .v-treeview-node__toggle {
  width: 1em;
}
#menuTreeView >>> .v-treeview-node__level {
  width: 1.5em;
}
#menuTreeView >>> .v-treeview-node__prepend{
  min-width: 0px;
}
#menuTreeView >>> .v-treeview-node__append{
  min-width: 0px;
}
</style>
