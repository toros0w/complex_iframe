<template>
  <Teleport to="body">
    <Dialog v-model:visible="complexToArchive" modal header="Перенести Комплекс в архив?" :style="{ width: '25rem' }">
        <div class="flex justify-end gap-2">
            <Button type="button" label="Нет" severity="secondary" @click="complexToArchive = null"></Button>
            <Button type="button" label="Да" style="background-color: #4caf50; border: none;" @click="onComplexArchive"></Button>
        </div>
    </Dialog>
  </Teleport>
  <Teleport v-if="!route.meta.isViewPage" to="body">
    <FormAddComplex
      :isOpen="formEditComplexOpen"
      @closeModel="() => {
        formEditComplexOpen = !formEditComplexOpen
        complexToEdit.value = null
      }"
      :complex="complexToEdit"
      @update-complex="onComplexUpdate"
    />
  </Teleport>
  <div class="wrapper">
    <div :class="['listItems', `listItems--${activeType}`]">
      <div class="company-complexes">
        <div class="company-logo">
          <img :src="'https://dev.joywork.ru/photos/agency/' + agencyLogo" alt="" class="company-logo-img">
          <span class="company-name">{{ agencyName }}</span>

        </div>

          <div class="show-map-btn" @click="toggleMap">
            <MapIcon :mainColor="mainColor" :height="'24px'" :width="'24px'" />
            <span v-if="!mapIsOpen">Посмотреть объекты на карте</span>
            <span v-else>Скрыть карту</span>
          </div>
          <div class="complex-wrapper" v-if="!mapIsOpen">
          <complexItemIframe  :complex="complex"
            v-for="(complex) in filteredComplexesArray"
            :onComplexEdit="() => {
              complexToEdit = complex
              formEditComplexOpen = true
            }"
            :onComplexArchive="() => complexToArchive = complex"
            :key="complex.id" />
            <template v-if="!loaders.list && !totalRecords">
              <NoResultsForDeveloper v-if="hasDeveloper && route.meta.isViewPage" />
              <NoResults v-else />
            </template>
        </div>
      </div>
        <div class="yandex-map-wrapper" v-if="isLargeScreen || mapIsOpen" >
          <YandexMap
            v-model="map"
            :settings="{
              location: {
                center: center,
                zoom:3,
              },
            }"
            
            class="grayscale-map"
        >
          <YandexMapDefaultSchemeLayer :customization = "mapCustomization"/>
          <YandexMapDefaultFeaturesLayer />
          <YandexMapControls :settings="{ position: 'left' }">
            <YandexMapZoomControl />
          </YandexMapControls>
          <YandexMapMarker
            v-for="complex in complexes"
            :key="complex.id"
            :settings="{coordinates: [complex.address.longitude, complex.address.latitude]}"
            :icon="require('@/shared/assets/images/ymarker.svg')"
          >
            <div class="marker" :complex-id="complex.id" @click="selectComplex(complex.id)">
              <MapIcon :mainColor="mainColor" />
            </div>
          </YandexMapMarker>
        </YandexMap>
        </div>
    </div>
      <Paginator 
        v-if="allPages>1" 
        v-model:first="first" 
        @update:first="clickPaginator"
        :template="{
            '640px': 'PageLinks'  ,
            '960px': 'PageLinks',
            '1300px': 'PageLinks',
            default: 'PageLinks'
        }"
        :rows="rowsComplex"
        :totalRecords="totalRecords-1"
      >
      </Paginator>

    

  </div>
</template>

<script setup>
import { useComplexStore } from "@/app/store/complex";
import SearchForm from "@/components/SearchForm.vue"
import ComplexItem from "@/entities/complexItem.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, watch, nextTick, shallowRef, onBeforeUnmount, computed } from "vue";
import SearchArrow from "@/shared/assets/icons/search-arrow.vue"
import { useRoute, useRouter } from "vue-router";
import Panel from "primevue/panel";
import NoResults from "@/components/NoResults.vue"
import FormAddComplex from "./forms/formAddComplex.vue";
import api from "@/shared/api";
import { useFieldsStore } from "@/app/store/fields";
import NoResultsForDeveloper from "@/components/NoResultsForDeveloper.vue";
import complexItemIframe from "@/entities/complexItemIframe.vue";
import MapIcon from "@/components/MapIcon.vue";
// import { YMap } from '@yandex/ymaps3-types';
import yMarker from '@/shared/assets/images/ymarker.svg';
import {
  useYandexMap,
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapControls,
  // YandexMapPlacemark,
  YandexMapMarker,
  YandexMapZoomControl,
  initYmaps,
  getBoundsFromCoords,
  getCenterFromCoords,
  getLocationFromBounds,
} from 'vue-yandex-maps';

  const map = ref(null);
  const zoom = ref(9);
  const selectComplex = (id) => {
    selectedComplexId.value = id;
  };
  

