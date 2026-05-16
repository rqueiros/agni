<template>
  <div id="player">
    <div>
      <v-badge
        tile
        class="badge"
        v-if="isAuthor"
        overlap
        color="button"
        @click.native="deletePDF"
        icon="mdi-close"
      >
      </v-badge>
      <v-badge
        tile
        class="badge"
        v-if="isStudent"
        overlap
        color="button"
        @click.native="printAll"
        icon="mdi-printer"
      >
      </v-badge>
      <vue-pdf-embed
        style="width: 100%;"
        ref="pdfComponent"
        @loaded="pageCount = $event.numPages"
        :source="pdfData"
        :page="page"
      />
    </div>

    <!--
    <v-rating
      v-model="rating"
      background-color="orange lighten-3"
      color="orange"
    ></v-rating>-->

    <div
      class="text-center pa-1"
      :style="{ backgroundColor: $vuetify.theme.currentTheme.studentboxes }"
    >
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="5"
        color="error"
      />
    </div>
  </div>
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed';
//import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { mapGetters, mapActions } from "vuex";


export default {
  components: {
    VuePdfEmbed,
  },

  props: {
    resource: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      rating: 0,
      page: 1,
      pageCount: 0,
      pdfData: null
    };
  },

  created() {
    const file = this.resource.file;
    if ("data" in file) {
      this.pdfData = this.getDomain + this.resource.file.data.attributes.url;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        this.pdfData = uint8Array;
      };
      reader.readAsArrayBuffer(file);
    }
  },

  computed: {
    ...mapGetters("request", [
      "getDomain",
      "isAuthor",
      "isStudent",
      "isTeacher",
      "isViewer"
    ]),
  },

  methods: {
    ...mapActions("main", ["setExpositiveField"]),
    getCurrentPage: () => this.page,
    pageUrl(page) {
      this.page = page;
    },
    currentPage(page) {
      this.page = page;
    },
    printAll() {
      const pages = [];
      for (let i = 1; i <= this.pageCount; i++) {
        pages.push(i);
      }
      this.$refs.pdfComponent.print(100, [...pages]);
    },
    deletePDF() {
      this.setExpositiveField([this.resource.id, "file", { data: null }]);
      this.setExpositiveField([this.resource.id, "type", null]);
    }
    /*
    copyText() {
      let links = [];

      // Get the links
      const currentPage = this.page;
      this.$refs.pdfComponent.pdf.forEachPage(function (page) {
        return page.getTextContent().then(function (content) {
          if (page.pageNumber == currentPage) {
            links = content.items.filter(item => item.str.startsWith("http"));
            let text = "";
            for (const link of links) {
              text += `<p><a href='${link.str}' target='_blank'>${link.str}</a></p>`;
            }
            console.log(links);
            //Show alert
            Swal.fire({
              title: "<strong>GET LINKS</strong>",
              icon: "success",
              html: `<p style='text-align:left'>${text}</p>`,
              showCancelButton: false,
              focusConfirm: false,
              confirmButtonText: "OK",
              cancelButtonText: "CANCEL"
            }).then(result => {
              // Read more about isConfirmed, isDenied below 
              if (result.isConfirmed) {
                //this.code = this.resource.code;
              }
            });
          }
        });
      });
    },*/
  }
};
</script>

<style scoped>
/* Make links from pdf disappear */
::v-deep section {
  display: none;
}

/* Badge styles */
.badge:hover {
  cursor: pointer;
}
.badge {
  z-index: 5;
  position: absolute;
  top: 12px;
  right: 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
#player >>> .v-badge--tile .v-badge__badge {
  border-radius: 4px;
  color: black;
}
#player >>> .v-badge__badge .v-icon {
  font-size: 16px;
}
</style>
