<template>
  <div
    id="img"
    v-if="
      ('image' in question &&
        question.image != null &&
        (question.image.data != null || 'name' in question.image)) ||
        isAuthor
    "
  >
    <v-card
      :outlined="!isEvaluative"
      :class="isEvaluative || isQuestion ? 'shadow' : ''"
      :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    >
      <v-list-item :class="!isMDsmaller ? 'px-4' : isMD ? 'px-2' : 'px-4'">
        <v-list-item-content class="align-self-start">
          <v-list-item-title :class="getTitleClass">
            IMAGE
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-avatar tile :size="getAvatarMediumSize" color="orange">
          <v-icon color="white" :size="getIconBigSize">
            mdi-image-area
          </v-icon>
        </v-list-item-avatar>
      </v-list-item>

      <div
        v-if="
          question &&
            'image' in question &&
            question.image != null &&
            (question.image.data != null || 'name' in question.image)
        "
        class="pa-2"
      >
        <v-badge
          tile
          class="badge"
          :class="isMD ? 'badgeTop1' : 'badgeTop2'"
          overlap
          color="#f5f5f5"
          @click.native="deleteImage"
          icon="mdi-close"
          v-if="isAuthor"
        >
        </v-badge>
        <v-img :src="imageData" contain> </v-img>
      </div>

      <div v-else class="pt-2">
        <v-file-input
          label="File input"
          v-model="file"
          hide-details
          prepend-icon=""
          outlined
          height="150"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Img",

  props: {
    question: {
      type: Object,
      default: () => {}
    },
    isEvaluative: {
      type: Boolean,
      default: () => false
    },
    isQuestion: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      imageData: null,
      file: null
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
      this.loadImage();
    },
    question() {
      this.loadImage();
    }
  },

  computed: {
    ...mapGetters("main", ["getDomain", "isAuthor"]),
    ...mapGetters("style", [
      "getAvatarMediumSize",
      "getSmallTextClass",
      "getTitleClass",
      "isMDsmaller",
      "isMD",
      "getIconBigSize"
    ])
  },

  created() {
    this.loadImage();
  },

  methods: {
    ...mapMutations("main", ["editableInput"]),
    loadImage() {
      this.imageData = null;
      if (this.question && "image" in this.question) {
        const file = this.question.image;
        if (file != null && "data" in file && file.data != null) {
          this.imageData =
            this.getDomain + this.question.image.data.attributes.url;
        } else if (file != null && "name" in file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imageData = reader.result;
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        }
      }
    },
    deleteImage() {
      const obj = {
        id: this.question.id,
        value: { data: null },
        field: "image",
        type: "question"
      };
      this.file = null;
      this.editableInput(obj);
      this.loadImage();
    }
  }
};
</script>

<style scoped>
/* Badge styles */
.badge:hover {
  cursor: pointer;
}
.badge {
  z-index: 5;
  position: absolute;
  right: 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.badgeTop1 {
  top: 78px;
}
.badgeTop2 {
  top: 90px;
}
#img >>> .v-badge--tile .v-badge__badge {
  border-radius: 4px;
  color: black;
}
#img >>> .v-badge__badge .v-icon {
  font-size: 16px;
}

/* file input styles */
#img
  >>> .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: rgba(0, 0, 0, 0.12);
  border-right-width: 0;
  border-left-width: 0;
  border-bottom-width: 0;
}
#img >>> .v-file-input input[type="file"] {
  display: none;
}
#img >>> .v-file-input .v-file-input__text {
  display: none;
}
#img >>> .theme--light.v-label {
  position: unset !important;
}
#img
  >>> .v-text-field
  > .v-input__control
  > .v-input__slot
  > .v-text-field__slot {
  justify-content: center;
}
</style>
