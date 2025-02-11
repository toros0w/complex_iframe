<template>
  <teleport to="body">
    <!-- :house="house" -->
    <!-- @floor:changed="changeApartment" -->
    <WindowInfoForList
      v-if="openedApartment"
      :isOpen="openedApartment"
      :apartment="openedApartment"
      :availableFloors="[figure.floor]"
      @update:is-open="openedApartment = null"
      :decorations="decorations"
      :windowsPlacements="windowsPlacements"
      :house_name="house_name"
      :complex_name="complex_name"
      :filters="filters" 
    />
  </teleport>
  <div
    class="modelWindow"
    :class="[isOpen ? 'open' : '', openFullImage ? 'openFull' : '']"
    ref="window"
  >
  <div class="modelWindow__content">
    <div class="modelWindow__head">
      <!-- <div class="modelWindow__title mr-auto text-3xl">
        {{ room_types["apartment.type"] }} № &nbsp;{{ apartment.number }}
      </div> -->
      <div class="head-content">
        <div>
          <p>{{figure.complex_name}}</p>
          <span>{{figure.house_name}}</span>
        </div>
        <Dropdown
        :options="availableFloorsNames"
        optionLabel="label"
        optionValue="value"
        v-model="activeFloor"
        @change="floorChanged"
        :pt="dropdownStyle"
      ></Dropdown>
      </div>
      <button
        class="modelWindow__close"
        @click="emits('update:isOpen'), (openFullImage = false)"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.8281 20L31.4141 11.4141C32.1953 10.6328 32.1953 9.36719 31.4141 8.58594C30.6328 7.80469 29.3672 7.80469 28.5859 8.58594L20 17.1719L11.4141 8.58594C10.6328 7.80469 9.36719 7.80469 8.58594 8.58594C7.80469 9.36719 7.80469 10.6328 8.58594 11.4141L17.1719 20L8.58594 28.5859C7.80469 29.3672 7.80469 30.6328 8.58594 31.4141C8.97656 31.8047 9.48828 32 10 32C10.5117 32 11.0234 31.8047 11.4141 31.4141L20 22.8281L28.5859 31.4141C28.9766 31.8047 29.4883 32 30 32C30.5117 32 31.0234 31.8047 31.4141 31.4141C32.1953 30.6328 32.1953 29.3672 31.4141 28.5859L22.8281 20Z"
            fill="#757575"
          />
        </svg>
      </button>
    </div>
    <div class="modelWindow__info">
        <div class="modelWindow__image">
          <div class="image">
            <img v-if="figure.floor?.plan_url" :src="figure.floor?.plan_url" alt="" class="" />
            <img v-else style="width: 120px" src="@/shared/assets/images/complexes/gallery.svg" alt="" class="" />
          </div>
          <div v-if="figure.floor?.plan_url" class="image__loop" @click="openFullImage = !openFullImage">
            <svg v-if="openFullImage" xmlns="http://www.w3.org/2000/svg" width="118px" height="117px" viewBox="0 0 1024 1024"><path fill="#000000" d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zM352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64z"/></svg>
            <svg
              v-else
              width="118"
              height="117"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#000000"
                d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zm-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96z"
              />
            </svg>
          </div>
      </div>
      <span
        style="
          color: #868A95;
          letter-spacing: .28px;
          width: 100%
        "
      >
        Найдно:
        <span
          style="color: #222835;"
        >
          {{ figure.rooms.length }} помещений
        </span>
    </span>
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 20px;
        "
      >
        <div
          v-for="room in figure.rooms"
          @click.stop="openedApartment = {...room, house_name: figure.house_name, complex_name: figure.complex_name}"
          :key="room.id"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px;
            border: 1px solid #CFD8E1;
            padding: 12px 16px;
            cursor: pointer;
          "
        >
          <div
            style="
              display: flex;
              align-items: center;
              gap: 20px
            "
          >
            <div style="width: 80px;">
              <img
                v-if="room.plan_url"
                style="
                  max-width: 80px;
                  max-height: 60px;
                  object-fit: contain;
                "
                :src="room.plan_url"
                alt=""
              >
              <img v-else style="width: 60px" src="@/shared/assets/images/complexes/gallery.svg" alt="" class="" />
            </div>
            <div>
              <p>{{ formatNumber(room.total_amount) }}</p>
              <span
                style="color: #868A95"
              >
                {{formatNumber(((room.total_amount || 0) / (room.area || 0)).toFixed(2))}} &#8381;./м2
              </span>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 8px;
            "
          >
            <span
            style="
              min-width: 85px;
              padding: 0 10px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              border-radius: 4px
            "
            :style="{'background-color' : room?.complex_status_info.status_color}"
            >
              {{room?.complex_status_info.status_name}}
            </span>
            <p
              style="
                text-align: right;
                font-size: 14px;
              "
            >
              {{room.floor}} этаж
            </p>
          </div>
        </div>
      </div>
      <!-- <div class="modelWindow__type">{{ apartment.rooms_count }}</div>
      <div class="modelWindow__square">{{ apartment.area }} м2</div> -->
    </div>
  </div> 
  <div v-if="figure.floor?.plan_url" class="modelWindow__fullImage" :class="openFullImage ? 'open' : ''">
    <img :src="figure.floor?.plan_url" alt="" class="" />
  </div>   
  </div>
</template>

<script setup>
//import { PTOptions } from "primevue/ts-helpers";
import { room_types, formatNumber } from "@/shared/utils/util";
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import WindowInfoForList from "./windowInfoForList.vue";
import eventBus from "@/eventBus";

const props = defineProps({
  isOpen: Boolean,
  figure: Object,
  availableFloors: Array,
  decorations: Array,
  windowsPlacements: Array,

  house_name: String,
  complex_name: String,
  filters: Object
  // house: Object
});
const emits = defineEmits(["update:isOpen", "change-apartment-status", "rooms:status:changed"]);

