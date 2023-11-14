<script setup lang="ts">
import { ref } from "vue";
import { Form } from "vee-validate";

const { login } = useStrapiAuth()
const router = useRouter();
const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref("");
const username = ref("");
const passwordRules = ref([
  (v: string) => !!v || "Password is required"
]);
const emailRules = ref([
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);

const onSubmit = async () => {
  try {
    await login({ identifier: username.value, password: password.value })
    router.push('/dashboards')
  } catch (e) {
    apiError.value = e.error.message;
  }
}

const apiError = ref("");

</script>

<template>
  <Form @submit="onSubmit" v-slot="{ isSubmitting }" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Username or E-mail</v-label>
    <VTextField v-model="username" :rules="emailRules" class="mb-8" required hide-details="auto"></VTextField>
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Password</v-label>
    <VTextField v-model="password" :rules="passwordRules" required hide-details="auto" type="password" class="pwdInput">
    </VTextField>
    <v-row class="d-flex mb-1 align-center">
      <v-col cols="6" sm="6" class="pl-0">
        <v-checkbox v-model="checkbox" :rules="[(v: any) => !!v || 'You must agree to continue!']" required hide-details
          color="primary">
          <template v-slot:label>Remeber this Device</template>
        </v-checkbox>
      </v-col>
      <v-col cols="6" sm="6" class="pr-0">
        <NuxtLink to="" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">Forgot Password
            ?</NuxtLink>
      </v-col>
    </v-row>
    <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="!password" block type="submit" flat>Sign
      In</v-btn>
    <div v-if="apiError" class="mt-2">
      <v-alert color="error">{{ apiError }}</v-alert>
    </div>
  </Form>
</template>
