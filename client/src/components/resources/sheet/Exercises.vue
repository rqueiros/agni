<template>
  <div id="exercises">
    <v-data-table :headers="headers" :items="exercises" class="elevation-1 exercise"
    @click:row="play2">
      <template v-slot:item.type="{ item }">
        <v-icon :title="item.subtype">
          {{getIcon(item.subtype)}}
        </v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColor(item.status)" dark>
          {{ item.status }}%
        </v-chip>
      </template>
      <template v-slot:item.action = "{ item }">
        <v-btn icon @click="play(item.rid)">
          <v-icon>mdi-clipboard-play</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { bus } from '@/main.js'
import { mapGetters} from "vuex";
export default {
  name:'Exercises',
  props: {
    resource: Object
  },
  computed: {
    ...mapGetters(["getResourceById", "getProgressFromResourceId"])
  },
  created() {
    let i = 1
    this.resource.exercises.forEach(exerciseId => {
      const resource = this.getResourceById(exerciseId)
      const status = this.getProgressFromResourceId(resource.id)?.status
      this.exercises.push(
        {
          id: i,
          rid: resource.id,
          name: resource.name,
          type: resource.type,
          subtype: resource.subtype,
          status: status==undefined ? 0 : status.toFixed(0),
          action:''
        }
      )
      i++
    }); 
  },
  data() {
    return {
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },        
        { text: "Solving status (%)", value: "status" },
        { text: "Actions", value: "action" },
      ],
      exercises: [],
    };
  },

  methods: {
    play(id) {
       bus.$emit('changeIt', id);
    },
    play2(value) {
      bus.$emit('changeIt', value.rid);
    },
    getIcon(subtype) {
      let icon=''
      switch (subtype) {
        case 'blank':
          icon = 'mdi-text-box-outline'
          break;
      case 'skeleton':
          icon = 'mdi-text-box-plus-outline'
          break;
      case 'buggy':
          icon = 'mdi-bug'
          break;
      case 'quiz':
          icon = 'mdi-head-question-outline'
          break;      
        default:
          icon = 'mdi-code-json'
          break;
      }
      return icon
    },
    getColor(status) {
      status = +status;
      if (status == 0) return "red";
      else if (status < 100) return "orange";
      else return "green";
    },
  },
};
</script>
<style>
.exercise:hover {
  cursor: pointer;
}
</style>
