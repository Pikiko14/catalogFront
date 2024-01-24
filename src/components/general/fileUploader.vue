<template>
  <div class="row q-pb-md">
    <div class="col-12">
      <section class="drop-files" @dragover.prevent @drop="handleDrop">
        <section v-if="filesBase64.length > 0" class="preview-drop-zone">
          <article v-for="(img, idx) in filesBase64" :key="idx">
            <q-img
              :src="img.base64 ? img.base64 : `${apiUrl}/${img.path}`"
              class="drop-zone-img-preview"
              alt="drop zone img"
            >
              <div class="full-width full-height overflow">
                <q-btn
                  rounded
                  icon="delete"
                  flat
                  dense
                  color="red"
                  @click="deleteFile(img)"
                >
                  <q-tooltip class="bg-red">
                    {{ $t('delete') }}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-img>
          </article>
        </section>
        <q-img src="/images/img_select.svg"></q-img>
        <span class="title-file">
          {{ $t('selectImage') }}
          <span class="text-secondary cursor-pointer" @click="openFilePicker">{{
            $t('here')
          }}</span>
        </span>
      </section>
    </div>
    <q-file
      accept="image/*"
      @update:model-value="(event) => setFile(event)"
      ref="fileRef"
      v-model="file"
      class="hidden"
    ></q-file>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { notification } from 'src/boot/notification';
import { FileObject, MediaProductInterface } from 'src/interfaces/Product';
import { Utils } from 'src/utils/utils';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MediaProductForm',
  props: {
    medias: {
      type: Array as () => MediaProductInterface[],
      defualt: () => {
        return [];
      },
    },
  },
  components: {},
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const file = ref<any>(null);
    const fileRef = ref<any>(null);
    const filesBase64 = ref<any>([]);
    const utils = new Utils('product');
    const apiUrl = process.env.API_URL;
    const files = ref<MediaProductInterface[]>([]);

    // rules

    // computed

    // methods
    const openFilePicker = () => {
      if (fileRef.value) {
        fileRef.value.$el.click();
      }
    };

    const handleDrop = (event: any) => {
      try {
        event.preventDefault();
        if (filesBase64.value.length > 5) {
          notification('negative', t('onlySixImage'), 'red');
          return false;
        }
        const files = event.dataTransfer.files;
        uploadFiles(files);
      } catch (error) {}
    };

    const uploadFiles = (files: FileObject[]) => {
      const maxSizeInBytes = 1024 * 1024;
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        if (fileData.size > maxSizeInBytes) {
          file.value = null;
          notification('negative', t('noFileMaxSize'), 'red');
          return false;
        }
        if (fileData.type.startsWith('image/')) {
          file.value = file;
          setFile(fileData);
          return true;
        } else {
          notification('negative', t('noFileImgAccepted'), 'red');
          return false;
          // Aquí puedes mostrar un mensaje de error al usuario si es necesario
        }
      }
    };

    const setFile = (filePicker: FileObject) => {
      if (filesBase64.value.length > 5) {
        notification('negative', t('onlySixImage'), 'red');
        return false;
      }
      const maxSizeInBytes = 1024 * 1024;
      const isValidFile = utils.valdiateFile(filePicker);
      // validate type file
      if (!isValidFile) {
        file.value = null;
        notification('negative', t('noFileImgAccepted'), 'red');
        return false;
      }
      // validamos el tamaño del archivo
      if (filePicker.size > maxSizeInBytes) {
        file.value = null;
        notification('negative', t('noFileMaxSize'), 'red');
        return false;
      }
      if (filePicker.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          filesBase64.value.push({
            base64: event.target.result,
            key: filePicker.__key,
          });
        };
        reader.readAsDataURL(filePicker as any);
        emitFile(filePicker);
      }
    };

    const emitFile = (filePicker: FileObject) => {
      emit('set-file', filePicker);
    };

    const deleteFile = (fileDelete: any) => {
      let index = null;
      if (fileDelete.key) {
        index = filesBase64.value.findIndex(
          (data: any) => data.key === fileDelete.key
        );
      }
      if (fileDelete._id) {
        index = filesBase64.value.findIndex(
          (data: any) => data._id === fileDelete._id
        );
      }
      if (index != -1) {
        filesBase64.value.splice(index, 1);
        if (fileDelete._id) {
          emit('delete-media', fileDelete._id);
        } else {
          emit('delete-file', fileDelete.key);
        }
      }
    };

    // life cycle
    onBeforeMount(() => {
      if (props.medias && props.medias.length > 0) {
        filesBase64.value.push(...props.medias);
      }
    });

    // return data
    return {
      file,
      files,
      apiUrl,
      fileRef,
      setFile,
      handleDrop,
      deleteFile,
      filesBase64,
      openFilePicker,
    };
  },
});
</script>
