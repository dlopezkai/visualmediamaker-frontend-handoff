<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useCustomizerStore } from '@/stores/customizer';
import { pl, zhHans } from 'vuetify/locale'
const customizer = useCustomizerStore();
const title = ref("Vision Maker Media");
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Work Portal`
      : "Vision Maker Media - Work Portal";
  },
});
</script>

<template>
    <!-----RTL LAYOUT------->
    <v-locale-provider> 
        <v-app
            :theme="customizer.actTheme"
            :class="[
                customizer.actTheme,
                customizer.mini_sidebar ? 'mini-sidebar' : '',
                customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
                customizer.setBorderCard ? 'cardBordered' : ''
            ]"
        >

             <!---Customizer location left side--->
             <!-- <v-navigation-drawer app temporary elevation="10" location="left" v-model="customizer.Customizer_drawer" width="320" class="left-customizer">
                <LcFullCustomizer/>
             </v-navigation-drawer> -->
  
            <LcFullVerticalSidebar />
            <LcFullVerticalHeader />

            <v-main>
               <v-container fluid class="page-wrapper pb-sm-15 pb-10">
                    <div :class="customizer.boxed ? 'maxWidth' : ''">
                        <slot />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
