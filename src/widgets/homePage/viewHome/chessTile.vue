<template>
  <div class="chessTile flex flex-col w-full justify-start items-center relative"
    :class="typeView === 'grid' ? 'typeGrid' : ''">
    <div v-if="typeView === 'grid' || typeView === 'tile'"
      class="flex flex-col items-center space-y-6 py-8 px-6 rounded-lg max-w-lg shadow-lg z-10 w-[300px] mb-5 sticky top-0 self-start p-[20px_30px_20px_30px] bg-white">
      <!-- Zoom Range Slider -->
      <div class="relative w-full">
        <!-- Background track -->
        <div class="absolute left-0 top-1/2 w-full h-2 bg-gray-300 rounded-full transform -translate-y-1/2"></div>

        <!-- Active track -->
        <div class="absolute top-1/2 h-2 bg-[#4caf50] rounded-full transform -translate-y-1/2 transition-all duration-0"
          :style="{ width: (zoomLevel - 10) + '%' }"></div>

        <!-- Slider thumb -->
        <div
          class="absolute top-1/2 w-6 h-6 bg-[#4caf50] rounded-full shadow-md border-4 border-white transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-0"
          :style="{ left: (zoomLevel - 10) + '%' }"></div>

        <!-- Hidden input range -->
        <input type="range" v-model.number="zoomLevel" @input="showVal" min="10" max="100" step="1"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
    </div>
    <div class="chessTile flex flex-row w-full justify-start items-center relative">
      <div class="labelLeft h-full flex justify-center items-center">
        <div class="text -rotate-90 text-grey-900">ЭТАЖИ</div>
      </div>
      <div ref="floorListLeft" class="chessTile__left mx-5 flex flex-col-reverse gap-y-2.5" v-if="!isDifferentFloors">
        <div class="row" v-for="index in floorsNumbers" :key="`floor${index}`">
          <div style="width: 25px;" class="cell text-grey-900">{{ Number(index) }}</div>
        </div>
        <!-- <div class="row">
        <div class="cell"></div>
      </div> -->
      </div>
      <div
        class="chessTile__main w-full flex flex-col justify-start items-start gap-x-12.5 overflow-x-scroll chessTileScrollBar"
        ref="container" @scroll="syncScroll('chessTileScrollBar')">
        <div v-if="typeView === 'grid'" class="chessTileTopScrollBar overflow-x-scroll absolute -top-8"
          ref="chessTileTopScrollBar" @scroll="syncScroll('chessTileTopScrollBar')">
          <div class="topScrollBar" ref="topScrollBar"></div>
        </div>
        <div class="chessTile__section flex flex-row w-max h-max" ref="zoomContainer">
          <div class="chessTile__section flex flex-col gap-y-2.5 w-max" v-for="entrance in entrances"
            :key="entrance.id">
            <div class="row flex flex-row gap-x-2.5">
              <div class="cell text-grey-900 !w-max">{{ entrance.name }}</div>
            </div>
            <div class="flex">
              <!-- <div class="flex flex-col-reverse gap-y-2.5" v-if="isDifferentFloors">
              <div class="row" v-for="index in floorsNumbers" :key="`floor${index}`">
                <div class="cell text-grey-900">{{ Number(index) }}</div>
              </div>
            </div> -->
              <div class="flex flex-col-reverse gap-y-2.5">
                <div class="row flex flex-row gap-x-2.5 w-100 !justify-start" v-for="index in floorsNumbers"
                  :set="floor = entrance.floors.find(floor => floor.position == index)" :key="index">
                  <div class="row flex-row-reverse" :key="`floor${index}`" v-if="floor && isDifferentFloors">
                    <div style="width: 25px;" class="cell text-grey-900">{{ Number(index) }}</div>
                  </div>
                  <div v-if="props.typeView === 'tile' && floor" class="row flex flex-row gap-x-2.5 w-100"
                    :style="floor && floor.alignment == 'right' ? 'justify-content: end;' : 'justify-content: start;'"
                    style="width: 100%;">
                    <div v-for="(apartament, apartamentIndex) in floor.rooms"
                      :key="`floor${index}apartament${apartamentIndex}`" class="cell text-white rounded cursor-pointer"
                      :style="{ 'opacity': apartament.visible ? 1 : 0.1, 'background-color': `${apartament.complex_status_info?.status_color}` }"
                      @click="emits('openWindow', apartament)">
                      {{ apartament.layout_feature === 'studio' ? 'ст' : apartament.rooms_count }}
                    </div>
                  </div>
                  <template v-else-if="props.typeView === 'grid' && floor">
                    <div style="display: flex !important; justify-content: start" :class="[
                      'cell cell--grid grid grid-cols-[30px_1fr] gap-y-1 gap-x-1 grid-rows-2',
                      'border border-grey-400 rounded padding-not-right w-max cursor-pointer',
                    ]" v-for="(apartament, apartamentIndex) in floor.rooms"
                      :style="`opacity: ${apartament.visible ? 1 : 0.1}; width: ${!showSmallView ? 225 : 50}px`"
                      :key="`floor${index}apartament${apartamentIndex}`" @click="emits('openWindow', apartament)"
                      v-tooltip.top="{
                        value: `
                      <div class='cell__countRoom w-[24px] h-[24px] rounded-3xl bg-green flex justify-center items-center text-white text-center'>${apartament.rooms_count}к</div>
                    <div class='cell__number text-black text-xs col-start-1 row-start-2'>№${apartament.number}</div>
                    <div class='cell__price text-base text-black col-start-2 row-start-1 h-max'>
                      ${formatNumber(apartament.total_amount)} руб.
                    </div>
                    <div class='cell__desc text-xs text-black row-start-2 col-start-2'>
                      ${apartament.area} м2
                      <span class='text-grey-900'>- ${formatNumber(((apartament.total_amount || 0) / (apartament.area || 0)).toFixed(2))} руб./м2</span
                      >
                    </div>`,
                        escape: true,
                        disabled: !hiddenPrice,
                        hideDelay: 100,
                        pt: {
                          text: {
                            class: [
                              '!border !border-green !bg-white !color-black !h-auto !whitespace-normal !w-max',
                              '!grid !grid-cols-[30px,_1fr] !gap-y-1 !gap-x-4 !grid-rows-2 !p-2.5 !break-normal',
                            ],
                          },
                          arrow: {
                            class: ['!border-t-green'],
                          },
                        },
                      }">
                      <div
                        style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 60px">
                        <div :class="[
                          'cell__countRoom min-w-6 min-h-6 rounded-3xl',
                          'flex justify-center items-center text-white',
                        ]" :style="{ 'background-color': apartament.complex_status_info?.status_color }">
                          {{ apartament.layout_feature !== 'studio' ? apartament.rooms_count + ' к' : 'cт' }}
                        </div>
                        <div style="text-wrap: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px"
                          class="cell__number col-start-1 row-start-2">№ {{ apartament.number }}</div>
                      </div>
                      <div v-if="!showSmallView"
                        style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 140px;">
                        <div class="flex" style="gap: 2px">
                          <div style="max-width: 102px; overflow: hidden; text-overflow: ellipsis; text-wrap: nowrap"
                            class="cell__price" :class="hiddenPrice ? 'hidden' : ''">
                            {{ formatNumber(apartament.total_amount) }}
                          </div>
                          <div class="cell__price" :class="hiddenPrice ? 'hidden' : ''">
                            руб.
                          </div>
                        </div>
                        <div style="display: flex; font-size: 10px; gap: 2px">
                          <span
                            style="display: block; max-width: 56px; overflow: hidden; text-overflow: ellipsis; text-wrap: nowrap;"
                            :class="hiddenPrice ? 'hidden' : ''">{{ formatNumber(((apartament.total_amount || 0) /
                              (apartament.area || 0)).toFixed(2)) }}</span>
                          <span style="text-wrap: nowrap;" :class="hiddenPrice ? 'hidden' : ''"> руб./м2</span>
                        </div>
                        <div class="cell__desc">
                          <div style="text-wrap: nowrap; display: flex;">
                            <div
                              style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; text-wrap: nowrap;">{{
                              apartament.area + ' м2'}}</div>
                          </div>
                        </div>
                      </div>
                      <div v-if="!showSmallView"
                        style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;width: 16px;position: relative;">
                        <img v-if="isErrorStatus(apartament)" src="@/shared/assets/images/icons-bookmark-16-red.png"
                          style="position:absolute;top:-11px;right: -4px;" alt="" class="" v-tooltip.top="{
                            value: getStatusText(apartament),
                            escape: true,
                            hideDelay: 1000,
                            pt: {
                              text: {
                                class: [
                                  '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                  ' !p-2.5 !break-normal',
                                ],
                              },
                              arrow: {
                                class: ['!border-t-red'],
                              },
                            },
                          }" />
                        <img
                          v-if="isWaitStatus(apartament)"
                          src="@/shared/assets/images/icons-bookmark-16-orange.png"
                          style="position:absolute;top:-11px;right: -4px;" alt="" class="" v-tooltip.top="{
                            value: getStatusText(apartament),
                            escape: true,
                            hideDelay: 1000,
                            pt: {
                              text: {
                                class: [
                                  '!border !border-orange !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                  ' !p-2.5 !break-normal',
                                ],
                              },
                              arrow: {
                                class: ['!border-t-orange'],
                              },
                            },
                          }" />
                        <img
                            v-if="isActiveStatus(apartament)"
                            src="@/shared/assets/images/icons-bookmark-16-green.png"
                            style="position:absolute;top:-11px;right: -4px;" alt="" class="" v-tooltip.top="{
                            value: getStatusText(apartament),
                            escape: true,
                            hideDelay: 1000,
                            pt: {
                              text: {
                                class: [
                                  '!border !border-green !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                  ' !p-2.5 !break-normal',
                                ],
                              },
                              arrow: {
                                class: ['!border-t-green'],
                              },
                            },
                          }" />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="floorListRight" class="chessTile__right mx-5 flex flex-col-reverse gap-y-2.5" v-if="!isDifferentFloors">
        <div class="row" v-for="index in floorsNumbers" :key="`floor${index}`">
          <div style="width: 25px;" class="cell text-grey-900">{{ Number(index) }}</div>
        </div>
        <!-- <div class="row">
        <div class="cell"></div>
      </div> -->
      </div>
      <div class="labelRight h-full flex justify-center items-center">
        <div class="text rotate-90 text-grey-900">ЭТАЖИ</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, onUpdated, ref, nextTick } from "vue";

