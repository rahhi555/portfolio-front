<template>
  <v-dialog v-model="dialog" max-width="1000px" class="pa-4">
    <v-container>
      <v-row>
        <v-col :md="currentUserAccept ? 7 : 12">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th width="30%" class="text-left">ロール名</th>
                  <th width="45%" class="text-left">説明</th>
                  <th v-if="currentUserAccept" width="25%" class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in roles" :key="role.name">
                  <td>{{ role.name }}</td>
                  <td>{{ role.description }}</td>
                  <td v-if="currentUserAccept">
                    <RolesModalButton :role="role" />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col v-if="currentUserAccept" md="5">
          <v-card>
            <v-card-title>
              <span class="text-h5">ロール作成</span>
            </v-card-title>

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
                <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
                <v-btn color="blue darken-1" :disabled="invalid" text @click="createRole"> Create </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { RolesStore, PlansStore, MembersStore } from '~/store'
import { AppBarDialogKey } from '~/types/injection-key'

const roleParams = ref({
  name: '',
  description: '',
})

const createRole = async () => {
  const planId = PlansStore.currentPlan?.id
  const { name, description } = roleParams.value
  await RolesStore.createRole({
    planId,
    name,
    description,
  })
  roleParams.value = { name: '', description: '' }
}

const dialog = inject(AppBarDialogKey)!
const closeDialog = () => {
  dialog.value = false
}

const roles = computed(() => RolesStore.roles)

const currentUserAccept = computed(() => MembersStore.currentUserAccept)
</script>
