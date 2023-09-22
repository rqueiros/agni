<template>
  <div id="evaluatives" v-if="evaluativesNotNull || isAuthor">

    <v-card style="border-left: 0; border-right: 0;">
      <!--Author-->
      <v-menu offset-y v-if="!evaluativesNotNull && isAuthor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            width="100%" 
            v-bind="attrs" 
            v-on="on" 
            height="36px"
            :small="getButtonMediumSize=='small'" 
            :medium="getButtonMediumSize=='medium'"
          >
            <v-icon>mdi-plus</v-icon>Add Exercises
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item 
            class="text-center"
            v-for="(item, index) in addEvaluativeMenu" 
            :key="index"  
            @click="addEvaluative(item.value)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-data-table 
        v-if="(isAuthor && evaluativesNotNull) || isStudent || isViewer" 
        :headers="isAuthor ? headers.author : 
          isViewer ? headers.viewer : headers.student" 
        :items="loadResource" 
        @click:row="play" 
        mobile-breakpoint="0" 
        no-data-text="" 
        :hide-default-footer="isAuthor"
        class="my-data-table"
      >
        <template v-slot:top>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="getSubtitleClass">
                Exercises:
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-slot:item.id="{item}">
          <span :class="getSmallTextClass">
            {{ item.id }}
          </span>
        </template>

        <template v-slot:item.type="{ item }">
          <v-icon 
            v-if="'type' in item && item.type!=null"
            :size="getIconMediumSize"
          >
            {{ getIcon(item.type) }}
          </v-icon>
          <v-icon v-else :size="getIconMediumSize">
            {{ getIcon(item.contentType) }}
          </v-icon>
        </template>

        <!--Author-->
        <template v-slot:footer v-if="isAuthor">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                width="100%" 
                v-bind="attrs" 
                v-on="on" 
                :small="getButtonMediumSize=='small'" 
                :medium="getButtonMediumSize=='medium'"
                class="mb-2 mt-1"
              >
                <v-icon>mdi-plus</v-icon>Add Exercises
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item 
                v-for="(item, index) in addEvaluativeMenu" 
                :key="index" 
                class="text-center"
                link
                @click="addEvaluative(item.value)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:item.name="{item}">
          <!--Student & Viewer-->
          <span v-if="isStudent || isViewer">
            {{ item.name }}
          </span>
          <!--Author-->
          <span  v-if="isAuthor" :class="getSmallTextClass">
            <Editable 
              type="evaluative" 
              :value="item.name" 
              :id="item.rid" 
              field="name"
              @input="editableInput" 
              placeholder="Exercise name" 
              onclick="event.stopPropagation()"
            />
          </span>
        </template>

        <template v-slot:item.grade="{ item }">
          <v-chip 
            :color="getColor(item.grade)" 
            dark 
            :small="getButtonMediumSize=='small'" 
            :medium="getButtonMediumSize=='medium'"
          >
            {{ item.grade }}%
          </v-chip>
        </template>

        <template v-slot:item.action="{ item }">
          <!--Student-->
          <v-btn 
            v-if="isStudent" 
            icon 
            @click="play(item)"
            :x-small="getButtonSmallSize=='x-small'"
            :small="getButtonSmallSize=='small'"
          >
            <v-icon :size="getIconSmallSize">mdi-clipboard-play</v-icon>
          </v-btn>
          <!--Author-->
          <v-btn 
            v-if="isAuthor"
            :x-small="getButtonSmallSize=='x-small'"
            :small="getButtonSmallSize=='small'"
            icon
            @click="deleteEvaluative(item.rid)"
            onclick="event.stopPropagation()"
          >
            <v-icon :size="getIconSmallSize"> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <SelectDialog 
      v-if="isAuthor"
      :dialog="dialog" 
      :type="'evaluatives'" 
      :already="resource.evaluatives.map(e => e.id)"
      @addExistingevaluatives="addExistingEval" 
      @closeSelectDialog="dialog=false"
    />

    <ExternalDialog
      :dialog="externalDialog"
      @addExternalExercises="addExternalExercises" 
      @closeSelectDialog="externalDialog=false"
    />

    <!--
    <v-dialog v-model="externalDialog" max-width="500">
      <v-card>
        <v-card-title>
          Choose an external library
        </v-card-title>

        <v-card-text class="pb-2">
          <v-container>
            <v-row>
              <v-col>
                <v-hover
                  v-slot="{ hover }"
                >
                  <v-card 
                    class="d-flex justify-center align-center hover" 
                    :style="hover ? 'background-color:#eeeeee' : ''"
                  >
                    <v-img :src="require('@/assets/authorkit.png')" height="150" contain></v-img>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col>
                <v-card style="min-height:100%" class="d-flex justify-center align-center">
                  Other Repositories will come
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn text @click="externalDialog=false">
            Cancel
          </v-btn>
          <v-btn text>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    -->


  </div>

