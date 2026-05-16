<template>
  <v-card
    class="mx-auto d-flex flex-column"
    :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    outlined
  >
    <CardHeader
      title="CONCEPT GRAPH"
      subtitle="Generated course concepts!"
      icon="mdi-sitemap"
      color="blue"
    />

    <div class="graph-toolbar d-flex align-center justify-end px-4 pt-2">
       <v-btn
         small
         color="primary"
         class="ml-2"
         @click="openConceptDialog"
       >
        Edit Concepts
       </v-btn>
       <v-btn
        style="margin-left: 8px"
        small
        color="error"
        @click="deleteGraph"
      >
        Delete graph
      </v-btn>
      <v-btn
        style="margin-left: 8px"
        small
        color="success"
        @click="saveGraph"
      >
        Save Edges
      </v-btn>
    </div>

    <v-card-text v-if="graph" class="graph-wrapper">
      <div class="graph-container" ref="graph"></div>
    </v-card-text>

    <div v-if="!graph" class="grey--text text--darken-1 text-caption" style="padding: 8px">
      No concept graph to show.
    </div>

    <SelectConceptDialog
      v-model="conceptDialog"
      :concepts="allConcepts"
      :selected="existingConcepts"
      @save="syncConceptNodes"
      :target="'graph'"
    />
  </v-card>   
</template>

<script>
import { Network, DataSet } from "vis-network/standalone"
import SelectConceptDialog from "@/components/gerneral/SelectConceptDialog.vue";
import CardHeader from "../../CardHeader.vue";
import { mapGetters, mapActions } from "vuex";
import { bus } from "@/main.js";


export default {
  name: "ConceptGraph",

  props: {
    graph: {
      type: Object,
      default: () => ({ nodes: [], edges: [] })
    },
    courseID: {
      type: Number,
      required: true,
    }
  },
  components: {
    CardHeader,
    SelectConceptDialog
  },


  data() {
    return {
      conceptDialog: false,
      allConcepts: [],
      existingConcepts: [],
    }
  },

  created() {
    this.network = null
    this.nodes = null
    this.edges = null
  },

  mounted() {
    this.$nextTick(() => {
      this.initGraph()
    })
  },

  watch: {
    graph: {
      deep: true,
      handler(newGraph) {
        if (this.network && newGraph) {
          this.updateGraph(newGraph)
        }
      }
    }
  },

  computed: {
    ...mapGetters("style", ["getMesssage"]),
  },

  methods: {
    ...mapActions("request", ["updateGraphRequest", "deleteGraphRequest", "fetchPrepareCollectionType", "fetchCourseMaterialConcepts"]),

    async openConceptDialog() {
      try {
        const response = await this.fetchCourseMaterialConcepts(this.courseID);
        const materialConcepts = response.concepts || [];

        const graphNodes = this.nodes.get();
        const graphIds = graphNodes.map(n => n.id);

        const materialIds = materialConcepts.map(c => c.id);

        const missingConcepts = graphNodes
          .filter(n => !materialIds.includes(n.id))
          .map(n => ({
            id: n.id,
            label: n.label,
            noMaterial: true
          }));

        const enrichedMaterialConcepts = materialConcepts.map(c => ({
          ...c,
          noMaterial: false
        }));

        this.allConcepts = [
          ...enrichedMaterialConcepts,
          ...missingConcepts
        ];

        this.existingConcepts = graphIds;

        this.conceptDialog = true;

      } catch {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }
    },

    async syncConceptNodes(selectedIds) {
      if (!this.nodes || !this.edges) return

      const currentNodes = this.nodes.get()
      const currentIds = currentNodes.map(n => n.id)

      const nodesToAdd = this.allConcepts
        .filter(c => selectedIds.includes(c.id))
        .filter(c => !currentIds.includes(c.id))
        .map(c => ({
          id: c.id,
          label: c.label
        }))

      const nodesToRemove = currentIds.filter(
        id => !selectedIds.includes(id)
      )

      if (nodesToRemove.length) {
        this.nodes.remove(nodesToRemove)
      }

      if (nodesToAdd.length) {
        this.nodes.add(nodesToAdd)
      }

      this.saveGraph();

      this.network.fit({
        animation: { duration: 300 }
      })
    },

    initGraph() {
      const container = this.$refs.graph
      if (!container) return

      this.nodes = new DataSet([])
      this.edges = new DataSet([])

      const options = {
        manipulation: {
          enabled: true,

          addEdge: (data, callback) => {
            if (data.from === data.to) return
            callback(data)
          },

          deleteEdge: true,
          addNode: false,
          deleteNode: false
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: "LR",
            levelSeparation: 240,
            nodeSpacing: 80,   
            treeSpacing: 100,
            sortMethod: "directed" 
          }
        },
        physics: false, 
        interaction: {
          zoomView: true,
          dragView: true,
          hover: true
        },
        nodes: {
          shape: "box",
          margin: 10,
          color: {
            background: "#0F52BA",
            border: "#38bdf8",
            highlight: {
              background: "#1F63CB",
              border: "#7dd3fc"
            },
            hover: {
              background: "#1F63CB",
              border: "#7dd3fc"
            }
          },
          font: { color: "#e5e7eb" }
        },
        edges: {
          arrows: { to: true },
          smooth: { type: "cubicBezier" }, 
          color: "#94a3b8"
        }
      }

   
      this.network = new Network(
        container,
        { nodes: this.nodes, edges: this.edges },
        options
      )

      this.network.on("zoom", params => {
        const scale = params.scale
        const MIN = 0.3
        const MAX = 1.5

        if (scale < MIN) this.network.moveTo({ scale: MIN })
        if (scale > MAX) this.network.moveTo({ scale: MAX })
      })

      if (this.graph) {
        this.updateGraph(this.graph)
      }
    },

    updateGraph(graph) {
      if (!graph || !this.nodes || !this.edges) return

     
      const nodeData = (graph.nodes || []).map(n => ({
        id: n.id,
        label: n.label
      }))

      const edgeData = (graph.edges || []).map(e => ({
        from: e.from,
        to: e.to
      }))

      this.nodes.clear()
      this.edges.clear()
      
      this.nodes.add(nodeData)
      this.edges.add(edgeData)

      this.network.fit({ 
        animation: { duration: 300 } 
      })
    },

    async saveGraph() {
      const currentEdges = this.edges.get().map(edge => ({
        from: edge.from,
        to: edge.to
      }));

      const currentNodes = this.nodes.get();

      try {
        await this.updateGraphRequest([this.courseID, currentEdges, currentNodes]);
        bus.$emit(
          "successSnackbar",
          this.getMesssage(["general", "save", "success"])
        );
      } catch (err) {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }   
    },

    async deleteGraph() {
      try {
        await this.deleteGraphRequest(this.courseID);
        await this.fetchPrepareCollectionType([this.courseID, "courses"]);
        bus.$emit(
          "successSnackbar",
          this.getMesssage(["general", "save", "success"])
        );
      } catch (err) {
        bus.$emit(
          "errorSnackbar",
          this.getMesssage(["general", "course", "error"])
        );
      }
    },
  },

  beforeDestroy() {
    if (this.network) {
      this.network.destroy()
      this.network = null
    }
  }
}
</script>

<style scoped>
.graph-wrapper {
  padding: 0;
  height: calc(100vh - 380px); 
}

.graph-container {
  width: 100%;
  height: 100%;
}
</style>