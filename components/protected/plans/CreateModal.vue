<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        color="secondary"
        class="mr-2 mb-2 float-left"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-folder-plus-outline</v-icon>
        新規作成
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h4">計画作成</span>
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
                    :value="name"
                    label="Name..."
                    required
                    :error-messages="errors[0]"
                    @input="$emit('update:name', $event)"
                  ></v-text-field>
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  name="公開設定"
                >
                  <v-checkbox
                    :value="published"
                    label="公開"
                    :error-messages="errors[0]"
                    required
                    @click="$emit('update:published', !published)"
                  ></v-checkbox>
                  <span class="text-caption" style="line-height: 1.5rem;">
                    公開にすると誰でも自由に閲覧することが出来ます(編集は承認が必要になります)。<br/>
                    非公開にすると承認するまで閲覧できません。
                  </span>
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
            @click="
              dialog = false
              $emit('create-handle')
            "
          >
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    name: {
      type: String,
      default: '',
    },
    published: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const dialog = ref(false)

    return {
      dialog,
    }
  },
})
</script>
