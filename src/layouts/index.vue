<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary" v-if="route.path == '/'">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" />

        <q-toolbar-title> Aca ira el catalogo </q-toolbar-title>

        <div>
          <q-btn icon="login" flat dense round></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="route.path == '/'" v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Mi Menu</q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'IndexLayout',
  components: {},
  setup() {
    // data
    const leftDrawerOpen = ref(false);
    const route = useRoute();

    return {
      leftDrawerOpen,
      route,
    };
  },
});
</script>
