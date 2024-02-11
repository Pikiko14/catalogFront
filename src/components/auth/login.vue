<template>
  <q-card class="login-card round-0 shadow-10">
    <q-card-section class="full-height q-pa-none">
      <input type="checkbox" id="flip" />
      <div class="cover">
        <div class="front"></div>
        <div class="back">
          <!--<img class="backImg" src="images/backImg.jpg" alt="">-->
        </div>
      </div>
      <div class="row full-height d-flex items-center">
        <div class="col-12 col-sm-6 col-md-6 login-row">
          <section class="full-width login-row">
            <q-form @submit="doLogin" class="row q-px-xl">
              <div class="col-12">
                <p class="title">
                  {{ $t('login') }}
                  <q-icon name="img:/images/dedos.png"></q-icon>
                </p>
                <p class="subtitle">
                  {{ $t('captionLg') }}
                </p>
              </div>
              <div class="col-12 q-mt-md">
                <label for="">{{ $t('username') }}</label>
                <q-input
                  rounded
                  color="primary"
                  lazy-rules
                  :rules="[(vall) => !!vall || $t('required')]"
                  dense
                  outlined
                  placeholder="Jondoe"
                  v-model="loginData.username"
                ></q-input>
              </div>
              <div class="col-12">
                <label for="">{{ $t('password') }}</label>
                <q-input
                  rounded
                  color="primary"
                  dense
                  placeholder="********"
                  outlined
                  lazy-rules
                  :rules="[
                    (vall) => !!vall || $t('required'),
                    (vall) => vall.length > 7 || $t('more8'),
                  ]"
                  :type="!passwordType ? 'password' : 'text'"
                  v-model="loginData.password"
                >
                  <v-slot:append>
                    <q-btn
                      :icon="!passwordType ? 'visibility' : 'visibility_off'"
                      size="12pt"
                      flat
                      @click="showPassword"
                      dense
                      round
                      color="secondary"
                    ></q-btn>
                  </v-slot:append>
                </q-input>
              </div>
              <div class="col-12 text-right">
                <q-btn
                  flat
                  no-caps
                  size="12pt"
                  dense
                  @click="openRegisterSection(2)"
                  :label="$t('recovery')"
                ></q-btn>
              </div>
              <div class="col-12 q-mt-lg">
                <q-btn
                  rounded
                  type="submit"
                  dense
                  class="full-width"
                  unelevated
                  :loading="loading"
                  size="12pt"
                  no-caps
                  color="secondary"
                  :label="$t('loginBtn')"
                ></q-btn>
              </div>
              <div class="col-12 text-center q-mt-lg">
                <p class="font-12 weight-600">
                  {{ $t('dontHaveAccount') }}
                  <q-btn
                    dense
                    unelevated
                    flat
                    size="12pt"
                    @click="openRegisterSection(1)"
                    no-caps
                    color="black"
                    :label="$t('registerBtn')"
                  ></q-btn>
                </p>
              </div>
            </q-form>
          </section>
        </div>
        <div class="col-12 col-sm-6 col-md-6">
          <section class="full-width register-row">
            <q-form ref="signUpForm" @submit="doSingUp" class="row q-px-xl">
              <div class="col-12 q-pt-md">
                <p class="title">
                  {{ $t('registerCaption') }}
                  <q-icon name="img:/images/dedos.png"></q-icon>
                </p>
                <p class="subtitle" style="margin-top: -10px">
                  {{ $t('signUp') }}
                </p>
              </div>
              <div class="col-12">
                <label for="">{{ $t('username') }}</label>
                <q-input
                  rounded
                  color="primary"
                  placeholder="Jhondoe"
                  lazy-rules
                  :rules="[(vall) => !!vall || $t('required')]"
                  dense
                  outlined
                  v-model="registerData.username"
                ></q-input>
              </div>
              <div class="col-12">
                <label for="">{{ $t('name') }}</label>
                <q-input
                  rounded
                  color="primary"
                  placeholder="Jhon doe"
                  lazy-rules
                  :rules="[(vall) => !!vall || $t('required')]"
                  dense
                  outlined
                  v-model="registerData.name"
                ></q-input>
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
                  v-model="registerData.email"
                ></q-input>
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
                  v-model="registerData.password"
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
              <div class="col-12 q-mt-lg">
                <q-btn
                  rounded
                  type="submit"
                  dense
                  class="full-width"
                  unelevated
                  :loading="loading"
                  size="12pt"
                  no-caps
                  color="secondary"
                  :label="$t('registerBtn')"
                ></q-btn>
              </div>
              <div class="col-12 text-center q-mt-lg">
                <p class="font-12 weight-600">
                  {{ $t('youHaveAccount') }}
                  <q-btn
                    dense
                    unelevated
                    flat
                    size="12pt"
                    @click="openRegisterSection(0)"
                    no-caps
                    color="black"
                    :label="$t('loginBtn')"
                  ></q-btn>
                </p>
              </div>
            </q-form>
          </section>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { LoginData, RegisterData } from 'src/interfaces/AuthInterface';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from 'src/stores/auth';
