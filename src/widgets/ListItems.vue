<template>
  <Teleport to="body">
    <Dialog v-model:visible="complexToArchive" modal header="Перенести Комплекс в архив?" :style="{ width: '25rem' }">
        <div class="flex justify-end gap-2">
            <Button type="button" label="Нет" severity="secondary" @click="complexToArchive = null"></Button>
            <Button type="button" label="Да" style="background-color: #4caf50; border: none;" @click="onComplexArchive"></Button>
        </div>
    </Dialog>
  </Teleport>
  <Teleport v-if="!route.meta.isViewPage" to="body">
    <FormAddComplex
      :isOpen="formEditComplexOpen"
      @closeModel="() => {
        formEditComplexOpen = !formEditComplexOpen
        complexToEdit = null
      }"
      :complex="complexToEdit"
      @update-complex="onComplexUpdate"
    />
  </Teleport>
  <div class="wrapper">
    <Panel collapsed toggleable>
      <template #togglericon>
        <div @click="collapsed = !collapsed" style="color: #757575">{{!collapsed ? 'Развернуть форму' : 'Свернуть форму'}}</div>
        <SearchArrow />
      </template>
      <SearchForm @clear="complexHook.clearFilters" :filter="complex_filter" @onSubmit="() => complexHook.getListComplex(false)" />
    </Panel>
    <div :class="['listItems', `listItems--${activeType}`]">
      <ComplexItem
        :complex="complex"
        v-for="(complex) in complexes"
        :onComplexEdit="() => {
          complexToEdit = complex
          formEditComplexOpen = true
        }"
        :onComplexArchive="() => complexToArchive = complex"
        :key="complex.id"
        :class="[
          activeType === 'tile'
            ? 'medium'
            : activeType === 'table'
            ? 'small'
            : '',
        ]"
      />
    </div>
      <Paginator 
        v-if="allPages>1" 
        v-model:first="first" 
        style="margin: 20px 0;"
        @update:first="clickPaginator"
        :template="{
            '640px': 'PrevPageLink CurrentPageReport NextPageLink',
            '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
            '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
            default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput'
        }"
        :rows="rowsComplex"
        :totalRecords="totalRecords"
      >
      </Paginator>

    <template v-if="!loaders.list && !totalRecords">
      <NoResultsForDeveloper v-if="hasDeveloper && route.meta.isViewPage" />
      <NoResults v-else />
    </template>

  </div>
</template>

<script setup>
import { useComplexStore } from "@/app/store/complex";
import SearchForm from "@/components/SearchForm.vue"
import ComplexItem from "@/entities/complexItem.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, watch, nextTick } from "vue";
import SearchArrow from "@/shared/assets/icons/search-arrow.vue"
import { useRoute, useRouter } from "vue-router";
import Panel from "primevue/panel";
import NoResults from "@/components/NoResults.vue"
import FormAddComplex from "./forms/formAddComplex.vue";
import api from "@/shared/api";
import { useFieldsStore } from "@/app/store/fields";
import NoResultsForDeveloper from "@/components/NoResultsForDeveloper.vue";
const route = useRoute()
const router = useRouter()

const hasDeveloper = ref(!!Number(document.getElementById('has_developer')?.value))
const collapsed = ref(false)

const complexToArchive = ref(null)

const complexHook = useComplexStore();
const {
  rowsComplex,
  totalRecords,
  allPages,
  activeType,
  complexes,
  activePage,
  complex_filter,
  archivedTotalRecords,
  loaders,
  archiveLoad,
} = storeToRefs(complexHook);
const formEditComplexOpen = ref(false)
const complexToEdit = ref(null)
const first = ref(0);
const fieldsStore = useFieldsStore()

function clickPaginator(){
  var pageNew = parseInt((first.value/rowsComplex.value) + 1);
  // emits('onPage', pageNew)
  activePage.value = pageNew;
  router.replace({ query: { ...route.query, page: activePage.value }})
}

const onComplexUpdate = (updatedComplex) => {
  Object.keys(complexes.value).forEach((complexKey) => {
    if (complexes.value[complexKey].id == updatedComplex.id) {
      complexes.value[complexKey] = updatedComplex
    }
  })
  complexToEdit.value = null
}

const onComplexArchive = () => {
  api.archiveComplex({ complex_id: complexToArchive.value.id, archive: true })
    .then((response) => {
      var res = response.data;
      if(res.result=='done'){
        complexHook.getListComplex()
        archivedTotalRecords.value = archivedTotalRecords.value + 1
        complexToArchive.value = null
      }
    })
}


