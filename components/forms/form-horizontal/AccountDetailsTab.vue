<script setup lang="ts">
import { ref, reactive } from 'vue';
const show = ref(false);
const show2 = ref(false);

const props = defineProps(["profileUser", "currentUser", "roles", "isAdmin"]);
const emit = defineEmits(['notification']);
const accInfo = reactive({
    username: props.profileUser?.username,
    email: props.profileUser?.email,
    password: props.profileUser?.password,
    role: props.profileUser?.role.id
});
const confirm = ref('');
const successPass = ref(false);
const successPass1 = ref(false);

const loading = ref(false);

const passRule = computed(() => {
    if (accInfo.password === '') {
        // field is empty
        successPass.value = false;
        return '';
    } else if (matchingPasswords() === true) {
        // password ok
        successPass.value = true;
        return 'mdi-check';
    } else {
        // password wrong
        successPass.value = false;
        return 'mdi-close';
    }
});

const passRule1 = computed(() => {
    if (confirm.value === '') {
        // field is empty
        successPass1.value = false;
        return '';
    } else if (matchingPasswords() === true) {
        // password ok
        successPass1.value = true;
        return 'mdi-check';
    } else {
        // password wrong
        successPass1.value = false;
        return 'mdi-close';
    }
});


//Method
const required = (value) => {
      if (value) {
        return true;
      } else {
        return 'This field is required.';
      }
};
const matchingPasswords = () => {
      if (accInfo.password === confirm.value) {
        return true;
      } else {
        return 'Passwords does not match.';
      }
};


const client = useStrapiClient();
const saveAccinfo = async () => {
    if(accInfo.password !== confirm.value) {

    }
    loading.value = true;
    try {
        await client<Users>(`/users/${props.profileUser.id}`, { method: 'PUT', body: accInfo})
        emit('notification', true);
        loading.value = false;
    } catch(e) {
        // console.log(e)
        emit('notification', false);
        loading.value = false;
    }
}
</script>
<template>
    <v-row class="align-center mb-3 mt-1">
        <v-col cols="12" md="6">
            <v-text-field color="primary" type="text" hide-details label="Username" v-model="accInfo.username"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field color="primary" type="text" hide-details label="Email" v-model="accInfo.email"></v-text-field>
        </v-col>
    </v-row>
    <v-row class="align-center mb-3">
        <v-col cols="12" md="6">
            <v-text-field
                v-model="accInfo.password"
                color="primary"
                variant="outlined"
                :type="show ? 'text' : 'password'"
                hide-details
                class="text-subtitle-1"
                :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="show = !show"
                :rules="[required]"
            >
                <template v-slot:append>
                    <v-icon
                        v-if="successPass"
                        color="green"
                        >{{ passRule }}</v-icon
                        >
                    <v-icon
                        v-if="!successPass"
                        color="red"
                        >{{ passRule }}</v-icon
                        >
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field
                v-model="confirm"
                color="primary"
                variant="outlined"
                :type="show2 ? 'text' : 'password'"
                hide-details
                class="text-subtitle-1"
                :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="show2 = !show2"
                :rules="[required, matchingPasswords]"
            >
                <template v-slot:append>
                    <v-icon
                        v-if="successPass1"
                        color="green"
                        >{{ passRule1 }}</v-icon
                    >
                    <v-icon
                        v-if="!successPass1"
                        color="red"
                        >{{ passRule1 }}</v-icon
                    >
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row class="align-center mb-3">
        <v-col cols="12" md="6">
            <v-label class="mb-2 font-weight-medium">Role</v-label>
            <v-select
                v-model="accInfo.role"
                :items="props.roles"
                item-title="name"
                item-value="id"
                single-line
                variant="outlined"
                :disabled="!props.isAdmin"
            >
            </v-select>
        </v-col>
        <v-col cols="12" md="6" class="text-right">
            <v-btn color="primary" flat @click="saveAccinfo" :loading="loading">Update</v-btn>
        </v-col>
    </v-row>
</template>
