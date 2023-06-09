<template>
  <div id="code">
    <v-container fluid>
      <v-row>
        <v-col
          :cols="isSMsmaller ? 12 : 7"
        >
          <v-card max-width="100%" outlined>
            <!--STATEMENT-->
            <Header :resource="resource" v-if="!single" />
            <!--PLAYER-->
            <Editor
              :resource="resource" :single="single"
              @onErrors="setErrors"
              @onLogs="setLogs"
              ref="editor"
            />

            <v-rating
              v-model="rating"
              background-color="orange lighten-3"
              color="orange"
              v-if="isStudent"
            >
            </v-rating>
            <!--FEEDBACK-->
            <v-expansion-panels v-if="isStudent">
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Errors ({{ errors.length }})
                  <template v-slot:actions>
                    <v-icon :color="errors.length ? 'error' : 'success'">
                      {{ errors.length ? "mdi-alert-circle" : "mdi-check" }}
                      <!--$expand  | -->
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-data-table
                    :headers="headers"
                    :items="errors"
                    :items-per-page="5"
                    @click:row="handleClick"
                    sort-by="row"
                    class="elevation-1"
                  >
                    <template v-slot:item.row="{ item }">
                      {{ item.row + 1 }}
                    </template>
                    <template v-slot:item.type="{ item }">
                      <v-icon small class="mr-2" color="red">
                        {{
                          item.type == "info"
                            ? "mdi-information"
                            : "mdi-close-circle"
                        }}
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Logs ({{ logs.length }})
                  <template v-slot:actions>
                    <v-icon color="primary">
                      {{ "mdi-clipboard-edit" }}
                      <!--$expand  | -->
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-data-table
                    :headers="headers"
                    :items="logs"
                    :items-per-page="5"
                    @click:row="handleClick"
                    sort-by="row"
                    class="elevation-1"
                  >
                    <template v-slot:item.row="{ item }">
                      {{ item.row + 1 }}
                    </template>
                    <template v-slot:item.type="{ item }">
                      <v-icon small class="mr-2" color="blue">
                        {{
                          item.type == "log"
                            ? "mdi-clipboard-edit"
                            : "mdi-close-circle"
                        }}
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Questions (0)
                  <template v-slot:actions>
                    <v-icon color="warning"> mdi-comment-multiple </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code
                    >It will be possible to pose questions in future
                    versions</code
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>

        <v-col cols="5" class="pl-0">
          <Tests
            :resource="resource"
            :errors="errors"
            :logs="logs"
            @onSaveCode="saveCode"
            :class="isSMsmaller ? 'd-none' : 'd-block'"
          />
        </v-col>
      </v-row>

      <v-row
        :class="isSMsmaller ? 'd-block' : 'd-none'"
      >
        <v-col cols="12">
          <Tests
            :resource="resource"
            :errors="errors"
            :logs="logs"
            @onSaveCode="saveCode"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "../Header.vue";
import Editor from "./Editor.vue";
import Tests from "./Tests.vue"

export default {
  name: "Code",

  components: {
    Header,
    Editor,
    Tests
  },

  props: {
    resource: {
      type: Object,
      default: () => null
    },
    single: {
      type: Boolean,
      default: () => false
    },
  },

  data() {
    return {
      headers: [
        { text: "Row", value: "row", sortable: true },
        {
          text: "Type",
          align: "start",
          sortable: false,
          value: "type"
        },

        { text: "Message", value: "text" }
      ],
      errors: [],
      logs: [],
      rating: 0,
      line: 0,
    };
  },

  created() {},

  methods: {
    testM() {
      this.$refs.editor.testM();
    },
    setErrors(errors) {
      this.errors = errors;
    },
    setLogs(logs) {
      this.logs = logs;
    },
    saveCode() {
      this.$refs.editor.dataSumit();
    },
    handleClick(value) {
      this.$refs.editor.gotoLine(value.row);
    },
  },

  computed: {
    ...mapGetters("main",[
      "isStudent", 
      "isTeacher", 
      "isViewer", 
      "isAuthor", 
    ]),
    ...mapGetters("style",[
      "isSMsmaller"
    ]),
  },
};
</script>

<style></style>
