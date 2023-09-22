<template>
  <div id="appBarHome">
    <v-app-bar 
      rounded 
      elevation="2" 
      height="auto" 
      outlined 
      style="background-color: #F7F8F9;" 
      class="pa-2"
    >

      <span class="mx-4"> {{ title }}
      </span>
      
      <!--
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="mx-4" v-bind="attrs" v-on="on"> {{ title }}
          </span>
        </template>
        <span>{{ description }}</span>
      </v-tooltip>-->

      <v-spacer></v-spacer>

      <!--
      <v-text-field 
        v-model="search"
        label="Search" 
        outlined 
        dense 
        hide-details>
      </v-text-field>-->

      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-details
        hide-selected
        item-text="Description"
        item-value="API"
        label="Search"
        placeholder="Start typing to Search"
        return-object
        outlined
        dense
      >
        <template v-slot:item="{ item }">
          <v-list-item-avatar
            class="text-h5 font-weight-light white--text"
          >
            <v-icon>
              {{ getIcon(item.collectionType) }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.label"></v-list-item-title>
            <!--<v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>-->
          </v-list-item-content>
        </template>
      </v-autocomplete>

      <v-spacer></v-spacer>

    

    </v-app-bar>
  </div>
</template>
  
<script>
import { bus } from "@/main.js";

import { mapActions, mapGetters } from 'vuex';

export default {
  name: "AppBarHome",

  components: {},

  props: {
    title: {
      type: String,
      default: () => ""
    },
    description: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      entries : [],
      isLoading: false,
      model: null,
      search: null
    };
  },

  watch: {
    model(newV){
      if (newV != null){
        this.openCollectionType(newV)
        this.model = null
      }
    },
    async search(newV) {
      // Items have already been loaded
      //if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      let params = {
        filters: {
          name: {
            $containsi: newV
          }
        }
      }
      let a = await this.fetchContents(params)
      this.entries = a
      console.log(a)
      this.isLoading = false
      
    },
  },

  computed: {
    ...mapGetters("style", [
      "getIcon"
    ]),
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        }
      })
    },
    items () {
      return this.entries.map(entry => {
        console.log(entry)
        let Description
        if ("label" in entry){
          Description = entry.label
        } else {
          Description = "modu"
        }
        return Object.assign({}, entry, { Description })
      })
    },
  },

  methods: {
    ...mapActions("main", [
      "fetchContents",
      "fetchPrepareCollectionType"
    ]),
    async openCollectionType(item) {
      try {
        console.log(item.id, item.collectionType)
        await this.fetchPrepareCollectionType([item.id, item.collectionType]);
        switch (item.collectionType) {
          case "courses":
            bus.$emit("changePage", "content,Course");
            break;
          case "expositives":
            bus.$emit("changePage", "content,Expositive");
            break;
          case "evaluatives":
            bus.$emit("changePage", "content,Evaluative");
            break;
          case "questions":
            bus.$emit("changePage", "content,Question");
            break;
        }
      } catch (error) {
        console.log(error)
        bus.$emit("errorSnackbar", "Something went wrong fetching the "+item.collectionType)
      }
    },
  },
}
</script>
  
<style scoped></style>