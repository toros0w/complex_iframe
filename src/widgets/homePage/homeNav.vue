<template>
  <div class="nav">
    <div class="nav__item">
      <div class="item__icon">
        <img :src="require('@/shared/assets/icons/homeNav/chess.svg')" alt="" />
      </div>
      <div class="item__content">
        <div class="item__title">Шахматка</div>
        <div class="item__fullness">Заполнение {{house.rooms_count ? 100 : 0}}%</div>
        <div class="item__btns flex flex-row">
          <RouterLink :to="{ name: 'import' }">
          <MyButton :theme="'green'" class="text-sm !px-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 8.25C15.5511 8.25 15.3603 8.32902 15.2197 8.46967C15.079 8.61032 15 8.80109 15 9C15.0089 10.4048 14.5277 11.7687 13.6392 12.8568C12.7508 13.945 11.5106 14.6893 10.1325 14.9615C8.7543 15.2337 7.32434 15.0167 6.08888 14.3481C4.85342 13.6794 3.88981 12.6009 3.36399 11.2982C2.83818 9.99551 2.7831 8.55024 3.20822 7.21131C3.63334 5.87238 4.51206 4.7236 5.69303 3.96283C6.874 3.20207 8.2833 2.87693 9.6782 3.04343C11.0731 3.20993 12.3663 3.85764 13.335 4.875H11.535C11.3361 4.875 11.1453 4.95402 11.0047 5.09467C10.864 5.23532 10.785 5.42609 10.785 5.625C10.785 5.82391 10.864 6.01468 11.0047 6.15533C11.1453 6.29598 11.3361 6.375 11.535 6.375H14.9325C15.1314 6.375 15.3222 6.29598 15.4628 6.15533C15.6035 6.01468 15.6825 5.82391 15.6825 5.625V2.25C15.6825 2.05109 15.6035 1.86032 15.4628 1.71967C15.3222 1.57902 15.1314 1.5 14.9325 1.5C14.7336 1.5 14.5428 1.57902 14.4022 1.71967C14.2615 1.86032 14.1825 2.05109 14.1825 2.25V3.5775C12.9335 2.38354 11.3106 1.65746 9.58801 1.522C7.86547 1.38653 6.14897 1.84998 4.72869 2.83402C3.30841 3.81805 2.27146 5.2623 1.79312 6.92264C1.31479 8.58298 1.42441 10.3576 2.10346 11.9464C2.78251 13.5352 3.98933 14.8409 5.51993 15.6426C7.05052 16.4444 8.811 16.6931 10.5038 16.3466C12.1966 16.0002 13.7178 15.0799 14.8104 13.7413C15.9029 12.4027 16.4998 10.7279 16.5 9C16.5 8.80109 16.421 8.61032 16.2803 8.46967C16.1397 8.32902 15.9489 8.25 15.75 8.25Z"
                fill="white"
              />
            </svg>
            Обновить из файла
          </MyButton>
        </RouterLink>
          <MyButton
            :theme="'grey-icon'"
            class="text-sm text-grey-900"
            @click="router.push(`${house.id}/chess`)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 9.00002C15.5511 9.00002 15.3603 9.07903 15.2197 9.21969C15.079 9.36034 15 9.5511 15 9.75002V14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V3.75002C3 3.5511 3.07902 3.36034 3.21967 3.21969C3.36032 3.07903 3.55109 3.00002 3.75 3.00002H8.25C8.44891 3.00002 8.63968 2.921 8.78033 2.78035C8.92098 2.63969 9 2.44893 9 2.25002C9 2.0511 8.92098 1.86034 8.78033 1.71969C8.63968 1.57903 8.44891 1.50002 8.25 1.50002H3.75C3.15326 1.50002 2.58097 1.73707 2.15901 2.15903C1.73705 2.58098 1.5 3.15328 1.5 3.75002V14.25C1.5 14.8468 1.73705 15.419 2.15901 15.841C2.58097 16.263 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.263 15.841 15.841C16.2629 15.419 16.5 14.8468 16.5 14.25V9.75002C16.5 9.5511 16.421 9.36034 16.2803 9.21969C16.1397 9.07903 15.9489 9.00002 15.75 9.00002ZM4.5 9.57001V12.75C4.5 12.9489 4.57902 13.1397 4.71967 13.2803C4.86032 13.421 5.05109 13.5 5.25 13.5H8.43C8.5287 13.5006 8.62655 13.4817 8.71793 13.4443C8.80931 13.407 8.89242 13.352 8.9625 13.2825L14.1525 8.08502L16.2825 6.00002C16.3528 5.93029 16.4086 5.84734 16.4467 5.75595C16.4847 5.66455 16.5043 5.56652 16.5043 5.46752C16.5043 5.36851 16.4847 5.27048 16.4467 5.17908C16.4086 5.08769 16.3528 5.00474 16.2825 4.93502L13.1025 1.71752C13.0328 1.64722 12.9498 1.59142 12.8584 1.55335C12.767 1.51527 12.669 1.49567 12.57 1.49567C12.471 1.49567 12.373 1.51527 12.2816 1.55335C12.1902 1.59142 12.1072 1.64722 12.0375 1.71752L9.9225 3.84002L4.7175 9.03752C4.64799 9.1076 4.59299 9.19071 4.55567 9.28209C4.51835 9.37346 4.49943 9.47131 4.5 9.57001ZM12.57 3.30752L14.6925 5.43002L13.6275 6.49502L11.505 4.37252L12.57 3.30752ZM6 9.87752L10.4475 5.43002L12.57 7.55252L8.1225 12H6V9.87752Z"
                fill="#666666"
              />
            </svg>
            <div class="text">Редактировать</div>
          </MyButton>
        </div>
      </div>
    </div>
    <div class="nav__item">
      <div class="item__icon">
        <img :src="require('@/shared/assets/icons/homeNav/grid.svg')" alt="" />
      </div>
      <div class="item__content">
        <div class="item__title">Планировки помещений</div>
        <div class="item__fullness">Заполнение  {{ plansCompletedPercentage }}%</div>
        <div class="item__bts flex flex-row">
          <MyButton
            :theme="'grey-icon'"
            class="!w-max text-sm text-grey-900"
            @click="router.push(`${house.id}/planLayout/rooms`)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 9.00002C15.5511 9.00002 15.3603 9.07903 15.2197 9.21969C15.079 9.36034 15 9.5511 15 9.75002V14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V3.75002C3 3.5511 3.07902 3.36034 3.21967 3.21969C3.36032 3.07903 3.55109 3.00002 3.75 3.00002H8.25C8.44891 3.00002 8.63968 2.921 8.78033 2.78035C8.92098 2.63969 9 2.44893 9 2.25002C9 2.0511 8.92098 1.86034 8.78033 1.71969C8.63968 1.57903 8.44891 1.50002 8.25 1.50002H3.75C3.15326 1.50002 2.58097 1.73707 2.15901 2.15903C1.73705 2.58098 1.5 3.15328 1.5 3.75002V14.25C1.5 14.8468 1.73705 15.419 2.15901 15.841C2.58097 16.263 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.263 15.841 15.841C16.2629 15.419 16.5 14.8468 16.5 14.25V9.75002C16.5 9.5511 16.421 9.36034 16.2803 9.21969C16.1397 9.07903 15.9489 9.00002 15.75 9.00002ZM4.5 9.57001V12.75C4.5 12.9489 4.57902 13.1397 4.71967 13.2803C4.86032 13.421 5.05109 13.5 5.25 13.5H8.43C8.5287 13.5006 8.62655 13.4817 8.71793 13.4443C8.80931 13.407 8.89242 13.352 8.9625 13.2825L14.1525 8.08502L16.2825 6.00002C16.3528 5.93029 16.4086 5.84734 16.4467 5.75595C16.4847 5.66455 16.5043 5.56652 16.5043 5.46752C16.5043 5.36851 16.4847 5.27048 16.4467 5.17908C16.4086 5.08769 16.3528 5.00474 16.2825 4.93502L13.1025 1.71752C13.0328 1.64722 12.9498 1.59142 12.8584 1.55335C12.767 1.51527 12.669 1.49567 12.57 1.49567C12.471 1.49567 12.373 1.51527 12.2816 1.55335C12.1902 1.59142 12.1072 1.64722 12.0375 1.71752L9.9225 3.84002L4.7175 9.03752C4.64799 9.1076 4.59299 9.19071 4.55567 9.28209C4.51835 9.37346 4.49943 9.47131 4.5 9.57001ZM12.57 3.30752L14.6925 5.43002L13.6275 6.49502L11.505 4.37252L12.57 3.30752ZM6 9.87752L10.4475 5.43002L12.57 7.55252L8.1225 12H6V9.87752Z"
                fill="#666666"
              />
            </svg>
            Редактировать
          </MyButton>
        </div>
      </div>
    </div>
    <div class="nav__item">
      <div class="item__icon">
        <img
          :src="require('@/shared/assets/icons/homeNav/floors.svg')"
          alt=""
        />
      </div>
      <div class="item__content">
        <div class="item__title">Планировки этажей</div>
        <div class="item__fullness">{{floorsCompletedPercentage}}%</div>
        <div class="item__bts flex flex-row">
          <MyButton
            :theme="'grey-icon'"
            class="!w-max text-sm text-grey-900"
            @click="router.push(`${house.id}/planLayout/floors`)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 9.00002C15.5511 9.00002 15.3603 9.07903 15.2197 9.21969C15.079 9.36034 15 9.5511 15 9.75002V14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V3.75002C3 3.5511 3.07902 3.36034 3.21967 3.21969C3.36032 3.07903 3.55109 3.00002 3.75 3.00002H8.25C8.44891 3.00002 8.63968 2.921 8.78033 2.78035C8.92098 2.63969 9 2.44893 9 2.25002C9 2.0511 8.92098 1.86034 8.78033 1.71969C8.63968 1.57903 8.44891 1.50002 8.25 1.50002H3.75C3.15326 1.50002 2.58097 1.73707 2.15901 2.15903C1.73705 2.58098 1.5 3.15328 1.5 3.75002V14.25C1.5 14.8468 1.73705 15.419 2.15901 15.841C2.58097 16.263 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.263 15.841 15.841C16.2629 15.419 16.5 14.8468 16.5 14.25V9.75002C16.5 9.5511 16.421 9.36034 16.2803 9.21969C16.1397 9.07903 15.9489 9.00002 15.75 9.00002ZM4.5 9.57001V12.75C4.5 12.9489 4.57902 13.1397 4.71967 13.2803C4.86032 13.421 5.05109 13.5 5.25 13.5H8.43C8.5287 13.5006 8.62655 13.4817 8.71793 13.4443C8.80931 13.407 8.89242 13.352 8.9625 13.2825L14.1525 8.08502L16.2825 6.00002C16.3528 5.93029 16.4086 5.84734 16.4467 5.75595C16.4847 5.66455 16.5043 5.56652 16.5043 5.46752C16.5043 5.36851 16.4847 5.27048 16.4467 5.17908C16.4086 5.08769 16.3528 5.00474 16.2825 4.93502L13.1025 1.71752C13.0328 1.64722 12.9498 1.59142 12.8584 1.55335C12.767 1.51527 12.669 1.49567 12.57 1.49567C12.471 1.49567 12.373 1.51527 12.2816 1.55335C12.1902 1.59142 12.1072 1.64722 12.0375 1.71752L9.9225 3.84002L4.7175 9.03752C4.64799 9.1076 4.59299 9.19071 4.55567 9.28209C4.51835 9.37346 4.49943 9.47131 4.5 9.57001ZM12.57 3.30752L14.6925 5.43002L13.6275 6.49502L11.505 4.37252L12.57 3.30752ZM6 9.87752L10.4475 5.43002L12.57 7.55252L8.1225 12H6V9.87752Z"
                fill="#666666"
              />
            </svg>
            Редактировать
          </MyButton>
        </div>
      </div>
    </div>
    <div class="nav__item">
      <div class="item__icon">
        <img
          :src="require('@/shared/assets/icons/homeNav/facades.svg')"
          alt=""
        />
      </div>
      <div class="item__content">
        <div class="item__title">Фасады</div>
        <div class="item__fullness">{{facadesCompletedPercentage}}%</div>
        <div class="item__btns flex flex-row">
          <MyButton
            :theme="'grey-icon'"
            class="!w-max text-sm text-grey-900"
            @click="router.push(`${house.id}/facades`)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 9.00002C15.5511 9.00002 15.3603 9.07903 15.2197 9.21969C15.079 9.36034 15 9.5511 15 9.75002V14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V3.75002C3 3.5511 3.07902 3.36034 3.21967 3.21969C3.36032 3.07903 3.55109 3.00002 3.75 3.00002H8.25C8.44891 3.00002 8.63968 2.921 8.78033 2.78035C8.92098 2.63969 9 2.44893 9 2.25002C9 2.0511 8.92098 1.86034 8.78033 1.71969C8.63968 1.57903 8.44891 1.50002 8.25 1.50002H3.75C3.15326 1.50002 2.58097 1.73707 2.15901 2.15903C1.73705 2.58098 1.5 3.15328 1.5 3.75002V14.25C1.5 14.8468 1.73705 15.419 2.15901 15.841C2.58097 16.263 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.263 15.841 15.841C16.2629 15.419 16.5 14.8468 16.5 14.25V9.75002C16.5 9.5511 16.421 9.36034 16.2803 9.21969C16.1397 9.07903 15.9489 9.00002 15.75 9.00002ZM4.5 9.57001V12.75C4.5 12.9489 4.57902 13.1397 4.71967 13.2803C4.86032 13.421 5.05109 13.5 5.25 13.5H8.43C8.5287 13.5006 8.62655 13.4817 8.71793 13.4443C8.80931 13.407 8.89242 13.352 8.9625 13.2825L14.1525 8.08502L16.2825 6.00002C16.3528 5.93029 16.4086 5.84734 16.4467 5.75595C16.4847 5.66455 16.5043 5.56652 16.5043 5.46752C16.5043 5.36851 16.4847 5.27048 16.4467 5.17908C16.4086 5.08769 16.3528 5.00474 16.2825 4.93502L13.1025 1.71752C13.0328 1.64722 12.9498 1.59142 12.8584 1.55335C12.767 1.51527 12.669 1.49567 12.57 1.49567C12.471 1.49567 12.373 1.51527 12.2816 1.55335C12.1902 1.59142 12.1072 1.64722 12.0375 1.71752L9.9225 3.84002L4.7175 9.03752C4.64799 9.1076 4.59299 9.19071 4.55567 9.28209C4.51835 9.37346 4.49943 9.47131 4.5 9.57001ZM12.57 3.30752L14.6925 5.43002L13.6275 6.49502L11.505 4.37252L12.57 3.30752ZM6 9.87752L10.4475 5.43002L12.57 7.55252L8.1225 12H6V9.87752Z"
                fill="#666666"
              />
            </svg>
            Редактировать
          </MyButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";

