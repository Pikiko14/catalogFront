<template>
  <section class="row">
    <div
      class="col-12 col-md-4"
      v-for="(plan, idx) in plans"
      :key="idx"
      :class="{
        'q-px-lg': idx >= 0 && $q.screen.gt.sm,
        'q-mt-lg': (idx > 0 && $q.screen.lt.md) || (idx > 2 && $q.screen.gt.sm),
      }"
      v-show="plan.name !== 'free_plan'"
    >
      <PlanCard :plan="plan" />
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { defineComponent } from 'vue';
import PlanCard from './planCard.vue';
import { PlanInterface } from 'src/interfaces/subscriptionInterface';

export default defineComponent({
  name: 'PlansProfileTab',
  props: {
    plans: {
      type: Array as () => PlanInterface[],
      defualt: () => {
        return [];
      },
    },
  },
  components: {
    PlanCard,
  },
  setup() {
    // data

    // return data
    return {};
  },
});
</script>
