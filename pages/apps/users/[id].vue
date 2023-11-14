<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from "@/stores/user";

// components
import ProfileBanner from '@/components/apps/user-profile/ProfileBanner.vue';
import PersonalInfoTab from '@/components/forms/form-horizontal/PersonalInfoTab.vue';
import AccountDetailsTab from '@/components/forms/form-horizontal/AccountDetailsTab.vue';
const userStore = useUserStore();
const currentUser = ref(userStore.$state);

const route = useRoute();
const { find, findOne } = useStrapi();
const resRoles = await find<Roles>('users-permissions/roles');
const userData = await findOne<Users>('users', route.params.id, {populate: '*'});
const thisUser = ref(userData);

const tab = ref(null);
const snackbar = useSnackbar();

const notify = (v) => {
    snackbar.add({
        type: v ? 'success' : 'failed',
        text: v ? 'Profile successfully updated!' : 'Opps, there was an error. Please try again'
    })
};

// Computed
const rolesList = computed(() => {
    return resRoles.roles.filter((r: any) => {
        return r.name !== 'Public';
    });
});

const isAdmin = ref(false);


if(userStore.$state.role.name == 'Admin') {
    isAdmin.value = true;
}

</script>

<template>
    <ProfileBanner :profileUser="thisUser" :currentUser="currentUser" @notification="notify" />
    <v-row class="mt-4">
        <v-col cols="12">
            <v-card elevation="10" class=" " rounded="md">
                <v-tabs v-model="tab" bg-color="transparent" color="primary">
                    <v-tab value="PersonalInfo" class="text-medium-emphasis">Personal Info</v-tab>
                    <v-tab value="AccountDetails" class="text-medium-emphasis">Account Details</v-tab>
                </v-tabs>
                <v-divider></v-divider>
                <v-card-text class="pa-sm-6 pa-3 pb-sm-6 pb-6">
                    <v-window v-model="tab">
                        <v-window-item value="PersonalInfo">
                            <PersonalInfoTab :profileUser="thisUser" @notification="notify" />
                        </v-window-item>
                        <v-window-item value="AccountDetails">
                            <AccountDetailsTab :profileUser="thisUser" :isAdmin="isAdmin" :roles="rolesList" @notification="notify" />
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>    
        </v-col>
    </v-row>
</template>