const props = defineProps({
  house: {
    type: Object,
    required: true
  }
})

const plansCompletedPercentage = computed(() => props.house.rooms_count ? (props.house.rooms_count_where_has_plans * 100 / props.house.rooms_count).toFixed() : 0 )

const floorsCompletedPercentage = computed(() => props.house.floors_count ? (props.house.floors_plans_count_where_has_floor * 100 / props.house.floors_count).toFixed() : 0 )

const facadesCompletedPercentage = computed(() => props.house.floors_count ? (props.house.figures_where_has_floor_count * 100 / props.house.floors_count).toFixed() : 0 )

const router = useRouter();
</script>

<style scoped lang="scss">
.nav {
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid;
  @apply border-grey-400;

  &__item {
    width: auto;
    background: linear-gradient(180deg, #fefefe 0%, #f6f6f6 100%);
    display: flex;
    padding: 20px;
    &:not(:last-child) {
      border-right: 1px solid;
      @apply border-grey-400;
    }

    .item__icon {
      width: 36px;
      height: 36px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .item__content {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      row-gap: 20px;
    }

    .item__title {
      font-size: 16px;
      @apply text-grey-900;
    }

    .item__fullness {
      font-size: 14px;
      @apply text-grey-900;
    }
  }

  @media screen and (max-width: 1600px) {
    &__item {
      padding: 16px;

      .item__icon {
        width: 28px;
        height: 28px;
        margin-right: 18px;
      }

      .item__content {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        row-gap: 16px;
      }

      .item__title {
        font-size: 16px;
        @apply text-grey-900;
      }

      .item__fullness {
        font-size: 14px;
        @apply text-grey-900;
      }
      .item__btns {
        column-gap: 10px;
        flex-wrap: wrap;
        button {
          padding: 8px;
          .text {
            display: none;
          }
        }
      }
    }
  }
}
</style>
