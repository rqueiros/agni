
<template>
  <v-app id="questionnaire">
    <v-dialog v-model="dialog" persistent max-width="750px" min-width="360px">
      <v-sheet class="text-center text-h4 py-4" color="pink accent-4" dark>
        Assisted Exercise Generation Experiment
      </v-sheet>

      <v-sheet class="px-7 py-5">
        <v-sheet class="pa-1 px-2 mb-1" color="grey lighten-3">
          First and foremost, thank you very much for participating!!
          <v-icon
            class="ml-1"
            color="yellow accent-4" 
            style="background-color: black; border-radius: 20px;"
          >
            mdi-emoticon-happy
          </v-icon>
        </v-sheet>
        <v-sheet class="pa-1 px-2 mb-1" color="grey lighten-3">
          A Questionnaire is being created and will take ~20 sec. When ready, a button will appear that redirects you to the questionnaire.
        </v-sheet>
        <v-sheet class="pa-1 px-2 mb-1" color="grey lighten-3">
          In the Questionnaire, you will need to:
          <ol>
            <li>Answer general questions about sex, experience, etc.</li>
            <li>Watch a video introducing Agni, a Web-based Playground for learning JS.</li>
            <li>Create programming exercises in Agni using two different methods and record the time needed for each.</li>
            <li>Answer some final questions.</li>
          </ol>
        </v-sheet>
        <v-sheet class="pa-1 px-2 mb-2" color="grey lighten-3">
          It should take you about 10-15 min.
        </v-sheet>
        <iframe 
          scrolling="no"
          src="https://script.google.com/macros/s/AKfycbzLDMp5vTHi5kATjBc53uo3Fp1HthhaDmYaaLz7Ur19L0v2kkKXw8NjWtaGMJ5Q0xrm8w/exec"
          frameborder="0" width="100%" height="50px"></iframe>
        <div class="text-caption px-2">
          (Any questions or problems contact 
          <a href="mailto:yannikbauer.1@gmail.com">yannikbauer.1@gmail.com</a>)
        </div>
      </v-sheet>
    </v-dialog>
  </v-app>
</template>


<script>
export default {
  name: "Questionnaire",

  data() {
    return {
      dialog:true
    }
  },

}
</script>


<style>
</style>