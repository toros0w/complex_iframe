<template>
  <div class="filters viewHome__filters flex flex-col w-max bg-white">
    <div>
      <div class="filters__content flex flex-row flex-wrap items-stretch gap-x-[80px] xl:gap-x-[50px] xl:gap-y-[20px] w-full pt-3.5">
        <div class="filters__square flex flex-col h-full" v-if="roomTypesOptions.length">
          <label class="text-grey-900 mb-2">Тип объекта</label>
          <MultiSelect
            v-model="filters.selectedTypes"
            :options="roomTypesOptions"
            filter
            emptyFilterMessage="Ничего не найдено"
            optionValue="key"
            optionLabel="name"
            placeholder="Выберите тип"
            selectedItemsLabel="Выбрано: {0}"
            :maxSelectedLabels="1"
            class="w-full md:w-20rem"
            :pt="multiSelectStyle"
          />
        </div>

        <div
          v-if="showTypeRooms"
          class="filters__roms flex flex-col justify-start items-start h-full w-max"
        >
          <label class="text-grey-900 mb-2">Количество комнат</label>
          <div class="btns flex flex-row items-stretch grow h-full">
            <SelectButton
              v-model="filters.rooms"
              :options="typeRooms"
              option-label="name"
              option-value="value"
              multiple
              aria-labelledby="multiple"
              :pt="{
                button: {
                  class: ['2xl:!h-[37px] xl:!h-[37px] '],
                },
              }"
            ></SelectButton>
          </div>
        </div>
        <div class="filters__square flex flex-col h-full" v-if="decorations.length">
          <label class="text-grey-900 mb-2">Тип отделки</label>
          <MultiSelect
            v-model="filters.selectedDecorations"
            :options="decorations"
            filter
            emptyFilterMessage="Ничего не найдено"
            optionValue="code"
            optionLabel="name"
            placeholder="Выберите отделку"
            selectedItemsLabel="Выбрано: {0}"
            :maxSelectedLabels="1"
            class="w-full md:w-20rem"
            :pt="multiSelectStyle"
          />
        </div>
        <div class="filters__square flex flex-col h-full" v-if="windowsPlacements.length">
          <label class="text-grey-900 mb-2">Куда выходят окна</label>
          <MultiSelect
            v-model="filters.selectedWindowsPlacements"
            :options="windowsPlacements"
            filter
            emptyFilterMessage="Ничего не найдено"
            optionValue="id"
            optionLabel="name"
            placeholder=""
            selectedItemsLabel="Выбрано: {0}"
            :maxSelectedLabels="1"
            class="w-full md:w-20rem"
            :pt="multiSelectStyle"
          />
        </div>

        <div class="filters__square flex flex-col h-full">
          <label class="text-grey-900 mb-2">Номер помещения</label>
          <div class="inputs grid grid-cols-2 gap-x-2 grow">
            <InputText
              type="text"
              v-model.number="filters.number"
              placeholder=""
              :pt="{
                root: {
                  class: [
                    'h-full mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[150px]',
                  ],
                },
              }"
            />
          </div>
        </div>
      </div>
      <div class="filters__content flex flex-row flex-wrap items-stretch gap-x-[80px] xl:gap-x-[50px] xl:gap-y-[20px] w-full pt-3.5">
        <div class="filters__price max-w-[400px] flex flex-col h-full">
          <label class="text-grey-900 mb-2">Стоимость, руб.</label>
          <div class="inputs grid grid-cols-2 gap-x-2 grow h-full" style="display: flex; flex-direction: column; align-items: start; gap: 0.5rem;">
            <div style="display: flex; column-gap: .5rem;">
              <InputText
              type="text"
              v-model.number="filters.price.min"
              :placeholder="`от ${filters.limit?.total.min ? filters.limit?.total.min : ''}`"
              :pt="{
                root: {
                  class: [
                    'h-full mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
            <InputText
              type="text"
              v-model.number="filters.price.max"
              :placeholder="`до ${filters.limit?.total.max ? filters.limit?.total.max : ''}`"
              :pt="{
                root: {
                  class: [
                    'mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
            </div>
            <div style="display: flex; align-items:center; gap: 5px">
              <div style="text-wrap: nowrap;" class="text-grey-900">Цена за кв.м.</div>
              <InputSwitch v-model="filters.useSquarePrice" />
            </div>
          </div>
        </div>
        <div class="filters__square flex flex-col h-full">
          <label class="text-grey-900 mb-2">Площадь, м2</label>
          <div class="inputs grid grid-cols-2 gap-x-2 grow">
            <InputText
              type="text"
              v-model.number="filters.square.min"
              :placeholder="`от ${filters.limit?.area.min ? filters.limit?.area.min : ''}`"
              :pt="{
                root: {
                  class: [
                    'h-full mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
            <InputText
              type="text"
              v-model.number="filters.square.max"
              :placeholder="`до ${filters.limit?.area.max ? filters.limit?.area.max : ''}`"
              :pt="{
                root: {
                  class: [
                    'mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
          </div>
        </div>
        <div class="filters__square flex flex-col h-full">
          <label class="text-grey-900 mb-2">Площадь кухни, м2</label>
          <div class="inputs grid grid-cols-2 gap-x-2 grow">
            <InputText
              type="text"
              v-model.number="filters.squareKitchen.min"
              :placeholder="`от ${filters.limit?.kitchen_area.min ? filters.limit?.kitchen_area.min : ''}`"
              :pt="{
                root: {
                  class: [
                    'h-full mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
            <InputText
              type="text"
              v-model.number="filters.squareKitchen.max"
              :placeholder="`до ${filters.limit?.kitchen_area.max ? filters.limit?.kitchen_area.max : ''}`"
              :pt="{
                root: {
                  class: [
                    'mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
          </div>
        </div>
        <div class="filters__square flex flex-col h-full">
          <label class="text-grey-900 mb-2">Этажность</label>
          <div class="inputs grid grid-cols-2 gap-x-2 grow">
            <InputText
              type="text"
              v-model.number="filters.floor.from"
              placeholder="от"
              :pt="{
                root: {
                  class: [
                    'h-full mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
            <InputText
              type="text"
              v-model.number="filters.floor.to"
              placeholder="до"
              :pt="{
                root: {
                  class: [
                    'mt-0.5 placeholder:text-sm placeholder:text-grey-900',
                    '2xl:h-full !py-2 xl:h-[37px] xl:!mt-0 max-w-[146px]',
                  ],
                },
              }"
            />
          </div>
        </div>
      </div>
      <div class="filters__content flex flex-row flex-wrap items-stretch gap-x-[80px] xl:gap-x-[50px] xl:gap-y-[20px] w-full pt-3.5">
        <div class="filters__square flex flex-col h-full">
          <label class="text-grey-900 mb-2">Площадка</label>
          <MultiSelect
              v-model="filters.adsTargets"
              :options="adsTargets"
              filter
              emptyFilterMessage="Ничего не найдено"
              optionValue="value"
              optionLabel="name"
              placeholder="Выберите площадку"
              selectedItemsLabel="Выбрано: {0}"
              :maxSelectedLabels="1"
              class="w-full md:w-20rem"
              :pt="multiSelectStyle"
          />
        </div>
        <div class="filters__square flex flex-col h-full">
          <label class="text-grey-900 mb-2">Рекламный статус</label>
          <MultiSelect
              v-model="filters.adsStates"
              :options="adsStates"
              filter
              emptyFilterMessage="Ничего не найдено"
              optionValue="value"
              optionLabel="name"
              placeholder="Выберите статус"
              selectedItemsLabel="Выбрано: {0}"
              :maxSelectedLabels="1"
              class="w-full md:w-20rem"
              :pt="multiSelectStyle"
          />
        </div>
      </div>
      </div>
    <div class="head__foundText text-black mt-7.5">
      Найдено {{filteredCount}} помещений.
    </div>
  </div>
</template>

<script setup>
import { useFieldsStore } from "@/app/store/fields";
import eventBus from "@/eventBus";
import api from "@/shared/api";
import { room_types, room_types_which_has_rooms, typeRooms, adsTargets, adsStates } from "@/shared/utils/util";
import InputSwitch from "primevue/inputswitch";
import MultiSelect from "primevue/multiselect";
import SelectButton from "primevue/selectbutton";
import { onUpdated } from "vue";
import { computed, onMounted, ref, toRef, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const fieldsStore = useFieldsStore()

const decorations = computed(() => fieldsStore.decorations?.filter((dec) => filters.value.limit?.decoration_types?.includes(dec.code)))
const windowsPlacements = computed(() => fieldsStore.windowsPlacements?.filter((w) => filters.value.limit?.window_placements?.includes(w.id)))

//import { IFilters } from "./types";
//import { IRoom } from "./types";

const route = useRoute() 
const router = useRouter()
const emits = defineEmits(
  ["update:filters"]
);

const props = defineProps(['filters', 'filteredCount'])
const {filters} = toRefs(props);

const isEmpty = ref(true);

const roomTypesOptions = computed(() => Object.entries(room_types).map(([room_key, room_value]) => ({
  key: room_key,
  name: room_value
})).filter((item) => filters.value.limit?.room_types.includes(item.key)))

const multiSelectStyle = {
  root: {
    class: [
      '!rounded !border !border-grey-400 !p-3 !h-max',
    ],
  },
  input: {
    class: [
      '!flex !flex-row !items-center !p-0 !text-sm !leading-none !text-grey-900 !mr-3',
    ],
  },
  wrapper: {
    class: ['!p-0'],
  },
  item: {
    class: ['!text-sm'],
  },
  label: {
    class: ['!p-0']
  },
  header: {
    class: ['custom-header']
  }
}

watch(
  filters,
  (newValue) => {
    const updatedFilters = newValue ? { ...newValue } : null

    if (updatedFilters) {
      const queryParams = {
        rooms: updatedFilters.rooms,
        selectedTypes: updatedFilters.selectedTypes,
        price_min: updatedFilters.price.min || updatedFilters.price.from,
        price_max: updatedFilters.price.max || updatedFilters.price.to,
        square_min: updatedFilters.square.min || updatedFilters.square.from,
        square_max: updatedFilters.square.max || updatedFilters.square.to,
        squareKitchen_min: updatedFilters.squareKitchen.min,
        squareKitchen_max: updatedFilters.squareKitchen.max,
        floor_from: updatedFilters.floor.from,
        floor_to: updatedFilters.floor.to,
        hiddenPrice: updatedFilters.hiddenPrice,
        onlyFree: updatedFilters.onlyFree,
        useSquarePrice: updatedFilters.useSquarePrice,
        selectedDecorations: updatedFilters.selectedDecorations,
        selectedWindowsPlacements: updatedFilters.selectedWindowsPlacements,
        number: updatedFilters.number,
        adsTargets: updatedFilters.adsTargets,
        adsStates: updatedFilters.adsStates
      }
  
      router.replace({query: queryParams})
    }
  },
  { deep: true }
);

const parseQueryFilters = () => {
  Object.entries(route.query).forEach(([key, value]) => {
    const skipKeys = ['period','selectedMetros', 'address']
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

    if (key == 'adsTargets' && typeof value == 'string' ) {
      value = [value];
    }

    if (key == 'adsTargets' && Array.isArray(value)) {
      value = value.map((num) => num);
    }

    if (key == 'adsStates' && typeof value == 'string' ) {
      value = [value];
    }

    if (key == 'adsStates' && Array.isArray(value)) {
      value = value.map((num) => num);
    }

    if (key == 'selectedWindowsPlacements' && Array.isArray(value)) {
      value = value.map((num) => parseInt(num));
    }

    if (key == 'selectedWindowsPlacements' && typeof value == 'string' ) {
      value = [parseInt(value)];
    }

    if (key == 'selectedTypes' && Array.isArray(value)) {
      value = value.map((num) => num);
    }

    if (key == 'selectedTypes' && typeof value == 'string' ) {
      value = [value];
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
  parseQueryFilters()
})

const showTypeRooms = computed(() => {
  if (Array.isArray(filters.value.selectedTypes)) {
    return filters.value.selectedTypes.some((selectedType) => room_types_which_has_rooms.includes(selectedType));
  }

  if (typeof filters.value.selectedTypes === 'string') {
    return room_types_which_has_rooms.includes(filters.value.selectedTypes)
  }

  return false
})

watch(showTypeRooms, (newValue) => {
  if (!newValue) {
    filters.value.rooms = []
  }
})
</script>

<style scoped lang="scss">
.filters {
  background-color: #ffffff;
  position: relative;
  &.filters--facades {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding-top: 126px;
    padding-bottom: 53px;
    opacity: 0;
    visibility: hidden;
    transition: 0.5s all ease-in-out;

    &.open {
      opacity: 1;
      visibility: visible;
      transition: 0.5s all ease-in-out;
    }
  }

  .inputs {
    display: flex;
    align-items: center;
  }

  .head__foundText {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

}

@media screen and (max-width: 1610px) {
  .filters .p-inputtext {
    max-width: 100px !important
  }
}
</style>

<style>
  .viewHome__filters .p-inputwrapper {
    border-radius: 6px !important;
    justify-content: space-between !important;
    padding: 8px !important;
    width: 300px !important;
    height: 36px !important;
  }
  .viewHome__filters .p-placeholder, .viewHome__filters .p-multiselect-label {
    font-weight: 500;
    font-size: 16px;
    line-height: 19.2px;
    color: #757575;
  }

  .viewHome__filters .p-inputswitch.p-focus .p-inputswitch-slider {
    box-shadow: unset !important;
  }

  .custom-header {
    display: flex !important;
  
    .p-checkbox-box, input {
      box-shadow: unset !important;
    }
  
    input {
      padding: 5px !important;
    }
  }
</style>
