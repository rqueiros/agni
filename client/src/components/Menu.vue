<template>
  <v-navigation-drawer app width="360">
    <v-sheet color="grey lighten-4" class="pa-4">
      <v-avatar color="red" class="profile" @click="selectResource(-1)">
        <v-icon dark>
          mdi-card-account-details
        </v-icon>
      </v-avatar>

      <div>guest@esmad.ipp.pt</div>
    </v-sheet>

    <v-divider></v-divider>

    <v-treeview
      return-object
      :items="items"
      :item-key="id"
      @update:active="selectResource"
      @update:open="selectResource"
      hoverable
      activatable
      selected-color="primary"
      color="error"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="item.file == 'course'" color="black">
          {{ "mdi-cloud-braces" }}
        </v-icon>
        <v-icon v-else-if="!item.file" color="red">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else color="gray">
          {{ files[item.file] }}
        </v-icon>
        {{ !item.file ? `M${item.id}. ` : `` }}
      </template>

      <template v-slot:append="{ item }">
        <v-icon color="green">
          {{ getCompletationStatus(item) }}
        </v-icon>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Menu",

  data: () => ({
    files: {
      video: "mdi-video",
      code: "mdi-nodejs",
      quiz: "mdi-head-question-outline",
      course: "mdi-cloud-braces",
      pdf: "mdi-file-pdf",
      sheet: "mdi-file-document-outline",
    },
    items: [],
  }),
  created() {
    this.items = this.getCourse;
  },
  methods: {
    getCompletationStatus(item) {
      if (item.file == "sheet") {
        console.log(item.id);
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
      if (item == -1) {
        id = item;
      } else {
        if (item.length > 0) {
          id = item[0].id;
        } else {
          id = 0;
        }
      }

      this.$emit("onResourceClicked", id);
    },
    /*  openResource(item) {
      for (const i of item) {
        if(i.id) {
          this.$emit("onResourceClicked", i.id);
        }
      }
    } */
  },
  computed: {
    ...mapGetters(["getCourse", "getCompletationStatusBySheetId"]),
  },
};
</script>

<style scoped>
.profile:hover {
  cursor: pointer;
}
</style>
