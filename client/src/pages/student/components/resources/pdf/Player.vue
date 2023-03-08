<template>
  <div id="player">
    <pdf
      ref="pdfComponent"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
      :src="'https://agni.dcc.fc.up.pt/strapi/'+resource.file.data.attributes.url"
      :page="page"
    ></pdf>
    <v-rating
      v-model="rating"
      background-color="orange lighten-3"
      color="orange"
    ></v-rating>

    <div class="text-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="8">
            <v-container class="max-width">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-card-actions>
      <v-btn color="success" class="mb-2" @click="print">
        PRINT
        <v-icon right dark>
          mdi-printer
        </v-icon>
      </v-btn>
      <v-btn color="error" class="mb-2" @click="printAll">
        PRINT ALL<v-icon right dark>
          mdi-printer-settings
        </v-icon>
      </v-btn>
      <!-- <v-btn color="primary" dark class="mb-2" @click="copyText">
        GET LINKS<v-icon right dark>
          mdi-content-copy
        </v-icon>
      </v-btn> -->
    </v-card-actions>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default {
  name: "Player",
  components: {
    pdf
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
      pageCount: 0
    };
  },
  methods: {
    currentPage(page) {
      this.page = page;
    },
    pageUrl(page) {
      this.page = page;
    },
    getCurrentPage: () => this.page,

    print() {
      this.$refs.pdfComponent.print(100, [this.currentPage]);
    },
    printAll() {
      const pages = [];
      for (let i = 1; i <= this.pageCount; i++) {
        pages.push(i);
      }
      this.$refs.pdfComponent.print(100, [...pages]);
    },
    copyText() {
      let links = [];

      // Get the links
      const currentPage = this.page;
      this.$refs.pdfComponent.pdf.forEachPage(function(page) {
        return page.getTextContent().then(function(content) {
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
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                //this.code = this.resource.code;
              }
            });
          }
        });
      });
    }
  }
};
</script>

<style></style>
