<script setup lang="ts">
import { ref, reactive } from 'vue';
// icons
import { LockIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, SquareAsteriskIcon, CurrencyDollarIcon, HandMoveIcon, MovieOffIcon, ListIcon, TimelineIcon } from 'vue-tabler-icons';
import axios from 'axios';
const ax = axios.create();
const emit = defineEmits(['close', 'newSet']);
const props = defineProps(['projectId']);
const showPass = ref(false);
const newSet = reactive({
    name: '',
    due: '',
    active: true,
    project: props.projectId
});

const strapiUrl = useStrapiUrl();

const loading = ref(false);

const onSubmit = async () => {
    loading.value = true;
    const token = useStrapiToken();
    ax.post(`${strapiUrl}/deliverable-sets`, {data: newSet}, 
    {
        headers: {
            Authorization: `Bearer ${token.value}`,
        }
    }).then(res => {
        emit('newSet');
        loading.value = false;
    }).catch(e => {
        // console.log(e.error.message);
        loading.value = false;
    });
}
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-text-field variant="outlined" type="text" label="Name" placeholder="Name" color="primary" v-model="newSet.name">
                <template v-slot:prepend-inner>
                    <ListIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="12">
            <v-text-field variant="outlined" type="datetime-local" label="Due Date" placeholder="Due Date" color="primary" v-model="newSet.due">
                <template v-slot:prepend-inner>
                    <TimelineIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
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
