<template>
  <FormLayout
    v-if="isOpen"
    class="addRoom open"
    :title="!isEditMode ? 'Создание помещения' : 'Редактирование помещения'"
    @closeModel="$emit('closeModel')"
  >
    <template v-slot:default>
      <form class="form addRoom__form">
        <div class="form__item">
          <label for="nameHome">Тип помещения <span>*</span></label>
          <Dropdown
            v-model="room.type"
            :options="room_types_options"
            optionLabel="name"
            optionValue="code"
          >
            <template #dropdownicon>
              <CustomDropdownIcon />
            </template>
          </Dropdown>
        </div>
        <Message
          severity="info"
          :closable="false"
          :pt="{ root: { class: ['!bg-blue-100 !border-blue-500 !m-0'] } }"
        >
          <template #messageicon>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mr-3.5"
            >
              <path
                d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74966 11.4489 9.74966 11.25V9C9.74966 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.29301 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74966 6.89834 9.74966 6.75C9.74966 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57759 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
                fill="#3A8EFA"
              />
            </svg>
          </template>
          <template #default>
            При изменении типа помещения, значения дополнительных полей будут
            утеряны.
          </template>
        </Message>
        <div
          style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          "
        >
          <div class="form__item wrapped">
            <label for="room-number"><p :class="errors.number ? 'error-color' : ''" >Номер помещения <span>*</span></p></label>
            <InputText
              v-model="room.number"
              required
              type="text"
              id="room-number"
              @input="errors.number = null"
              :class="errors.number ? 'errored-input' : ''"
              placeholder="Номер помещения"
            />
            <span v-if="errors.number && errors.number.text" class="error-msg error-color">{{errors.number.text}}</span>
          </div>
          <div class="form__item wrapped" v-if="showBlocks.rooms_count">
            <label for="rooms-count"><p :class="errors.rooms_count ? 'error-color' : ''" >Кол-во комнат <span>*</span></p></label>
            <InputNumber
              v-model="room.rooms_count"
              required
              min="0"
              @input="errors.rooms_count = null"
              id="rooms-count"
              :class="errors.rooms_count ? 'errored-input' : ''"
              placeholder="Кол-во комнат"
            />
          </div>
          <div class="form__item wrapped">
            <label for="area"><p :class="errors.area ? 'error-color' : ''" >Площадь, м2 <span>*</span></p></label>
            <InputNumber
              v-model="room.area"
              required
              mode="decimal"
              :minFractionDigits="2"
              min="0"
              id="area"
              @input="errors.area = null"
              :class="errors.area ? 'errored-input' : ''"
              placeholder="Площадь, м2"
            />
          </div>
          <div class="form__item wrapped">
            <label for="complex_status_id"><p :class="errors.complex_status_id ? 'error-color' : ''" >Статус <span>*</span></p></label>
            <Dropdown
              v-if="fieldsStore.complex_status.length"
              v-model="room.complex_status_id"
              :options="statusOptions"
              @change="errors.complex_status_id = null"
              optionLabel="label"
              optionValue="id"
              :class="errors.complex_status_id ? 'errored-input' : ''"
            >
              <template #value="slotProps" v-if="room?.complex_status_info?.status_name">
                {{ getStatusName(slotProps.value) }}
              </template>
              <template #dropdownicon>
                <CustomDropdownIcon />
              </template>
            </Dropdown>
          </div>
          <div class="form__item wrapped">
            <label for="total_amount"><p :class="errors.total_amount ? 'error-color' : ''" >Полная цена <span>*</span></p></label>
            <InputNumber
              v-model="room.total_amount"
              type="number"
              mode="decimal"
              :minFractionDigits="2"
              @input="errors.total_amount = null"
              :class="errors.total_amount ? 'errored-input' : ''"
              min="0"
              id="total_amount"
              placeholder="Полная цена"
            />
          </div>
          <div class="form__item wrapped">
            <label for="layout_code">Код планировки</label>
            <InputNumber
              v-model="room.layout_code"
              required
              type="number"
              min="0"
              id="layout_code"
              placeholder="Код планировки"
            />
          </div>
        </div>

        <Accordion :multiple="true" :activeIndex="0">
          <AccordionTab header="Способы оплаты">
            <div class="card flex flex-wrap justify-between">
              <div class="flex align-items-center" v-for="(value, key) in payment_types" :key="key">
                <Checkbox
                  v-model="payment_types_selected"
                  :inputId="key"
                  name="payment_types"
                  :value="key"
                />
                <label :for="key" class="ml-2"> {{value}} </label>
              </div>
            </div>
          </AccordionTab>
          <AccordionTab header="Особенности планировки" v-if="showBlocks.layout_feature">
            <div
              class="flex flex-wrap justify-between"
              style="display: grid; grid-template-columns: repeat(3, 1fr);gap: 16px;"
            >
              <div
                v-for="future in layout_futures"
                :key="future.code"
                class="flex"
                style="align-items: center"
              >
                <RadioButton
                  v-model="room.layout_feature"
                  :inputId="future.code"
                  name="dynamic"
                  :value="future.code"
                />
                <label :for="future.code" class="ml-2">{{ future.name }}</label>
              </div>
            </div>
          </AccordionTab>
          <AccordionTab header="Основные характеристики">
            <div class="form__item wrapped">
              <label for="on_site_number">Номер на площадке</label>
              <InputText
                v-model="room.on_site_number"
                type="text"
                id="on_site_number"
                placeholder="Номер на площадке"
              />
            </div>
            <div class="form__item wrapped">
              <label for="description">Описание</label>
              <Editor
                id="description"
                ref="editor"
                placeholder="Введите описание..."
                @update:modelValue="(e) => room.description = e"
                editorStyle="height: 320px"
              />
            </div>
            <div class="flex gap-4">
              <div class="form__item wrapped" v-if="showBlocks.windows_placement_id">
                <label for="windows_placement_id">Куда выходят окна</label>
                <Dropdown
                  id="decoration"
                  v-model="room.windows_placement_id"
                  :filter="true"
                  emptyFilterMessage="Ничего не найдено"
                  :options="fieldsStore.windowsPlacements"
                  optionLabel="name"
                  optionValue="id"
                  emptyMessage="&nbsp"
                  class="w-full md:w-14rem"
                />
              </div>
              <div class="form__item wrapped" v-if="showBlocks.decoration">
                <label for="decoration">Отделка</label>
                <Dropdown
                  id="decoration"
                  v-model="room.decoration_id"
                  :filter="true"
                  emptyFilterMessage="Ничего не найдено"
                  :options="fieldsStore.decorations"
                  optionLabel="name"
                  optionValue="code"
                  emptyMessage="&nbsp"
                  class="w-full md:w-14rem"
                />
              </div>
            </div>
            <Accordion :multiple="true" :activeIndex="0">
              <AccordionTab header="Площадь" v-if="showBlocks.areas">
                <div class="flex gap-4">
                  <div class="form__item wrapped">
                    <label for="estimated_area">Расчетная площадь, м2</label>
                    <InputNumber
                      v-model="room.estimated_area"
                      style="width: 100%"
                      mode="decimal"
                      :minFractionDigits="2"
                      id="estimated_area"
                    />
                  </div>
                  <div class="form__item wrapped">
                    <label for="living_area">Жилая площадь, м2</label>
                    <InputNumber
                      v-model="room.living_area"
                      style="width: 100%"
                      mode="decimal"
                      :minFractionDigits="2"
                      id="living_area"
                    />
                  </div>
                  <div class="form__item wrapped">
                    <label for="kitchen_area">Площадь кухни, м2</label>
                    <InputNumber
                      v-model="room.kitchen_area"
                      style="width: 100%"
                      mode="decimal"
                      :minFractionDigits="2"
                      id="kitchen_area"
                    />
                  </div>
                </div>
              </AccordionTab>
              <AccordionTab header="Количество" v-if="showBlocks.counts">
                <div class="flex flex-wrap gap-4">
                  <div style="width: 250px" class="form__item wrapped">
                    <label for="loggias_count">Кол-во лоджий</label>
                    <InputNumber v-model="room.loggias_count" type="number" min="0" id="loggias_count" />
                  </div>
                  <div style="width: 250px" class="form__item wrapped">
                    <label for="balconies_count">Кол-во балконов</label>
                    <InputNumber v-model="room.balconies_count" type="number" min="0" id="balconies_count" />
                  </div>
                  <div style="width: 250px" class="form__item wrapped">
                    <label for="combined_bathrooms_count"
                      >Кол-во совмещенных санузлов</label
                    >
                    <InputNumber
                      v-model="room.combined_bathrooms_count"
                      type="number"
                      min="0"
                      id="combined_bathrooms_count"
                    />
                  </div>
                  <div style="width: 250px" class="form__item wrapped">
                    <label for="seperated_bathrooms_count"
                      >Кол-во раздельных санузлов</label
                    >
                    <InputNumber
                      v-model="room.seperated_bathrooms_count"
                      type="number"
                      min="0"
                      id="seperated_bathrooms_count"
                    />
                  </div>
                </div>
              </AccordionTab>
            </Accordion>
          </AccordionTab>
          <AccordionTab header="Дополнительные характеристики">
            <div class="flex flex-wrap gap-4">
              <div style="width: 225px" class="form__item wrapped">
                <label for="bti_room_number">Номер помещения для БТИ</label>
                <InputText
                  v-model="room.bti_room_number"
                  style="width: 100%"
                  type="text"
                  id="bti_room_number"
                />
              </div>
              <div style="width: 225px" class="form__item wrapped">
                <label for="bti_total_area">Общая площадь по БТИ</label>
                <InputNumber
                  style="width: 100%"
                  mode="decimal"
                  :minFractionDigits="2"
                  v-model="room.bti_total_area"
                  type="number"
                  min="0"
                  id="bti_total_area"
                />
              </div>
              <div style="width: 225px" class="form__item wrapped" v-if="showBlocks.area_without_balcony">
                <label for="area_without_balcony">Площадь без балкона</label>
                <InputNumber
                  style="width: 100%"
                  mode="decimal"
                  :minFractionDigits="2"
                  v-model="room.area_without_balcony"
                  type="number"
                  min="0"
                  id="area_without_balcony"
                />
              </div>
              <div style="width: 225px" class="form__item wrapped">
                <label for="hallway_area">Площадь прихожей, м2</label>
                <InputNumber
                  style="width: 100%"
                  v-model="room.hallway_area"
                  :minFractionDigits="2"
                  type="number"
                  mode="decimal"
                  min="0"
                  id="hallway_area"
                />
              </div>
              <div style="width: 225px" class="form__item wrapped">
                <label for="ceiling_height">Высота потолков</label>
                <InputNumber
                  :minFractionDigits="2"
                  fluid
                  style="width: 100%"
                  v-model="room.ceiling_height"
                  min="0"
                  id="ceiling_height"
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </form>
    </template>
    <template v-slot:formBtns>
      <MyButton v-if="isEditMode" :theme="'green'" class="submit mt-7.5" @click="save('update')"
        >Сохранить</MyButton
      >
      <MyButton v-else :theme="'green'" class="submit mt-7.5" @click="save('save')"
        >Добавить</MyButton
      >
    </template>
  </FormLayout>
