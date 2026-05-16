<template>
  <v-dialog v-model="localDialog" max-width="500">
    <v-card>
      <v-card-title>Select Concepts {{ target === 'material' ? '(All concepts shown)' : '(Material concepts shown)' }}</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          dense
          outlined
          hide-details
          class="mb-3"
        />

        <v-data-table
          :items="concepts"
          :headers="headers"
          :search="search"
          hide-default-header
          hide-default-footer
          dense
          height="250"
          :items-per-page="concepts.length"
        >
          <template v-slot:item.check="{ item }">
            <div class="d-flex align-center justify-center">
               <v-checkbox
                 v-model="localSelected"
                 :value="item.id"
                 hide-details
                 class="ma-0 pa-0"
               />
            </div>
          </template>

          <template v-slot:item.label="{ item }">
            <span :class="{ 'red--text font-weight-bold': item.noMaterial }">
                {{ item.label }}
              <span v-if="item.noMaterial">(No material with concept)</span>
            </span>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn
          text
          color="blue"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SelectConceptDialog",

  props: {
    value: {               
      type: Boolean,
      default: false
    },
    concepts: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      default: () => []
    },
    target: {
      type: String,
      default: 'material'
    }
  },

  data() {
    return {
      localDialog: this.value,
      localSelected: [...this.selected],
      search: "",
      headers: [
        { value: "check" },
        { value: "label" }
      ]
    };
  },

  watch: {
    value(val) {
      this.localDialog = val;
      if (val) {
        this.localSelected = [...this.selected];
      }
    },
    localDialog(val) {
      this.$emit("input", val); 
    }
  },

  methods: {
    close() {
      this.localDialog = false;
    },
    save() {
      this.$emit("save", this.localSelected);
      this.localDialog = false;
    }
  }
};
</script>