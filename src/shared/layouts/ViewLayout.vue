<template>
  <Teleport to="body">
    <FormAddComplex
      :isOpen="formAddComplexOpen"
      @closeModel="formAddComplexOpen = !formAddComplexOpen"
    />
  </Teleport>
  <div class="viewLayout">
    <main class="w-full flex flex-col">
      <slot />
      <!-- <Navigation /> -->
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, created } from "vue";
import { useRoute } from "vue-router";

import { useComplexStore } from "@/app/store/complex";
import { useHouseStore } from "@/app/store/house";
import { useNavigateStore } from "@/app/store/navigate";

import Navigation from "@/components/Navigation.vue";
import FormAddComplex from "@/widgets/forms/formAddComplex.vue";

const router = useRoute()
const complexStore = useComplexStore()
const navigateStore = useNavigateStore()
const houseStore = useHouseStore()

const house = computed(() => houseStore.house)
const houseComplex = computed(() => houseStore.complex)
const storeCompex = computed(() => complexStore.activeComplex)

const { totalRecords, archivedTotalRecords } = complexStore

const hasDeveloper = ref(!!Number(document.getElementById('has_developer')?.value))

const formAddComplexOpen = ref(false);

onMounted(() => {
  if (!totalRecords) {
    complexStore.getListComplex()
  }
  if (!archivedTotalRecords) {
    complexStore.getArchivedListComplex()
  }
});

const setNavigation = () => {
  const pages = [];
  
  const complex = houseComplex.value.id ? houseComplex.value : storeCompex.value

  if (!complex) return;

  if (router.params.id) {
    pages.push({
      path: `/view`,
      name: 'Жилые комплексы'
    });

    pages.push({
      path: `/view/${complex.id}`,
      name: complex.name
    });
  }

  if (router.params.house_id) {
    pages.push({
      path: `/view/${complex.id}/home/${house.value.id}`,
      name: house.value.name
    });
  }

  if (router.name == 'chess') {
    pages.push({
      path: `/view/${complex.id}/home/${house.value.id}/chess`,
      name: "Детализация"
    });
  } else if (router.name == 'planLayoutPage') {
    pages.push({
      path: `/view/${complex.id}/home/${house.value.id}/planLayout?tab=rooms`,
      name: `Планировки ${router.query.tab == 'rooms' ? 'помещений' : 'этажей'}`
    });
  } else if (router.name == 'facades') {
    pages.push({
      path: `/view/${complex.id}/home/${house.value.id}/facades`,
      name: `Фасады`
    });
  } else if (router.name == 'viewHome') {
    pages.push({
      path: `/view/${complex.id}/home/${house.value.id}/view`,
      name: `Просмотр объекта`
    });
  }

  navigateStore.setPages(pages);
};

watch(() => router.fullPath, setNavigation);

watch([storeCompex, house], ([compVal, houseVal]) => {
  setNavigation()
  
}, { immediate: true });

</script>

<style lang="scss" scoped>
.viewLayout {
  width: 100%;
  height: 100vh;
  display: flex;
  /* grid-template-columns: 110px 1fr;
  grid-template-rows: 139px 1fr; */
  // grid-row-gap: 30px;
  background-color: #f3f3f3;

  main {
    position: relative;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    /* padding: 0 30px 0 30px; */
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>

