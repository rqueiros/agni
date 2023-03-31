<template>
  <div>

    <!-- Toolbar for XS screen -->
    <v-toolbar color="white" absolute right width="100vw" class="m-toolbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-toolbar>

    <!-- Navigation Drawer-->
    <v-navigation-drawer app width="25%" v-model="drawer" 
                        class="m-navigation_drawer fill-height" 
                        :permanent="!screenSmall" :temporary="screenSmall" 
                        style="position: absolute; top:0; height: 100%;">

       <!---------------------Student------------------------------------------>
      <v-sheet color="grey lighten-4" class="m-profile_sheet" 
              v-if="this.role=='student'">
        <v-avatar color="red" class="m-profile" 
                  @click="selectResource(-1)">
          <v-icon dark class="m-icon">
            mdi-card-account-details
          </v-icon>
        </v-avatar>
        <div>guest@esmad.ipp.pt</div>
      </v-sheet>
      <!---->
       <!---------------------Teacher------------------------------------------>
      <v-sheet color="grey lighten-4" class="m-profile_sheet" 
              v-if="this.role=='teacher'">
        <div>Change to Student Mode -></div>
      </v-sheet>
      <!---->

      <v-divider></v-divider>
      <!--
      <v-draggable-treeview return-object open-on-click v-model="items" color="error" @update:active="selectResource"
        @update:open="selectResource" item-disabled="locked" hoverable :item-props="{ active: activeItem }"
        selected-color="primary" id="menuTreeView">


        <template v-slot:label="{ item, open, active }">
          <v-btn v-if="item.type == 'add'" small @click="addButton(item.contentType, item.parentId)">
            <v-icon :label=item>mdi-plus</v-icon> {{ item.name }}
          </v-btn>
          <Editable v-else :type="item.contentType" :value="item.name"></Editable> {{ open }} {{ active }}
        </template>

        <template v-slot:append="{ item, }">
          <v-btn icon v-if="item.contentType != 'course' && item.type != 'add'">
            <v-icon color="gray" class="m-edit_icon">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon v-if="item.contentType != 'course' && item.type != 'add'"
            @click="deleteIcon(item.contentType, item.strapiId)">
            <v-icon color="gray" class="m-edit_icon">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>

      </v-draggable-treeview>-->

      <v-treeview return-object :items="items" color="error" 
                  open-on-click editable @update:active="selectResource"
                  @update:open="selectResource" item-disabled="locked" 
                  hoverable activatable selected-color="primary"
                  id="menuTreeView">

        <!---------------------Student----------------------------------------->
        <template v-slot:prepend="{ item, open }" v-if="this.role=='student'">
          <v-icon v-if="item.contentType == 'course'" color="black" class="m-icon">
            {{ "mdi-cloud-braces" }}
          </v-icon>
          <v-icon v-else-if="item.contentType == 'module'" color="red" class="m-icon">
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else color="gray" class="m-icon">
            {{ files[item.type] }}
          </v-icon>
          {{ item.contentType != "course" ? `${item.internalId}. ` : `` }}
        </template>
        <!---->
                
        
        <!---------------------Teacher----------------------------------------->
        <template v-slot:label="{ item, }" v-if="this.role=='teacher'">
          <v-btn v-if="item.type == 'add'" small style="font-size: 0.7vw;"
                @click="addButton(item.contentType, item.parentId)">
            <v-icon class="m-edit_icon" :label=item>mdi-plus</v-icon> {{ item.name }}
          </v-btn>
          <Editable v-else :type="item.contentType" :value="item.name" 
                    :id="item.strapiId" :field="'name'" @input="editableChange"/>
        </template>

        <template v-slot:append="{ item, }" v-if="this.role=='teacher'">
          <v-btn icon v-if="item.contentType != 'course' && item.type != 'add'" 
                style="height:1vw;width: 1vw;"
                @click="upButton(item.contentType, item.strapiId)">
            <v-icon color="gray" class="m-edit_icon">
              mdi-arrow-up
            </v-icon>
          </v-btn>
          <v-btn icon v-if="item.contentType != 'course' && item.type != 'add'" 
                style="height:1vw;width: 1vw;"
                @click="downButton(item.contentType, item.strapiId)">
            <v-icon color="gray" class="m-edit_icon">
              mdi-arrow-down
            </v-icon>
          </v-btn>
          <v-btn icon v-if="item.contentType != 'course' && item.type != 'add'" 
                style="height:1vw;width: 1vw;">
            <v-icon color="gray" class="m-edit_icon">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon v-if="item.contentType != 'course' && item.type != 'add'" 
                style="height:1vw;width: 1vw;"
                @click="deleteButton(item.contentType, item.strapiId)">
            <v-icon color="gray" class="m-edit_icon">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <!---->

      </v-treeview>
    </v-navigation-drawer>
  </div>
