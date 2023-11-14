<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import sidebarItems from './sidebarItem';
import { useUserStore } from '@/stores/user';
const customizer = useCustomizerStore();
const userStore = useUserStore()
const sidebarMenu = shallowRef(sidebarItems);
const isAdmin = ref(userStore.$state.role?.name === 'Admin' ? true : false);

const fileterMenu = computed(() => {
    return sidebarMenu.value.filter((m) => {
        if(isAdmin) {
           return m
        } else {
            return m.admin == false
        }
    })
});
</script>

<style lang="scss">
.leftSidebar {
    background: #476573;
}
.scrollnavbar {
    .v-list {
        background: #476573;
        color: white;
        .v-list-item {
            &:hover {
                color: white;
            }
            .v-list-item-title {
                font-weight: bold;
                color: white;
            }
        }
        .v-list-item--active > .v-list-item__overlay {
            background: #F2F2F3;
        }
    }
    .smallCap {
        color: white;
    }
}
</style>

<template>
    <v-navigation-drawer
        left
        v-model="customizer.Sidebar_drawer"
        elevation="0"
        rail-width="75"
        mobile-breakpoint="960"
        app
        class="leftSidebar"
        :rail="customizer.mini_sidebar"
        expand-on-hover width="270"
    >
        <!---Logo part -->
        <!---Logo part -->
        <v-locale-provider  v-if="customizer.setRTLLayout"  rtl >
        <div class="pa-5">
            <LcFullLogoRtlLogo />
        </div>
        </v-locale-provider>
        <v-locale-provider  v-else>
        <div class="pa-5">
            <LcFullLogo />
        </div>
        </v-locale-provider>

        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <perfect-scrollbar class="scrollnavbar">
            <v-list class="pa-6" density="compact">
                <!---Menu Loop -->
                <template v-for="(item, i) in fileterMenu">
                    <div v-if="userStore.$state.role.name == 'Admin' && item.admin">
                        <!---Item Sub Header -->
                        <LcFullVerticalSidebarNavGroup :item="item" v-if="item.header" :key="item.title" />
                        <!---If Has Child -->
                        <LcFullVerticalSidebarNavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
                        <!---Single Item-->
                        <LcFullVerticalSidebarNavItem :item="item" v-else class="leftPadding" />
                        <!---End Single Item-->
                    </div>
                    <div v-else-if="!item.admin">
                        <!---Item Sub Header -->
                        <LcFullVerticalSidebarNavGroup :item="item" v-if="item.header" :key="item.title" />
                        <!---If Has Child -->
                        <LcFullVerticalSidebarNavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
                        <!---Single Item-->
                        <LcFullVerticalSidebarNavItem :item="item" v-else class="leftPadding" />
                        <!---End Single Item-->
                    </div>
                </template>
            </v-list>
            <div class="pa-6 userbottom">
                <LcFullVerticalSidebarProfile/>
            </div>
        </perfect-scrollbar>
    </v-navigation-drawer>
</template>
