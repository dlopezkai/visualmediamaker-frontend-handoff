<script setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps(["profileUser"]);
const emit = defineEmits(['notification']);
const accInfo = reactive({
    title: props.profileUser?.title,
    firstName: props.profileUser?.firstName,
    lastName: props.profileUser?.lastName,
    tribeName: props.profileUser?.tribeName,
    location: props.profileUser?.location,
    phone: props.profileUser?.phone,
    phone2: props.profileUser?.phone2
});
const loading = ref(false);
const location = ref({
    address: '',
    coords: {}
})
const setPlace = (e: any) => {
    // console.log('Changed: ', e.geometry.location);
    location.value.address = e.formatted_address;
    location.value.coords = e.geometry.location;
}
//Method
const client = useStrapiClient();
const saveAccinfo = async () => {
    loading.value = true;
    try {
        await client<Users>(`/users/${props.profileUser.id}`, { method: 'PUT', body: {...accInfo, location: location.value.address, coords: location.value.coords} })
        emit('notification', true);
        loading.value = false;
    } catch (e) {
        // console.log(e)
        emit('notification', false);
        loading.value = false;
    }
}
</script>

<template>
    <v-row class="align-center mb-3 mt-1">
        <v-col cols="12" md="2">
            <VTextField color="primary" type="text" placeholder="Mr/Ms" hide-details label="Title" v-model="accInfo.title">
            </VTextField>
        </v-col>
        <v-col cols="12" md="5">
            <VTextField color="primary" type="text" placeholder="John" hide-details label="First Name"
                v-model="accInfo.firstName"></VTextField>
        </v-col>
        <v-col cols="12" md="5">
            <VTextField color="primary" variant="outlined" type="text" placeholder="Doe" hide-details label="Last Name"
                v-model="accInfo.lastName"></VTextField>
        </v-col>
    </v-row>
    <v-row class="align-center mb-3">
        <v-col cols="12" md="6">
            <VTextField color="primary" variant="outlined" type="text" placeholder="Tribe" hide-details label="Tribe Name"
                v-model="accInfo.tribeName"></VTextField>
        </v-col>
        <v-col cols="12" md="6">
            <GMapAutocomplete class="location" placeholder="Location" @place_changed="setPlace" color="primary" variant="outlined" type="text">
            </GMapAutocomplete>
            <!-- <VTextField color="primary" variant="outlined" type="text" placeholder="Address" hide-details label="Location"
                v-model="accInfo.location"></VTextField> -->
        </v-col>
    </v-row>
    <v-row class="align-center mb-3">
        <v-col cols="12" md="6">
            <VTextField color="primary" variant="outlined" type="text" placeholder="Phone" hide-details label="Phone"
                v-model="accInfo.phone"></VTextField>
        </v-col>
        <v-col cols="12" md="6">
            <VTextField color="primary" variant="outlined" type="text" placeholder="Phone 2" hide-details label="Phone 2"
                v-model="accInfo.phone2"></VTextField>
        </v-col>
    </v-row>
    <v-row class="align-center mb-3">
        <v-col cols="12" class="mt-n6 text-right">
            <v-btn color="primary" flat @click="saveAccinfo" :loading="loading">Update</v-btn>
        </v-col>
</v-row></template>
<style>
.location{
    padding: 12px;
    border: 1px solid;
    width: inherit;
    border-radius: 6px;
    border-color: rgb(133 133 133 / 22%);
    font-size: 14px;
}
</style>
