<template>
  <div class="objectStep">
    <div class="objectStep__title mb-5 text-xl">
      Связь дома с объектом из файла
    </div>
    <div class="objectStep__desc mb-7.5 text-sm">
      Выберите дом связанный с объектами из файла. Если это новый дом,
      воспользуйтесь ссылкой «Создать дом»
    </div>
    <template v-if="fileHousesMapping && typeof fileHousesMapping == 'object'">
      <div :key="key" v-for="(value, key) in fileHousesMapping" class="grid grid-cols-[repeat(2,_1fr)] gap-x-12.5 mb-16">
        <HouseMapping
          @chooseHouse="fileHousesMapping[key] = $event"
          @open:create-home="() => $emit('open:create-home', key)"
          :fileHouseName="key"
          :houseId="value"
          :housesList="houses"
        />
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-[repeat(2,_1fr)] gap-x-12.5 mb-16">
        <HouseMapping
          @chooseHouse="$emit('setHouse', $event)"
          :housesList="houses"
          @open:create-home="$emit('open:create-home')"
        />
      </div>
    </template>
    <Message :closable="false" severity="info">
      <template #messageicon>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mr-3"
        >
          <path
            d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74965 11.4489 9.74965 11.25V9C9.74965 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.293 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74965 6.89834 9.74965 6.75C9.74965 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57758 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
            fill="#3A8EFA"
          />
        </svg>
      </template>
      <template #default>
        Смотрите пошаговые инструкции по созданию шахматки в Базе знаний.
        Клиентская поддержка: 8 800 201 89 61 (бесплатно из России).
      </template>
    </Message>
    <div class="objectStep__btns flex flex-row gap-x-3 mt-7.5">
      <!-- <Button :disabled="isRequesting" severity="secondary" @click="emits('update:activeItem', 2)"
        >Назад</Button
      > -->
      <Button :disabled="isRequesting" severity="success" @click="handleSubmitHouses"
        >Далее</Button
      >
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Message from "primevue/message";
import { toRefs } from "vue";
import HouseMapping from "./houseMapping.vue";

const emits = defineEmits(
  ["update:activeItem", "open:create-home"]
);

const props = defineProps({
  houses: Array,
  title: String,
  fileHousesMapping: Array,
  isRequesting: Boolean
});

const handleSubmitHouses = () => {
  emits("updateImport", {
    house_name_to_id: JSON.stringify(props.fileHousesMapping),
    step: 4
  });
}


const { houses } = toRefs(props)

</script>

<style scoped lang="scss"></style>
