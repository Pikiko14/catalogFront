<template>
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
            {{ initial }}
          </q-avatar>
        </div>
        <div class="col-9 col-sm-9 col-md-8 ellipsis">
          <div class="row full-width">
            <div class="col-12">
              <span class="font-12 weight-600 text-capitalize">
                {{ title }}
              </span>
            </div>
            <div class="col-8 col-sm-8 col-md-8 text-left text-capitalize">
              <span class="font-12 weight-500">
                {{ subtitle }}
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
                    @click="doShowData"
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
                    @click="doDeleteData(data._id, idx)"
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
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { defineComponent } from 'vue';
import { Utils } from 'src/utils/utils';

export default defineComponent({
  name: 'SimpleCard',
  props: {
    data: {
      type: Object as () => any,
      default: () => {
        return {};
      },
    },
    idx: {
      type: Number,
      default: () => 0,
    },
    initial: {
      type: String,
      default: () => '',
    },
    title: {
      type: String,
      default: () => '',
    },
    subtitle: {
      type: String,
      default: () => '',
    },
  },
  emits: ['delete-data', 'show-data'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    // data
    const utils = new Utils('simpleCard');
    const { data, idx } = props;

    // methods
    const doDeleteData = (id: string, idx: number) => {
      try {
        emit('delete-data', { id, idx });
      } catch (error) {}
    };

    const doShowData = () => {
      try {
        emit('show-data', { data, idx });
      } catch (error) {}
    };

    // return
    return {
      utils,
      doShowData,
      doDeleteData,
    };
  },
});
</script>
