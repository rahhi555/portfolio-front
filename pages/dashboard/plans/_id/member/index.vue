<template>
  <v-sheet color="white" elevation="1">
    <v-row>
      <v-col>
        <member-card></member-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import MemberCard from '~/components/protected/members/MemberCard.vue'
import { AppBarFuncKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    MemberCard
  },

  layout: 'protected',

  setup(){
    const test = () => {
      console.log('test')
      return 'test'
    }

    const appBarFunc = inject(AppBarFuncKey)
    appBarFunc!.value = { func: test, name: 'testFunc' }
  }
})
</script>
