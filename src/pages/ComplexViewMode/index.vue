<template>
  <div class="complexPage">
    <ListHome @open-add-home="openAddHome" :complex="complex" :houses="filteredHouses" :loadHome="loadHome" />
  </div>
  <Toast />
</template>

<script setup>
import ListHome from "./widgets/ListHome.vue";
import { ref, onMounted, computed } from "vue";
const isOpenForm = ref(false);
import { useRoute } from "vue-router";
import Toast from "primevue/toast";
import api from '@/shared/api'
import { useComplexStore } from "@/app/store/complex";

const route = useRoute();
const complexStore = useComplexStore()
const complex = ref({ address: {}, metro: {} });
const complex_id = route.params.id;
const formAddHome = ref(null);
const houses = ref([]);
const loadHome = ref(true);
const files = ref([]);
const complex_filter = ref({});

const parseQueryFilters = () => {
  const multipleKeys = ['selectedTypes', 'selectedComplexTypes', 'rooms', 'rayons', 'selectedMetros', 'complexes', 'selectedDecorations']


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

      if (typeof value == 'string') {
        if (!isNaN(+value) && key != 'rooms') {
          value = [parseInt(value)];
        } else {
          value = [value];
        }
      }
    }

    complex_filter.value[key] = value == 'true' ? true : value == 'false' ? false : value
  })
}

const fixRoomVisible = (room) => {
  room.visible = true;

  if (complex_filter.value.price_from !== '' && complex_filter.value.price_from > room.total_amount) {
    room.visible = false
  }

  if (complex_filter.value.price_to !== '' && complex_filter.value.price_to < room.total_amount) {
    room.visible = false
  }

  if (complex_filter.value.area_from !== '' && complex_filter.value.area_from > room.area) {
    room.visible = false
  }

  if (parseInt(complex_filter.value.area_to, 10) && complex_filter.value.area_to < room.area) {
    room.visible = false
  }

  if (Array.isArray(complex_filter.value.selectedDecorations) && room.decoration_id && !complex_filter.value.selectedDecorations.includes(room.decoration_id.toString())) {
    room.visible = false
  }
}

function getHouses() {
  loadHome.value = true;
  return api.getComplexHouses(complex_id)
    .then((response) => {
      var res = response.data;
      houses.value = res;
      loadHome.value = false;
    });
}

const filteredHouses = computed(() => houses.value.filter((house) => {
  if (complex_filter.value.period && complex_filter.value.period.length) {
    if (complex_filter.value.period == 'completed') {
      const date = (new Date(Date.now()))
      const currentYear = date.getFullYear();
      const currentQuarter = Math.ceil(date.getMonth() / 3) - 1;
      if (house.deadline_quarter && house.deadline_year && house.deadline_quarter >= currentQuarter || house.deadline_year > currentYear) {
        return false
      }
    } else {
      const [year, quarter] = complex_filter.value.period.split('Q')
      if (house.deadline_quarter != quarter || house.deadline_year != year) {
        return false
      }
    }

  }
  house.rooms.forEach(fixRoomVisible)
  house.rooms = house.rooms.filter(room => room.visible);

  return house.rooms.length
}))

function get_complex_one() {
  return api.getComplexOne(complex_id)
    .then((response) => {
      complex.value = response.data;
      complexStore.setActiveComplex(complex.value)
      if (complex.value.images && complex.value.images.length) {
        complex.value.images.forEach(({ image, id }) => {
          fetch(image)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File(
                [blob],
                image.substring(image.lastIndexOf("/") + 1, image.length),
                { type: blob.type }
              );
              file.objectURL = image;
              file.id = id;
              files.value.push(file);
            });
        });
      }
    });
}

const openAddHome = () => {
  isOpenForm.value = !isOpenForm.value;
  formAddHome.value.open();
};

onMounted(async () => {
  parseQueryFilters()
  await get_complex_one();
  await getHouses();
});
</script>

<style scoped lang="scss">
@import "@/app/styles/function.scss";

.complexPage {
  width: 100%;
  height: max-content;
  overflow: auto;
  overflow-x: hidden;
  @apply bg-white;
  border-radius: 4px;
  padding: 0;
  padding-bottom: 0;
}
</style>