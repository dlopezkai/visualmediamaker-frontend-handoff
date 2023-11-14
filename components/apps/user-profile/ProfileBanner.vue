<script setup lang="ts">
import { ref, shallowRef, reactive } from 'vue';
import { useObjectUrl } from '@vueuse/core';
import { HeartIcon, PencilIcon, PhoneCallIcon, PhotoIcon, UserCircleIcon, UsersIcon } from 'vue-tabler-icons';
import UserImage from '/images/profile/user-1.jpg';
import axios from 'axios';
const ax = axios.create();

const props = defineProps(["profileUser", "currentUser"]);

const editPic = ref(false);
const picFile = shallowRef();
const picURL = useObjectUrl(picFile);
const profileImg = ref(props.profileUser?.picture?.url);
const fileInfo = ref({
    'ref': 'plugin::users-permissions.user',
    'refId': props.profileUser?.id,
    'field': 'picture'
});

const onPicChange = (event) => {
    picFile.value = event.target.files[0];
}

const strapiUrl = useStrapiUrl();

const projectCount = computed(() => {
    return props.profileUser?.projects.length
});

const paymentCount = computed(() => {
    return props.profileUser?.payments.length
});

const loading = ref(false);

// Methods
// const { update } = useStrapi();
const saveImg = async () => {
    loading.value = true;
    try {
        const token = useStrapiToken();
        const formData = new FormData();
        if(props.profileUser?.picture) {
            formData.append('files', picFile.value, picFile.value.name);
            formData.append('fileInfo', JSON.stringify(fileInfo.value));
            ax.post(`${strapiUrl}/upload?id=${props.profileUser?.picture.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                // console.log(res.data.url);
                profileImg.value = res.data.url;
                editPic.value = false;
                loading.value = false;
            }).catch(err => {
                // console.log(err.message)
                loading.value = false;
            });
        } else {
            formData.append('files', picFile.value, picFile.value.name);
            formData.append('ref', 'plugin::users-permissions.user');
            formData.append('refId', props.profileUser?.id);
            formData.append('field', 'picture');
            ax.post(`${strapiUrl}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                // console.log(res.data);
                editPic.value = false;
                loading.value = false;
            }).catch(err => {
                // console.log(err);
                loading.value = false;
            });
        }
    } catch (e) {
        // console.log(e);
        loading.value = false;
    }
};
</script>

