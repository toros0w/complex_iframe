<template>
  <div class="planRoomsWindow" :class="[isOpenAdvertRoomsWindow ? 'open' : '']">
    <div class="planRoomsWindow__wrapper">
      <div class="planRoomsWindow__title">
        Укажите помещения, которые необходимо поместить в рекламу {{props.advertType === 'domclick' ? 'Домклик' : (props.advertType === 'avito' ? 'Авито' : (props.advertType === 'cian' ? 'Циан' : (props.advertType === 'ya' ? 'Яндекс' : '')))}}
      </div>
      <div class="planRoomsWindow__table">
        <div
            class="table__content"
            ref="cellContainer"
            @mousedown="mouseDownHandlerContainer($event)"
        >
          <div class="overlay">
            <Button severity="info" @mousedown.stop="addCells()">Добавить</Button>
            <Button severity="secondary" outlined @mousedown.stop="removeCandidate($event)"
            >Удалить</Button
            >
          </div>
          <div class="selectionBox"></div>
          <div
              class="section"
              v-for="entrance in entrances"
              :key="`section${entrance.id}`"
          >
            <div style="width: 100%; text-align: center; user-select: none;">
              {{ entrance.name }}
            </div>
            <div
                class="row flex flex-row gap-x-2.5 w-100 !justify-end"
                v-for="index in floorsNumbers"
                :set="floor = entrance.floors.find(floor => floor.position == index)"
                :key="index"
            >
              <template v-if="floor">
                <div class="row flex-row-reverse" :key="`floor${index}`" v-if="floor && isDifferentFloors">
                  <div style="width: 25px; color: #000;" class="cell text-grey-900">{{ Number(floor.position) }}</div>
                </div>
                <div
                    class="cell cursor-pointer apartament"
                    v-for="appartament in floor.rooms"
                    :data-appartment="JSON.stringify(appartament)"
                    :key="`apartament${appartament.id}`"
                    :style="{'background-color': appartament.complex_status_info.status_color}"
                    :class="[
                    isSelected(appartament.id) ? 'selected' : '',
                  ]"
                    @mousedown="handleCellClick($event, appartament)"
                >
                  {{ appartament.layout_feature != 'studio' ? appartament.rooms_count : 'ст' }}
                  <div class="overlay">
                    <div class="overlay__content">
                      <div class="overlay__countRooms">
                        {{ appartament.rooms_count }}к
                      </div>
                      <div class="overlay__number">№{{ appartament.number }}</div>
                      <div class="overlay__square">{{ appartament.area }} м2</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- <div class="table__numberRows">
          <div
            class="row"
            v-for="index in floorsNumbers"
            :key="`floor${index}`"
          >
            <div class="cell">{{ Number(index) }}</div>
          </div>
        </div> -->
      </div>
      <div class="planRoomsWindow__btns">
        <Button
            severity="success"
            class="mr-7.5"
            @click="saveSelected"
        >
          <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2"
          >
            <path
                d="M15.5325 6.9675L11.0325 2.4675C10.9634 2.40004 10.8819 2.34656 10.7925 2.31C10.6995 2.27221 10.6004 2.25187 10.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H13.5C14.0967 15.75 14.669 15.5129 15.091 15.091C15.5129 14.669 15.75 14.0967 15.75 13.5V7.5C15.7506 7.4013 15.7317 7.30345 15.6943 7.21207C15.657 7.12069 15.602 7.03758 15.5325 6.9675ZM6.75 3.75H9.75V5.25H6.75V3.75ZM11.25 14.25H6.75V12C6.75 11.8011 6.82902 11.6103 6.96967 11.4697C7.11032 11.329 7.30109 11.25 7.5 11.25H10.5C10.6989 11.25 10.8897 11.329 11.0303 11.4697C11.171 11.6103 11.25 11.8011 11.25 12V14.25ZM14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25H12.75V12C12.75 11.4033 12.5129 10.831 12.091 10.409C11.669 9.98705 11.0967 9.75 10.5 9.75H7.5C6.90326 9.75 6.33097 9.98705 5.90901 10.409C5.48705 10.831 5.25 11.4033 5.25 12V14.25H4.5C4.30109 14.25 4.11032 14.171 3.96967 14.0303C3.82902 13.8897 3.75 13.6989 3.75 13.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H5.25V6C5.25 6.19891 5.32902 6.38968 5.46967 6.53033C5.61032 6.67098 5.80109 6.75 6 6.75H10.5C10.6989 6.75 10.8897 6.67098 11.0303 6.53033C11.171 6.38968 11.25 6.19891 11.25 6V4.8075L14.25 7.8075V13.5Z"
                fill="white"
            />
          </svg>
          Сохранить
        </Button>
        <Button severity="secondary" @click="cancelSelected()">Отменить</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/shared/api";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  isOpenAdvertRoomsWindow: Boolean,
  advertType: 'domclick'
});

