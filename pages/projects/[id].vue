<script setup lang="ts">
import { ref, reactive } from 'vue';

import { useUserStore } from '@/stores/user';
import currency from 'currency.js';
import { CirclePlusIcon, PlusIcon } from 'vue-tabler-icons';
import FormAddSet from '@/components/forms/FormAddSet.vue';
import FormUploadFile from '@/components/forms/FormUploadFile.vue';
import FormAddSetItem from '@/components/forms/FormAddSetItem.vue';
import FormConfirmSet from '@/components/forms/FormConfirmSet.vue';
import axios from 'axios';
const ax = axios.create();

const userStore = useUserStore();
const currentUser = ref(userStore.$state);
const mentorDeleteLoading = ref(false);
const fellowDeleteLoading = ref(false);
const fileDeleteLoading = ref(false);
const viewFile = ref();
const route = useRoute();
const { find, findOne, delete: _delete } = useStrapi<any>();
const isAdmin = ref<boolean>(currentUser?.value.role?.name === 'Admin' ? true : false);
const isFellow = ref<boolean>(currentUser?.value.role?.name === 'Fellow' ? true : false);
const isMentor = ref<boolean>(currentUser?.value.role?.name === 'Mentor' ? true : false);
const getProject = await findOne('projects', route.params.id, {
  populate: [
    'payments.to',
    'sets.items',
    'monthly_progresses.user',
    'fellow.picture',
    'mentor',
    'fellow_goals',
    'mentor_goals',
    'file'
  ]
});
const assignFile = (file: any) => {
  viewFile.value = file;
  imageDialog.value = true;
}
const openFile = (url) => {
    window.open(url, '_blank').focus();
}
const deleteFile = async(id: any) => {
  fileDeleteLoading.value = true;
  await _delete('upload/files', id);
  reloadProject();
}
const removeFellowGoal = async (id: any) => {
  fellowDeleteLoading.value = true;
  await _delete('fellow-goals', id);
  reloadProject();
}
const removeMentorGoal = async (id: any) => {
  mentorDeleteLoading.value = true;
  await _delete('mentor-goals', id);
  reloadProject();
}
// console.log('PROJECT: ', getProject.data);
const thisProject = ref(getProject.data);
const loading = ref(false);
const addSetDialog = ref(false);
const imageDialog = ref(false);
const addUploadDialog = ref(false);
const addSetItemDialog = ref(false);
const confirmSetDialog = ref(false);
const fellowGoal = reactive({
  name: '',
  completed: false,
  project: thisProject.value.id
});
const mentorGoal = reactive({
  name: '',
  completed: false,
  project: thisProject.value.id
});
const monthlyReport = reactive({
  text: '',
  date: new Date(),
  user: currentUser?.value.id,
  project: thisProject.value.id
});
// Computed
const strapiUrl = useStrapiUrl();

const fellowPayments = computed(() => {
  return thisProject.value.payments.filter(pm => {
    return pm.to.id == thisProject.value.fellow.id
  })
});

const fellowActuals = computed(() => {
  let sum = 0;
  for (let num of fellowPayments.value) {
    sum += num.amount
  }
  return sum;
});

const mentorPayments = computed(() => {
  return thisProject.value.payments.filter(pm => {
    return pm.to.id == thisProject.value.mentor.id
  })
});

const mentorActuals = computed(() => {
  let sum = 0;
  for (let num of mentorPayments.value) {
    sum += num.amount
  }
  return sum;
});
// Fellow
const completedTasks = computed(() => {
  return thisProject.value.fellow_goals.filter(task => task.completed).length;
});
const progress = computed(() => {
  return (completedTasks.value / thisProject.value.fellow_goals.length) * 100;
});
const remainingTasks = computed(() => {
  return thisProject.value.fellow_goals.length - completedTasks.value;
});
// Mentor
const completedMentorTasks = computed(() => {
  return thisProject.value.mentor_goals.filter(task => task.completed).length;
});
const progressMentor = computed(() => {
  return (completedMentorTasks.value / thisProject.value.mentor_goals.length) * 100;
});
const remainingMentorTasks = computed(() => {
  return thisProject.value.mentor_goals.length - completedMentorTasks.value;
});

