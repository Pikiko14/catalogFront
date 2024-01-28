<template>
  <section class="full-width page-simple">
    <article>
      <img
        @load="handleImageLoad"
        :src="`${apiUrl}/${image.path}`"
        alt=""
        id="simplePageImage"
      />
      <q-btn
        round
        size="8pt"
        v-for="(btn, idx) in buttons"
        :key="idx"
        icon="shopping_cart"
        :color="btn.product ? 'secondary' : 'primary'"
        unelevated
        class="custom-button"
        :style="{ left: `${btn.x}px`, top: `${btn.y}px` }"
        @mousedown="startDrag(idx)"
      >
        <q-menu context-menu>
          <q-list>
            <q-item clickable v-repple v-close-popup @click="addProduct(idx)">
              <q-item-section avatar>
                <q-icon color="secondary" size="16pt" name="inventory"></q-icon>
              </q-item-section>
              <q-item-section
                class="text-bold font-10"
                style="margin-left: -25px"
              >
                {{ $t('product') }}
              </q-item-section>
            </q-item>
            <q-item v-close-popup clickable v-ripple @click="deleteBtn(idx)">
              <q-item-section avatar>
                <q-icon name="delete" color="red" size="18pt"></q-icon>
              </q-item-section>
              <q-item-section
                class="font-10 text-bold"
                style="margin-left: -25px"
              >
                {{ $t('delete') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </article>
  </section>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { ImageInterface } from 'src/interfaces/catalogueInterface';
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue';

export default defineComponent({
  name: 'SimplePageTypeComponent',
  props: {
    images: {
      type: Array as () => ImageInterface[],
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // data
    const apiUrl = process.env.API_URL;
    const imageCoords: any = ref();
    const buttons: any = ref([]);
    const draggingButton: any = ref(null);
    const buttonSize = 8;

    // computeds
    const image: any = computed(() => {
      return props.images[0];
    });

    // methods
    const getImageCoords = (event: MouseEvent) => {
      const imageElement: any = document.getElementById('simplePageImage');
      const x = event.clientX - imageElement.getBoundingClientRect().left;
      const y = event.clientY - imageElement.getBoundingClientRect().top;
      const adjustedX = Math.max(
        buttonSize / 2,
        Math.min(imageElement.width - buttonSize / 2, x)
      );
      const adjustedY = Math.max(
        buttonSize / 2,
        Math.min(imageElement.height - buttonSize / 2, y)
      );
      imageCoords.value = { x: adjustedX, y: adjustedY };
      buttons.value.push({ x: adjustedX, y: adjustedY, product: null });
    };

    const handleButtonClick = () => {
      if (imageCoords.value) {
        console.log('Botón clickeado en coordenadas:', imageCoords);
        // Lógica adicional al hacer clic en el botón
      }
    };

    const startDrag = (index: number) => {
      draggingButton.value = index;
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
    };

    const doDrag = (event: MouseEvent) => {
      if (draggingButton.value !== null) {
        const imageElement: any = document.getElementById('simplePageImage');
        const x = event.clientX - imageElement.getBoundingClientRect().left;
        const y = event.clientY - imageElement.getBoundingClientRect().top;
        const adjustedX = Math.max(
          buttonSize / 2,
          Math.min(imageElement.width - buttonSize / 2, x)
        );
        const adjustedY = Math.max(
          buttonSize / 2,
          Math.min(imageElement.height - buttonSize / 2, y)
        );
        buttons.value[draggingButton.value] = {
          x: adjustedX,
          y: adjustedY,
          product: buttons.value[draggingButton.value].product,
        };
      }
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      draggingButton.value = null;
    };

    const handleImageLoad = () => {
      adjustButtonCoordinates();
    };

    const adjustButtonCoordinates = () => {
      const imageElement: any = document.getElementById('simplePageImage');
      buttons.value = buttons.value.map((button: any) => {
        button.x = (button.x / 400) * imageElement.width;
        button.y = (button.y / 590) * imageElement.height;
        button.product = button.product;
        return button;
      });
    };

    const deleteBtn = (idx: number) => {
      buttons.value.splice(idx, 1);
    };

    const addProduct = (idx: number) => {
      emit('do-add-product', idx, buttons.value[idx]);
    };

    // life cycle
    onBeforeMount(() => {
      setTimeout(() => {
        // add event listener
        const imageElement = document.getElementById('simplePageImage');
        imageElement?.addEventListener('click', getImageCoords);
        // validate si image have buttons
        if (image.value.buttons.length > 0) {
          buttons.value = image.value.buttons;
        }
      }, 0);
    });

    onBeforeUnmount(() => {
      const imageElement = document.getElementById('simplePageImage');
      imageElement?.removeEventListener('click', getImageCoords);
    });

    // return data
    return {
      image,
      apiUrl,
      addProduct,
      getImageCoords,
      handleButtonClick,
      imageCoords,
      buttons,
      startDrag,
      doDrag,
      stopDrag,
      deleteBtn,
      handleImageLoad,
      adjustButtonCoordinates,
    };
  },
});
</script>

<style scoped>
.custom-button {
  position: absolute;
  cursor: grab;
}
</style>
