<template>
  <div>

    <!-- Toolbar for XS screen -->
    <v-toolbar color="white" absolute right width="100vw" class="m-toolbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
    </v-toolbar>

    <!-- Navigation Drawer-->
    <v-navigation-drawer app width="25%" v-model="drawer" class="m-navigation_drawer"
      :permanent="!screenSmall" :temporary="screenSmall">

      <v-sheet color="grey lighten-4" class="m-profile_sheet">
        <v-avatar color="red" class="m-profile" @click="selectResource(-1)">
          <v-icon dark class="m-icon">
            mdi-card-account-details
          </v-icon>
        </v-avatar>
        <div>guest@esmad.ipp.pt</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-treeview return-object :items="items" color="error" open-on-click
        @update:active="selectResource" @update:open="selectResource"
        item-disabled="locked" hoverable activatable selected-color="primary" 
        id="menuTreeView">

        <template v-slot:prepend="{ item, open }">
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

      </v-treeview>
    </v-navigation-drawer>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
export default {
  name: "Menu",

  data: () => ({
    drawer: false,
    screenWidth: 0,
    role: "",
    items: [],
    files: {
      video: "mdi-video",
      code: "mdi-nodejs",
      quiz: "mdi-head-question-outline",
      course: "mdi-cloud-braces",
      pdf: "mdi-file-pdf",
      sheet: "mdi-file-document-outline"
    },
  }),

  created() {
    this.$store.watch(
      state => state.courses,
      (newVal, oldVal) => {
        console.log(`Value of course changed from ${oldVal} to ${newVal}`);
        this.items = this.getCourse;
      }
    );
    this.role=this.getRole
  },

  methods: {
    getCompletationStatus(item) {
      if (item.file == "sheet") {
        if (this.getCompletationStatusBySheetId(item.id) == 100)
          return "mdi-book-check";
        else return "";
      }
    },
    // TODO: implement a previous/next navigation in the editor component
    /* select(id) {
      this.active = [{id}] 
      this.selectResource(this.active)
    }, */
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
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
  },

  computed: {
    ...mapGetters(["getCourse", "getCompletationStatusBySheetId","getRole"]),
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
.m-navigation_drawer{
  font-size: 1.1vw;
}

.m-profile_sheet{
  padding:1vw 16px;
}

.m-profile{
  width:3.5vw !important;
  height: 3.5vw !important;
  min-width: 0 !important;
}
.m-profile:hover {
  cursor: pointer;
}

.m-icon {
  font-size: 1.7vw;
}

#menuTreeView>>>.v-treeview-node__append {
  width: 0;
  min-width: 0;
}

#menuTreeView>>>.v-treeview-node__level {
  width: 1.8vw;
}

#menuTreeView>>>.v-treeview-node__prepend {
  min-width: 0;
}

#menuTreeView>>>.v-treeview-node__root {
  min-height: 3.5vw;
}

.m-toolbar{
  display: none;
}


@media only screen and (max-width: 768px) {
  .m-toolbar{
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

  .m-profile{
    width:8vw !important;
    height: 8vw !important;
    min-width: 0 !important;
  }

  .m-profile_sheet{
    padding:2vw 16px;
  }
}
</style>
