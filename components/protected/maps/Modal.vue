<template>
  <v-dialog v-model="dialog" max-width="1000px" class="pa-4">
    <v-container>
      <v-row>
        <v-col :md="isMyPlan ? 7 : 12">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th width="70%" class="text-left">マップ名</th>
                  <th v-if="isMyPlan" width="30%"  class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="map in maps" :key="map.name">
                  <td>
                    {{ map.name }}
                    <v-chip x-small>{{map.address ? map.address : 'アドレスなし'}}</v-chip>
                  </td>
                  <td>
                    <MapsModalButton :map="map"></MapsModalButton>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col v-if="isMyPlan" md="5">
          <v-card>
            <v-card-title>
              <span class="text-h5">マップ作成</span>
            </v-card-title>

            <ValidationObserver v-slot="{ invalid }">
              <v-card-text>
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="max:50|required"
                  name="名前"
                >
                  <v-text-field
                    v-model="params.name"
                    label="マップ名"
                    required
                    :error-messages="errors[0]"
                  ></v-text-field>
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  name="GoogleMap使用"
                >
                  <v-checkbox
                    v-model="params.isGoogleMap"
                    label="GoogleMap使用"
                    :error-messages="errors[0]"
                    required
                  ></v-checkbox>
                </ValidationProvider>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :disabled="invalid"
                  text
                  @click="createMap"
                >
                  Create
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  useRoute,
  computed,
  reactive,
} from '@nuxtjs/composition-api'
import { MapsStore, UserStore, PlansStore } from '~/store'
import { AppBarDialogKey } from '~/types/injection-key'

export default defineComponent({
  setup() {
    const route = useRoute()
    const params = reactive({
      name: '',
      isGoogleMap: false
    })

    const createMap = async () => {
      await MapsStore.createMap({
        planId: route.value.params.id,
        name: params.name,
        isGoogleMap: params.isGoogleMap
      })
      params.name = ''
      params.isGoogleMap = false
      MapsStore.setActiveIndex(MapsStore.maps.length - 1)
    }

    return {
      params,
      createMap,
      dialog: inject(AppBarDialogKey),
      maps: computed(() => MapsStore.maps),
      isMyPlan: computed(() => {
        return PlansStore.currentPlan?.userId === UserStore.currentUser.id
      }),
    }
  },
})
</script>
