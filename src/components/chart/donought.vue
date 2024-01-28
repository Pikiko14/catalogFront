<template>
  <div id="app">
    <BarChart v-bind="barChartProps" :options="options" />
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { BarChart, useBarChart } from 'vue-chart-3';
import { ref, defineComponent } from 'vue';

Chart.register(...registerables);

export default defineComponent({
  name: 'App',
  props: {
    title: {
      type: String,
      default: () => '',
    },
    chartData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    BarChart,
  },
  setup(props) {
    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          position: 'none',
        },
        title: {
          display: true,
          text: props.title,
        },
      },
    });

    const { barChartProps, barChartRef } = useBarChart({
      chartData: props.chartData,
    });

    return {
      options,
      barChartProps,
      barChartRef,
    };
  },
});
</script>

<style>
#app {
  width: 100%;
  height: 200px;
}

#app div {
  height: 250px;
}
</style>
