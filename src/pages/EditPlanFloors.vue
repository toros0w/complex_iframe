<template>
  <div class="editPlanFloors bg-white">
    <div class="editPlanFloors__title mb-7.5">
      Редактирование планировки этажа
    </div>
    <Message severity="info" :closable="false">
      <template #messageicon>
        <svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-[22px] h-auto mr-2.5"
        >
          <path
            d="M9.00161 8.75C8.8027 8.75 8.61193 8.82902 8.47128 8.96967C8.33063 9.11032 8.25161 9.30109 8.25161 9.5V11.75C8.25161 11.9489 8.33063 12.1397 8.47128 12.2803C8.61193 12.421 8.8027 12.5 9.00161 12.5C9.20052 12.5 9.39129 12.421 9.53194 12.2803C9.67259 12.1397 9.75161 11.9489 9.75161 11.75V9.5C9.75161 9.30109 9.67259 9.11032 9.53194 8.96967C9.39129 8.82902 9.20052 8.75 9.00161 8.75ZM9.00161 6.5C8.85327 6.5 8.70827 6.54399 8.58493 6.6264C8.46159 6.70881 8.36546 6.82594 8.3087 6.96299C8.25193 7.10003 8.23708 7.25083 8.26602 7.39632C8.29496 7.5418 8.36639 7.67544 8.47128 7.78033C8.57617 7.88522 8.70981 7.95665 8.85529 7.98559C9.00078 8.01453 9.15158 7.99968 9.28862 7.94291C9.42567 7.88614 9.5428 7.79001 9.62521 7.66668C9.70762 7.54334 9.75161 7.39834 9.75161 7.25C9.75161 7.05109 9.67259 6.86032 9.53194 6.71967C9.39129 6.57902 9.20052 6.5 9.00161 6.5ZM9.00161 2C8.01669 2 7.04142 2.19399 6.13148 2.5709C5.22154 2.94781 4.39475 3.50026 3.69831 4.1967C2.29178 5.60322 1.50161 7.51088 1.50161 9.5C1.49505 11.2319 2.0947 12.9114 3.19661 14.2475L1.69661 15.7475C1.59254 15.853 1.52204 15.9869 1.49401 16.1324C1.46598 16.2779 1.48167 16.4284 1.53911 16.565C1.6014 16.6999 1.70239 16.8133 1.82924 16.8908C1.9561 16.9682 2.10311 17.0063 2.25161 17H9.00161C10.9907 17 12.8984 16.2098 14.3049 14.8033C15.7114 13.3968 16.5016 11.4891 16.5016 9.5C16.5016 7.51088 15.7114 5.60322 14.3049 4.1967C12.8984 2.79018 10.9907 2 9.00161 2ZM9.00161 15.5H4.05911L4.75661 14.8025C4.82747 14.733 4.88385 14.6502 4.92247 14.5588C4.9611 14.4674 4.9812 14.3692 4.98161 14.27C4.97879 14.0722 4.89792 13.8835 4.75661 13.745C3.77455 12.764 3.16299 11.4729 3.02613 10.0916C2.88926 8.71029 3.23557 7.32425 4.00603 6.16964C4.77649 5.01503 5.92345 4.16327 7.25149 3.75948C8.57954 3.35569 10.0065 3.42485 11.2893 3.95519C12.572 4.48552 13.6312 5.44421 14.2864 6.66792C14.9416 7.89163 15.1523 9.30466 14.8825 10.6663C14.6126 12.0279 13.8791 13.2538 12.8068 14.1352C11.7344 15.0166 10.3897 15.4989 9.00161 15.5Z"
            fill="#3A8EFA"
          />
        </svg>
      </template>
      <template #default>
        <p
          class="2xl:max-w-[1300px] xl:max-w-[990px] 2xl:text-base xl:text-sm"
        >
          Отметьте на поэтажном плане границы помещения. Кликните кнопкой мыши
          на размеченную область и свяжите её с соответствующей планировкой.
          Разметьте таким образом каждое помещение на плане. Если возникнут
          вопросы обратитесь к инструкции. Быстрые кнопки: Левая кнопка мыши =
          поставить точку, Правая кнопка мыши = удалить точку
        </p>
      </template>
    </Message>
    <MarkupFloor
      v-if="floorPlan"
      :floorPlan="floorPlan"
      :floorsOptions="floorsOptions"
      :entrancesOptions="entrancesOptions"
      :dataForm="dataForm"
      class="mt-7.5"
    />
  </div>
</template>

