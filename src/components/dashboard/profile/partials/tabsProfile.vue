<template>
  <q-card class="round-10 shadow-0 tab-card q-mb-lg">
    <q-card-section>
      <q-tabs
        v-model="tab"
        inline-label
        outside-arrows
        class="text-capitalize text-primary"
      >
        <q-tab
          name="subscriptions"
          class="font-12"
          icon="card_membership"
          :label="$t('subscription')"
        />
      </q-tabs>
    </q-card-section>
    <q-card-section>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="subscriptions">
          <PlansTabs :plans="plans" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PlansTabs from './plans.vue';
import { PlanInterface } from 'src/interfaces/subscriptionInterface';

export default defineComponent({
  name: 'TabsProfile',
  props: {
    plans: {
      type: Array as () => PlanInterface[],
      defualt: () => {
        return [];
      },
    },
  },
  components: {
    PlansTabs,
  },
  setup() {
    // data
    const splitterModel = ref(20);
    const tab = ref<string>('subscriptions');

    // return data
    return {
      tab,
      splitterModel,
    };
  },
});
</script>
