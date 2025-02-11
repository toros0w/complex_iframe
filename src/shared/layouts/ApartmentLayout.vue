<template>
  <div class="viewLayout" v-if="apartment">
    <header class="header">
      <div class="header__top">
        <div class="header__title">{{room_types[apartment.type]}} - {{ apartment.number }}</div>
      </div>
      <div class="header__bottom">
        <div class="new">
          <div
            class="jw__page__tabs type__tabs"
            style="display: flex; padding: 0 !important"
          >
            <template v-if="!hasRestrictedAccess && !hasDeveloper">
              <a href="/sale.php" class="tab"> <span>Продажа</span> </a>
              <a href="/main.php" class="tab"> <span>Аренда</span> </a>
            </template>
            <template v-else-if="!hasDeveloper">
              <span class="tab tooltip tooltip-effect" style="background-color: rgb(235, 235, 228)" >
                <span class="tooltip-item" style="color: darkgray; border-bottom: none" >Продажа</span >
                <em style="font-style: normal" class="tooltip-content tt-pdf clear" ><b class="tooltip-text">Доступно в платной версии</b></em>
              </span>
              <span class="tab tooltip tooltip-effect" style="background-color: rgb(235, 235, 228)" >
                <span class="tooltip-item" style="color: darkgray; border-bottom: none" >Аренда</span >
                <em style="font-style: normal" class="tooltip-content tt-pdf clear" ><b class="tooltip-text">Доступно в платной версии</b></em >
              </span>
            </template>
            <a href="/newbuildings.php" class="tab">
              <span>Новостройки</span>
            </a>
            <template v-if="!hasRestrictedAccess && !hasDeveloper">
              <a href="/complexes/#/view" class="tab active">
                <span>Новостройки компании</span>
              </a>
              <a href="/add-object.php" class="tab tab__new-object" style="padding-left: 35px" >
                <i class="ti-plus"></i>
                <span>Новый объект</span>
              </a>
            </template>
            <template v-else-if="hasDeveloper">
              <a href="/complexes/#/view" class="tab active">
                <span>Новостройки компании</span>
              </a>
            </template>
            <template v-else>
              <span class="tab tooltip tooltip-effect" style="background-color: rgb(235, 235, 228);">
                  <span class='tooltip-item' style="color: darkgray;border-bottom: none;">Новостройки компании</span>
                  <em style="font-style: normal;" class="tooltip-content tt-pdf clear"><b class="tooltip-text">Доступно в платной версии</b></em>
              </span>
              <span class="tab tooltip tooltip-effect" style="background-color: rgb(235, 235, 228);">
                  <span class='tooltip-item' style="color: darkgray;border-bottom: none;">Новый объект</span>
                  <em style="font-style: normal;" class="tooltip-content tt-pdf clear"><b class="tooltip-text">Доступно в платной версии</b></em>
              </span>
            </template>
            <a v-if="!hasDeveloper" href="/find-objects.php?operation_type=1" class="tab">
              <span>Поиск на карте</span>
            </a>
          </div>
        </div>
      </div>
    </header>
    <div class="navbar">
      <div class="nav__logo">
        <img src="" alt="" />
      </div>
      <button class="nav__btnAdd"></button>
      <nav class="nav">
        <ul class="nav__list">
          <li class="list__item">
            <RouterLink to="/view"></RouterLink>
          </li>
        </ul>
      </nav>
    </div>
    <main class="w-full">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { room_types } from "@/shared/utils/util";

const props = defineProps(['apartment'])
const hasDeveloper = ref(!!Number(document.getElementById('has_developer')?.value))

</script>

<style lang="scss">
.viewLayout {
  width: 100%;
  height: 100vh;
  overflow: auto;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 110px 1fr;
  grid-template-rows: 139px 1fr;
  // grid-row-gap: 30px;
  background-color: #f3f3f3;
  .header {
    width: 100%;
    height: 100%;
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

      // svg {
      //   display: unset;
      // }

      // .new .jw__page__tabs .tab.active {
      //   background: none;
      // }
      // .new .type__tabs .tab.active {
      //   background: none;
      // }
      // .jw__page__tabs .tab {
      //   font-size: 16px;
      //   font-family: 'Lato', sans-serif;
      //   /* padding: 13px 0 18px; */
      // }
      // .jw__page__tabs .tab span,
      // .jw__page__tabs .tab_pasive span {
      //   border-bottom: 1px solid #bdbdbd;
      // }
      // .new .jw__page__tabs .tab.active span {
      //   position: relative;
      //   color: #000;
      // }
      // .jw__page__tabs .tab,
      // .jw__page__tabs .tab_pasive {
      //   position: relative;
      //   display: inline-block;
      //   padding: 19px 0 23px;
      //   margin-right: 20px;
      //   cursor: pointer;
      //   border: 0;
      //   // font-size: 17px;
      // }
      // a.active {
      //   background-color: rgb(69, 90, 100);
      //   box-shadow: inset 0px 1px 1px 0px rgba(250, 250, 250, 0.2);
      //   color: white;
      //   border-radius: 4px;
      //   font-weight: bold;
      //   padding: 5px;
      // }
      // .new .jw__page__tabs .tab.active:after {
      //   content: "";
      //   position: absolute;
      //   height: 2px;
      //   width: 100%;
      //   bottom: -1px;
      //   left: 0;
      //   background: rgb(67, 160, 71);
      // }
      // .tab.tab__new-object:hover svg {
      //   fill: #237ef7;
      // }
      // .new .jw__page__tabs .tab.active span {
      //   border: none;
      // }

      // .new .tab.tab__new-object svg {
      //   left: 0;
      //   top: 50%;
      //   margin-top: -12px;
      // }

      // .tab.tab__new-object svg,
      // .tab_pasive.tab__new-object svg {
      //   position: absolute;
      //   left: 0;
      //   top: 50%;
      //   margin-top: -12px;
      //   font-size: 24px;
      //   color: #4caf50;
      // }

      // .new .type__tabs .tab.active:after {
      //   content: "";
      //   position: absolute;
      //   height: 2px;
      //   width: 100%;
      //   bottom: -1px;
      //   left: 0;
      //   background: rgb(67, 160, 71);
      // }
      // .tab.tab__new-object:hover svg {
      //  color: #237ef7;
      // }
      // .jw__page__tabs .tab:hover span {
      //   color: #237ef7;
      //   border-color: #3a8efa;
      // }
    }
  }

  .navbar {
    width: 100%;
    height: 100%;
    padding: 18px 0;
    background-color: #212121;
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
    padding: 0 !important;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>

