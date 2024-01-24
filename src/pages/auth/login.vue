<template>
  <q-page class="row items-center justify-evenly" :class="bgColor">
    <LoginComponent />
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent, onBeforeMount, ref } from 'vue';
import LoginComponent from 'src/components/auth/login.vue';

export default defineComponent({
  name: 'LoginPage',
  components: {
    LoginComponent,
  },
  setup() {
    // data
    const bgColor = ref('bg-white-4');
    const metaData = {
      // sets document title
      title: 'Iniciar sesión',
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: (title: string) => `${title} - Smart Catalog`,

      // meta tags
      meta: {
        description: {
          name: 'description',
          content: 'Pagina para el inicio de sesión en el smart catalog',
        },
        keywords: {
          name: 'keywords',
          content:
            'Catalogo, digital, Catalogo digital, catalogo inteligente, inteligente',
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

    return {
      bgColor,
    };
  },
});
</script>
