<script setup lang="ts">
import { ref, reactive } from 'vue';
// icons
import { LockIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, SquareAsteriskIcon, CurrencyDollarIcon, HandMoveIcon, MovieOffIcon } from 'vue-tabler-icons';
import axios from 'axios';
const ax = axios.create();
const emit = defineEmits(['close', 'newProject']);
const props = defineProps(['fellows', 'mentors']);
const showPass = ref(false);
const newProject = reactive({
    name: '',
    program: '',
    fellow: '',
    mentor: '',
    fellow_awarded: '',
    mentor_awarded: ''
});
const programs = ref([
    "CSF",
    "NYMP",
    "PDF"
]);
const { find } = useStrapi<any>();
const resRoles = await find('users-permissions/roles');

// Computed
const rolesList = computed(() => {
    return resRoles.roles.filter((r: any) => {
        return r.name !== 'Public';
    });
});

const loading = ref(false);

const strapiUrl = useStrapiUrl();

const onSubmit = async () => {
    loading.value = true;
    const token = useStrapiToken();
    ax.post(`${strapiUrl}/projects`, {data: newProject}, 
    {
        headers: {
            Authorization: `Bearer ${token.value}`,
        }
    }).then(res => {
        // console.log("project is:", res);
        emit('newProject', {id: res.data.data.id, name: res.data.data.name});
        loading.value = false;
    }).catch(e => {
        // console.log(e.message);
        loading.value = false;
    });
}
</script>

<template>
    <v-row>
        <v-col col="6">
            <v-text-field variant="outlined" type="text" label="Project Name" placeholder="Project Name" color="primary" v-model="newProject.name">
                <template v-slot:prepend-inner>
                    <NewsIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col col="6">
            <v-select
                label="Program"
                v-model="newProject.program"
                :items="programs"
                variant="outlined"
                color="primary"
            >
                <template v-slot:prepend-inner>
                    <MovieIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-select>
        </v-col>
    </v-row>

    <v-row>
        <v-col col="6">
            <v-select
                v-model="newProject.fellow"
                label="Fellow"
                :items="props.fellows"
                item-title="fullName"
                item-value="id"
                variant="outlined"
                color="primary"
            >
                <template v-slot:prepend-inner>
                    <UserIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>


            </v-select>
        </v-col>
        <v-col col="6">
            <v-select
                v-model="newProject.mentor"
                label="Mentor"
                :items="props.mentors"
                item-title="fullName"
                item-value="id"
                variant="outlined"
                color="primary"
            >
                <template v-slot:prepend-inner>
                    <UserIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-select>
        </v-col>
    </v-row>
    
    <v-row>
        <v-col col="6">
            <v-text-field variant="outlined" type="number" label="Fellow Awarded" color="primary" v-model="newProject.fellow_awarded">
                <template v-slot:prepend-inner>
                    <CurrencyDollarIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col col="6">
            <v-text-field variant="outlined" type="number" label="Mentor Awarded" color="primary" v-model="newProject.mentor_awarded">
                <template v-slot:prepend-inner>
                    <CurrencyDollarIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col col="12" class="d-flex justify-end align-center">
            <v-btn color="error" class="mr-3" flat @click="emit('close')" :loading="loading">Cancel</v-btn>
            <v-btn color="primary" class="mr-3" flat @click="onSubmit" :loading="loading">Submit</v-btn>
        </v-col>
    </v-row>
    
</template>
