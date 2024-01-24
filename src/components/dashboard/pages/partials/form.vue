<template>
  <q-form @submit="savePage" class="row">
    <div class="col-12">
      <label for=""> {{ $t('typePage') }}</label
      ><br /><br />
      <center>
        <q-img
          width="80px"
          @click="setImgType('simple')"
          class="q-mr-lg img-type"
          :class="{ 'active-image': page.type === 'simple' }"
          src="/images/layout_icon_single.png"
        >
          <q-tooltip class="bg-secondary">
            {{ $t('simple') }}
          </q-tooltip>
        </q-img>
        <!--<q-img
          width="80px"
          @click="setImgType('double')"
          height="120px"
          class="q-ml-lg img-type"
          :class="{ 'active-image': page.type === 'double' }"
          src="/images/layout_icon_twins.png"
        >
          <q-tooltip class="bg-secondary">
            {{ $t('double') }}
          </q-tooltip>
        </q-img>-->
      </center>
    </div>
    <div class="col-12 q-mt-md">
      <label for=""> {{ $t('imagePicker') }}</label>
      <q-file
        rounded
        color="primary"
        lazy-rules
        :rules="[(vall) => !!vall || $t('required')]"
        dense
        ref="fileInput"
        outlined
        @update:model-value="doCropImg"
        accept=".png, .jpg, .jpeg, .webp, image"
        v-model="file"
      >
        <template v-slot:append>
          <q-icon
            name="cloud_upload"
            color="secondary"
            class="cursor-pointer"
          />
        </template>
      </q-file>
    </div>
    <div class="col-12">
      <section class="row">
        <div class="col-12 col-md-4" v-for="(img, idx) in images" :key="idx">
          <center>
            <q-img
              width="80px"
              @click="setImgType('simple')"
              height="120px"
              class="q-mr-lg img-type active-image"
              :src="img.path"
            >
              <div class="page-overflow">
                <q-btn
                  icon="delete"
                  color="red"
                  rounded
                  unelevated
                  @click="deleteImg(img.order)"
                  size="8pt"
                  dense
                >
                  <q-tooltip class="bg-red">
                    {{ $t('delete') }}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-img>
          </center>
        </div>
      </section>
    </div>
    <div class="col-12 text-center q-mt-md">
      <q-btn
        unelevated
        color="secondary"
        :loading="loading"
        rounded
        type="submit"
        :label="$t('savePageBtnLabel')"
        no-caps
      ></q-btn>
    </div>
    <q-dialog v-model="cropImg" @before-hide="clearCrop">
      <q-card class="cropCard round-10" v-if="cropImgUrl">
        <q-card-section>
          <span class="title text-secondary">
            {{ $t('cropImg') }}
          </span>
          <q-btn
            flat
            dense
            color="red"
            v-close-popup
            icon="close"
            rounded
            class="float-right"
          >
            <q-tooltip class="bg-red">
              {{ $t('close') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            unelevated
            color="secondary"
            no-caps
            flat
            icon="crop"
            class="float-right"
            @click="getResult"
            rounded
          >
            <q-tooltip class="bg-secondary">
              {{ $t('cutImg') }}
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-card-section>
          <VuePictureCropper
            :boxStyle="{
              width: '500px',
              height: '740px',
              backgroundColor: '#f8f8f8',
              margin: 'auto',
            }"
            :img="cropImgUrl"
            :options="{
              viewMode: 0,
              dragMode: 'crop',
              aspectRatio: 4 / 6,
            }"
            @ready="readyToCrop"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { notification } from 'src/boot/notification';
import {
  ImageInterface,
  PageInterface,
} from 'src/interfaces/CatalogueInterface';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import { Utils } from 'src/utils/utils';
import { useCatalogsStore } from 'src/stores/catalogs';

export default defineComponent({
  name: 'CatalogPagesForm',
  components: {
    VuePictureCropper,
  },
  emit: ['close-modal-import', 'push-page'],
  setup(props, { emit }) {
    // data
    const route = useRoute();
    const page = ref<PageInterface>({
      number: 0,
      type: 'simple',
      catalogue_id: route.params.catalogId as string,
      images: [],
    });
    const file = ref<any>(null);
    const images = ref<ImageInterface[]>([]);
    const imagesFile = ref<File[]>([]);
    const { t } = useI18n();
    const cropImg = ref<boolean>(false);
    const cropImgUrl = ref<string>('');
    const utils = new Utils('page');
    const loading = ref<boolean>(false);
    const store = useCatalogsStore();

    // methods
    const savePage = async () => {
      if (images.value.length > 1 && page.value.type === 'simple') {
        notification('negative', t('noMoreImgSimple'), 'red');
        return true;
      }
      if (images.value.length > 2 && page.value.type === 'double') {
        notification('negative', t('noMoreImgDouble'), 'red');
        return true;
      }
      const formData = utils.transformObjectInFormData(
        page.value,
        true,
        imagesFile.value
      );
      loading.value = true;
      try {
        const response = await store.doSavePage(formData);
        if (response && response.success) {
          notification('positive', response.message, 'secondary');
          emit('push-page', response.data);
          emit('close-modal-import');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const setImgType = (type: string) => {
      page.value.type = type;
    };

    const clearCrop = async () => {
      if (!cropper) return;
      cropper.clear();
      cropper.reset();
    };

    const readyToCrop = () => {
      console.log('ready to crop');
    };

    /**
     * Get crop result
     */
    const getResult = async () => {
      if (!cropper) return;
      const order: number = page.value.images.length + 1;
      const fileData = await cropper.getFile({
        fileName: `page_${order}`,
      });
      const img = {
        path: cropImgUrl.value,
        order: order,
        buttons: [],
      };
      images.value.push(img);
      imagesFile.value.push(fileData as File);
      cropImgUrl.value = '';
      file.value = fileData ? fileData : file.value;
      cropImg.value = !cropImg.value;
    };

    const doCropImg = async (fileData: any) => {
      if (images.value.length === 1 && page.value.type === 'simple') {
        notification('negative', t('noMoreImgSimple'), 'red');
        file.value = null;
        return true;
      }
      if (images.value.length === 2 && page.value.type === 'double') {
        notification('negative', t('noMoreImgDouble'), 'red');
        file.value = null;
        return true;
      }
      const isValidFile = utils.valdiateFile(fileData);
      if (!isValidFile) {
        file.value = null;
        notification('negative', t('noFileImgAccepted'), 'red');
        return false;
      }
      if (fileData.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          cropImgUrl.value = event.target.result;
        };
        reader.readAsDataURL(fileData);
      }
      cropImg.value = !cropImg.value;
    };

    const deleteImg = (order: number) => {
      const index = images.value.findIndex(
        (item: ImageInterface) => item.order === order
      );
      if (index !== -1) {
        file.value = null;
        images.value.splice(index, 1);
      }
    };

    // life cycle

    // return data
    return {
      page,
      file,
      cropImg,
      images,
      loading,
      cropImgUrl,
      savePage,
      setImgType,
      clearCrop,
      readyToCrop,
      getResult,
      doCropImg,
      deleteImg,
    };
  },
});
</script>
