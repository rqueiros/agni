<template>
  <div id="settings" style="width:100%">
    <v-container fluid class="pa-0 mb-4" style="max-width: 1200px;">
      <!--System Information-->
      <v-row dense>
        <v-col>
          <v-expansion-panels flat class="shadow">
            <v-expansion-panel
              :style="{ backgroundColor: $vuetify.theme.currentTheme.boxes }"
            >
              <v-expansion-panel-header>
                System Information
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item dense>
                  <v-list-item-content>
                    <v-list-item-title>
                      Agni
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      GitHub: 
                      <a href="https://github.com/rqueiros/agni" target="_blank">
                        https://github.com/rqueiros/agni
                      </a>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-content>
                    <v-list-item-title>
                      Developers:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Ricardo Queirós - 
                      <a href="mailto: ricardoqueiros@esmad.ipp.pt">
                        ricardoqueiros@esmad.ipp.pt
                      </a>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Yannik Bauer - 
                      <a href="mailto: yannikbauer.1@gmail.com">
                        yannikbauer.1@gmail.com
                      </a>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!--Help-->
      <v-row dense>
        <v-col>
          <v-expansion-panels flat class="shadow">
            <v-expansion-panel
              :style="{ backgroundColor: $vuetify.theme.currentTheme.boxes }"
            >
              <v-expansion-panel-header>
                Help
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense color="boxes">
                  <v-list-group 
                    v-for="(item, index) in help" 
                    :key="index" 
                    v-model="item.active" 
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.question }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item>
                      <v-list-item-content>
                        <div v-html="item.answer" class="text-body-2"></div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!--Message-->
      <v-row dense>
        <v-col>
          <v-card
            width="100%"
            class="pa-4 shadow"
            style="border-color: #C3C3C3;"
            color="boxes"
          >
            <v-row class="pb-1">
              <v-col>
                Write us a message:
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="message.name"
                  label="Name"
                  required
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="message.email"
                  label="E-mail"
                  required
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  :items="messageSubjects"
                  label="Subject"
                  outlined
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-textarea
                  v-model="message.message"
                  label="Message"
                  required
                  outlined
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-btn
                  width="100%"
                  color="primary"
                  @click="sendEmail(message)"
                  disabled
                >
                  Send
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import { mapActions } from "vuex";

export default {
  name: "Settings",

  data: () => ({
    message: {
      message: "",
      name: "",
      email: ""
    },
    messageSubjects: ["Feedback", "Question", "Other"],

    help:[
      {
        question:"When I create a Student, what will be his password?",
        answer:"Student Name without whitespaces + the 5 first chars of his email"
      },
      {
        question:"How are the Student statistical metrics calculated?",
        answer:"Exercises corect: Number of correct Exercises (Grade 100) / All accessible Exercises <br>Engagement: Sum of grades of all Exercises of the last 2 Lessons / Number of Exercises in the last 2 Lessons <br>Performance: (Exercises correct + Engagement) / 2 <br>(Grades are giving from 0 to 100)"
      },
      {
        question:"How can I sequence Course contents?",
        answer:"Clicking on the pencil on the side menu of each Module or Lesson. <br> AfterWeek: After which week starting with the Occurrence StartDate can a Student work with the Module/Lesson <br>AfterPercDone: Student has to have the defined percentage of exercises correct of the precious Lesson/Module to work with it"
      },
      {
        question:"How do the delays work?",
        answer:"Delays is the number of Weeks to delay the afterWeek conditions of Lessons/Modules. <br>They Work summative, meaning when a class has delay 1 and a student delay 1 assocaited. The Student is 2 Weeks delayed. "
      }
    ]
  }),

  methods: {
    ...mapActions("main", ["sendEmail"])
  }
};
</script>


<style></style>
