<script setup lang="ts">
/*Call Components*/
import WelcomeCard from "@/components/dashboardComponents/ecommerce/WelcomeCard.vue";
import Payments from "@/components/dashboardComponents/ecommerce/Payments.vue";
import ProductSold from "@/components/dashboardComponents/ecommerce/ProductSold.vue";
import RevenueUpdates from "@/components/dashboardComponents/ecommerce/RevenueUpdates.vue";
import SalesOverview from "@/components/dashboardComponents/ecommerce/SalesOverview.vue";
import TotalEarning from "@/components/dashboardComponents/ecommerce/TotalEarning.vue";
import SalesProfit from "@/components/dashboardComponents/ecommerce/SalesProfit.vue";
import MonthlyEarnings from "@/components/dashboardComponents/ecommerce/MonthlyEarnings.vue";
import WeeklyStats from "@/components/dashboardComponents/modern/WeeklyStats.vue";
import YearlySales from "@/components/dashboardComponents/ecommerce/YearlySales.vue";
import PaymentGateways from "@/components/dashboardComponents/ecommerce/PaymentGateways.vue";
import ProductPerformance from "@/components/dashboardComponents/ecommerce/ProductPerformance.vue";
import RecentTransactions from "@/components/dashboardComponents/ecommerce/RecentTransactions.vue";
</script>
<template>
    <v-row>
        <!-- Welcome Card -->
        <v-col cols="12" lg="8">
            <WelcomeCard/>
        </v-col> 
        <!-- Payments -->
        <v-col cols="12" lg="2" sm="6">  
            <Payments/>
        </v-col>  
        <!-- Products Sold -->
        <v-col cols="12" lg="2" sm="6">  
            <ProductSold/>
        </v-col> 
        <!-- Revenue Updates -->
        <v-col cols="12" lg="4" sm="6">  
            <RevenueUpdates/>
        </v-col> 
        <!-- Sales Overview -->
        <v-col cols="12" lg="4" sm="6">  
            <SalesOverview/>
        </v-col> 
        
        <v-col cols="12" lg="4" sm="6"> 
            <v-row>
                <v-col cols="12" sm="6">
                    <!--Total Earning -->
                    <TotalEarning/>
                </v-col>
                <v-col cols="12" sm="6">
                    <!--sales profit -->
                    <SalesProfit/>
                </v-col>
            </v-row>
            <!--Monthly Earning -->
            <MonthlyEarnings/>
        </v-col> 
        <!-- Weekly Stats-->
        <v-col cols="12" lg="4" sm="6">
            <WeeklyStats/>
        </v-col>
        <!-- Yearly Stats-->
        <v-col cols="12" lg="4" md="6">
            <YearlySales/>
        </v-col>
        <!-- Payment Gateways-->
        <v-col cols="12" lg="4" md="6">
            <PaymentGateways/>
        </v-col>
        <!-- Recent Transactions -->
        <v-col cols="12" lg="4" sm="12"> 
            <RecentTransactions/>
        </v-col>
        <!-- Product Performance -->
        <v-col cols="12" lg="8" sm="12"> 
            <ProductPerformance/>
        </v-col>
    </v-row>    
</template>