<script setup lang="ts">
import { ref } from 'vue';
// common components
import UiParentCard from '@/components/shared/UiParentCard.vue';

//Table
import ProjectsTable from '@/components/table/ProjectsTable.vue';

// theme breadcrumb
const page = ref({ title: 'Projects' });

</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Projects Table -->
    <!-- ---------------------------------------------------- -->
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="page.title">
                <ProjectsTable />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
