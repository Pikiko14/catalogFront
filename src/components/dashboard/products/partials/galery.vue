<template>
  <section class="galery">
    <article v-for="(media, idx) in product.medias" :key="idx">
      <q-img
        :src="
          !media.path.includes('s3.us-east-2')
            ? `${apiUrl}/${media.path}`
            : media.path
        "
        alt="Galery image"
      >
        <div class="overflow" @click="setDefaultImg(media)">
          <q-icon name="favorite" size="14pt" color="secondary"></q-icon>
        </div>
      </q-img>
    </article>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { notification } from 'src/boot/notification';
import { MediaProductInterface } from 'src/interfaces/product';
import { useProductsStore } from 'src/stores/products';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'GaleryComponent',
  components: {},
  setup(props, { emit }) {
    // data
    const store = useProductsStore();
    const apiUrl = process.env.API_URL;

    // rules

    // computed
    const product = computed(() => {
      return store.product;
    });

    // methods
    const setDefaultImg = async (media: MediaProductInterface) => {
      try {
        const response = await store.setDefaultImage(media, product.value._id);
        if (response?.success) {
          notification('positive', response.message, 'primary');
          emit('close-modal');
        }
      } catch (error) {}
    };

    // life cycle

    // return data
    return {
      apiUrl,
      product,
      setDefaultImg,
    };
  },
});
</script>
