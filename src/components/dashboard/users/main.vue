<template>
  <section class="row q-px-sm">
    <div class="col-12">
      <TableUser
        :title="$t('usersLabel')"
        :loading="loading"
        :users="users"
        @do-search="doSearch"
      />
    </div>
    <div class="col-12 no-pages" v-if="users.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveUsers') }}.</p>
    </div>
    <div class="col-12 q-mt-xl text-center" v-if="totalPage > 1">
      <q-btn
        rounded
        color="secondary"
        :label="$q.screen.gt.sm ? $t('back') : ''"
        :disabled="parseInt(page) === 1"
        @click="loadMinusData"
        icon="arrow_back_ios"
        unelevated
        :style="$q.screen.gt.sm ? 'width: 160px' : ''"
        class="q-mr-md"
        no-caps
      ></q-btn>
      <q-btn
        rounded
        color="secondary"
        :style="$q.screen.gt.sm ? 'width: 160px' : ''"
        class="q-ml-md"
        :label="$q.screen.gt.sm ? $t('next') : ''"
        icon-right="arrow_forward_ios"
        :disabled="parseInt(page) === totalPage"
        @click="loadMoreData"
        unelevated
        no-caps
      ></q-btn>
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { PaginationInterface } from 'src/interfaces/Api';
import { useUsersStore } from 'src/stores/users';
import {
  defineComponent,
  onBeforeMount,
  computed,
  ref,
  onBeforeUnmount,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TableUser from './partials/tableUser.vue';

export default defineComponent({
  name: 'UserMainComponent',
  components: {
    TableUser,
  },
  setup() {
    // data
    const usersStore = useUsersStore();
    const route = useRoute();
    const router = useRouter();
    const loading = ref<boolean>(false);
    const page = ref<any>(1);

    // computed
    const users = computed(() => {
      return usersStore.users;
    });

    const totalPage = computed(() => {
      return usersStore.totalPage;
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
      const page = route.query.page ? route.query.page : 1;
      const perPage = route.query.perPage ? route.query.perPage : 1;
      router.push({
        name: 'users',
        query: {
          search,
          page,
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

    // life cycle
    onBeforeMount(async () => {
      await listUsers();
    });

    onBeforeUnmount(() => {
      usersStore.clearUsers();
    });

    // return data
    return {
      users,
      loading,
      totalPage,
      page,
      doSearch,
      loadMoreData,
      loadMinusData,
    };
  },
});
</script>
