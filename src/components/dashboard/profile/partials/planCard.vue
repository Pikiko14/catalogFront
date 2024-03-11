<template>
  <q-card class="round-10 plan-card q-py-md">
    <q-chip
      v-if="
        subscription &&
        subscription.plan_id === plan._id &&
        subscription.date_end &&
        subscription?.date_end >= now &&
        !subscription.expired_at
      "
      square
      class="active-badge"
    >
      <div class="full-width text-center">
        {{ $t('planActive') }}
      </div>
    </q-chip>
    <q-card-section class="row">
      <div class="col-12 text-center">
        <span class="font-14 text-bold text-black">{{ $t(plan.name) }}</span>
      </div>
      <div class="col-12 text-center q-mt-xs">
        <span class="font-12 text-secondary text-bold">
          {{ utils.formatPrice(plan.price_month) }} / {{ $t('montly') }}
          <span class="font-10"
            >({{ utils.formatPrice(plan.price_year) }} /
            {{ $t('yearly') }})</span
          >
        </span>
      </div>
      <div class="q-mt-sm text-center col-12">
        <span class="plan-separator"></span>
      </div>
    </q-card-section>
    <q-card-section class="plan-characteristics">
      <q-list dense>
        <q-item
          v-for="(characteristic, idx) in plan.characteristics"
          :key="idx"
        >
          <q-item-section avatar>
            <q-icon
              v-if="
                (characteristic.type_characteristics === 'boolean' &&
                  characteristic.quantity === 0) ||
                (characteristic.type_characteristics === 'quantity' &&
                  characteristic.quantity === 0)
              "
              color="red"
              name="close"
            />
            <q-icon v-else color="secondary" name="done" />
          </q-item-section>
          <q-item-section style="margin-left: -20px">
            <span class="font-12">
              {{ $t(characteristic.description) }}
              <span
                v-if="
                  characteristic.type_characteristics === 'quantity' &&
                  characteristic.quantity > 0
                "
              >
                <span v-if="characteristic.quantity !== 1000000">
                  (x{{ characteristic.quantity }})
                </span>
                <span v-else>(∞)</span>
              </span>
            </span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn
        no-caps
        unelevated
        @click="openModalToPayment"
        :loading="loadingSubscription"
        :label="$t('subscriptionBtn')"
        color="secondary"
        id="planPaymentButton"
        v-if="
          !subscription ||
          subscription.plan_id !== plan._id ||
          subscription.expired_at
        "
        rounded
      ></q-btn>
      <q-btn
        no-caps
        unelevated
        @click="cancelSubscription"
        :label="$t('cancel')"
        :loading="loading"
        color="red"
        v-if="
          subscription &&
          subscription.plan_id === plan._id &&
          subscription.date_end &&
          subscription.date_end > now &&
          !subscription.expired_at
        "
        rounded
      ></q-btn>
    </q-card-section>
    <!--Modal subscription-->
    <q-dialog v-model="modalSubscription">
      <q-card class="round-10 complete-subscription user-add-card">
        <q-card-section class="text-secondary">
          <span class="title text-uppercase">
            {{ $t('suscribeModalheader') }}
            <span class="font-14 text-bold">{{ $t(plan.name) }}</span>
          </span>
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
        <q-card-section class="q-px-none" style="margin-top: -15px">
          <div class="total-payment">
            <span v-if="typeSubscription === 'Monthly'">
              {{ utils.formatPrice(plan.price_month) }}
            </span>
            <span v-else>
              {{ utils.formatPrice(plan.price_year) }}
            </span>
          </div>
          <q-list dense>
            <q-item
              v-for="(characteristic, idx) in plan.characteristics"
              :key="idx"
            >
              <q-item-section avatar>
                <q-icon
                  v-if="
                    (characteristic.type_characteristics === 'boolean' &&
                      characteristic.quantity === 0) ||
                    (characteristic.type_characteristics === 'quantity' &&
                      characteristic.quantity === 0)
                  "
                  color="red"
                  name="close"
                />
                <q-icon v-else color="secondary" name="done" />
              </q-item-section>
              <q-item-section style="margin-left: -20px">
                <span class="font-12">
                  {{ $t(characteristic.description) }}
                  <span
                    v-if="
                      characteristic.type_characteristics === 'quantity' &&
                      characteristic.quantity > 0
                    "
                  >
                    <span v-if="characteristic.quantity !== 1000000">
                      (x{{ characteristic.quantity }})
                    </span>
                    <span v-else>(∞)</span>
                  </span>
                </span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section style="margin-top: -15px" class="row">
          <div class="col-12">
            <span class="font-12 text-bold text-black">
              {{ $t('planType') }}:
            </span>
          </div>
          <div class="col-12 q-mt-sm">
            <q-option-group
              v-model="typeSubscription"
              :options="optionsTypePlans"
              color="secondary"
              inline
            />
          </div>
        </q-card-section>
        <q-card-section style="margin-top: -15px" class="text-center">
          <q-btn
            label="Pagar"
            color="secondary"
            rounded
            @click="doSubscriptionToPlan"
            unelevated
            :loading="loading"
            no-caps
          ></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import {
  DoSubscriptionParamsInterface,
  PlanInterface,
} from 'src/interfaces/subscriptionInterface';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from 'src/stores/auth';
import { useSubscriptionStore } from 'src/stores/subscription';
import { ResponseObj } from 'src/interfaces/api';
import { Utils } from 'src/utils/utils';
import { useQuasar } from 'quasar';
import { notification } from 'src/boot/notification';

