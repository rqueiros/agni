<template>
  <v-container fluid>
      <div>
    <v-toolbar
      dark
      prominent
      src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>learnJS (beta stage)</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
    <v-row justify="center">
      <v-subheader>-</v-subheader>

      <v-expansion-panels popout>
        <v-expansion-panel
          v-for="(message, i) in messages"
          :key="i"
          hide-actions
        >
          <v-expansion-panel-header>
            <v-row
              align="center"
              class="spacer"
              no-gutters
            >
              <v-col
                cols="4"
                sm="2"
                md="1"
              >
                <v-avatar
                  size="36px"
                >
                  <img
                    v-if="message.avatar"
                    alt="Avatar"
                    src="https://coverimages.igi-global.com/affiliates/9e365295-9c49-4f01-9597-68e954461c94.png"
                  >
                  <v-icon
                    v-else
                    :color="message.color"
                    v-text="message.icon"
                  ></v-icon>
                </v-avatar>
              </v-col>

              <v-col
                class="hidden-xs-only"
                sm="5"
                md="3"
              >
                <strong v-html="message.name"></strong>
                <span
                  v-if="message.total"
                  class="grey--text"
                >
                  &nbsp;({{ message.total }})
                </span>
              </v-col>

              <v-col
                class="text-no-wrap"
                cols="5"
                sm="3"
              >
                <v-chip
                  v-if="message.new"
                  :color="`${message.color} lighten-4`"
                  class="ml-0 mr-2 black--text"
                  label
                  small
                >
                  {{ message.new }} new
                </v-chip>
                <strong v-html="message.title"></strong>
              </v-col>

              <v-col
                v-if="message.excerpt"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                &mdash;
                {{ message.excerpt }}
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text v-html="message.lorem"></v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      messages: [
        {
          avatar: 'https://coverimages.igi-global.com/affiliates/9e365295-9c49-4f01-9597-68e954461c94.png',
          name: 'Ricardo Queirós',
          title: 'Welcome to learnJS!',
          excerpt: 'Thank you for joining our community!',
          lorem: `<kbd>learnJS</kbd> ia a new kid on the code playgrounds'   block!<br><br> 
          For now, the distinghished facets boils down to its simplicity, the focus (in one language) and the processing side (almost in the client), turning the tool 
          more faster than others.<br><br>
          Please use learnJS and submit your opinion to this <a href="https://forms.gle/Vpkt1w7S5s2yrgw88">form</a> with issues 
          and suggestions to improve the playground usefulness and consistence.`
        },
        {
          color: 'red',
          icon: 'mdi-alert',
          name: 'Issues',
          total: 1,
          lorem: `
            1. The left menu sometimes only show the resource at second time 
          `
        },
        {
          color: 'teal',
          icon: 'mdi-lightbulb-on',
          name: 'Nice to have',
          total: 10,
          lorem: `
            1. Real videos of JS (I need time to that) :)<br>
            2. Tests creation<br>
            3. Questions management<br>
            4. LMS integration<br>
            5. Gamification (e.g. achievements & badges & points & leaderboards)<br>
            6. Blocks per sheet and level<br>
            7. New types of exercises (e.g. competetion)<br>
            8. Profile view<br>
            9. Authentication<br>
            10. All the back-end and respetive back-office (need someone for that)
            `
        },
      ],
      lorem: 'bla bla.',
    }),
  }
</script>
