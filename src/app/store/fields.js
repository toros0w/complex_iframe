import { defineStore } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";
import api from '@/shared/api'
import { useRoute } from "vue-router";

export const useFieldsStore = defineStore("fields", () => {
  const route = useRoute()
  const decorations = reactive([])
  const complexes_types = reactive([])
  const complex_suggestions = reactive([])
  const countries = reactive([])
  const metros = reactive([])
  const windowsPlacements = reactive([])
  const rf_regions = reactive([])
  const rayons = reactive([])
  const complex_status  = reactive([])
  const currentRegionInfo = reactive({
    region_id: null,
    region_id_user: null,
    kladr: null,
    label: null
  })
  const regionsInfo = reactive({
    regions: [],
    regions_list: {}
  })
  setTimeout(() => {
    const colors = JSON.parse(localStorage.getItem('colors'))
    const resColor = colors.color_reserved
    const freeColor = colors.color_free
  
    complex_status.value = [
      {
        name: 'Свободные',
        status: 'available',
        color: freeColor,
      },
      {
        name: 'Забронированные',
        status: 'reservation',
        color: resColor,
      },
      {
        name: 'Проданные',
        status: 'sold',
        color: '#757575',
      },
      {
        name: 'Недоступные',
        status: 'not_for_sale',
        color: '#dedede',
      },
    ]
  
    console.log(complex_status, 'СТАТУСЫ СПУСТЯ СЕКУНДУ')
  }, 1000)
  
  const builders = reactive({
    list: [],
    options: []
  })

  // const fetchComplexStatuses = () => {
  //   api.getComplexStatus().then((response) => {
  //     if (response.data) {
  //       complex_status.push(...response.data)
  //     }
  //   })
  // }

  const refetchDecorationsList = () => {
    api.getDecorations()
    .then((response) => {
      decorations.splice(0)
      decorations.push(...response.data);
    })
  }

  const fetchComplexSuggestions = (isViewPage) => api.getComplexSuggestions(isViewPage)
    .then((response) => {
      complex_suggestions.push(...response.data)
    })

  onMounted(() => {
      api.getDecorations()
        .then((response) => {
          decorations.push(...response.data);
        })

      api.getComplexTypes()
        .then((response) => {
          complexes_types.push(...response.data)
        })

      api.getCountry()
        .then((response) => {
          // console.log(response, 'responseresponseresponseresponseresponse');
          
          countries.push(...response.data?.country)
        })

      api.getRFRegions()
        .then((response) => {
          const currentRegion = response.data.regions.find(region => region.code == response.data.region_id_user)

          if (currentRegion) {
            rayons.push(...currentRegion.rayons)
          }

          api.getMetro(response.data.region_id_user).then(metrosResponse => {
            metros.push(...metrosResponse.data)
          })

          currentRegionInfo.region_id = parseInt(response.data.region_id_user)
          currentRegionInfo.region_id_user = parseInt(response.data.region_id_user);

          regionsInfo.regions.push(...response.data.regions)
          regionsInfo.regions_list = response.data.regions_list

          currentRegionInfo.kladr = regionsInfo.regions_list[currentRegionInfo.region_id].kladr
          currentRegionInfo.label = regionsInfo.regions_list[currentRegionInfo.region_id].label
        })
      
      api.getWindowsPlacements()
        .then((response) => {
          windowsPlacements.push(...response.data)
        })

      api.getBuilders()
        .then((response) => {
          builders.list = response.data.list
          builders.options.push(...response.data?.options)
        })

      
      fetchComplexSuggestions(!route.meta.isViewPage)

      // fetchComplexStatuses()
  })

  const changeRegionInfoRegionId = (payload) => {
    currentRegionInfo.region_id = payload

    api.getMetro(currentRegionInfo.region_id)
      .then((response) => {
        metros.splice(0)
      })
  }

  const metroListChanged = (region_id) => {
    api.getMetro(region_id)
      .then((response) => {
        metros.splice(0)
        metros.push(...response.data)
      })
  }

  watch(() => route.meta.isViewPage, (newValue, prevValue) => {
    if (newValue !== prevValue) {
      fetchComplexSuggestions(!newValue)
    }
  }, { deep: true })

  return {
    decorations,
    complexes_types,
    countries,
    rf_regions,
    rayons,
    metros,
    currentRegionInfo,
    regionsInfo,
    windowsPlacements,
    complex_suggestions,
    changeRegionInfoRegionId,
    metroListChanged,
    builders,
    complex_status,
    refetchDecorationsList
  };
});