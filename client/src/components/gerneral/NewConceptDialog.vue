<template>
  <v-dialog v-model="localDialog" width="400">
    <v-card>
      <v-card-title class="text-h6">
        Create new concept
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="label"
          label="label"
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
          :disabled="!label"
          width="84px"
        >
          Create
        </v-btn>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "@/main.js";

export default {
  name: "NewConceptDialog",

  props: {
    dialog: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      label: "",
      localDialog: false
    };
  },

  watch: {
    dialog(val) {
      this.localDialog = val;
    },
    localDialog(val) {
      this.$emit("update:dialog", val);
    }
  },

  computed: {
    ...mapGetters("style", ["getMesssage"]),
  },

  methods: {
    ...mapActions("request", ["createConcept"]),
    cancel() {
      this.localDialog = false;
    },
    async ok() {
      if (!this.label) return;
      try {
        await this.createConcept([this.label]);
        bus.$emit(
          "successSnackbar",
          this.getMesssage(["general", "save", "success"])
        );
      } catch (err) {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }
      this.localDialog = false;
    }
  }
};
</script>