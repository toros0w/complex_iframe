<template>
  <IframeNavbar @closeIframeNavbar="closeIframeNavbar" v-if="navbarIsOpen || windowWidth > 768" @view-mode-emit="changeViewMode" class="iframe-navbar-left" :visibility="visibilityItems"/>
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
    <ApartmentDetailIframe class="apartment_detail_modal" v-if="apartmentDetailIsOpen" canvasId="apartmentPlan" :apartment="openedApartment" />
    <div v-if="apartmentsLoader" class="loader-div">
      <img src="@/app/images/rocket-spinner.svg">
    </div>

    <!-- <template v-else-if="route.params.apartment_id">
      <ApartmentDetailIframe canvasId="apartmentPlan" v-if="openedApartment" :apartment="openedApartment" />
    </template> -->

    <template v-else>

      <ViewHead v-if="house && filters.view.value !== 'facades'"
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
        @openIframeNavbar="openIframeNavbar"
        :navBarClosed="navBarClosed"
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
        <ChessList v-if="filters.view?.value === 'list'" @update:is-open-window="openApartment" @openApartment="(apartment) => openApartmentDetail(apartment)" :entrances="entrances"
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
import IframeNavbar from "@/components/IframeNavbar.vue";
import BurgerIcon from "@/components/BurgerIcon.vue";
import Navigation from "@/components/Navigation.vue";
import ApartmentDetailIframe from "../ApartmentDetailIframe.vue";


const houseStore = useHouseStore()


const complex = computed(() => houseStore.complex)
const house = computed(() => houseStore.house)
const apartmentDetailIsOpen = ref(false)

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
    name: "Список",
    value: "list",
    icon: "list",
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

const openedApartment = ref(null)
const navbarIsOpen = ref (false)

const entrances = ref([]);
const plans = ref([])
const route = useRoute()
const router = useRouter()
const fieldsStore = useFieldsStore()
const isOpenFullPlan = ref(false)
const navBarClosed = ref(null)

console.log(fieldsStore.complex_status, 'complex_STATUS');

const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

const openIframeNavbar = () => {
  navbarIsOpen.value = true 
  eventBus.$emit('navbarIsOpened')
  
}
const closeIframeNavbar = () => {
  navbarIsOpen.value = false
  eventBus.$emit('navbarIsClosed')
  // navBarClosed.value = true
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const clearFilters = () => {
  filters.value = copyObject({ ...INITIAL_FILTERS, view: filters.value.view, limit: filtersLimit.value })
}

onMounted(() => {
  if (!openedApartment || route.params.apartment_id !== openedApartment.value?.id) {
    api.get_room_entrance(route.params.apartment_id).then((res) => {
      const entrance = res.data;
      entrance.floors.forEach((floor) => floor.rooms.find((room) => {
          if (room.id == route.params.apartment_id) {
              openedApartment.value = room
              console.log(openedApartment.value);
          }
      }))
    })
  }
})

const openApartmentDetail = (apartment) => {
  // console.log(route.params, 'openApartmentDetail')
  // router.push({ name: 'ApartmentDetail', params: { id: apartment.id } });
  console.log('clicked');
  openedApartment.value = apartment
  const apartmentId = apartment.id
  apartmentDetailIsOpen.value = true

  console.log(apartmentDetailIsOpen.value, 'apartmentDetailIsOpen.value');


  
  // const { token, id, house_id } = route.params

    // router.push({
    //   name: 'apartment-detail',
    //   params: {
    //     token,
    //     id,
    //     house_id,
    //     apartment_id: apartmentId,
    //   },
    //   query: route.query,
    // })

}

const changeViewMode = (value) => {
  console.log(value);
  const { apartment_id, ...paramsWithoutApartmentId } = route.params;
  const newParams = { ...paramsWithoutApartmentId };
  console.log(newParams, 'newparams');
  
  router.push({ 
      name: 'view-home', // остаёмся на той же странице
      params: newParams,
      query: route.query,
    });
  filters.value.view = value
  
}
// console.log(house, 'house');

// console.log(!!house.facades_count, 'house.facades_count');

const plansArr = computed(() => plans.value ?? []);
const visibilityItems = computed(() => ({
  all: true,
  facades: !!house.value.facades_count,
  plans: Array.isArray(plansArr.value) && plansArr.value.some(plan => 
    Array.isArray(plan.rooms) && plan.rooms.some(room => room.visible)
  ),
  plate: true,
  net: true,
  floors: !!house.value.floors_plans_count_where_has_floor
}));

console.log(plansArr, 'plansArr');

watch(() => route.params.apartment_id, {
  immediate: true,
  handler(apartmentId) {
    if (apartmentId) {
      this.loadApartmentById(apartmentId)
    } else {
      this.isApartmentDetail = false
      this.openedApartment = null
    }
  }
})



// console.log(!!house.floors_plans_count_where_has_floor, '!!house.floors_plans_count_where_has_floor');
// console.log(Array.isArray(plans) && plans.some(plan => 
//     Array.isArray(plan.rooms) && plan.rooms.some(room => room.visible)
//   ), 'test2222');
// console.log(!!house.facades_count, '!!house.facades_count');




// const visibilityItems = {
//   all: true,
//   facades: false,
//   plans: true,
//   plate: true,
//   net: false,
//   floors: true
// }

watch(filters,
  (newV) => {
    if (newV) {
      console.log(newV);
      
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

// filters.view = ChessTile
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


    // fetch('/plans.json')
    //   .then(response => response.json())
    //   .then(res => {
    //     if (res) {
    //       const filteredPlans = res.filter(plan => plan.rooms.length);
    //       filteredPlans.forEach(plan => {
    //         plan.rooms.forEach(room => {
    //           room.visible = true;
    //         });
    //       });
    //       plans.value = filteredPlans;
    //     }
    //   })
    //   .catch(error => console.error('Ошибка при загрузке данных:', error));

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
  // max-width: calc(100vw - 350px);
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
    width:110px;
    max-width: none;
  }
}

.iframe-navbar-left {
  position: sticky;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  background-size: cover;
  background-position: center;
}
@media(max-width: 768px) {
  .iframe-navbar-left {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 23;
  }
}

@media(min-width: 768px) {
  .viewHome {
    max-width: calc(100vw + 350px);
  }  
}

.apartment_detail_modal {
  position: absolute;
  left: -350px;
  top: 0;
}
</style>
