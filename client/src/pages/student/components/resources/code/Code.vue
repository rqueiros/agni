<template>
  <div id="code">
    <v-container fluid>
      <v-row>
        <v-col :cols="this.screenSmall ? 12 : 7">
          <v-card class="mx-auto" max-width="100%" outlined>
            <!--STATEMENT-->
            <Header :resource="resource" />
            <!--PLAYER-->
            <Editor :resource="resource" @onErrors="setErrors" @onLogs="setLogs" ref="editor" />
            <v-rating v-model="rating" background-color="orange lighten-3" color="orange">
            </v-rating>
            <!--FEEDBACK-->
            <v-expansion-panels>
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
                  <v-data-table :headers="headers" :items="errors" :items-per-page="5" @click:row="handleClick"
                    sort-by="row" class="elevation-1">
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
                  <v-data-table :headers="headers" :items="logs" :items-per-page="5" @click:row="handleClick"
                    sort-by="row" class="elevation-1">
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
                    <v-icon color="warning">
                      mdi-comment-multiple
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code>It will be possible to pose questions in future
                          versions</code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>

        <v-col cols="5">
          <Tests :resource="resource" :errors="errors" :logs="logs" @onSaveCode="saveCode" ref="tests" class="r-tests" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <Tests :resource="resource" :errors="errors" :logs="logs" @onSaveCode="saveCode" ref="tests"
            class="r-tests_XS" />
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import Header from "@/pages/student/components/resources/Header.vue";
import Editor from "@/pages/student/components/resources/code/Editor.vue";
import Tests from "@/pages/student/components/resources/code/Tests.vue";

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
    }
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
      screenWidth:0
    };
  },
  methods: {
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
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
  },
  computed: {
    screenSmall() {
      return this.screenWidth <= 768;
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>



<style>
.r-tests{
  display:block
}
.r-tests_XS{
  display: none;
}

@media only screen and (max-width: 768px) {
  .r-tests{
    display: none;
  }
  .r-tests_XS{
    display: block
  }
}

</style>
