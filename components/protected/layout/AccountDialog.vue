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
      </v-toolbar>

      <v-card class="v-card--wizard" elevation="12">
        <v-card-title class="justify-center text-h3 font-weight-light pt-5">
          Your profile
        </v-card-title>

        <div class="text-center text-h5 grey--text font-weight-light mb-6">
          <p v-if="isAnonymous" class="grey--text">
            現在仮ユーザーです。<nuxt-link
              to="/dashboard/credential"
              @click.native="accountDialog = false"
              >本登録ページはこちら</nuxt-link
            >
          </p>
          <p v-else class="success--text">本登録ユーザーです</p>
        </div>

        <div class="my-6" />

        <v-card-text>
          <form>
            <v-row
              class="mx-auto"
              justify="space-around"
              style="max-width: 900px"
            >
              <v-col cols="auto" class="text-center">
                <input
                  ref="imageForm"
                  type="file"
                  class="d-none"
                  accept="image/*"
                  @change="onSelectFile($event.target.files)"
                />
                <v-card
                  :class="currentUser.avatar ? 'success--text' : 'grey--text'"
                  class="mx-auto mt-0 d-inline-flex v-card--account"
                  outlined
                  :max-height="$vuetify.breakpoint.xs ? null : 300"
                  :max-width="$vuetify.breakpoint.xs ? null : 300"
                  @click="selectImage"
                >
                  <v-avatar size="100%" tile>
                    <v-img
                      v-if="currentUser.avatar"
                      height="100%"
                      width="100%"
                      :src="currentUser.avatar"
                    />
                    <v-icon v-else class="mx-auto" size="96">
                      mdi-account
                    </v-icon>
                  </v-avatar>
                </v-card>

                <div class="font-weight-bold grey--text">CHOOSE PICTURE</div>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  :value="currentUser.name"
                  color="secondary"
                  label="Nick Name"
                  prepend-icon="mdi-account"
                  disabled
                  class="disabled-custom-color"
                />

                <v-text-field
                  :value="currentUser.email"
                  color="secondary"
                  label="Email*"
                  prepend-icon="mdi-email"
                  disabled
                  class="disabled-custom-color"
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
import { defineComponent, inject, ref } from '@nuxtjs/composition-api'
import { AccountDialogKey } from '~/types/injection-key'
import { UserStore } from '~/store'

export default defineComponent({
  setup() {
    const imageForm = ref<HTMLInputElement>()

    return {
      imageForm,

      selectImage: () => {
        imageForm.value?.click()
      },

      onSelectFile: (files: FileList) => {
        UserStore.updateAvatar(files)
      },

      accountDialog: inject(AccountDialogKey),
    }
  },

  computed: {
    currentUser() {
      return UserStore.currentUser
    },
    isAnonymous() {
      return UserStore.isAnonymous
    },
  },
})
</script>

<style lang="sass">
.v-card.v-card.v-card--account
  border-color: currentColor
  border-width: 4px

  .v-icon
    color: inherit

  .v-card--account,
  .v-card--account:before
    border-radius: 50%

.disabled-custom-color.theme--light.v-input--is-disabled input
  color: #333333 !important

.theme--light.v-icon.v-icon.v-icon--disabled
  color: #333333 !important
</style>
