<template>
  <div id="Student">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
          <Editable
            :type="'student'" 
            placeholder="Name" 
            :value="student.name" 
            :id="student.id"
            :field="'name'" 
            @input="editableInput" /> 
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-card
            width="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
          <Editable
            :type="'student'" 
            placeholder="Delay" 
            :value="student.delay != null ? student.delay.toString() : student.delay" 
            :id="student.id"
            :field="'delay'" 
            @input="editableInput" /> 
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <v-card
            width="100%"
            height="180px"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card
            width="100%"
            height="100%"
            outlined
            style="border-color: #C3C3C3;"
            class="px-2"
          >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Editable from '../../../../../components/gerneral/Editable.vue';

export default {
  name: "Student",

  components:{
    Editable,
  },

  data() {
    return {
      student:{}
    };
  },

  created() {
    this.setItems();
  },

  computed:{
    ...mapGetters("main",["getStudent"]),
  },

  methods:{
    ...mapMutations("main", ["editableInput"]),
    setItems(){
      this.student = this.getStudent
    }
  }
};
</script>

<style></style>
