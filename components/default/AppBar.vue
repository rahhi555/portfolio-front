<template>
  <v-app-bar
    :absolute="$vuetify.breakpoint.mdAndUp"
    color="transparent"
    dark
    flat
    height="80"
  >
    <v-container class="px-0 d-flex align-center">
      <v-toolbar-title
        class="font-weight-light hidden-xs-only"
        v-text="`${name} Page`"
      />

      <v-spacer />

      <v-btn
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        class="ml-1 ml-md-7"
        min-height="48"
        min-width="40"
        text
      >
        <v-icon
          :left="$vuetify.breakpoint.mdAndUp"
          size="20"
          v-text="item.icon"
        />

        <span
          class="hidden-sm-and-down"
          v-text="item.text"
        />
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
  export default {
    data: () => ({
      items: [
        {
          icon: 'mdi-account-multiple-plus',
          text: 'Register',
          to: '/auth/register',
        },
        {
          icon: 'mdi-fingerprint',
          text: 'Login',
          to: '/auth/login',
        },
      ],
    }),

    computed: {
      name () {
        const routeName = this.$route.name.replace(/.*-/g, '')
        return routeName.charAt(0).toUpperCase() + routeName.slice(1)
      },
    },
  }
</script>
