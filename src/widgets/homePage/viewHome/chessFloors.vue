<template>
  <Teleport to="body">
    <div @click.stop="emits('update:is-open-window', { ...hoveredFigure.room, complex_name, house_name, floor: activeFloor.position, entrance_name: selectedEntrance.name})" id="popup" class="popup" ref="popup">
      <template v-if="hoveredFigure">
        <div class="popup__countRoom" :style="{'background-color': hoveredFigure.room.complex_status_info.status_color}">{{hoveredFigure.room.layout_feature !== 'studio' ? hoveredFigure.room.rooms_count + ' к' : 'ст'}}</div>
        <div class="popup__number">№ {{hoveredFigure.room.number}}</div>
        <div class="popup__price">{{formatNumber(hoveredFigure.room.total_amount)}} руб.</div>
        <div class="popup__square">{{hoveredFigure.room.area}} м2 <span>- {{formatNumber(((hoveredFigure.room.total_amount || 0) / (hoveredFigure.room.area || 0)).toFixed(2))}} руб./м2</span></div>
      </template>
    </div>
  </Teleport>
  <div class="chessFloors relative" :class="{mobile: isMobile}">
    <div
      v-show="headIsShow"
      class="chessFloors__head col-span-2 flex flex-row max-[405px]:flex-col justify-start items-center sticky top-0 bg-white z-10"
    >
      <div v-if="activeFloor && listFloorIsShow" class="chessFloors__title text-2xl mr-12">План {{ activeFloor.position }} этажа</div>
      <Dropdown
        v-if="listFloorIsShow && !isMobile"
        v-model="selectedEntranceID"
        :options="entrances"
        option-label="name"
        option-value="id"
        class="mr-12"
        :class="{dropdown_mobile: isMobile}"
      ></Dropdown>
      <div
        v-if="cardinalDirectionsIsShow && !isMobile"
        class="w-full flex justify-center"
        style="align-items: center; flex-direction: column; gap: 10px; width: 120px; margin-top: 10px;"
      >
        <strong>Стороны света </strong>
        <img
          :style="`width: 80px; transform: rotate(${activeFloor?.plan.light_angle}deg);`"
          :src="require('@/shared/assets/images/said.png')"
          alt=""
        />
      </div>
      <!-- <MyButton
        :theme="'green'"
        class="chessFloors__btn"
        @click="
          emits('update:activeFloor', activeFloor), emits('update:viewGrid')
        "
        >Показать этаж на фасаде
      </MyButton> -->
      <div v-if="!isMobile" class="chessFloors__resize" ref="zoomSlider"></div>
    </div>
    <div
      v-if="selectedEntrance"
      v-show="listFloorIsShow"
      class="chessFloors__listFloor"
      :class="{mobile: isMobile}"
    >
      <div
        v-for="floor in selectedEntrance.floors"
        :key="floor.id"
        class="floor flex flex-row py-2.5 gap-2 text-grey-900 rounded-md w-max items-center floor_styles"
        :class="[
          activeFloor.id === floor.id
            ? 'main-bg text-white cursor-default'
            : 'cursor-pointer',
        ]"
        @click="activeFloor = floor"
      >
        <span v-if="!isMobile && !isTablet && activeFloor.id === floor.id" class="hidden md:inline">План </span>
        <span>{{ floor.position }}</span>
        <span v-if="!isMobile && activeFloor.id === floor.id">этажа</span>
      </div>
    </div>
    <div v-if="isMobile" class="chessFloors__resize" ref="zoomSlider"></div>

    <div
      class="chessFloors__mapFloor overflow-x-auto relative"
      ref="container"
    >
      <div class="map ol-map" :id="canvasId" ref="map"></div>
    </div>
  </div>
</template>


<script setup>
import { useFieldsStore } from "@/app/store/fields";
import eventBus from "@/eventBus";
import useViewFloors from "@/features/useViewFloors";
import useWindowSize from "@/features/useWindowSize";
import api from "@/shared/api";
import { fixRoomVisible, formatNumber } from "@/shared/utils/util";
import Dropdown from "primevue/dropdown";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const emits = defineEmits(
  ["update:activeFloor",
  "update:viewGrid",
  "update:is-open-window"]
);

