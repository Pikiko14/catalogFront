<template>
  <section class="row q-px-sm">
    <div class="col-12">
      <TableCreWeb
        :data="users"
        :rows="rowsTable"
        :showSearch="true"
        :totalRows="totalUsers"
        :title="$t('usersLabel')"
        :permission="'create-user'"
        @do-search="doSearch"
        @do-edit="doEditUser"
        @do-delete="doDeleteUser"
        @open-modal="openModalForm"
        @do-pagination="doPaginationUsers"
      />
    </div>

    <!--no content image-->
    <div class="col-12 no-pages" v-if="users.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveUsers') }}.</p>
    </div>
    <!--End no content image-->

    <!--form modal -->
    <q-dialog v-model="modalForm" @before-hide="clearUser">
      <q-card class="round-10 user-add-card">
        <q-card-section class="title text-primary">
          <span v-if="!user._id">{{ $t('addUserLabel') }}</span>
          <span v-else>{{ $t('updateUserLabel') }}</span>
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
          <FormUserVue :userData="user" @close-modal="openModalForm" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end form modal-->
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { PaginationInterface, ResponseObj } from 'src/interfaces/Api';
import { useUsersStore } from 'src/stores/users';
import {
  defineComponent,
  onBeforeMount,
  computed,
  ref,
  onBeforeUnmount,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User } from 'src/interfaces/UserInterface';
import TableCreWeb from 'src/components/general/tableCreWeb.vue';
import FormUserVue from './partials/formUser.vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { notification } from 'src/boot/notification';

export default defineComponent({
  name: 'UserMainComponent',
  components: {
    TableCreWeb,
    FormUserVue,
  },
  setup() {
    // data
    const q = useQuasar();
    const { t } = useI18n();
    const route = useRoute();
    const page = ref<any>(1);
    const router = useRouter();
    const usersStore = useUsersStore();
    const loading = ref<boolean>(false);
    const modalForm = ref<boolean>(false);
    const user = ref<User>({
      username: '',
      name: '',
      last_name: '',
      email: '',
      password: '',
    });
    const rowsTable = [
      {
        name: 'username',
        required: true,
        label: t('username'),
        align: 'left',
        field: (row: User) => row.username,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        name: 'name',
        required: true,
        label: t('name'),
        align: 'left',
        field: (row: User) => `${row.name} ${row.last_name}`,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        name: 'role',
        required: true,
        label: t('rol'),
        align: 'left',
        field: (row: User) => row.role,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        name: 'options',
        required: true,
        label: t('options'),
        align: 'center',
        sortable: false,
      },
    ];

    // computed
    const users = computed(() => {
      return usersStore.users;
    });

    const totalPage = computed(() => {
      return usersStore.totalPage;
    });

    const totalUsers = computed(() => {
      return usersStore.totalUsers;
    });

    // methods
    const listUsers = async () => {
      const query: PaginationInterface = {
        page: route.query.page ? (route.query.page as unknown as number) : 1,
        perPage: route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12,
        search: route.query.search ? (route.query.search as string) : '',
      };
      page.value = query.page;
      const params = `?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
      try {
        await usersStore.doGetUsers(params);
      } catch (error) {
      } finally {
      }
    };

    const doSearch = async (search: string) => {
      const perPage = route.query.perPage ? route.query.perPage : 1;
      router.push({
        name: 'users',
        query: {
          search,
          page: 1,
          perPage,
        },
      });
    };

    const loadMoreData = async () => {
      if (page.value <= totalPage.value) {
        const search = route.query.search ? route.query.search : '';
        const perPage = route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12;
        const pages: any = route.query.page
          ? (route.query.page as unknown as number)
          : 12;
        router.push({
          name: 'users',
          query: {
            search,
            page: parseInt(pages) + 1,
            perPage,
          },
        });
      }
    };

    const loadMinusData = async () => {
      if (page.value <= totalPage.value) {
        const search = route.query.search ? route.query.search : '';
        const perPage = route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12;
        const pages: any = route.query.page
          ? (route.query.page as unknown as number)
          : 12;
        router.push({
          name: 'users',
          query: {
            search,
            page: parseInt(pages) - 1,
            perPage,
          },
        });
      }
    };

    const clearUser = () => {
      user.value = {
        username: '',
        name: '',
        last_name: '',
        email: '',
        password: '',
      };
    };

    const openModalForm = () => {
      modalForm.value = !modalForm.value;
    };

    const doEditUser = (row: User) => {
      delete row.password;
      user.value = JSON.parse(JSON.stringify(row));
      openModalForm();
    };

    const doDeleteUser = (id: string, idx: number) => {
      q.dialog({
        dark: false,
        title: t('delete'),
        message: t('deleteUserLabel'),
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await confirmDeleteuser(id, idx);
      });
    };

    const confirmDeleteuser = async (
      id: string | undefined,
      idx: number
    ): Promise<void> => {
      try {
        const response: ResponseObj = (await usersStore.doDeleteUsers(
          id,
          idx
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
        }
      } catch (error) {}
    };

    const doPaginationUsers = async (pagination: any) => {
      const search = route.query.search ? route.query.search : '';
      router.push({
        name: 'users',
        query: {
          page: pagination.page || 1,
          perPage: pagination.rowsPerPage || 12,
          search,
        },
      });
    };

    // life cycle
    onBeforeMount(async () => {
      await listUsers();
    });

    onBeforeUnmount(() => {
      usersStore.clearUsers();
    });

    // return data
    return {
      page,
      user,
      users,
      loading,
      rowsTable,
      doSearch,
      clearUser,
      totalPage,
      modalForm,
      loadMoreData,
      loadMinusData,
      openModalForm,
      totalUsers,
      doEditUser,
      doDeleteUser,
      doPaginationUsers,
    };
  },
});
</script>