</template>

<script setup>
import FormLayout from "@/shared/UI/modalLayout.vue";
import MyButton from "@/shared/UI/MyButton.vue";
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import CustomDropdownIcon from "./inputs/CustomDropdownIcon.vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import Editor from "primevue/editor";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import { room_types } from "@/shared/utils/util";
import api from "@/shared/api";
import { useFieldsStore } from "@/app/store/fields";

const emits = defineEmits(["closeModel"]);

const props = defineProps({
  isOpen: Boolean,
  floor: {
    type: Object,
  },
  room: {
    type: Object
  }
});

const fieldsStore = useFieldsStore()

const showBlocks = ref({
  layout_feature: true,
  rooms_count: true,
  windows_placement_id: true,
  decoration: true,
  areas: true,
  counts: true,
  area_without_balcony: true
})
const room_types_options = ref(Object.entries(room_types).map(([key, value]) => ({ code: key, name: value })));
const payment_types_selected = ref();

const statusOptions = computed(() => {
  return fieldsStore.complex_status.map((status) => ({ label: status.name, id: status.id }))
  
})

const editor = ref(null)

const layout_futures = [
  { code: "none_of_the_above", name: "Ничего из перечисленного" },
  { code: "studio", name: "Студия" },
  { code: "european_layout", name: "Европланировка" },
  { code: "available", name: "Свободная" },
];

