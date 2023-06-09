<template>
  <div id="img">
    <v-card class="mx-auto" max-width="100%" outlined>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title :class="getTitleClass">
            IMAGE
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-avatar tile :size="getAvatarMediumSize" color="green">
        </v-list-item-avatar>
      </v-list-item>

      <v-img :src="pdfData" class="my-2"
        v-if="'image' in question && (question.image.data != null || 'name' in question.image)">
      </v-img>

      <div v-else>
        <v-file-input label="File input" v-model="file" prepend-icon="" outlined></v-file-input>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: "Img",

  props: {
    question: {
      type: Object,
      default: () => { }
    },
  },

  data() {
    return {
      pdfData: null,
      file: null,
    };
  },

  watch: {
    file(newV) {
      const obj = {
        id: this.question.id,
        value: newV,
        field: "image",
        type: "question"
      };
      this.editableInput(obj);
      this.something()
    },
    question(){
      this.something()
    }
  },

  computed: {
    ...mapGetters("main", ["getDomain"]),
    ...mapGetters("style", ["getAvatarMediumSize", "getSmallTextClass", "getTitleClass"])
  },

  created() {
    this.something()
  },

  methods: {
    ...mapMutations("main", ["editableInput"]),
    something() {
      if ("image" in this.question) {
        const file = this.question.image;
        if ("data" in file && file.data != null) {
          this.pdfData =
            this.getDomain +
            this.question.image.data.attributes.url;
        } else if ("name" in file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.pdfData = reader.result;
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        }
      }
    }
  }

};
</script>

<style scoped></style>