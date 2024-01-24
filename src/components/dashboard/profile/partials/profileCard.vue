<template>
  <q-card class="round-10 profile-card shadow-1">
    <q-card-section class="text-center">
      <q-img
        :src="`${
          imgCropper ? imgCropper : `${url}/${profile.profile_pictury}`
        }`"
        spinner-color="secondary"
        class="profile-image"
      >
        <div
          class="overflow"
          v-if="utils.validatePermission('change-profile-pictury')"
        >
          <q-btn
            round
            dense
            unelevated
            @click="openFileImg"
            class="btn-change-photo"
            icon="image"
            color="secondary"
          >
            <q-tooltip class="bg-secondary">
              {{ $t('changePhoto') }}
            </q-tooltip>
          </q-btn>
        </div>
      </q-img>
    </q-card-section>
    <q-card-section class="text-center" style="margin-top: -20px">
      <div
        class="text-secondary text-capitalize"
        :class="{
          'text-h6': $q.screen.gt.sm,
          'font-12 text-bold': $q.screen.lt.md,
        }"
      >
        {{ user.name }}
      </div>
      <div class="text-black font-12">
        {{ user.email }}
      </div>
      <div class="text-black font-12">@{{ user.username }}</div>
    </q-card-section>
    <q-file
      accept=".png, .jpg, .jpeg, .webp, image"
      ref="fileImg"
      class="hidden"
      v-model="file"
      @update:model-value="uploadingProfileImage"
    ></q-file>
    <q-dialog v-model="cropImg" @before-hide="clearCrop">
      <q-card class="cropCard round-10" v-if="cropImgUrl">
        <q-card-section>
          <span class="title text-secondary">
            {{ $t('saveImageProfile') }}
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
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f8f8',
              margin: 'auto',
            }"
            :img="cropImgUrl"
            :options="{
              viewMode: 1,
              dragMode: 'crop',
              aspectRatio: 2 / 2,
            }"
            @ready="readyToCrop"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { Utils } from 'src/utils/utils';
import { defineComponent, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';

import { notification } from 'src/boot/notification';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
export default defineComponent({
  name: 'ProfileCard',
  props: {
    profile: {
      type: Object,
      default: () => {
        return {};
      },
    },
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    VuePictureCropper,
  },
  setup(props) {
    // data
    const fileImg = ref();
    const { t } = useI18n();
    const file = ref<any>(null);
    const store = useAuthStore();
    const utils = new Utils('profile');
    const cropImg = ref<boolean>(false);
    const url = `${process.env.API_URL}/profile`;
    const cropImgUrl = ref<string | null>(null);
    const imgCropper = ref<string | null>(null);

    // methods
    const openFileImg = () => {
      fileImg.value.$el.click();
    };

    const uploadingProfileImage = async (fileData: any) => {
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

    const clearCrop = () => {
      if (!cropper) return;
      cropper.clear();
      cropper.reset();
    };

    /**
     * Get crop result
     */
    const getResult = async () => {
      if (!cropper) return;
      // get blob
      imgCropper.value = await cropper.getDataURL();
      // get file for upload
      const fileData = await cropper.getFile({
        fileName: `profile_img_${props.user.username}`,
      });
      file.value = fileData ? fileData : file.value;
      await saveProfileImage();
    };

    const saveProfileImage = async () => {
      try {
        const form = utils.transformObjectInFormData(
          {
            file: file.value,
            profile: props.profile._id,
          },
          false,
          null
        );
        const response = await store.changeProfileImage(form);
        if (response && response.success) {
          file.value = null;
          cropImgUrl.value = null;
          cropImg.value = false;
          notification('positive', response.message, 'secondary');
        }
      } catch (error) {}
    };

    const readyToCrop = () => {
      console.log('ready to crop');
    };

    // return data
    return {
      url,
      file,
      fileImg,
      cropImgUrl,
      cropImg,
      imgCropper,
      utils,
      openFileImg,
      uploadingProfileImage,
      clearCrop,
      getResult,
      readyToCrop,
    };
  },
});
</script>
