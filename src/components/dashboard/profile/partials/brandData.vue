<template>
  <section class="brand-data">
    <q-form @submit="doSaveProfile">
      <q-card class="round-10">
        <q-card-section>
          <span class="text-h6 text-bold text-secondary">
            {{ $t('brandData') }}
          </span>
          <q-btn
            color="secondary"
            icon="save"
            flat
            v-if="enableEdit"
            dense
            :loading="isEditingBrand"
            type="submit"
            round
            class="float-right q-ml-sm"
          >
            <q-tooltip class="bg-secondary">
              {{ $t('save') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            :color="!enableEdit ? 'secondary' : 'red'"
            :icon="!enableEdit ? 'edit' : 'close'"
            flat
            dense
            @click="editProfile"
            round
            class="float-right"
          >
            <q-tooltip :class="!enableEdit ? 'bg-secondary' : 'bg-red'">
              {{ !enableEdit ? $t('edit') : $t('close') }}
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-card-section style="margin-top: -10px" class="row">
          <div
            class="col-12 col-md-4 col-lg-4"
            :class="{ 'q-pr-sm': $q.screen.gt.sm }"
          >
            <label for="">{{ $t('brandName') }}</label>
            <q-input
              rounded
              color="primary"
              :readonly="!enableEdit"
              @blur="v$.brand_name.$touch"
              lazy-rules
              dense
              outlined
              :error="v$.brand_name.$error"
              placeholder="Nike, Zara, Pull&Bear.."
              v-model="profileData.brand_name"
            >
              <template #error>
                <span v-if="v$.brand_name.required.$invalid">
                  {{ $t('required') }}
                </span>
                <span v-if="v$.brand_name.minLength.$invalid">
                  {{ $t('minimumTwo') }}
                </span>
                <span v-if="v$.brand_name.maxLength.$invalid">
                  {{ $t('maxSixthing') }}
                </span>
              </template>
            </q-input>
          </div>
          <div
            class="col-12 col-md-4 col-lg-4"
            :class="{ 'q-px-sm': $q.screen.gt.sm }"
          >
            <label for="">{{ $t('phone') }}</label>
            <q-input
              rounded
              color="primary"
              @blur="v$.phone_number.$touch"
              lazy-rules
              :readonly="!enableEdit"
              dense
              outlined
              :error="v$.phone_number.$error"
              placeholder="+513007170369"
              v-model="profileData.phone_number"
            >
              <template #error>
                <span v-if="v$.phone_number.required.$invalid">
                  {{ $t('required') }}
                </span>
                <span
                  v-if="
                    v$.phone_number.valid.$invalid &&
                    !v$.phone_number.required.$invalid
                  "
                >
                  {{ $t('phoneInvalid') }}
                </span>
              </template>
            </q-input>
          </div>
          <div
            class="col-12 col-md-4 col-lg-4"
            :class="{ 'q-pl-sm': $q.screen.gt.sm }"
          >
            <label for="">{{ $t('country') }}</label>
            <q-select
              rounded
              transition-show="scale"
              transition-hide="scale"
              color="primary"
              @blur="v$.country.$touch"
              lazy-rules
              :readonly="!enableEdit"
              dense
              outlined
              emit-value
              :use-input="enableEdit"
              @filter="filterFn"
              :options="countries"
              :error="v$.country.$error"
              placeholder="Colombia"
              v-model="profileData.country"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.label }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.description }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #error>
                <span v-if="v$.country.required.$invalid">
                  {{ $t('required') }}
                </span>
              </template>
            </q-select>
          </div>
          <div
            class="col-12 col-md-4 col-lg-4"
            :class="{ 'q-pr-sm': $q.screen.gt.sm }"
          >
            <label for="">{{ $t('city') }}</label>
            <q-input
              rounded
              color="primary"
              :readonly="!enableEdit"
              @blur="v$.city.$touch"
              lazy-rules
              dense
              outlined
              :error="v$.city.$error"
              placeholder="Medellín"
              v-model="profileData.city"
            >
              <template #error>
                <span v-if="v$.city.required.$invalid">
                  {{ $t('required') }}
                </span>
                <span v-if="v$.city.minLength.$invalid">
                  {{ $t('minimumTwo') }}
                </span>
                <span v-if="v$.city.maxLength.$invalid">
                  {{ $t('maxNinething') }}
                </span>
              </template>
            </q-input>
          </div>
          <div
            class="col-12 col-md-4 col-lg-4"
            :class="{ 'q-px-sm': $q.screen.gt.sm }"
          >
            <label for="">{{ $t('address') }}</label>
            <q-input
              rounded
              color="primary"
              @blur="v$.address.$touch"
              lazy-rules
              :readonly="!enableEdit"
              dense
              outlined
              :error="v$.address.$error"
              placeholder="Carrera 84 # 62 A C"
              v-model="profileData.address"
            >
              <template #error>
                <span v-if="v$.address.required.$invalid">
                  {{ $t('required') }}
                </span>
                <span v-if="v$.address.minLength.$invalid">
                  {{ $t('minimumFive') }}
                </span>
                <span v-if="v$.address.maxLength.$invalid">
                  {{ $t('maxNinething') }}
                </span>
              </template>
            </q-input>
          </div>
          <div
            class="col-12 col-md-4 col-lg-4"
            :class="{ 'q-pl-sm': $q.screen.gt.sm }"
          >
            <label for="">{{ $t('typeCatalog') }}</label>
            <q-select
              rounded
              color="primary"
              :readonly="!enableEdit"
              @blur="v$.type_slider.$touch"
              lazy-rules
              dense
              emit-value
              :options="typeSlider"
              outlined
              :error="v$.type_slider.$error"
              placeholder="Medellín"
              v-model="profileData.type_slider"
            >
              <template #error>
                <span v-if="v$.type_slider.required.$invalid">
                  {{ $t('required') }}
                </span>
              </template>
            </q-select>
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </section>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { ProfileInterface } from 'src/interfaces/AuthInterface';

