<template>
  <div id="selectDialog">
    <v-dialog v-model="localDialog" max-width="500">
      <v-card>
        <v-card-title>
          Select one or more {{ type }}
        </v-card-title>

        <v-card-text class="pb-2">
          <v-text-field 
            clearable 
            v-model="search" 
            prepend-inner-icon="mdi-magnify" 
            label="Search" 
            single-line 
            hide-details 
            outlined
            dense 
          />

          <v-data-table 
            :items="items" 
            :headers="headers[type]" 
            hide-default-header
            hide-default-footer 
            :loading="loading"
            height="200px" 
            class="overflow-y-auto mb-3 elevation-1" 
            :search="search"
            dense
          >
            <template v-slot:item.check="{ item }">
              <v-checkbox 
                class="mt-0"
                v-model="checkboxes" 
                :value="item.id"
                label=""
                hide-details 
              />
            </template>
            <template 
              v-slot:item.question="{ item }" 
              v-if="type == 'questions'"
            >
                {{ item.question }}
            </template>
            <template v-slot:item.name="{ item }" v-else>
              {{ item.name }}
            </template>
          </v-data-table>

          <v-chip 
            v-for="id in checkboxes" 
            close 
            :key="id" 
            class="mr-2 mb-1"
            @click:close="unselect(id)"
          >
            <span v-if="type=='questions'">
              {{ items.find(i => i.id == id).question.slice(0,8) }}
            </span>
            <span>
              {{ items.find(i => i.id == id).name }}
            </span>
          </v-chip>
        </v-card-text>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn text @click="localDialog = false">
            Cancel
          </v-btn>
          <v-btn text @click="addExisting" :disabled="checkboxes.length==0">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "SelectDialog",

  props: {
    type: {
      type: String,
      default: () => ""
    },
    dialog: {
      type: Boolean,
      default: () => false
    },
    already: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      localDialog:this.dailog,
      search: "",
      loading: false,
      items: [],
      checkboxes: [],
      headers: {
        questions: [{ value: "check" },{ value: "question" }],
        evaluatives: [{ value: "check" },{ value: "name" }],
        expositives: [{ value: "check" },{ value: "name" }],
      }
    }
  },

  watch: {
    dialog(newValue) {
      this.localDialog = newValue
    },
    localDialog(newV) {
      if (!newV) {
        this.checkboxes=[]
        this.$emit("closeSelectDialog");
      } else {
        this.setItems()
      }
    },
    type(newV) {
      if (newV == "expositives" || newV == "evaluatives" || newV == "questions") {
        this.setItems()
      }
    },
  },

  created() {
    this.setItems()
  },

  computed: {},

  methods: {
    ...mapActions("main", ["fetchCollectionTypes"]),
    addExisting() {
      this.$emit("addExisting" + this.type, this.checkboxes);
    },
    async setItems() {
      const parameters = {
        collectionType: this.type
      };
      this.loading = true;
      let fetchedItems = await this.fetchCollectionTypes(parameters);
      this.items = fetchedItems.filter(e => !this.already.includes(e.id))
      this.loading = false;
    },
    unselect(id){
      this.checkboxes = this.checkboxes.filter(i => i != id)
    }
  },

}
</script>

<style scoped></style>