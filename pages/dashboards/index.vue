<script setup lang="ts">
import { useUserStore } from '@/stores/user';
/*Call Components*/

import TopCards from "@/components/dashboardComponents/modern/TopCards.vue";
import RevenueUpdates from "@/components/dashboardComponents/modern/RevenueUpdates.vue";
// import YearlyBreakup from "@/components/dashboardComponents/modern/YearlyBreakup.vue";
// import MonthlyEarnings from "@/components/dashboardComponents/modern/MonthlyEarnings.vue";
// import EmployeeSalary from "./dashboardComponents/modern/EmployeeSalary.vue";
// import Customers from "./dashboardComponents/modern/Customers.vue";
// import Projects from "@/components/dashboardComponents/modern/Projects.vue";
//import UserCard from "@/components/dashboardComponents/modern/UserCard.vue";
// import BestSellingProducts from "./dashboardComponents/modern/BestSellingProducts.vue";
// import WeeklyStats from "./dashboardComponents/modern/WeeklyStats.vue";
import TopProjects from "@/components/dashboardComponents/modern/TopProjects.vue";

const userStore = useUserStore();
const currentUser = ref(userStore.$state);
const isAdmin = ref(currentUser.value.role.name == 'Admin' ? true : false);

</script>
<template>
    <v-row>
        <!-- Top cards -->
        <v-col cols="12">
            <TopCards />
        </v-col> 
         <v-col cols="12">
           <v-row>
                <!-- Revenue Updates -->
                <v-col cols="12">
                    
                    <!-- <h2 class="text-center mt-5">Awaiting Feedback for Other Dashboard Visuals</h2> -->
                </v-col>
                <!-- Yearly Breakup / Monthly Earnings -->
                <!-- <v-col cols="12" lg="4" sm="12">
                    <v-row>
                        <v-col cols="12" lg="12" sm="6">
                            <YearlyBreakup/>
                        </v-col>
                        <v-col cols="12" lg="12" sm="6">
                            <MonthlyEarnings/>
                        </v-col>
                    </v-row>
                </v-col> -->
                
                <!-- Top Projects -->
                <v-col cols="12">
                    <TopProjects v-if="!isAdmin"/>
                </v-col>
                <v-col cols="12">
                    <RevenueUpdates v-if="isAdmin"/>
                </v-col>
                <!-- Customers / Projects / Usercard -->    
                <v-col cols="12" lg="4" md="4">
                    <!-- <Customers class="mb-4"/> -->
                    <!-- <Projects /> -->
                    
                </v-col>
                <!-- Employee Salary -->    
                <v-col cols="12" lg="8" md="8">
                    <!-- <EmployeeSalary v-if="isAdmin"/> -->
                </v-col>
                <!--Best selling products-->    
                <!-- <v-col cols="12" lg="4" md="4">
                    <BestSellingProducts/>
                </v-col> -->
                <!-- Weekly Stats -->
                <!-- <v-col cols="12" lg="4" md="4">
                    <WeeklyStats/>
                </v-col> -->
                
           </v-row>
        </v-col>    
    </v-row>
</template>