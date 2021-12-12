<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
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
                  name="タイトル"
                  data-tutorial="create-todo-list-input"
                >
                  <v-text-field
                    v-model="title"
                    label="Title..."
                    required
                    :error-messages="errors[0]"
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
            data-tutorial="create-todo-list-submit"
            @click="createTodoList"
          >
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, inject, useContext } from '@nuxtjs/composition-api'
import { AppBarDialogKey } from '~/types/injection-key'
import { TodoListsStore } from '~/store'

export default defineComponent({
  setup() {
    const title = ref('')
    const dialog = inject(AppBarDialogKey)

    const { $tutorial } = useContext()
    const createTodoList = async () => {
      dialog!.value = false
      // チュートリアル中ならリターン
      if($tutorial.isRunningTutorial.value) return
      await TodoListsStore.createTodoList(title.value)
      title.value = ''
    }

    return {
      dialog,
      title,
      createTodoList,
    }
  },
})
</script>
