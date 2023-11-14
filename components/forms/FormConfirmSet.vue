<script setup lang="ts">
import { ref, reactive } from 'vue';
// icons
import { LockIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, SquareAsteriskIcon, CurrencyDollarIcon, HandMoveIcon, MovieOffIcon, ListIcon, TimelineIcon, File3dIcon, NewsIcon, UfoIcon, SearchIcon, Menu2Icon } from 'vue-tabler-icons';
import axios from 'axios';

const ax = axios.create();
const emit = defineEmits(['close', 'confirm']);
const props = defineProps(['projectId', 'setId', 'sets', 'fellow', 'mentor']);
const showPass = ref(false);
const set = reactive({
    active: false
});

const disabled = ref(false);

const project = reactive({
    status: '',
    statusInfo: ''
});

const fellowPayment = reactive({
    amount: '',
    date: new Date(),
    memo: '',
    to: props.fellow,
    project: props.projectId
});

const mentorPayment = reactive({
    amount: '',
    date: new Date(),
    memo: '',
    to: props.mentor,
    project: props.projectId
});


const loading = ref(false);

const nextSets = computed(() => {
    return props.sets.filter(s => {
        return s.id !== props.setId;
    })
});

const strapiUrl = useStrapiUrl();

const onSubmit = async () => {
    loading.value = true;
        const token = useStrapiToken();
        // Fellow payment
        ax.post(`${strapiUrl}/payments`, {data: fellowPayment}, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            }
        }).then((fellowpay) => {
            // console.log(fellowpay);
            // Mentor Payment
            ax.post(`${strapiUrl}/payments`, {data: mentorPayment}, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                }
            }).then(mentorpay => {
                // console.log(mentorpay);
                // update Set
                ax.put(`${strapiUrl}/deliverable-sets/${props.setId}`, {data: set}, {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    }
                }).then(setRes => {
                    // console.log(setRes);
                    // Update Project
                    ax.put(`${strapiUrl}/projects/${props.projectId}`, {data: project}, {
                        headers: {
                            Authorization: `Bearer ${token.value}`,
                        }
                    }).then(proRes => {
                        // console.log(proRes);
                        // Callback to parent
                        emit('confirm');
                    }).catch(err => {console.log(err);loading.value = false;})
                }).catch(err => {console.log(err);loading.value = false;})
            }).catch(err => {console.log(err);loading.value = false;})
        }).catch(err => {console.log(err);loading.value = false;})
}
</script>

<template>
    <v-row>
        <v-col cols="6">
            <v-text-field variant="outlined" type="number" label="Fellow Pay" placeholder="Amount" color="primary" v-model="fellowPayment.amount" 
            :rules="[(v) => v ? v && (disabled = false) : (disabled = true)]">
                <template v-slot:prepend-inner>
                    <CurrencyDollarIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
            <v-text-field variant="outlined" type="text" label="Fellow Payment Memo" placeholder="Memo" color="primary" v-model="fellowPayment.memo" :rules="[(v) => v ? v && (disabled = false) : (disabled = true)]">
                <template v-slot:prepend-inner>
                    <InfoCircleIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="6">
            <v-text-field variant="outlined" type="number" label="Mentor Pay" placeholder="Amount" color="primary" v-model="mentorPayment.amount" :rules="[(v) => v ? v && (disabled = false) : (disabled = true)]">
                <template v-slot:prepend-inner>
                    <CurrencyDollarIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
            <v-text-field variant="outlined" type="text" label="Mentor Payment Memo" placeholder="Memo" color="primary" v-model="mentorPayment.memo">
                <template v-slot:prepend-inner>
                    <InfoCircleIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="12">
            <v-select
                label="Next Set"
                v-model="project.status"
                :items="nextSets"
                item-title="name"
                item-value="name"
                variant="outlined"
                color="primary"
                class="text-uppercase"
                :rules="[(v) => v ? v && (disabled = false) : (disabled = true)]"
            >
                <template v-slot:prepend-inner>
                    <Menu2Icon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-select>
        </v-col>
        <v-col cols="12">
            <v-textarea variant="outlined" type="text" auto-grow label="Status Summary" color="primary" v-model="project.statusInfo">
                <template v-slot:prepend-inner>
                    <NewsIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-textarea>
        </v-col>
    </v-row>
    <v-row>
        <v-col col="12" class="d-flex justify-end align-center">
            <v-btn color="error" class="mr-3" flat @click="emit('close')" :loading="loading">Cancel</v-btn>
            <v-btn color="primary" class="mr-3" flat @click="onSubmit" :loading="loading" :disabled="disabled">Confirm</v-btn>
        </v-col>
    </v-row>
    
</template>
