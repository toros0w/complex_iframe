<template>
  <div class="defaultPage planLayoutPage bg-white h-full">
    <div class="titlePage planLayoutPage__title">
      {{complex.name}} — {{house.name}}
    </div>
    <TabView @update:activeIndex="updateActiveIndex($event)" v-if="house.id" class="w-full" :active-index="activeIndex">
      <TabPanel header="Планировка помещений">
        <PlanRooms v-if="activeIndex == 0" :house="house" />
      </TabPanel>
      <TabPanel header="Планировка этажей">
        <PlanFloors v-if="activeIndex == 1" :house="house" />
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import PlanRooms from "@/widgets/homePage/planLayout/planRooms.vue";
import PlanFloors from "@/widgets/homePage/planFloors/planFloors.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import useHouseHook from "@/features/useHouseHook";
import { useHouseStore } from "@/app/store/house";

const route = useRoute();
const router = useRouter();
const activeIndex = ref(0);

const house_id = route.params.house_id;

const houseStore = useHouseStore()
const complex = computed(() => houseStore.complex)
const house = computed(() => houseStore.house)
const updateActiveIndex = (event) => {
  activeIndex.value = event
  router.push({params: { tab: activeIndex.value ? 'floors' : 'rooms' }})
}
onMounted(async () =>{
  await houseStore.get_house(house_id);

  if (route.params.tab === "floors")
    activeIndex.value = 1
})

</script>

<style scoped lang="scss">
.defaultPage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 30px;
  overflow-y: auto;
}
.titlePage {
  font-size: 32px;
  line-height: 120%;
  font-weight: 400;
}
.tabWidget {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &__nav {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    @apply border-b;
    @apply border-grey-400;
    column-gap: 40px;

    .nav__item {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding-bottom: 23px;
      font-size: 16px;
      margin-bottom: -1px;

      &.active {
        font-weight: 700;
        border-bottom: 3px solid;
        @apply border-green;
      }
    }
  }

  @media screen and (max-width: 1600px) {
    column-gap: 30px;
    .nav__item {
      padding-bottom: 18px;
      font-size: 14px;
      &.active {
        border-bottom-width: 2px;
      }
    }
  }
}

.planLayoutPage {
  &__title {
    margin-bottom: 50px;
  }

  @media screen and (max-width: 1600px) {
    &__title {
      margin-bottom: 30px;
    }
  }
}
</style>
