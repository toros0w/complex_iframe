<template>
  <div class="viewHome flex flex-col w-full h-full min-h-full justify-start items-start"
    :class="[filters.view?.value !== 'facades' ? 'px-7.5 py-5' : '']" ref="viewHome">
    <teleport to="body">
      <WindowInfoForList
        v-if="openedApartment"
        :house="house"
        :isOpen="isOpenWindow"
        :apartment="openedApartment"
        :availableFloors="openApartmentAvailableFloors"
        @update:is-open="closeApartment"
        @floor:changed="changeApartment"
        :decorations="fieldsStore.decorations"
        :windowsPlacements="fieldsStore.windowsPlacements"
        @update:is-open-window="openApartment"
        @full:plan-state-updated="toggleIsOpenFullPlan"
        :house_name="house?.name"
        :complex_name="complex?.name"
        :filters="filters" />
    </teleport>

    <div v-if="apartmentsLoader" class="loader-div">
      <img src="@/app/images/rocket-spinner.svg">
    </div>

    <template v-else>
      <ViewHead v-if="house"
        :show_plans="!!plans.filter(plan => {
          return plan.rooms.some(room => room.visible  
        )}).length"
        :show_floors="!!house.floors_plans_count_where_has_floor"
        :show_facades="!!house.facades_count"
        @update:isOpenFiltersMenu="isOpenFiltersMenu = $event"
        :filters="filters"
        :filteredCount="filterCounter"
        @update:viewType="viewType = $event"
        :complex_status = "fieldsStore.complex_status"
      />
      <div class="viewHome__body w-full h-full">
        <ChessTile v-if="filters.view?.value === 'tile' || filters.view?.value === 'grid'" :typeView="filters.view?.value"
          :entrances="entrances" :hidden-price="filters.hiddenPrice" :house_name="house?.name"
          :complex_name="complex?.name" @openWindow="openApartment" :openedApartment="openedApartment" />
        <ChessLayouts v-if="filters.view?.value === 'layouts'" @update:is-open-window="openApartment" :plans="plans"
          :house_name="house?.name" :complex_name="complex?.name" :isDetailsOpened="isOpenWindow" />
        <ChessFloors v-if="filters.view?.value === 'floors' && !isOpenFullPlan" @update:is-open-window="openApartment"
          :house_name="house?.name" :complex_name="complex?.name" :filters="filters" />
        <ChessFacade v-if="filters.view?.value === 'facades'" :view-type="viewType" :house_name="house?.name"
          :complex_name="complex?.name" :filters="filters" :decorations="fieldsStore.decorations"
          :windowsPlacements="fieldsStore.windowsPlacements" />
        <ChessList v-if="filters.view?.value === 'list'" @update:is-open-window="openApartment" :entrances="entrances"
          :decorations="fieldsStore.decorations" :windowsPlacements="fieldsStore.windowsPlacements" :openedApartment="openedApartment" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFieldsStore } from "@/app/store/fields";
import { useHouseStore } from "@/app/store/house";

import ChessTile from "@/widgets/homePage/viewHome/chessTile.vue";
import ChessLayouts from "@/widgets/homePage/viewHome/chessLayouts.vue";
import ChessFloors from "@/widgets/homePage/viewHome/chessFloors.vue";
import ChessList from "@/widgets/homePage/viewHome/chessList.vue";
import ViewHead from "@/widgets/homePage/viewHome/viewHead.vue";
import WindowInfoForList from "@/widgets/homePage/viewHome/windowInfoForList.vue";
import ChessFacade from "@/widgets/homePage/viewHome/chessFacade.vue";

import api from "@/shared/api";
import { copyObject, fixRoomVisible } from "@/shared/utils/util";
import eventBus from "@/eventBus";

const houseStore = useHouseStore()


const complex = computed(() => houseStore.complex)
const house = computed(() => houseStore.house)

const viewHome = ref();
const isOpenFiltersMenu = ref(false);
const isOpenWindow = ref(false);
const viewType = ref("park");
const INITIAL_FILTERS = {
  rooms: [],
  selectedTypes: [],
  selectedDecorations: [],
  floor: {
    from: '',
    to: ''
  },
  price: {
    min: "",
    max: "",
  },
  square: {
    min: "",
    max: "",
  },
  squareKitchen: {
    min: "",
    max: "",
  },
  useSquarePrice: false,
  hiddenPrice: false,
  onlyFree: false,
  view: {
    name: "Плитка",
    value: "tile",
    icon: "tile",
    visible: true,
  },
  adsTargets: [],
  adsStates: [],
  limit: {
    total: {
      min: "",
      max: ""
    },
    area: {
      min: "",
      max: ""
    },
    kitchen_area: {
      min: "",
      max: ""
    },
    room_types: [],
    decoration_types: [],
    window_placements: [],
  }
};