const emits = defineEmits(["close"]);

const selectedCells = ref([]);
const cellContainer = ref(HTMLElement);
const entrances = ref([]);
const route = useRoute();

const selectedRooms = ref([]);
const isSelecting = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const isDifferentFloors = computed(()=> {
  return !(entrances.value
      .every((entrance) => entrance.floors
          .every(
              (floor, index) => {
                return entrances.value[0].floors.length === entrance.floors.length &&
                    entrances.value[0].floors[index] &&
                    floor.position == entrances.value[0].floors[index].position
              }
          )
      ))
})
const mouseDownHandlerContainer = (e) => {
  isSelecting.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  clearSelection();
  closeOverlay();
  const selectionBox = cellContainer.value.querySelector(".selectionBox");
  if (selectionBox) {
    selectionBox.style.display = "block";
    selectionBox.style.left = `${startX.value}px`;
    selectionBox.style.top = `${startY.value}px`;
  }

  function handleMouseMove(event) {
    currentX.value = event.clientX;
    currentY.value = event.clientY;

    const selectionBox = cellContainer.value.querySelector(".selectionBox");
    selectionBox.style.display = "block";
    if (selectionBox) {
      selectionBox.style.width = `${Math.abs(startX.value - currentX.value)}px`;
      selectionBox.style.height = `${Math.abs(
          startY.value - currentY.value
      )}px`;


      if (startX.value > event.clientX && startY.value > event.clientY) {
        selectionBox.style.transform = `translate(-${selectionBox.style.width}, -${selectionBox.style.height})`;
      } else if (startX.value > event.clientX && startY.value < event.clientY) {
        selectionBox.style.transform = `translate(-${selectionBox.style.width}, 0)`;
      } else if (startX.value < event.clientX && startY.value > event.clientY) {
        selectionBox.style.transform = `translate(0, -${selectionBox.style.height})`;
      } else {
        selectionBox.style.transform = `translate(0, 0)`;
      }
      // selectionBox.style.
    }

    const minX = Math.min(startX.value, currentX.value);
    const minY = Math.min(startY.value, currentY.value);
    const maxX = Math.max(startX.value, currentX.value);
    const maxY = Math.max(startY.value, currentY.value);

    clearSelection();

    const cells = document.querySelectorAll(".apartament");

    cells.forEach((cell) => {
      const rect = cell.getBoundingClientRect();
      const cellXmax = rect.left + rect.width / 2;
      const cellYmax = rect.top + rect.height / 2;


      const apartment = JSON.parse(cell.getAttribute("data-appartment"))

      if (
          minY <= cellYmax &&
          minX <= cellXmax &&
          maxX >= cellXmax &&
          maxY >= cellYmax
      ) {
        cell.classList.add("selected");
        selectedCells.value.push(apartment);
      } else {
        if (!selectedRooms.value.find((room) => room.id === apartment.id)) {
          cell.classList.remove('selected')
        }
      }
    });
  }

  const handleMouseUp = (e) => {
    if (!cellContainer.value) return;
    isSelecting.value = false;
    const selectionBox = cellContainer.value.querySelector(".selectionBox");
    if (selectionBox) {
      selectionBox.style.width = '0px'
      selectionBox.style.height = '0px'
      selectionBox.style.display = "none";
    }
    if (!isSelecting.value && selectedCells.value.length > 2) {
      openOverlay(e);
    }
    if (selectedCells.value.length === 1) {
      if (!isSelected(selectedCells.value[0].id)) {
        selectedRooms.value = [
          ...selectedRooms.value,
          ...selectedCells.value,
        ];
        selectedCells.value = [];
      } else {
        const index = selectedRooms.value.findIndex(
            (el) => el.id === selectedCells.value[0].id
        );
        selectedRooms.value.splice(index, 1);
      }
    }
    cellContainer.value.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  cellContainer.value.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const saveSelected = () => {
  const room_ids = selectedRooms.value.map(room => room.id)

  return api.sendRoomsToAdvert(room_ids, route.params.house_id, props.advertType)
      .then((response) => {
        emits("close");
      });
}

function openOverlay(e) {
  const overlay = cellContainer.value.querySelector(".overlay");
  overlay.style.left = `${e.x}px`;
  overlay.style.top = `${e.y}px`;
  overlay.style.display = "flex";
}

const handleCellClick = (event, appartament) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  const cell = event.target;
  if (!event.ctrlKey) {
    clearSelection();
  }


  if (cell.classList.contains("selected")) {
    const index = selectedRooms.value.findIndex((ap) => ap.id == appartament.id);
    if (index !== -1) {
      selectedRooms.value.splice(index, 1);
    }
    cell.classList.remove("selected");
  } else {
    selectedRooms.value.push(appartament) // = [...selectedRooms.value, appartament];// JSON.parse(cell.getAttribute("data-apartament"))
    cell.classList.add("selected");
  }
}

function clearSelection() {
  selectedCells.value = [];
}

function closeOverlay() {
  const overlay = cellContainer.value.querySelector(".overlay");
  overlay.style.left = `${0}px`;
  overlay.style.top = `${0}px`;
  overlay.style.display = "none";
}

function addCells() {
  const mergedCells = [
    ...selectedRooms.value,
    ...selectedCells.value,
  ];

  const mergedCellsUniqueIds = [...new Set(mergedCells.map((item) => item.id))];

  const filteredCells = [];

  mergedCellsUniqueIds.forEach((id) => {
    const item = mergedCells.find((t) => t.id === id)
    if(item) {
      filteredCells.push(item)
    }
  })
  selectedRooms.value = filteredCells
  selectedCells.value = [];

  closeOverlay();
}
function removeCandidate(event) {
  const cells = document.querySelectorAll(".apartament");
  cells.forEach((cell) => {
    if (selectedCells.value.find((selectedCell) => selectedCell.id === JSON.parse(cell.getAttribute('data-appartment')).id)) {
      cell.classList.remove('selected')
    }
  })
  selectedCells.value.forEach((selectedCell) => {
    selectedRooms.value.forEach((selectedRoom, index) => {
      if (selectedRoom.id === selectedCell.id) {
        selectedRooms.value.splice(index, 1)
      }
    })
  })
  selectedCells.value = [];
  closeOverlay();
}

function cancelSelected() {
  selectedRooms.value = [];
  emits("close");
}

function isSelected(id) {
  const index = selectedRooms.value.findIndex((el) => el.id === id);
  return index === -1 ? false : true;
}

onMounted(async () => {
  await api.getHouseEntrances(route.params.house_id, ['rooms'])
      .then((response) => {
        const updatedEntrances = response.data.sort((a, b) =>
            a.position > b.position ? 1 : -1
        );

        updatedEntrances.forEach(
            (entrance) =>
                (entrance.floors = entrance.floors.sort((a, b) =>
                    a.position > b.position ? 1 : -1
                ))
        );

        updatedEntrances.forEach(
            (entrance) =>
                (
                    entrance.floors.forEach(
                        (floor) => (
                            floor.rooms.forEach(
                                (room) => {
                                  if (props.advertType === 'domclick' && room.add_to_domclick_feed && room.add_to_domclick_feed === 1) {
                                    selectedRooms.value.push(room)
                                  }
                                  if (props.advertType === 'avito' && room.add_to_avito_feed && room.add_to_avito_feed === 1) {
                                    selectedRooms.value.push(room)
                                  }
                                  if (props.advertType === 'cian' && room.add_to_cian_feed && room.add_to_cian_feed === 1) {
                                    selectedRooms.value.push(room)
                                  }
                                  if (props.advertType === 'ya' && room.add_to_yandex_feed && room.add_to_yandex_feed === 1) {
                                    selectedRooms.value.push(room)
                                  }
                                }
                            )
                        )
                    )
                )
            );

        entrances.value = updatedEntrances;
      });
});

const floorsNumbers = computed(() => {
  let max = 0;
  let min = 0;

  if (entrances.value.length) {
    entrances.value.forEach((entrance) => {
      const positions = entrance.floors.map((floor) => floor.position);
      const floorMaxPosition = Math.max(...positions);
      const floorMinPosition = Math.min(...positions);
      if (floorMinPosition < min) {
        min = floorMinPosition;
      }
      if (floorMaxPosition > max) {
        max = floorMaxPosition;
      }
    });
    return Array(max - min + 1)
        .fill()
        .map((_, index) => min + index)
        .filter((num) => num !== 0);
  }
  return [];
});
</script>

<style lang="scss">
.p-confirm-popup {
  &:before {
    border-bottom-color: #4caf50;
  }
  &:after {
    border-bottom-color: #4caf50;
  }
  &.p-confirm-popup-flipped {
    &:before {
      border-top-color: #4caf50;
    }
    &:after {
      border-top-color: #4caf50;
    }
  }
}
.planRoomsWindow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: 0.5s all ease-in-out;

  &.open {
    z-index: 10000;
    opacity: 1;
    visibility: visible;
    transition: 0.5s all ease-in-out;
  }

  &__wrapper {
    min-width: 900px;
    width: auto;
    height: auto;
    padding: 50px;
    background-color: white;
    border-radius: 4px;

    max-width: 100vw;
    max-height: calc(100vh - 100px);
    overflow: auto;
  }

  &__title {
    font-size: 20px;
    margin-bottom: 50px;
  }

  &__table {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    column-gap: 30px;
    max-height: calc(100vh - 380px);
    overflow: auto;

    .table__numberRows {
      width: auto;
      height: auto;
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-start;
      align-items: center;
      row-gap: 10px;
      padding-top: 10px;
      user-select: none;

      .row {
        font-size: 14px;
        @apply text-grey-900;

        .cell {
          padding: 4px 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .table__content {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      column-gap: 42px;
      padding: 20px;

      width: calc(100% - 100px);
      overflow: auto;

      .selectionBox {
        position: absolute;
        background-color: rgba(52, 152, 219, 0.5);
        border: 1px dashed #3498db;
        z-index: 999;
        pointer-events: none;
        display: none;
      }

      .overlay {
        position: absolute;
        width: auto;
        height: auto;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid;
        @apply border-green;
        z-index: 2;
        background-color: #ffffff;
        display: none;
        justify-content: flex-start;
        align-items: center;
        column-gap: 10px;
      }

      .section {
        width: auto;
        height: 100%;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: flex-start;
        row-gap: 10px;

        .row {
          height: 29px !important;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          column-gap: 10px;

          .cell {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            // background-color: #a9e7ab;
            opacity: 0.5;
            padding: 4px 12px;
            border-radius: 4px;
            width: 40px;
            font-size: 14px;
            user-select: none;

            &:hover {
              .overlay {
                opacity: 1;
                visibility: visible;
                transition: 0.3s all ease-in-out;
              }
            }

            &.selected {
              // @apply bg-green;
              opacity: 1;
            }

            .overlay {
              position: absolute;
              left: -10px;
              top: calc(100% + 6px);
              width: max-content;
              height: max-content;
              border-radius: 6px;
              border: 1px solid #4caf50;
              background: #ffffff;
              padding: 10px;
              opacity: 0;
              visibility: hidden;
              transition: 0.3s all ease-in-out;
              z-index: 20;

              &::before {
                content: "";
                position: absolute; /* Абсолютное позиционирование */
                left: 18px;
                top: -16px; /* Положение треугольника */
                border: 8px solid transparent; /* Прозрачные границы */
                border-bottom: 8px solid #4caf50; /* Добавляем треугольник */
              }

              &__content {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: 24px 1fr;
                grid-gap: 10px 4px;
              }

              &__countRooms {
                width: 24px;
                height: 24px;
                border-radius: 50px;
                background: #4caf50;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              &__square {
                color: #333;
                font-size: 14px;
                grid-row: 1;
                grid-column: 2;
                align-self: center;
              }
              &__number {
                color: #757575;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }

  &__btns {
    margin-top: 50px;
  }

  @media screen and (max-width: 1600px) {
    &__wrapper {
      min-width: 700px;
      padding: 30px;
    }
    &__title {
      font-size: 16px;
      margin-bottom: 30px;
    }
    &__btns {
      margin-top: 30px;
    }
  }
}
</style>
