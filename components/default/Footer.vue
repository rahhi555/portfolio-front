<template>
  <v-footer
    id="page-footer"
    :absolute="$vuetify.breakpoint.mdAndUp"
    color="transparent"
    height="auto"
    style="z-index: -1;"
  >
    <v-container>
      <v-row align="center">
        <v-col mx="auto">
          <div class="text-body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; {{ new Date().getFullYear() }}
            <v-avatar
              tile
            >
              <img
                src="@/assets/logo.png"
              >
            </v-avatar>
            minimap
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>