const apartmentsLoader = ref(true);
const filters = ref(copyObject(INITIAL_FILTERS));
const filtersLimit = ref({});

const openedApartment = ref({})

const entrances = ref([]);
const plans = ref([])
const route = useRoute()
const router = useRouter()
const fieldsStore = useFieldsStore()
const isOpenFullPlan = ref(false)

const clearFilters = () => {
  filters.value = copyObject({ ...INITIAL_FILTERS, view: filters.value.view, limit: filtersLimit.value })
}

watch(filters,
  (newV) => {
    if (newV) {
      entrances.value.forEach(entrance => {
        entrance.floors.forEach(floor => {
          floor.rooms.forEach((room) => fixRoomVisible(room, filters.value))
        })
      })

      plans.value.forEach(plan => {
        plan.rooms.forEach((room) => fixRoomVisible(room, filters.value))
      })
    }
  },
  { deep: true }
);

const filterCounter = computed(() => {
  switch (filters.value.view?.value) {
    case 'layouts':
      return countFilteredPlansRooms
    default:
      return countFilteredRooms
  }
})
const countFilteredPlansRooms = computed(() => {
  return (plans.value || []).reduce(((acc, plan) => {
    return acc + plan.rooms.reduce((roomsAcc, room) => {
      return roomsAcc + +room.visible
    }, 0)
  }), 0)
})
const countFilteredRooms = computed(() => {
  return (entrances.value || []).reduce(((acc, entrance) => {
    return acc + entrance.floors.reduce((floorAcc, floor) => {
      return floorAcc + floor.rooms.reduce((roomsAcc, room) => {
        return roomsAcc + +room.visible
      }, 0)
    }, 0)
  }), 0)
})

const loadEntrances = async () => {
  await api.getHouseEntrances(route.params.house_id, ['rooms']).then((response) => {
    const updatedEntrances = response.data.sort((a, b) => a.position > b.position ? 1 : -1)

    updatedEntrances
        .forEach((entrance) => entrance.floors = entrance.floors
            .sort((a, b) => a.position > b.position ? 1 : -1))

    updatedEntrances.forEach(
        entrance => entrance.floors
            .forEach(floor => floor.rooms
                .forEach(room => { room.visible = true })))

    entrances.value = updatedEntrances
  }).finally(() => apartmentsLoader.value = false)
}

const toggleIsOpenFullPlan = (payload) => {
  isOpenFullPlan.value = payload
}

onMounted(async () => {
  if (route.params.house_id) {
    await loadEntrances();

    await api.getHousePlans(route.params.house_id)
      .then((response) => {
        var res = response.data;

        if (res) {
          const filteredPlans = res.filter((plan) => plan.rooms.length);
          filteredPlans.forEach(plan => {
            plan.rooms.forEach(room => {
              room.visible = true
            })
          })
          plans.value = filteredPlans
        }
      })
    await houseStore.get_house(route.params.house_id, ['rooms']).then((response) => {
      if (response.data) {
        if (response.data.house && !response.data.house.rooms_count) router.push(`/my-objects/${route.params.id}/home/${route.params.house_id}`)
      }
    })
    
    await api.getFilterFields(route.params.house_id)
      .then(({ data }) => {
        filtersLimit.value = data;
        filters.value.limit = filtersLimit.value;
      })
  }

  eventBus.$on('clear-filters', clearFilters)
  eventBus.$on('update-model', loadEntrances)
});

onUnmounted(() => {
  eventBus.$off('clear-filters', clearFilters)
  eventBus.$off('update-model', loadEntrances)
})

const openApartment = (apartment) => {
  openedApartment.value = apartment
  isOpenWindow.value = true
}

const closeApartment = () => {
  isOpenWindow.value = false
  setTimeout(() => {
    openedApartment.value = {}
  }, 350)
}

const changeApartment = (floorPosition) => {
  const floor = openedApartmentEntrance.value.floors.find((entranceFloor) => entranceFloor.position == floorPosition)

  openApartment(floor.rooms.find((room) => room.position == openedApartment.value.position))
}

const openedApartmentEntrance = computed(() => {
  if (openedApartment.value) {
    return entrances.value.find((entrance) => entrance.id == openedApartment.value.entrance_id)
  }

  return null;
})

const openApartmentAvailableFloors = computed(() => {
  if (openedApartment.value && openedApartmentEntrance.value) {
    return openedApartmentEntrance.value.floors
      .filter((floor) => floor.rooms.find((room) => room.position == openedApartment.value.position))
  }

  return []
})
</script>

<style scoped lang="scss">
.viewHome {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-grow: 1;

  &__body {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 700px;
  }
}

.loader-div {
  margin: auto;

  img {
    width:150px;
    max-width: none;
  }
}
</style>
