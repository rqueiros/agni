<template>
  <v-sheet
    class="mb-2 mt-n4 rounded-lg"
    :class="openChat ? 'elevation-5' : ''"
    :color="openChat ? 'gptGreen' : 'transparent'"
    style="position:fixed; z-index: 150; bottom:40px; right:60px"
    v-click-outside="closeChat"
  >
    <!--Closed-->
    <div v-if="!openChat">
      <v-avatar
        color="gptGreen"
        size="45"
        class="elevation-5 gptAvater mr-1"
        @click="openChat = !openChat"
      >
        <img
          :src="require('@/assets/chatgptLogo.png')"
          contain
          height="10px"
          class="pa-1"
        />
      </v-avatar>
      <v-progress-circular
        :size="40"
        :width="12"
        v-if="loading && !dialog"
        indeterminate
        color="grey darken-3"
        style="position:absolute; top:2px; left: 2px"
      ></v-progress-circular>
    </div>

    <!--Open-->
    <div style="font-size: 14px;" class="pa-2" v-if="openChat">
      <v-card flat color="gptGrey" dark>
        <div class="pa-1">
          Chat GPT 3.5
        </div>
        <!--Chat-->
        <v-card outlined style="background-color: transparent;" width="300px">
          <div ref="chat" class="overflow-y-auto" style="height: 150px;">
            <v-list style="background-color: transparent;">
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1"
              >
                <v-card class="gptMessage" flat>
                  {{ messageGPTDisplayed.start }}
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1" 
                v-if="messageShow.withinOrLesson"
              >
                <v-card class="gptMessage" flat>
                  {{ messageGPTDisplayed.withinOrLesson }}
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1" 
                v-if="messageShow.withinOrLessonResp"
              >
                <v-card class="myMessage" flat>
                  {{ messageResp.withinOrLesson }}
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1" 
                v-if="messageShow.howMany"
              >
                <v-card class="gptMessage" flat>
                  {{ messageGPTDisplayed.howMany }}
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1" 
                v-if="messageShow.howManyResp"
              >
                <v-card class="myMessage" flat>
                  {{ messageResp.howMany }}
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1" 
                v-if="messageShow.topic"
              >
                <v-card class="gptMessage" flat>
                  {{ messageGPTDisplayed.topic }}
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-3" 
                v-if="error"
              >
                <v-card class="errorMessage" flat>
                  Error! Send your topic again or check your internet connection.
                </v-card>
              </v-list-item>
              <v-list-item 
                style="display:grid; min-height: 0px;" 
                class="px-2 py-1" 
                v-if="messageShow.topicResp"
              >
                <v-card class="myMessage" flat>
                  {{ messageResp.topic }}
                </v-card>
              </v-list-item>
            </v-list>
          </div>
        </v-card>

        <!--Input Area-->
        <div class="py-2 px-4">
          <!--Text Input-->
          <div class="d-flex" v-if="messageShow.topic">
            <v-textarea
              v-model="messageInput"
              dense
              auto-grow
              rows="1"
              outlined
              hide-details
              style="font-size: 12px; line-height: 0.5"
              :disabled="loading"
              @keyup.enter="answerTopic"
            ></v-textarea>
            <v-btn
              @click="answerTopic"
              :disabled="loading"
              color="grey"
              small
              height="40px"
              class="ml-2"
            >
              <v-progress-circular
                :size="20"
                v-if="loading"
                indeterminate
              ></v-progress-circular>
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </div>

          <!--Number Input-->
          <div v-else-if="messageShow.howMany" class="d-flex justify-center">
            <v-btn 
              color="grey" 
              text 
              outlined 
              min-width="0" 
              @click="answerHowMany(1)"
            >
              1
            </v-btn>
            <v-btn 
              color="grey" 
              text 
              outlined 
              class="ml-2" 
              min-width="0" 
              @click="answerHowMany(2)"
            >
              2
            </v-btn>
            <v-btn 
              color="grey" 
              text 
              outlined 
              class="ml-2" 
              min-width="0" 
              @click="answerHowMany(3)"
            >
              3
            </v-btn>
            <v-btn 
              color="grey" 
              text 
              outlined 
              class="ml-2" 
              min-width="0" 
              @click="answerHowMany(5)"
            >
              5
            </v-btn>
            <v-btn 
              color="grey" 
              text 
              outlined 
              class="ml-2" 
              min-width="0" 
              @click="answerHowMany(10)"
            >
              10
            </v-btn>
          </div>

          <!--WithinOrLesson Input-->
          <div 
            v-else-if="messageShow.withinOrLesson" 
            class="d-flex justify-center"
          >
            <v-btn 
              color="grey" 
              text 
              outlined 
              @click="answerWithinOrLesson('Within')"
            >
              Within
            </v-btn>
            <v-btn 
              color="grey" 
              text 
              outlined 
              class="ml-2" 
              @click="answerWithinOrLesson('For Lesson')"
            >
              For Lesson
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>

    <v-dialog width="800" v-model="dialog" :persistent="loading">
      <v-card max-height="80vh" color="gptGreen" class="pa-2">
        <v-card color="gptGrey" dark>
          <v-card-title class="text-h5">
          GPT generated Exercises
          </v-card-title>
          <v-card-text>
            <v-list two-line max-height="50vh" class="overflow-y-auto" style="background-color: transparent;">
              <v-list-item-group
                v-model="selected"
                active-class="gptGreen--text"
                multiple
              >
                <template v-for="(item, index) in exercises">
                  <v-list-item :key="index+'a'" v-if="true">
                    <template v-slot:default="{ active }">
                      <v-list-item-action>
                        <v-icon
                          v-if="!active"
                          color="grey lighten-1"
                        >
                          mdi-star-outline
                        </v-icon>

                        <v-icon
                          v-else
                          color="gptGreen"
                        >
                          mdi-star
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.name" class="mb-1"/>

                        <div v-html="item.statement" class="gptSubtitle--text"></div>

                        <!--
                        <div v-html="item.solution" class="text--secondary"></div>-->
                      </v-list-item-content>
                    </template>
                  </v-list-item>

                  <v-divider
                    v-if="index < exercises.length - 1"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
            <div class="d-flex justify-center pt-2">
              <v-btn 
                color="gptGreen" 
                small 
                @click="generateMoreExercises" 
                :disabled="loading"
              >
                <v-progress-circular
                  :size="15"
                  v-if="loading"
                  indeterminate
                  class="mr-2"
                ></v-progress-circular>
                Generate 3 More ...
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" outlined text @click="closeDialog" :disabled="loading">
              Cancel
            </v-btn>
            <v-btn color="white" outlined text @click="addExercises" :disabled="loading">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>


