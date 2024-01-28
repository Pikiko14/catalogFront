<template>
  <q-card class="statisticsCard shadow-0">
    <q-card-section>
      <DonoughtChart :title="title" :chartData="chartData" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DonoughtChart from 'src/components/chart/donought.vue';

export default defineComponent({
  name: 'CardStatistiscsMain',
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
    DonoughtChart,
  },
  setup() {
    return {};
  },
});
</script>