const mapCustomization = [
        {
          tags: 'country',
          elements: 'geometry.fill',
          stylers: [
            { color: '#8c8c8c' }
          ]
        },
        {
          tags: 'country',
          elements: 'geometry.outline',
          stylers: [
            { color: '#dedede' }
          ]
        },
        {
          tags: 'region',
          elements: 'geometry.fill',
          stylers: [
            { color: '#a6a6a6', opacity: 0.5 }
          ]
        },
        {
          tags: { any: 'landcover', none: 'vegetation' },
          stylers: { visibility: 'off' }
        }
      ]


const mapIsOpen = ref(false);
const isLargeScreen = ref(true);
const windowWidth = ref(window.innerWidth);

const filteredId = ref(null);
const selectedComplexId = ref(null);


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

// const selectComplex = (id) => {
//   console.log('test');
  
//   filteredComplex(id);
// };

const toggleMap = () => {
  mapIsOpen.value = !mapIsOpen.value
}
const updateMapBounds = () => {
  if (!map.value || complexes.value.length === 0) return;

  const mapInstance = map.value.getMap();
  const bounds = complexes.value.map(complex => [
    complex.address.longitude,
    complex.address.latitude
  ]);

  if (bounds.length) {
    mapInstance.setBounds(bounds, {
      checkZoomRange: true,
      zoomMargin: 20
    });
  }
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
  
  if (windowWidth.value < 1200) {
    isLargeScreen.value = false;
  }
  
});



const route = useRoute()
const router = useRouter()

console.log(route.params.token, 'route.params.token');


const hasDeveloper = ref(!!Number(document.getElementById('has_developer')?.value))
const collapsed = ref(false)
const agencyName = ref(null);
const agencyLogo = ref(null);
const complexToArchive = ref(null)

let settings = {}

const mainColor = ref(null)


const complexHook = useComplexStore();
const complexesArray = computed(() => {
  const data = complexHook.complexes || {};
  return Object.values(data);
});

const colors = localStorage.getItem("colors")
console.log(colors);

mainColor.value = JSON.parse(colors).frame_color

console.log(complexesArray.value.map(c => c.id), 'just log');  



const filteredComplexesArray = computed(() => {
  
  const selectedId = selectedComplexId.value?.id; // Если selectedComplexId - объект с полем id
  console.log("selectedId:", selectedId);
  console.log(selectedComplexId, 'selectedComplexId');
  
  const result = selectedComplexId.value
    ? complexesArray.value.filter(c => c.id === selectedComplexId.value)
    : complexesArray.value;

  console.log("Filtered complexes:", result);  // Логируем результат фильтрации
  return result;
});

const coordinates = computed(() => {
  if (!complexesArray.value || complexesArray.value.length < 2) {
    return null;
  }

  const latitudes = complexesArray.value
    .map((c) => c.address?.latitude)
    .filter((lat) => lat !== undefined && lat !== null);

  const longitudes = complexesArray.value
    .map((c) => c.address?.longitude)
    .filter((lng) => lng !== undefined && lng !== null);

  if (latitudes.length < 2 || longitudes.length < 2) {
    return null;
  }

  return [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)],
  ];
});
const bounds = computed(() => {
  if (!coordinates.value) return null;
  return getBoundsFromCoords(coordinates.value);
});

const center = computed(() => {
  if (!bounds.value) return [37.618423, 55.751244]; // fallback center
  const rawCenter = getCenterFromCoords(bounds.value);
  return [rawCenter[1], rawCenter[0]]; // convert from [lat, lon] to [lon, lat]
});
onMounted(() => {

});



agencyName.value = complexHook.agencyName;
agencyLogo.value = complexHook.agencyLogo;

const {
  rowsComplex,
  totalRecords,
  allPages,
  activeType,
  complexes,
  activePage,
  complex_filter,
  archivedTotalRecords,
  loaders,
  archiveLoad,
} = storeToRefs(complexHook);
const formEditComplexOpen = ref(false)
const complexToEdit = ref(null)
const first = ref(0);
const fieldsStore = useFieldsStore()

function clickPaginator(){
  var pageNew = parseInt((first.value/rowsComplex.value) + 1);
  // emits('onPage', pageNew)
  activePage.value = pageNew;
  router.replace({ query: { ...route.query, page: activePage.value }})
}

const onComplexUpdate = (updatedComplex) => {
  Object.keys(complexes.value).forEach((complexKey) => {
    if (complexes.value[complexKey].id == updatedComplex.id) {
      complexes.value[complexKey] = updatedComplex
    }
  })
  complexToEdit.value = null
}

const onComplexArchive = () => {
  api.archiveComplex({ complex_id: complexToArchive.value.id, archive: true })
    .then((response) => {
      var res = response.data;
      if(res.result=='done'){
        complexHook.getListComplex()
        archivedTotalRecords.value = archivedTotalRecords.value + 1
        complexToArchive.value = null
      }
    })
}


const getCoordinates = (complex) => {
  if (!complex || !complex.address) return null;
  const lat = parseFloat(complex.address.latitude);
  const lon = parseFloat(complex.address.longitude);
  return [lat, lon];
};


