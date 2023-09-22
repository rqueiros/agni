<template>
  <div id="externalDialog">
    <v-dialog v-model="localDialog" max-width="700" scrollable>
      <v-card>
        <v-card-text class="pa-0">
          <component
            :is="getComponent"
            @changeType="changeType" 
          ></component>
        </v-card-text>
     </v-card>
    </v-dialog>
  </div>
</template>
  
<script>

export default {
  name: "ExternalDialog",

  components: {
  },

  props: {
    dialog: {
      type: Boolean,
      default: () => false
    },
  },

  data() {
    return {
      localDialog: this.dialog,
      type: "select"
    }
  },

  watch: {
    dialog(newValue) {
      this.localDialog = newValue
    },
    localDialog(newV) {
      if (!newV) {
        this.type = "select"
        this.$emit("closeSelectDialog");
      }
    },
  },

  created() {
  },

  computed: {
    getComponent() {
      if (this.type == "select"){
        return () => import(`./SelectRep`);
      } else if (this.type == "authorkit"){
        return () => import(`./AuthorKit`);
      } else {
        return () => import(`./SelectRep`);
      }
    },
  },

  methods: {
    changeType(type){
      this.type = type
    }
  },

}
</script>
  
<style scoped>
#externalDialog>>>.v-dialog{
  overflow-y: scroll !important;
}
</style>