import { formatNumber, isErrorStatus, getStatusText, isWaitStatus, isActiveStatus } from "@/shared/utils/util";
import eventBus from "@/eventBus";



/*enum StatusApartament {
  FREE = "free",
  BOOKING = "booking",
  SOLD = "sold",
  UNAVAILABLE = "unavailable",
}

interface Apartament {
  rooms_count: number;
  status: StatusApartament;
}

type floor = {
  apartments: Apartament[];
};*/

const props = defineProps({
  typeView: String | undefined,
  hiddenPrice: Boolean,
  openedApartment: Boolean,

  entrances: {
    type: Array,
    default: []
  },
  showSmallView: Boolean
});

const emits = defineEmits(
  ["openWindow"]
);

const pdfButton = ref({});
const chessTileTopScrollBar = ref(null);
const topScrollBar = ref();
const container = ref(null);

// Zoom
const zoomLevel = ref(100);
const zoomContainer = ref(null);
const floorListLeft = ref(null)
const floorListRight = ref(null)

const apartments = computed(() => (
  props.entrances.reduce((accumulator, currentEntrance) => {
    currentEntrance.floors.forEach(floor => {
      accumulator.push(...floor.rooms.map(room => {
        room.euroPlan = room.layout_feature === "european_layout"
        room.studio = room.layout_feature === "studio"
        room.freePlane = room.layout_feature === "available"
        room.formatFile = "pdf"

        return room
      }))
    });

    return accumulator
  }, [])
))

