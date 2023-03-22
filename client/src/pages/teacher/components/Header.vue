<template>
    <v-card class="mx-auto mb-2" max-width="100%" outlined v-if="header != ''">
        <div id="header">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="header_title">
                        {{ getTitle }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="header_description">
                        {{ getDescription }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </div>
    </v-card>
</template>
  
<script>
console.log("here2")
export default {
    name: "Header",
    props: {
        header: {
            type: String,
            default: () => null
        }
    },
    computed: {
        getTitle() {
            if (this.header == "class") {
                return "Class Managing"
            } else if (this.header == "content") {
                return "Content Managing"
            } else if (this.header == "main") {
                return "Welcome to the Agni Teacher side"
            } else if (this.header == "settings") {
                return "Settings"
            } else if (this.header == "account") {
                return "Account"
            } else {
                return ""
            }
        },
        getDescription() {
            if (this.header == "class") {
                return "Here you can create and manage the occurrences of your classes"
            } else if (this.header == "content") {
                return "Here you can create and manage a course, expositives (pdf,.. content), evaluative (progEx, Quiz) and questions"
            } else if (this.header == "main") {
                return "Here can teachers manage classes and courses for their students"
            } else {
                return ""
            }
        }
    },
};
</script>
  
<style>
#header {
    text-align: center;
}
.header_title {
    font-size: 1.5em;
}
</style>