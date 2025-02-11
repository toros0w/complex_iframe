<template>
    <div class="listHome">
      <div class="listHome__title">Список домов</div>
      <div v-show="loadHome" class="loader-div">
        <img src="@/app/images/rocket-spinner.svg">
      </div>
      <div v-show="!loadHome" class="listHome__list">
        <template v-if="activeListItem === 'activeHome'">
          
          <homeItem v-for="house in houses" :key="house.id" :house="house"/>
          
        </template>
        <template v-else></template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import homeItem from "./HomeItem.vue";
    
  const props = defineProps({
    complex: null,
    houses: [],
    loadHome: true
  });
  
  
  
  const emits = defineEmits(
    ["openAddHome"]
  );
  
  const activeListItem = ref("activeHome");
  
  
  const toggleHome = (tab) => {
    activeListItem.value = tab;
  }
  
  
  </script>
  <style scoped lang="scss">
  .loader-div {
    margin-left: 45%;
    margin-right: 50%;
    margin-top: 30px;
    margin-bottom: 30px;
  
    img {
      width:150px;
      max-width: none;
    }
  }
  .listHome {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  
    &__title {
      width: 100%;
      font-size: 32px;
      padding: 20px;
      border-bottom: 1px solid;
      @apply border-grey-400;
    }
    &__list {
      position: relative;
      width: 100%;
      // left: -30px;
      // width: calc(100% + 60px);
      height: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 30px;
      @apply bg-grey-200;
      padding: 30px 0;
    }
  
    @media screen and (max-width: 1440px) {
      &__list {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media screen and (max-width: 1180px) {
      &__list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media screen and (max-width: 800px) {
      &__list {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
  </style>
  