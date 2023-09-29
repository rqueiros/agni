<template>
  <div id="settings" style="width:100%">
    <v-container fluid class="pa-0 mb-4">
      <v-row dense>
        <v-col>
          <v-expansion-panels flat class="shadow">
            <v-expansion-panel>
              <v-expansion-panel-header>
                System Information
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item dense>
                  <v-list-item-content>
                    <v-list-item-title>
                      Agni - ...
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      GitHub: ...
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-content>
                    <v-list-item-title>
                      Developers:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      ... : ...
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense>
                  <v-list-item-content>
                    <v-list-item-title>
                      Licensing & Credits ??
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      ...
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-expansion-panels flat class="shadow">
            <v-expansion-panel>
              <v-expansion-panel-header>
                Help
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense>
                  <v-list-group v-model="active.active1" no-action>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>Question 1</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Answer 1</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                  <v-list-group v-model="active.active2" no-action>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>Question 2</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Answer 2</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                  <v-list-group v-model="active.active3" no-action>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>Question 3</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Answer 3</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                  <v-list-group v-model="active.active4" no-action>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>Question 4</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Answer 4</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-card
            width="100%"
            class="pa-4 shadow"
            style="border-color: #C3C3C3;"
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
                <v-btn width="100%" color="primary" @click="sendEmail(message)" disabled>
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
import { mapActions } from 'vuex';


export default {
  name:"Settings",

  data: () => ({
    message:{
      message:"",
      name:"",
      email:"",
    },
    active:{
      active1:false,
      active2:false,
      active3:false,
      active4:false,
    },
    messageSubjects:["Feedback", "Question", "Other"]
  }),

  methods:{
    ...mapActions("main", ["sendEmail"]),
  }
}


</script>

<style></style>
