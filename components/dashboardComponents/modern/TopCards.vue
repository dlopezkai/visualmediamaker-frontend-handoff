<script setup lang="ts">
import { reactive } from 'vue';
const { find } = useStrapi();
const totals = reactive([]);
const projects = await find<any>('projects');
// const fellows = await find<any>('users', {populate: ['role'], filters: {'role': {'$eq': 'Admin'}}});
// console.log('Fellow', fellows);
const projectCount = reactive({
    name: 'Projects',
    count: projects?.meta?.pagination?.total || 0,
    bgcolor: 'custom1'
});

// const fellows = await find<any>('users', {
//     filters: {
//         role: {
//             name: {
//                 $eq: 'Fellow'
//             }
//         }
//     }
// });

const fellowCount = reactive({
    name: 'Fellows',
    count: 1,
    bgcolor: 'custom2'
});

// const mentors = await find<any>('users', {filters: {
//         role: {
//             name: {
//                 $eq: 'Mentor'
//             }
//         }
//     }
// });

const mentorsCount = reactive({
    name: 'Mentors',
    count: 1,
    bgcolor: 'custom8'
});

const cards = computed(() => {
    return [projectCount, fellowCount, mentorsCount];
});

</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="4" sm="4" v-for="card in cards" :key="card.name">
            <div
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-' + card.bgcolor"
            >
                <div :class="'bg-' + card.bgcolor">
                    <v-icon size="x-large">mdi-account-settings</v-icon>
                    <div class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-white">{{ card.name }}</div>
                    <h4 class="text-h4 mt-1 text-white"> {{ card.count }}</h4>
                </div>
            </div>
        </v-col>
    </v-row>
</template>
