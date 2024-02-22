<template>
  <q-list class="relative drawer-list">
    <q-item>
      <q-item-section>
        <q-img src="/images/logo.webp" alt="logo webcrew"></q-img>
      </q-item-section>
    </q-item>
    <q-item
      clickable
      to="/dashboard"
      class="item-admin q-py-none q-px-sm q-mt-md"
      :class="{ active: route.path === '/dashboard' }"
    >
      <q-item-section avatar class="q-pa-none">
        <q-icon size="16pt" name="img:/images/home.svg" color="white"></q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label class="font-12 item-list">
          {{ $t('home') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      clickable
      to="/dashboard/catalogs?page=1&perPage=12"
      class="item-admin q-py-none q-px-sm q-mt-md"
      v-if="utils.validatePermission('list-catalogues')"
      :class="{
        active:
          route.path === '/dashboard/catalogs' || route.path.includes('pages'),
      }"
    >
      <q-item-section avatar class="q-pa-none">
        <q-icon
          size="17pt"
          name="img:/images/catalog.svg"
          color="white"
        ></q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label class="font-12 item-list">
          {{ $t('catalog') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      clickable
      to="/dashboard/products?page=1&perPage=12"
      class="item-admin q-py-none q-px-sm q-mt-md"
      v-if="utils.validatePermission('list-products')"
      :class="{ active: route.path === '/dashboard/products' }"
    >
      <q-item-section avatar class="q-pa-none">
        <q-icon
          size="20pt"
          name="img:/images/inventory.svg"
          color="white"
        ></q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label class="font-12 item-list">
          {{ $t('product') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      clickable
      to="/dashboard/categories?page=1&perPage=12"
      class="item-admin q-py-none q-px-sm q-mt-md"
      v-if="utils.validatePermission('list-categories')"
      :class="{ active: route.path === '/dashboard/categories' }"
    >
      <q-item-section avatar class="q-pa-none">
        <q-icon
          size="21pt"
          name="img:/images/category.svg"
          color="white"
        ></q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label class="font-12 item-list">
          {{ $t('category') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-if="utils.validatePermission('list-user')"
      clickable
      to="/dashboard/users?page=1&perPage=12"
      class="item-admin q-py-none q-px-sm q-mt-md"
      :class="{ active: route.path === '/dashboard/users' }"
    >
      <q-item-section avatar class="q-pa-none">
        <q-icon size="19pt" name="img:/images/users.svg" color="white"></q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label class="font-12 item-list">
          {{ $t('users') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      class="item-admin q-px-none q-mb-md absolute-bottom profile-card shadow-1"
    >
      <section>
        <q-btn
          icon="exit_to_app"
          flat
          dense
          rounded
          @click="doLogout"
          v-if="profile.user_id"
          class="absolute-top exit-app-btn"
        >
          <q-tooltip class="bg-secondary">
            {{ $t('signOut') }}
          </q-tooltip>
        </q-btn>
        <q-avatar color="white" v-if="profile.user_id">
          <img
            :src="
              profile &&
              profile.profile_pictury &&
              !profile.profile_pictury.includes('s3.us-east-2')
                ? `${url}/${profile.profile_pictury}`
                : profile.profile_pictury
            "
            spinner-color="secondary"
            class="profile-image"
          />
        </q-avatar>
        <span class="name-label">
          {{ user.name }}
        </span>
        <span class="q-mb-sm"> {{ $t('user') }} </span>
        <q-btn
          unelevated
          color="white"
          to="/dashboard/profile"
          class="round-10 full-width absolute-bottom"
          :label="$t('profile')"
          no-caps
          text-color="black"
        ></q-btn>
      </section>
    </q-item>
  </q-list>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { Utils } from 'src/utils/utils';
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'ListAdminDashboard',
  components: {},
  setup() {
    // data
    const q = useQuasar();
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const store = useAuthStore();
    const authStore = useAuthStore();
    const utils = new Utils('aside');
    const url = `${process.env.API_URL}/profile`;

    // computed
    const user = computed(() => {
      return store.user;
    });

    const profile = computed(() => {
      return store.profile;
    });

    // methods
    const doLogout = () => {
      q.dialog({
        dark: false,
        title: t('signOut'),
        message: t('signOutLabel'),
        cancel: true,
        persistent: true,
      }).onOk(() => {
        confirLogout();
      });
    };

    const confirLogout = () => {
      const logout = authStore.doLogout();
      if (logout)
        router.push({
          name: 'login',
        });
    };

    const listProfile = async () => {
      try {
        const userId = user.value.parent ? user.value.parent : user.value._id;
        await store.listProfile(userId);
      } catch (error) {}
    };

    // hook
    onBeforeMount(async () => {
      if (!profile.value.user_id) {
        await listProfile();
      }
    });

    // return data
    return {
      url,
      user,
      route,
      utils,
      profile,
      doLogout,
      confirLogout,
    };
  },
});
</script>

<style lang="sass" scoped>
.separator
  bottom: 70px
</style>
