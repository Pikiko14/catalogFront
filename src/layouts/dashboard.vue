<template>
  <q-layout view="lHh LpR fFf" class="admin">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="q-pa-lg" :class="headerClass">
      <q-toolbar>
        <q-btn
          v-if="$q.screen.lt.lg"
          flat
          round
          dense
          icon="menu"
          color="primary"
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
      :width="120"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm bg-info">
        <!-- Content here -->
        <ListAdmin />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue';
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
    const headerClass = ref('bg-transparent');
    const scrollPosition = ref();

    // computed
    const user = computed(() => {
      return authStore.user;
    });

    // methods
    const handleScroll = () => {
      scrollPosition.value = window.scrollY;
      // Cambiar el color del encabezado al hacer scroll
      if (scrollPosition.value > 20) {
        headerClass.value = 'bg-header';
      } else {
        headerClass.value = 'bg-transparent';
      }
    };

    // hook
    onBeforeMount(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      leftDrawer,
      miniState,
      user,
      headerClass,
    };
  },
});
</script>
