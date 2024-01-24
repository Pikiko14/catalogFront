<template>
  <q-page class="q-px-lg">
    <MainPages />
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent, onBeforeMount } from 'vue';
import MainPages from 'src/components/dashboard/pages/main.vue';

export default defineComponent({
  name: 'UsersPageMain',
  components: {
    MainPages,
  },
  setup() {
    const metaData = {
      // sets document title
      title: 'Dashboard / Paginas catalogo',
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: (title: string) => `${title} - Smart Catalog`,

      // meta tags
      meta: {
        description: {
          name: 'description',
          content:
            'Pagina para el administración de paginas de un catalogo en smart catalog',
        },
        keywords: {
          name: 'keywords',
          content:
            'Catalogo, digital, Catalogo digital, catalogo inteligente, inteligente, dashboard, administracion, usuarios, paginas, catalogos',
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
