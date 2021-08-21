<template>
  <ValidationObserver v-slot="{ invalid }">
    <ValidationProvider v-slot="{ errors }" rules="max:50|required" name="名前">
      <v-text-field
        :value="name"
        color="secondary"
        placeholder="Nick Name..."
        :prepend-icon="
          errors.length == 0 && name.length >= 1
            ? 'mdi-emoticon-kiss-outline'
            : 'mdi-emoticon-neutral'
        "
        required
        :error-messages="errors[0]"
        counter="50"
        @input="$emit('update:name', $event)"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      rules="email|required"
      name="メールアドレス"
    >
      <v-text-field
        :value="email"
        color="secondary"
        placeholder="Email..."
        :prepend-icon="
          errors.length == 0 && email.length >= 1
            ? 'mdi-email-outline'
            : 'mdi-email-open'
        "
        required
        :error-messages="errors[0]"
        @input="$emit('update:email', $event)"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      rules="min:8|required|alpha_dash"
      name="パスワード"
    >
      <v-text-field
        :value="password"
        color="secondary"
        placeholder="Password..."
        :prepend-icon="
          errors.length == 0 && password.length >= 1
            ? 'mdi-lock-outline'
            : 'mdi-lock-off'
        "
        :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="isShowPassword ? 'text' : 'password'"
        :error-messages="errors[0]"
        required
        counter
        @click:append="isShowPassword = !isShowPassword"
        @input="$emit('update:password', $event)"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      rules="password:@パスワード"
      name="パスワード(確認)"
    >
      <v-text-field
        :value="passwordConfirm"
        color="secondary"
        placeholder="Password Confirm..."
        :prepend-icon="
          errors.length == 0 && passwordConfirm.length >= 1
            ? 'mdi-lock-check-outline'
            : 'mdi-lock-off'
        "
        :type="isShowPassword ? 'text' : 'password'"
        :error-messages="errors[0]"
        required
        @input="$emit('update:passwordConfirm', $event)"
      />
    </ValidationProvider>

    <ValidationProvider
      v-slot="{ errors }"
      :rules="{ required: 0 }"
      name="利用規約"
    >
      <v-checkbox
        v-model="isCheckToS"
        color="secondary"
        :error-messages="errors[0]"
      >
        <template #label>
          <v-dialog v-model="isShowDialog" width="800">
            <template v-slot:activator="{ on, attrs }">
              <a
                class="secondary--text ml-6 ml-sm-1 d-inline-block"
                href="#"
                v-bind="attrs"
                v-on="on"
              >
                利用規約
              </a>
            </template>
            <TearmsOfService></TearmsOfService>
          </v-dialog>

          <span class="text-no-wrap">に同意します</span>
        </template>
      </v-checkbox>
    </ValidationProvider>

    <v-btn
      color="secondary"
      depressed
      min-width="140"
      rounded
      :disabled="invalid"
      @click="$emit('registerHandle')"
    >
      Get Started
    </v-btn>
  </ValidationObserver>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TearmsOfService from '~/components/unProtected/TermsOfService.vue'

export default defineComponent({
  components: {
    TearmsOfService
  },
  props: {
    name: String,
    email: String,
    password: String,
    passwordConfirm: String,
  },

  setup() {
    const isShowPassword = false
    const isShowDialog = false
    const isCheckToS = false

    return {
      isShowPassword,
      isShowDialog,
      isCheckToS
    }
  },
})
</script>
