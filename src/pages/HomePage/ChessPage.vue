<template>
  <Teleport to="body">
    <FormAddRoom
      :isOpen="isOpen"
      @closeModel="closeModal"
      :floor="openedFloor"
      :room="openedRoom"
    />
  </Teleport>
  <div class="chessPage p-7.5">
    <div class="chessPage__title mb-7.5">
      Детализация шахматки:
      <div class="subtitle">{{ complex.name }} — {{  house.name }}</div>
    </div>
    <Message
      severity="info"
      :closable="false"
      :pt="{ root: { class: ['!bg-blue-100 !border-blue-500 !mb-7.5'] } }"
    >
      <template #messageicon>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mr-3.5"
        >
          <path
            d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74966 11.4489 9.74966 11.25V9C9.74966 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.29301 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74966 6.89834 9.74966 6.75C9.74966 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57759 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
            fill="#3A8EFA"
          />
        </svg>
      </template>
      <template #default>
        На этой странице вы можете заполнить дом помещениями без использования
        импорта, а также быстро вносить изменения в отдельные помещения.
      </template>
    </Message>
    <EntrancesList class="mt-7.5"  />
  </div>
  <!-- <ConfirmDialog group="deleteEntrance" :pt="confirmpopupStyle"></ConfirmDialog> -->
</template>

<script setup>
import EntrancesList from "@/widgets/homePage/entranceList/entranceList.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import useHouseHook from "@/features/useHouseHook";
import FormAddRoom from "@/widgets/forms/formAddRoom.vue";
import bus from "@/eventBus.js"
import { useHouseStore } from "@/app/store/house";

const route = useRoute();

const house_id = route.params.house_id;
const houseStore = useHouseStore()

const complex = computed(() => houseStore.complex)
const house = computed(() => houseStore.house)

const isOpen = ref(false)

const openedFloor = ref({})
const openedRoom = ref({})
// open:copy-room


const closeModal = (room, action) => {
  if (room) {
    if (action == 'update') {
      Object.entries(room).forEach(([key, value]) => {
        openedRoom.value[key] = value
      })
    }else if (action == 'save') {
      openedFloor.value.rooms.push(room)
    }
  }

  isOpen.value = false
  openedFloor.value = {}
  
  setTimeout(() => {
    openedRoom.value = {}
  }, 300)
}



bus.$on('open:add-room', (floor) => {
  isOpen.value = true
  openedFloor.value = floor
})

bus.$on('open:edit-room', (floor, room) => {
  isOpen.value = true
  openedFloor.value = floor
  openedRoom.value = room
})

// bus.$on('open:copy-room', (floor, room) => {
//   openedFloor.value = floor
//   openedRoom.value = room
//   isCopyRoomModalOpen.value = true
// })

onMounted(() =>{
  houseStore.get_house(house_id);
})

</script>

<style scoped lang="scss">
.chessPage {
  width: 100%;
  height: auto;

  &__title {
    font-size: 32px;
    line-height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    .subtitle {
      font-size: 21px;
      line-height: 100%;
      @apply text-grey-900;
      margin-left: 10px;
      margin-bottom: 2px;
    }
  }
}
</style>
