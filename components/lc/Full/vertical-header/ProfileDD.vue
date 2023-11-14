<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { MailIcon } from "vue-tabler-icons";
import proUser1 from '/images/svgs/icon-account.svg';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const currentUser = ref(userStore.$state);

const profileDD = ref([
    {
      avatar: proUser1,
      title: 'My Profile',
      subtitle: 'Account settings',
      href: `/apps/users/${currentUser?.value.id}`
    }
]);
const { logout } = useStrapiAuth()
const router = useRouter()
const onLogout = () => {
  logout()
  router.push('/auth/login')
}

</script>

<template>
  
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
        <v-avatar size="35" color="primary">
          <img v-if="currentUser?.picture" :src="currentUser?.picture?.url" height="35" :alt="currentUser?.firstName" />
          <span v-else class="text-h6 text-white">{{ currentUser?.firstName.charAt(0) + currentUser?.lastName.charAt(0) }}</span>
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="360" elevation="10">
      <div class="px-8 pt-6">
        <h6 class="text-h5 font-weight-medium">Profile</h6>
        <div class="d-flex align-center mt-4 pb-6">
          <v-avatar size="50" color="primary">
            <img v-if="currentUser?.picture" :src="currentUser?.picture?.url" height="50" :alt="currentUser?.firstName" />
            <span v-else class="text-h6 text-white">{{ currentUser?.firstName.charAt(0) + currentUser?.lastName.charAt(0) }}</span>
          </v-avatar>
          <div class="ml-3">
            <h6 class="text-h6 mb-n1">{{ `${currentUser.title ?? ''} ${currentUser.firstName} ${currentUser.lastName}` }}</h6>
            <span class="text-subtitle-1 font-weight-regular textSecondary"
              >{{ currentUser.tribeName ?? '' }}</span
            >
            <div class="d-flex align-center mt-1">
              <MailIcon size="18" stroke-width="1.5" />
              <span
                class="text-subtitle-1 font-weight-regular textSecondary ml-2"
                >{{ currentUser?.email }}</span
              >
            </div>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <perfect-scrollbar style="height: calc(100vh - 100px); max-height: 100px">
        <v-list class="py-0 theme-list" lines="two">
          <v-list-item
            v-for="item in profileDD"
            :key="item.title"
            class="py-4 px-8 custom-text-primary"
            :to="item.href"
          >
            <template v-slot:prepend>
              <v-avatar
                size="48"
                color="lightprimary"
                class="mr-3"
                rounded="md"
              >
                <v-img
                  :src="item.avatar"
                  width="24"
                  height="24"
                  :alt="item.avatar"
                />
              </v-avatar>
            </template>
            <div>
              <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">
                {{ item.title }}
              </h6>
            </div>
            <p class="text-subtitle-1 font-weight-regular textSecondary">
              {{ item.subtitle }}
            </p>
          </v-list-item>
        </v-list>
      </perfect-scrollbar>
      <div class="pt-4 pb-6 px-8 text-center">
        <v-btn color="primary" variant="outlined" block @click="onLogout"
          >Logout</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
