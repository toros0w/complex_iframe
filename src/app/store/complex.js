import { defineStore } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";
import api from '@/shared/api'
import { useRoute, useRouter } from "vue-router";
import { copyObject } from "@/shared/utils/util";

const INITIAL_FILTERS = {
  selectedTypes: [],

  selectedMetros: [],
  selectedRayons: [],
  selectedComplexes: [],
  selectedDecorations: [],
  selectedComplexTypes: [],
  address: '',
  period: '',
  area_from: '',
  area_to: '',
  rooms: [],
  useSquarePrice: false,
  rayons: [],
  squareKitchen_min: '',
  squareKitchen_max: '',
  complexes: [],
  // area_from: '',
  // area_to: '',
  floor_from: '',
  floor_to: '',
  price_from: '',
  price_to: '',
  // 'metros': [],
  // 'period': 0,
  // 'complexes': [],
  // 'decorations': [],
  // 'builders': [],
  // 'types_room': [],
  // 'types_complex': [],
  // 'payment_types': [],
  // 'decoration_types': [],
  // 'sq_all_do': null,
  // 'sq_all_ot': null,
  // 'flat_floor_ot': null,
  // 'flat_floor_do': null,
  // 'stoim_ot': null,
  // 'stoim_do': null,
  // 'region_id': 0,
  // 'country_id': 0,
}

export const useComplexStore = defineStore("object", () => {
  const route = useRoute()
  const router = useRouter()
  const agencyName = ref(null);
  const agencyLogo = ref(null);
  const agencyPhone = ref(null);
  const activeType = ref("tile");
  const activePage = ref(1);
  const totalRecords = ref(0);
  const allPages = ref(0);
  const load = ref(true);
  const archiveLoad = ref(true);
  const complexes = ref({});
  const loaders = reactive({
    list: true,
    archivedList: true
  })

  const archivedComplexes = ref([])
  const archivedAllPages = ref(0)
  const archivedTotalRecords = ref(0);
  const activeComplex = ref(null)

  const rowsComplex = ref(10);
  const types = ref({
    'list': "Список",
    'tile': "Плитка",
    // 'table': "Таблица",
  });

  const setActiveComplex = (complex) => {
    activeComplex.value = complex
  }

  const parseQueryFilters = () => {
    const multipleKeys = ['selectedTypes', 'selectedComplexTypes', 'rooms', 'selectedMetros', 'complexes', 'selectedDecorations']
  
  
    Object.entries(route.query).forEach(([key, value]) => {
      if (multipleKeys.includes(key)) {
        if (Array.isArray(value)) {
          value = value.map((num) => {
            if (!isNaN(+num) && key != 'rooms') {
              return parseInt(num)
            }
            
            return num
          });
        }
  
        if (typeof value == 'string' ) {
          if (!isNaN(+value) && key != 'rooms') {
            value = [parseInt(value)];
          } else {
            value = [value];
          }
        }
      }
  
      if (key == 'rayons') {
        if (Array.isArray(value)) {
            value = value.map((num) => num);
        }
    
        if (typeof value == 'string' ) {
          value = [value];
        }
      }
  
      complex_filter.value[key] = value == 'true' ? true : value ==  'false' ? false : value 
    })

    if (route.query.page) {
      activePage.value = +route.query.page
    }
  }
  

  onMounted(parseQueryFilters)

  const changeActiveType = (type) => {
    activeType.value = type;
  };

  

  const clearFilters = () => {
    router.replace({query: {}});
    complex_filter.value = copyObject(INITIAL_FILTERS)
  }

  const complex_filter = ref(copyObject(INITIAL_FILTERS));

  watch(activePage, (newValue) => {
    
    if (['main', 'complexes-list'].includes(route.name) && !loaders.list) {
      getListComplex();
    }
    if (route.name == 'archive-main' && !loaders.archivedList) {
      getArchivedListComplex()
    }
  })

  watch(() => route.name, (page, oldPage) => {
    if (page == oldPage) return;

    if (page == 'archive-main') {
      getArchivedListComplex()
    } else if (page == 'main') {
      getListComplex()
    }
  }, { deep: true })

async function getListComplex(withPage = true){
    loaders.list = true;
    if (!withPage) activePage.value = 1
    api.searchComplexes(
      {
        ...complex_filter.value,
        address: complex_filter.value.address.trim()
      },
      activePage.value,
      !route.meta.isViewPage
    )
      .then((response) => {
          var res = response.data;
          agencyName.value = res.agency_name;
          agencyLogo.value = res.agency_logo;
          agencyPhone.value = res.agency_phone;
          complexes.value = res.list;
          totalRecords.value = res.total;
          allPages.value = res.allPages;

          const containers = document.getElementsByTagName('main');

          if (containers) {
            containers[0].scrollTo({ top: 0, behavior: 'smooth'})
          }
        
      })
      .catch(function(error) {
          console.log(error);
      })
      .finally(() => {
        loaders.list = false
      });
};

async function getArchivedListComplex(withPage = true){
  loaders.archivedList = true
  if (!withPage) activePage.value = 1
  api.searchComplexes(
    {
      ...complex_filter.value,
      address: complex_filter.value.address.trim(),
      is_archive: true
    },
    activePage.value,
    !route.meta.isViewPage
  )
    .then((response) => {
        var res = response.data;
        agencyName.value = res.agency_name;
        agencyLogo.value = res.agency_logo;
        agencyPhone.value = res.agency_phone;
        archivedComplexes.value = res.list;
        archivedTotalRecords.value = res.total;
        archivedAllPages.value = res.allPages;

        const containers = document.getElementsByTagName('main');

        if (containers) {
          containers[0].scrollTo({ top: 0, behavior: 'smooth'})
        }
      
    })
    .catch(function(error) {
        console.log(error);
    })
    .finally(() => {
      loaders.archivedList = false
    });
};

  return {
    activeType,
    types,
    changeActiveType,
    activePage,
    getListComplex,
    getArchivedListComplex,
    archivedAllPages,
    archivedTotalRecords,
    archivedComplexes,
    rowsComplex,
    allPages,
    complex_filter,
    complexes,
    load,
    loaders,
    archivedListLoading: loaders.archivedList,
    archiveLoad,
    totalRecords,
    activeComplex,
    setActiveComplex,
    clearFilters,
    agencyName,
    agencyLogo,
    agencyPhone
  };
});