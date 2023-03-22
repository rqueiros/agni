<template>
   <v-navigation-drawer app width="200" permanent>
      <v-sheet class="pa-4 menu_links" @click="setPage('account,Account','account')">
         <v-avatar color="red" class="profile">
            <v-icon dark>
               mdi-card-account-details
            </v-icon>
         </v-avatar>
         <div>guest@esmad.ipp.pt</div>
      </v-sheet>

      <v-list nav minimum-height="10">
         <v-divider></v-divider>
         <v-list-item class="menu_list-item menu_links" title="Main" value="main" @click="setPage('main,Main','main')">Main</v-list-item>
         <v-list-item class="menu_list-item menu_links" title="Class Managing" value="class" @click="setPage('class,Class','class')">Class Managing</v-list-item>
         <v-list-item class="menu_list-item menu_links" title="Content Managing" value="content" @click="setPage('content,Content','content')">Content Managing</v-list-item>
         <v-list-item class="menu_list-item menu_links" title="Settings" value="settings" @click="setPage('settings,Settings','settings')">Settings</v-list-item>
         <v-divider></v-divider>
         <v-list-item class="menu_list-item"> <v-text-field label="Search"></v-text-field> </v-list-item>
      </v-list>
   </v-navigation-drawer>
</template>
  
<script>
import { bus } from "@/main.js";

export default {
   components: {},
   data: () => ({
      resource: "main,Main",
      header: "",
   }),
   methods: {
      setPage(resource, header) {
         this.resource = resource
         this.header = header

         bus.$emit("changePage", [this.resource, this.header])
      },
   },
   created() {
      bus.$emit("changePage", [this.resource, this.header])
   },
};
</script>
    
<style>
.menu_list-item{
   min-height: 36px;
}
.menu_links:hover {
   cursor: pointer;
}
</style>
