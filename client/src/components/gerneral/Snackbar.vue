<template>
  <v-snackbar v-model="localSnackbar" :timeout="timeout" :color="color">
    <v-icon>{{ icon }}</v-icon>
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="localSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { bus } from "@/main.js";

export default {
  name: "Snackbar",

  components: {},

  props: {
    snackbar: {
      type: Boolean,
      default: () => false
    },
    timeout: {
      type: Number,
      default: () => 2000
    },
    color: {
      type: String,
      default: () => ""
    },
    icon: {
      type: String,
      default: () => ""
    },
    text: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      localSnackbar: this.snackbar
    };
  },

  watch: {
    snackbar(newValue) {
      this.localSnackbar = newValue;
      bus.$emit("snackbarChange", newValue);
    },
    localSnackbar(newValue) {
      if (newValue === false) {
        bus.$emit("snackbarChange", newValue);
      }
    }
  }
};
</script>

<style></style>
