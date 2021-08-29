<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <app-btn
        color="secondary"
        class="mr-2 mb-2 float-left"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-folder-plus-outline</v-icon>
        新規作成
      </app-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">計画作成</span>
      </v-card-title>

      <ValidationObserver v-slot="{ invalid }">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="max:50|required"
                  name="名前"
                >
                  <v-text-field
                    v-model="name"
                    label="Name..."
                    required
                    :error-messages="errors[0]"
                    @input="$emit('input-handle', name)"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-container>
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
            @click="dialog = false; $emit('create-handle');"
          >
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import AppBtn from '~/components/app/Btn.vue'

export default defineComponent({
  components: {
    AppBtn,
  },

  setup() {
    const dialog = ref(false)
    const name = ref('')

    watch(dialog, () => {
      name.value = ''
    })

    return {
      dialog,
      name,
    }
  },
})
</script>