const isDifferentFloors = computed(() => {
  return !(props.entrances
    .every((entrance) => entrance.floors
      .every(
        (floor, index) => {
          return props.entrances[0].floors.length === entrance.floors.length &&
            props.entrances[0].floors[index] &&
            floor.position == props.entrances[0].floors[index].position
        }
      )
    ))
})

const handlePdfStateChanged = (apartamentId) => {
  if (props.openedApartment.id && props.openedApartment.id == apartamentId) return;

  const apartment = apartments.value.find((apartment) => apartment.id == apartamentId);

  if (apartment) {
    apartment.inPdf = !apartment.inPdf
  }
}

const floorsNumbers = computed(() => {
  let max = 0
  let min = 0

  if (props.entrances.length) {
    props.entrances.forEach((entrance) => {
      const positions = entrance.floors.map((floor) => floor.position)
      const floorMaxPosition = Math.max(...positions)
      const floorMinPosition = Math.min(...positions)
      if (floorMinPosition < min) {
        min = floorMinPosition
      }
      if (floorMaxPosition > max) {
        max = floorMaxPosition
      }
    })
    return Array(max - min + 1).fill().map((_, index) => min + index).filter(num => num !== 0);
  }
  return []

});

// const computedEntrances = computed(() => {

//   if (props.entrances.length) {
//     return props.entrances.map(  (entrance) => {
//       const positions = entrance.floors.map((floor) => floor.position)
//       const floorMaxPosition = Math.max(...positions)
//       const floorMinPosition = Math.min(...positions)
//       entrance.floorNumbers = Array(floorMaxPosition - floorMinPosition + 1).fill().map((_, index) => floorMinPosition + index).filter(num => num !== 0)
//       return  entrance
//     })
//   }
//   return []

