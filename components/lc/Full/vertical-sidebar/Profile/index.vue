<script setup lang="ts">
import { PowerIcon } from "vue-tabler-icons";
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const currentUser = ref(userStore.$state);
const { logout } = useStrapiAuth()
const router = useRouter()
const onLogout = () => {
  logout()
  router.push('/auth/login')
}

</script>

<template>
  <v-sheet rounded="md" color="lightsecondary" class="px-4 py-3 ExtraBox">
    <div class="d-flex align-center hide-menu">
      <v-avatar size="50" class="userImage" color="primary">
          <img v-if="currentUser?.picture" :src="currentUser?.picture?.url" height="50" :alt="currentUser?.firstName" />
          <span v-else class="text-h6 text-white">{{ currentUser?.firstName.charAt(0) + currentUser?.lastName.charAt(0) }}</span>
      </v-avatar>
      <div class="ml-4">
        <h6 class="mb-n1 text-caption textPrimary">{{ currentUser?.firstName + ' ' + currentUser?.lastName }}</h6>
      </div>
      <div class="ml-auto">
        <v-btn
          variant="text"
          icon
          rounded="md"
          color="primary"
          @click="onLogout"
        >
          <PowerIcon />
          <v-tooltip activator="parent" location="top">Logout</v-tooltip>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>
<style lang="scss">
.ExtraBox {
  position: relative;
  overflow: hidden;
}
.line-height-none {
  line-height: normal;
}
</style>
