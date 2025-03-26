<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import FormAddUser from "@/components/forms/form-layouts/FormAddUser.vue";
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const currentUser = ref(userStore.$state);

const { find } = useStrapi<USERS>();
// const response = await find('users', {populate: '*', fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'picture', 'role', 'title', 'tribeName', 'createdAt']});
let usersList = ref([]);

const dialog = ref(false);
const search = ref('');

const headers = reactive([
    {
        title: 'ID',
        align: 'start',
        sortable: false,
        key: 'id',
    },
    {
        title: 'Full Name',
        align: 'start',
        sortable: false,
        key: 'fullname',
    },
    {
        title: 'Email',
        align: 'start',
        sortable: false,
        key: 'email',
    },
    {
        title: 'Phone',
        align: 'start',
        sortable: false,
        key: 'phone',
    },
    {
        title: 'Role',
        align: 'start',
        sortable: false,
        key: 'role.name',
    }, 
    {
        title: 'Since',
        align: 'start',
        sortable: true,
        key: 'createdAt',
    },
    {
        title: 'Action',
        align: 'center',
        sortable: false,
        key: 'action',
    }
]);
const loading = ref(true);
const itemsPerPage = ref(10);
const totalItems = ref<Number>(0);


//Methods
const filteredUsersList = computed(() => {
    return usersList.value.filter((u: any) => {
        loading.value = false;
        return u.id !== currentUser?.value?.id;
    });
});

const newUserAdded = async () => {
    dialog.value = false;
    usersList.value = await find('users', {populate: '*', fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'title', 'tribeName', 'createdAt']});
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
            fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'picture', 'role', 'title', 'tribeName', 'createdAt'],
            sort: `${sortBy[0]?.key}:${sortBy[0]?.order}`,
            pagination: {page: page, pageSize: itemsPerPage},
            filters: {
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
                    {
                        email: {
                            $contains: search,
                        },
                    },
                    {
                        phone: {
                            $contains: search,
                        },
                    },
                ],
            }
        }
    } else {
        itemQuery.value = {
            populate: '*', 
            fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'title', 'tribeName', 'createdAt'],
            sort: `${sortBy[0]?.key || 'id'}:${sortBy[0]?.order || 'desc'}`,
            pagination: {page: page, pageSize: itemsPerPage}
        }
    }
    usersList.value = await find('users', itemQuery.value);
    // console.log("users: ", filteredUsersList);

    totalItems.value = filteredUsersList.value.length;
}

const editUser = async (userId) => {
    await navigateTo({
        path: `/apps/users/${userId}`,
        params: {
            id: userId
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
            <v-text-field density="compact" v-model="search" label="Search Contacts" hide-details variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" flat class="ml-auto">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add User
                    </v-btn>
                </template>
                <UiParentCard title="Add User" >
                    <FormAddUser @close="close" @newUser="newUserAdded" />
                </UiParentCard>  
            </v-dialog>
        </v-col>
    </v-row>

    <v-data-table-server 
        v-model:items-per-page="itemsPerPage"
        :headers="(headers as any)"
        :items-length="totalItems"
        :items="filteredUsersList"
        :loading="loading"
        :search="search"
        class="elevation-1 mt-5 text-body-1 text-left"
        item-value="id"
        @update:options="loadItems"
    >
        <template v-slot:item.fullname="{ item }">
            <div class="d-flex align-center py-2">
                <v-avatar color="primary" size="50">
                    <v-img
                        v-if="item.selectable.picture"
                        :src="item.selectable.picture.url"
                        :alt="item.selectable.firstName"
                        height="50"
                        class="avatar-cover"
                    ></v-img>
                    <span v-else class="text-h5">{{ item.selectable.firstName.charAt(0) + item.selectable.lastName.charAt(0) }}</span>
                </v-avatar>
                <div class="ml-2">
                    <h4 class="text-body-1 font-weight-semibold">{{ (item.selectable.title ?? '') + ' ' + item.selectable.firstName + ' ' + item.selectable.lastName }}</h4>
                    <span class="text-subtitle-1 d-block mt-0 textSecondary">{{ item.selectable.tribeName ?? '' }}</span>
                </div>
            </div>
        </template>

        <template v-slot:item.createdAt="{ item }">
            <h6 class="text-body-1">{{ new Date(item.selectable.createdAt).toLocaleDateString() }}</h6>
        </template>

        <template v-slot:item.action="{ item }">
            <div class="d-flex align-center">
                <v-tooltip text="Edit">
                    <template v-slot:activator="{ props }">
                        <v-btn icon flat @click="editUser(item.selectable.id)" v-bind="props"
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
