<template>
  <v-dialog v-model="localDialog" width="400">
    <v-card>
      <v-card-title class="text-h6">
        Rename
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newName"
          label="New name"
          outlined
          dense
          autofocus
          @keyup.enter="ok"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="cancel" width="84px">
          Cancel
        </v-btn>

        <v-btn
          color="error"
          text
          @click="ok"
          :disabled="!newName || newName === currentItem.label"
          width="84px"
        >
          RENAME
        </v-btn>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RenameDialog",

  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    currentItem: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      newName: "",
      localDialog: false
    };
  },

  watch: {
    dialog(val) {
      this.localDialog = val;
      if (val) {
        this.newName = this.currentItem.label; 
      }
    },
    localDialog(val) {
      this.$emit("update:dialog", val);
    }
  },

  methods: {
    cancel() {
      this.localDialog = false;
    },
    ok() {
      if (!this.newName || this.newName === this.currentItem.label) return;
      this.currentItem.label = this.newName;

      this.$emit("rename", this.currentItem);
      this.localDialog = false;
    }
  }
};
</script>