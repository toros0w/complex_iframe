<template>
  <div class="homeItem">
    <div class="homeItem__image">
      <img v-if="houseImage" :src="houseImage" alt="" />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Capa_1"
        x="0px"
        y="0px"
        width="130px"
        height="130px"
        viewBox="0 0 217.267 217.267"
        style="enable-background: new 0 0 217.267 217.267"
        xml:space="preserve"
      >
        <g>
          <path
            d="M163.627,138.057c1.94,0,3.505-1.564,3.505-3.505V83.749c0-1.937-1.564-3.504-3.505-3.504    c-1.937,0-3.504,1.567-3.504,3.504v50.803C160.123,136.493,161.69,138.057,163.627,138.057z"
            fill="#506979"
          ></path>
          <path
            d="M108.633,0C48.73,0,0,48.732,0,108.633c0,29.931,12.167,57.071,31.816,76.738c0.014,0.014,0.017,0.034,0.031,0.048    s0.032,0.018,0.046,0.031c19.666,19.646,46.807,31.815,76.74,31.815c59.901,0,108.634-48.731,108.634-108.633S168.531,0,108.633,0    z M108.633,7.009c26.758,0,51.12,10.416,69.285,27.379l-26.936,26.938H52.564c-9.661,0-17.521,7.861-17.521,17.521v59.573    c0,9.661,7.861,17.521,17.521,17.521h3.805l-21.979,21.978C17.42,159.753,7.009,135.394,7.009,108.633    C7.009,52.599,52.595,7.009,108.633,7.009z M86.196,108.63c0-12.363,10.056-22.42,22.417-22.42c4.921,0,9.466,1.615,13.172,4.313    l-1.875,1.875c-3.207-2.24-7.094-3.564-11.297-3.564c-10.913,0-19.789,8.879-19.789,19.792c0,4.195,1.321,8.09,3.559,11.3    l-1.874,1.868C87.811,118.095,86.196,113.554,86.196,108.63z M131.034,108.63c0,12.364-10.054,22.418-22.418,22.418    c-4.915,0-9.449-1.608-13.145-4.298l1.874-1.876c3.203,2.231,7.082,3.546,11.274,3.546c10.91,0,19.794-8.877,19.794-19.791    c0-4.187-1.321-8.071-3.549-11.272l1.875-1.875C129.433,99.181,131.034,103.717,131.034,108.63z M95.833,108.63    c0-7.051,5.735-12.784,12.78-12.784c2.257,0,4.347,0.639,6.184,1.668l-17.304,17.306C96.469,112.972,95.833,110.885,95.833,108.63    z M121.397,108.63c0,7.049-5.735,12.782-12.781,12.782c-2.244,0-4.322-0.633-6.158-1.652l17.29-17.289    C120.769,104.31,121.397,106.383,121.397,108.63z M90.467,131.753c5.005,3.936,11.298,6.311,18.146,6.311    c16.229,0,29.431-13.206,29.431-29.431c0-6.848-2.375-13.141-6.311-18.149l22.148-22.146h10.814    c5.797,0,10.513,4.717,10.513,10.513v59.573c0,5.797-4.716,10.513-10.513,10.513H73.289L90.467,131.753z M126.784,85.523    c-5.007-3.948-11.311-6.326-18.168-6.326c-16.23,0-29.426,13.204-29.426,29.429c0,6.858,2.375,13.158,6.321,18.172l-22.136,22.135    H52.561c-5.797,0-10.513-4.716-10.513-10.514V78.847c0-5.795,4.716-10.513,10.513-10.513h91.413L126.784,85.523z M108.633,210.257    c-26.759,0-51.12-10.417-69.287-27.377l26.934-26.939h98.422c9.66,0,17.521-7.86,17.521-17.521V78.847    c0-9.661-7.861-17.521-17.521-17.521h-3.806l21.977-21.979c16.968,18.17,27.381,42.529,27.381,69.287    C210.258,164.667,164.667,210.257,108.633,210.257z"
            fill="#506979"
          ></path>
          <path
            d="M53.002,54.317h23.654c1.937,0,3.504-1.567,3.504-3.504s-1.567-3.504-3.504-3.504H53.002    c-1.938,0-3.504,1.567-3.504,3.504S51.064,54.317,53.002,54.317z"
            fill="#506979"
          ></path>
        </g>
      </svg>
    </div>
    <div class="homeItem__content">
      <div class="homeItem__desc">
        <div class="homeItem__descComplex">{{ house.name_complex }}</div>
        <h2 class="homeItem__houseName">
          <RouterLink :to="{path: homeViewRoute, query: $route.query}">
            {{ house.name }}
          </RouterLink>
        </h2>
        <p class="homeItem__houseAddress">{{ house.address }}</p>
      </div>
      <div class="homeItem__rooms">
        <RouterLink
          v-for="(groupedRooms, groupType) of computedRooms"
          class="homeItem__roomItem"
          :id="groupType"
          :key="groupType"
          :to="{path: `/view/${props.house.complex_id}/home/${house.id}`, query: groupType == 'studio' ? { selectedTypes: ['apartment'], rooms: [groupType], viewMode: 'tile' } : containsNumber(groupType) ? { selectedTypes: ['apartment'], rooms: [groupType], viewMode: 'tile'} : { ...$route.query, selectedTypes: [groupType], viewMode: 'tile'} }"
        >
          <div>
            <div>{{ getRoomsCountGroupTypeString(groupType) }}{{ room_types[groupType] || layout_futures[groupType] }}</div>
            <div>{{ groupedRooms.length }} шт.</div>
          </div>
          <div>
            от {{ formatNumber(Math.min(...groupedRooms.map((room) => room.total_amount || 0))) }}
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { room_types, layout_futures, containsNumber, formatNumber } from "@/shared/utils/util";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
const props = defineProps({
  house: Object,
});
const route = useRoute();
const emits = defineEmits(["deleteItem"]);
const houseImage = computed(() => {
  return props.house?.images.length ? props.house?.images[0].url : null;
});

