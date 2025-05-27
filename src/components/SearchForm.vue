<template>
  <div class="formTitle text-[32px]">Фильтр поиска</div>
  <div class="form">
    <div class="filter-group">
      <div class="form__item">
        <label for="type">Тип комплекса</label>
        <div class="card flex justify-content-center" style="gap: 10px">
          <MultiSelect
            :pt="multiSelectStyle"
            id="type"
            v-model="filter.selectedComplexTypes"
            :options="complexes_types"
            filter
            optionLabel="name"
            optionValue="code"
            placeholder="Выберите тип"
            selectedItemsLabel="Выбрано: {0}"
            emptyFilterMessage="Ничего не найдено"
            :maxSelectedLabels="1"
            class="w-full md:w-20rem"
          />
        </div>
      </div>
      <div class="form__item">
        <label class="text-grey-900">Тип объекта</label>
        <MultiSelect
          v-model="filter.selectedTypes"
          :options="roomTypesOptions"
          selectedItemsLabel="Выбрано: {0}"
          filter
          emptyFilterMessage="Ничего не найдено"
          :maxSelectedLabels="1"
          optionValue="key"
          optionLabel="name"
          placeholder="Выберите тип"
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
              v-model="filter.rooms"
              :options="typeRooms"
              option-label="name"
              option-value="value"
              multiple
              aria-labelledby="multiple"
              :pt="{
                button: {
                  class: ['2xl:!h-[37px] xl:!h-[37px]'],
                },
              }"
            />
          </div>
        </div>
    </div>
   <div class="filter-group">
      <div class="form__item">
        <label for="type">Район</label>
        <div class="card flex justify-content-center" style="gap: 10px">
          <MultiSelect
            :pt="multiSelectStyle"
            id="type"
            v-model="filter.rayons"
            :options="rayons"
            filter
            emptyFilterMessage="Ничего не найдено"
            optionLabel="name"
            optionValue="name"
            placeholder="Выберите тип"
            selectedItemsLabel="Выбрано: {0}"
            :maxSelectedLabels="1" class="w-full md:w-20rem" />
        </div>
      </div>
      <div class="form__item">
        <label for="metro">Метро</label>
        <div class="card flex justify-content-center">
            <MultiSelect
              :pt="multiSelectStyle"
              id="metro"
              v-model="filter.selectedMetros"
              :options="metros"
              filter
              emptyFilterMessage="Ничего не найдено"
              optionLabel="name"
              optionValue="code"
              placeholder="Выберите станции"
              selectedItemsLabel="Выбрано: {0}"
              :maxSelectedLabels="1" class="w-full md:w-20rem" />
        </div>
      </div>
      <div class="form__item">
        <label for="address">Адрес</label>
        <div class="card flex justify-content-center">
          <InputText :pt="{ root: { class: ['w-[300px]'] }  }" placeholder="Улица, проспект, шоссе, переулок" id="address" v-model="filter.address" />
        </div>
      </div>
      <div class="form__item">
        <label for="address">Название комплекса</label>
        <MultiSelect :pt="multiSelectStyle" id="metro" v-model="filter.complexes" :options="complex_suggestions" filter optionLabel="name" optionValue="id" placeholder="Выберите комплексы"
              selectedItemsLabel="Выбрано: {0}"
              :maxSelectedLabels="1" class="w-full md:w-20rem" />
      </div>
   </div>
    <div class="filter-group">
      <div class="form__item">
        <label for="period">Срок сдачи (не позднее)</label>
        <div class="card flex justify-content-center">
          <Dropdown emptyFilterMessage="Ничего не найдено" filter showClear id="period" :pt="{ itemLabel: { class: [ 'min-w-[300px]' ] }, header: { class: ['custom-header'] } }" :options="periods" optionLabel="name" optionValue="value" placeholder="Не выбрано" v-model="filter.period"></Dropdown>
        </div>
      </div>
      <div class="form__item">
        <label for="decoration">Тип отделки</label>
        <div class="card flex justify-content-center">
            <MultiSelect :pt="multiSelectStyle" id="decoration" v-model="filter.selectedDecorations" :options="decorations" emptyFilterMessage="Ничего не найдено" filter optionLabel="name" optionValue="code" placeholder="Выберите отделку"
                selectedItemsLabel="Выбрано: {0}"
                :maxSelectedLabels="1" class="w-full md:w-20rem" />
        </div>
      </div>
      <div class="form__item">
        <label style="display: flex;" for="area">Плошадь, <small-span class="form-label with-pad">&nbsp;м<sup>2</sup></small-span></label>
        <div class="card flex justify-content-center" style="gap: 10px">
          <InputNumber :pt="{ root: { class: [ 'number-input', 'w-[142px]' ] } }" type="number" placeholder="от" id="area_from" v-model="filter.area_from" />
          <InputNumber :pt="{ root: { class: [ 'number-input', 'w-[142px]' ] } }" type="number" placeholder="до" id="area_to" v-model="filter.area_to" />
        </div>
      </div>
      <div class="form__item">
        <label style="display: flex;" for="area">Площадь кухни, <small-span class="form-label with-pad">&nbsp;м<sup>2</sup></small-span></label>
        <div class="card flex justify-content-center" style="gap: 10px">
          <InputNumber :pt="{ root: { class: [ 'number-input', 'w-[142px]', '!p-0' ] } }" type="number" placeholder="от" id="area_from" v-model="filter.squareKitchen_min" />
          <InputNumber :pt="{ root: { class: [ 'number-input', 'w-[142px]', '!p-0' ] } }" type="number" placeholder="до" id="area_to" v-model="filter.squareKitchen_max" />
        </div>
      </div>
    </div>

    <!-- <div class="form__item" style="width: 100%;">
      <label for="price">Цена</label>
      <div style="gap: 10px; display: flex; justify-content: space-between;">
        <div class="card flex justify-content-center" style="gap: 10px">
          <InputNumber :pt="{ root: { class: [ 'number-input', 'min-w-[134.5px]' ] } }" type="number" placeholder="от" id="price_from" v-model="filter.price_from" />
          <InputNumber :pt="{ root: { class: [ 'number-input', 'min-w-[134.5px]' ] } }" type="number" placeholder="до" id="price_to" v-model="filter.price_to" />
          <div style="display: flex; align-items:center; gap: 5px">
            <InputSwitch v-model="filter.useSquarePrice" />
            <div style="text-wrap: nowrap;" class="text-grey-clearFilters900">Цена за кв.м.</div>
          </div>
        </div>
        <button
          class="btnClearFilters bg-white border border-red text-sm px-4 py-2.5 text-red rounded-[30px] h-max self-end"
          @click="() => $emit('clear')"
        >
          Очистить фильтры
        </button>
      </div>
    </div> -->
    <div style="display: flex; width: 100%; justify-content: space-between">
      <div style="gap: 46px; display: flex;">
        <div class="form__item">
          <label for="floor">Этажность</label>
            <div class="card flex justify-content-center" style="gap: 10px">
              <InputNumber :pt="{ root: { class: [ 'number-input', 'w-[142px]' ] } }" type="number" placeholder="от" id="floor_from" v-model="filter.floor_from" />
              <InputNumber :pt="{ root: { class: [ 'number-input', 'w-[142px]' ] } }" type="number" placeholder="до" id="floor_to" v-model="filter.floor_to" />
            </div>
        </div>
        <div class="form__item">
          <label for="price">Цена</label>
          <div class="card flex justify-content-center" style="gap: 10px">
            <div class="card flex justify-content-center" style="gap: 10px">
              <InputNumber :pt="{ root: { class: [ 'number-input', 'min-w-[134.5px]' ] } }" type="number" placeholder="от" id="price_from" v-model="filter.price_from" />
              <InputNumber :pt="{ root: { class: [ 'number-input', 'min-w-[134.5px]' ] } }" type="number" placeholder="до" id="price_to" v-model="filter.price_to" />
              <div style="display: flex; align-items:center; gap: 5px">
                <InputSwitch v-model="filter.useSquarePrice" />
                <div style="text-wrap: nowrap;" class="text-grey-clearFilters900">Цена за кв.м.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        style="border-radius: 6px; height: 47px; border-color: #c68484;"
        class="btnClearFilters bg-white border border-red text-sm px-4 py-2.5 text-red rounded-[30px] h-max self-end"
        @click="() => $emit('clear')"
      >
        Очистить фильтры
      </button>
    </div>
    <MyButton
      :theme="'green'"
      class="!w-full !rounded-1x mx-auto !px-5 find-button"
      @click="submit"
    >Найти</MyButton>
    </div>
