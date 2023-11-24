<template>
  <div id="classes">
    <v-expansion-panels class="shadow" v-model="panel" flat>
      <v-expansion-panel 
        :style="{ backgroundColor: $vuetify.theme.currentTheme.boxes }"
      >
        <v-expansion-panel-header>
          <div>
            Classes 
            <v-btn 
              @click="importDialog = true" 
              color="button" 
              v-if="panel==0" 
              small 
              class="mx-3"
              onclick="event.stopPropagation()"
            >
              <v-icon>mdi-import</v-icon>
            </v-btn>
            <v-btn 
              @click="addClass" 
              color="button" 
              v-if="panel==0" 
              small 
              class="mx-3"
              onclick="event.stopPropagation()"
            >
              <v-icon>mdi-plus</v-icon>
              Class
            </v-btn>
          </div>
        </v-expansion-panel-header>

        <!--Classes-->
        <v-expansion-panel-content v-if="getOccurrence.classes.length > 0">
          <v-row dense>
            <template v-for="(cla, index) in getOccurrence.classes">
              <v-col 
                :key="index" 
                v-if="true"
                style="max-width:500px; min-width:300px"
              >
                <v-card 
                  width="100%" 
                  outlined
                  elevation="1" 
                  min-height="280px" 
                  :style="{backgroundColor: $vuetify.theme.currentTheme.boxes}"
                >
                  <v-list-item>
                    <v-list-item-content>
                      <v-row class="text-body-1" dense>
                        <v-col>
                          <Editable 
                            style="width: 100px;" 
                            :type="'class'" 
                            placeholder="Name" 
                            :value="cla.name"
                            :id="cla.id" 
                            :field="'name'" 
                            @input="editableInput" 
                          />
                        </v-col>
                        <v-col class="d-flex align-center">
                          <span class="mr-1">Delay:</span>
                          <Editable 
                            style="width: 65px;" 
                            :type="'class'" 
                            placeholder="Delay" 
                            :value="cla.delay ? cla.delay.toString() : cla.delay" 
                            :id="cla.id" 
                            :field="'delay'" 
                            @input="editableInput" 
                          />
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                    <v-btn icon small @click="deleteClass(cla.id)">
                      <v-icon size="large"> mdi-delete </v-icon>
                    </v-btn>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-text-field 
                    v-model="cla.search" 
                    prepend-inner-icon="mdi-magnify" 
                    class="smallSearch mt-0"
                    dense 
                    hide-details 
                    filled
                  />
                  <v-data-table 
                    dense 
                    hide-default-footer
                    hide-default-header
                    :headers="studentHeader" 
                    :items="cla.students" 
                    :search="cla.search"
                    :items-per-page="-1"
                    class="overflow-y-auto"
                    style="height:175px; background-color:transparent"
                  >
                    <template v-slot:item.name="{ item }">
                      <div style="max-height: 24px; overflow-y: auto;">
                        {{ item.name }}
                      </div>
                    </template>
                    <template v-slot:item.delay="{ item }">
                      <Editable 
                        :type="'student'" 
                        placeholder="Delay" 
                        :value="item.delay ? item.delay.toString() : item.delay" 
                        :id="item.id" 
                        :field="'delay'" 
                        @input="editableInput"
                      />
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-btn icon small>
                        <v-icon size="large">
                          mdi-cog
                        </v-icon>
                      </v-btn>
                      <v-btn icon small @click="deleteStudent(item.id)">
                        <v-icon size="large">
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                  <div class="pa-1">
                    <v-btn 
                      small 
                      @click="openStudentDialog(cla.id)" 
                      width="100%" 
                      color="button"
                    >
                      <v-icon>mdi-plus</v-icon>Student
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-expansion-panel-content>

        <!--No Classes-->
        <v-expansion-panel-content v-else>
          <div class="text-body-2">
            No Classes yet!
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!--Create Student Dialog-->
    <v-dialog width="500" v-model="studentDialog">
      <v-card>
        <v-card-title class="text-h5">
          Create Student
        </v-card-title>
        <v-card-text>
          <div>
            <v-text-field label="Name" hide-details ref="nameInput"/>
          </div>
          <div>
            <v-text-field label="Email" hide-details ref="emailInput"/>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="studentDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="addStudent">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ImportDialog 
      :dialog="importDialog" 
      @closeSelectDialog="importDialog = false" 
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Editable from "../../../../../components/gerneral/Editable.vue";
import ImportDialog from "../../../../../components/gerneral/ImportDialog.vue";


export default {
  name: "Classes",

  components: {
    Editable,
    ImportDialog,
  },

  data() {
    return {
      occurrence: this.getOccurrence,

      panel: null,

      studentDialog: false,
      dialogClassID: null,

      importDialog: false,

      itemsPerPage: 5,
      studentHeader: [
        { text: "Name", value: "name", align: "start" },
        { text: "Delay", value: "delay", cellClass:"columnWidth4" },
        { text: "", value: "actions", align: "end", cellClass:"columnWidth5" }
      ],
    };
  },

  watch: {
    studentDialog(newV) {
      if (!newV) {
        this.dialogClassID = null
      }
    },
  },

  computed: {
    ...mapGetters("main", ["getOccurrence"]),
    ...mapGetters("style", ["getIcon"])
  },

  methods: {
    ...mapMutations("main", [
      "editableInput",
      "addClassByOccurrenceId",
      "addStudentByClassId",
      "deleteClass",
      "deleteStudent"
    ]),
    openStudentDialog(classID) {
      this.dialogClassID = classID
      this.studentDialog = true
    },
    addStudent() {
      this.studentDialog = false
      let obj = {
        name: this.$refs.nameInput.$refs.input.value,
        email: this.$refs.emailInput.$refs.input.value
      }
      this.addStudentByClassId([this.dialogClassID, obj])
      this.dialogClassID = null
    },
    addClass() {
      this.addClassByOccurrenceId(this.getOccurrence.id);
    }
  }
};
</script>


<style scoped>
/* Search Students */
#classes>>> .v-input--hide-details > .v-input__control > .v-input__slot{
  padding-left: 8px;
  padding-right: 8px;
  min-height:20px;
}
#classes>>> .v-text-field.v-input--dense .v-input__prepend-inner, .v-text-field.v-input--dense .v-input__append-inner {
  margin-top: 2px !important;
}
#classes>>>.v-text-field > .v-input__control > .v-input__slot:before{
  border-color: rgba(0, 0, 0, 0.12);
}
#classes>>>.smallSearch .v-icon.v-icon{
  font-size: 20px;
}
</style>


<style>
.columnWidth4{
  width: 90px;
  min-width: 90px;
}
.columnWidth5{
  width: 90px;
  min-width: 90px;
}
</style>