export default defineComponent({
  name: 'BrandDataProfile',
  emits: ['do-save-brand'],
  props: {
    profile: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEditingBrand: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const profileData = ref<ProfileInterface>({});
    const enableEdit = ref(false);
    const countries = ref([]);
    const countriesAll = ref([]);
    const typeSlider = ref([
      {
        value: 'Simple',
        label: t('simple'),
      },
      {
        value: 'Double',
        label: t('double'),
      },
      {
        value: 'Landing',
        label: 'Landing',
      },
    ]);

    // watch

    // rules
    const brandRules = {
      brand_name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(60),
      },
      phone_number: {
        required,
        valid: (value: any) => /^\+\d{1,3}\d{1,14}$/.test(value),
      },
      country: {
        required,
      },
      city: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(90),
      },
      address: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(90),
      },
      type_slider: {
        required,
      },
    };
    const v$ = useVuelidate(brandRules, profileData as any);

    // methods
    const doSaveProfile = async () => {
      emit('do-save-brand', profileData.value);
    };

    const listCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (response.ok) {
          const data = await response.json();
          countries.value = data.map((data: any) => {
            return {
              label: data?.name.common,
              value: data?.name.common,
              icon: data?.flag,
            };
          });
          countriesAll.value = countries.value;
        } else {
          console.error('Error al obtener datos:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    const filterFn = (val: any, update: any) => {
      if (val === '') {
        update(() => {
          countries.value = countriesAll.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        countries.value = countriesAll.value.filter(
          (v: any) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    const editProfile = () => {
      if (enableEdit.value) {
        profileData.value = JSON.parse(JSON.stringify(props.profile));
      }
      enableEdit.value = !enableEdit.value;
    };

    // life cycle
    onBeforeMount(async () => {
      profileData.value = JSON.parse(JSON.stringify(props.profile));
      await listCountries();
    });

    // return data
    return {
      v$,
      brandRules,
      enableEdit,
      profileData,
      countries,
      typeSlider,
      doSaveProfile,
      filterFn,
      editProfile,
    };
  },
});
</script>
