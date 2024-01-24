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
      <CtatisticsCard />
    </div>
    <div
      class="col-12 col-sd-6 col-md-4"
      :class="{ 'q-px-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
    >
      <CtatisticsCard />
    </div>
    <div
      class="col-12 col-sd-6 col-md-4"
      :class="{ 'q-pl-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
    >
      <CtatisticsCard />
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
import { defineComponent } from 'vue';
import CtatisticsCard from './main/statisticsCard.vue';
import visitMapVue from './main/visitMap.vue';

export default defineComponent({
  name: 'MainComponentBody',
  components: {
    CtatisticsCard,
    visitMapVue,
  },
  setup() {
    return {};
  },
});
</script>
