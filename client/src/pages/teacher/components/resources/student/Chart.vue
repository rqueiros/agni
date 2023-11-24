<template>
  <div>
    <apexchart type="bar" height="300" :options="chartOptions" :series="series"/>
  </div>
</template>

<script>

export default {
  name: "Graph",

  components: {},

  props: {
    data: {
      type: Array,
      default: () => []
    },
    horizontal: {
      type: Boolean,
      default: () => true
    },
    title:{
      type: String,
      default: () => ""
    }
  },
  
  data() {
    return {
      series: [{
        data: []
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
            barHeight: "95%",
          }
        },
        colors: [],
        xaxis: {
          categories: [],
        },
        title: {
          text: '',
          align: 'center',
          floating: true
        },
        yaxis: {
          max: 100,
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          },

        },
      },
    }
  },

  created(){
    if (this.data.length > 0){
      this.chartOptions = { ...this.chartOptions, 
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: this.horizontal,
            barHeight: "95%",
          }
        },
        title: {
          text: this.title,
          align: 'center',
          floating: true
        },
        xaxis: { categories: this.data.map(s => s[0]) }, 
        colors: this.data.map(s => this.getColor2(s[1])) 
      };
      this.series = [{ data: this.data.map(s => s[1]) }];
      this.$forceUpdate()
    }
  },

  methods:{
    getColor2(num){
      if (num > 80) {
        return "#008000";
      } else if (num > 50) {
        return "#F7BD03";
      } else {
        return "#FF0000";
      }
    },
  }

}

</script>