watch(
  complex_filter,
  (newV) => {
    if (newV) {
      const queryParams = {
        selectedMetros: newV.selectedMetros,
        selectedRayons: newV.selectedRayons,
        selectedTypes: newV.selectedTypes,
        complexes: newV.complexes,
        rooms: newV.rooms,
        useSquarePrice: newV.useSquarePrice,
        rayons: newV.rayons,
        squareKitchen_min: newV.squareKitchen_min,
        squareKitchen_max: newV.squareKitchen_max,
        selectedComplexes: newV.selectedComplexes,
        selectedDecorations: newV.selectedDecorations,
        selectedComplexTypes: newV.selectedComplexTypes,
        address: newV.address,
        period: newV.period,
        area_from: newV.area_from,
        area_to: newV.area_to,
        floor_from: newV.floor_from,
        floor_to: newV.floor_to,
        price_from: newV.price_from,
        price_to: newV.price_to,
      }
  
      nextTick(() => {
        router.replace({ query: queryParams })
      })
    }
  },
  { deep: true }
);

// const parseQueryFilters = () => {
//   const multipleKeys = ['selectedTypes', 'selectedComplexTypes', 'rooms', 'rayons', 'selectedMetros', 'complexes', 'selectedDecorations']


//   Object.entries(route.query).forEach(([key, value]) => {
//     if (multipleKeys.includes(key)) {
//       if (Array.isArray(value)) {
//         value = value.map((num) => {
//           if (!isNaN(+num)) {
//             return parseInt(num)
//           }

//           return num
//         });
//       }

//       if (typeof value == 'string' ) {
//         if (!isNaN(+value)) {
//           value = [parseInt(value)];
//         } else {
//           value = [value];
//         }
//       }
//     }

//     complex_filter.value[key] = value == 'true' ? true : value ==  'false' ? false : value 
//   })
// }

onMounted(() => {
  first.value = (activePage.value - 1) * rowsComplex.value

  fieldsStore.refetchDecorationsList()
})


</script>

<style scoped lang="scss">

.listItems {
  width: 100%;
  height: max-content;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
  @apply bg-grey-200;
  overflow-y: none;
  overflow-x: hidden;

  &.listItems--tile {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 28px;
  }

  .p-paginator-bottom {
    border: none !important;
  }

  .p-paginator {
    display: flex;
    /*justify-content: flex-end;*/
    align-items: center;
    column-gap: 10px;
    padding: 0;
    padding-top: 10px;
    padding-bottom: 10px;

    .p-dropdown {
      height: 37px;
    }
    .p-paginator-page-input { 
      .p-inputtext {
        max-width: 4rem;
      }
    }
  }
  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last {
    width: 37px !important;
    height: 37px !important;
    padding: 10px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    border-radius: 3px !important;
    border: 1px solid #dedede !important;
    margin: 0 !important;
    min-width: 0 !important;

    svg {
      width: 16px;
      height: 16px;
    }
  }
  .p-paginator-prev {
    margin-right: 10px;
  }
  .p-paginator-next {
    margin-left: 10px;
  }
  .p-paginator-pages {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .p-paginator-page {
      height: auto !important;
      min-height: 37px !important;
      min-width: 37px !important;
      padding: 10px !important;
      border-radius: 3px !important;
      border: 1px solid #dedede !important;
      box-shadow: none !important;
      &.p-highlight {
        background: #4caf50 !important;
        color: #ffffff !important;
      }
    }
  }

  @media screen and (max-width: 1600px) {
    &.listItems--tile {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>

<style>
.wrapper {
  width: 100%;
}

.wrapper .p-panel.p-panel-toggleable .p-panel-header {
  justify-content: center;
  border-radius: unset;
  padding: 12px 35px 15px;
  margin: 0;
  text-align: center;
  font-size: 15px;
  color: #757575;
  background: -webkit-linear-gradient(top, #f8f8f8, #fff);
  border-bottom: 1px solid #dedede;
}

.wrapper .p-panel.p-panel-toggleable .p-panel-header button {
  cursor: pointer;
  font-size: 15px;
  display: flex;
  gap: 5px;
}

.wrapper .p-panel.p-component.p-panel-toggleable {
  margin-bottom: 15px;
}

.wrapper .p-panel .p-panel-header .p-panel-header-icon {
  width: unset;
  height: unset;
  border-radius: unset;
}

.wrapper .p-panel-header-icon > svg {
  transition: 0.2s ease-in-out;
}

.wrapper .p-panel-header-icon[aria-expanded="true"] > svg {
  rotate: 180deg;
}

.defaultLayout main, .viewLayout main {
  padding-top: 0;
}  

.wrapper .p-panel.p-panel-toggleable .p-panel-header button:hover {
  color: #6c757d;
  border: 0 none;
  background: transparent;
}

.p-panel .p-panel-header .p-panel-header-icon:focus {
  box-shadow: unset !important;
}

.p-submenu-header {
  display: none !important;
}

.p-dialog-header-icons button{
  box-shadow: unset !important;
}
</style>