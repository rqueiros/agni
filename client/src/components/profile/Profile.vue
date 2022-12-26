<template>
  <div id="profile">
    <v-container fluid>
      <v-row>
        <v-col cols="7">
          <v-card class="mx-auto mb-2" max-width="100%" outlined>
            <!--STATEMENT-->
            <div id="header">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="display-1">
                    GUEST
                  </v-list-item-title>

                  <v-list-item-subtitle class="title"
                    >guest@esmad.ipp.pt</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-avatar tile size="80" color="red">
                  <v-icon large color="white">
                    mdi-card-account-details
                  </v-icon>
                </v-list-item-avatar>
              </v-list-item>
              <v-card-text>
                <code>User data will appear here in future versions</code>
              </v-card-text>
            </div>
          </v-card>
          <v-card class="mx-auto" max-width="100%" outlined>
            <!--STATEMENT-->
            <div id="header">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="display-1">
                    COURSE PROGRESSION
                  </v-list-item-title>

                  <v-list-item-subtitle
                    >Status on the course exercises sheets</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-avatar tile size="80" color="blue">
                  <v-icon large color="white">
                    mdi-rocket-launch
                  </v-icon>
                </v-list-item-avatar>
              </v-list-item>
            </div>
            <!--PLAYER-->
            <div id="exercises">
              <v-data-table
                :headers="headers"
                :items="sheets"
                class="elevation-1 exercise"
                @click:row="play2"
              >
              <template v-slot:item.name="{ item }">
                  
                    {{ item.name }}
                  
                </template>
                <template v-slot:item.type="{ item }">
                  <v-icon>
                    {{ getIcon(item.type) }}
                  </v-icon>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip :color="getColor(item.status)" dark>
                    {{ item.status }}%
                  </v-chip>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-btn icon @click="play(item.rid)">
                    <v-icon>mdi-clipboard-play</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-col>
        <v-col cols="5">
          <Gamification />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { bus } from '@/main.js'
import Gamification from "@/components/profile/Gamification.vue";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: {
    Gamification,
  },
  created() {
    //let i = 1;
    this.getSheets.forEach((sheet) => {
      const id = sheet.name.substr(0,sheet.name.indexOf('.'));
      const rid = sheet.id;
      const name = sheet.name.substr(sheet.name.indexOf('.')+1);
      const status = this.getCompletationStatusBySheetId(sheet.id).toFixed(0);
      this.sheets.push({ id, rid, name, status });
      //i++;
    });
  },
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Name", value: "name" },
        { text: "Solving status (%)", value: "status" },
        { text: "Actions", value: "action" },
      ],
      sheets: [],
    };
  },
  methods: {
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    },
     play(id) {
       bus.$emit('changeIt', id);
    },
    play2(value) {
      bus.$emit('changeIt', value.rid);
    },
  },
  computed: {
    ...mapGetters(["getSheets", "getCompletationStatusBySheetId"]),
  },
};
</script>

<style></style>
