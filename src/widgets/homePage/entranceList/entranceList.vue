<template>
  <div class="entranceList" v-if="!entrancesLoader">
    <div
      class="entranceList__head flex flex-row items-center border-b border-grey-400"
    >
      <TabItem
        v-for="entrance in sortedEntranceList"
        :key="entrance.name"
        :title="entrance.name"
        :active="entrance.id === activeEntrance?.id"
        @tab:click="activeEntrance = entrance"
        @dragstart="(e) => dragStartHandler(e, entrance.position)"
        @dragleave="(e) => dragEndHandler(e, entrance.position)"
        @dragend.prevent="(e) => dragEndHandler(e, entrance.position)"
        @dragover.prevent="(e) => dragOverHandler(e)"
        @drop.prevent="(e) => dropHandler(e, entrance.position)"
        @update:title="updateTitle(entrance.id, $event)"
        @delete:entrance="toggle($event, entrance)"
      />
      <button class="entranceList__addBtn" @click="handleEntranceAdd(house_id)">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6445 1.21826H10.3555V20.7841H11.6445V1.21826Z"
            fill="#4CAF50"
          />
          <path
            d="M20.7836 10.3555H1.21777V11.6445H20.7836V10.3555Z"
            fill="#4CAF50"
          />
        </svg>
        Добавить подъезд
      </button>
    </div>
    <div class="entranceList__body mt-7.5 w-full">
      <template v-if="entranceList.length !== 0">
        <div
          class="entranceList__aboveground pb-7.5 border-b-8 border-grey-100 w-full"
        >
          <MyButton :theme="'green'" class="mb-7.5" @click="createFloor({ position: outerFloors.length + 1 })">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.25 14.9999H3.75C3.55109 14.9999 3.36032 15.0789 3.21967 15.2196C3.07902 15.3602 3 15.551 3 15.7499C3 15.9488 3.07902 16.1396 3.21967 16.2803C3.36032 16.4209 3.55109 16.4999 3.75 16.4999H14.25C14.4489 16.4999 14.6397 16.4209 14.7803 16.2803C14.921 16.1396 15 15.9488 15 15.7499C15 15.551 14.921 15.3602 14.7803 15.2196C14.6397 15.0789 14.4489 14.9999 14.25 14.9999ZM6.5325 5.78242L8.25 4.05742V12.7499C8.25 12.9488 8.32902 13.1396 8.46967 13.2803C8.61032 13.4209 8.80109 13.4999 9 13.4999C9.19891 13.4999 9.38968 13.4209 9.53033 13.2803C9.67098 13.1396 9.75 12.9488 9.75 12.7499V4.05742L11.4675 5.78242C11.5372 5.85272 11.6202 5.90851 11.7116 5.94659C11.803 5.98467 11.901 6.00427 12 6.00427C12.099 6.00427 12.197 5.98467 12.2884 5.94659C12.3798 5.90851 12.4628 5.85272 12.5325 5.78242C12.6028 5.7127 12.6586 5.62975 12.6967 5.53835C12.7347 5.44696 12.7543 5.34893 12.7543 5.24992C12.7543 5.15091 12.7347 5.05288 12.6967 4.96149C12.6586 4.8701 12.6028 4.78714 12.5325 4.71742L9.5325 1.71742C9.46117 1.64914 9.37706 1.59562 9.285 1.55992C9.1024 1.48491 8.8976 1.48491 8.715 1.55992C8.62294 1.59562 8.53883 1.64914 8.4675 1.71742L5.4675 4.71742C5.39757 4.78735 5.3421 4.87037 5.30426 4.96174C5.26641 5.0531 5.24693 5.15103 5.24693 5.24992C5.24693 5.34882 5.26641 5.44674 5.30426 5.53811C5.3421 5.62948 5.39757 5.71249 5.4675 5.78242C5.53743 5.85235 5.62045 5.90782 5.71181 5.94567C5.80318 5.98351 5.90111 6.00299 6 6.00299C6.09889 6.00299 6.19682 5.98351 6.28819 5.94567C6.37955 5.90782 6.46257 5.85235 6.5325 5.78242Z"
                fill="white"
              />
            </svg>

            Добавить надземный этаж
          </MyButton>
          <AccordionFloors
            v-if="activeEntrance"
            :floors="outerFloors"
            @drag-end="handleFloorDragEndOuter"
            @delete:floor="deleteFloor"
            @copy:floor="(floor) => copyFloor(floor, outerFloors.length + 1)"
          />
        </div>
        <div class="entranceList__underground pt-7.5">
          <MyButton :theme="'green'" class="mb-7.5" @click="createFloor({ position: -(innerFloors.length + 1) })">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4675 12.2175L9.75 13.9425V5.25C9.75 5.05109 9.67098 4.86032 9.53033 4.71967C9.38968 4.57902 9.19891 4.5 9 4.5C8.80109 4.5 8.61032 4.57902 8.46967 4.71967C8.32902 4.86032 8.25 5.05109 8.25 5.25V13.9425L6.5325 12.2175C6.39127 12.0763 6.19973 11.9969 6 11.9969C5.80027 11.9969 5.60873 12.0763 5.4675 12.2175C5.32627 12.3587 5.24693 12.5503 5.24693 12.75C5.24693 12.9497 5.32627 13.1413 5.4675 13.2825L8.4675 16.2825C8.53883 16.3508 8.62294 16.4043 8.715 16.44C8.80478 16.4797 8.90185 16.5002 9 16.5002C9.09815 16.5002 9.19522 16.4797 9.285 16.44C9.37706 16.4043 9.46117 16.3508 9.5325 16.2825L12.5325 13.2825C12.6737 13.1413 12.7531 12.9497 12.7531 12.75C12.7531 12.5503 12.6737 12.3587 12.5325 12.2175C12.4626 12.1476 12.3796 12.0921 12.2882 12.0543C12.1968 12.0164 12.0989 11.9969 12 11.9969C11.8003 11.9969 11.6087 12.0763 11.4675 12.2175ZM14.25 1.5H3.75C3.55109 1.5 3.36032 1.57902 3.21967 1.71967C3.07902 1.86032 3 2.05109 3 2.25C3 2.44891 3.07902 2.63968 3.21967 2.78033C3.36032 2.92098 3.55109 3 3.75 3H14.25C14.4489 3 14.6397 2.92098 14.7803 2.78033C14.921 2.63968 15 2.44891 15 2.25C15 2.05109 14.921 1.86032 14.7803 1.71967C14.6397 1.57902 14.4489 1.5 14.25 1.5Z"
                fill="white"
              />
            </svg>

            Добавить подземный этаж
          </MyButton>
          <AccordionFloors
            v-if="activeEntrance"
            inner
            :floors="innerFloors"
            @drag-end="handleFloorDragEndInner"
            @delete:floor="deleteFloor"
            @copy:floor="(floor) => copyFloor(floor, -(innerFloors.length + 1))"
          />
        </div>
      </template>
    </div>
    <!-- <ConfirmDialog class="test-dialog" group="deleteEntrance"></ConfirmDialog> -->
    <div class="entrance-delete">
      <OverlayPanel unstyled="true" ref="op" class="planEditWindow3dOverlay">
        <h3 class="popover-title">Удалить подъезд?</h3>
        <div class="popover-content">
          <p class="confirmation-content" style="display: none;"></p>
          <div class="confirmation-buttons text-center">
            <div style="display: flex; justify-content: center;" class="overlay-custom-btn-group">
              <button 
                @click="onEntranceDelete()"
                style="display: flex; align-items: center;" 
                class="overlay-custom-btn overlay-custom-btn-xs overlay-custom-btn-success" 
                data-apply="confirmation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" height="13" viewBox="0 0 26 26">
                  <path fill="white" d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"></path>
                </svg>
                  Да
              </button>
              <button 
                @click="toggle"
                style="display: flex; align-items: center;" 
                class="overlay-custom-btn overlay-custom-btn-xs overlay-custom-btn-danger" 
                data-dismiss="confirmation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" height="13" viewBox="0 0 26 26">
                  <path fill="white" d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z"></path>
                </svg>
                Нет
              </button>
            </div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  </div>
  <div v-else class="loader-div">
    <img src="@/app/images/rocket-spinner.svg">
  </div>
  <FormCopyRoom 
    :is-open="isCopyRoomModalOpen"
    :testProp="isCopyRoomModalOpen"
    @closeModel="closeCopyRoomModal"
    @copy:room="handleCopyRoom"
    :room="openedRoom"
    :maxFloor="maxFloor"
    :minFloor="minFloor"
  />
