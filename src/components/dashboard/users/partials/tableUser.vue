<template>
  <section class="row">
    <div class="col-12 col-md-4 q-pl-md font-14 weight-600">
      {{ title }}
    </div>
    <div
      class="col-12 col-md-8 q-pb-lg text-right"
      :class="{ 'q-mt-lg': $q.screen.lt.md }"
    >
      <section class="row justify-end">
        <div class="col-12 col-md-4 col-lg-3">
          <q-input
            v-model="search"
            outlined
            rounded
            :placeholder="$t('search')"
            style="margin-top: -5px"
            color="secondary"
            clearable
            debounce="1000"
            class="full-width"
            @update:model-value="doSearchUser"
            dense
          >
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </div>
        <div
          class="col-12 col-md-3"
          :class="{ 'q-pl-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
          v-if="utils.validatePermission('create-user')"
        >
          <q-btn
            @click="openModalForm"
            rounded
            class="full-width"
            size="12pt"
            style="margin-top: -5px"
            no-caps
            :label="$t('userAddBtn')"
            color="secondary"
            unelevated
          >
            <q-tooltip class="bg-secondary">
              {{ $t('addUserLabel') }}
            </q-tooltip>
          </q-btn>
        </div>
      </section>
    </div>
    <div
      class="col-12 col-sm-6 col-md-4 col-lg-3 q-pa-md"
      v-for="(user, idx) in users"
      :key="idx"
    >
      <q-card class="shadow-1 round-10">
        <q-card-section horizontal class="q-pa-md">
          <div
            class="row full-width d-flex flex-center items-center align-center full-height"
          >
            <div class="col-3 col-sm-3 col-md-4">
              <q-avatar
                :size="$q.screen.lt.sm ? '25pt' : '40pt'"
                color="secondary"
                class="text-white text-uppercase"
              >
                {{ user.username.substring(0, 1) }}
              </q-avatar>
            </div>
            <div class="col-9 col-sm-9 col-md-8 ellipsis">
              <div class="row full-width">
                <div class="col-12">
                  <span class="font-12 weight-600 text-capitalize">
                    {{ user.name ? `${user.username}` : user.username }}
                  </span>
                </div>
                <div class="col-8 col-sm-8 col-md-8 text-left text-capitalize">
                  <span class="font-12 weight-600">
                    {{ user.role }}
                  </span>
                </div>
                <div class="col-4 col-sm-4 col-md-4" style="margin-top: -30px">
                  <div class="row">
                    <div
                      class="col-12"
                      v-if="utils.validatePermission('show-user')"
                    >
                      <q-btn
                        color="secondary"
                        flat
                        dense
                        no-caps
                        @click="doShowUser(user)"
                        rounded
                        class="float-right"
                        icon="visibility"
                      >
                        <q-tooltip class="bg-secondary">
                          {{ $t('edit') }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div
                      class="col-12"
                      v-if="utils.validatePermission('delete-user')"
                    >
                      <q-btn
                        color="red"
                        flat
                        dense
                        no-caps
                        rounded
                        class="float-right"
                        icon="delete"
                        @click="deleteUser(user._id, idx)"
                      >
                        <q-tooltip class="bg-red">
                          {{ $t('delete') }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="modalForm" @before-hide="clearUser">
      <q-card class="round-10 user-add-card">
        <q-card-section class="title text-secondary">
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
          <formUserVue :userData="user" @close-modal="openModalForm" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { useQuasar } from 'quasar';
import { notification } from 'src/boot/notification';
import { ResponseObj } from 'src/interfaces/Api';
import { User } from 'src/interfaces/UserInterface';
import { useUsersStore } from 'src/stores/users';
import { Utils } from 'src/utils/utils';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import formUserVue from './formUser.vue';

export default defineComponent({
  name: 'UserMainComponentTable',
  components: {
    formUserVue,
  },
  props: {
    users: {
      type: Array<User>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  emits: ['do-search'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const route = useRoute();
    const filter = ref<string>('');
    const columns = ref<any>([
      {
        name: 'username',
        align: 'center',
        label: t('username'),
        field: 'username',
        sortable: true,
      },
      {
        name: 'name',
        align: 'center',
        label: t('name'),
        field: (row: User) => (row.name ? row.name : '-'),
        sortable: true,
      },
      {
        name: 'lasName',
        align: 'center',
        label: t('lasName'),
        field: (row: User) => (row.last_name ? row.last_name : '-'),
        sortable: true,
      },
    ]);
    const rows = ref<User[]>([]);
    const search = ref<string>('');
    const modalForm = ref<boolean>(false);
    const user = ref<User>({
      username: '',
      name: '',
      last_name: '',
      email: '',
      password: '',
    });
    const q = useQuasar();
    const userStore = useUsersStore();
    const utils = new Utils('aside');

    // methods
    const doSearchUser = () => {
      emit('do-search', search.value);
    };

    const openModalForm = () => {
      modalForm.value = !modalForm.value;
    };

    const doShowUser = (data: User) => {
      delete data.password;
      user.value = data;
      openModalForm();
    };

    const deleteUser = (id: string | undefined, idx: number): void => {
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
        const response: ResponseObj = (await userStore.doDeleteUsers(
          id,
          idx
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'secondary');
        }
      } catch (error) {}
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

    // life cicle
    onBeforeMount(() => {
      if (route.query.search) {
        search.value = route.query.search as string;
      }
    });

    // return
    return {
      columns,
      rows,
      filter,
      search,
      modalForm,
      user,
      utils,
      openModalForm,
      doSearchUser,
      doShowUser,
      deleteUser,
      clearUser,
    };
  },
});
</script>
