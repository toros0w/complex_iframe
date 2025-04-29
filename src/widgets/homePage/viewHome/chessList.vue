<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[40px]">
    <ApartmentIframe 
    v-for="room in filteredRooms" 
    :key="room.id" 
    :room="room"
    :decorations="props.decorations"
    :windowsPlacements="props.windowsPlacements"
    @openApartment="(apartment) => handleOpenApartment(apartment)"
    />
  </div>
</template>

<script setup>
// import DataTable from "primevue/datatable";
// import Column from "primevue/column";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { formatNumber, room_types } from "@/shared/utils/util";
import { useRoute, useRouter } from "vue-router";
import eventBus from "@/eventBus";
import ApartmentIframe from "@/pages/ApartmentIframe.vue";
const emits = defineEmits(
  ["update:is-open-window", 'openApartment']
);

const handleOpenApartment = (apartment) => {
  emits('openApartment', apartment);
}

const props = defineProps({
  entrances: Array,
  decorations: Array,
  windowsPlacements: Array,
  openedApartment: Boolean,
})

const pdfButton = ref({}) 
const router = useRouter();
const route = useRoute()

const apartments = computed(() => (
  props.entrances.reduce((accumulator, currentEntrance) => {
    currentEntrance.floors.forEach(floor => {
      accumulator.push(...floor.rooms.map(room => {
        room.euroPlan = room.layout_feature === "european_layout"
        room.studio = room.layout_feature === "studio"
        room.freePlane = room.layout_feature === "available"
        room.formatFile = "pdf"

        return room
      }))
    });

    return accumulator
  }, [])
))


const testFunc = (apartment) => {
  console.log(apartment);
  
} 
const colors = computed(() => {
  const colors = JSON.parse(localStorage.getItem('colors'))
  
  
  return {
    available: colors?.color_free || '#000',
    reservation: colors?.color_reserved || '#000',
    not_for_sale: '#dedede',
    sold: '#757575'
  }
})




const handleHouseClick = (event, house_id) => {
  event.stopPropagation()
  if (route.params.house_id) return;

  const routeData = router.resolve({path: `home/${house_id}`, query: route.query });
  window.open(routeData.href, '_blank');
}

const getDecoration = (decoration_id) => {
  if (!decoration_id || !props.decorations) return ''

  return props.decorations.find((decoration) => decoration.code == decoration_id)?.name
}

const getWindowsPlacement = (windows_placement_id) => {
  if (!windows_placement_id || !props.windowsPlacements) return ''

  return props.windowsPlacements.find((windowsPlacement) => windowsPlacement.id == windows_placement_id)?.name
}

const filteredRooms = computed(() => {
  return apartments.value.filter(room => room.visible)
})
console.log(filteredRooms, 'rooms');


const styleDataTabel = ref({
  paginator: {
    class: ["pani"],
  },
  footer: {
    class: ["text-sm"],
  },
});
const styleColumn = ref({
  headerCell: {
    class: ["!bg-[#F3F3F3]"],
  },
  headerContent: {
    class: ["font-light text-center text-sm flex justify-center"],
  },
  bodyCell: {
    class: ["text-sm text-grey-900 !text-center !py-2.5 !w-max"],
  },
  bodyCellContent: {
    class: ["text-sm"],
  },
});

const handlePdfStateChanged = (apartamentId) => {
  if (props.openedApartment.id && props.openedApartment.id == apartamentId) return;

  const apartment = apartments.value.find((apartment) => apartment.id == apartamentId);

  console.log(apartment, 'apartment');
  
  if (apartment) {
    apartment.inPdf = !apartment.inPdf
  }
}

onMounted(() => {
  eventBus.$on('pdf-state-changed', handlePdfStateChanged)
});

onUnmounted(() => {
  eventBus.$off("pdf-state-changed", handlePdfStateChanged);
});

const rowClick = (apartament, event) => {
  if (
    (event.originalEvent.target != pdfButton.value[apartament.id]
    && !event.originalEvent.target.contains(pdfButton.value[apartament.id])
    && !pdfButton.value[apartament.id].contains(event.originalEvent.target)
    || props.openedApartment.id)
  
  ) {
    emits("update:is-open-window", apartament);    
  }
  
};
</script>

<style lang="scss">
.chessList {
  .p-paginator-bottom {
    border: none !important;
  }
  .p-paginator {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 10px;
    padding: 0;
    padding-top: 50px;
    padding-bottom: 50px;

    .p-dropdown {
      height: 37px;
    }
  }
  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last {
    width: 37px;
    height: 37px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: 1px solid #dedede;
    margin: 0;
    min-width: 0;

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
      height: auto;
      min-height: 37px;
      min-width: 37px;
      padding: 10px;
      border-radius: 3px;
      border: 1px solid #dedede;
      box-shadow: none !important;
      &.p-highlight {
        background: #4caf50;
        color: #ffffff;
      }
    }
  }
 .to_send_complexes {
  cursor: pointer;
 }
  .houseLink {
    cursor: pointer;
  }

  .houseLink:hover {
    color: #1a73e8;
  }
}
.all_apartments_wrapper {
  display: flex;
  gap: 70px;
  max-width: 100%;
}
</style>
