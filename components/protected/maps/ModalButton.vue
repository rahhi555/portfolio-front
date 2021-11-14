<template>
  <v-row>
    <app-btn
      color="success"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
      @click="dialog = true"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-square-edit-outline'" />
        </template>
        <span>編集</span>
      </v-tooltip>
    </app-btn>

    <app-btn
      :color="map.isGoogleMap ? 'success' : '#cccccc'"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
      @click="toggleIsGoogleMap(map)"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-if="map.isGoogleMap" v-bind="attrs" v-on="on" v-text="'mdi-checkbox-marked-outline'" />
          <v-icon v-else v-bind="attrs" v-on="on" v-text="'mdi-checkbox-blank-outline'" />
        </template>
        <span v-if="map.isGoogleMap">GoogleMap非使用</span>
        <span v-else>GoogleMap使用</span>
      </v-tooltip>
    </app-btn>

    <app-btn
      color="error"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
      @click="deleteMap(map)"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-delete-outline'" />
        </template>
        <span>削除</span>
      </v-tooltip>
    </app-btn>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> マップ編集 </v-card-title>

        <ValidationObserver v-slot="{ invalid }">
          <v-card-text>
            <ValidationProvider
              v-slot="{ errors }"
              rules="max:50|required"
              name="名前"
            >
              <v-text-field
                v-model="mapParams.name"
                label="マップ名"
                required
                :error-messages="errors[0]"
              ></v-text-field>
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
              @click="updateMap"
            >
              Update
            </v-btn>
          </v-card-actions>
        </ValidationObserver>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, useContext } from '@nuxtjs/composition-api'
import { Map } from 'interface'
import { MapsStore, SnackbarStore } from '~/store'

export default defineComponent({
  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const dialog = ref(false)

    const deleteMap = (map: Map) => {
      if (!window.confirm('マップを削除してもよろしいですか？')) {
        window.alert('キャンセルしました')
        return
      }
      MapsStore.deleteMap(map.id)
    }

    const mapParams = Object.assign({}, props.map) as Map
    reactive(mapParams)
    watch(dialog, () => {
      mapParams.name = props.map.name
    })

    const updateMap = async () => {
      const { id, name } = mapParams as { id: number; name: string }
      const { name: propsName } = props.map

      if (name === propsName) {
        SnackbarStore.visible({
          color: 'warning',
          message: '値が更新されていません',
        })
        return
      }

      await MapsStore.updateMap({ id, name })
      dialog.value = false
    }

    const { $googleMap } = useContext()
    const toggleIsGoogleMap = async () => {
      const { id } = mapParams
      const isGoogleMap = !props.map.isGoogleMap
      await MapsStore.updateMap({ id, isGoogleMap })
      $googleMap.isGoogleMapEditMode.value = false
    }

    return {
      dialog,
      deleteMap,
      updateMap,
      mapParams,
      toggleIsGoogleMap
    }
  },
})
</script>
