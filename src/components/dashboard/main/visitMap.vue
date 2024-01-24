<template>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d28268.827868355467!2d-75.59521234211681!3d6.2194746525379685!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1697056439367!5m2!1ses!2sco"
    width="100%"
    height="700"
    style="border: 0"
    allowfullscreen
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VisitMapMain',
  components: {},
  setup() {
    return {};
  },
});
</script>
