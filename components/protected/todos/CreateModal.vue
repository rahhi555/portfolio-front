<template>
  <v-dialog :value="dialog" max-width="600px" @click:outside="dialogClose">
    <v-card>
      <v-card-title>
        <span class="text-h5">Todo作成</span>
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
                >
                  <v-text-field
                    v-model="todoParams.title"
                    label="タイトル"
                    required
                    :error-messages="errors[0]"
                  ></v-text-field>
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="max:255"
                  name="内容"
                >
                  <v-textarea
                    v-model="todoParams.body"
                    label="内容"
                    required
                    :error-messages="errors[0]"
                  ></v-textarea>
                </ValidationProvider>

                <v-dialog
                  ref="beginTimeDialog"
                  v-model="timeDialog.begin"
                  :return-value.sync="todoParams.beginTime"
                  persistent
                  width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="beginTime:@終了時刻"
                      name="開始時刻"
                    >
                      <v-text-field
                        v-model="todoParams.beginTime"
                        label="開始時刻"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        :error-messages="errors[0]"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </ValidationProvider>
                  </template>
                  <v-time-picker
                    v-if="timeDialog.begin"
                    v-model="todoParams.beginTime"
                    full-width
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="timeDialog.begin = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.beginTimeDialog.save(todoParams.beginTime)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>

                <v-dialog
                  ref="endTimeDialog"
                  v-model="timeDialog.end"
                  :return-value.sync="todoParams.endTime"
                  persistent
                  width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="endTime:@開始時刻"
                      name="終了時刻"
                    >
                      <v-text-field
                        v-model="todoParams.endTime"
                        label="終了時刻"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        :error-messages="errors[0]"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </ValidationProvider>
                  </template>
                  <v-time-picker
                    v-if="timeDialog.end"
                    v-model="todoParams.endTime"
                    full-width
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="timeDialog.end = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.endTimeDialog.save(todoParams.endTime)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="size:10000"
                  name="画像"
                >
                  <v-file-input
                    v-model="todoParams.images"
                    accept="image/png, image/jpeg"
                    prepend-icon="mdi-camera"
                    multiple
                    chips
                    counter
                    show-size
                    label="画像追加(複数可)"
                    :error-messages="errors[0]"
                  ></v-file-input>
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogClose"> Close </v-btn>
          <v-btn
            color="blue darken-1"
            :disabled="invalid"
            text
            @click="createTodo"
          >
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { TodoListsStore } from '~/store'

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },

  setup(_, context) {
    const todoParams = reactive({
      title: '',
      body: '',
      beginTime: '',
      endTime: '',
      images: [],
    })

    const timeDialog = reactive({
      begin: false,
      end: false,
    })

    const dialogClose = () => {
      context.emit('closeDialogHandle')
    }

    const createTodo = async () => {
      await TodoListsStore.createTodo(todoParams)
      for (const key in todoParams) {
        if (key === 'images') {
          todoParams[key] = []
          continue
        }
        todoParams[key] = ''
      }
      dialogClose()
    }

    return {
      todoParams,
      timeDialog,
      dialogClose,
      createTodo,
    }
  },
})
</script>