</template>

<script>
import { ref, toRefs } from "vue";
import Listbox from 'primevue/listbox';
import InputNumber from "primevue/inputnumber";
import api from "@/shared/api";
import MyButton from "@/shared/UI/MyButton.vue";
import { room_types, room_types_which_has_rooms } from "@/shared/utils/util";
import SelectButton from "primevue/selectbutton";
import { typeRooms } from "@/shared/utils/util";
import { useFieldsStore } from "@/app/store/fields";
import { reactive } from "vue";

export default {
  components: {Listbox, InputNumber, MyButton, SelectButton},
  props: {
    filter: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const fieldsStore = useFieldsStore()

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
          };
    // const {filter} = toRefs(props)
    const roomTypesOptions = Object.entries(room_types).map(([room_key, room_value]) => ({
      key: room_key,
      name: room_value
    }))

    return {
      roomTypesOptions,
      multiSelectStyle,
      // filter,
      metros: fieldsStore.metros,
      rayons: fieldsStore.rayons,
      complex_suggestions: fieldsStore.complex_suggestions,
      decorations: fieldsStore.decorations,
      complexes_types: fieldsStore.complexes_types,
      rf_regions: fieldsStore.rf_regions,
      typeRooms,
    };
  },
  computed: {
    periods() {
      const date = (new Date(Date.now()))
      const currentYear = date.getFullYear();
      const currentQuarter = Math.ceil(date.getMonth() / 3) - 1; 
      return this.generateQuarters(currentQuarter, currentYear, currentYear + 10)
    },
    showTypeRooms() {
      if (Array.isArray(this.filter.selectedTypes)) {
        return this.filter.selectedTypes.some((selectedType) => room_types_which_has_rooms.includes(selectedType));
      }

      if (typeof this.filter.selectedTypes === 'string') {
        return room_types_which_has_rooms.includes(this.filter.selectedTypes)
      }

      return false
    }
  },
  watch: {
    showTypeRooms(newValue) {
      if (!newValue) {
        this.filter.rooms = []
      }
    }
  },
  methods: {
    generateQuarters(startQuarter , startYear, endYear) {
      const quarters = ['1 квартал', '2 квартал', '3 квартал', '4 квартал'];
      const options = [];
    
      options.push({
        name: 'Сдан',
        value: 'completed'
      });
      for (let year = startYear; year <= endYear; year++) {
          for (let i = 0; i < quarters.length; i++) {
              // Skip quarters before Q3 in the starting year
              if (year === startYear && i < startQuarter) continue;
              
              options.push({
                  name: `${quarters[i]} ${year}`,
                  value: `${year}Q${i + 1}`
              });
          }
      }
    
      return options;
    },
    submit() {
      this.$emit('onSubmit')
    },
  }
};
</script>

