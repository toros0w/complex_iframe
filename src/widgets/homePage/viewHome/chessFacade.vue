<template>
<div class="facades-head" v-if="filters.view.value === 'facades'">
  <BurgerIcon class="burger-icon" />
  <Navigation />
  <span style="font-size: 32px;">Фасад объектов</span>
</div>
  <div class="chessFacade">
    <div class="facade-filters">
      <div class="filters-wrapper">
        <div class="filter-btn">
          <div class="filter-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6994 3.64868C10.124 3.64868 9.65771 4.11505 9.65771 4.69035C9.65771 5.26565 10.124 5.73201 10.6994 5.73201C11.2747 5.73201 11.741 5.26565 11.741 4.69035C11.741 4.11505 11.2747 3.64868 10.6994 3.64868ZM8.49398 4.06535C8.76603 3.10347 9.65038 2.39868 10.6994 2.39868C11.7484 2.39868 12.6327 3.10347 12.9048 4.06535H17.366C17.7112 4.06535 17.991 4.34517 17.991 4.69035C17.991 5.03552 17.7112 5.31535 17.366 5.31535H12.9048C12.6327 6.27722 11.7484 6.98201 10.6994 6.98201C9.65038 6.98201 8.76603 6.27722 8.49398 5.31535H4.03271C3.68754 5.31535 3.40771 5.03552 3.40771 4.69035C3.40771 4.34517 3.68754 4.06535 4.03271 4.06535H8.49398ZM15.6994 9.48201C15.124 9.48201 14.6577 9.94835 14.6577 10.5237C14.6577 11.099 15.124 11.5653 15.6994 11.5653C16.2747 11.5653 16.741 11.099 16.741 10.5237C16.741 9.94835 16.2747 9.48201 15.6994 9.48201ZM13.494 9.89868C13.766 8.93676 14.6504 8.23201 15.6994 8.23201C16.965 8.23201 17.991 9.25801 17.991 10.5237C17.991 11.7893 16.965 12.8153 15.6994 12.8153C14.6504 12.8153 13.766 12.1106 13.494 11.1487H4.03271C3.68754 11.1487 3.40771 10.8688 3.40771 10.5237C3.40771 10.1785 3.68754 9.89868 4.03271 9.89868H13.494ZM5.69938 15.3153C5.12408 15.3153 4.65771 15.7817 4.65771 16.357C4.65771 16.9323 5.12408 17.3987 5.69938 17.3987C6.27468 17.3987 6.74105 16.9323 6.74105 16.357C6.74105 15.7817 6.27468 15.3153 5.69938 15.3153ZM3.40771 16.357C3.40771 15.0913 4.43373 14.0653 5.69938 14.0653C6.74836 14.0653 7.63273 14.7701 7.90478 15.732H17.366C17.7112 15.732 17.991 16.0118 17.991 16.357C17.991 16.7022 17.7112 16.982 17.366 16.982H7.90478C7.63273 17.9439 6.74836 18.6487 5.69938 18.6487C4.43373 18.6487 3.40771 17.6227 3.40771 16.357Z" :fill="mainColor"/>
            </svg>
          </div>
          <span>Фильтры</span>
        </div>
        <div class="view-dropdown-wrapper">
          <span>Вид</span>
          <Dropdown placeholder="Select a City" />
        </div>
      </div>
    </div>

    <div class="canvas-prev"
      @click="changeFacade('prev')"
      v-if="facades.length > 1">
      <CanvasPrev />
    </div>
    <div class="map" id="map"></div>
    <div class="canvas-next"
      @click="changeFacade('next')"
      v-if="facades.length > 1">
      <CanvasNext />
    </div>
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
import Navigation from "@/components/Navigation.vue";
import CanvasPrev from "@/components/CanvasPrev.vue";
import CanvasNext from "@/components/CanvasNext.vue";
import Dropdown from "primevue/dropdown";
import BurgerIcon from "@/components/BurgerIcon.vue";

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

const colors = JSON.parse(localStorage.getItem("colors"));
const mainColor = colors.frame_color;

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
.facades-head {
  margin-left: 50px;
  margin-top: 50px;
  margin-bottom: 40px;
}
.chessFacade {
  position: relative;
  /* width: calc(100vw - 350px); */
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 50px;
  padding-right: 50px;
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
  .canvas-prev {
    position: absolute;
    top: 50%;
    left: 125px;
    z-index: 2;
    cursor: pointer;
  }
  .canvas-next {
    position: absolute;
    top: 50%;
    right: 125px;
    z-index: 2;
    cursor: pointer;
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

@media(min-width: 768px) {
  .chessFacade {
    max-width: calc(100vw - 350px);
  }  
}

.facade-filters {
  position: absolute;
  left: calc(10vw / 2 + 20px);
  top: 50px;
  z-index: 2;
  align-items: center;
}
.filter-btn {
    display: flex;
    color: #666666;
    background-color: #FFFFFF;
    border: 1px solid #DEDEDE;
    border-radius: 3px;
    user-select: none;
    cursor: pointer;
    padding: 9px 8px;
    gap: 8px;
    max-height: fit-content;
    height: 41px;
  }
  .filters-wrapper {
    display: flex;
    justify-content: space-between;
    width: calc(100vw - 600px);
  }
  .view-dropdown-wrapper {
    display: flex;
    flex-direction: column;
  }
  .view-dropdown-wrapper span{
    color: #ffffff;
  }
</style>
