<template>
  <teleport to="body">
    <AdvertRoomsWindow v-if="domclickAdvert" :isOpenAdvertRoomsWindow="isOpenAdvertDomclickWindow"
      @close="handleCloseDomclickAdvert" advertType="domclick" />
    <AdvertRoomsWindow v-if="avitoAdvert" :isOpenAdvertRoomsWindow="isOpenAdvertAvitoWindow"
                       @close="handleCloseAvitoAdvert" advertType="avito" />
    <AdvertRoomsWindow v-if="cianAdvert" :isOpenAdvertRoomsWindow="isOpenAdvertCianWindow"
                       @close="handleCloseCianAdvert" advertType="cian" />
    <AdvertRoomsWindow v-if="yaAdvert" :isOpenAdvertRoomsWindow="isOpenAdvertYaWindow"
                       @close="handleCloseYaAdvert" advertType="ya" />
  </teleport>
  <div class="viewHome__head flex flex-col w-full z-10 pt-5" :class="[
    'relative bg-white mb-7.5',
    filters.view.value === 'facades' ? 'px-[30px]' : '',
  ]">
    <BurgerIcon v-if="showBurger" class="burger-icon" @click="openIframeNavbar"/>
    <Navigation v-if="filters.view.value === 'list'"/>
    <div class="viewHome__title text-[32px]" v-if="filters.view.value === 'list'">Список квартир</div>
    <div class="viewHome__title text-[32px]" v-else>Просмотр объектов</div>
    <div class="head__top flex flex-row items-center">
      <FilterWidget :filters="filters" :filteredCount="filteredCount" style="width: 100%;" />


      <div class="filter-bottom">

        <button style="border-radius: 6px; height: 47px; border-color: #c68484;"
          class="btnClearFilters bg-white border border-red text-sm px-4 py-2.5 text-red rounded-[30px] h-max self-end"
          @click="clearFilters()">
          Очистить фильтры
        </button>

        <!-- <div v-if="show_change_view" class="filters__view flex flex-col ml-auto z-20 self-start">
          <label
            class="mb-2"
            :class="[
              filters.view?.value === 'facades' ? 'text-white' : 'text-grey-900',
            ]"
            >Вид</label
          >
          <Dropdown v-model="filters.view" :options="viewGrid" optionLabel="name" placeholder="Select a City"
            class="w-full md:w-14rem" :pt="{
              root: {
                class: [
                  '!rounded !border !border-grey-400 !p-3 !w-[165px] !h-max',
                ],
              },
              input: {
                class: [
                  '!flex !flex-row !items-center !p-0 !text-sm !leading-none !text-grey-900 !mr-3 !overflow-visible',
                ],
              },
              wrapper: {
                class: ['!p-0'],
              },
              item: {
                class: ['!text-sm'],
              },
            }">
            <template #value="slotProps">
              <div class="icon mr-2 2xl:w-5 2xl:h-5 xl:w-4 xl:h-4 min-w-[20px] min-h-[20px]">
                <component :is="IconComponent" :mainColor="mainColor" :key="props.filters.view.icon" class="h-full w-full" />
              </div>
              <div class="text">{{ slotProps.value.name }}</div>
            </template>
            <template #dropdownicon>
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.76693 9.2418L10.0003 12.4752L13.2336 9.2418C13.5586 8.9168 14.0836 8.9168 14.4086 9.2418C14.7336 9.5668 14.7336 10.0918 14.4086 10.4168L10.5836 14.2418C10.2586 14.5668 9.73362 14.5668 9.40862 14.2418L5.58359 10.4168C5.25859 10.0918 5.25859 9.5668 5.58359 9.2418C5.90859 8.92513 6.44193 8.9168 6.76693 9.2418Z"
                  fill="#666666" />
              </svg>
            </template>
            <template #option="slotProps">
              <div class="item flex flex-row items-center">
                <div class="item__icon mr-2 w-5 h-5">
                  <component
                    :is="defineAsyncComponent(() =>
                      import(`@/shared/assets/icons/viewGrid/${slotProps.option.icon}.vue`)
                    )"
                    :mainColor="mainColor"
                    class="h-full w-full"
                  />
                </div>
                <div class="item__text">{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
        </div> -->
      </div>
    </div>

    <div v-if="!route.meta.isViewPage" class="w-full items-center mb-7.5 complexItem__btnMenu">
      <button style="border-radius: 6px; height: 47px; float: right; border-color:var(--main-color);"
        class="btnClearFilters bg-white border text-sm px-4 py-2.5 rounded-[30px] h-max self-end"
              @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
        Реклама
      </button>
      <Menu :pt="{ root: { class: ['custom-p-menu'] } }" ref="menuItems" id="overlay_menu" :model="items" :popup="true" />
    </div>

    <div
      class="table__infoBlock w-full flex flex-row items-center bg-grey-100 2xl:gap-x-12.5 xl:gap-x-10 mt-7.5"
      :class="[filters.view?.value === 'facades' ? 'hidden' : '']" style="justify-content: space-between;">
      <div style="position: relative;">
        <div ref="statusesContainer" class="custom-status-container"
          style="display: flex; flex-grow: 1; gap: 20px; overflow-y: auto; padding: 10px;">
          <div v-for="(item, index) in complex_status.value" :key="index" class="infoItem flex flex-row items-center" style="width: fit-content;">
            <div class="infoItem__color w-4.5 h-4.5 rounded mr-2.5" :style="'background-color:' + item.color"></div>
            <div class="infoItem__text 2xl:text-base xl:text-sm text-grey-900" style="text-wrap: nowrap; font-size: 14px">
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- <div ref="shadowContainer"
          style="position: absolute; right: 0px; height: 45px; width: 300px; top: 0; background: linear-gradient(90deg, rgba(167, 167, 167, 0) 35%, rgb(0 0 0 / 23%) 100%); border-radius: 6px;">
        </div> -->
      </div>
      <!-- <div :style="filters.view?.value === 'grid' ? 'flex-direction: column' : ''"
        class="table__viewPrice ml-auto flex flex-row items-center gap-2" v-if="filters.view?.value === 'grid'">
        <InputSwitch v-model="filters.hiddenPrice" />
        <label style="text-align: center" for="onlyFree" class="2xl:text-base xl:text-sm text-grey-900">Скрыть
          стоимость</label>
      </div> -->
      <div class="hidden xl:flex flex-row items-center gap-2">
        <InputSwitch v-model="filters.onlyFree" />
        <label for="onlyFree" class="2xl:text-base xl:text-sm text-grey-900" style="padding-right: 40px;">Только свободные</label>
      </div>
    </div>
    <div v-if="props.filters.view.value !== 'facades'" class="xl:hidden flex flex-row items-center gap-2 mt-2">
      <InputSwitch v-model="filters.onlyFree" />
      <label for="onlyFree" class="2xl:text-base xl:text-sm text-grey-900">Только свободные</label>
    </div>
    <!-- <div :style="filters.view?.value === 'grid' ? 'flex-direction: column' : ''"
      class="table__onlyFree ml-auto flex flex-row items-center gap-2">
      <InputSwitch v-model="filters.onlyFree" />
      <label style="text-align: center" for="onlyFree" class="2xl:text-base xl:text-sm text-grey-900">Только
        свободные</label>
    </div> -->
    <!-- <div
      :class="[
        'head__btnsChangeSaid flex flex-row items-center gap-x-7.5 mt-5',
      ]"
      v-if="filters.view?.value === 'facades'"
    >
      <button
        :class="[
          viewFacadesSaid === 'park'
            ? 'bg-green text-white'
            : 'bg-white text-black',
          'px-4 py-2.5 rounded-3xl shadow-[2px_4px_4px_0px_rgba(0,_0,_0,_0.25)]',
        ]"
        @click="viewFacadesSaid = 'park'"
      >
        Вид со стороны парка
      </button>
      <button
        :class="[
          viewFacadesSaid === 'left'
            ? 'bg-green text-white'
            : 'bg-white text-black',
          'px-4 py-2.5 rounded-3xl shadow-[2px_4px_4px_0px_rgba(0,_0,_0,_0.25)]',
        ]"
        @click="viewFacadesSaid = 'left'"
      >
        Вид со стороны парка
      </button>
    </div> -->
  </div>
