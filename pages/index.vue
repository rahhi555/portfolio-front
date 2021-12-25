<template>
  <v-container
    id="pricing-view"
    class="fill-height mx-auto text-center"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        class="mb-16"
        cols="12"
      >
        <h1 class="mb-12 heading">
          MiniMap
        </h1>

        <div class="text-body-1 font-weight-light grey--text text--lighten-2">
          「進行状況」を「場所」と共に可視化する
        </div>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  head: {
    titleTemplate: null,
    title: 'minimap'
  }
}
</script>

<style lang="sass">
#pricing-view
  max-width: 1140px

.heading
  font-family: 'Domine', 'Roboto', sans-serif
  font-size: 3.5em
  font-weight: 400
</style>