<template>
    <v-card elevation="10" class="overflow-hidden py-8">
        <v-row class="mt-1">
            <v-col cols="12" lg="4" sm="12" class="order-sm-second d-flex align-center">
                <div class="px-4 py-1 w-100">
                    <v-row class="justify-center">
                        <v-col cols="6" class="text-center">
                            <FileDescriptionIcon size="20" />
                            <h4 class="text-h4">{{ projectCount }}</h4>
                            <h6 class="text-h6 font-weight-regular">{{ projectCount == 1 ? 'Project' : 'Projects'}}</h6>
                        </v-col>
                        <v-col cols="6" class="text-center">
                            <UserCircleIcon size="20" />
                            <h4 class="text-h4">{{ paymentCount }} </h4>
                            <h6 class="text-h6 font-weight-regular">{{ paymentCount == 1 ? 'Payment' : 'Payments'}}</h6>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col cols="12" lg="4" sm="12" class="d-flex justify-center align-center order-sml-first">
                <div class="text-center">
                    <div class="avatar-border" style="position: relative;">
                        <v-avatar size="100" class="userImage">
                            <img v-if="props.profileUser?.picture" :src="profileImg" height="100" :alt="props.profileUser?.firstName" />
                            <span v-else class="text-h2 text-white">{{ props.profileUser?.firstName.charAt(0) + props.profileUser?.lastName.charAt(0) }}</span>
                        </v-avatar>
                        <v-btn v-if="props.profileUser.id == props.currentUser.id" size="x-small" position="absolute" variant="flat" class="profileimg-btn">
                                <PencilIcon size="16" />
                                <v-dialog
                                    v-model="editPic"
                                    activator="parent"
                                    width="auto"
                                    min-width="400"
                                >
                                    <v-card class="pa-4" >
                                        <v-card-title>Profile Picture</v-card-title>
                                        <v-card-text class="mb-5 text-center">
                                            <v-avatar v-if="picURL" size="100">
                                                <img  :src="picURL" height="100" />
                                            </v-avatar>
                                            <v-file-input
                                                show-size
                                                label="Upload"
                                                prepend-icon="mdi-camera"
                                                variant="underlined"
                                                hide-details
                                                @change="onPicChange"
                                            >
                                            </v-file-input>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-row class="d-flex justify-space-between align-center text-center">
                                                <v-col>
                                                    <v-btn @click="editPic = false" variant="outlined">Close</v-btn>
                                                </v-col>
                                                <v-col>
                                                    <v-btn variant="outlined" color="primary" @click="saveImg" :loading="loading">Save</v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                        </v-btn>
                    </div>
                    <h5 class="text-h5 mt-3">{{ `${$props.profileUser?.title ?? ''} ${$props.profileUser?.firstName} ${$props.profileUser?.lastName}` }}</h5>
                    <span class="text-h6 font-weight-regular">{{ $props.profileUser?.tribeName ?? '' }}</span>
                </div>
            </v-col>
            <v-col cols="12" lg="4" class="d-flex align-center justify-center justify-lg-end order-sm-third">
                <v-card variant="flat">
                    <v-card-item>
                        <h4 class="gap-3 mb-2">Contact Details</h4>

                        <div v-if="props.profileUser?.phone && props.profileUser?.phone2" class="d-flex gap-3 mb-2">
                            <PhoneCallIcon size="21" />
                            <span class="text-h6">{{ `${props.profileUser?.phone} | ${props.profileUser?.phone2}` }}</span>
                        </div>
                        <div v-else-if="props.profileUser?.phone" class="d-flex gap-3 mb-2">
                            <PhoneCallIcon size="21" />
                            <span class="text-h6">{{ props.profileUser?.phone }}</span>
                        </div>
                        <div v-else-if="props.profileUser?.phone2" class="d-flex gap-3 mb-2">
                            <PhoneCallIcon size="21" />
                            <span class="text-h6">{{ props.profileUser?.phone2 }}</span>
                        </div>

                        <div v-if="props.profileUser?.email" class="d-flex gap-3 mb-2">
                            <MailIcon size="21" />
                            <span class="text-h6">{{ props.profileUser?.email }}</span>
                        </div>
                        
                        <div v-if="props.profileUser?.location" class="d-flex gap-3 mb-2">
                            <MapPinIcon size="21" />
                            <span class="text-h6">{{ props.profileUser?.location }}</span>
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>
<style lang="scss">
.avatar-border {
    background-image: linear-gradient(rgb(113 204 210), rgb(241 93 37));;
    border-radius: 50%;
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    .userImage {
        border: 4px solid rgb(255, 255, 255);
    }
}

.top-spacer {
    margin-top: -95px;
}

.profiletab .v-slide-group__content {
    justify-content: end;
    .v-btn--variant-text .v-btn__overlay {
        background: transparent;
    }
}

@media (max-width: 1023px) {
    .order-sm-second {
        order: 2;
    }
    .order-sml-first {
        order: 1;
    }
    .order-sm-third {
        order: 3;
    }
    .order-sm-last {
        order: 4;
    }
}

.btn-brand-facebook {
    background-color: rgb(24, 119, 242) !important;
    color: rgb(var(--v-theme-surface)) ;
}
.btn-brand-twitter {
    background-color: rgb(29, 161, 242) !important;
    color: rgb(var(--v-theme-surface)) ;
}
.btn-brand-dribbble {
    background-color: rgb(234, 76, 137) !important;
    color: rgb(var(--v-theme-surface)) ;
}
.btn-brand-youtube {
    background-color: rgb(205, 32, 31) !important;
    color: rgb(var(--v-theme-surface)) ;
}

.profileimg-btn {
    top: 0;
    right: 0;
}
</style>
