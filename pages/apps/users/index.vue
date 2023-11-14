<script setup lang="ts">
import { ref } from 'vue';
// common components
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UsersTable from '@/components/table/UsersTable.vue';
// theme breadcrumb
const page = ref({ title: 'Users' });

</script>

<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="page.title">
                <UsersTable />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