const props = defineProps({
  house_name: String,
  complex_name: String,
  filters: Object,
  headIsShow: {
    type: Boolean,
    default: true
  },
  listFloorIsShow: {
    type: Boolean,
    default: true
  },
  cardinalDirectionsIsShow: {
    type: Boolean,
    default: true
  },
  customFigures: {
    type: Array,
    default: null
  },
  canvasId: {
    type: String,
    default: "map"
  }
})
const zoomSlider = ref(HTMLElement);
const container = ref(HTMLElement);
const map = ref(HTMLElement);
const popup = ref(HTMLElement);
const activeFloor = ref(null);
const entrances = ref([])
const selectedEntranceID = ref(null)
const selectedEntrance = ref(null)
const hoveredFigure = ref(null)
const useViewFloor = useViewFloors();
const fieldsStore = useFieldsStore()
const { isMobile, isTablet} = useWindowSize()

watch(selectedEntranceID, (id) => {
  selectedEntrance.value = entrances.value.find(entrance => entrance.id === id)
  const activeFloorIndex = isMobile.value ? 0 : selectedEntrance.value.floors.length - 1
  activeFloor.value = selectedEntrance.value.floors[activeFloorIndex]

})

const setHoveredFigureVisible = (id) => {
  hoveredFigure.value = activeFloor.value.plan.figures.find((figure) => figure.id === id)
  if(useViewFloor.hoveredFigure.value) {
    useViewFloor.hoveredFigure.value.visible = hoveredFigure.value && hoveredFigure.value.room.visible 
  }
}
watch(() => useViewFloor.hoveredFigure.value?.id_, setHoveredFigureVisible)

const figuresData = ref([]);

watch(figuresData, (value) => {
  const figures = props.customFigures ? props.customFigures : value
  useViewFloor.start(
    map.value.getAttribute('id'),
    container.value,
    zoomSlider.value,
    popup.value,
    activeFloor.value.plan.image,
    figures// newV.plan.figures ? newV.plan.figures.map((figure) => ({ id: figure.id, points: figure.points.map((point) => ([point.y, point.x])) })) : []
  )
})
watch(activeFloor, (newV) => {
  figuresData.value = newV.plan.figures && newV.plan.figures.map((figure) => {
    return { id: figure.id, visible: figure.room.visible, points: figure.points.map((point) => {
      return [point.x, point.y]
    }) }
  })
});
const route = useRoute()
const house_id = route.params.house_id

watch(props.filters, () => {
  entrances.value.forEach(entrance => {
    entrance.floors.forEach(floor => {
      floor.plan.figures.forEach(figure => fixRoomVisible(figure.room, props.filters))
    })
  })

  figuresData.value = activeFloor.value.plan.figures && activeFloor.value.plan.figures.map((figure) => {
    return { id: figure.id, visible: figure.room.visible, points: figure.points.map((point) => {
      return [point.x, point.y]
    }) }
  })
})

const handleApartmentStatusChanged = (apartmentId, statusId) => {
  const statuses = fieldsStore.complex_status
  const status = statuses.find((s) => s.id == statusId)
  const statusFields = {
    status_name: status.name,
    status_type: status.status,
    status_color: status.color,
    complex_status_id: status.id
  }

  activeFloor.value.plan.figures.map((figure) => figure.room = figure.room.id == apartmentId ? { ...figure.room,  ...statusFields} : figure.room)
}

onMounted(async() => {
  await api.getHouseFloorPlans(house_id)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        const entrancesData = response.data
        entrancesData.forEach(entrance => {
          entrance.floors.forEach(floor => {
            floor.plan.figures.forEach(figure => {
              figure.room.visible = true
              fixRoomVisible(figure.room, props.filters)
            })
          })
        })
        entrances.value = response.data
        selectedEntranceID.value = entrances.value[0].id
        activeFloor.value = entrances.value[0].floors[entrances.value[0].floors.length - 1]
        // useViewFloor.start(map.value, container.value, zoomSlider.value, popup.value, activeFloor.value.plan.image)
      }
      setHoveredFigureVisible(useViewFloor.hoveredFigure.value?.id_)
    }) 
    
    eventBus.$on('change-apartment-status', handleApartmentStatusChanged)
});

onUnmounted(() => {
  eventBus.$off('change-apartment-status', handleApartmentStatusChanged)
})
</script>

