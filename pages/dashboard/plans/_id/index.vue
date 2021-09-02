<template>
  <v-row>
    <v-col max-width="100%" rounded>
      <map-base></map-base>
    </v-col>
     
  </v-row>
</template>

<script lang="ts">
import { defineComponent, useRoute, useAsync, useContext } from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import MapBase from '~/components/protected/maps/MapBase.vue'

export default defineComponent({
  components: {
    MapBase,
  },

  layout: 'protected',

  setup() {
    const { $axios } = useContext()
    
    const route = useRoute()
    const id = route.value.params.id

    const plan = useAsync(() => $axios.$get<Plan>(`/api/v1/plans/${id}`))

    return {
      id,
      plan
    }
  },
})
</script>