const { isOpen } = toRefs(props);

const window = ref < HTMLElement > HTMLElement;
const openedApartment = ref(null)
const openFullImage = ref(false);
// const floors = ref(["10 этаж", "9 этаж", "7 этаж"]);
const activeFloor = ref(null);
const availableFloorsNames = computed(() => 
  props.availableFloors.map((floor) => ({
    label: `${floor.position} Этаж`,
    value: floor.position,
  }))
);

watch(
  () => props.figure,
  (value) => {
    if (value && value.floor) {
      activeFloor.value = value.floor.position
    }
  }
);

const floorChanged = (event) => {
  emits("floor:changed", event.value);
};


const handleApartmentStatusChanged = () => {
  if (openedApartment.value.status_type != 'available') {
    props.figure.rooms = props.figure.rooms.filter((room) => room.id != openedApartment.value.id )

    emits('rooms:status:changed', openedApartment.value.id)
  }
}

onMounted(() => {
  eventBus.$on('change-apartment-status', handleApartmentStatusChanged)
})

onUnmounted(() => {
  eventBus.$off('change-apartment-status', handleApartmentStatusChanged)
})

const dropdownStyle = ref({
  root: {
    class: ["!border-0"],
  },
  input: {
    class: ["!text-black"],
  },
});
</script>

<style scoped lang="scss">
.modelWindow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 0;
  height: 100% !important;
  z-index: 1000;
  background-color: #ffffff;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  visibility: hidden;
  transition: 0.5s all ease-in-out;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  &.open {
    visibility: visible;
    width: 750px;
    transition: 0.5s all ease-in-out;
    opacity: 1;
  }

  &.openFull {
    width: 100%;
  }

  &__content {
    width: 100%;
    height: 100%;
    max-width: 750px;
    box-shadow: -2px 0px 6px 1px rgba(0, 0, 0, 0.25);
    padding: 50px;
    overflow-y: scroll;
    max-height: 100vh;
    overflow: auto;
  }

  &__fullImage {
    width: 0;
    height: 100%;
    visibility: hidden;
    transition: 0.5s all ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;

    &.open {
      width: 100%;
      visibility: visible;
      transition: 0.5s all ease-in-out;
    }

    img {
      width: 50%;
      height: auto;
      object-fit: cover;
    }
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  &__title {
    font-weight: 700;
  }

  &__info {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 30px;
    flex-direction: column;
    gap: 20px;
  }

  &__status {
    @apply bg-green;
    @apply text-white;
    @apply rounded-s-md;
    font-weight: 700;
    padding: 8px 10px;
    margin-left: auto;
    margin-right: -50px;
  }

  &__image {
    width: 100%;
    min-width: 500px;
    position: relative;
    margin-bottom: 30px;

    .image {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 50%;
      }
    }

    .image__loop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(#ffffff, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: 0.5s all ease-in-out;

      svg {
        width: 140px;
        height: 140px;
      }
    }

    &:hover {
      .image__loop {
        opacity: 1;
        visibility: visible;
        transition: 0.5s all ease-in-out;
        cursor: pointer;
      }
    }
  }

  &__btns {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }

  &__price {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  &__priceSqure {
    font-size: 18px;
    @apply text-grey-900;
    margin-bottom: 30px;
  }

  &__settings {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .settings__title {
      font-size: 18px;
      line-height: 100%;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .settings__table {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .row {
        width: 100%;
        height: auto;
        display: grid;
        grid-template-columns: 250px 1fr;
        @apply border-b;
        @apply border-grey-400;

        .cell {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 11px 30px;
          @apply text-black;
          font-size: 14px;
          font-weight: 300;
          &:first-child {
            padding: 11px 0;
            @apply border-r;
            @apply border-grey-400;
            @apply text-grey-900;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1600px) {
    &.open {
      visibility: visible;
      width: 550px;
      transition: 0.5s all ease-in-out;
    }

    &.openFull {
      width: 100%;
    }

    &__content {
      width: 100%;
      height: 100%;
      max-width: 550px;
      box-shadow: -2px 0px 6px 1px rgba(0, 0, 0, 0.25);
      padding: 30px;
      overflow-y: scroll;
    }

    &__fullImage {
      width: 0;
      height: 100%;
      visibility: hidden;
      transition: 0.5s all ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;

      &.open {
        width: 100%;
        visibility: visible;
        transition: 0.5s all ease-in-out;
      }

      img {
        width: 50%;
        height: auto;
        object-fit: cover;
      }
    }

    &__head {
      margin-bottom: 24px;
    }

    &__title {
      font-size: 24px;
      line-height: 100%;
    }

    &__close {
      width: 32px;
      height: 32px;
      svg {
        width: 100%;
        height: 100%;
      }
    }

    &__info {
      column-gap: 30px;
      margin-bottom: 30px;
    }

    &__status {
      padding: 6px 8px;
      margin-right: -30px;
    }

    &__image {
      margin-bottom: 24px;

      .image {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 60%;
        }
      }

      .image__loop {
        svg {
          width: 80px;
          height: 80px;
        }
      }
    }

    &__btns {
      margin-bottom: 30px;
    }

    &__price {
      font-size: 22px;
      margin-bottom: 4px;
    }

    &__priceSqure {
      font-size: 14px;
      margin-bottom: 30px;
    }
  }

  .head-content {
    display: flex;
    width: 70%;
    justify-content: space-between;
    align-items: center;

    p {
      color: #222835;
      font-weight: bold;
      letter-spacing: .28px;
    }
    span {
      color: #868A95;
    }
  }
}
</style>