// Methods
const setCompletedTasks = (n) => {
  // console.log("Completed Number is: ", n);
  return thisProject.value.sets[n].items.filter(task => task.completed).length;
};
const setProgress = (n) => {
  // console.log("Progress Number is: ", n);
  return (setCompletedTasks(n) / thisProject.value.sets[n].items.length) * 100;
}
const setRemainingTasks = (n) => {
  // console.log("Remaining Number is: ", n);
  return thisProject.value.sets[n].items.length - setCompletedTasks(n);
}
const reloadProject = async () => {
  const updateProject = await findOne('projects', route.params.id, {
    populate: [
      'payments.to',
      'sets.items',
      'monthly_progresses.user',
      'fellow.picture',
      'mentor',
      'fellow_goals',
      'mentor_goals',
      'file'
    ]
  });
  thisProject.value = updateProject.data;
  addSetDialog.value = false;
  addSetItemDialog.value = false;
  confirmSetDialog.value = false;
  loading.value = false;
  mentorDeleteLoading.value = false;
  fellowDeleteLoading.value = false;
  fileDeleteLoading.value = false;
}

const close = () => {
  addSetDialog.value = false;
}
const closeUpload = () => {
  addUploadDialog.value = false;
}

const closeTask = () => {
  addSetItemDialog.value = false;
}

