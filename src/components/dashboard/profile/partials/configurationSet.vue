<template>
  <section class="configuration-profile row">
    <div class="col-12">
      <q-form @submit="doSaveConfiguration" class="row">
        <div class="col-12 col-md-6" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
          <label for="">{{ $t('typeCatalog') }}</label>
          <q-select
            rounded
            color="primary"
            lazy-rules
            dense
            @blur="v$.type_slider.$touch"
            :error="v$.type_slider.$error"
            :readonly="!enableEdit"
            emit-value
            :options="typeSlider"
            outlined
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
        <div class="col-12 col-md-6" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
          <label for="">{{ $t('colorBrand') }}</label>
          <q-input
            outlined
            rounded
            :readonly="!enableEdit"
            dense
            lazy-rules
            @blur="v$.brand_color.$touch"
            :error="v$.brand_color.$error"
            v-model="profileData.brand_color"
          >
            <template v-slot:prepend>
              <div
                :style="{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50px',
                  backgroundColor: profileData.brand_color,
                }"
              ></div>
            </template>
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color no-header-tabs v-model="profileData.brand_color" />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template #error>
              <span v-if="v$.brand_color.required.$invalid">
                {{ $t('required') }}
              </span>
              <span v-if="v$.brand_color.regex.$invalid">
                {{ $t('regexColor') }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <label for="">{{ $t('whatsappMessage') }}</label>
          <q-editor
            :readonly="!enableEdit"
            @blur="v$.whatsapp_message.$touch"
            v-model="profileData.whatsapp_message"
            :toolbar="[
              ['bold', 'italic', 'underline'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: '',
                },
              ],
            ]"
          />
          <span
            class="error-message"
            v-if="v$.whatsapp_message.required.$invalid"
          >
            {{ $t('required') }}
          </span>
          <span
            class="error-message"
            v-if="v$.whatsapp_message.maxLength.$invalid"
          >
            {{ $t('maxLengthWhatsappMessage') }}
          </span>
          <span class="error-message" v-if="v$.whatsapp_message.regex.$invalid">
            {{ $t('regexWhatsappMessage') }}
          </span>
        </div>
        <div class="col-12 text-center q-mt-lg">
          <q-btn
            color="secondary"
            rounded
            v-if="!enableEdit"
            unelevated
            no-caps
            @click="enableEdit = true"
            :label="$t('edit')"
          ></q-btn>
          <q-btn
            color="primary"
            rounded
            v-if="enableEdit"
            unelevated
            no-caps
            @click="enableEdit = false"
            class="q-mr-md"
            style="width: 100px"
            :label="$t('cancel')"
          ></q-btn>
          <q-btn
            color="secondary"
            rounded
            v-if="enableEdit"
            unelevated
            :loading="loading"
            no-caps
            type="submit"
            style="width: 100px"
            :label="$t('save')"
          ></q-btn>
        </div>
      </q-form>
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { useAuthStore } from 'src/stores/auth';
import { ProfileInterface } from 'src/interfaces/authInterface';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { required, minLength, maxLength, helpers } from '@vuelidate/validators';
import { notification } from 'src/boot/notification';
const { regex } = helpers;

export default defineComponent({
  name: 'ConfigurationProfileComponenet',
  setup() {
    // data
    const { t } = useI18n();
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
    const loading = ref(false);
    const store = useAuthStore();
    const enableEdit = ref<boolean>(false);
    const profileData = ref<ProfileInterface | any>({
      brand_color: '',
      whatsapp_message: '',
    });

    // rules
    const brandRules = {
      brand_color: {
        required,
        minLength: minLength(0),
        maxLength: maxLength(8),
        regex: regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
      },
      whatsapp_message: {
        required,
        minLength: minLength(1),
        regex: regex(
          /{{\s*order\s*}}.*{{\s*total\s*}}|{{\s*total\s*}}.*{{\s*order\s*}}/
        ),
        maxLength: maxLength(1000),
      },
      type_slider: {
        required,
      },
    };
    const v$ = useVuelidate(brandRules, profileData as any);

    // computed
    const profile = computed(() => {
      return store.profile;
    });

    // methods
    const doSaveConfiguration = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        return;
      }
      loading.value = true;
      try {
        const response = await store.soConfigurationProfile(profileData.value);
        if (response?.data) {
          notification('positive', response?.message, 'primary');
        }
      } catch (error) {
      } finally {
        loading.value = false;
        enableEdit.value = false;
      }
    };

    // life cycle
    onBeforeMount(async () => {
      profileData.value = JSON.parse(JSON.stringify(profile.value));
    });

    // return data
    return {
      v$,
      loading,
      enableEdit,
      typeSlider,
      profileData,
      doSaveConfiguration,
    };
  },
});
</script>
