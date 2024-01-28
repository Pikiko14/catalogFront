<template>
  <q-layout view="lHh LpR fFf" class="admin">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="q-pa-sm" :class="headerClass">
      <q-toolbar>
        <q-btn
          v-if="$q.screen.lt.xl"
          flat
          round
          dense
          icon="menu"
          color="secondary"
          @click="leftDrawer = !leftDrawer"
        />
        <q-toolbar-title class="text-right text-black weight-600 font-12">
          <span>
            <q-avatar color="secondary">
              <q-icon size="18pt" name="person" color="white"></q-icon>
            </q-avatar>
          </span>
          <span class="q-ml-md"> {{ $t('welcome') }}, </span>
          <span class="q-ml-xs">
            {{ user.name.split(' ').shift() }}
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      v-model="leftDrawer"
      side="left"
      fit
      :mini="miniState"
      :width="200"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="full-height bg-secondary">
        <!-- Content here -->
        <ListAdmin />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ListAdmin from 'src/components/layout/listAdmin.vue';
import { useAuthStore } from 'src/stores/auth';

export default defineComponent({
  name: 'DashbordLayout',
  components: {
    ListAdmin,
  },
  setup() {
    // data
    const leftDrawer = ref(true);
    const miniState = ref<boolean>(false);
    const authStore = useAuthStore();
    const headerClass = ref('bg-white');

    // computed
    const user = computed(() => {
      return authStore.user;
    });

    // methods

    // hook

    return {
      leftDrawer,
      miniState,
      user,
      headerClass,
    };
  },
});
</script>