const createFellowGoal = async () => {
  // console.log("This function ran");
  if (fellowGoal.name === '') {
    return false;
  }
  try {
    loading.value = true;
    const token = useStrapiToken();
    await ax.post(`${strapiUrl}/fellow-goals`, { data: fellowGoal }, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    fellowGoal.name = '';
    reloadProject()
  } catch (e: any) {
    // console.log(e);
    loading.value = false;
  }
}
const createMentorGoal = async () => {
  if (mentorGoal.name === '') {
    return false;
  }
  try {
    loading.value = true;
    const token = useStrapiToken();
    await ax.post(`${strapiUrl}/mentor-goals`, { data: mentorGoal }, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    mentorGoal.name = '';
    reloadProject()
  } catch (e: any) {
    // console.log(e);
    loading.value = false;
  }
}

const createReport = async () => {
  if (monthlyReport.text === '') {
    return false;
  }
  try {
    loading.value = true;
    const token = useStrapiToken();
    await ax.post(`${strapiUrl}/monthly-progresses`, { data: monthlyReport }, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    monthlyReport.text = '';
    reloadProject()
  } catch (e: any) {
    // console.log(e);
    loading.value = false;
  }
}

const updateFellowGoal = async (item, itemId) => {
  try {
    loading.value = true;
    const token = useStrapiToken();
    const itemData = thisProject.value.fellow_goals[item].completed;
    await ax.put(`${strapiUrl}/fellow-goals/${itemId}`, { data: { completed: itemData } }, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    reloadProject()
  } catch (e: any) {
    // console.log(e);
    loading.value = false;
  }
}

const updateMentorGoal = async (item, itemId) => {
  try {
    loading.value = true;
    const token = useStrapiToken();
    const itemData = thisProject.value.mentor_goals[item].completed;
    await ax.put(`${strapiUrl}/mentor-goals/${itemId}`, { data: { completed: itemData } }, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    reloadProject()
  } catch (e: any) {
    // console.log(e);
    loading.value = false;
  }
}


const updateSetItem = async (set, item, itemId) => {
  try {
    loading.value = true;
    const token = useStrapiToken();
    const itemData = thisProject.value.sets[set].items[item].completed;
    await ax.put(`${strapiUrl}/deliverable-items/${itemId}`, { data: { completed: itemData } }, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    reloadProject()
  } catch (e: any) {
    // console.log(e);
    loading.value = false;
  }
}

</script>
<template>
  <v-row>
    <!-- TOP  -->
    <v-col cols="12">
      <v-card color="primary" class="d-flex justify-space-between pa-2" flat>
        <div class="text-left w-100">
          <v-card-subtitle class="text-h6 pb-0 white--text mb-2 text-uppercase"
            style="line-height: 1rem;">Project</v-card-subtitle>
          <v-card-title class="pt-1 white--text font-weight-bold text-h3" style="line-height: 1rem;">{{ thisProject.name
          }}</v-card-title>
        </div>
        <div class="text-right w-100">
          <v-card-subtitle class="text-h6 pb-0 white--text mb-2 text-uppercase"
            style="line-height: 1rem;">Program</v-card-subtitle>
          <v-card-title class="pt-1 white--text font-weight-bold text-h3" style="line-height: 1rem;">{{
            thisProject.program }}</v-card-title>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" lg="8">
      <v-card elevation="1">
        <v-card-text class="pa-5">
          <div class="d-sm-flex align-center">
            <div>
              <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Budget</h3>
            </div>

            <div class="ml-auto">
              <div class="d-flex align-center">
                <div class="d-flex align-center px-2">
                  <span style="color: #71CED0">
                    <span class="overline">
                      <i class="mdi mdi-brightness-1 mr-2"></i>
                    </span>
                    <span class="font-weight-regular">Fellow</span>
                  </span>
                </div>
                <div class="d-flex align-center px-2">
                  <span style="color: #EF5E24">
                    <span class="overline">
                      <i class="mdi mdi-brightness-1 mr-2"></i>
                    </span>
                    <span class="font-weight-regular">Mentor</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-9">
            <v-row class="mt-6 text-center" style="color: #71CED0;">
              <v-col cols="6">
                <h3 class="mb-0 font-weight-bold text-h5">{{ thisProject.fellow_awarded ?
                  currency(thisProject.fellow_awarded).format() : currency(0).format() }}</h3>
                <small class="text-overline">Awarded</small>
              </v-col>
              <v-col cols="6">
                <h3 class="mb-0 font-weight-bold text-h5">{{ currency(fellowActuals).format() }}</h3>
                <small class="text-overline">Actual (Spent)</small>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="mt-6 text-center" style="color: #EF5E24;">
              <v-col cols="6">
                <h3 class="mb-0 font-weight-bold text-h5">{{ thisProject.mentor_awarded ?
                  currency(thisProject.mentor_awarded).format() : currency(0).format() }}</h3>
                <small class="text-overline">Awarded</small>
              </v-col>
              <v-col cols="6">
                <h3 class="mb-0 font-weight-bold text-h5">{{ currency(mentorActuals).format() }}</h3>
                <small class="text-overline">Actual (Spent)</small>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4">
      <v-card elevation="1">
        <v-card-text class="pa-5" style="min-height: 262px;">
          <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Status: <span
              class="text-primary">{{ thisProject.status ?? thisProject.sets[0]?.name ?? 'Not Started' }}</span></h3>
          <div class="py-6">
            <!-- <v-card-title class="text-primary text-h6">{{ thisProject.status ?? thisProject.sets[0]?.name ?? 'Not Started' }}</v-card-title> -->
            <v-card-subtitle class="text-body-1 text-wrap">{{ thisProject.statusInfo ?? '...' }}</v-card-subtitle>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- LEFT SIDE -->
    <v-col cols="12" lg="4">
      <!-- FELLOW GOALS -->
      <v-card v-if="isAdmin || isFellow" class="mb-7" elevation="1">
        <v-card-text class="pa-5">
          <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">My Goals</h3>
          <p v-if="isAdmin" class="text-secondary text-uppercase text-body-2">For Fellows</p>
          <v-text-field v-model="fellowGoal.name" label="What are you working on?" filled :disabled="loading"
            append-inner-icon="mdi-plus-circle" @keyup.enter="createFellowGoal" @click:append-inner="createFellowGoal"
            color="primary" class="mt-4">
          </v-text-field>

          <h2 class="font-weight-medium success--text text-center">
            Goals:&nbsp;
            <v-fade-transition leave-absolute>
              <span :key="`tasks-${thisProject.fellow_goals.length}`">{{ thisProject.fellow_goals.length }}</span>
            </v-fade-transition>
          </h2>

          <v-divider class="mt-4"></v-divider>

          <v-row class="my-1" align="center">
            <span class="mx-4 info--text text-body-1">Remaining: {{ remainingTasks }}</span>

            <v-divider vertical></v-divider>

            <span class="mx-4 success--text text-body-1">Completed: {{ completedTasks }}</span>

            <v-spacer></v-spacer>

            <v-progress-circular :value="progress" class="mr-2"></v-progress-circular>
          </v-row>

          <v-divider class="mb-4"></v-divider>

          <v-card v-if="thisProject.fellow_goals.length > 0" elevation="0">
            <v-list>
              <v-slide-y-transition class="py-0" group>
                <template v-for="(task, i) in thisProject.fellow_goals" :key="task.id">
                  <v-divider v-if="i !== 0"></v-divider>

                  <v-list-item>
                    <v-row class="d-flex align-center">
                      <v-col cols="8">
                        <v-list-item-action>
                          <v-checkbox hide-details v-model="task.completed" :color="task.completed && 'grey' || 'primary'"
                            @change="updateFellowGoal(i, task.id)">
                            <template v-slot:label>
                              <div :class="task.completed && 'grey--text' || 'blue-grey--text text--darken-2'"
                                class="ml-2 text-wrap text-body-1">{{ task.name }}</div>
                            </template>
                          </v-checkbox>
                        </v-list-item-action>
                      </v-col>
                      <v-col cols="1">
                        <v-scroll-x-transition>
                          <v-icon v-if="task.completed" color="success">mdi-check</v-icon>
                        </v-scroll-x-transition>
                      </v-col>
                      <v-col cols="3">
                        <v-scroll-x-transition>
                          <v-btn @click="removeFellowGoal(task.id)" color="red-lighten-1" variant="text" icon="mdi-delete" :loading="fellowDeleteLoading">
                          </v-btn>
                        </v-scroll-x-transition>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </template>
              </v-slide-y-transition>
            </v-list>
          </v-card>
        </v-card-text>
      </v-card>

      <!-- MENTOR GOALS -->
      <v-card v-if="isAdmin || isMentor" class="mb-7" elevation="1">
        <v-card-text class="pa-5">
          <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">My Goals</h3>
          <p v-if="isAdmin" class="text-secondary text-uppercase text-body-2">For Mentors</p>
          <v-text-field v-model="mentorGoal.name" label="What are you working on?" filled :disabled="loading"
            append-inner-icon="mdi-plus-circle" @keyup.enter="createMentorGoal" @click:append-inner="createMentorGoal"
            color="primary" class="mt-4">
          </v-text-field>

          <h2 class="font-weight-medium success--text text-center">
            Goals:&nbsp;
            <v-fade-transition leave-absolute>
              <span :key="`tasks-${thisProject.mentor_goals.length}`">{{ thisProject.mentor_goals.length }}</span>
            </v-fade-transition>
          </h2>

          <v-divider class="mt-4"></v-divider>

          <v-row class="my-1" align="center">
            <span class="mx-4 info--text text-body-1">Remaining: {{ remainingMentorTasks }}</span>

            <v-divider vertical></v-divider>

            <span class="mx-4 success--text text-body-1">Completed: {{ completedMentorTasks }}</span>

            <v-spacer></v-spacer>

            <v-progress-circular :value="progressMentor" class="mr-2"></v-progress-circular>
          </v-row>

          <v-divider class="mb-4"></v-divider>

          <v-card v-if="thisProject.mentor_goals.length > 0" elevation="0">
            <v-list>
              <v-slide-y-transition class="py-0" group>
                <template v-for="(task, i) in thisProject.mentor_goals" :key="task.id">
                  <v-divider v-if="i !== 0"></v-divider>

                  <v-list-item>
                    <v-row class="d-flex align-center">
                      <v-col cols="8">
                        <v-list-item-action>
                          <v-checkbox hide-details v-model="task.completed" :color="task.completed && 'grey' || 'primary'"
                            @change="updateMentorGoal(i, task.id)">
                            <template v-slot:label>
                              <div :class="task.completed && 'grey--text' || 'blue-grey--text text--darken-2'"
                                class="ml-2 text-wrap text-body-1">{{ task.name }}</div>
                            </template>
                          </v-checkbox>
                        </v-list-item-action>
                      </v-col>
                      <v-col cols="1">
                        <v-scroll-x-transition>
                          <v-icon v-if="task.completed" color="success">mdi-check</v-icon>
                        </v-scroll-x-transition>
                      </v-col>
                      <v-col cols="3">
                        <v-scroll-x-transition>
                          <v-btn @click="removeMentorGoal(task.id)" variant="text" color="red-lighten-1" icon="mdi-delete" :loading="mentorDeleteLoading">
                          </v-btn>
                        </v-scroll-x-transition>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </template>
              </v-slide-y-transition>
            </v-list>
          </v-card>
        </v-card-text>
      </v-card>

      <!-- Fellow Card -->
      <v-card class="position-relative profile-card mb-7" elevation="1">
        <v-card-text class="pa-5">
          <div>
            <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Fellow</h3>
          </div>
          <div class="text-center">
            <v-avatar size="100" color="primary" class="mb-2">
              <img v-if="thisProject.fellow?.picture" :src="thisProject.fellow?.picture?.url" height="100"
                :alt="thisProject.fellow?.firstName" />
              <span v-else class="text-h1 text-white">{{ thisProject.fellow?.firstName.charAt(0) +
                thisProject.fellow?.lastName.charAt(0) }}</span>
            </v-avatar>
            <h2 class="font-weight-regular">{{ `${thisProject.fellow?.title ?? ''} ${thisProject.fellow?.firstName}
                          ${thisProject.fellow?.lastName}` }}</h2>
            <h6 class="op-5 font-weight-regular text-subtitle-1">{{ thisProject.fellow?.tribeName ?? '' }}</h6>
            <v-card-item>
              <div v-if="thisProject.fellow?.phone && thisProject.fellow?.phone2" class="d-flex gap-3 mb-2 align-center">
                <PhoneCallIcon size="16" />
                <span class="text-body-1">{{ `${thisProject.fellow?.phone} | ${thisProject.fellow?.phone2}` }}</span>
              </div>
              <div v-else-if="thisProject.fellow?.phone" class="d-flex gap-3 mb-2 align-center">
                <PhoneCallIcon size="16" />
                <span class="text-body-1">{{ thisProject.fellow?.phone }}</span>
              </div>
              <div v-else-if="thisProject.fellow?.phone2" class="d-flex gap-3 mb-2 align-center">
                <PhoneCallIcon size="16" />
                <span class="text-body-1">{{ thisProject.fellow?.phone2 }}</span>
              </div>

              <div v-if="thisProject.fellow?.email" class="d-flex gap-3 mb-2 align-center">
                <MailIcon size="18" />
                <span class="text-body-1">{{ thisProject.fellow?.email }}</span>
              </div>
              <div v-if="thisProject.fellow?.location" class="d-flex gap-3 mb-2 align-center">
                <MapPinIcon size="16" />
                <span class="text-h6">{{ thisProject.fellow?.location }}</span>
              </div>
            </v-card-item>
          </div>
        </v-card-text>
      </v-card>

      <!-- Mentor card -->
      <v-card class="position-relative profile-card mb-7" elevation="1">
        <v-card-text class="pa-5">
          <div>
            <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Mentor</h3>
          </div>
          <div class="text-center">
            <v-avatar size="100" color="primary" class="mb-2">
              <v-img v-if="thisProject.mentor?.picture" :src="thisProject.mentor?.picture?.url" height="100"
                :alt="thisProject.mentor?.firstName"></v-img>
              <span v-else class="text-h1 text-white">{{ thisProject.mentor?.firstName.charAt(0) +
                thisProject.mentor?.lastName.charAt(0) }}</span>
            </v-avatar>
            <h2 class="font-weight-regular">{{ `${thisProject.mentor?.title ?? ''} ${thisProject.mentor?.firstName}
                          ${thisProject.mentor?.lastName}` }}</h2>
            <h6 class="op-5 font-weight-regular text-subtitle-1">{{ thisProject.mentor?.tribeName ?? '' }}</h6>
            <v-card-item>
              <div v-if="thisProject.mentor?.phone && thisProject.mentor?.phone2" class="d-flex gap-3 mb-2 align-center">
                <PhoneCallIcon size="16" />
                <span class="text-body-1">{{ `${thisProject.mentor?.phone} | ${thisProject.mentor?.phone2}` }}</span>
              </div>
              <div v-else-if="thisProject.mentor?.phone" class="d-flex gap-3 mb-2 align-center">
                <PhoneCallIcon size="16" />
                <span class="text-body-1">{{ thisProject.mentor?.phone }}</span>
              </div>
              <div v-else-if="thisProject.mentor?.phone2" class="d-flex gap-3 mb-2 align-center">
                <PhoneCallIcon size="16" />
                <span class="text-body-1">{{ thisProject.mentor?.phone2 }}</span>
              </div>

              <div v-if="thisProject.mentor?.email" class="d-flex gap-3 mb-2 align-center">
                <MailIcon size="18" />
                <span class="text-body-1">{{ thisProject.mentor?.email }}</span>
              </div>
              <div v-if="thisProject.mentor?.location" class="d-flex gap-3 mb-2 align-center">
                <MapPinIcon size="16" />
                <span class="text-h6">{{ thisProject.mentor?.location }}</span>
              </div>
            </v-card-item>
          </div>
        </v-card-text>
      </v-card>
      <!-- Files -->
      <!-- <v-card elevation="1">
            <v-toolbar dense flat class="pt-5">
              <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">My Files</h3>
  
              <v-spacer></v-spacer>
  
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-list
                subheader
                two-line
              >
                <v-subheader inset>Folders</v-subheader>
  
                <v-list-item
                  v-for="folder in folders"
                  :key="folder.title"
                >
                  <v-list-item-avatar>
                    <v-icon
                      class="grey lighten-1"
                      dark
                    >
                      mdi-folder
                    </v-icon>
                  </v-list-item-avatar>
  
                  <v-list-item-content>
                    <v-list-item-title v-text="folder.title"></v-list-item-title>
  
                    <v-list-item-subtitle v-text="folder.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>
  
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
  
                <v-divider inset></v-divider>
  
                <v-subheader inset>Files</v-subheader>
  
                <v-list-item
                  v-for="file in files"
                  :key="file.title"
                >
                  <v-list-item-avatar>
                    <v-icon
                      :class="file.color"
                      dark
                      v-text="file.icon"
                    ></v-icon>
                  </v-list-item-avatar>
  
                  <v-list-item-content>
                    <v-list-item-title v-text="file.title"></v-list-item-title>
  
                    <v-list-item-subtitle v-text="file.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>
  
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card> -->
    </v-col>

    <!-- RIGHT SIDE -->
    <v-col cols="12" lg="8">

      <v-card class="mb-7" elevation="1">
        <v-card-text class="pa-5">
          <div class="d-flex justify-space-between">
            <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Files</h3>
            <v-btn v-if="isAdmin" variant="flat" color="primary">
              Upload File
              <v-dialog v-model="addUploadDialog" activator="parent" width="auto" min-width="400">
                <v-card class="pa-4">
                  <v-card-title>Upload File</v-card-title>
                  <v-card-text class="mb-5 text-center">
                    <FormUploadFile :projectId="thisProject.id" @close="closeUpload" @upload="reloadProject" />
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-btn>
          </div>
        </v-card-text>

        <v-list lines="two">
          <v-list-item v-for="file in thisProject.file" :key="file.id" :title="file.name"
            :subtitle="new Date(file.updatedAt).toDateString()">
            <template v-slot:prepend>
              <v-btn variant="text" icon @click="file.mime.includes('image') || file.mime.includes('video') || file.mime.includes('audio') ? assignFile(file) : openFile(file.url)" class="mr-1">
                <v-avatar color="#476573">
                  <v-icon v-if="file.mime.includes('image')" color="white">mdi-image-outline</v-icon>
                  <v-icon v-else-if="file.mime.includes('video') || file.mime.includes('audio')" color="white">mdi-play</v-icon>
                  <v-icon v-else color="white">mdi-text-box</v-icon>
                </v-avatar>

                <v-dialog v-model="imageDialog" width="auto" min-width="400">
                  <v-card class="pa-4">
                    <v-card-title>File: {{ viewFile.name }}</v-card-title>
                    
                    <v-card-text class="text-center">
                      <v-img v-if="viewFile.mime.includes('image')" :src="viewFile.url" width="100%"></v-img>
                      <video v-if="viewFile.mime.includes('video')" height="450" controls>
                        <source :src="viewFile.url" :type="viewFile.mime">
                        Your browser does not support the video element.
                      </video>
                      <audio v-if="viewFile.mime.includes('audio')" controls>
                        <source :src="viewFile.url" :type="viewFile.mime">
                        Your browser does not support the audio element.
                      </audio>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-btn>
            </template>

            <template v-slot:append>
              <v-btn @click="deleteFile(file.id)" color="red-lighten-1" icon="mdi-delete" variant="text" :loading="fileDeleteLoading"></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mb-7" elevation="1">
        <v-card-text class="pa-5">
          <div class="d-flex justify-space-between">
            <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Deliverable Tracking</h3>
            <v-btn v-if="isAdmin" variant="flat" color="primary">
              Add Set
              <v-dialog v-model="addSetDialog" activator="parent" width="auto" min-width="400">
                <v-card class="pa-4">
                  <v-card-title>Add a Set</v-card-title>
                  <v-card-text class="mb-5 text-center">
                    <FormAddSet :projectId="thisProject.id" @close="close" @newSet="reloadProject" />
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-btn>
          </div>
          <v-expansion-panels variant="accordion" class="mt-4">
            <v-expansion-panel v-for="(item, index) in thisProject.sets" :key="item.id"
              :bg-color="!item.active ? 'secondary' : ''">
              <v-expansion-panel-title class="d-flex flex-row align-center">
                <span class="font-weight-semibold mr-5 text-h6">{{ item.name }}</span>
                <span class="font-weight-normal" style="font-size: 1rem">{{ 'Due: ' + new
                  Date(item.due).toLocaleDateString() }}</span>

                <v-spacer></v-spacer>

                <v-btn v-if="isAdmin && setRemainingTasks(index) == 0 && setCompletedTasks(index) > 0 && item.active"
                  variant="flat" color="#476573" class="text-white">
                  Confirm
                  <v-dialog v-model="confirmSetDialog" activator="parent" width="auto" min-width="400">
                    <v-card class="pa-4">
                      <v-card-title>Confirm Completion of <span class="text-primary text-uppercase">{{ item.name
                      }}</span></v-card-title>
                      <v-card-text class="mb-5 text-center">
                        <FormConfirmSet :projectId="thisProject.id" :setId="item.id" :sets="thisProject.sets"
                          :fellow="thisProject.fellow?.id" :mentor="thisProject.mentor?.id" @close="close"
                          @confirm="reloadProject" />
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-btn>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-list elevation="0">
                  <v-list-item class="pa-0">
                    <v-list-item-content>
                      <v-card class="pa-0" elevation="0">
                        <v-card-text class="pa-0">
                          <v-row class="my-1" align="center">
                            <span class="mx-4 info--text text-body-1">Remaining: {{ setRemainingTasks(index) }}</span>

                            <v-divider vertical></v-divider>

                            <span class="mx-4 success--text text-body-1">Completed: {{ setCompletedTasks(index) }}</span>

                            <v-spacer></v-spacer>

                            <v-progress-circular :value="setProgress(index)" class="mr-2"></v-progress-circular>

                            <v-btn v-if="isAdmin && item.active" variant="flat" color="primary" class="mr-3">
                              Add Task
                              <v-dialog v-model="addSetItemDialog" activator="parent" width="auto" min-width="400">
                                <v-card class="pa-4">
                                  <v-card-title>Add Task To {{ item.name }}</v-card-title>
                                  <v-card-text class="mb-5 text-center">
                                    <FormAddSetItem :setId="item.id" @close="closeTask" @newTask="reloadProject" />
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </v-btn>
                          </v-row>

                          <v-divider class="mb-4"></v-divider>

                          <template v-for="(task, i) in item.items" :key="task.id">
                            <v-divider v-if="i !== 0"></v-divider>

                            <v-list-item
                              :disabled="!item.active ? true : isAdmin || task.assigned == 'both' || (task.assigned == 'fellow' && isFellow) || (task.assigned == 'mentor' && isMentor) ? false : true">
                              <v-row class="d-flex align-center">
                                <v-col cols="9">
                                  <v-list-item-action>
                                    <v-checkbox hide-details v-model="task.completed"
                                      :color="task.completed && 'grey' || 'primary'"
                                      @change="updateSetItem(index, i, task.id)">
                                      <template v-slot:label>
                                        <div :class="task.completed && 'grey--text' || 'blue-grey--text text--darken-2'"
                                          class="ml-4 text-wrap text-body-1">{{ task.name }}</div>
                                      </template>
                                    </v-checkbox>
                                  </v-list-item-action>
                                </v-col>
                                <v-col cols="2" class="text-right">
                                  <div class="text-overline font-weight-bold"
                                    :style="task.assigned == 'fellow' ? 'color: #71CED0' : 'color: #EF5E24'">{{
                                      task.assigned }}</div>
                                </v-col>
                                <!-- <v-spacer></v-spacer> -->
                                <v-col cols="1">
                                  <v-scroll-x-transition>
                                    <v-icon v-if="task.completed" color="success">mdi-check</v-icon>
                                  </v-scroll-x-transition>
                                </v-col>
                              </v-row>
                            </v-list-item>
                          </template>

                        </v-card-text>
                      </v-card>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>

            </v-expansion-panel>
          </v-expansion-panels>

        </v-card-text>
      </v-card>

      <!-- MONTHLY REPORT -->
      <v-card class="mb-7" elevation="1">
        <v-card-text class="pa-5">
          <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">Monthly Progress Report</h3>
          <v-textarea v-model="monthlyReport.text" label="What have you done this month?" filled auto-grow
            append-inner-icon="mdi-plus-circle" @keyup.enter="createReport" @click:append-inner="createReport"
            class="mt-4 iconBottomRight">
          </v-textarea>

          <v-divider class="mb-4"></v-divider>

          <v-card v-if="thisProject.monthly_progresses.length > 0" elevation="0" class="pa-0">
            <v-list>
              <v-slide-y-transition class="py-0" group>
                <template v-for="(report, i) in thisProject.monthly_progresses" :key="report.id">

                  <v-divider class="mb-4" v-if="i !== 0"></v-divider>

                  <v-list-item class="d-flex flex-column text-left align-start px-0 customAlignLeft">
                    <p class="mb-0" style="font-size: 1rem">{{ report.text }}</p>
                    <p class="mb-0 mt-2 text-caption text-secondary">{{ `${report.user.title ?? ''}
                                          ${report.user.firstName} ${report.user.lastName} - ` + new Date(report.date).toLocaleDateString() }}
                    </p>
                  </v-list-item>
                </template>
              </v-slide-y-transition>
            </v-list>
          </v-card>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.v-expansion-panel__shadow {
  box-shadow: 0px 0px 0px 0px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 0px 0px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}

.iconBottomRight {
  .v-field__append-inner {
    align-items: flex-end;
    padding-top: 0;
    padding-bottom: 10px;
  }
}

.customAlignLeft {
  .v-list-item__content {
    align-self: start;
  }
}
</style>