</template>

<script setup>
import eventBus from "@/eventBus";
import FilterWidget from "@/widgets/homePage/viewHome/filtersWidget.vue";
//import { IFilters } from "@/widgets/homePage/viewHome/types";
import AdvertRoomsWindow from "@/widgets/homePage/advert/advertRoomsWindow.vue";
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, toRefs, watch, onUnmounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import Menu from 'primevue/menu'
import Navigation from "@/components/Navigation.vue";
import BurgerIcon from "@/components/BurgerIcon.vue";

const emits = defineEmits(
  ["update:isOpenFiltersMenu",
    "update:filters",
    "update:viewType",
    "openIframeNavbar"]
);

const statusesContainer = ref(null)
const shadowContainer = ref(null)

const isOpenAdvertDomclickWindow = ref(false);
const isOpenAdvertAvitoWindow = ref(false);
const isOpenAdvertCianWindow = ref(false);
const isOpenAdvertYaWindow = ref(false);
const domclickAdvert = ref(null)
const avitoAdvert = ref(null)
const cianAdvert = ref(null)
const yaAdvert = ref(null)
const navbarIsOpen = ref(false);
const showBurger = ref(false)
const windowWidth = ref(window.innerWidth)
const menuItems = ref();
const items = ref();
const colors = JSON.parse(localStorage.getItem('colors') || '{}');
const mainColor = colors.frame_color;
const IconComponent = ref(null);


