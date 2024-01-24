<template>
  <q-form @submit="importPdf" class="row">
    <div class="col-12">
      <label for="">
        {{ $t('fileSelect') }}
      </label>
      <q-file
        rounded
        color="primary"
        classfull-width
        lazy-rules
        @blur="v$.file.$touch"
        dense
        :error="v$.file.$error"
        ref="fileInput"
        outlined
        accept=".pdf"
        v-model="formData.file"
      >
        <template #error>
          <span v-if="v$.file.required.$invalid">
            {{ $t('required') }}
          </span>
        </template>
        <template v-slot:append>
          <q-icon name="cloud_upload" color="primary" class="cursor-pointer" />
        </template>
      </q-file>
    </div>
    <div class="col-12 q-mt-sm text-center">
      <q-btn
        :label="$t('importPdf')"
        no-caps
        type="submit"
        rounded
        :loading="loading"
        color="secondary"
        unelevated
      ></q-btn>
    </div>
  </q-form>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { notification } from 'src/boot/notification';
import { ResponseObj } from 'src/interfaces/Api';
import { ImportPagesInterface } from 'src/interfaces/CatalogueInterface';
import { useCatalogsStore } from 'src/stores/catalogs';
import { Utils } from 'src/utils/utils';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'CatalogPagesImportForm',
  components: {},
  emit: ['close-modal-import'],
  setup(props, { emit }) {
    // data
    const route = useRoute();
    const formData = ref<ImportPagesInterface>({
      file: null,
      catalogId: route.params.catalogId as string,
    });
    const loading = ref<boolean>(false);
    const utils = new Utils('pagesImport');
    const { t } = useI18n();
    const store = useCatalogsStore();

    // validations
    const fileRule = {
      file: {
        required,
      },
    };
    const v$ = useVuelidate(fileRule, formData);

    // methods
    const importPdf = async () => {
      const isValidFile = utils.valdiateFile(formData.value.file);
      if (!isValidFile) {
        formData.value.file = null;
        notification('negative', t('noFileImgAccepted'), 'red');
        return false;
      }
      const data = utils.transformObjectInFormData(formData.value, false, null);
      loading.value = true;
      try {
        const response = (await store.doImportPages(data)) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'secondary');
          formData.value = {
            file: null,
            catalogId: route.params.catalogId as string,
          };
          emit('close-modal-import');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    // life cycle

    // return data
    return {
      importPdf,
      formData,
      v$,
      loading,
    };
  },
});
</script>
