<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template #activator="{ on, attrs }">
      <v-btn data-tutorial="create-plan-btn" color="secondary" class="mr-2 mb-2 float-left" v-bind="attrs" v-on="on">
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
                  data-tutorial="create-plan-input"
                >
                  <v-text-field
                    v-model="planParams.name"
                    label="Name..."
                    required
                    :error-messages="errors[0]"
                  ></v-text-field>
                </ValidationProvider>

                <span data-tutorial="create-plan-check">
                  <v-checkbox v-model="planParams.published" label="公開"></v-checkbox>
                  <span class="text-caption" style="line-height: 1.5rem">
                    公開にすると誰でも自由に閲覧することが出来ます(編集は承認が必要になります)。<br />
                    非公開にすると承認するまで閲覧できません。
                  </span>
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"> Close </v-btn>
          <v-btn data-tutorial="create-plan-submit" color="blue darken-1" :disabled="invalid" text @click="createPlan">
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { PlansStore } from '~/store'

const dialog = ref(false)

const planParams = reactive({
  name: '',
  published: false,
})

const { $tutorial } = useContext()
/** チュートリアル中ならリターン */
const createPlan = () => {
  dialog.value = false
  if ($tutorial.isRunningTutorial.value) return

  const { name, published } = planParams
  PlansStore.createPlan({ name, published })
}
</script>