const homeViewRoute = computed(() => {
  return `/view/${route.params.id}/home/${props.house.id}`
})

const sortObjectByStudioFirst = (obj) => {
    const keys = Object.keys(obj).sort((a, b) => {
        if (a === "studio" || b === "studio") return -1;

        if (isNaN(+a) || isNaN(+b)) return 1

        return 0;
    });

    const sortedObj = {};
    keys.forEach(key => {
        sortedObj[key] = obj[key];
    });

    return sortedObj;
}
const computedRooms = computed(() => {
  if (!props.house.rooms.length) return [];
  const rooms = props.house.rooms.filter((room) => (room.status == 'available' || room.status == 'reservation')).reduce((acc, room) => {
    const { type, layout_feature, rooms_count } = room;

    const is_studio = layout_feature && layout_feature == "studio";
    if (is_studio) {
      if (!acc["studio"]) {
        acc["studio"] = [];
      }

      acc["studio"].push(room);
      return acc;
    }
    
    if (rooms_count && type === 'apartment' && !is_studio) {
      if (rooms_count < 5) {
        if (!acc[rooms_count]) {
          acc[rooms_count] = []
        }
  
        acc[rooms_count].push(room)
        return acc
      } else {
        if (!acc['5-more']) {
            acc['5-more'] = []
        }
    
        acc['5-more'].push(room)
        return acc
      }
    } 
    
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(room);
    return acc;
  }, {});


  return sortObjectByStudioFirst(rooms)
});

const getRoomsCountGroupTypeString = (groupType) => {
  if (containsNumber(groupType)) {
    if (groupType !== '5-more') {
      return groupType + '  К.кв'
    }

    return '5+ К.кв'
  }

  return ''
}

</script>
  
  <style scoped lang="scss">
.homeItem {
  position: relative;
  width: 100%;
  min-height: 521px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  @apply bg-white;
  border-radius: 4px;
  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 250px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 32px;
      height: 32px;
    }
  }
  &__floorInfo {
    display: flex;
    position: absolute;
    gap: 4px;
    top: 10px;
    left: 10px;

    div {
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #a8acb43b;
      font-size: 12px;
      line-height: 24px;
      white-space: nowrap;
      padding: 0 4px;
    }
  }
  &__content {
    width: 100%;
    background-color: rgba($color: #ffffff, $alpha: 0.85);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 10px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 16px;
  }

  &__rooms {
    font-size: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid #cfd8e1;
    padding: 16px;
    margin-top: 8px;
  }

  &__roomItem {
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    & > div {
      display: flex;
      align-items: center;
      gap: 5px;

      & > div:nth-child(1) {
        font-weight: bold;
        letter-spacing: 0.25px;
        font-size: 14px;
      }
    }

    &:hover {
      color: #43a047;
    }
  }

  &__desc {
    width: 100%;
    padding: 16px 16px 0 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__descComplex,
  &__houseAddress {
    font-size: 14px;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    letter-spacing: 0.28px;
  }

  &__houseName {
    font-size: 24px;
    line-height: 24px;
    border-bottom: 1px solid;
    width: max-content;
    letter-spacing: 0.48px;
    padding-bottom: 3px;
    margin-bottom: 20px;
  }

  &__nav {
    position: relative;
    @apply bg-white;
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #dedede;
      padding: 8px;
      border-radius: 3px;
    }
  }
}
</style>
  