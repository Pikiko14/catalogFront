<template>
  <section class="custom-aside shadow-1">
    <q-list class="relative">
      <q-item
        clickable
        to="/dashboard"
        class="item-admin q-pa-none q-mt-md"
        :class="{ active: route.path === '/dashboard' }"
      >
        <q-item-section class="q-pa-none">
          <q-avatar style="margin-left: -1px">
            <q-icon
              size="16pt"
              name="img:/images/home.svg"
              color="white"
            ></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('home') }}
        </q-tooltip>
      </q-item>
      <q-item
        clickable
        to="/dashboard/catalogs?page=1&perPage=12"
        class="item-admin q-pa-none q-mt-md"
        v-if="utils.validatePermission('list-catalogues')"
        :class="{ active: route.path === '/dashboard/catalogs' }"
      >
        <q-item-section class="q-pa-none">
          <q-avatar style="margin-left: -1px">
            <q-icon
              size="19pt"
              name="img:/images/catalog.svg"
              color="white"
            ></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('catalog') }}
        </q-tooltip>
      </q-item>
      <q-item
        clickable
        to="/dashboard/products?page=1&perPage=12"
        class="item-admin q-pa-none q-mt-md"
        v-if="utils.validatePermission('list-products')"
        :class="{ active: route.path === '/dashboard/products' }"
      >
        <q-item-section class="q-pa-none">
          <q-avatar style="margin-left: -1px">
            <q-icon
              size="22pt"
              name="img:/images/inventory.svg"
              color="white"
            ></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('product') }}
        </q-tooltip>
      </q-item>
      <q-item
        clickable
        to="/dashboard/categories?page=1&perPage=12"
        class="item-admin q-pa-none q-mt-md"
        v-if="utils.validatePermission('list-categories')"
        :class="{ active: route.path === '/dashboard/categories' }"
      >
        <q-item-section class="q-pa-none">
          <q-avatar style="margin-left: -1px">
            <q-icon
              size="24pt"
              name="img:/images/category.svg"
              color="white"
            ></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('category') }}
        </q-tooltip>
      </q-item>
      <q-item
        v-if="utils.validatePermission('list-user')"
        clickable
        to="/dashboard/users?page=1&perPage=12"
        class="item-admin q-pa-none q-mt-md"
        :class="{ active: route.path === '/dashboard/users' }"
      >
        <q-item-section class="q-pa-none">
          <q-avatar style="margin-left: -1px">
            <q-icon
              size="21pt"
              name="img:/images/users.svg"
              color="white"
            ></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('users') }}
        </q-tooltip>
      </q-item>
      <q-item
        v-if="utils.validatePermission('list-user')"
        clickable
        to="/dashboard/profile"
        class="item-admin q-pa-none q-mt-md"
        :class="{ active: route.path === '/dashboard/profile' }"
      >
        <q-item-section class="q-pa-none">
          <q-avatar style="margin-left: -1px">
            <q-icon
              size="24pt"
              name="img:/images/person.svg"
              color="white"
            ></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('profile') }}
        </q-tooltip>
      </q-item>
      <q-separator
        color="white"
        class="absolute-bottom separator"
      ></q-separator>
      <q-item
        @click="doLogout"
        clickable
        class="item-admin q-px-none q-mb-md absolute-bottom"
      >
        <q-item-section>
          <q-avatar>
            <q-icon name="img:/images/logout.svg" color="white"></q-icon>
          </q-avatar>
        </q-item-section>
        <q-tooltip
          class="bg-secondary"
          anchor="center right"
          self="center left"
          :offset="[20, 0]"
        >
          {{ $t('signOut') }}
        </q-tooltip>
      </q-item>
    </q-list>
  </section>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { Utils } from 'src/utils/utils';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'ListAdminDashboard',
  components: {},
  setup() {
    // data
    const q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();
    const { t } = useI18n();
    const route = useRoute();
    const utils = new Utils('aside');

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

    // return data
    return {
      confirLogout,
      doLogout,
      route,
      utils,
    };
  },
});
</script>

<style lang="sass" scoped>
.separator
  bottom: 70px
</style>
