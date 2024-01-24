<template>
  <q-page class="q-px-lg">
    <ProfileMain />
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent, onBeforeMount } from 'vue';
import ProfileMain from '../../../components/dashboard/profile/profile.vue';

export default defineComponent({
  name: 'ProfilePageMain',
  components: {
    ProfileMain,
  },
  setup() {
    const metaData = {
      // sets document title
      title: 'Dashboard / Profile',
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: (title: string) => `${title} - Smart Catalog`,

      // meta tags
      meta: {
        description: {
          name: 'description',
          content: 'Pagina para el administración del perfil en smart catalog',
        },
        keywords: {
          name: 'keywords',
          content:
            'Catalogo, digital, Catalogo digital, catalogo inteligente, inteligente, dashboard, administracion, usuarios, perfil, usuario, perfil de usuario',
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
