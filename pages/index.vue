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
        <h1 class="mb-12 text-h2 font-weight-light">
          Pick the best plan for you
        </h1>

        <div class="text-body-1 font-weight-light grey--text text--lighten-2">
          You have Free Unlimited Updates and Premium Support on&nbsp;<br class="hidden-sm-and-down">each package.
        </div>
      </v-col>

      <template v-for="(plan, i) in plans">
        <v-col
          :key="i"
          class="d-flex"
          cols="12"
          sm="6"
          md="3"
        >
          <plan-card :plan="plan" />
        </v-col>

        <v-col
          v-if="(i === 1 && $vuetify.breakpoint.smAndDown) && i + 1 !== plans.length"
          :key="`divider-${i}`"
          class="pa-6"
          cols="12"
        >
          <v-divider />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PricingView',

    data: () => ({
      plans: [
        {
          heading: 'Freelancer',
          icon: 'mdi-sofa',
          title: 'FREE',
          text: 'This is good if your company size is between 2 and 10 Persons.',
        },
        {
          best: true,
          heading: 'Small Company',
          icon: 'mdi-home',
          title: '$29',
          text: 'This is good if your company size is between 2 and 10 Persons.',
        },
        {
          heading: 'Medium Company',
          icon: 'mdi-domain',
          title: '69$',
          text: 'This is good if your company size is between 11 and 99 Persons.',
        },
        {
          heading: 'Extra Pack',
          icon: 'mdi-bank',
          title: '159$',
          text: 'This is good if your company size is 99+ or greater Persons.',
        },
      ],
    }),
  }
</script>

<style lang="sass">
#pricing-view
  max-width: 1140px
</style>