<style lang="scss">
.floor_styles {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.chessFloors__listFloor {
  max-width: 200px;
}
.chessFloors {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 50px 40px;

  &.mobile {
    display: flex;
    flex-direction: column;
    grid-gap: unset;
  }

  &__listFloor {
    width: 100%;
    height: 600px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    overflow-y: auto;
    row-gap: 30px;
    scrollbar-color: var(--main-color);
    padding-bottom: 38px;

    &.mobile {
      flex-direction: row;
      height: unset;
      align-items: center;
      padding: 0px;
      gap: 40px;
      max-width: unset;
      margin-top: 50px;
    }

    &::-webkit-scrollbar {
      height: 100%;
      width: 3px;
      border-radius: 3px;
      background-color: #dedede;
    }
    &::-webkit-scrollbar-thumb {
      width: 100%;
      height: auto;
      border-radius: 3px;
      background-color: #9e9e9e;
    }
  }

  &__resize {
    width: max-content;
    height: auto;
    margin-left: auto;
    .ol-map {
      &__zoom {
        position: relative;
        max-width: 250px;
        width: 250px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        margin-bottom: 20px;

        &-slider {
          padding: 0;
          position: relative;
          width: 4px;
          height: 150px;
          background: #9e9e9e !important;
          z-index: 2;
          transform: rotate(90deg);
          button {
            position: absolute;
            top: -9px;
            left: -9px;
            width: 20px;
            height: 20px;
            -webkit-border-radius: 11px !important;
            border-radius: 11px !important;
            background: #519ef3;
            -webkit-transition: background 0.2s ease;
            transition: background 0.2s ease;
          }
        }
        &-label {
          position: absolute;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          color: #000;
          font-size: 18px;
          text-align: center;
        }
        &-btns {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: rotate(180deg) translateY(50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          button {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 100%;
            background-color: rgba(76, 175, 80, 1);
            color: white;
            font-size: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 2px;
          }
        }
      }
      @media screen and (max-width: 1600px) {
        &__zoom {
          position: relative;
          max-width: 230px;
          height: 80px;
          margin-bottom: 20px;
          &-label {
            position: absolute;
            top: 70px;
            font-size: 16px;
          }
          &-btns {
            button {
              width: 37px;
              height: 37px;
              font-size: 35px;
              background-color: #DDDDDD;
              color: #666666;
            }
          }

        }
      }
    }
  }
  @media (max-width: 405px) {
    &__resize {
      /* margin-left: 0!important; */
      margin-left: auto;
      margin-right: auto;
    }  
  }
}

.ol-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__pane {
    height: 100%;
  }
}

.popup {
  position: absolute;
  display: grid;
  width: max-content;
  grid-template-columns: 30px 1fr;
  grid-gap: 4px 20px;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;

  &__countRoom {
    grid-column: 1;
    grid-row: 1;
    width: 30px;
    height: 30px;
    // background-color: #4caf50;
    color: white;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__number {
    grid-column: 1;
    grid-row: 2;
    font-size: 14px;
    align-self: center;
    color: grey;
  }
  &__price {
    grid-column: 2;
    grid-row: 2;
    font-weight: 700;
    opacity: 1;
    visibility: visible;
  }
  &__square {
    grid-row: 1;
    grid-column: 2;
    font-size: 16px;
    color: black;
    span {
      opacity: 0;
      visibility: hidden;
      display: none;
    }
  }
}

@media (max-width: 1920px) {
  .chessFloors {
    
  grid-template-columns: 15vw 1fr;
  }
}

@media (max-width: 768px) {
  .floor {
    /* display: none; */
  }
}

@media (max-width: 405px) {
  .chessFloors__title {
    font-size: 18px;
    position: absolute;
    left: 0;
  }

  .floor_styles {
    max-width: 30px; 
    max-height: 30px; 
    padding-left: 0.65rem; 
    padding-right: 0.75rem;
  }

  .dropdown_mobile {
    margin-right: 0!important;
    
  }
  /* .chessFloors__listFloor {
    display: none;
  } */

  .chessFloors__mapFloor {
    width: 405px;
    height: 400px;
  }
}

.ol-map__zoom-slider-thumb.ol-unselectable {
  background-color: var(--main-color)!important;
}
</style>