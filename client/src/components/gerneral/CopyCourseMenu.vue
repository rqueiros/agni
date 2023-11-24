<template>
  <div>
    <!--Error-->
    <v-card v-if="error" flat class="pa-10 d-flex justify-center">
      <ErrorChip/>
    </v-card>

    <!--Loading-->
    <v-card v-else-if="loading" flat class="pa-10 d-flex justify-center">
      <v-progress-circular
        :size="100"
        indeterminate
        color="grey"
        :width="7"
      ></v-progress-circular>
    </v-card>

    <!--Copy Course Menu-->
    <v-list v-else>
      <v-list-item>
        <v-treeview
          selectable
          dense
          selection-type="independent"
          v-model="cloneSelection"
          :items="cloneItems.children"
          :open.sync="cloneOpen"
          :item-key="'idMenu'"
        />
      </v-list-item>
      <v-list-item>
        <v-btn width="100%" @click="copy()">
          Clone
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import { mapActions } from "vuex";

import ErrorChip from "./ErrorChip.vue"

export default {
  name: "copyCourseMenu",

  components:{
    ErrorChip
  },

  props: {
    course: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      loading:true,
      error:false,
      cloneItems: [],
      cloneSelection: [],
      cloneOpen: [],
    };
  },

  async created(){
    await this.copyMenu()
  },

  watch: {
    cloneSelection(newV, oldV) {
      if (newV.length > oldV.length && this.cloneItems.length >0) {
        const newItem = newV.find(v => !oldV.includes(v));
        const parent = this.findParentofCloneBody(newItem);
        if (parent != null) {
          let addIds = [];
          parent.forEach(v => {
            if (!newV.includes(v)) {
              addIds.push(v);
            }
          });
          this.cloneSelection.push(...addIds);
        }
        let addIds = this.findChilrens(newItem);
        this.cloneSelection.push(...addIds);
      } else if (newV.length < oldV.length && this.cloneItems.length >0) {
        const remItem = oldV.find(v => !newV.includes(v));
        let remIds = this.findChilrens(remItem);
        this.cloneSelection = this.cloneSelection.filter(
          id => !remIds.includes(id)
        );
      }
    }
  },

  computed: {},

  methods: {
    ...mapActions("main", [
      "fetchCloneBody",
      "fetchClone",
    ]),
    async copyMenu() {
      this.cloneSelection = [];
      this.cloneOpen = [];
      this.loading = true;
      try {
        this.cloneItems = await this.fetchCloneBody(this.course.id);
      } catch (error) {
        console.log(error);
        this.error = true
      }
      this.loading=false;
    },
    async copy() {
      let cloneData = this.cloneItems;
      delete cloneData.idMenu;
      if (cloneData.children) {
        cloneData.modules = cloneData.children;
        cloneData.modules.forEach(module => {
          if (this.cloneSelection.includes(module.idMenu)) {
            module.clone = true;
          }
          delete module.idMenu;
          delete module.id;
          module.name = module.name.substring(3);
          if (module.children) {
            module.lessons = module.children;
            module.lessons.forEach(lesson => {
              if (this.cloneSelection.includes(lesson.idMenu)) {
                lesson.clone = true;
              }
              delete lesson.idMenu;
              delete lesson.id;
              lesson.name = lesson.name.substring(3);
              if (lesson.children) {
                lesson.expositives = [];
                lesson.evaluatives = [];
                lesson.children.forEach(children => {
                  let element = children;
                  if (this.cloneSelection.includes(element.idMenu)) {
                    element.clone = true;
                  }
                  let name = element.name;
                  element.name = element.name.substring(5);
                  delete element.idMenu;
                  delete element.id;
                  if (name.includes("Exp.")) {
                    lesson.expositives.push(element);
                  } else {
                    lesson.evaluatives.push(element);
                  }
                });
                delete lesson.children;
              }
            });
            delete module.children;
          }
        });
        delete cloneData.children;
      }
      this.cloneItems = [];
      this.cloneSelection = [];
      this.cloneOpen = [];
      try {
        await this.fetchClone(cloneData);
        bus.$emit("successSnackbar", "Course copied");
        bus.$emit("changePage", "content,Course");
      } catch (error) {
        console.log(error);
        bus.$emit("errorSnackbar", "Something went wrong copying the Course");
      }
    },
    findParentofCloneBody(idMenu) {
      const items = this.cloneItems.children;
      for (let i = 0; i < items.length; i++) {
        const module = items[i];
        if (module.idMenu == idMenu) {
          return null;
        }
        if (module.children) {
          for (let j = 0; j < module.children.length; j++) {
            const lesson = module.children[j];
            if (lesson.idMenu == idMenu) {
              return [module.idMenu];
            }
            if (lesson.children) {
              for (let k = 0; k < lesson.children.length; k++) {
                const ex = lesson.children[k];
                if (ex.idMenu == idMenu) {
                  return [module.idMenu, lesson.idMenu];
                }
              }
            }
          }
        }
      }
      return null;
    },
    findChilrens(idMenu) {
      const items = this.cloneItems.children;
      let array = [];
      if (items.find(i => i.idMenu == idMenu)) {
        let item = items.find(i => i.idMenu == idMenu);
        item.children.forEach(c => {
          array.push(c.idMenu);
          c.children.forEach(ch => {
            array.push(ch.idMenu);
          });
        });
      } else if (items.flatMap(i => i.children).find(i => i.idMenu == idMenu)) {
        let item = items.flatMap(i => i.children).find(i => i.idMenu == idMenu);
        item.children.forEach(c => {
          array.push(c.idMenu);
        });
      }
      return array;
    },
  }
};
</script>

<style></style>