// });

const syncScroll = (source) => {
  const w1 = chessTileTopScrollBar.value;
  const w2 = container.value;

  if (source === 'chessTileTopScrollBar') {
    w2.scrollLeft = w1.scrollLeft;
  } else if (source === 'chessTileScrollBar') {
    w1.scrollLeft = w2.scrollLeft;
  }
};

const syncScrollBars = () => {
  // Ensure topScrollBar, chessTileTopScrollBar, and container are all defined before attempting to set widths
  if (topScrollBar.value && chessTileTopScrollBar.value && container.value) {
    // Set the width of topScrollBar based on the scrollWidth of container (total content width)
    topScrollBar.value.style.width = `${container.value.scrollWidth}px`;

    // Set the width of chessTileTopScrollBar based on the visible width of container (clientWidth)
    chessTileTopScrollBar.value.style.width = `${container.value.clientWidth}px`;
  }
};

// Set zoom level on the zoomContainer
const setZoom = (zoomPercent, el) => {
  const zoom = zoomPercent / 100; // Convert percentage to scale (0.1 - 1.0)

  // if (el) {
  //   const transformOriginValue = transformOrigin;
  //   const prefixes = ["webkit", "moz", "ms", "o"];
  //   const scaleValue = `scale3d(${zoom}, 1, 1)`; // Use scale3d for 3D transformation
  //   const originString = `${transformOriginValue[0] * 100}% ${transformOriginValue[1] * 100}%`;

  //   prefixes.forEach((prefix) => {
  //     el.style[`${prefix}Transform`] = scaleValue;
  //     el.style[`${prefix}TransformOrigin`] = originString;
  //   });

  //   el.style.transform = scaleValue;
  //   el.style.transformOrigin = originString;
  // }

  el.style.zoom = zoom
  floorListLeft.value.style.zoom = zoom;
  floorListRight.value.style.zoom = zoom;
  syncScrollBars();
};

// Handle the input change and update zoom
const showVal = () => {
  setZoom(zoomLevel.value, zoomContainer.value);
};

onUpdated(() => {
  syncScrollBars();
})

onMounted(() => {
  eventBus.$on('pdf-state-changed', handlePdfStateChanged);
  //zoomLevel.value = 100;
  console.log(zoomLevel.value);
});

onUnmounted(() => {
  eventBus.$off("pdf-state-changed", handlePdfStateChanged);
});
</script>

<style scoped lang="scss">
/* Ensure smooth transitions */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-ms-thumb {
  height: 20px;
  width: 20px;
  background: transparent;
  cursor: pointer;
}

.topScrollBar {
  height: 20px;
}

/* white-space: pre-line; */
/* word-break: break-word; */

.padding-not-right {
  padding: 0.625rem 0 0.625rem 0.625rem;
}

.chessTile {
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;

    .cell {
      width: 32px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.cell--grid {
        display: grid;
        width: auto;
      }

      &__countRoom {
        min-width: 24px;
        width: 24px;
        min-height: 24px;
        font-size: 12px;
      }

      &__number {
        color: #757575;
        font-size: 11px;
      }

      &__price {
        font-weight: 700;
        font-size: 16px;
      }

      &__desc {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;

        span {
          color: #757575;
          font-size: 12px;
          margin-left: 2px;
        }
      }
    }

    .chess-item {
      width: 225px !important;
    }
  }

  &__left,
  &__right {
    padding-bottom: 12px;
  }

  &__main {
    scrollbar-color: #9e9e9e #dedede;
    padding-bottom: 38px;

    &::-webkit-scrollbar {
      width: 100%;
      height: 3px;
      border-radius: 3px;
      background-color: #dedede;
    }

    &::-webkit-scrollbar-thumb {
      width: auto;
      height: 100%;
      border-radius: 3px;
      background-color: #9e9e9e;
    }
  }

  &.typeGrid {
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;

      .cell {
        width: auto;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.cell--grid {
          display: grid;
          width: auto;
        }

        &__countRoom {
          min-width: 24px;
          width: 24px;
          min-height: 24px;
          font-size: 12px;
        }

        &__number {
          color: #757575;
          font-size: 11px;
        }

        &__price {
          font-weight: 700;
          font-size: 16px;
        }

        &__desc {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 12px;

          span {
            color: #757575;
            font-size: 12px;
            margin-left: 2px;
          }
        }
      }
    }
  }
}
</style>