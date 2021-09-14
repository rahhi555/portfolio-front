<template>
  <v-row justify="center">
    <v-dialog
      v-model="accountDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="accountDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="accountDialog = false"> Save </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card class="v-card--wizard" elevation="12">
        <v-card-title class="justify-center text-h3 font-weight-light pt-5">
          Build your profile
        </v-card-title>

        <div class="text-center text-h4 grey--text font-weight-light mb-6">
          This information will let us know more about you.
        </div>

        <div class="my-6" />

        <v-card-text>
          <form>
            <div class="text-center text-h4 font-weight-light mb-6">
              Let's start with basic information (with validation)
            </div>

            <v-row
              class="mx-auto"
              justify="space-around"
              style="max-width: 900px"
            >
              <v-col cols="auto" class="text-center">
                <input ref="file" type="file" class="d-none" />
                <v-card
                  class="
                    mx-auto
                    mt-0
                    d-inline-flex
                    v-card--account
                    success--text
                  "
                  outlined
                  height="106"
                  width="106"
                >
                  <v-img v-if="false" height="100%" width="100%" />
                  <v-icon v-else class="mx-auto" size="96">
                    mdi-account
                  </v-icon>
                </v-card>

                <div class="font-weight-bold grey--text">CHOOSE PICTURE</div>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  value="testeset"
                  color="secondary"
                  label="First Name*"
                  prepend-icon="mdi-face"
                />

                <v-text-field
                  value="testeset"
                  color="secondary"
                  label="Last Name*"
                  prepend-icon="mdi-account"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  value="mailmail"
                  color="secondary"
                  label="Email*"
                  prepend-icon="mdi-email"
                />
              </v-col>
            </v-row>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AccountDialogKey } from '~/types/injection-key'

export default defineComponent({
  setup() {
    const accountDialog = inject(AccountDialogKey)

    return {
      accountDialog,
    }
  },
})
</script>

<style scoped lang="sass">
.v-card.v-card.v-card--account
  border-color: currentColor
  border-width: 4px

  .v-icon
    color: inherit

  .v-card--account,
  .v-card--account:before
    border-radius: 50%
</style>