<script>
//import Vue from 'vue';

import { mapActions } from "vuex";

/*
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});*/

export default {
  name: "GPT",

  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      loading: false,
      error:false,

      openChat: false,
      typingSpeed: 20,
      messageInput:"",
      messageInput2:"",

      dialog: false,
      exercises:[],
      selected:[],

      messageShow:{
        withinOrLesson:false,
        withinOrLessonResp:false,
        howMany:false,
        howManyResp:false,
        topic:false,
        topicResp:false,
      },
      messageResp:{
        withinOrLesson:"",
        howMany:0,
        topic:"",
        alreadyCreated:[]
      },
      messageGPT:{
        start : "Hello! I can generate Programming Exercises for you. But I cannot guarente that they are 100% correct.",
        withinOrLesson : "Do you want to generate an exercise within this or for the lesson?",
        howMany : "How many exercises do you want to generate?",
        topic : "Write the Topic of the exercises."
      },
      messageGPTDisplayed:{
        start:"",
        withinOrLesson:"",
        howMany:"",
        topic:""
      }
    };
  },

  watch:{
    async openChat(newV){
      console.log(1111)
      console.log(this.loading, this.error)
      if (newV){
        await this.startMessage()
      } else if ((!this.dialog && !this.loading) || (this.loading && this.error)) {
        this.error = false;
        this.loading = false;
        this.resetData();
      }
    },
    dialog (newV){
      if (!newV){
        this.exercises = []
        this.resetData()
      }
    }
  },

  methods: {
    ...mapActions("request", ["generateProgrammingEx"]),
    ...mapActions("main", ["addEvaluativeByLessonID2"]),
    /* Opens Closes */
    closeChat() {
      if (this.openChat){
        this.openChat = false;
        // = false;
        //this.laoding = false;
      }
    },
    resetData(){
      this.messageShow = {
        withinOrLesson:false,
        withinOrLessonResp:false,
        howMany:false,
        howManyResp:false,
        topic:false,
        topicResp:false,
      }
      this.messageResp = {
        withinOrLesson:"",
        howMany:0,
        topic:"",
        alreadyCreated:[]
      }
      this.messageGPTDisplayed = {
        start:"",
        withinOrLesson:"",
        howMany:"",
        topic:""
      }
      this.messageInput=""
    },
    closeDialog(){
      this.dialog = false
      this.loading = false
      this.error = false
      this.resetData()
    },

    /* Chat */
    async startMessage(){
      await this.displayMessage("start")
      if(this.resource.contentType=='code'){
        this.messageShow.withinOrLesson=true
        this.displayMessage("withinOrLesson")
      } else {
        this.messageShow.howMany = true
        this.displayMessage("howMany")
      }
      this.scrollToBottom()
    },
    answerWithinOrLesson(answer){
      this.messageResp.withinOrLesson = answer
      this.messageShow.withinOrLessonResp = true
      if (answer == 'Within'){
        this.messageShow.topic = true
        this.displayMessage("topic")
        this.scrollToBottom()
      } else {
        this.messageShow.howMany = true
        this.displayMessage("howMany")
        this.scrollToBottom()
      }
    },
    answerHowMany(answer){
      this.messageResp.howMany = answer
      this.messageShow.howManyResp = true
      this.messageShow.topic = true
      this.displayMessage("topic")
      this.scrollToBottom()
    },
    async answerTopic(){
      this.messageShow.topicResp=true
      this.messageResp.topic = this.messageInput
      this.messageInput = ""
      this.scrollToBottom()
      try{
        await this.generateExercise()
        this.dialog = true
        this.openChat = false
        console.log(222)
      } catch (err){
        console.log(err)
      }
    },
    displayMessage(message) {
      return new Promise((resolve) => {
        let charIndex = 0;
        const typeLetter = () => {
          if (charIndex < this.messageGPT[message].length) {
            this.messageGPTDisplayed[message] += this.messageGPT[message].charAt(charIndex);
            charIndex++;
            setTimeout(typeLetter, this.typingSpeed);
          } else {
            this.$nextTick(() => {
              this.scrollToBottom();
              resolve();
            });
          }
        };
        typeLetter();
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let chat = this.$refs.chat;
        if (chat) {
          const maxScrollTop = chat.scrollHeight - chat.clientHeight;
          const step = () => {
            if (chat.scrollTop < maxScrollTop) {
              chat.scrollTop += 10; 
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      });
    },

    /* GPT Use */
    async generateMoreExercises(){
      console.log(this.exercises)
      this.messageResp.alreadyCreated = this.exercises.map(e => e.name)
      await this.generateExercise()
    },
    async generateExercise() {
      this.loading = true;
      try{
        let data = await this.generateProgrammingEx([this.messageResp, this.resource.id]);
        this.displayExercises(data.exercises)
        this.error = false
      } catch(error){
        console.log(error)
        this.messageResp.topic = ""
        this.messageShow.topicResp = false
        this.error = true
        this.loading = false;
        this.scrollToBottom()
        throw error;
      }
      this.loading = false;
      //EventBus.$emit("runTests");
    },
    displayExercises(exercises){
      this.exercises.push(...exercises)
    },
    addExercises(){
      let ex = this.selected.map(s => this.exercises[s])
      console.log(ex)
      ex.forEach(e =>{
        this.addEvaluativeByLessonID2([this.resource.id, e])
      })
      this.dialog = false
      this.resetData()
    },
  }
};
</script>


<style>
.gptMessage{
  background-color: darkgray !important;
  max-width: 85%;
  padding: 2px 4px;
  justify-self: start;
}
.myMessage{
  background-color: rgb(137, 137, 137) !important;
  max-width: 85%;
  padding: 2px 4px;
  justify-self:end;
}
.errorMessage{
  background-color: transparent !important;
  color:red !important;
  border-style: solid;
  border-color: red !important;
  padding: 2px 4px;
  max-width: 90%;
  justify-self: center;
}

.v-list-item::after {
  content: none;
}
</style>