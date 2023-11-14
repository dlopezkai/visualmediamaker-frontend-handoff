import { useUserStore } from "@/stores/user";
import { ref } from 'vue';

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useStrapiUser();
  
  if (!user.value) {
    useCookie('redirect', { path: '/' }).value = to.fullPath
    return navigateTo('/auth/login')
  } else {
    const store = useUserStore();
    const { findOne } = useStrapi<any>();
    const response = await findOne('users', user.value.id, {populate: '*'});
    store.$state = response;

    const isAdmin = ref(store.$state.role.name === 'Admin' ? true : false);
    if(!isAdmin.value && to.path.includes('/apps/users/')) {
      // check if current user
      if(Number(store.$state.id) !== Number(to.params.id)) {
        return navigateTo('/')
      }
    }
  }
})  