export default defineComponent({
  name: 'PlansCardProfileTab',
  props: {
    plan: {
      type: Object as () => PlanInterface,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  setup(props) {
    // data
    const q = useQuasar();
    const { t } = useI18n();
    const store = useAuthStore();
    const utils = new Utils('subscription');
    const modalSubscription = ref<boolean>(false);
    const typeSubscription = ref<string>('Monthly');
    const loadingSubscription = ref<boolean>(false);
    const storeSubscription = useSubscriptionStore();
    const optionsTypePlans = ref([
      {
        label: t('montly'),
        value: 'Monthly',
      },
      {
        label: t('yearly'),
        value: 'Yearly',
      },
    ]);
    const loading = ref<boolean>(false);

    // computed
    const user = computed(() => {
      return store.user;
    });

    const profile = computed(() => {
      return store.profile;
    });

    const subscription = computed(() => {
      return store.subscription;
    });

    const now = computed(() => {
      return store.now;
    });

    // methods
    const doSubscriptionToPlan = async () => {
      let params: DoSubscriptionParamsInterface = {
        plan_id: props.plan._id,
        auto_renew: false,
        billing_period: typeSubscription.value,
      };
      loading.value = true;
      try {
        const response = (await storeSubscription.doSubscriptionToPlan(
          params
        )) as ResponseObj;
        if (response.success) {
          params.subscription_id = response.data?._id;
          await paySubscriptionPlan(params);
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const cancelSubscription = () => {
      q.dialog({
        dark: false,
        title: t('cancelSubscription'),
        message: t('cancelSubscriptionLabel'),
        cancel: true,
        persistent: true,
      }).onOk(() => {
        confirCancelSubscription();
      });
    };

    const confirCancelSubscription = async () => {
      loading.value = true;
      try {
        const response = (await storeSubscription.disableSubscription(
          subscription.value._id
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
          store.disableSubscription();
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const paySubscriptionPlan = async (params: any) => {
      try {
        loadingSubscription.value = true;
        const handlerEpayco = window.ePayco.checkout.configure({
          key: process.env.EPAYCO_PRIVATE_KEY,
          test: process.env.EPAYCO_TEST,
        });
        const data = {
          //Parametros compra (obligatorio)
          // subscription data
          name: `Plan ${props.plan.name}`,
          description: `Suscripción al plan ${props.plan.name}, tipo de periodo ${typeSubscription.value}`,
          invoice: `plan_${props.plan.name}_${params.subscription_id}`,
          currency: 'cop',
          amount:
            typeSubscription.value === 'Monthly'
              ? props.plan.price_month
              : props.plan.price_year,
          tax_base: '0',
          tax: '0',
          country: 'co',
          lang: 'es',
          // client data
          name_billing: user.value.name,
          address_billing: profile.value.address,
          // extra data
          external: 'false',
          extra1: params.subscription_id,
          extra2: '',
          extra3: '',
          confirmation: `${process.env.API_URL}/api/v1/subscriptions/confirmation`,
          response: `${process.env.API_URL}/api/v1/subscriptions/response`,
          //atributo deshabilitación método de pago
          methodsDisable: ['SP', 'CASH', 'DP'],
        };
        handlerEpayco.open(data);
      } catch (error) {
      } finally {
        loadingSubscription.value = false;
      }
    };

    const openModalToPayment = () => {
      modalSubscription.value = !modalSubscription.value;
    };

    // return data
    return {
      openModalToPayment,
      loadingSubscription,
      modalSubscription,
      doSubscriptionToPlan,
      optionsTypePlans,
      typeSubscription,
      utils,
      subscription,
      loading,
      now,
      cancelSubscription,
    };
  },
});
</script>