watch(
  complex_filter,
  (newV) => {
    if (newV) {
      const queryParams = {
        selectedMetros: newV.selectedMetros,
        selectedRayons: newV.selectedRayons,
        selectedTypes: newV.selectedTypes,
        complexes: newV.complexes,
        rooms: newV.rooms,
        useSquarePrice: newV.useSquarePrice,
        rayons: newV.rayons,
        squareKitchen_min: newV.squareKitchen_min,
        squareKitchen_max: newV.squareKitchen_max,
        selectedComplexes: newV.selectedComplexes,
        selectedDecorations: newV.selectedDecorations,
        selectedComplexTypes: newV.selectedComplexTypes,
        address: newV.address,
        period: newV.period,
        area_from: newV.area_from,
        area_to: newV.area_to,
        floor_from: newV.floor_from,
        floor_to: newV.floor_to,
        price_from: newV.price_from,
        price_to: newV.price_to,
      }
  
      nextTick(() => {
        router.replace({ query: queryParams })
      })
    }
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    updateMapBounds();
  });

  first.value = (activePage.value - 1) * rowsComplex.value

  fieldsStore.refetchDecorationsList()
})


</script>

<style scoped lang="scss">

.listItems {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: space-between;
  // grid-template-columns: repeat(1, 1fr);
  @apply bg-grey-200;
  // overflow-y: none;
  // overflow-x: hidden;
  position: relative;
  background-color: #fff;

  &.listItems--tile {
    display: flex;
    position: relative;
    // grid-template-columns: repeat(4, 1fr);
    // grid-gap: 28px;
    & .company-complexes {
      margin-bottom: 40px;
      // display: flex;
      padding: 50px 50px 0 50px;
      width: 50%;
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

      & .complex-wrapper {
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        gap: 46px;
  
  
      }
    }
  }

  
  .p-paginator-bottom {
    border: none !important;
  }

  .p-paginator {
    display: flex;
    /*justify-content: flex-end;*/
    align-items: center;
    column-gap: 10px;
    padding: 0;
    padding-top: 10px;
    padding-bottom: 10px;

    .p-dropdown {
      height: 37px;
    }
    .p-paginator-page-input { 
      .p-inputtext {
        max-width: 4rem;
      }
    }
  }
  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last {
    width: 37px !important;
    height: 37px !important;
    padding: 10px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    border-radius: 3px !important;
    border: 1px solid #dedede !important;
    margin: 0 !important;
    min-width: 0 !important;

    svg {
      width: 16px;
      height: 16px;
    }
  }
  .p-paginator-prev {
    margin-right: 10px;
  }
  .p-paginator-next {
    margin-left: 10px;
  }
  .p-paginator-pages {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .p-paginator-page {
      height: auto !important;
      min-height: 37px !important;
      min-width: 37px !important;
      padding: 10px !important;
      border-radius: 3px !important;
      border: 1px solid #dedede !important;
      box-shadow: none !important;
      &.p-highlight {
        background: var(--main-color) !important;
        color: #ffffff !important;
      }
    }
  }

  @media screen and (max-width: 1600px) {
    &.listItems--tile {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>

<style>
.wrapper {
  width: 100%;
  max-width: 1920px!important;
}

.wrapper .p-panel.p-panel-toggleable .p-panel-header {
  justify-content: center;
  border-radius: unset;
  padding: 12px 35px 15px;
  margin: 0;
  text-align: center;
  font-size: 15px;
  color: #757575;
  background: -webkit-linear-gradient(top, #f8f8f8, #fff);
  border-bottom: 1px solid #dedede;
}

.wrapper .p-panel.p-panel-toggleable .p-panel-header button {
  cursor: pointer;
  font-size: 15px;
  display: flex;
  gap: 5px;
}

.wrapper .p-panel.p-component.p-panel-toggleable {
  margin-bottom: 15px;
}

.wrapper .p-panel .p-panel-header .p-panel-header-icon {
  width: unset;
  height: unset;
  border-radius: unset;
}

.wrapper .p-panel-header-icon > svg {
  transition: 0.2s ease-in-out;
}

.wrapper .p-panel-header-icon[aria-expanded="true"] > svg {
  rotate: 180deg;
}

.defaultLayout main, .viewLayout main {
  padding-top: 0;
}  

.wrapper .p-panel.p-panel-toggleable .p-panel-header button:hover {
  color: #6c757d;
  border: 0 none;
  background: transparent;
}

.p-panel .p-panel-header .p-panel-header-icon:focus {
  box-shadow: unset !important;
}

.p-submenu-header {
  display: none !important;
}

.p-dialog-header-icons button{
  box-shadow: unset !important;
}

.yandex-map-wrapper {
    position: sticky;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    max-height: 100vh;
    background-size: cover;
    background-position: center;
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


@media (max-width: 1200px) {
  .show-map-btn {
    display: flex;
  }
  .listItems--tile {
    flex-direction: column;
    gap: 20px;
  }
  .yandex-map-wrapper {
    width: 100%!important;
    height: 90vh;
  }
  .company-complexes{
    padding: 0;
    width: 100% !important;
  }
}

@media (max-width: 1680px) {
  .yandex-map-wrapper {
    width: 50%;
  }
}
.ymaps3x0--main-engine-container {
  filter: grayscale(100%) brightness(90%)!important;
}

</style>