console.log(mainColor, 'mainColorrrrrrrrrrrrr');



const route = useRoute()

const props = defineProps(
  {
    show_floors: Boolean,
    show_plans: Boolean,
    show_facades: Boolean,
    show_change_view: {
      type: Boolean,
      default: true
    },
    filters: Object,
    filteredCount: Number,
    complex_status: Array
  });
console.log(props.filters.view.value, 'props.filters.view');


const loadIconComponent = (iconName) => {
  IconComponent.value = defineAsyncComponent(() =>
    import(`@/shared/assets/icons/viewGrid/${iconName}.vue`)
  );
};

loadIconComponent(props.filters.view.icon);

watch(
  () => props.filters.view.icon,
  (newIcon) => {
    loadIconComponent(newIcon);
  }
);



const openIframeNavbar = () => {
  navbarIsOpen.value = true
  emits('openIframeNavbar')
}

watch(navbarIsOpen, (newV) => {
  console.log(newV, 'newVal');
  
})


// watch(props.complex_status, (newV) => {
//   console.log(newV, 'complex_statuscomplex_status');
  
// })

const updateWidth = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value <= 768) {
    showBurger.value = true   
  } else {
    showBurger.value = false
  }
}


onMounted(() => {
  window.addEventListener('resize', updateWidth)
  updateWidth()
  eventBus.$on('navbarIsOpened', onNavbarOpened)
  eventBus.$on('navbarIsClosed', onNavbarClosed)

})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  eventBus.$off('navbarIsClosed', onNavbarOpened)
  eventBus.$off('navbarIsClosed', onNavbarClosed)
})

const onNavbarOpened = () => {
  showBurger.value = false
  
}
const onNavbarClosed = () => {
  showBurger.value = true
  updateWidth()
}


const openDomclickAdvert = () => {
  isOpenAdvertDomclickWindow.value = !isOpenAdvertDomclickWindow.value
  domclickAdvert.value = {}
}

const openAvitoAdvert = () => {
  isOpenAdvertAvitoWindow.value = !isOpenAdvertAvitoWindow.value
  avitoAdvert.value = {}
}

const openCianAdvert = () => {
  isOpenAdvertCianWindow.value = !isOpenAdvertCianWindow.value
  cianAdvert.value = {}
}

const openYaAdvert = () => {
  isOpenAdvertYaWindow.value = !isOpenAdvertYaWindow.value
  yaAdvert.value = {}
}

const toggle = (event) => {
  event.stopPropagation()
  event.preventDefault();
  menuItems.value.toggle(event);
};

const viewFacadesSaid = ref("park");
const isOpenFiltersMenu = ref(false);
const { filters } = toRefs(props);

const handleCloseAvitoAdvert = () => {
  isOpenAdvertAvitoWindow.value = !isOpenAdvertAvitoWindow.value
  avitoAdvert.value = null
  eventBus.$emit('update-model')
}

const handleCloseCianAdvert = () => {
  isOpenAdvertCianWindow.value = !isOpenAdvertCianWindow.value
  cianAdvert.value = null
  eventBus.$emit('update-model')
}

