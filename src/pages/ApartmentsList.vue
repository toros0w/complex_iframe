<template>
  <div class="homePage relative bg-white flex justify-start items-start">
    <div v-if="apartmentsLoader" class="loader-div">
      <img src="@/app/images/rocket-spinner.svg">
    </div>
    <div
      class="viewHome flex flex-col w-full h-full min-h-full justify-start items-start px-7.5 py-5"
      ref="viewHome"
      v-else
    >
      
        <ViewHead
            :show_plans="false"
            :show_floors="false"
            :show_facades="false"
            :show_change_view="false"
            @update:isOpenFiltersMenu="isOpenFiltersMenu = $event"
            :filters="filters"
            :filteredCount="filterCounter"
            @update:viewType="viewType = $event"
        />
        <div class="viewHome__body w-full h-full">
            <ChessList
              :decorations="fieldsStore.decorations"
              :windowsPlacements="fieldsStore.windowsPlacements"
              @update:is-open-window="openApartment"
              :entrances="entrances"
              :openedApartment="openedApartment"
            />
        </div>
    </div>
    <teleport to="body">
      <WindowInfoForList
        v-if="openedApartment"
        :isOpen="isOpenWindow"
        :apartment="openedApartment"
        :availableFloors="openApartmentAvailableFloors"
        @update:is-open="closeApartment"
        @floor:changed="changeApartment"
        :decorations="fieldsStore.decorations"
        :windowsPlacements="fieldsStore.windowsPlacements"
      />
    </teleport>
  </div>
</template>
<script setup>
import ChessList from "@/widgets/homePage/viewHome/chessList.vue";
import ViewHead from "@/widgets/homePage/viewHome/viewHead.vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import api from "@/shared/api";
import { useRoute } from "vue-router";
import WindowInfoForList from "@/widgets/homePage/viewHome/windowInfoForList.vue";
import { copyObject, fixRoomVisible } from "@/shared/utils/util";
import eventBus from "@/eventBus";
import { useFieldsStore } from "@/app/store/fields";
const fieldsStore = useFieldsStore()

const route = useRoute();
const entrances = ref([]);
const openedApartment = ref({});
const isOpenWindow = ref(false);
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
},
}
const filters = ref(copyObject(INITIAL_FILTERS));
const apartmentsLoader = ref(true)

const clearFilters = () => {
  filters.value = copyObject(INITIAL_FILTERS)
}

const filterCounter = computed(() => {
return (entrances.value || []).reduce((acc, entrance) => {
  return (
    acc +
    entrance.floors.reduce((floorAcc, floor) => {
      return (
        floorAcc +
        floor.rooms.reduce((roomsAcc, room) => {
          return roomsAcc + +room.visible;
        }, 0)
      );
    }, 0)
  );
}, 0);
});

const openApartmentAvailableFloors = computed(() => {
  if (openedApartment.value && openedApartmentEntrance.value) {
    return openedApartmentEntrance.value.floors
      .filter((floor) => floor.rooms.find((room) => room.position == openedApartment.value.position))
  }

  return []
})

const openedApartmentEntrance = computed(() => {
  if (openedApartment.value) {
    return entrances.value.find(
      (entrance) => entrance.id == openedApartment.value.entrance_id
    );
  }

  return null;
});

const openApartment = (apartment) => {
  openedApartment.value = apartment;
  isOpenWindow.value = true;
};

const closeApartment = () => {
  isOpenWindow.value = false;
  setTimeout(() => {
    openedApartment.value = {};
  }, 350);
};


const changeApartment = (floorPosition) => {
  const floor = openedApartmentEntrance.value.floors.find(
    (entranceFloor) => entranceFloor.position == floorPosition
  );

  openApartment(
    floor.rooms.find((room) => room.position == openedApartment.value.position)
  );
};

const filterChange = () => {
  entrances.value.forEach(entrance => {
    entrance.floors.forEach(floor => {
      floor.rooms.forEach((room) => fixRoomVisible(room, filters.value)) 
    })
  })
}

watch(filters,
  (newV) => {
    if (newV) {
      filterChange()
    }
  },
  { deep: true }
);
const parseQueryFilters = () => {
  Object.entries(route.query).forEach(([key, value]) => {
    const skipKeys = ['period','selectedMetros', 'address', 'complexes']
    if (skipKeys.includes(key)) return 

    if (key == 'area_from') {
      key = 'square_min'
    }
    if (key == 'area_to') {
      key = 'square_max'
    }

    if (key == 'price_from') {
      key = 'price_min'
    }

    if (key == 'price_to') {
      key = 'price_max'
    }

    if (key == 'selectedDecorations' && Array.isArray(value)) {
      value = value.map((num) => parseInt(num));
    }

    if (key == 'selectedDecorations' && typeof value == 'string' ) {
      value = [parseInt(value)];
    }

    if (key == 'selectedWindowsPlacements' && Array.isArray(value)) {
      value = value.map((num) => parseInt(num));
    }

    if (key == 'selectedWindowsPlacements' && typeof value == 'string' ) {
      value = [parseInt(value)];
    }


    const keys = key.split('_')
    if (keys.length > 1) {
      filters.value[keys[0]][keys[1]] = value
    } else {
      filters.value[key] = value == 'true' ? true : value ==  'false' ? false : value 
    }
  })
}

onMounted(async () => {
  await api.getComplexEntrances(route.params.id, ["rooms"]).then((response) => {
    const updatedEntrances = response.data.sort((a, b) =>
      a.position > b.position ? 1 : -1
    );

    updatedEntrances.forEach(
      (entrance) =>
        (entrance.floors = entrance.floors.sort((a, b) =>
          a.position > b.position ? 1 : -1
        ))
    );

    updatedEntrances.forEach((entrance) =>
      entrance.floors.forEach((floor) =>
        floor.rooms.forEach((room) => {
          room.visible = false;
        })
      )
    );

    entrances.value = updatedEntrances;
  }).finally(() => apartmentsLoader.value = false);
  await nextTick()
  parseQueryFilters()
  filterChange()

  eventBus.$on('clear-filters', clearFilters)
});

onUnmounted(() => {
  eventBus.$off('clear-filters', clearFilters)
})
</script>
<style scoped lang="scss">

.homePage {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
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