<script setup lang="ts">
import { ref } from 'vue';

const { find } = <any>useStrapi();
const selected = ref();
const userLocations = ref();
const markers = ref([
]);

const selectedMarker = ref({
        url: "/images/logos/vmm_favicon.png",
        scaledSize: { width: 50, height: 50 },
      })
const center = ref({
  lat: 40.6561518,
  lng: -74.00443369999999
});

const selectMarker = (role) => {
  switch (role) {
    case 'Fellow':
      return {
        url: "/images/markers/marker_purple.png",
        scaledSize: { width: 50, height: 50 },
      }
      break;
    case 'Mentor':
      return {
        url: "/images/markers/marker_yellow.png",
        scaledSize: { width: 50, height: 50 },
      }
      break;
      default:
      return {
        url: "/images/markers/marker_blue.png",
        scaledSize: { width: 50, height: 50 },
      }
      break;
  }
}
onMounted(async () => {
  const userData = await find('users', { populate: '*', fields: ['id', 'location', 'coords', 'firstName', 'lastName', 'phone', 'phone2', 'tribeName'] });
  // console.log('USER:', userData);
  userLocations.value = userData;
  userData.map(async (user: any, i: any) => {
    // console.log('Index: ', i);
    let data = {
      position: {
        lat: user.coords.lat,
        lng: user.coords.lng,
      },
      icon: selectMarker(user.role.name)
    }
    markers.value.push(data);
    // console.log('Recorded: ', markers.value);
  });
});
const legend = [
  {
    name: 'Staff',
    url: '/images/markers/marker_blue.png'
  },
  {
    name: 'Fellow',
    url: '/images/markers/marker_purple.png'
  },
  {
    name: 'Mentor',
    url: '/images/markers/marker_yellow.png'
  }
]
const cardSelect = (coords: any, index: any) => {
  center.value = coords;
  selected.value = index;
}
</script>

<template>
  <v-row class="mt-4">
    <v-col cols="12">
      <GMapMap :center="center" :zoom="10" map-type-id="terrain" style="height: 40rem">
        <GMapCluster :zoomOnClick="true">

          <GMapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true"
             :icon="selected === index ? selectedMarker : m.icon" @click="selected = index" />
        </GMapCluster>
      </GMapMap>
    </v-col>
    <v-list class="d-flex flex-column mx-4 pa-2" lines="one">
      <h5 class="text-overline text-center">Map Legend</h5>
      <div class="d-flex align-center justify-center">
      <v-list-item v-for="(n, index) in legend" :key="index" class="text-center">
        <p class="text-caption">{{ n.name }}</p>
        <v-img :src="n.url" width="50"></v-img>
      </v-list-item>
      </div>
    </v-list>
  </v-row>
  <v-row>
    <v-col cols="12" lg="4" v-for="(u, index) in userLocations" :key="index">
      <!-- Mentor card -->
      <v-card :class="{ 'highlight': index === selected }" @click="cardSelect(u.coords, index)" min-height="360" elevation="1">
        <v-card-text class="pa-5">
          <div>
            <h3 class="title blue-grey--text text--darken-2 font-weight-semibold text-h5">{{ u.role.name }}</h3>
          </div>
          <div class="text-center">
            <v-avatar size="100" color="primary" class="mb-2">
              <v-img v-if="u?.picture" :src="u?.picture?.url" height="100" :alt="u?.firstName"></v-img>
              <span v-else class="text-h1 text-white">{{ u?.firstName.charAt(0) +
                u?.lastName.charAt(0) }}</span>
            </v-avatar>
            <h2 class="font-weight-regular">{{ `${u?.title ?? ''} ${u?.firstName}
                          ${u?.lastName}` }}</h2>
            <h6 class="op-5 font-weight-regular text-subtitle-1">{{ u?.tribeName ?? '' }}</h6>
            <v-card-item>
              <div v-if="u?.phone && u?.phone2" class="d-flex gap-3 mb-2 align-start">
                <PhoneCallIcon size="18" />
                <span class="text-body-1">{{ `${u?.phone} | ${u?.phone2}` }}</span>
              </div>
              <div v-else-if="u?.phone" class="d-flex gap-3 mb-2 align-start">
                <PhoneCallIcon size="18" />
                <span class="text-body-1">{{ u?.phone }}</span>
              </div>
              <div v-else-if="u?.phone2" class="d-flex gap-3 mb-2 align-start">
                <PhoneCallIcon size="18" />
                <span class="text-body-1">{{ u?.phone2 }}</span>
              </div>

              <div v-if="u?.email" class="d-flex gap-3 mb-2 align-start">
                <MailIcon size="18" />
                <span class="text-body-1">{{ u?.email }}</span>
              </div>
              <div v-if="u?.location" class="d-flex gap-3 mb-2 align-start">
                <MapPinIcon size="20" />
                <span class="text-h6">{{ u?.location }}</span>
              </div>
            </v-card-item>
          </div>
        </v-card-text>

      </v-card>
    </v-col>
  </v-row>
</template>
<style>
.highlight {
  background-color: #466572;
  color: #fff;
}
.cluster img{
  width: 50px;
}
</style>