import { notification } from 'src/boot/notification';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginComponent',
  components: {},
  setup() {
    // data
    const store = useAuthStore();
    const bgColor = ref('bg-pink-5');
    const passwordType = ref<boolean>(false);
    const loginData = ref<LoginData>({
      username: '',
      password: '',
    });
    const registerData = ref<RegisterData>({
      username: '',
      password: '',
      email: '',
      name: '',
      last_name: '',
    });
    const typeForm = ref<number>(0);
    const { t } = useI18n();
    const loading = ref<boolean>(false);
    const router = useRouter();
    const signUpForm = ref();

    // computed
    const user = computed(() => {
      return store.user;
    });

    // methods
    const doLogin = async () => {
      loading.value = true;
      try {
        const data = await store.doLogin(loginData.value);
        if (data?.success) {
          notification('positive', data ? data.message : '', 'primary');
          loginData.value = {
            username: '',
            password: '',
          };
          router.push({
            name: 'dasboard',
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const doSingUp = async () => {
      loading.value = true;
      try {
        const data = await store.doSignUp(registerData.value);
        if (data?.success) {
          notification('positive', data ? data.message : '', 'primary');
          registerData.value = {
            username: '',
            password: '',
            email: '',
            name: '',
          };
          signUpForm.value.reset();
          setTimeout(() => {
            typeForm.value = 0;
          }, 500);
          const check: any = document.getElementById('flip');
          check.checked = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const showPassword = () => {
      passwordType.value = !passwordType.value;
    };

    const openRegisterSection = (type: number) => {
      const check: any = document.getElementById('flip');
      if (check) {
        if (type === 0)
          setTimeout(() => {
            typeForm.value = type;
          }, 500);
        else
          setTimeout(() => {
            typeForm.value = type;
          }, 500);
        check.checked = check.checked ? false : true;
        loginData.value = {
          username: '',
          password: '',
        };
        registerData.value = {
          username: '',
          password: '',
          email: '',
        };
      }
    };

    // custom rules validation
    const containsSpecialCharacters = (value: string) => {
      if (value) {
        const regex = /(?=.*[a-z])(?=.*[A-Z])[$@#&!*\-\w]+/;
        return regex.test(value) || t('containsCharactersSpecials');
      }
      return true;
    };

    const validateEmail = (value: string) => {
      if (value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(value) || t('emailValidation');
      }
      return true;
    };

    return {
      bgColor,
      loginData,
      passwordType,
      typeForm,
      registerData,
      loading,
      user,
      signUpForm,
      doSingUp,
      doLogin,
      showPassword,
      openRegisterSection,
      containsSpecialCharacters,
      validateEmail,
    };
  },
});
</script>
