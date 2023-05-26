<template>
  <div id="CourseMenu">

    <!-- Toolbar for small screen -->
    <v-toolbar 
    absolute right dense outlined 
    width="100vw"
    :color="isStudent ? 'grey lighten-2' : ''"
    :elevation="isTeacher ? '0' : '1'"  
    :style="isTeacher ? 'border-top:0;border-right:0;border-left:0' : ''"
    :class="smallScreen ? 'd-block' : 'd-none'"
    :rounded="isTeacher">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>
      <div v-if="isStudent" class="mr-2">
        <v-icon class="mr-2">mdi-school</v-icon>
        learnJS v0.7.7
      </div>
    </v-toolbar>

    <v-navigation-drawer 
    app 
    v-model="drawer" 
    class="m-navigation_drawer" 
    :width="smallScreen ? '50%' : '25%'"
    :permanent="!smallScreen"
    :temporary="smallScreen">
      <v-sheet color="grey lighten-4" class="px-4 py-3">
        <!--Student-->
        <div v-if="isStudent" class="m-profile">
          <v-avatar 
          color="red" 
          :size="getAvatarSmallSize(screenSize)" 
          @click="selectResource(-1)">
            <v-icon dark :size="getIconSmallSize(screenSize)"> 
              mdi-card-account-details 
            </v-icon>
          </v-avatar>
          <div>{{ getUsername }}</div>
        </div>
        <!--Teacher-->
        <div v-if="isTeacher">Account</div>
      </v-sheet>

      <v-divider />

      <v-treeview 
      dense open-on-click return-object hoverable activatable 
      id="menuTreeView" 
      color="error" 
      item-disabled="locked"
      :items="items" 
      :class="getSmallTextClass(screenSize)" 
      @update:active="selectResource" 
      @update:open="selectResource">
        <template v-slot:label="{ item }">
          <!--Student + Viewer-->
          <span v-if="isStudent || isViewer">
            {{ item.name }}
          </span>
          <!--Author-->
          <div v-if="isAuthor">
            <div v-if="item.type == 'add'" class="pa-1">
              <v-btn @click="addButton(item.contentType, item.parentId)" small>
                <v-icon :label="item">mdi-plus</v-icon>
                {{ item.name }}
              </v-btn>
            </div>
            <span v-else>
              <Editable 
              :type="item.contentType" 
              :value="item.name" 
              :id="item.strapiId" 
              :field="'name'"
              :placeholder="item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1) + ' name'"
              @input="editableInput" 
              onclick="event.stopPropagation()"/>
            </span>
          </div>
        </template>

        <!--Student + Viewer-->
        <template v-if="isStudent || isViewer" v-slot:prepend="{ item, open }">
          <v-icon v-if="item.contentType == 'course'" 
          color="black" 
          :size="getIconSmallSize(screenSize)">
            mdi-cloud-braces
          </v-icon>
          <v-icon v-else-if="item.contentType == 'module'" 
          color="red" 
          :size="getIconSmallSize(screenSize)">
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else color="gray" :size="getIconSmallSize(screenSize)">
            mdi-file-document-outline
          </v-icon>
          {{ item.contentType != "course" ? `${item.internalId}. ` : `` }}
        </template>

        <!--Teacher-->
        <template v-if="isTeacher" v-slot:append="{ item }">
          <!--Author-->
          <div v-if="isAuthor" class="d-flex align-center">
            <span class="d-flex flex-column">
              <v-btn v-if="item.contentType != 'course' && item.type != 'add'" 
              icon x-small
              @click="moveButton(item.contentType, item.strapiId, 'up')" 
              onclick="event.stopPropagation()">
                <v-icon color="gray" :size="getIconSmallSize(screenSize)">
                  mdi-arrow-up
                </v-icon>
              </v-btn>
              <v-btn v-if="item.contentType != 'course' && item.type != 'add'" 
              icon x-small
              @click="moveButton(item.contentType, item.strapiId, 'down')" 
              onclick="event.stopPropagation()">
                <v-icon color="gray" :size="getIconSmallSize(screenSize)">
                  mdi-arrow-down
                </v-icon>
              </v-btn>
            </span>
            <v-btn v-if="item.type != 'add'" 
            icon x-small 
            @click="openDialog(item)" 
            onclick="event.stopPropagation()">
              <v-icon color="gray" :size="getIconSmallSize(screenSize)">
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn v-if="item.contentType != 'course' && item.type != 'add'"
            icon x-small
            @click="deleteButton(item.contentType, item.strapiId)" 
            onclick="event.stopPropagation()">
              <v-icon color="gray" :size="getIconSmallSize(screenSize)">
                mdi-delete
              </v-icon>
            </v-btn>
          </div>

          <!--Viewer-->
          <v-btn v-if="isViewer" 
          icon x-small 
          @click="openDialog(item)" 
          onclick="event.stopPropagation()">
            <v-icon color="gray" :size="getIconSmallSize(screenSize)">
              mdi-information-outline
            </v-icon>
          </v-btn>
        </template>
      </v-treeview>
    </v-navigation-drawer>

    <MenuDialog 
    :screenSize="screenSize" 
    :dialogItem="dialogItem" 
    :dialog="dialog" />

  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapGetters, mapMutations } from "vuex";

