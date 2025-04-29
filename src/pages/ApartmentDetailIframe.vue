<template>
  <div class="detail-apartment-wrapper">
    <div class="detail-close-btn" @click="closeDetail">
      <svg data-v-ff77da94="" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-ff77da94="" d="M22.8281 20L31.4141 11.4141C32.1953 10.6328 32.1953 9.36719 31.4141 8.58594C30.6328 7.80469 29.3672 7.80469 28.5859 8.58594L20 17.1719L11.4141 8.58594C10.6328 7.80469 9.36719 7.80469 8.58594 8.58594C7.80469 9.36719 7.80469 10.6328 8.58594 11.4141L17.1719 20L8.58594 28.5859C7.80469 29.3672 7.80469 30.6328 8.58594 31.4141C8.97656 31.8047 9.48828 32 10 32C10.5117 32 11.0234 31.8047 11.4141 31.4141L20 22.8281L28.5859 31.4141C28.9766 31.8047 29.4883 32 30 32C30.5117 32 31.0234 31.8047 31.4141 31.4141C32.1953 30.6328 32.1953 29.3672 31.4141 28.5859L22.8281 20Z" fill="#757575"></path></svg>
    </div>

    <requestModal @close="closeReqModal" :isOpen="isReqOpen" :info="info" />
  <Teleport to="body">
    <div @click.stop="emits('update:is-open-window', { ...hoveredFigure.room, complex_name: apartment.complex_name, house_name: apartment.house_name, floor: activeFloor.position, entrance_name: apartment.entrance_name})" id="popup" class="popup" ref="popup">
      <template v-if="hoveredFigure">
        <div class="popup__countRoom" :style="{'background-color': hoveredFigure.room.complex_status_info.status_color}">{{hoveredFigure.room.layout_feature !== 'studio' ? hoveredFigure.room.rooms_count + ' к' : 'ст'}}</div>
        <div class="popup__number">№ {{hoveredFigure.room.number}}</div>
        <div class="popup__price">{{formatNumber(hoveredFigure.room.total_amount)}} руб.</div>
        <div class="popup__square">{{hoveredFigure.room.area}} м2 <span>- {{formatNumber(((hoveredFigure.room.total_amount || 0) / (hoveredFigure.room.area || 0)).toFixed(2))}} руб./м2</span></div>
      </template>
    </div>
  </Teleport>
  <div class="apartment-number">Квартира {{ apartment.number }} </div>
  <div class="apartment-detail" style="justify-content: space-between;">
    <div class="apartment-image">
      <div class="apartment-status" :style="{ backgroundColor: getBackgroundColor(apartment.status_type) }">{{ apartment.status_name }}</div>
      <img :src="apartment.plan_url" alt="" class="image" />
    </div>
    <!-- <div class="vertical-line"></div> -->
    <div class="apartment-detail-info">
      <div class="sale-info">
        Обратитесь в отдел продаж по телефону
        <span>{{ formatPhone(agencyPhone) }}</span>
      </div>
      <div class="apartment-title">{{ room_types[apartment.type] }} в {{ apartment.house_name }}</div>
      <table class="apartment-additional-info">
        <tr>
          <td class="td-title">Кол-во комнат</td>
          <td>{{ apartment.rooms_count }} ккв</td>
        </tr>
        <tr>
          <td class="td-title">Название ЖК</td>
          <td>{{ apartment.complex_name }}</td>
        </tr>
        <tr>
          <td class="td-title">№ дома</td>
          <td>{{ apartment.house_name }}</td>
        </tr>
        <tr>
          <td class="td-title">{{ apartment.entrance_name }}</td>
          <td>5</td>
        </tr>
        <tr>
          <td class="td-title">№ кв</td>
          <td>{{ apartment.number }}</td>
        </tr>
        <tr>
          <td class="td-title">Этаж</td>
          <td>{{ apartment.floor }}</td>
        </tr>
        <tr v-if="apartment.windows_placement_id">
          <td class="td-title">Куда выходят окна</td>
          <td>{{ apartment.windows_placement_id }}</td>
        </tr>
        <tr>
          <td class="td-title">Тип</td>
          <td>{{ room_types[apartment.type] }}</td>
        </tr>
        <tr v-if="apartment.decoration_id">
          <td class="td-title">Отделка</td>
          <td>{{ getDecoration(apartment.decoration_id) }}</td>
        </tr>
      </table>
      <div class="price-wrapper">
        <table class="price-table">
          <tr>
            <td class="full-price">{{ formatTotalPrice(apartment.total_amount) }} руб.</td>
          </tr>
          <tr>
            <td class="squere-price">197 658 руб./м2</td>
          </tr>
        </table>
      </div>
      <div class="primary-btn detail">Забронировать</div>
    </div>
  </div>
  <div class="detail-bottom">
    <div class="bottom-title">Расположение на этаже</div>
    <div class="chessFloors__resize" ref="zoomSlider"></div>
    <div
      class="chessFloors__mapFloor overflow-x-auto relative"
      ref="container"
    >
      <div class="map ol-map" :id="canvasId" ref="map"></div>
    </div>
  </div>
  </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue';
