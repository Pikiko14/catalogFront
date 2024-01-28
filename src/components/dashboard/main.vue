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
        :chartData="moreAddToCart"
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
import { computed, defineComponent, ref } from 'vue';
import CtatisticsCard from './main/statisticsCard.vue';
import visitMapVue from './main/visitMap.vue';

export default defineComponent({
  name: 'MainComponentBody',
  components: {
    CtatisticsCard,
    visitMapVue,
  },
  setup() {
    const dataMoreAddToCart = ref([]);
    const moreAddToCart = computed(() => ({
      labels: [],
      datasets: [
        {
          data: dataMoreAddToCart.value,
          backgroundColor: ['#000000', '#fba124'],
        },
      ],
    }));

    const dataMoreSell = ref([]);
    const moreSells = computed(() => ({
      labels: [],
      datasets: [
        {
          data: dataMoreSell.value,
          backgroundColor: ['#000000', '#fba124'],
        },
      ],
    }));

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

    return {
      moreSells,
      moreAddToCart,
      cityMoreVisit,
    };
  },
});
</script>
