<template>
  <q-page class="q-px-lg">
    <MainUsers />
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent, onBeforeMount } from 'vue';
import MainUsers from 'src/components/dashboard/users/main.vue';

export default defineComponent({
  name: 'UsersPageMain',
  components: {
    MainUsers,
  },
  setup() {
    const metaData = {
      // sets document title
      title: 'Dashboard / User',
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: (title: string) => `${title} - Smart Catalog`,

      // meta tags
      meta: {
        description: {
          name: 'description',
          content: 'Pagina para el administración de usuarios en smart catalog',
        },
        keywords: {
          name: 'keywords',
          content:
            'Catalogo, digital, Catalogo digital, catalogo inteligente, inteligente, dashboard, administracion, usuarios',
        },
        equiv: {
          'http-equiv': 'Content-Type',
          content: 'text/html; charset=UTF-8',
        },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle: {
          property: 'og:title',
          // optional; similar to titleTemplate, but allows templating with other meta properties
          template(ogTitle: string) {
            return `${ogTitle} - Smart Catalog`;
          },
        },
      },

      // <noscript> tags
      noscript: {
        default: 'This is content for browsers with no JS (or disabled JS)',
      },
    };

    // hooks
    onBeforeMount(() => {
      useMeta(metaData);
    });

    return {};
  },
});
</script>