const payment_types = {
  FULL: "100% оплата",
  INSTALLMENT: "Рассрочка",
  MORTGAGE: "Ипотека",
};

const INITIAL_ROOM = {
  id: 0,
  floor_id: 0,
  type: "apartment",
  number: '',
  rooms_count: null,
  area: null,
  total_amount: 0,
  layout_code: null,
  payment_types: '',
  layout_feature: '',
  on_site_number: null,
  windows_placement_id: '',
  complex_status_id: "",
  description: "",
  estimated_area: null,
  living_area: null,
  kitchen_area: null,
  loggias_count: null,
  balconies_count: null,
  combined_bathrooms_count: null,
  seperated_bathrooms_count: null,
  bti_room_number: '',
  bti_total_area: null,
  area_without_balcony: null,
  hallway_area: null,
  decoration_id: null,
}

const hiddenForType = {
  parking_space: ['rooms_count', 'layout_feature', 'windows_placement_id', 'decoration', 'areas', 'counts', 'area_without_balcony'],
  apartment: [],
  apartments: [],
  office: ['rooms_count', 'layout_feature', 'windows_placement_id','areas', 'counts', 'area_without_balcony'],
  storage_room: ['rooms_count', 'layout_feature', 'windows_placement_id','areas', 'decoration', 'counts', 'area_without_balcony'],
  warehouse: ['rooms_count', 'layout_feature', 'windows_placement_id','areas', 'decoration', 'counts', 'area_without_balcony'],
  retail_space: ['rooms_count', 'layout_feature', 'windows_placement_id','areas', 'counts', 'area_without_balcony'],
  commercial_space: ['rooms_count', 'layout_feature', 'windows_placement_id','areas', 'counts', 'area_without_balcony'],
  townhouse: [],
  villa: [],
  penthouse: [],
  duplex: [],
  cottage: []
}

