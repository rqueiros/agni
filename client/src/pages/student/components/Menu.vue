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
    <!-- :item-key="id" -->
    <v-treeview return-object :items="items" @update:active="selectResource" @update:open="selectResource" item-disabled="locked"
      hoverable activatable selected-color="primary" color="error" open-on-click>
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="item.contentType == 'course'" color="black">
          {{ "mdi-cloud-braces" }}
        </v-icon>
        <v-icon v-else-if="item.contentType == 'module'" color="red">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else color="gray">
          {{ files[item.type] }}
        </v-icon>
        {{ item.contentType != "course" ? `${item.internalID}. ` : `` }}
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
      sheet: "mdi-file-document-outline"
    },
    items: []
  }),
  created() {
    this.$store.watch(
      state => state.courses,
      (newVal, oldVal) => {
        console.log(`Value changed from ${oldVal} to ${newVal}`);
        const c = this.getCourse;
        let count = 1;
        c.forEach(course => {
          course.strapiId = course.id;
          course.id = count;
          count = count + 1;
          course.children.forEach(m => {
            m.strapiId = m.id;
            m.id = count;
            count = count + 1;
            m.children.forEach(lesson => {
              lesson.strapiId = lesson.id;
              lesson.id = count;
              count = count + 1;
            });
          });
        });
        this.items = c;
      }
    );
    const c = this.getCourse;
    let count = 1;
    c.forEach(course => {
      course.strapiId = course.id;
      course.id = count;
      count = count + 1;
      course.children.forEach(m => {
        m.strapiId = m.id;
        m.id = count;
        count = count + 1;
        m.children.forEach(lesson => {
          lesson.strapiId = lesson.id;
          lesson.id = count;
          count = count + 1;
        });
      });
    });
    this.items = c;
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
    }
    /*  openResource(item) {
      for (const i of item) {
        if(i.id) {
          this.$emit("onResourceClicked", i.id);
        }
      }
    } */
  },
  computed: {
    ...mapGetters(["getCourse", "getCompletationStatusBySheetId"])
  }
};
</script>

<style scoped>
.profile:hover {
  cursor: pointer;
}
</style>
