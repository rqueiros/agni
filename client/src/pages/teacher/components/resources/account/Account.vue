<template>
  <div id="account" style="width: 100%;">
    <v-container fluid class="pa-0 mb-4">
      <v-row>
        <v-col style="max-width: 200px;">
          <v-card
            class="pa-2 shadow rounded-xl"
            width="100%"
            height="100%"
            color="boxes"
          >
            <v-avatar
              class="profile"
              width="159"
              height="170"
              color="primary"
              rounded="xl"
              v-if="(!'image' in getUser) || getUser.image == null || ('data' in getUser.image &&  getUser.image.data == null)"
            >
              <v-icon size="xxx-large" color="white">
                mdi-account-tie
              </v-icon>
            </v-avatar>
            <v-file-input
            v-if="(!'image' in getUser) || getUser.image == null || ('data' in getUser.image &&  getUser.image.data == null)"
              v-model="image"
              prepend-icon="mdi-plus"
              hide-details
              hide-input
              class="avatarInput"
              :style="{backgroundColor : $vuetify.theme.currentTheme.button}"
            ></v-file-input>
            <v-badge
              v-else
              overlap
              @click.native="deleteImage" 
              icon="mdi-close" 
              bordered
              bottom
              class="badge"
              color="#f5f5f5"
              offset-x="20"
              offset-y="20"
            >
              <v-avatar
                onclick="event.stopPropagation()"
                class="profile pa-2"
                width="159"
                height="170"
                color="primary"
                rounded="xl"
              >
                <v-img :src="imageData" contain></v-img>
              </v-avatar>
            </v-badge>
          </v-card>
        </v-col>
        <v-col>
          <v-row >
            <v-col>
              <v-card
                class="pa-2 shadow"
                width="100%"
                color="boxes"
              >
                <v-row no-gutters style="height:29px" class="d-flex align-center">
                  <v-col cols="2">
                    Name:
                  </v-col>
                  <v-col>
                    <Editable
                      v-if="getAccountEditable"
                      :type="'user'"
                      :value="getUser.username"
                      :id="0"
                      field="username"
                      :placeholder="'Username'"
                      @input="editableInput"
                    />
                    <div v-if="!getAccountEditable">
                      {{ getUser.username }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row >
            <v-col>
              <v-card
                class="pa-2 shadow"
                width="100%"
                color="boxes"
              >
                <v-row no-gutters style="height:29px" class="d-flex align-center">
                  <v-col cols="2">
                    Email:
                  </v-col>
                  <v-col>
                    <Editable
                      v-if="getAccountEditable"
                      :type="'user'"
                      :value="getUser.email"
                      :id="0"
                      field="email"
                      :placeholder="'Email'"
                      @input="editableInput"
                    />
                    <span v-if="!getAccountEditable">{{ getUser.email }}</span>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card
                class="pa-2 shadow"
                width="100%"
                color="boxes"
              >
              <v-row no-gutters style="min-height:29px" class="d-flex align-center">
                  <v-col cols="2">
                    Password:
                  </v-col>
                  <v-col>
                    <span>******</span>
                  </v-col>
                  <v-col cols="2" class="d-flex justify-end flex-column px-2">
                    <v-btn small @click="dialog = true" color="button">
                      New PW
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card
            class="pa-2 shadow"
            width="100%"
            height="100%"
            color="boxes"
          >
            <v-row>
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-school
                </v-icon>
                <span class="ml-1">
                  {{ contents.occurrences }}
                </span>
              </v-col>
              <v-divider vertical class="my-3" />
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-domain
                </v-icon>
                <span class="ml-1">
                  {{ contents.classes }}
                </span>
              </v-col>
              <v-divider vertical class="my-3" />
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-account
                </v-icon>
                <span class="ml-1">
                  {{ contents.students }}
                </span>
              </v-col>
              <v-divider vertical class="my-3" />
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-book-open-page-variant
                </v-icon>
                <span class="ml-1">
                  {{ contents.courses }}
                </span>
              </v-col>
              <v-divider vertical class="my-3" />
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-code-json
                </v-icon>
                <span class="ml-1">
                  {{ contents.evaluatives }}
                </span>
              </v-col>
              <v-divider vertical class="my-3" />
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-file-pdf-box
                </v-icon>
                <span class="ml-1">
                  {{ contents.exposititves }}
                </span>
              </v-col>
              <v-divider vertical class="my-3" />
              <v-col class="d-flex justify-center">
                <v-icon size="x-large" color="primary">
                  mdi-chat-question-outline
                </v-icon>
                <span class="ml-1">
                  {{ contents.questions }}
                </span>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels flat class="shadow">
            <v-expansion-panel :style="{backgroundColor : $vuetify.theme.currentTheme.boxes}">
              <v-expansion-panel-header>
                Account Settings
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Email Notifications: - In Progress
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-btn text color="error" class="pa-0" @click="deleteAccount" disabled>
                        Delete Account
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-title class="text-h7">
          Changing Password
        </v-card-title>
        <v-card-text>
          <v-conatiner fluid class="pa-0 mb-4">
            <v-row dense>
              <v-col>
                Current Password:
              </v-col>
              <v-col>
                <Editable
                  :type="'user'"
                  :value="''"
                  :id="0"
                  field="currentPW"
                  :placeholder="''"
                  @input="editableInput"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                New Password:
              </v-col>
              <v-col>
                <Editable
                  :type="'user'"
                  :value="''"
                  :id="0"
                  field="newPW"
                  :placeholder="''"
                  @input="editableInput"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                Confirm new Password:
              </v-col>
              <v-col>
                <Editable
                  :type="'user'"
                  :value="''"
                  :id="0"
                  field="newPW2"
                  :placeholder="''"
                  @input="editableInput"
                />
              </v-col>
            </v-row>
          </v-conatiner>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="dialog=false" width="84px">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="save" width="84px">
            save
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import Editable from '../../../../../components/gerneral/Editable.vue';

export default {
  name: "Account",

  components:{
    Editable
  },

  data: () => ({
    image:null,
    imageData: null,
    contents:{
      occurrences:0,
      classes:0,
      students:0,
      courses:0,
      exposititves:0,
      evaluatives:0,
      questions:0
    },
    dialog:false,
  }),

  async created() {
    this.loadImage()
    let resp = await this.getTeachersContent()
    this.contents.occurrences = resp.occurrences.length
    this.contents.classes = resp.classes.length
    this.contents.students = resp.students.length
    this.contents.courses = resp.course.length
    this.contents.exposititves = resp.expositives.length
    this.contents.evaluatives = resp.evaluatives.length
    this.contents.questions = resp.questions.length

  },

  computed: {
    ...mapGetters("main", [
      "getUser",
      "getAccountEditable",
      "getDomain"
    ]),
  },

  watch: {
    image(newV){
      const obj = {
        id: 0,
        value: newV,
        field: "image",
        type: "user"
      };
      this.editableInput(obj);
      this.loadImage()
      if (newV != null ){
        this.updateUserImage(this.getUser.image)
      }
    }
  },

  methods: {
    ...mapMutations("main",[
      "editableInput",
    ]),
    ...mapActions("main", [
      "changePW",
      "getTeachersContent",
      "updateUserImage"
    ]),
    save(){
      this.dialog = false
      this.changePW()
    },
    loadImage() {
      this.imageData = null
      if (this.getUser && "image" in this.getUser) {
        const file = this.getUser.image;
        if (file != null && !("data" in file && file.data == null) && "url" in file) {
          this.imageData =
            this.getDomain +
            this.getUser.image.url;
        } else if (file != null && "name" in file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imageData = reader.result;
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        }
      }
    },
    deleteImage(){
      const obj = {
        id: 0,
        value: {data:null},
        field: "image",
        type: "user"
      };
      this.file=null;
      this.editableInput(obj);
      this.loadImage()
      this.updateUserImage(this.getUser.image)
    },
    deleteAccount(){
      //TODO
      console.log("Delete Account")
    }
  }
}

</script>

<style scoped>
#account>>>.v-badge__badge:hover{
  cursor: pointer;
}
#account>>>.v-badge__badge{
  color:black;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 
    0px 2px 5px 0px rgba(0, 0, 0, 0.14), 
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}


.avatarInput{
  display: flex;
  justify-content: center;
  align-items: center;
  width:26px;
  height: 26px;
  padding:0px;
  border-radius: 15px;
  position: absolute;
  bottom:7px;
  right:7px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 
    0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

#account>>>.v-input__prepend-outer{
  margin:0;
}


</style>
