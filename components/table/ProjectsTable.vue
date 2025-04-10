<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useUserStore } from '@/stores/user';
import FormAddProject from "@/components/forms/form-layouts/FormAddProject.vue";

const userStore = useUserStore();
const currentUser = ref(userStore.$state);
const isAdmin = ref(currentUser?.value.role?.name == 'Admin' ? true : false);
const { find } = useStrapi<any>();
const getUsers = await find('users', {populate: 'role', fields: ['id', 'firstName', 'lastName', 'title', 'tribeName']});
let projectsList = ref([]);

const dialog = ref(false);
const successDialog = ref(false);
const search = ref('');
const headers = reactive([
    {
        title: 'Project ID',
        align: 'start',
        key: 'id',
        sortable: false
    },
    {
        title: 'Project Name',
        align: 'start',
        key: 'name',
        sortable: false
    },
    {
        title: 'Fellow',
        align: 'start',
        key: 'fellow',
        sortable: false
    },
    {
        title: 'Mentor',
        align: 'start',
        key: 'mentor',
        sortable: false
    },
    {
        title: 'Program',
        align: 'start',
        key: 'program',
        sortable: true
    },
    {
        title: 'Year',
        align: 'start',
        key: 'createdAt',
        sortable: true
    },
    {
        title: 'Action',
        align: 'start',
        key: 'action',
        sortable: false
    },
]);
const loading = ref(true);
const itemsPerPage = ref(10);

//Methods
const filteredFellows = computed(() => {
    return getUsers.filter((u: any) => {
        u.fullName = `${u.title ?? ''} ${u.firstName} ${u.lastName}`;
        return u.role.name == "Fellow";
    });
});

const filteredMentors = computed(() => {
    return getUsers.filter((u: any) => {
        u.fullName = `${u.title ?? ''} ${u.firstName} ${u.lastName}`
        return u.role.name == "Mentor";
    });
});

const filteredProjectsList = computed(() => {
    if(isAdmin.value) {
        loading.value = false;
        return projectsList.value;
    } else {
        return projectsList.value.filter((u: any) => {
            loading.value = false;
            return u.fellow?.id == currentUser?.value?.id || u.mentor?.id == currentUser?.value?.id;
        });
    }
});

const newProjectInfo = ref({});

const newProjectAdded = async (info) => {
    dialog.value = false;
    loading.value = true;
    newProjectInfo.value = info;
    let res = await find('projects', {populate: '*', fields: ['id', 'name', 'program', 'createdAt']});
    projectsList.value = res.data;
    totalItems.value = res.meta.pagination.total;
    successDialog.value = true;
}
const itemQuery = ref({});
const loadItems = async ({ page, itemsPerPage, sortBy, search }) => {
    loading.value = true;
    // console.log("page: ", page);
    // console.log("pageSize: ", itemsPerPage);
    // console.log("Sort: ", sortBy[0]);
    // console.log("Search: ", search);
    if(search) {
        itemQuery.value = {
            populate: '*', 
            fields: ['id', 'name', 'program', 'createdAt'],
            sort: (!sortBy[0] ? `createdAt:asc` : `${sortBy[0]?.key}:${sortBy[0]?.order}`),
            pagination: {page: page, pageSize: itemsPerPage},
            filters: {
                $or: [
                    {
                        name: {
                            $contains: search,
                        },
                    },
                    {
                        fellow: {
                            $or: [
                                {
                                    firstName: {
                                        $contains: search,
                                    },
                                },
                                {
                                    lastName: {
                                        $contains: search,
                                    },
                                },
                            ]
                        }
                    },
                    {
                        mentor: {
                            $or: [
                                {
                                    firstName: {
                                        $contains: search,
                                    },
                                },
                                {
                                    lastName: {
                                        $contains: search,
                                    },
                                },
                            ]
                        }
                    },
                    {
                        program: {
                            $eq: search,
                        },
                    },
                ],
            }
        }
    } else {
        itemQuery.value = {
            populate: '*', 
            fields: ['id', 'name', 'program', 'createdAt'],
            sort: `${sortBy[0]?.key || 'id'}:${sortBy[0]?.order || 'desc'}`,
            pagination: {page: page, pageSize: itemsPerPage}
        }
    }
    let res = await find('projects', itemQuery.value);
    projectsList.value = res.data;
    totalItems.value = res.meta.pagination.total;
}

const totalItems = ref<Number>(0);

// console.log("Filtered List: ", filteredProjectsList);

const editProject = async (Id, popup) => {
    if(popup) {
        loading.value = true;
    }
    await navigateTo({
        path: `/projects/${Id}`,
        params: {
            id: Id
        }
    })
}