</template>

<script setup>
import useEntranceHooks from "@/features/useEntranceHooks";
import MyButton from "@/shared/UI/MyButton.vue";
import TabItem from "@/widgets/homePage/entranceList/components/tabItem.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import OverlayPanel from "primevue/overlaypanel";
import AccordionFloors from "@/widgets/AccordionFloors/AccordionFloors.vue";
import FormCopyRoom from "@/widgets/forms/formCopyRoom.vue";
import eventBus from "@/eventBus";
import api from "@/shared/api";
const isCopyRoomModalOpen = ref(false)
const op = ref();
const toggle = (event, entrance) => {
  if (entrance) {
    entranceForDelete.value = entrance
  }
  op.value.toggle(event);
};


const route = useRoute();

const house_id = route.params.house_id;

const { entranceList, sortedEntranceList, entrancesLoader, addNewEntrance, updateTitle, getEntranceList, updateEntrance, deleteEntrance } =
  useEntranceHooks();

const handleEntranceAdd = async (house_id) => {
  const entrance = await addNewEntrance(house_id);
  activeEntrance.value = entrance
}
const activeEntrance = ref(null);
const entranceForDelete = ref(null);
const _innerFloors = ref([])
const _outerFloors = ref([])
const positionChanged = ref(false)
const openedFloor = ref(null)
const openedRoom = ref(null)

