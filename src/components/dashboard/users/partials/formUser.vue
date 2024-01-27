<template>
  <q-form ref="formRef" @submit="doSaveUser" class="row">
    <div class="col-12 col-md-6" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <label for="">{{ $t('username') }}</label>
      <q-input
        rounded
        color="primary"
        @blur="v$.username.$touch"
        lazy-rules
        dense
        outlined
        :error="v$.username.$error"
        placeholder="Jondoe"
        v-model="user.username"
      >
        <template #error>
          <span v-if="v$.username.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.username.minLength.$invalid">
            {{ $t('minimumFive') }}
          </span>
          <span v-if="v$.username.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-md': $q.screen.gt.sm }">
      <label for="">{{ $t('email') }}</label>
      <q-input
        rounded
        color="primary"
        placeholder="jhondoe@jhon.com"
        type="email"
        :error="v$.email.$error"
        dense
        @blur="v$.email.$touch"
        outlined
        v-model="user.email"
      >
        <template #error>
          <span v-if="v$.email.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.email.minLength.$invalid">
            {{ $t('minimumFive') }}
          </span>
          <span v-if="v$.email.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
          <span v-if="v$.email.email.$invalid">
            {{ $t('emailValidation') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12">
      <label for="">{{ $t('password') }}</label>
      <q-input
        rounded
        color="primary"
        dense
        @blur="v$.password.$touch"
        outlined
        :error="v$.password.$error"
        placeholder="********"
        :type="!passwordType ? 'password' : 'text'"
        v-model="user.password"
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
        <template #error>
          <span v-if="v$.password.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.password.minLength.$invalid">
            {{ $t('more8') }}
          </span>
          <span v-if="v$.password.custom.$invalid">
            {{ $t('containsCharactersSpecials') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <label for="">{{ $t('name') }}</label>
      <q-input
        rounded
        color="primary"
        :error="v$.name.$error"
        @blur="v$.name.$touch"
        lazy-rules
        dense
        outlined
        placeholder="Jondoe"
        v-model="user.name"
      >
        <template #error>
          <span v-if="v$.name.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.name.minLength.$invalid">
            {{ $t('minimumFour') }}
          </span>
          <span v-if="v$.name.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-md': $q.screen.gt.sm }">
      <label for="">{{ $t('lastName') }}</label>
      <q-input
        rounded
        :error="v$.last_name.$error"
        @blur="v$.last_name.$touch"
        color="primary"
        lazy-rules
        dense
        outlined
        placeholder="Jondoe"
        v-model="user.last_name"
      >
        <template #error>
          <span v-if="v$.last_name.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.last_name.minLength.$invalid">
            {{ $t('minimumFour') }}
          </span>
          <span v-if="v$.last_name.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 text-center q-mt-md">
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
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { notification } from 'src/boot/notification';
import { ResponseObj } from 'src/interfaces/api';
import { User } from 'src/interfaces/userInterface';
import { useUsersStore } from 'src/stores/users';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  maxLength,
  requiredIf,
} from '@vuelidate/validators';
import { Utils } from 'src/utils/utils';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'UserFormMainComponent',
  components: {},
  props: {
    userData: {
      type: Object as () => User,
      default: () => {
        return {};
      },
    },
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    // data
    const user = ref<User | any>({
      username: '',
      name: '',
      last_name: '',
      email: '',
      password: '',
    });
    const passwordType = ref<boolean>(false);
    const userStore = useUsersStore();
    const loading = ref<boolean>(false);
    const formRef = ref<any>();
    const submit = ref<boolean>(false);
    const utils = new Utils('aside');
    const { t } = useI18n();

    //validations rules
    const userRule = {
      username: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(90),
      },
      email: {
        required,
        email,
        minLength: minLength(5),
        maxLength: maxLength(90),
      },
      password: {
        required: requiredIf(() => {
          return !user.value._id;
        }),
        custom: (value: string) => {
          if (!value) {
            return true;
          }
          const specialChars = /[\W_]/;
          if (value.length >= 8 && !specialChars.test(value)) {
            return false;
          }
          if (
            (value.length >= 8 && value.toUpperCase() === value) ||
            (value.length >= 8 && value.toLowerCase() === value)
          ) {
            return false;
          }
          return true;
        },
        minLength: minLength(8),
      },
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(90),
      },
      last_name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(90),
      },
    };

    const v$ = useVuelidate(userRule, user);

    // methods
    const doSaveUser = async (): Promise<void | boolean> => {
      v$.value.$touch();
      submit.value = true;
      if (v$.value.$invalid) {
        return;
      }
      loading.value = true;
      if (user.value._id) {
        if (!utils.validatePermission('update-user')) {
          notification('positive', t('noPermission'), 'red');
          loading.value = false;
          return false;
        }
        await doUpdateUser(user.value);
        return true;
      }
      if (!utils.validatePermission('create-user')) {
        notification('positive', t('noPermission'), 'red');
        loading.value = false;
        return false;
      }
      try {
        const response = (await userStore.doSaveUser(
          user.value
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
          user.value = {
            username: '',
            name: '',
            last_name: '',
            email: '',
            password: '',
          };
          formRef.value.reset();
          emit('close-modal');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const showPassword = () => {
      passwordType.value = !passwordType.value;
    };

    const doUpdateUser = async (user: User) => {
      try {
        const response = (await userStore.doUpdateUser(user)) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
          formRef.value.reset();
          emit('close-modal');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    // life cicle
    onBeforeMount(() => {
      user.value = props.userData;
    });

    // return
    return {
      user,
      passwordType,
      loading,
      formRef,
      v$,
      submit,
      doSaveUser,
      showPassword,
    };
  },
});
</script>
