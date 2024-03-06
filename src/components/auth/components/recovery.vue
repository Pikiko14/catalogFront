<template>
  <div class="full-width q-px-xl">
    <!--init recovery process form-->
    <q-form
      ref="initRecoveryForm"
      class="row"
      @submit="initRecoveryPassword"
      v-if="!isRecoveryForm"
    >
      <div class="col-12">
        <p class="title">
          {{ $t('recoveryText') }}
          <q-icon name="img:/images/dedos.png"></q-icon>
        </p>
      </div>
      <div class="col-12">
        <label for="">{{ $t('email') }}</label>
        <q-input
          rounded
          color="primary"
          placeholder="jhondoe@jhon.com"
          lazy-rules
          type="email"
          :rules="[(vall) => !!vall || $t('required'), validateEmail]"
          dense
          outlined
          v-model="email"
        ></q-input>
      </div>
      <div class="col-12 text-center">
        <q-btn
          rounded
          type="submit"
          dense
          class="full-width"
          unelevated
          size="12pt"
          :loading="loading"
          no-caps
          color="secondary"
          :label="$t('recoveryPassword')"
        ></q-btn>
      </div>
      <div class="col-12 text-center q-mt-lg">
        <p class="font-12 weight-600">
          {{ $t('dontContinue') }}
          <q-btn
            dense
            unelevated
            flat
            size="12pt"
            no-caps
            @click="goBack"
            color="black"
            :label="$t('clickHere')"
          ></q-btn>
        </p>
      </div>
    </q-form>
    <!--end init recovery process form-->

    <!--finish recovery process-->
    <q-form
      ref="doChangePasswordForm"
      @submit="doChangePassword"
      class="row"
      v-if="isRecoveryForm"
    >
      <div class="col-12">
        <p class="title text-justify">
          {{ $t('enterYourNewPassword') }}
          <q-icon name="img:/images/dedos.png"></q-icon>
        </p>
      </div>
      <div class="col-12 col-sm-12 col-md-12">
        <label for="">{{ $t('password') }}</label>
        <q-input
          rounded
          color="primary"
          dense
          outlined
          placeholder="********"
          lazy-rules
          :rules="[
            (vall) => !!vall || $t('required'),
            (vall) => vall.length > 7 || $t('more8'),
            containsSpecialCharacters,
          ]"
          :type="!passwordType ? 'password' : 'text'"
          v-model="recoveryData.password"
        >
          <v-slot:append>
            <q-btn
              :icon="!passwordType ? 'visibility' : 'visibility_off'"
              size="12pt"
              flat
              @click="showPassword"
              dense
              round
              color="primary"
            ></q-btn>
          </v-slot:append>
        </q-input>
      </div>
      <div class="col-12 col-sm-12 col-md-12">
        <label for="">{{ $t('passwordConfirmation') }}</label>
        <q-input
          rounded
          color="primary"
          dense
          outlined
          placeholder="********"
          lazy-rules
          :rules="[
            (vall) => !!vall || $t('required'),
            (vall) => vall.length > 7 || $t('more8'),
            containsSpecialCharacters,
            (vall) => vall === recoveryData.password || $t('dontMatch'),
          ]"
          :type="!passwordType ? 'password' : 'text'"
          v-model="recoveryData.confirmation_password"
        >
          <v-slot:append>
            <q-btn
              :icon="!passwordType ? 'visibility' : 'visibility_off'"
              size="12pt"
              flat
              @click="showPassword"
              dense
              round
              color="primary"
            ></q-btn>
          </v-slot:append>
        </q-input>
      </div>
      <div class="col-12 text-center q-mt-md">
        <q-btn
          rounded
          type="submit"
          dense
          class="full-width"
          unelevated
          size="12pt"
          :loading="loading"
          no-caps
          color="secondary"
          :label="$t('recoveryPassword')"
        ></q-btn>
      </div>
      <div class="col-12 text-center q-mt-lg">
        <p class="font-12 weight-600">
          {{ $t('dontContinue') }}
          <q-btn
            dense
            unelevated
            flat
            size="12pt"
            no-caps
            @click="goBack"
            color="black"
            :label="$t('clickHere')"
          ></q-btn>
        </p>
      </div>
    </q-form>
    <!--end finish recovery process-->
  </div>
</template>

<script lang="ts">
import { notification } from 'src/boot/notification';
import { useAuthStore } from 'src/stores/auth';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'RecoveryComponents',
  emits: ['go-back'],
  setup(props, { emit }) {
    // data

    const recoveryData = ref<any>({
      password: '',
      confirmation_password: '',
    });
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const email = ref<string>('');
    const initRecoveryForm = ref();
    const authStore = useAuthStore();
    const doChangePasswordForm = ref();
    const loading = ref<boolean>(false);
    const passwordType = ref<boolean>(false);
    const isRecoveryForm = ref<boolean>(false);

    // custom rules
    const validateEmail = (value: string) => {
      if (value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(value) || t('emailValidation');
      }
      return true;
    };

    // methods
    const goBack = () => {
      emit('go-back');
    };

    // custom rules
    const containsSpecialCharacters = (value: string) => {
      if (value) {
        const regex = /(?=.*[a-z])(?=.*[A-Z])[$@#&!*\-\w]+/;
        return regex.test(value) || t('containsCharactersSpecials');
      }
      return true;
    };

    // methods
    // init recovery password
    const initRecoveryPassword = async () => {
      try {
        loading.value = true;
        const params = {
          email: email.value,
        };
        const response = await authStore.initRecoveryPassword(params);
        if (response?.success) {
          notification('positive', response?.message, 'primary');
          email.value = '';
          initRecoveryForm.value.reset();
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const doChangePassword = async () => {
      try {
        loading.value = true;
        const params = {
          token: (route.query.token as string) || '',
          password: recoveryData.value.password,
          confirmation_password: recoveryData.value.confirmation_password,
        };
        const response = await authStore.doChangePassword(params);
        if (response?.success) {
          notification('positive', response?.message, 'primary');
          recoveryData.value = {
            password: '',
            confirmation_password: '',
          };
          doChangePasswordForm.value.reset();
          goBack();
          router.push({
            path: '/',
          });
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const showPassword = () => {
      passwordType.value = !passwordType.value;
    };

    // life cycle
    onBeforeMount(() => {
      if (route.query.recovery && route.query.token) {
        isRecoveryForm.value = true;
      }
    });

    // return statements
    return {
      email,
      goBack,
      loading,
      showPassword,
      recoveryData,
      passwordType,
      validateEmail,
      isRecoveryForm,
      initRecoveryForm,
      doChangePassword,
      initRecoveryPassword,
      doChangePasswordForm,
      containsSpecialCharacters,
    };
  },
});
</script>

<style></style>