const closeCopyRoomModal = () => {
  isCopyRoomModalOpen.value = false;
  openedFloor.value = null
  openedRoom.value = null
}

eventBus.$on('open:copy-room', (floor, room) => {
  openedFloor.value = floor
  openedRoom.value = room
  isCopyRoomModalOpen.value = true
})

const onEntranceDelete = () => {
  deleteEntrance(entranceForDelete.value.id)
  toggle(false)
  entranceForDelete.value = null
}
const maxFloor = computed(() => {
  if (!activeEntrance.value) {
    return 0
  }
  return Math.max(...activeEntrance.value.floors.map((floor) => floor.position))
})

const minFloor = computed(() => {
  if (!activeEntrance.value) {
    return 0
  }
  return Math.min(...activeEntrance.value.floors.map((floor) => floor.position))
})

const handleCopyRoom = (room, {from, to, count}, type) => {
  if (type == 'default') {
    const floor = activeEntrance.value.floors.find(floor => floor.id == room.floor_id)
    api.copyRoom(room.id, {floor_id: room.floor_id, position: floor.rooms.length + 1})
      .then((response) => {
        if (response.data) {
          
            if (floor) {
              floor.rooms.push(response.data)
            }
        }
      }).finally(() => closeCopyRoomModal());
  } else {
    const floors = activeEntrance.value.floors.filter(floor => floor.position >= from && floor.position <= to)
  
    api.copyRoom(room.id, {
      copies_count: count, 
      floors_with_position: floors.map(floor => ({id: floor.id, position: floor.rooms.length + 1}))
    })
      .then((response) => {
        if (response.data) {
          Object.entries(response.data).forEach(([id, rooms])=> {
            const floor = activeEntrance.value.floors.find(floor => floor.id == id)
            if (floor) {
              floor.rooms.push(...rooms)
            }
          })
        }
      }).finally(() => closeCopyRoomModal());
  }
  

}

const handleFloorDragEndOuter = ({event, position, dragFloor}) =>  {
  positionChanged.value = true;

  if (dragFloor.position > 0) {
    outerFloors.value = outerFloors.value.map((floor) => {
      if (floor.position === position) {
        return { ...floor, position: dragFloor.position };
      }
      if (floor.position === dragFloor.position) {
        return { ...floor, position };
      }
      return floor;
    });
    
  }

  event.target.style.background = '#fff'
}

const handleFloorDragEndInner = ({event, position, dragFloor}) =>  {
  if (dragFloor.position < 0) {
    innerFloors.value = innerFloors.value.map((floor) => {
      if (floor.position === position) {
        return { ...floor, position: dragFloor.position };
      }
      if (floor.position === dragFloor.position) {
        return { ...floor, position };
      }
      return floor;
    });
  
    event.target.style.background = '#fff'
  }
}

const dragEntranceIndex = ref(1);


const dragStartHandler = (e, index) => {
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  dragEntranceIndex.value = index;
};
const dragEndHandler = (e, position) => {
  (e.target).style.background = "#ffffff";
};
const dragOverHandler = (e) => {
  (e.target).style.background = "#F2EED6";
};
const dropHandler = (e, position) => {
  entranceList.value = entranceList.value.map((entrance) => {
    if (entrance.position === position) {
      return { ...entrance, position: dragEntranceIndex.value };
    }
    if (entrance.position === dragEntranceIndex.value) {
      return { ...entrance, position };
    }
    return entrance;
  });
  
  (e.target).style.background = "#ffffff";
};



