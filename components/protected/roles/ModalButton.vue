<template>
  <v-row>
    <app-btn color="success" class="px-2 ml-1" elevation="0" min-width="0" small text @click="dialog = true">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-square-edit-outline'" />
        </template>
        <span>編集</span>
      </v-tooltip>
    </app-btn>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> ロール編集 </v-card-title>

        <ValidationObserver v-slot="{ invalid }">
          <v-card-text>
            <ValidationProvider v-slot="{ errors }" rules="max:50|required" name="名前">
              <v-text-field
                v-model="roleParams.name"
                label="ロール名"
                required
                :error-messages="errors[0]"
              ></v-text-field>
            </ValidationProvider>

            <v-textarea v-model="roleParams.description" label="説明"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false"> Close </v-btn>
            <v-btn color="blue darken-1" :disabled="invalid" text @click="updateRole"> Update </v-btn>
          </v-card-actions>
        </ValidationObserver>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>

    <app-btn color="error" class="px-2 ml-1" elevation="0" min-width="0" small text @click="deleteRole(role)">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-delete-outline'" />
        </template>
        <span>削除</span>
      </v-tooltip>
    </app-btn>
  </v-row>
</template>

<script setup lang="ts">
import { Role } from 'interface'
import { RolesStore, SnackbarStore } from '~/store'
const props = defineProps<{ role: Role }>()

const dialog = ref(false)

const deleteRole = (role: Role) => {
  if (!window.confirm('ロールを削除してもよろしいですか？')) {
    window.alert('キャンセルしました')
    return
  }
  RolesStore.deleteRole(role.id)
}

const roleParams = reactive(Object.assign({}, props.role))

watch(dialog, () => {
  roleParams.name = props.role.name
  roleParams.description = props.role.description
})

const updateRole = async () => {
  const { id, name, description } = roleParams
  const { name: propsName, description: propsDescription } = props.role

  if (name === propsName && description === propsDescription) {
    SnackbarStore.visible({ color: 'warning', message: '値が更新されていません' })
    return
  }

  await RolesStore.updateRole({ id, name, description })
  dialog.value = false
}
</script>
