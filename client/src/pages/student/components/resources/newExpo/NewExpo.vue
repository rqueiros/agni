<template>
    <div id="newExpo">
        <v-card class="mx-auto" max-width="100%" outlined
            style="display: flex; justify-content: center; align-items: center;">
            <v-row style="margin:0;height:15rem; display: flex; justify-content: center; align-items: center; padding:1em" >
                <v-col cols="6">
                    <v-file-input class="course_smallText course_button" label="File input" v-model="file" prepend-icon="" outlined></v-file-input>
                </v-col>
                <v-col cols="6">
                    <v-btn class="course_smallText course_button" outlined >Select Expositive</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>
  
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
    name: "Expositives",
    components: {},
    props: {
        resource: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            expositives: [],
            index: 0,
            expo: {},
            file: []
        };
    },
    computed: {
        ...mapGetters(["getResourceById", "getProgressFromResourceId"]),
    },
    watch: {
        file: function (newFile, oldFile) {
            if (newFile !== oldFile) {
                if (newFile != [] && newFile != undefined) {
                    this.changeExpositiveTypeById([this.resource.strapiId, newFile])
                }
            }
        },
    },

    created() {

    },

    methods: {
        ...mapMutations([
            "changeExpositiveTypeById",
        ]),
    }
}
</script>
  
<style scoped>
#newExpo>>>.v-text-field--outlined .v-label{
    top:auto !important;
}

#newExpo>>>.v-text-field--outlined > .v-input__control > .v-input__slot{
    min-height: 0 !important;
}
</style>
  