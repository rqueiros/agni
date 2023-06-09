<template>
    <v-dialog v-model="dialog" width="auto" v-if="dialog">
      <v-card>
        <v-card-title class="text-h7">
          {{ question }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="darken-1" text @click="ok(buttons[0].msg)">
            {{ buttons[0].name }}
          </v-btn>
          <v-btn v-if="buttons.length>1" color="darken-1" text @click="ok(buttons[1].msg)">
            {{ buttons[1].name }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { bus } from "@/main.js";

export default {
  name:"YesNoButton",

  props: {
    question: {
      type: String,
      default: () => ""
    },
    buttons: {
      type: Array,
      default: () => []
    },
    dialog: {
      type: Boolean,
      default: () => false
    }
  },

  watch: {
    dialog(newD) {
      bus.$emit("yesNoDialog", newD);
    }
  },

  methods:{
    cancel(){
      bus.$emit("yesNoDialogResult", "cancel");
    },
    ok(msg){
      bus.$emit("yesNoDialogResult", msg);
    }
  }
}

</script>

<style></style>