</template>


<script>
import { bus } from "@/main.js";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Editable from "../../../../gerneral/Editable.vue";
import SelectDialog from "../../../../gerneral/SelectDialog.vue";
import ExternalDialog from "../../../../gerneral/ExternalDialog/ExternalDialog.vue";

export default {
  name: "Evaluatives",

  components: {
    Editable,
    SelectDialog,
    ExternalDialog
  },

  props: {
    resource: {
      type: Object,
      default: () => { }
    },
  },

  data() {
    return {
      dialog: false,
      externalDialog : false,
      headers: {
        student: [
          { text: "#", align: "start", sortable: true, value: "id" },
          { text: "Name", value: "name" },
          { text: "Type", value: "type" },
          { text: "Solving status (%)", value: "grade" },
          { text: "Actions", value: "action" }
        ],
        author: [
          { text: "#", align: "start", sortable: true, value: "id" },
          { text: "Type", value: "type" },
          { text: "Name", value: "name" },
          { text: "", value: "action" }
        ],
        viewer: [
          { text: "#", align: "start", sortable: true, value: "id" },
          { text: "Type", value: "type" },
          { text: "Name", value: "name" }
        ],
      },
      addEvaluativeMenu: [
        { title: "NEW QUIZ", value: "quiz" },
        { title: "NEW PROG. EX.", value: "prog" },
        { title: "SELECT", value: "select" },
        { title: "EXTERNAL", value: "external" }
      ],
    };
  },

  created() {
    this.loadResource;
    bus.$on("addExternalExercises", payload => {
      this.addExternalExercises(payload);
    });
  },

  computed: {
    ...mapGetters("main", [
      "getResourceById",
      "getStatusByResourceId",
      "getRole",
      "isStudent",
      "isTeacher",
      "isAuthor",
      "isViewer",
    ]),
    ...mapGetters("style", [
      "getSubtitleClass",
      "getIconMediumSize",
      "getIconSmallSize",
      "getSmallTextClass",
      "getIcon",
      "getButtonMediumSize",
      "getButtonSmallSize"
    ]),
    loadResource() {
      let ev = [];
      if (
        !("evaluatives" in this.resource) ||
        this.resource.evaluatives.length < 1
      ) {
        ev = [];
      } else if (this.isStudent) {
        let i = 1;
        this.resource.evaluatives.forEach(evaluative => {
          let grade = Number(this.getStatusByResourceId(evaluative.id).grade.toFixed(1));
          ev.push({
            id: i,
            rid: evaluative.id,
            name: evaluative.name,
            type: evaluative.type,
            grade: grade,
            action: ""
          });
          i++;
        });
      } else {
        let i = 1;
        this.resource.evaluatives.forEach(evaluative => {
          ev.push({
            id: i,
            rid: evaluative.id,
            name: evaluative.name,
            type: evaluative.type,
            contentType: evaluative.contentType
          });
          i++;
        });
      }
      return ev;
    },
    evaluativesNotNull() {
      return this.resource.evaluatives.length > 0;
    }
  },

  methods: {
    ...mapMutations("main", [
      "addEvaluativeByLessonId",
      "deleteEvaluative",
      "editableInput",
      "addQuizByLessonId",
      "addProgExByLessonId",
      "addExternalExByLessonId"
    ]),
    ...mapActions("main", [
      "addExistingEvaluatives"
    ]),
    addEvaluative(type) {
      if (type == "quiz") {
        this.addQuizByLessonId(this.resource.id)
      } else if (type == "prog") {
        this.addProgExByLessonId(this.resource.id)
      } else if (type == "select") {
        this.dialog = true;
      } else if (type == "external"){
        this.externalDialog = true;
      }
    },
    play(value) {
      bus.$emit("changeIt", [value.rid, "evaluative"]);
    },
    async addExistingEval(ids){
      await this.addExistingEvaluatives([this.resource.id, ids])
      this.dialog=false
    },
    addExternalExercises(exercises){
      this.externalDialog = false
      this.addExternalExByLessonId([this.resource.id, exercises])
    }, 
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    }
  }
};
</script>


<style scoped>
.my-data-table tbody tr:hover {
  cursor: pointer;
}
</style>
