<script setup lang="ts">
import { computed } from 'vue';
import { getSecondary, getPrimary } from '@/utils/UpdateColors';

/*Chart*/
const chartOptions = computed(() => {
    return {
        chart: {
            type: 'area',
            height: 80,
            fontFamily: `inherit`,
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            },
            group: 'sparklines'
        },
        colors: [getPrimary.value, getSecondary.value],
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'solid',
            opacity: 0.05
        },
        markers: {
            size: 0
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            }
        }
    };
});
const Chart = [
    {
        name: '',
        data: [30, 25, 35, 20, 30, 40]
    }
];
</script>
<template>
    <v-card elevation="10" >
        <v-row>
            <v-col cols="6">
        <v-card-item>
            <h6 class="text-subtitle-1 textSecondary">Fellows</h6>
            <h4 class="text-h4 mt-1">25</h4>
            <div class="pt-2">
                <v-avatar class="bg-lighterror text-accent" size="25">
                    <ArrowDownRightIcon size="20" />
                </v-avatar>
                <span class="text-subtitle-1 ml-2 font-weight-bold">+9%</span>
            </div>
        </v-card-item>
        </v-col>
        <v-col cols="6">
        <v-card-item>
            <h6 class="text-subtitle-1 textSecondary">Mentors</h6>
            <h4 class="text-h4 mt-1">30</h4>
            <div class="pt-2">
                <v-avatar class="bg-lighterror text-accent" size="25">
                    <ArrowDownRightIcon size="20" />
                </v-avatar>
                <span class="text-subtitle-1 ml-2 font-weight-bold">+9%</span>
            </div>
        </v-card-item>
    </v-col>
        </v-row>
        <apexchart class="" type="area" height="80" :options="chartOptions" :series="Chart"> </apexchart>
        <apexchart class="" type="area" height="80" :options="chartOptions" :series="Chart"> </apexchart>
    </v-card>
</template>
