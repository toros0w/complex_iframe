<template>
  <FormLayout
    class="copyRoom"
    title="Копирование помещения"
    @closeModel="closeModel"
    :class="isOpen ? 'open' : ''"
  >
    <template v-slot:default>
      <div class="m-2 mt-10 flex flex-wrap gap-3">
        <div class="flex align-items-center">
            <RadioButton v-model="type" inputId="default-copy" name="pizza" value="default" />
            <label for="default-copy" class="ml-2">Простое копирование</label>
        </div>
        <div class="flex align-items-center">
            <RadioButton v-model="type" inputId="advanced-copy" name="pizza" value="advanced" />
            <label for="advanced-copy" class="ml-2">Многоэтажное копирование</label>
        </div>
    </div>
      <form v-if="type === 'advanced'" class="form copyRoom__form">
        <div class="form__item">
          <label for="copies-count">Количество копий на 1 этаж<span>*</span></label>
          <InputNumber
          v-model="formInputs.copies_count"
          required
          min="0"
          id="copies-count"
          placeholder="Количество копий на 1 этаж"
          />
        </div>
        <div class="form__item">
          <label for="copies-count">Выберите этажы <span>*</span></label>
          <div style="display: flex; gap: 8px">
            <div style="display: flex; flex-direction: column; gap: 8px; min-width: 110px; justify-content: end;">
              <div class="input-errors" v-for="error of v$.from_floor.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
              <div>
                <label for="copies-count">От <span>*</span></label>
                <InputNumber
                  v-model="formInputs.from_floor"
                  required
                  id="copies-count"
                  style="width: 75px"
                />
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; min-width: 110px; justify-content: end;">
              <div class="input-errors" v-for="error of v$.to_floor.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
              <div>
                <label for="copies-count">До <span>*</span></label>
                <InputNumber
                  v-model="formInputs.to_floor"
                  required
                  id="copies-count"
                  style="width: 75px"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template v-slot:formBtns>
      <div class="copy-btn-container">
        <MyButton theme="green" class="submit mt-7.5" @click="copyRoom" :disabled="v$.$error"
          >Копировать</MyButton
        >
      </div>
    </template>
  </FormLayout>
</template>

<script setup>
import FormLayout from "@/shared/UI/modalLayout.vue";
import MyButton from "@/shared/UI/MyButton.vue";
import { ref, onMounted, watch, computed, reactive } from "vue";
import axios from "axios";
import InputNumber from "primevue/inputnumber";
import { required, email, minValue, maxValue, helpers } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import RadioButton from "primevue/radiobutton";

const props = defineProps({
  isOpen: Boolean,
  room: Object,
  maxFloor: Number,
  minFloor: Number,
});

const type = ref('default')

const emits = defineEmits(
  ["copy:room", "closeModel"]
);

const clear = () => {
  formInputs.copies_count = null;
  formInputs.from_floor = null;
  formInputs.to_floor = null;

  type.value = 'default'

  v$.value.$reset() 
}

const closeModel = () => {
  emits('closeModel')
  clear()
}

const formInputs = reactive({
  copies_count: null,
  from_floor: null,
  to_floor: null,
});

const validatorMaxFloor = (value) => {
  if (!isNaN(formInputs.to_floor)) {
    return value <= formInputs.to_floor
  }

  return value <= props.maxFloor
}

const validatorMinFloor = (value) => {
  if (!isNaN(formInputs.from_floor)) {
    return value >= formInputs.from_floor
  }

  return value >= props.minFloor
}

const rules = reactive({
  from_floor: { 
    required: helpers.withMessage('Поле обязательное', required), 
    minValue: helpers.withMessage(
      ({}) => `Минимальный этаж должен быть не меньше чем ${props.minFloor}`,
      helpers.withAsync((value) => value >= props.minFloor),
    ),
    maxValue: helpers.withMessage(
      ({}) => `Максимальный этаж должен быть не болше чем ${(formInputs.to_floor === null || formInputs.to_floor >= props.maxFloor) ? props.maxFloor : formInputs.to_floor}`,
      helpers.withAsync(validatorMaxFloor)
    ),
  },
  to_floor: {
    required: helpers.withMessage('Поле обязательное', required),
    minValue: helpers.withMessage(
      ({}) => `Минимальный этаж должен быть не меньше чем ${(formInputs.from_floor === null || formInputs.from_floor <= props.minFloor) ? props.minFloor : formInputs.from_floor}`,
      helpers.withAsync(validatorMinFloor)
    ),
    maxValue: helpers.withMessage(
      ({}) => `Максимальный этаж должен быть не болше чем ${props.maxFloor}`,
      helpers.withAsync((value) => value <= props.maxFloor)
    ),
  },
})


const v$ = useVuelidate(rules, formInputs)

const copyRoom = () => {
  if (type.value === 'default') {
    emits('copy:room', props.room, {}, type.value)

    clear()
  } else {
    v$.value.$validate().then(bool => {
      if (bool) {
        emits('copy:room', props.room, {
          from: formInputs.from_floor,
          to: formInputs.to_floor,
          count: formInputs.copies_count,
        })

        clear()
      }
    });
  }
};
</script>

<style scoped lang="scss">
.copyRoom {
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
      &:not(.wrapped) {
        grid-template-columns: 1fr 320px;
      }
      width: 100%;
      height: auto;
      display: grid;

      label {
        margin-top: 5px;
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

  .copy-btn-container {
    width: 100%;
    display: flex;
    justify-content: end;
  }
}
.input-errors {
    color: red;
    font-size: 12px;
}
</style>

<style>
.copyRoom > .modalWindow__wrapper {
  width: 560px;
  height: max-content;
  overflow: auto;
}

.copyRoom .p-inputnumber-input {
  width: 100%;
}
.copyRoom .p-accordion-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.copyRoom .p-multiselect-label {
  padding: 0;
}
</style>