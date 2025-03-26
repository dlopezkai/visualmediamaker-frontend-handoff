<script setup lang="ts">
import { ref, reactive } from 'vue';
// icons
import { LockIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, SquareAsteriskIcon } from 'vue-tabler-icons';
import axios from 'axios';
const ax = axios.create();
const emit = defineEmits(['close', 'newUser']);
const showPass = ref(false);
const addUser = reactive({
    username: '',
    email: '',
    password: '',
    role: '',
    firstName: '',
    lastName: ''
});
const { find } = useStrapi<any>();
const resRoles = await find('users-permissions/roles');

// Computed
const rolesList = computed(() => {
    return resRoles.roles.filter((r: any) => {
        return r.name !== 'Public' && r.name !== 'Authenticated';
    });
});

const strapiUrl = useStrapiUrl();

// Methods
const generate = () => {
    addUser.password = Math.random().toString(36).slice(2);
}

const onSubmit = async () => {
    const token = useStrapiToken();
    ax.post(`${strapiUrl}/users`, addUser,
        {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        }).then(res => emit('newUser')).catch((e) => {
            // console.log(e.message);
    });
}
</script>

<template>
    <v-row>
        <v-col col="6">
            <v-label class="mb-2 font-weight-medium">Firstname</v-label>
            <v-text-field variant="outlined" type="text" placeholder="Firstname" color="primary" v-model="addUser.firstName">
                <template v-slot:prepend-inner>
                    <UserIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col col="6">
            <v-label class="mb-2 font-weight-medium">Lastname</v-label>
            <v-text-field variant="outlined" type="text" placeholder="Lastname" color="primary" v-model="addUser.lastName">
                <template v-slot:prepend-inner>
                    <UserIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-label class="mb-2 font-weight-medium">Username</v-label>
    <v-text-field variant="outlined" type="text" placeholder="Username" color="primary" v-model="addUser.username">
        <template v-slot:prepend-inner>
            <UserIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
        </template>
    </v-text-field>
    <v-label class="mb-2 font-weight-medium">Email</v-label>
    <v-text-field variant="outlined" type="email" placeholder="Email" color="primary" v-model="addUser.email">
        <template v-slot:prepend-inner>
            <MailIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
        </template>
    </v-text-field>
    <v-label class="mb-2 font-weight-medium">Password</v-label>
    <v-text-field variant="outlined" :type="showPass ? 'text' : 'password'" placeholder="Password" color="primary" v-model="addUser.password">
        <template v-slot:prepend-inner>
            <LockIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
        </template>
        <template v-slot:append-inner>
            <v-btn v-if="showPass" @click="showPass = false" flat>
                <EyeIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
            </v-btn>
            <v-btn v-else @click="showPass = true" flat>
                <EyeOffIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
            </v-btn>
        </template>
        <template v-slot:append>
            <v-btn @click="generate" flat dense>
                <SquareAsteriskIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
            </v-btn>
        </template>
    </v-text-field>
    <v-label class="mb-2 font-weight-medium">Role</v-label>
    <v-select
        v-model="addUser.role"
        :items="rolesList"
        item-title="name"
        item-value="id"
        single-line
        variant="outlined"
    >
    </v-select>
    <v-btn color="primary" class="mr-3" flat @click="onSubmit">Submit</v-btn>
    <v-btn color="error" class="mr-3" flat @click="emit('close')">Cancel</v-btn>
</template>
