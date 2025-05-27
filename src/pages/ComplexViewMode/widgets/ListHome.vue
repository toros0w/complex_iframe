<template>

  <div v-show="loadHome" class="loader-div ListHomeLoader">
    <RocketSpinner/>
  </div>
  <div v-if="!loadHome" class="listHome">
      <!-- <div class="listHome__title">Список домов</div> -->
      <div class="list-wrapper">
        <div class="listHome__list">
          <div class="company-logo">
            <!-- remove dev for prod or local -->
            <img :src="'https://dev.joywork.ru/photos/agency/' + data.agencyLogo"   alt="" class="company-logo-img">
            <span class="company-name">{{ data.agencyName }}</span>
            
          </div>
          <Navigation />
          <div class="show-map-btn" @click="toggleMap">
            <MapIcon :mainColor="mainColor" :height="'24px'" :width="'24px'" />
            <span v-if="!mapIsOpen">Посмотреть объекты на карте</span>
            <span v-else>Скрыть карту</span>
          </div>
          <template v-if="activeListItem === 'activeHome' && !mapIsOpen">
             <homeItemIframe v-for="house in houses" :metros="metros" :key="house?.id" :home="house" :minPrice="minPrice" :complexId="complexId"/>
          </template>
          <template v-else></template>
        </div>
        <div class="yandex-map-wrapper" v-if="isLargeScreen && !mapIsOpen || mapIsOpen" >
          <YandexMap
          v-show="!loadHome"
          ref="map"
            v-model="map"
            :settings="mapSettings"
            :mapsRenderWaitDuration="1000"
            
            class="grayscale-map"
        >
          <YandexMapDefaultSchemeLayer :customization = "mapCustomization"/>
          <YandexMapDefaultFeaturesLayer />
          <YandexMapControls :settings="{ position: 'left' }">
            <YandexMapZoomControl />
          </YandexMapControls>
          <YandexMapMarker
            v-for="marker in formattedCoords.filter((el)=>el!==null)"
            :key="marker.id"
            :settings="{coordinates: marker}"
            :icon="require('@/shared/assets/images/ymarker.svg')"
          >
            <div class="marker" :complex-id="complex.id" @click="selectComplex(complex.id)">
              <MapIcon :mainColor="mainColor"  />
            </div>
          </YandexMapMarker>
          </YandexMap>
        </div>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch, computed, nextTick, watchEffect, onBeforeMount } from "vue";
  // import homeItem from "./HomeItem.vue";
  import homeItemIframe from "@/entities/homeItemIframe.vue";
  import MapIcon from "@/components/MapIcon.vue";
  // import { YMap } from '@yandex/ymaps3-types';
  import yMarker from '@/shared/assets/images/ymarker.svg';
  import RocketSpinner from "@/components/RocketSpinner.vue";

  import {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
    YandexMapControls,
    // YandexMapPlacemark,
    YandexMapMarker,
    YandexMapZoomControl,
    getBoundsFromCoords,
    getCenterFromCoords,
    ymaps
  } from 'vue-yandex-maps';
  import Navigation from "@/components/Navigation.vue";
import { useComplexStore } from "@/app/store/complex";
import { useRoute } from "vue-router";
import { onUnmounted } from "vue";
      
  const props = defineProps({
    complex: null,
    houses: [],
    loadHome: true
  });
  
  
  const data = useComplexStore();
  const complexId = useRoute().params.id;
  const minPrice = ref(null)
  const markerCoords = ref([]);
  const formattedCoords = ref([]);
  const metros = ref([]);
  const center = ref([25.7558, 12.6173]); 
  const mapCenter = [];
  const mainColor = ref(null)
  const mapIsOpen = ref(false);
  const isLargeScreen = computed(() => windowWidth.value >= 1200);
  const windowWidth = ref(window.innerWidth);
  const map = ref(null)

  const complexesArray = ref([]);
  const complex = ref(null);

  const selectedComplexId = ref(null);


  const mapSettings = computed(() => ({
    location: {
      center: center.value,
      zoom: 14,
    },
  }));
  // console.log(mapSettings, 'settings');
  const colors = localStorage.getItem("colors")
  mainColor.value = JSON.parse(colors).frame_color

  // console.log(mainColor.value, 'testlog');
  

  watch(
    () => data.complexes, // Следим за data.complexes
    (newComplexes) => {
      if (!newComplexes) return; // Если данных нет, выходим


      complexesArray.value = Object.values(newComplexes);
      if (complexId) {
        complex.value = complexesArray.value.find((c) => c.id == complexId);
        metros.value = complex.value?.metros
        minPrice.value = complex.value?.min_total_amount
      }
    },
    { immediate: true }
  );

  const selectComplex = (id) => {
    selectedComplexId.value = id;
  };
  
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  watch(windowWidth, (newVal) => {
    if (newVal < 1200) {
      isLargeScreen.value = false; 
    } else {
      isLargeScreen.value = true; 
    }
  });
  const toggleMap = () => {
  mapIsOpen.value = !mapIsOpen.value
}

  onMounted(() => {
    mapIsOpen.value = false
    window.addEventListener('resize', updateWindowWidth);
  if (typeof window.ymaps === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=692f0a05-cb88-4158-88b9-06bc0dc93004&lang=ru_RU';
    document.head.appendChild(script);

    script.onload = () => {
      initGeocode();
    };
  } else {
    initGeocode();
  }
});
function initGeocode() {
  console.log('func called');
  
  window.ymaps.ready().then(() => {
    const geocodePromises = props.houses.map(complex => {
      return window.ymaps.geocode(complex.address)
        .then(res => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            return { id: complex.id, address: complex.address, coords };
          } else {
            return { id: complex.id, address: complex.address, coords: null };
          }
        })
        .catch(error => {
          console.log(`Ошибка при геокодировании ${complex.address}:`, error);
          return { id: complex.id, address: complex.address, coords: null };
        });
    });

    Promise.all(geocodePromises).then(results => {
      console.log(geocodePromises, 'geocodePromises');
      markerCoords.value = results
      .filter(item => item.coords !== null)
      .map(item => item.coords);
      formattedCoords.value = markerCoords.value.map(coords => [coords[1], coords[0]]);
      
      if (formattedCoords?.value.length > 1) {
        const bounds = ref(getBoundsFromCoords(formattedCoords.value)); 
        const rawCenter = getCenterFromCoords(bounds.value);
        center.value = [rawCenter[0], rawCenter[1]];
        console.log(center.value, 'center.value');
      } else if(formattedCoords?.value.length === 1){
        center.value = formattedCoords.value[0];
      }else{
        console.log("   ");
      }
      
    });
  }).catch(error => {
    console.error('Ошибка загрузки Yandex Maps:', error);
  });
  
}

