<template>
  <div id="newExpo">
    <v-file-input
      label="File input" 
      hide-details 
      v-model="file" 
      prepend-icon="" 
      height="150"
      outlined 
      class="rounded-0"
      style="border-right-width: 0; border-left-width: 0;"
    />
  </div>
</template>


<script>
import {mapMutations } from "vuex";
export default {
  name: "Expositives",

  props: {
    resource: {
      type: Object,
      default: () => { }
    }
  },

  data() {
    return {
      file: null,
    };
  },
  
  watch: {
    file: function (newFile, oldFile) {
      if (newFile !== oldFile) {
        if (newFile != [] && newFile != undefined) {
          this.changeExpositiveTypeById([this.resource.id, newFile]);
        }
      }
    },
  },

  methods: {
    ...mapMutations("main",[
      "changeExpositiveTypeById"
    ]),
  }
};
</script>


<style scoped>
#newExpo>>>.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset{
  color:rgba(0, 0, 0, 0.12);
  border-right-width: 0; 
  border-left-width: 0;
  border-bottom-width: 0;
}
#newExpo>>>.v-file-input input[type=file]{
  display: none;
}
#newExpo>>>.v-file-input .v-file-input__text{
  display: none;
}
#newExpo[data-v-55f18526]>>>.v-text-field--outlined .v-label{
  position: unset !important;
}
#newExpo>>>.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot{
  justify-content: center;
}
</style>