<style lang="scss">
.d-flex {
  display: flex !important;
  align-items: center;
}

.filter-container {
  input {
    padding: 2px;
  }
}

.number-input {
  input {
    width: 75px
  }
}

.form .p-dropdown-label {
  width: 150px !important;
}
.form .p-dropdown-label-empty {
  width: 80px !important;
}

.form .p-multiselect.p-inputwrapper, .form .p-dropdown {
  border-radius: 6px !important;
  justify-content: space-between !important;
  padding: 8px !important;
  width: 300px !important;
  height: 36px !important;
}
.form .p-placeholder, .form .p-multiselect-label {
  font-weight: 500;
  font-size: 16px !important;
  line-height: 19.2px !important;
  color: #757575 !important;
}

.form .p-inputswitch.p-focus .p-inputswitch-slider {
  box-shadow: unset ;
}

.form input::placeholder {
  font-weight: 500;
  font-size: 16px !important;
  line-height: 19.2px !important;
  color: #757575 !important;
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
<style scoped lang="scss">
.form {
  position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;
    row-gap: 20px;
    .form__item {
      flex-direction: column;
      width: 300px;
      height: auto;
      display: flex;
      gap: 12px;
      .p-invalid{
        color: #e24c4c;
      }
      
      label {
        font-size: 16px;
        font-weight: 400;
        min-width: 110px;
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

  .find-button {
    background: linear-gradient(to bottom, rgba(67, 160, 71, 1) 0%, rgba(56, 142, 60, 1) 100%);
    cursor: pointer;
    font-family: "Lato";
    padding: 20px 0 22px !important;
    color: #ffffff; 
    font-size: 20px;
    font-weight: bold;
    border: 0;
    border-radius: 0;
    z-index: 1;
    position: relative;

    &:hover {
      background: #388E3C;
    }
  }
}

.formTitle {
  font-weight: 400;
  font-size: 32px;
  line-height: 38.4px;
  color: #333333
}


.filter-group {
  display: flex;
  gap: 40px;
}
</style>