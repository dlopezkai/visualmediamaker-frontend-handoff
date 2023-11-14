import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'User',
    state: () => ({
        role: {name: null}
    }),
    getters: {},
    actions: {}
});