import Apartment from './Apartment.vue';
import api from '@/shared/api';
import { onMounted, ref, watch } from 'vue';
import { useComplexStore } from '@/app/store/complex';
import { formatNumber, room_types } from '@/shared/utils/util';
import useViewFloors from "@/features/useViewFloors";
import { useRoute } from 'vue-router';
import requestModal from '@/shared/UI/requestModal.vue';
const complexHook = useComplexStore();
const useViewFloor = useViewFloors();

const closeReqModal = () => {
  isReqOpen.value = false
}

const closeDetail = () => {

}

const info = ref({});

const hoveredFigure = ref(null)
const agencyPhone = ref(null)
agencyPhone.value = localStorage.getItem('agencyPhone') || ''

console.log(complexHook, 'value hooke');

const decorations = ref([])
const activeFloor = ref(null)
const route = useRoute()
const props = defineProps({
  apartment: Object,
  agencyPhone: String,
  canvasId: {
    type: String,
    default: "map"
  }
})
const popup = ref(HTMLElement);
const zoomSlider = ref(HTMLElement);
const container = ref(HTMLElement);
const map = ref(HTMLElement);
const colors = JSON.parse(localStorage.getItem('colors')) || {}


const statusMap = {
  reservation: 'color_reserved',
  available: 'color_free',
  not_for_sale: 'not_for_sale',
  sold: 'sold',
}

const setHoveredFigureVisible = (id) => {
  hoveredFigure.value = activeFloor.value.plan.figures.find((figure) => figure.id === id)
  if(useViewFloor.hoveredFigure.value) {
    useViewFloor.hoveredFigure.value.visible = hoveredFigure.value && hoveredFigure.value.room.visible 
  }
}
watch(() => useViewFloor.hoveredFigure.value?.id_, setHoveredFigureVisible)

const figuresData = ref([]);

watch(figuresData, (value) => {
  const figures = props.customFigures ? props.customFigures : value
  console.log(figures, "figures");
  
  useViewFloor.start(
    map.value.getAttribute('id'),
    container.value,
    zoomSlider.value,
    popup.value,
    activeFloor.value.plan.image,
    figures// newV.plan.figures ? newV.plan.figures.map((figure) => ({ id: figure.id, points: figure.points.map((point) => ([point.y, point.x])) })) : []
  )
})
watch(activeFloor, (newV) => {
  figuresData.value = newV.plan.figures && newV.plan.figures.map((figure) => {
    return { id: figure.id, visible: figure.room.visible, points: figure.points.map((point) => {
      return [point.x, point.y]
    }) }
  })
});


const getBackgroundColor = (statusType) => {
  const colorKey = statusMap[statusType]
  return colors[colorKey]
}

const formatTotalPrice = (value) => {
  if (!value) return '0';
  return Number(value).toLocaleString('ru-RU');
};

const formatPhone = (phone) => {
  if (!phone) {
    phone = '';
  }
  const raw = phone.replace(/\D/g, '');

  if (raw.length !== 11 || !phone.startsWith('+7')) {
    return phone;
  }

  return `+${raw[0]} ${raw.slice(1, 4)} ${raw.slice(4, 7)} ${raw.slice(7, 9)} ${raw.slice(9, 11)}`;
};

const loadDecorations = async () => {
  if (decorations.value.length > 0) return
  const response = await api.getDecorations()
  decorations.value = response.data
}

const getDecoration = (decoration_id) => {
  if (!decoration_id) return ''

  return decorations.value.find((decoration) => decoration.code == decoration_id)?.name
}


onMounted(async () => {
  loadDecorations()
  if (complexHook.agencyPhone) {
    agencyPhone.value = complexHook.agencyPhone
    localStorage.setItem('agencyPhone', complexHook.agencyPhone)
  }

  await api.getHouseFloorPlans(route.params.house_id)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        const entrancesData = response.data
        entrancesData.forEach(entrance => {
          const floor = entrance.floors.find(floor => floor.id == props.apartment.floor_id)
          activeFloor.value = floor

          // entrance.floors.forEach(floor => {
            // if () {
              
            // }
          // })
        })
        // entrances.value = response.data
        // selectedEntranceID.value = entrances.value[0].id
        // activeFloor.value = entrances.value[0].floors[entrances.value[0].floors.length - 1]
        // useViewFloor.start(map.value, container.value, zoomSlider.value, popup.value, activeFloor.value.plan.image)
      }
      setHoveredFigureVisible(useViewFloor.hoveredFigure.value?.id_)
    }) 
})

