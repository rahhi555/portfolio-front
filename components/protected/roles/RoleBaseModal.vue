<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-container>
      <v-row>
        <v-col>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">ロール名</th>
                  <th class="text-left">説明</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="role in roles"
                  :key="role.name"
                >
                  <td>{{ role.name }}</td>
                  <td>{{ role.description }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col>
          <v-card>
            <v-card-title>
              <span class="text-h5">ロール作成</span>
            </v-card-title>

            <ValidationObserver v-slot="{ invalid }">
              <v-card-text>
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="max:50|required"
                  name="名前"
                >
                  <v-text-field
                    v-model="roleParams.name"
                    label="ロール名"
                    required
                    :error-messages="errors[0]"
                  ></v-text-field>
                </ValidationProvider>

                <v-textarea
                  v-model="roleParams.description"
                  label="説明"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :disabled="invalid && isMyPlan()"
                  text
                  @click="createRole"
                >
                  Create
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, useFetch, ref, computed } from '@nuxtjs/composition-api'
import { RolesStore, UserStore, PlansStore } from '~/store'

export default defineComponent({
  setup() {
    let planId: string

    useFetch( async ({ $route }) => {
      if(RolesStore.roles) return
      planId = $route.params.id
      await RolesStore.indexRoles(planId)
    })

    const roleParams = ref({
      name: '',
      description: '',
    })

    const createRole = () => {
      const { name, description } = roleParams.value
      RolesStore.createRole({
        planId,
        name,
        description
      })
    }

    const isMyPlan = () => {
      if(!PlansStore.plan) { PlansStore.setPlan(planId) }
      return PlansStore.plan?.userId === UserStore.currentUser.id
    }

    return {
      roleParams,
      createRole,
      dialog: inject('dialog'),
      roles: computed(() => RolesStore.roles),
      isMyPlan
    }
  },
})
</script>