import Editable from "../../../components/Editable.vue";
import MenuDialog from '../../teacher/components/dialog/MenuDialog.vue';

export default {
  name: "CourseMenu",

  props: {
    screenSize: {
      type: String,
      default: () => ""
    }
  },

  components: {
    Editable,
    MenuDialog
  },

  data: () => ({
    drawer: false,
    items: [],
    dialog: false,
    dialogItem: {}
  }),

  created() {
    bus.$on("dialogChange", payload => {
      this.dialog = payload
    });

    this.$store.watch(
      state => state.courses,
      () => {
        this.setCourse();
      }
    );
    this.setCourse();
  },

  computed: {
    ...mapGetters([
      "getCourse", "getCompletationStatusBySheetId", 
      "getRole", "getUsername",
      "getIconSmallSize", "getSmallTextClass", "getButtonSize", 
      "getAvatarSmallSize",
    ]),
    isStudent() {
      return this.getRole == "student";
    },
    isTeacher() {
      return this.getRole == "teacher" || this.getRole == "author" || this.getRole == "viewer";
    },
    isAuthor() {
      return this.getRole == "author";
    },
    isViewer() {
      return this.getRole == "viewer";
    },
    smallScreen(){
      return this.screenSize == 'xs' || this.screenSize == 'sm'
    }
  },

  methods: {
    ...mapMutations([
      "addLessonByModuleId", "deleteLesson", "moveLesson",
      "addModuleByCourseId", "deleteModule", "moveModule",
      "editableInput",
    ]),

    //--------------------------Student-----------------------------------------
    setCourse() {
      this.items = this.getCourse;
    },
    getCompletationStatus(item) { //TODO reimplemet it 
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
          id = item[0].strapiId;
          type = item[0].contentType;
        } else {
          id = 0;
          type = 0;
        }
      }
      this.$emit("onResourceClicked", id, type);
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
        this.deleteLesson(id);
      } else if (type == "module") {
        this.deleteModule(id);
      }
    },
    moveButton(type, id, direction) {
      if (type == "lesson") {
        this.moveLesson([id, direction]);
      } else if (type == "module") {
        this.moveModule([id, direction]);
      }
    },
    openDialog(item) {
      if (item.condition == null && item.contentType != 'course') {
        this.addConditionByLMId([item.strapiId, item.contentType])
      }
      this.dialogItem = item
      this.dialog = true
    },
  }
};
</script>

<style scoped>
.m-navigation_drawer {
  position: absolute;
  top: 0 !important;
  max-height: 100% !important;
  height: 100% !important;
  border-radius: 4px 0 0 4px;
}

.m-profile:hover {
  cursor: pointer;
}


#menuTreeView>>>.v-icon.v-icon {
  font-size: 1.5em;
}
#menuTreeView>>>.v-treeview-node__toggle {
  width: 1em;
}
#menuTreeView>>>.v-treeview-node__level {
  width: 1.5em;
}
</style>