</script>

<style lang="scss" scoped>
.apartment-number {
  font-size: 32px;
  margin-bottom: 40px;
}
.apartment-detail {
  width: 100vw;
  height: 100%;
  max-height: 609px;
  display: flex;
  padding: 0 200px 0 200px;

  /* justify-content: space-between; */
  & .vertical-line {
    width: 1px;
    background-color: #DEDEDE;
    height: 100%;
    margin: 0 100px;
  }
  & .apartment-image {
    flex-shrink: 0;
    aspect-ratio: 640 / 592;
    width: 100%;
    max-width: 640px;
    height: 592px;
    max-height: 593px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    & .apartment-status {
      position: absolute;
      right: 0;
      top: 0;
      background-color: #ED4B00;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 6px;
      border-radius: 3px;
      color: #ffffff;
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  & .apartment-detail-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    max-width: 600px;
    & .sale-info {
      width: 600px;
      height: 76px;
      border: 1px solid var(--main-color);
      border-radius: 16px;
      color: #7D7D7D;
      font-size: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & span {
        font-size: 24px;
        color: var(--main-color);
        font-weight: bold;
      }
    }
    & .apartment-title {
      font-size: 24px;
      margin: 20px 0;
      padding-bottom: 20px;
      border-bottom: 1px solid #F2F3F5;
    }
    & .apartment-additional-info {
      margin-top: 10px;
      width: 100%;
      .td-title {
        font-weight: normal;
        color: #7d7d7d;
      }
      & tr {
        display: flex;
        justify-content: space-between;
      }
    }
    & .detail {
      width: 100%;
      max-width: 320px;
      border-radius: 20px;
    }
  }
  & .price-wrapper {
    border-top: 1px solid #F2F3F5;
    border-bottom: 1px solid #F2F3F5;
    margin: 20px 0;
    padding: 20px 0;
    & .price-table {
      display: flex;
      flex-direction: column;
      & .full-price {
        font-size: 24px;
        font-weight: bold;
        color: var(--main-color);
      }
      & .squere-price {
        font-size: 12px;
        color: #757575;
      }
    }
  }
}
@media (max-width: 1024px) {
  .apartment-detail {
    flex-direction: column;
    align-items: center;
    padding: 0 24px;
    & .apartment-image {
      width: 100%;
      max-width: unset;
    } 
    & .vertical-line {
      display: none;
    }
    & .apartment-detail-info {
      margin-top: 20px;
      width: 100%;
      max-width: unset;
      & .sale-info {
        width: 100%;
      }
      & .detail {
        align-self: center;
      } 
    }

  }
}
@media (max-width: 768px) {
  .apartment-detail {
    /* flex-direction: column; */
   
    /* width: 100%; */
    & .apartment-detail-info {
     
    }
  }
}
.detail-bottom {
  width: 100%;
  height: auto;
}
.chessFloors__resize {
  display: none;
}
.ol-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__pane {
    height: 100%;
  }
}

.popup {
  position: absolute;
  display: grid;
  width: max-content;
  grid-template-columns: 30px 1fr;
  grid-gap: 4px 20px;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;

  &__countRoom {
    grid-column: 1;
    grid-row: 1;
    width: 30px;
    height: 30px;
    // background-color: #4caf50;
    color: white;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__number {
    grid-column: 1;
    grid-row: 2;
    font-size: 14px;
    align-self: center;
    color: grey;
  }
  &__price {
    grid-column: 2;
    grid-row: 2;
    font-weight: 700;
    opacity: 1;
    visibility: visible;
  }
  &__square {
    grid-row: 1;
    grid-column: 2;
    font-size: 16px;
    color: black;
    span {
      opacity: 0;
      visibility: hidden;
      display: none;
    }
  }
}

.chessFloors__mapFloor {
  width: 100%;
  height: 700px;
}
.bottom-title {
  font-size: 32px;
  margin-top: 40px;
}
.detail-apartment-wrapper {
  background-color: #ffffff;
  z-index: 1000;
  position: fixed;
  left: -350px;
  top: 0;
  /* padding: 0 200px 0 200px ; */
  padding: 50px;
}

.detail-close-btn {
  position: absolute;
  right: 150px;
  top: 15px;
  cursor: pointer;
}
</style>