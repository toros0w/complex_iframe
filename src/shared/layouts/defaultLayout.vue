<template>
  <Teleport to="body">
    <FormAddComplex
      :isOpen="formAddComplexOpen"
      @closeModel="formAddComplexOpen = !formAddComplexOpen"
    />
  </Teleport>
  <div class="defaultLayout">
    <!-- <IframeNavbar class="iframe-navbar-new" /> -->
    <div class="layout">
      <header class="header">
        <div class="header__top">
          <div class="header__title">Жилые комплексы</div>
        </div>
        <div class="header__bottom">
          <header-nav @changeOpen="formAddComplexOpen = !formAddComplexOpen" />
          <header-type-grid />
        </div>
      </header>
      <!-- <div class="navbar">
        <div class="nav__logo">
          <img src="" alt="" />
        </div>
        <button class="nav__btnAdd"></button>
        <nav class="nav">
          <ul class="nav__list">
            <li class="list__item">
              <RouterLink to="/my-objects"></RouterLink>
            </li>
          </ul>
        </nav>
      </div> -->
      <main class="w-full flex flex-col">
        <Navigation />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useHouseStore } from "@/app/store/house";
import { useComplexStore } from "@/app/store/complex";
import { useNavigateStore } from "@/app/store/navigate";

import HeaderNav from "@/widgets/header/header-nav.vue";
import HeaderTypeGrid from "@/widgets/header/header-type-grid.vue";
import FormAddComplex from "@/widgets/forms/formAddComplex.vue";
import Navigation from "@/components/Navigation.vue"
import IframeNavbar from "@/components/IframeNavbar.vue";

const route = useRoute()

const complexStore = useComplexStore()
const navigateStore = useNavigateStore()
const houseStore = useHouseStore()

const house = computed(() => houseStore.house)
const houseComplex = computed(() => houseStore.complex)
const storeCompex = computed(() => complexStore.activeComplex)

const { totalRecords, archivedTotalRecords } = complexStore
const formAddComplexOpen = ref(false);

onMounted(() => {
  if (!totalRecords) {
    complexStore.getListComplex()
  }
  if (!archivedTotalRecords) {
    complexStore.getArchivedListComplex()
  }
})

const setNavigation = () => {
  const pages = [];
  
  const complex = houseComplex.value.id ? houseComplex.value : storeCompex.value

  if (!complex) return;

  if (route.params.id) {
    pages.push({
      path: `/my-objects`,
      name: 'Жилые комплексы'
    });

    pages.push({
      path: `/my-objects/${complex.id}`,
      name: complex.name
    });
  }

  if (route.params.house_id) {
    pages.push({
      path: `/my-objects/${complex.id}/home/${house.value.id}`,
      name: house.value.name
    });
  }

  if (route.name == 'chess') {
    pages.push({
      path: `/my-objects/${complex.id}/home/${house.value.id}/chess`,
      name: "Детализация"
    });
  } else if (route.name == 'planLayoutPage') {
    pages.push({
      path: `/my-objects/${complex.id}/home/${house.value.id}/planLayout?tab=rooms`,
      name: `Планировки ${route.query.tab == 'rooms' ? 'помещений' : 'этажей'}`
    });
  } else if (route.name == 'facades') {
    pages.push({
      path: `/my-objects/${complex.id}/home/${house.value.id}/facades`,
      name: `Фасады`
    });
  } else if (route.name == 'viewHome') {
    pages.push({
      path: `/my-objects/${complex.id}/home/${house.value.id}/view`,
      name: `Просмотр объекта`
    });
  } else if (route.params.tab) {
    if (route.params.tab == 'floors') {
      pages.push({
        path: `/my-objects/${complex.id}/home/${house.value.id}/planLayout/floors`,
        name: `Планировка этажа`
      });

      if (route.params.floor_plan_id) {
        pages.push({
          path: `/my-objects/${complex.id}/home/${house.value.id}/planLayout/floors/${route.params.floor_plan_id}`,
          name: `Редактирование`
        });
      }
    } else if (route.params.tab == 'rooms') {
      pages.push({
        path: `/my-objects/${complex.id}/home/${house.value.id}/planLayout/rooms`,
        name: `Планировка помещений`
      });
    }
  }
  navigateStore.setPages(pages);
};

watch(() => route.fullPath, setNavigation);

watch([storeCompex, house], ([compVal, houseVal]) => {
  setNavigation()
  
}, { immediate: true });
</script>

<style lang="scss" scoped>
.iframe-navbar-new {
  /* position: absolute; */
}
.defaultLayout {
  width: 100%;
  height: 100vh;
  display: flex;
  /* grid-template-columns: 110px 1fr;
  grid-template-rows: 139px 1fr; */
  // grid-row-gap: 30px;
  background-color: #f3f3f3;
  .layout {
    display: flex;
    flex-direction: column;
  }
  .header {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    grid-column: 2;
    grid-row: 1;

    &__top {
      width: 100%;
      height: 74px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 35px;
    }
    &__title {
      font-size: 32px;
    }
    &__bottom {
      width: 100%;
      height: 64px;
      border-top: 1px solid #f3f3f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 35px;
    }
  }

  .navbar {
    width: 100%;
    height: 100%;
    padding: 18px 0;
    background-color: var(--main-color);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    grid-row: span 2;
    grid-column: 1;

    &__logo {
      width: 74px;
      height: 74px;
      background-color: #fbe6d3;
      margin-bottom: 20px;
    }
  }

  main {
    position: relative;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 30px 30px 50px 30px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>