<script setup>
import MarkupFloor from "@/widgets/editPlanFloor/markupFloor.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import debounce from 'lodash.debounce'
import bus from "@/eventBus";
import api from "@/shared/api";
import { useHouseStore } from "@/app/store/house";

const entranceList = ref([]);
const floorPlan = ref(null);
const houseStore = useHouseStore()

const route = useRoute()

const getEntranceList = () => {
  return api.getHouseEntrances(route.params.house_id, ['rooms'])
    .then((response) => {
      entranceList.value = response.data
    })
    .catch((error) => console.log(error));
}

const getFloorPlan = () => {
  return api.getFloorPlan(route.params.floor_plan_id)
    .then((response) => {
      floorPlan.value = response.data

    })
    .catch((error) => console.log(error)); 
}

const INITIAL_DATA_FORM = {
  light_angle: 0,
  has_light_angle: true,
  floor_positions: [],
  is_use_all_entrances: false,
  entrances: [],
  image: null,
};

const dataForm = ref({...INITIAL_DATA_FORM})

const floorsOptions = computed(() => {
  const positions = {}

  if (entranceList.value.length) {
    entranceList.value.forEach(  (entrance) => {
      if (dataForm.value.entrances?.find((formEntracnce) => formEntracnce.id == entrance.id) || dataForm.value.is_use_all_entrances) {
        entrance.floors.forEach(floor => {
          if (positions[`${floor.position}`]) {
            positions[`${floor.position}`].push(floor.id)
          } else {
            positions[`${floor.position}`] = [floor.id]
          }
        });
      }
    })
  }

  return Object.entries(positions).map(([key, value]) => ({ name: key, value }))
});

const entrancesOptions = computed(() => {
  return entranceList.value.map((entrance) => ({
    name: entrance.name, value: {id: entrance.id, position: entrance.position}
  }))
})

const debouncedWatch = debounce(async (value) => {
  const floor_ids = dataForm.value.floor_positions?.reduce((acc, curr) => {
    Array.from(curr).forEach((value) => {
      acc = [...acc, value]
    })

    return acc
  }, [])
  
  await api.updateFloorPlans(
    [floorPlan.value.id],
    floor_ids, 
    value
  ).then((response) => {
    if (response.data && Array.isArray(response.data)) {
      floorPlan.value = response.data[0]
    }
  }).catch(error => console.log(error));
}, 300)

watch(() => dataForm.value, debouncedWatch, { deep: true })
watch(() => dataForm.value.is_use_all_entrances, (updatedIsUseAll, oldValue) => {
  if (updatedIsUseAll != oldValue && !updatedIsUseAll && entranceList.value.length) {
    dataForm.value.floor_positions = []
  }
})
watch(() => dataForm.value.entrances, (value, oldValue) => {
  if (value?.length !== oldValue?.length && entranceList.value.length) {
    dataForm.value.floor_positions = []
  }
})

const figureDeleted = (figure_id) => {
  api.deleteFloorPlanFigure(figure_id)
    .then((response) => {
      if (response.data) {
        const index = floorPlan.value.figures.findIndex((figure) => figure.id === figure_id)

        floorPlan.value.figures.splice(index, 1)
      }
    })
    .catch(error => console.log(error));
}

const figureAdded = (figure) => {
  return api.addFigureToFloorPlan(floorPlan.value.id, figure)
    .then((response) => {
      if (response.data) {
        floorPlan.value.figures.push(response.data)
      }
    })
    .catch(error => console.log(error));
}

const figurePlanSelected = ({room_plan_id, figure_id, background}) => {
  api.updateFigure(figure_id, { room_plan_id, background })
    .then((response) => {
      if (response.data) {
        const figure = floorPlan.value.figures.find((figure) => figure.id === figure_id)

        Object.keys(response.data).forEach((key) => {
          figure[key] = response.data[key]
        })
      }
    }).catch(error => console.log(error));
}


onMounted(async () => {
  await getFloorPlan()
  await getEntranceList()

  houseStore.get_house(route.params.house_id)

  bus.$on('canvas:figure-added', figureAdded)

  bus.$on('floor-plan:figure-deleted', figureDeleted)

  bus.$on('floor-plan:figure-plan-selected', figurePlanSelected)
})

onBeforeUnmount(() => {
  bus.$off('canvas:figure-added', figureAdded)
  bus.$off('floor-plan:figure-deleted', figureDeleted)
  bus.$off('floor-plan:figure-plan-selected', figurePlanSelected)
})

</script>

<style scoped lang="scss">
.editPlanFloors {
  width: 100%;
  height: 100%;
  padding: 30px;
  overflow-y: scroll;

  &__title {
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