const updateFloor = async ({ floor_id, position }) => {
  return await api.updateFloor(floor_id, { position })
  .then(() => {
    positionChanged.value = false
  })
}

const createFloor = async (fields) => {
  api.createFloor(activeEntrance.value.id, fields)
  .then((response) => {
    if (response.data.id) {
      activeEntrance.value.floors.push(response.data)
    }
  })
}


const deleteFloor = (floor) => {
  positionChanged.value = true;
  api.deleteFloor(floor.id)
  .then(() => {
    activeEntrance.value.floors = activeEntrance.value.floors.filter((fl) => fl.id !== floor.id)
  })
}

const copyFloor = (floor, position) => {
  api.copyFloor(floor.id, position)
  .then((response) => {
    activeEntrance.value.floors.push(response.data)
  })
}

onMounted(() => {
  getEntranceList(house_id).then(() => {
    activeEntrance.value = entranceList.value.length ? entranceList.value[0] : null;
  })
})

const outerFloors = computed({
  get() {
    return _outerFloors.value.sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      } else {
        return -1;
      }
    });
  },
  set(value) {
    _outerFloors.value = value
  }
});

const innerFloors = computed({
  get() {
    return _innerFloors.value.sort((a, b) => {
      if (a.position < b.position) {
        return 1;
      } else {
        return -1;
      }
    });
  },
  set(value) {
    _innerFloors.value = value
  }
});

const entranceFloorsLength = computed(() => activeEntrance.value ? activeEntrance.value.floors.length : 0)

watch([activeEntrance, entranceFloorsLength], () => {
  outerFloors.value = activeEntrance.value.floors.filter(floor => floor.position > 0)
  innerFloors.value = activeEntrance.value.floors.filter(floor => floor.position < 0)
})


// used only to update position
watch(() => outerFloors, (newValue, oldValue) => {
  if (!positionChanged.value || (oldValue.value.length && newValue.value.length !== oldValue.value.length)) return

  outerFloors.value.forEach((floor, index) => {
    floor.position = index + 1
    updateFloor({ floor_id: floor.id, position: floor.position })
  })

  positionChanged.value = false;
}, { deep: true })

// used only to update position
watch(() => innerFloors, (oldValue, newValue) => {
  if (!positionChanged.value || (oldValue.value.length && newValue.value.length !== oldValue.value.length)) return

  innerFloors.value.forEach((floor, index) => {
    floor.position = 0 - (index + 1)
    updateFloor({ floor_id: floor.id, position: floor.position })
  })

  positionChanged.value = false;
}, { deep: true })

</script>

<style scoped lang="scss">
.loader-div {
  display: flex;
  justify-content: center;
  margin-top: 110px;

  img {
    width:100px;
    max-width: none;
  }
}
.entranceList {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &__head {
    width: 100%;
    height: auto;
    column-gap: 20px;
    overflow: auto;
  }

  &__addBtn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 8px;
    padding-bottom: 16px;
  }
}

</style>

<style>

.planEditWindow3dOverlay {
  box-shadow: 0 6px 27px rgba(0, 0, 0, 0.25);
}

.p-overlaypanel-content {
  padding: 0 !important;
}
.popover-content {
  padding: 12px 15px;
  background-color: #fff;
}

.popover-title {
  margin: 0;
  padding: 8px 14px;
  font-size: 15px;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  border-radius: 5px 5px 0 0;
}

.overlay-custom-btn-group {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.overlay-custom-btn-group > .overlay-custom-btn:first-child:not(:last-child) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

.overlay-custom-btn-group > .overlay-custom-btn:first-child {
    margin-left: 0;
}

.overlay-custom-btn-group .overlay-custom-btn {
    border-radius: 4px;
    margin: 0;
    font-weight: bold;
    transition: .25s all;
}

.overlay-custom-btn-xs {
    font-size: 13px;
    line-height: 15px;
    padding: 4.5px 10.5px;
    border-radius: 10px;
}

.overlay-custom-btn-success {
    background-color: #42CBBE;
    border-color: #42CBBE;
    color: #fff;
}

.overlay-custom-btn-group > .overlay-custom-btn:last-child:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

.overlay-custom-btn-danger {
    background-color: #EB3235;
    border-color: #EB3235;
    color: #fff;
}

.overlay-custom-btn-success:hover {
    background-color: #2fab9f;
    border-color: #2fab9f;
    color: #fff;
}

.overlay-custom-btn-danger:hover {
    background-color: #B70003;
    border-color: #B70003;
    color: #fff;
}

</style>