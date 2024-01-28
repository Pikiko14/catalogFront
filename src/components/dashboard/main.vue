<template>
  <section class="row">
    <div class="col-12 q-pb-lg">
      <span>
        <q-avatar size="20pt" style="margin-top: -3px" color="secondary">
          <q-icon name="img:images/statisticsCircle.svg"></q-icon>
        </q-avatar>
      </span>
      <span class="font-14 weight-600 q-pl-md">
        {{ $t('statistics') }}
      </span>
    </div>
    <div
      class="col-12 col-sd-6 col-md-4"
      :class="{ 'q-pr-md': $q.screen.gt.sm }"
    >
      <CtatisticsCard
        :title="$t('mostAddedToCart')"
        :chartData="moreAddToCarts"
      />
    </div>
    <div
      class="col-12 col-sd-6 col-md-4"
      :class="{ 'q-px-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
    >
      <CtatisticsCard :title="$t('mostSells')" :chartData="moreSells" />
    </div>
    <div
      class="col-12 col-sd-6 col-md-4"
      :class="{ 'q-pl-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
    >
      <CtatisticsCard :title="$t('cityMoreVisit')" :chartData="cityMoreVisit" />
    </div>
    <div class="col-12 q-mt-xl q-pb-lg">
      <span>
        <q-avatar size="20pt" style="margin-top: -3px" color="secondary">
          <q-icon name="img:images/statisticsCircle.svg"></q-icon>
        </q-avatar>
      </span>
      <span class="font-14 weight-600 q-pl-md">
        {{ $t('map') }}
      </span>
    </div>
    <div class="col-12">
      <visitMapVue />
    </div>
  </section>
</template>

<script lang="ts">
import visitMapVue from './main/visitMap.vue';
import CtatisticsCard from './main/statisticsCard.vue';
import { useDashboardStore } from 'src/stores/dashbord';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';

export default defineComponent({
  name: 'MainComponentBody',
  components: {
    CtatisticsCard,
    visitMapVue,
  },
  setup() {
    // data
    const store = useDashboardStore();
    const colors = ['#fba124', '#000000'];

    const moreAddToCarts = ref({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: colors,
        },
      ],
    });

    const moreSells = ref({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: colors,
        },
      ],
    });

    const dataCityMoreVisit = ref([]);
    const cityMoreVisit = computed(() => ({
      labels: [],
      datasets: [
        {
          data: dataCityMoreVisit.value,
          backgroundColor: ['#000000', '#fba124'],
        },
      ],
    }));

    // methods
    const listMetricsData = async () => {
      try {
        const response = await store.listMetricsData();
        if (response?.success) {
          const { moreSellers, moreAddToCart } = response.data;
          // set more add to cars data
          moreAddToCarts.value.labels = moreAddToCart.labels;
          moreAddToCarts.value.datasets[0].data = moreAddToCart.data;
          // set more sellers
          moreSells.value.labels = moreSellers.labels;
          moreSells.value.datasets[0].data = moreSellers.data;
        }
      } catch (error) {}
    };

    // hook
    onBeforeMount(async () => {
      await listMetricsData();
    });

    // return statement
    return {
      moreSells,
      moreAddToCarts,
      cityMoreVisit,
    };
  },
});
</script>