const roomAdditionalFields = ref([
'floor', 
'entrance_name', 
'entrance_id', 
'house_name', 
'complex_name', 
'rooms', 
'plan_url', 
'house_id', 
'requisition_id', 
'house_fenced_area' ,
'house_kinder_garten', 
'house_parking', 
'house_play_ground', 
'house_school', 
'house_security', 
'house_sports_ground',
'visible',
'formatFile',
'status_id',
'status_name',
'status_color',
'status_type',
'has_light_angle',
'light_angle',
'add_to_domclick_feed',
'ads_domclick_error',
'ads_domclick_url',
'add_to_avito_feed',
'ads_avito_error',
'ads_avito_url',
'add_to_cian_feed',
'ads_cian_error',
'ads_cian_url',
'add_to_yandex_feed',
'ads_yandex_error',
'ads_yandex_url',
'can_change_queue',
'complex_status_info',
'requisitions',
'reservations',
'figures',
'advStat'
])

const errors = ref({})
// const decoration = ref("");

const room = ref({...INITIAL_ROOM});

function clear() {
  room.value = {...INITIAL_ROOM}
}

watch(payment_types_selected, (value) => {
  room.value.payment_types = JSON.stringify(value);
})

watch(() => props.floor.id, (id)=> {
  room.value.floor_id = id
})

