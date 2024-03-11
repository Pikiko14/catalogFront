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
    <div class="col-12 q-pb-lg">
      <visitMapVue :visits="visitsData" />
    </div>
    <PlanCard class="hidden" v-if="plan && plan.name" :plan="plan" />
  </section>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import visitMapVue from './main/visitMap.vue';
import CtatisticsCard from './main/statisticsCard.vue';
import { useDashboardStore } from 'src/stores/dashbord';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useSubscriptionStore } from 'src/stores/subscription';
import { PlanInterface } from 'src/interfaces/subscriptionInterface';
import PlanCard from 'src/components/dashboard/profile/partials/planCard.vue';

export default defineComponent({
  name: 'MainComponentBody',
  components: {
    CtatisticsCard,
    visitMapVue,
    PlanCard,
  },
  setup() {
    // data
    const route = useRoute();
    const plan = ref<any>({});
    const store = useDashboardStore();
    const colors = ['#fba124', '#000000'];
    const storeSubscription = useSubscriptionStore();

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

    const cityMoreVisit = ref({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: colors,
        },
      ],
    });

    const visitsData = ref([]);

    // methods
    const listMetricsData = async () => {
      try {
        const response = await store.listMetricsData();
        if (response?.success) {
          const { moreSellers, moreAddToCart, visitByCity, visits } =
            response.data;
          // set more add to cars data
          moreAddToCarts.value.labels = moreAddToCart.labels;
          moreAddToCarts.value.datasets[0].data = moreAddToCart.data;
          // set more sellers
          moreSells.value.labels = moreSellers.labels;
          moreSells.value.datasets[0].data = moreSellers.data;
          // set cities visit
          cityMoreVisit.value.labels = visitByCity.labels;
          cityMoreVisit.value.datasets[0].data = visitByCity.data;
          // set visit localities
          visitsData.value = visits;
        }
      } catch (error) {}
    };

    /**
     * list plans
     */
    const listPlans = async (planName: string) => {
      try {
        const { data } = (await storeSubscription.listPlans()) as any;
        const planFilter = data.find(
          (item: PlanInterface) => item.name === planName
        );
        if (planFilter) {
          plan.value = planFilter;
          setTimeout(() => {
            const btn = document.getElementById('planPaymentButton');
            if (btn) {
              btn.click();
            }
          }, 1500);
          return true;
        }
        window.close();
      } catch (error) {}
    };

    // hook
    onBeforeMount(async () => {
      await listMetricsData();
      if (route.query.plan) {
        await listPlans(route.query.plan as string);
      }
    });

    // return statement
    return {
      plan,
      moreSells,
      visitsData,
      cityMoreVisit,
      moreAddToCarts,
    };
  },
});
</script>
