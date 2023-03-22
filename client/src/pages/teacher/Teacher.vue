<template>
   <v-app id="inspire1">
      <!--System bar-->
      <v-system-bar id="teacher_bar" app dark>
         <div>TEACHER</div>
         <v-spacer></v-spacer>
         <div class="mr-2 my"><v-icon>mdi-school</v-icon>learnJS v0.7.7</div>
      </v-system-bar>

      <!--Main-->
      <v-main>
         <Menu />
         <v-container fluid>
            <v-row>
               <v-col cols="9">
                  <Header :header="header" />
                  <Resource :resource="resource" />
               </v-col>
            </v-row>
         </v-container>
      </v-main>

   </v-app>
</template>


<script>
import { bus } from "@/main.js";
import Resource from "./components/Resource.vue";
import Menu from "./components/Menu.vue"
import Header from "./components/Header.vue"

export default {
   components: {
      Resource,
      Menu,
      Header
   },
   data: () => ({
      resource: "main,Main",
      header: "main",
   }),
   methods: {
      setPage(payload) {
         this.resource = payload[0]
         this.header = payload[1]
      },
      setResource(payload){
         this.resource = payload
      },
      setHeader(payload){
         this.header = payload
      }
   },
   created() {
      bus.$on("changePage", payload => {
         this.setPage(payload);
      });
      bus.$on("changeResource", payload => {
         this.setResource(payload);
      });
      bus.$on("changeHeader", payload => {
         this.setHeader(payload);
      });
   },
};
</script>
  
<style>
#teacher_bar {
   background-color: #454444;
}
</style>