watch(() => props.room, (propRoom)=> {
  if (propRoom.id) {
    room.value = {...propRoom}
  } else {
    clear()
  }
})

watch(() => editor.value, () => {
  setTimeout(() => {
    if (!editor.value || !editor.value.quill) return
    editor.value.quill.root.innerHTML = props.room.description ? props.room.description : '' 
  }, 1000)
})

watch(() => room.value.type, (value) => {
  if (Array.isArray(hiddenForType[value])) {
    Object.entries(showBlocks.value).forEach(([key, bool]) => {
      showBlocks.value[key] = !hiddenForType[value].includes(key)
    })
  }
})

function closeModel(room, action) {
  emits("closeModel", room, action);
  clear();
}


function removeKeys(obj, keysToRemove) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
  );
}

async function save(action) {
  room.value.total_amount = room.value.total_amount || 0

  const data = action == 'save' ? { ...room.value, position: props.floor.rooms.length + 1 } : room.value;
  
  api[action + 'Room'](removeKeys(data, roomAdditionalFields.value))
    .then((response) => {
      var res = response.data;
      
      props.room.complex_status_info = res.complex_status_info
      props.room.reservations = res.reservations


      const errorsKeys = Object.keys(res.errors || {});
      if (res?.id) {
        closeModel(res, action)
      } else if (errorsKeys.length) {
        errorsKeys.forEach((errorKey) => {
          if (res.errors[errorKey] == 'required') {
            errors.value[errorKey] = res.errors[errorKey]
          } else {
            errors.value[errorKey] = {
              text: res.errors[errorKey]
            }
          }
        })
      }
    });
}

const isEditMode = computed(() => {
  return !!props.room.id;
});

const getStatusName = (id) => {
  const status = statusOptions.value.find((option) => option.id == id);

  return status.label
}

</script>

<style scoped lang="scss">
.addRoom {
  width: 100%;
  height: auto;
  &__form {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;
    row-gap: 20px;
    .p-accordion {
      width: 100%;
    }

    .p-accordion-header {
      background: red !important;
    }
    .form__item {
      position: relative;
      &:not(.wrapped) {
        grid-template-columns: 1fr 436px;
      }
      width: 100%;
      height: auto;
      display: grid;

      label {
        margin-top: 8px;
        font-size: 16px;
        font-weight: 400;
        @apply text-grey-900;
        span {
          @apply text-red;
        }
      }
      .item__content {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        column-gap: 16px;
        row-gap: 16px;
      }
      .item__text {
        @apply text-grey-900;
        font-size: 16px;
      }
      .item__btns {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        column-gap: 8px;
      }
    }
  }
}

</style>

<style>
.addRoom > .modalWindow__wrapper {
  width: unset !important;
  max-width: 830px;
}

.addRoom .p-inputnumber-input	 {
    width: 100%;
} 
.addRoom .p-accordion-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-msg {
  padding: 5px;
  font-size: 12px;
  position: absolute;
  bottom: -25px;
}

.error-color {
  color: red;
}

.errored-input {
  border: 1px solid red !important;
  box-shadow: none !important;
  height: max-content
}

.errored-input .p-inputtext {
  box-shadow: none !important;
  border-color: transparent !important;
}

.errored-input .p-inputtext:focus  {
  box-shadow: none !important;
  border-color: transparent !important;
}
.errored-input .p-inputtext:hover  {
  box-shadow: none !important;
  border-color: transparent !important;
}



</style>