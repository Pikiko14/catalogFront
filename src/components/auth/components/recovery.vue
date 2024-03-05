<template>
  <div class="full-width q-px-xl">
    <q-form class="row" @submit="initRecoveryPassword">
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
  </div>
</template>

<script lang="ts">
import { notification } from 'src/boot/notification';
import { useAuthStore } from 'src/stores/auth';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'RecoveryComponents',
  emits: ['go-back'],
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const email = ref<string>('');
    const authStore = useAuthStore();
    const loading = ref<boolean>(false);

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

    // init recovery password
    const initRecoveryPassword = async () => {
      try {
        const params = {
          email: email.value,
        };
        const response = await authStore.initRecoveryPassword(params);
        if (response?.success) {
          notification('positive', response?.message, 'primary');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    // return statements
    return {
      email,
      goBack,
      validateEmail,
      initRecoveryPassword,
    };
  },
});
</script>

<style></style>
