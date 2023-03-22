<template>
   <v-card class="mx-auto mb-2" max-width="100%" outlined>
      <v-container fluid>
         <v-row>
            <v-sheet class="d-flex mb-6 resource">
               <v-radio-group v-model="ex7" row class="class_radioGroup" hide-details inline>
                  <v-radio label="Course" value="course"></v-radio>
                  <v-radio label="Expositive" value="expositive"></v-radio>
                  <v-radio label="Evaluative" value="evaluative"></v-radio>
                  <v-radio label="Question" value="question"></v-radio>
               </v-radio-group>
               <v-divider vertical class="verticalDivider"></v-divider>
               <v-checkbox v-model="ex4" label="My" value="My" hide-details class="class_checkBox"></v-checkbox>
               <v-checkbox v-model="ex4" label="Draft" value="Draft" hide-details class="class_checkBox"></v-checkbox>
               <v-spacer></v-spacer>
            </v-sheet>
         </v-row>
         <v-row>
               <v-btn icon>
                  <v-icon @click="showSearchs">mdi-magnify</v-icon>
               </v-btn>
               <v-text-field v-model="search" label="Search" hide-details v-if="this.showSearch"></v-text-field>
         </v-row>
      </v-container>





      <!--
      <v-data-table :headers="headers" :items="evaluatives" class="elevation-1 exercise">
         <template v-slot:item.type="{ item }">
            <v-icon :title="item.type">
               {{ getIcon(item.type) }}
            </v-icon>
         </template>
         <template v-slot:item.action="{ item }">
            <v-btn icon>
               <v-icon>mdi-clipboard-play</v-icon>
            </v-btn>
         </template>
      </v-data-table>-->


   </v-card>
</template>
  
<script>
export default {
   data() {
      return {
         search: '',
         showSearch: false
      }
   },
   methods:{
      showSearchs(){
         this.showSearch = !this.showSearch
      }
   }
}
//import vueMultiSelect from 'vue-multi-select';
//import 'vue-multi-select/dist/lib/vue-multi-select.css';

/*
export default {
   components: {
      vueMultiSelect,
   },
   data() {
      return {
         picked: 'course',
         my: false,
         draft: false,
         headers: [],
         data: [
            { name: '0' },
            { name: '2' },
            { name: '3' },
            { name: '8' },
            { name: '9' },
            { name: '11' },
            { name: '13' },
            { name: '14' },
            { name: '15' },
            { name: '18' }
         ],
         options: {
            multi: true,
         },
      }
   }
}*/
/*
import { bus } from "@/main.js";
export default {
   name: "Evaluatives",
   components: {},
   computed: {},
   created() {
   },
   data() {
      return {
         headers: [
            {
               text: "#",
               align: "start",
               sortable: true,
               value: "id"
            },
            { text: "Name", value: "name" },
            { text: "Type", value: "type" },
            { text: "Solving status (%)", value: "grade" },
            { text: "Actions", value: "action" }
         ],
         evaluatives: []
      };
   },

   methods: {

   }
};*/
</script>
  
<style>
.verticalDivider {
   margin-right: 16px;
}

.resource {
   padding: 10px
}

.class_radioGroup {
   width: 28.2em;
   margin-top: 0;
}

.class_checkBox {
   width: 4.5em;
   margin-top: 0;
}

.classMain_radioLabel {
   margin-left: 0.5em;
   margin-right: 1.5em;
}

#classMain_line {
   border-style: solid;
   height: fit-content;
   width: 0em;
   border-color: gray;
   margin-right: 1.5em;
}

#classMain_search {
   border-style: solid;
   width: 1.5em;
   height: 1.5em;
   margin-right: 1em;
   border-color: gray;
   border-radius: 0.4em;
}

#classMain_filter {
   border-style: solid;
   width: fit-content;
   height: fit-content;
   font-size: 0.77em;
   padding: 0.1em;
   padding-left: 0.3em;
   padding-right: 0.3em;
   margin-right: 1em;
   border-color: gray;
   color: gray;
   border-radius: 0.4em;
}

#classMain_secondRow {
   padding-top: 0.5em;
   display: flex;
}

.select>button[data-v-0ea235da] {
   font-size: 0.9em !important;
   min-height: 0 !important;
}
</style>
  