const handleCloseYaAdvert = () => {
  isOpenAdvertYaWindow.value = !isOpenAdvertYaWindow.value
  yaAdvert.value = null
  eventBus.$emit('update-model')
}

const handleCloseDomclickAdvert = () => {
  isOpenAdvertDomclickWindow.value = !isOpenAdvertDomclickWindow.value
  domclickAdvert.value = null
  eventBus.$emit('update-model')
}

const viewGrid = computed(() => {
  return [
    {
      name: "Плитка",
      value: "tile",
      icon: "tile",
      visible: true,
    },
    {
      name: "Сетка",
      value: "grid",
      icon: "grid",
      visible: true,
    },
    {
      name: "Планировки",
      value: "layouts",
      icon: "layouts",
      visible: props.show_plans,
    },
    {
      name: "Этажи",
      value: "floors",
      icon: "floors",
      visible: props.show_floors,
    },
    {
      name: "Фасады",
      value: "facades",
      icon: "facades",
      visible: props.show_facades,
    },
    {
      name: "Список",
      value: "list",
      icon: "list",
      visible: true,
    },
  ].filter((view) => view.visible)
});

watch(isOpenFiltersMenu, (newV) => {
  emits("update:isOpenFiltersMenu", newV);
});

watch(viewFacadesSaid, (newV) => {
  emits("update:viewType", newV);
});


const handleWindowResize = () => {
  const hasHorizontalScrollbar = statusesContainer.value.scrollWidth > statusesContainer.value.clientWidth;

  // shadowContainer.value.style.display = !hasHorizontalScrollbar ? 'none' : 'block';
}

const handleStatusContainerScroll = () => {
  const scrollPercentage = 100 * statusesContainer.value.scrollLeft / (statusesContainer.value.scrollWidth - statusesContainer.value.clientWidth);

  if (scrollPercentage >= 35) {
    shadowContainer.value.style.background = `linear-gradient(90deg, rgba(167, 167, 167, 0) ${scrollPercentage}%, rgba(0, 0, 0, 0.23) 100%)`
  }

}

onUpdated(() => {
  handleWindowResize()
})
onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
  statusesContainer.value.addEventListener('scroll', handleStatusContainerScroll)

  handleWindowResize()

  items.value = [
    {
      items: [
        {
          label: 'Домклик',
          command: () => openDomclickAdvert()
        },
        {
          label: 'Авито',
          command: () => openAvitoAdvert()
        },
        {
          label: 'Циан',
          command: () => openCianAdvert()
        },
        {
          label: 'Яндекс',
          command: () => openYaAdvert()
        }
      ]
    }
  ]

})



onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize)
})


const clearFilters = () => {
  eventBus.$emit('clear-filters')
  // router.replace({ query: {} });
};
</script>

<style>
.viewHome__head .p-inputswitch.p-focus .p-inputswitch-slider {
  box-shadow: unset ;
}

.custom-status-container::-webkit-scrollbar-thumb:hover {
  background-color: #7e827e !important;
  cursor: pointer !important;
}
.custom-status-container {
  
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 10px;
  overflow-y: auto;
  
}

.head__top {
  width:calc(100vw - 350px);
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.filter-bottom {
  position: absolute;
  bottom: -15px;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.burger-icon {
  cursor: pointer;  
}

.btnClearFilters{
  width: 200px !important;
  min-width: 200px !important;
}

@media(max-width: 950px) {
  .filter-bottom {
  position: absolute;
  bottom: -48px;
  left: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  justify-content: flex-start;
  /* margin-bottom: 20px; */
}
}
 
@media (max-width: 1024px) {
  .table__infoBlock {
    margin-top: 60px;
    position: relative;
    /* flex-direction: column; */
    /* align-items: start; */
  }
  .table__onlyFree {
    /* position: absolute; */
    /* left: 0; */
    /* top: 65px; */
  }
}
@media (max-width: 600px) {
  .custom-status-container {
    display: grid!important;
    grid-template-columns: repeat(2, minmax(0, 1fr))!important;
    gap: 20px!important;
  }
}
@media (max-width: 410px) {
  .btnClearFilters {
    font-size: 13px;
  }
}

@media screen and (max-width:768) {
  .table__infoBlock{
    width: 100vw;
  }
  .head__top {
    width: 100vw;
  }
}
</style>
