<template>
  <div class="chessFacade">
    <button
      class="prev"
      @click="changeFacade('prev')"
      v-if="facades.length > 1"
    >
    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none">
      <g clip-path="url(#clip0_429_11254)">
      <path d="M10 17L15 12" stroke="#515969" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 12L10 7" stroke="#515969" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_429_11254">
      <rect width="24" height="24" fill="white"/>
      </clipPath>
      </defs>
      </svg>
    </button>
    <div class="map" id="map"></div>
    <button
      class="next"
      @click="changeFacade('next')"
      v-if="facades.length > 1"
    >
    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none">
      <g clip-path="url(#clip0_429_11254)">
      <path d="M10 17L15 12" stroke="#515969" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 12L10 7" stroke="#515969" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_429_11254">
      <rect width="24" height="24" fill="white"/>
      </clipPath>
      </defs>
      </svg>
    </button>
    <PopupWindowViewFacade
      :floor-data="[]"
      :number-floor="Number(optionsFloor.floor?.position)"
      :number-entrance="Number(optionsFloor.entrance?.position)"
      :rooms="filteredOptionsFloorRooms"
      @open-details="openModal = true; closeOverlay()"
    />
    <teleport to="body">
      <WindowInfoForListAppartments 
        :isOpen="openModal"
        :figure="{...openedFigure, house_name: props.house_name, complex_name: props.complex_name, rooms: filteredRooms}"
        @update:is-open="closeFigure"
        :availableFloors="openFigureAvailableFloors"
        @floor:changed="changeFigure"
        :decorations="decorations"
        :windowsPlacements="windowsPlacements"
        @rooms:status:changed="handelRoomsStatusChanged"
        :house_name="house_name"
        :complex_name="complex_name"
        :filters="filters"
        />
    </teleport>
    
  </div>
</template>

<script setup>
import useViewFacades, { Facade } from "@/features/useViewFacades";
import { computed, onMounted, ref, watch } from "vue";
import PopupWindowViewFacade from "./popupWindowViewFacade.vue";
import { useRoute } from "vue-router";
import WindowInfoForListAppartments from "./windowInfoForListAppartments.vue";
import api from "@/shared/api";
import { fixRoomVisible } from "@/shared/utils/util";

const props = defineProps({
  viewType: String,
  house_name: String,
  complex_name: String,
  filters: Object,
  decorations: Array,
  windowsPlacements: Array
});
const wrapper = ref();
const route = useRoute();
const facades = ref([]);
const { start, optionsFloor, changeFacade, openModal, openedFigure, currentFacade, closeOverlay, changeFeatureRooms } = useViewFacades();
const openFigureAvailableFloors = computed(() => {
  if (!openedFigure.value.entrance) {
    return []
  }
  return uniqueArrayOfObject(
    currentFacade.value?.figures
      .filter((figure) => figure.entrance && figure.entrance.id == openedFigure.value.entrance.id)
      .map((figure) => figure.floor)
      || [],
    'id')
})

function uniqueArrayOfObject(array, keyToBeUnique) {
  let arrToReturn = [...array]
  // Filter by looking at the next objects if the key is present a second time
  return arrToReturn.filter((x, xi) => !arrToReturn.slice(xi + 1)
    .some(y => y[keyToBeUnique] === x[keyToBeUnique]));
}

const changeFigure = (floorPosition) => {
  const figure = currentFacade.value.figures.find((figure) => figure.floor.position == floorPosition)
  
  openFigure(figure)
}

const openFigure = (figure) => {
  openedFigure.value = figure
  openModal.value = true
}
const closeFigure = () => {
  openModal.value = false
  setTimeout(() => {
    openedFigure.value = {
      floor: null,
      entrance: null,
      rooms: [],
      id: null,
    }
  }, 350)
}

const filteredRooms = computed(() => {
  return openedFigure.value?.rooms.filter(room => room.visible) || []
})

const filteredOptionsFloorRooms = computed(() => {
  return  optionsFloor.value?.rooms.filter(room => room.visible) || []
})

watch(props.filters, () => {
  facades.value?.forEach(facade => {
    facade.figures.forEach(figure => {
      figure.rooms?.forEach((room) => {
        return fixRoomVisible(room, props.filters)
      })
    })
  })
})


const handelRoomsStatusChanged = (apartamentId) => {
  openedFigure.value.rooms = openedFigure.value.rooms.filter(room => room.id != apartamentId)
  changeFeatureRooms(openedFigure.value.id, openedFigure.value.rooms)
}

onMounted(() => {
  api.getFacades(route.params.house_id, ['rooms', 'floor', 'entrance'])
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        const facadesData = response.data
        facadesData.forEach(facade => {
          facade.figures.forEach(figure => {
            figure.rooms.forEach(room => {
              room.visible = true
              fixRoomVisible(room, props.filters)
            })
          })
        })

        facades.value = response.data;
        start(facades.value);
      }
    })
});

</script>


<style scoped lang="scss">
.chessFacade {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .prev,
  .next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 40px;
    height: 40px;
    background: #f5d5d5;
    border-radius: 50%;
    padding: 10px;

    svg {
      width: 100%;
      height: 100%;
    }
  }
  .prev {
    left: 200px;
  }
  .next {
    right: 200px;
  }

  .prev svg {
    transform: rotate(180deg);
  }
  .map {
    width: 100%;
    height: 100%;
    overflow-x: auto;
  }
  #background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(5px); /* Размытие изображения */
    pointer-events: none; /* Чтобы изображение не перекрывало интерактивные элементы карты */
  }

  @media screen and (max-width: 1600px) {
    .prev {
      left: 100px;
    }
    .next {
      right: 100px;
    }
  }
}
</style>
