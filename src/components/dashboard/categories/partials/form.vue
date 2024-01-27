<template>
  <q-card class="round-10 categories-card-form">
    <q-card-section class="title text-primary">
      <span v-if="!category._id">{{ $t('addCategoryLabel') }}</span>
      <span v-else>{{ $t('updateCategoryLabel') }}</span>
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
    </q-card-section>
    <q-card-section style="margin-top: -10px">
      <q-form @submit="doSaveCategory" class="row">
        <div class="col-12">
          <label for="">{{ $t('name') }}</label>
          <q-input
            rounded
            color="primary"
            @blur="v$.name.$touch"
            lazy-rules
            dense
            outlined
            :error="v$.name.$error"
            placeholder="Mascotas, Adultos, Niños..."
            v-model="category.name"
          >
            <template #error>
              <span v-if="v$.name.required.$invalid">
                {{ $t('required') }}
              </span>
              <span v-if="v$.name.minLength.$invalid">
                {{ $t('minimumFive') }}
              </span>
              <span v-if="v$.name.maxLength.$invalid">
                {{ $t('maxNinething') }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <label for="">{{ $t('file') }}</label>
          <FileUploader :medias="[]" :maxFile="1" @set-file="setFile" />
        </div>
        <div class="col-12 text-center q-mt-sm">
          <q-btn
            type="submit"
            :label="$t('save')"
            :loading="loading"
            rounded
            color="secondary"
            no-caps
            unelevated
          ></q-btn>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Utils } from 'src/utils/utils';
import useVuelidate from '@vuelidate/core';
import { notification } from 'src/boot/notification';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useCategoriesStore } from 'src/stores/categories';
import { CategoryInterface } from 'src/interfaces/categories';
import { required, minLength, maxLength } from '@vuelidate/validators';
import FileUploader from 'src/components/general/fileUploader.vue';

export default defineComponent({
  name: 'FormConfigModal',
  emit: ['close-modal'],
  components: {
    FileUploader,
  },
  props: {
    categoryData: {
      type: Object as () => CategoryInterface,
      default: () => {
        return {
          name: '',
        };
      },
    },
    idx: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props, { emit }) {
    // data
    const loading = ref<boolean>(false);
    const category = ref<CategoryInterface>({
      name: '',
    });
    const categoriesStore = useCategoriesStore();
    const { categoryData } = props;
    const utils = new Utils('category');

    // valdiations
    //validations rules
    const userRule = {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(90),
      },
    };
    const v$ = useVuelidate(userRule, category);

    // methods
    const doSaveCategory = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        return;
      }
      loading.value = true;
      if (category.value._id) {
        await doUpdateCategory();
        return true;
      }
      try {
        const paramsForm = utils.transformObjectInFormData(
          category.value,
          false,
          null
        );
        const response = await categoriesStore.saveCategory(paramsForm);
        if (response?.success) {
          category.value = {
            name: '',
          };
          notification('positive', response.message, 'primary');
          emit('close-modal');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const doUpdateCategory = async () => {
      try {
        const paramsForm = utils.transformObjectInFormData(
          category.value,
          false,
          null
        );
        const response = await categoriesStore.updateCategory(
          paramsForm,
          category.value._id,
          props.idx
        );
        if (response?.success) {
          category.value = {
            name: '',
          };
          notification('positive', response.message, 'primary');
          emit('close-modal');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const setFile = (file: File) => {
      category.value.file = file;
    };

    // life cycle
    onBeforeMount(async () => {
      if (categoryData._id) {
        category.value = categoryData;
      }
    });

    // return
    return {
      v$,
      loading,
      setFile,
      category,
      doSaveCategory,
    };
  },
});
</script>
