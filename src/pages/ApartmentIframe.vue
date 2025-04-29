<template>
  <div class="apartment">
    <div class="apartment-img">
      <img
        v-if="room.plan_url"
        :src="room.plan_url"
      />
      <img
        v-else
        style="width: 120px"
        src="@/shared/assets/images/complexes/gallery.svg"
      />
      <div class="apartment-status" 
      :style="{ backgroundColor: getBackgroundColor(room.status_type)}"
      >{{ room.status_name }}</div>
    </div>
    <div class="apartment-info">
      <table class="info-table">
        <tr>
          <td class="type-title">{{ room_types[room.type] }}:</td>
          <td class="td-value">{{ room.area }} кв.м2</td>
        </tr>
        <tr>
          <td class="full-price">{{ formatNumber(room.total_amount) }} руб.</td>
          <td class="td-value">{{ getAreaPrice(room.area, room.total_amount) }}</td>
        </tr>
      </table>
      <table class="apartment-additional-info">
        <tr v-if="room.rooms_count">
          <td class="td-title">Кол-во кsssssssssомнат</td>
          <td>{{ room.rooms_count }} ккв</td>
        </tr>
        <tr v-if="room.entrance_name">
          <td class="td-title">№ подъезда</td>
          <td>{{ room.entrance_name }}</td>
        </tr>
        <tr v-if="room.number">
          <td class="td-title">№ кв</td>
          <td>{{ room.number }}</td>
        </tr>
        <tr v-if="room.floor">
          <td class="td-title">Этаж</td>
          <td>{{ room.floor }}</td>
        </tr>
        <tr v-if="room.windows_placement_id">
          <td class="td-title">Куда выходят окна</td>
          <td>{{ getWindowsPlacement(room.windows_placement_id) }}</td>
        </tr>
        <tr v-if="room.type">
          <td class="td-title">Тип</td>
          <td>{{ room_types[room.type] }}</td>
        </tr>        <tr v-if="room.decoration_id">
          <td class="td-title">Отделка</td>
          <td>{{ getDecoration(room.decoration_id) }}</td>
        </tr>
      </table>
    </div>
    <div class="primary-btn apt" @click="emits('openApartment', room)">
      Подробнее
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import { room_types } from '@/shared/utils/util';

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
  decorations: {
    type: Array,
  },
  windowsPlacements: {
    type: Array,
  }
});

const emits = defineEmits(
  ["openApartment"]
);


// const room_types = {

// }

const colors = JSON.parse(localStorage.getItem('colors')) || {}


const statusMap = {
  reservation: 'color_reserved',
  available: 'color_free',
  not_for_sale: 'not_for_sale',
  sold: 'sold',
}


const getBackgroundColor = (statusType) => {
  const colorKey = statusMap[statusType]
  return colors[colorKey]
}

const formatNumber = (price) => Number(price).toLocaleString("ru-RU");

const getDecoration = (decoration_id) => {
  if (!props.room.decoration_id) return 'Не указано'
  return props.decorations.find((decoration) => decoration.code == decoration_id)?.name
}
const getWindowsPlacement = (windows_placement_id) => {
  if (!windows_placement_id || !props.windowsPlacements) return ''

  return props.windowsPlacements.find((windowsPlacement) => windowsPlacement.id == windows_placement_id)?.name
}

const getAreaPrice = (area, total_amount) => {
  area = parseFloat(area)
  total_amount = parseFloat(total_amount)
  if (!area || !total_amount) return '—'

  const price = Math.round(total_amount / area) // Округляем до целого
  return `${price.toLocaleString('ru-RU')} руб./м²`
}

</script>
<style lang="scss" scoped>
.apartment {
  padding: 20px 30px;
  border: 1px solid #DEDEDE;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 330px;
  
  & .apartment-img {
    /* width: 270px; */
    height: 250px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
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
  }
  & .apt {
    border-radius: 20px;
    width: 100%;
    margin-top: 20px;
  }
  & .apartment-info {
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    & .info-table {
      width: 100%;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #F2F3F5;
      padding-bottom: 20px;
      & .td-value {
        font-size: 12px;
        color: #757575;
        font-weight: normal;
        text-align: right;
      }
      & .full-price {
        color: var(--main-color);
      }
      & tr {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      & tr + tr {
        margin-top: 20px;
      }
    }
    & .apartment-additional-info {
      margin-top: 10px;
      width: 100%;
      .td-title {
        font-weight: normal;
        color: #7D7D7D;
      }
      & tr {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>