</template>



<script>

    // TODO: implement a previous/next navigation in the editor component

import { mapGetters, mapMutations } from "vuex";
import Editable from "../../../components/Editable.vue";

export default {
  name: "Menu",

  components: {
    Editable,
  },

  data: () => ({
    drawer: false,
    screenWidth: 0,
    role: "",
    items: [],
    files: {
      course: "mdi-cloud-braces",
      pdf: "mdi-file-pdf",
      sheet: "mdi-file-document-outline"
    },
  }),

  created() {
    this.role = this.getRole
    this.$store.watch(
      state => state.courses,
      (newVal, oldVal) => {
        console.log(`Value of course changed from ${oldVal} to ${newVal}`);
        if (this.role == "student") {
          this.setCourse()
        } else if (this.role == "teacher") {
          this.setEditableCourse()
        }
      }
    );
    if (this.role == "teacher"){
      this.setEditableCourse()
    }
  },

  methods: {
    ...mapMutations(["addLessonByModuleId", "addModuleByCourseId",
      "deleteLesson", "deleteModule", "createEditableCourse", "upLesson", 
      "upModule", "downLesson", "downModule", "editableInput"]),

    //--------------------------Student-----------------------------------------
    setCourse() {
      this.items = this.getCourse
    },
    getCompletationStatus(item) {
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
    setEditableCourse() {
      this.createEditableCourse()
      this.items = this.getCourse
    },
    addButton(type, parentId) {
      console.log(this.items)
      if (type == "lesson") {
        this.addLessonByModuleId(parentId)
      } else if (type == "module") {
        this.addModuleByCourseId(parentId)
      }
    },
    deleteButton(type, id) {
      if (type == "lesson") {
        this.deleteLesson(id)
      } else if (type == "module") {
        this.deleteModule(id)
      }
    },
    upButton(type, id){
      if (type == "lesson") {
        this.upLesson(id)
      } else if (type == "module") {
        this.upModule(id)
      }
    },
    downButton(type, id){
      if (type == "lesson") {
        this.downLesson(id)
      } else if (type == "module") {
        this.downModule(id)
      }
    },
    editableChange(obj){
      this.editableInput(obj)
    },

    //--------------------------Else--------------------------------------------
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },

  computed: {
    ...mapGetters(["getCourse", "getCompletationStatusBySheetId", "getRole"]),
    screenSmall() {
      return this.screenWidth <= 768;
    }
  },

  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>



<style scoped>
#menuTreeView>>>.v-treeview-node__root {
  display: flex
}

.m-navigation_drawer {
  font-size: 1.1vw;
  top: 0;
}

.m-profile_sheet {
  padding: 1vw 16px;
}

.m-profile {
  width: 3.5vw !important;
  height: 3.5vw !important;
  min-width: 0 !important;
}

.m-profile:hover {
  cursor: pointer;
}

.m-icon {
  font-size: 1.7vw;
}

.m-edit_icon {
  font-size: 1.1vw !important;
}

/*
#menuTreeView>>>.v-treeview-node__append {
  width: 0;
  min-width: 0;
}*/

#menuTreeView>>>.v-treeview-node__level {
  width: 1.8vw;
}

#menuTreeView>>>.v-treeview-node__prepend {
  min-width: 0;
}

#menuTreeView>>>.v-treeview-node__root {
  min-height: 3.5vw;
}

.m-toolbar {
  display: none;
}


@media only screen and (max-width: 768px) {
  .m-toolbar {
    display: block;
  }

  .m-navigation_drawer {
    width: 75% !important;
    font-size: 3.5vw;
  }

  .m-icon {
    font-size: 3.7vw;
  }

  #menuTreeView>>>.v-treeview-node__level {
    width: 5vw;
  }

  #menuTreeView>>>.v-treeview-node__root {
    min-height: 8vw;
  }

  .m-profile {
    width: 8vw !important;
    height: 8vw !important;
    min-width: 0 !important;
  }

  .m-profile_sheet {
    padding: 2vw 16px;
  }
}
</style>