const close = () => {
    dialog.value = false;
}
</script>
<template>
    <v-row>
        <v-col cols="12" lg="4" md="6">
            <v-text-field density="compact" v-model="search" label="Search Projects" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right" v-if="isAdmin">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto">
                        <v-icon class="mr-2">mdi-plus</v-icon>New Project
                    </v-btn>
                </template>
                <UiParentCard title="New Project" >
                    <FormAddProject @close="close" @newProject="newProjectAdded" :mentors="filteredMentors" :fellows="filteredFellows" />
                </UiParentCard>  
            </v-dialog>

            <v-dialog
                transition="dialog-bottom-transition"
                width="auto"
                v-model="successDialog"
            >
                <v-card>
                    <v-toolbar
                    color="primary"
                    :title="'Project Created Successfully'"
                    ></v-toolbar>
                    <v-card-text class="pa-12">
                        <h2 class="text-h2">{{ newProjectInfo.name }}</h2>
                        <h6 class="text-h6 mt-5">You may now continue setting up this project.</h6>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn
                            class="mr-2"
                            color="error"
                            flat
                            @click="(successDialog = false) && (loading = false)"
                        >Close</v-btn>
                        <span class="mr-2">or</span>
                        <v-btn
                            color="primary"
                            flat
                            @click="editProject(newProjectInfo.id, true)"
                        >Finish Setup</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
        <v-data-table-server 
            v-model:items-per-page="itemsPerPage"
            :headers="(headers as any)"
            :items-length="totalItems"
            :items="filteredProjectsList"
            :loading="loading"
            :search="search"
            class="elevation-1 mt-5 text-body-1 text-left"
            item-value="id"
            @update:options="loadItems"
        >   
            <template v-slot:item.fellow="{ item }">
                <div v-if="item.selectable.fellow" class="d-flex align-center py-2">
                    <v-avatar color="primary" size="50">
                        <v-img
                            v-if="item.selectable.fellow?.picture"
                            :src="item.selectable.fellow?.picture.url"
                            :alt="item.selectable.fellow?.firstName"
                            height="50"
                            class="avatar-cover"
                        ></v-img>
                        <span v-else class="text-h5">{{ item.selectable.fellow?.firstName.charAt(0) + item.selectable.fellow?.lastName.charAt(0) }}</span>
                    </v-avatar>
                    <div class="ml-2">
                        <h4 class="text-body-1 font-weight-semibold">{{ `${item.selectable.fellow?.title ?? ''} ${item.selectable.fellow?.firstName} ${item.selectable.fellow?.lastName}` }}</h4>
                        <span class="text-subtitle-1 d-block mt-0 textSecondary">{{ item.selectable.fellow?.tribeName ?? '' }}</span>
                    </div>
                </div>
            </template>

            <template v-slot:item.mentor="{ item }">
                <div v-if="item.selectable.mentor" class="d-flex align-center py-2">
                    <v-avatar color="primary" size="50">
                        <v-img
                            v-if="item.selectable.mentor.picture"
                            :src="item.selectable.mentor.picture.url"
                            :alt="item.selectable.mentor.firstName"
                            height="50"
                            class="avatar-cover"
                        ></v-img>
                        <span v-else class="text-h5">{{ item.selectable.mentor.firstName.charAt(0) + item.selectable.mentor.lastName.charAt(0) }}</span>
                    </v-avatar>
                    <div class="ml-2">
                        <h4 class="text-body-1 font-weight-semibold">{{ `${item.selectable.mentor.title ?? ''} ${item.selectable.mentor.firstName} ${item.selectable.mentor.lastName}` }}</h4>
                        <span class="text-subtitle-1 d-block mt-0 textSecondary">{{ item.selectable.mentor.tribeName ?? '' }}</span>
                    </div>
                </div>
            </template>

            <template v-slot:item.createdAt="{ item }">
                <h6 class="text-body-1">{{ new Date(item.selectable.createdAt).getFullYear() }}</h6>
            </template>

            <template v-slot:item.action="{ item }">
                <div class="d-flex align-center">
                    <v-tooltip text="Edit">
                        <template v-slot:activator="{ props }">
                            <v-btn icon flat @click="editProject(item.selectable.id, false)" v-bind="props"
                                ><PencilIcon stroke-width="1.5" size="20" class="text-primary"
                            /></v-btn>
                        </template>
                    </v-tooltip>
                </div>
            </template>
        </v-data-table-server>


</template>

<style lang="scss">
.avatar-cover img {
    object-fit: cover;
}
</style>
