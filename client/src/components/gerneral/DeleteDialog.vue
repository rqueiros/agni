<template>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-title class="text-h7">
          Are you sure you want to delete this {{ collectionType }}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="cancel" width="84px">
            Cancel
          </v-btn>
          <v-btn color="error" text @click="ok" width="84px">
            DELETE
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { bus } from "@/main.js";

export default {
  name:"DeleteDialog",

  props: {
    collectionType: {
      type: String,
      default: () => ""
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  watch: {
    dialog(newD) {
      bus.$emit("deleteDialog", newD);
    }
  },

  methods:{
    cancel(){
      bus.$emit("deleteDialogResult", "cancel");
    },
    ok(){
      bus.$emit("deleteDialogResult", "ok");
    }
  }
}

</script>

<style></style>