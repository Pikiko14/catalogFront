<template>
  <section class="row q-px-sm" v-if="profile && profile.user_id">
    <div
      class="col-12 col-sm-5 col-md-4 col-lg-3"
      :class="{ 'q-px-md': $q.screen.gt.xs }"
    >
      <ProfileCard :profile="profile" :user="user" />
    </div>
    <div
      class="col-12 col-sm-12 col-md-8 col-lg-9"
      :class="{ 'q-px-md': $q.screen.gt.xs, 'q-mt-lg': $q.screen.lt.md }"
    >
      <BrandData
        ref="brandDataRef"
        :isEditingBrand="isEditingBrand"
        @do-save-brand="doSaveBrand"
        :profile="profile"
      />
    </div>
    <div
      class="col-12 q-mt-lg"
      v-if="utils.validatePermission('update-profile')"
      :class="{ 'q-px-md': $q.screen.gt.xs }"
    >
      <TabsProfileVue :plans="plans" />
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { Utils } from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth';
import BrandData from './partials/brandData.vue';
import ProfileCard from './partials/profileCard.vue';
import { notification } from 'src/boot/notification';
import TabsProfileVue from './partials/tabsProfile.vue';
import { useSubscriptionStore } from 'src/stores/subscription';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';

export default defineComponent({
  name: 'ProfileMainComponent',
  components: {
    ProfileCard,
    BrandData,
    TabsProfileVue,
  },
  setup() {
    //data
    const brandDataRef = ref();
    const store = useAuthStore();
    const storeSubscription = useSubscriptionStore();
    const isEditingBrand = ref<boolean>(false);
    const utils = new Utils('profile');

    // computed
    const user = computed(() => {
      return store.user;
    });

    const profile = computed(() => {
      return store.profile;
    });

    const plans = computed(() => {
      return storeSubscription.plans;
    });

    // methods
    /**
     * list profile
     */
    const listProfile = async () => {
      try {
        const userId = user.value.parent ? user.value.parent : user.value._id;
        await store.listProfile(userId);
      } catch (error) {}
    };

    /**
     * list plans
     */
    const listPlans = async () => {
      try {
        await storeSubscription.listPlans();
      } catch (error) {}
    };

    /**
     * save brand data
     * @param params
     */
    const doSaveBrand = async (params: any) => {
      isEditingBrand.value = true;
      try {
        params.user_id = user.value.parent || user.value._id;
        const response = await store.doSaveBrandData(params);
        if (response?.success) {
          brandDataRef.value.enableEdit = false;
          notification('positive', response?.message, 'secondary');
        }
      } catch (error) {
      } finally {
        isEditingBrand.value = false;
      }
    };

    // life cycle
    onBeforeMount(async () => {
      if (!profile.value.user_id) {
        await listProfile();
      }
      await listPlans();
    });

    // return data
    return {
      profile,
      user,
      isEditingBrand,
      brandDataRef,
      plans,
      utils,
      doSaveBrand,
    };
  },
});
</script>