watch(
  () => props.houses,
  (newHouses) => {
    if (newHouses?.length > 0) {
      initGeocode();
    }
  },
  { deep: true, immediate: true }
);

watch(center, (newCenter) => {
  console.log('Обновился центр карты:', newCenter);
});
onMounted(async () => {
  // await initGeocode();

  await nextTick();

  setTimeout(() => {
    if (map.value) {
      const ymaps = map.value.ymaps;
      const ymapInstance = map.value.map;

      if (ymaps && ymapInstance) {
        const bounds = ymaps.geoQuery(markers.value).getBounds();
        if (bounds) {
          ymapInstance.setBounds(bounds, { checkZoomRange: true });
        }
      }
    }
  }, 500);
});
  
  
  const emits = defineEmits(
    ["openAddHome"]
  );
  
  const activeListItem = ref("activeHome");
  
  
  const toggleHome = (tab) => {
    activeListItem.value = tab;
  }
  onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});
  
  </script>
  <style lang="scss">
  .listHome {
    position: relative;
  }

  .show-map-btn {
  cursor: pointer;
  display: none;
  width: 100%;
  border: 1px solid var(--main-color);
  border-radius: 6px;
  padding: 8px 0;
  margin-top: 28px;
  gap: 12px;
  justify-content: center;
  color: var(--main-color);
  align-items: center;
  user-select: none;
}

 .listHome .yandex-map-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    max-height: 100vh;
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

  .loader {
    /* position: absolute; */
    /* top: 500px; */
    /* left: auto; */
    width: 110px;
    max-width: none;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    height: 1000px;
    img {
      /* width: 110px;
      max-width: none; */
    }
  }
  
  .list-wrapper {
    display: flex;
    width: 100vw;
    & .listHome__list {
      width: 50%;
      padding:50px;
      height:auto;
      display: flex;
      flex-direction: column;
      justify-content: start;
      position: relative;
      background-color: #fff;
      margin-bottom: 10px;
      & .company-logo {
        display: flex;
        align-items: center;
        font-size: 40px;
        font-weight: bold;
        gap: 20px;
        & .company-logo-img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }
      }
    }
  }
  .listHome {
    width: 100%;
    /* height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start; */
  
    &__title {
      width: 100%;
      font-size: 32px;
      padding: 20px;
      border-bottom: 1px solid;
      @apply border-grey-400;
    }
    &__list {
      position: relative;
      width: 100%;
      // left: -30px;
      // width: calc(100% + 60px);
      height: auto;
      display: grid;
      /* grid-template-columns: repeat(4, 1fr);
      grid-gap: 30px; */
      gap: 40px;
      @apply bg-grey-200;
      padding: 30px 0;
    }
  
    @media screen and (max-width: 1440px) {
      &__list {
        // grid-template-columns: repeat(3, 1fr);
      }
    }

    @media screen and (max-width: 1200px) {
      .show-map-btn {
        display: flex;
  }
  .listHome__list{
    width: 100%;
  }

  .listHome .yandex-map-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    max-height: 100vh;
    background-size: cover;
    background-position: center;
    overflow: hidden;
}



    }

    @media screen and (max-width: 800px) {
      &__list {
        // grid-template-columns: repeat(1, 1fr);
      }
    }
  }
   .listHome .yandex-map-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    max-height: 100vh;
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

.marker {
  width: 30px;
  height: 70px;
  cursor: pointer;
  left: -24px;
  top: -51px;
  max-width: unset;
  position: absolute;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.marker:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 10px color-mix(in srgb, var(--main-color) 50%, white 50%));

}

/* Стили для кнопок зума */
.ymaps3x0--zoom-control_vertical {
  display: flex!important;
  gap: 10px!important;
}
.ymaps3x0--control__background {
  background: unset!important;
  box-shadow: unset!important;
}

.ymaps3x0--control-button {
  border-radius: 50%!important;

  padding: 5px!important;
  box-shadow: 0 2px 6px 0 #0003;

}
.ymaps3x0--main-engine-container {
  filter: grayscale(100%) brightness(90%)!important;
}

@media screen and (max-width: 1200px) {
    .listHome .yandex-map-wrapper {
        position: absolute;
        top: 430px;
        right: 0px;
        left: 0px;
        margin: auto;
        width: 95vw;
        height: 57vh;
        max-height: 100vh;
        background-size: cover;
        background-position: center;
        overflow: hidden;
        margin-bottom: 100px;
    }
}
  </style>
  