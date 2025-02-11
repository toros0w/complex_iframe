<template>
  <Teleport to="body">
    <div id="popup" class="popup">
      <div class="popup__body">
        <div class="popup__title">Подъезд {{ numberEntrance }}, Этаж {{ numberFloor }}</div>
        <template v-if="rooms.length">
          <div class="popup__listPartament">
            <div v-for="(groupedRooms, index) of computedRooms" :key="index" class="partament" @click="$emit('openDetails')">
              <div class="icon">{{groupedRooms[0].layout_feature == 'studio' ? 'ст' : groupedRooms[0].rooms_count + ' к'}}</div>
              <div class="text">{{groupedRooms.length}} помещени{{groupedRooms.length > 1 ? 'й' : 'е'}}, от {{ formatNumber(Math.min(...groupedRooms.map((room) => room.total_amount || 0))) }} &#8381;</div>
            </div>
          </div>
        </template>
        <span v-else>Нет свободных помещений</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { formatNumber } from '@/shared/utils/util';
import { computed, watch } from 'vue';

const props = defineProps({
  numberFloor: Number,
  numberEntrance: Number,
  rooms: Array,
  floorData: [],
});

const computedRooms = computed(() => {
  if (!props.rooms.length) return []
  return props.rooms.reduce((acc, room) => {
      const { rooms_count } = room;
      const { layout_feature } = room;

      if (layout_feature && layout_feature == 'studio') {
        if (!acc['studio']) {
          acc['studio'] = [];
        }

        acc['studio'].push(room)
        return acc;
      } 
      if (!acc[rooms_count]) {
          acc[rooms_count] = [];
      }
      acc[rooms_count].push(room);
      return acc;
  }, {});
})
</script>

<style scoped lang="scss">
.popup {
  left: -5000px;
  position: absolute;
  background: #fff;
  box-shadow: 0 6px 27px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%);
  width: max-content;
  border-radius: 4px;
  border: 1px solid #3e9842;
  padding: 10px 18px 15px 24px;

  &__head {
    width: 100%;
    height: auto;
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #bdbdbd;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }
  &__text {
    font-size: 12px;
    margin-bottom: 13px;
    span {
      font-weight: 500;
    }
  }
  &__listPartament {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    column-gap: 35px;
    gap: 10px;
    max-height: 160px;
    overflow: auto;
    padding: 15px 15px 15px 10px;
    .partament {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      .icon {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        background-color: #a1ddfb;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        color: #ffffff;
        margin-right: 10px;
      }
      .text {
        font-size: 12px;
      }
    }
  }
}
</style>
