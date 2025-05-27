<template>
  <Teleport to="body">
    <requestModal @close="closeReqModal" :isOpen="isReqOpen" :info="info" />
    <FormAddRoom
      :isOpen="openedRoom.id"
      @closeModel="closeModal"
      :floor="{ id: openedRoom?.floor_id }"
      :room="openedRoom"
    />
  </Teleport>
  
  <div
  class="modelWindow"
  :class="[isOpen ? 'open' : '', (openFullImage || openFullPlan) ? 'openFull' : '']"
  ref="window"
  >
<div class="detail-apartment-wrapper">
  <div v-if="loaderClosing" class="loader-div appartmentloader">
      <RocketSpinner/>
    </div>
    <button class="modelWindow__close" @click="emits('update:isOpen'), (openFullImage = false), (openFullPlan = false), (emits('full:plan-state-updated', false))">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M22.8281 20L31.4141 11.4141C32.1953 10.6328 32.1953 9.36719 31.4141 8.58594C30.6328 7.80469 29.3672 7.80469 28.5859 8.58594L20 17.1719L11.4141 8.58594C10.6328 7.80469 9.36719 7.80469 8.58594 8.58594C7.80469 9.36719 7.80469 10.6328 8.58594 11.4141L17.1719 20L8.58594 28.5859C7.80469 29.3672 7.80469 30.6328 8.58594 31.4141C8.97656 31.8047 9.48828 32 10 32C10.5117 32 11.0234 31.8047 11.4141 31.4141L20 22.8281L28.5859 31.4141C28.9766 31.8047 29.4883 32 30 32C30.5117 32 31.0234 31.8047 31.4141 31.4141C32.1953 30.6328 32.1953 29.3672 31.4141 28.5859L22.8281 20Z"
                    fill="#757575" />
            </svg>
      </button>
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
<div class="apartment-number">Квартира {{ props.apartment.number }} </div>
<div class="apartment-detail">
  <div class="apartment-image">
    <div class="apartment-status" :style="{ backgroundColor: getBackgroundColor(props.apartment.status_type) }">{{ props.apartment.status_name }}</div>
    <img :src="apartment.plan_url?apartment.plan_url :'./img/gallery.ba802855.svg' " alt='' class="image" />
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
        <td>{{ props.apartment.rooms_count }} ккв</td>
      </tr>
      <tr>
        <td class="td-title">Название ЖК</td>
        <td>{{ props.apartment.complex_name }}</td>
      </tr>
      <tr>
        <td class="td-title">№ дома</td>
        <td>{{ props.apartment.house_name }}</td>
      </tr>
      <tr>
        <td class="td-title">{{ props.apartment.entrance_name }}</td>
        <td>5</td>
      </tr>
      <tr>
        <td class="td-title">№ кв</td>
        <td>{{ props.apartment.number }}</td>
      </tr>
      <tr>
        <td class="td-title">Этаж</td>
        <td>{{ props.apartment.floor }}</td>
      </tr>
      <tr v-if="apartment.windows_placement_id">
        <td class="td-title">Куда выходят окна</td>
        <td>{{ props.apartment.windows_placement_id }}</td>
      </tr>
      <tr>
        <td class="td-title">Тип</td>
        <td>{{ room_types[apartment.type] }}</td>
      </tr>
      <tr v-if="apartment.decoration_id">
        <td class="td-title">Отделка</td>
        <td>{{ getDecoration(props.apartment.decoration_id) }}</td>
      </tr>
    </table>
    <div class="price-wrapper">
      <table class="price-table">
        <tr>
          <td class="full-price">{{ formatTotalPrice(props.apartment.total_amount) }} руб.</td>
        </tr>
        <tr>
          <td class="squere-price">197 658 руб./м2</td>
        </tr>
      </table>
    </div>
    <div class="primary-btn detail" @click="handleApplicationClick()">Забронировать</div>
  </div>
</div>
<div v-if="props.apartment.figures"  class="detail-bottom">
  <div class="bottom-title text-base sm:text-lg md:text-xl lg:text-2xl open">Расположение на этаже</div>
  <div class="chessFloors__resize" ref="zoomSlider"></div>
  <div
    class="chessFloors__mapFloor relative"
    ref="container"
  >
    <div class="map ol-map" :id="canvasId" ref="map">
      <div
          class="modelWindow__fullPlan window-chess-floor open appartmentWindow"
        >
          <ChessFloors
            class="appartmentWindow-chessFloor"
            v-if="props.apartment.figures"
            :house_name="house_name"
            :complex_name="complex_name"
            :filters="filters"
            :custom-figures="props.apartment.figures"
            :list-floor-is-show="true"
            :cardinal-directions-is-show="false"
            canvasId="apartmentPlan"
          />
        </div>
    </div>
  </div>
</div>
</div>
  </div>
  <Toast />
</template>

<script setup>
import {
  computed,
  customRef,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import draggable from 'vuedraggable';
import moment from "moment-timezone";
import Toast from "primevue/toast";
import SplitButton from "primevue/splitbutton";
import { useToast } from "primevue/usetoast";
import { useComplexStore } from '@/app/store/complex';  // Adjust the path to where it's defined
import RocketSpinner from "@/components/RocketSpinner.vue";
//import { PTOptions } from "primevue/ts-helpers";
import { useFieldsStore } from "@/app/store/fields";
import useViewFloors from "@/features/useViewFloors";
import api from "@/shared/api";
import { room_types, formatNumber, isErrorStatus, getStatusText, isWaitStatus, isActiveStatus, isSendToAds } from "@/shared/utils/util";
import eventBus from "@/eventBus";
import modalDetail from "./modalDetail.vue";
import Tabs from "@/components/Tabs.vue";
import FormAddRoom from "@/widgets/forms/formAddRoom.vue";
import ChessFloors from "@/widgets/homePage/viewHome/chessFloors.vue";
import requestModal from "@/shared/UI/requestModal.vue";
const colors = JSON.parse(localStorage.getItem('colors')) || {}
const useViewFloor = useViewFloors();

const statusMap = {
  reservation: 'color_reserved',
  available: 'color_free',
  not_for_sale: 'not_for_sale',
  sold: 'sold',
}

const complexHook = useComplexStore();
const figuresData = ref([]);
const agencyPhone = ref(null)
agencyPhone.value = localStorage.getItem('agencyPhone') || ''

const hoveredFigure = ref(null)
const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);
const fieldsStore = useFieldsStore()
const isReqOpen = ref(false);
const decorations = ref([])
const toast = useToast();
const splitButton = ref();
const loaderClosing = ref(true)

console.log(1 , loaderClosing , "asdasdasdasd");

setTimeout(() => {
  loaderClosing.value = false
  console.log(2 , loaderClosing , "asdasdasdasd");
  
}, 3000);

const openReqModal = () => {
  isReqOpen.value = true
}

const closeReqModal = () => {
  isReqOpen.value = false
  loaderClosing.value = false
}


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

const route = useRoute();
const props = defineProps({
  isOpen: Boolean,
  apartment: Object,
  availableFloors: Array,
  decorations: {
    type: Array,
    default: [],
  },
  windowsPlacements: {
    type: Array,
    default: [],
  },

  house_name: String,
  complex_name: String,
  filters: Object
});

const info = ref({});

watch(() => props, (newProps) => {
  info.value = {
    complexName: newProps.complex_name,
    houseName: newProps.house_name,
    entranceName: newProps.apartment?.entrance_name,
    roomNumber: newProps.apartment?.number,
  };
}, { deep: true, immediate: true });


const openedRoom = ref({});
// const pdfButton = ref(null)
const reservations = computed(() => props.apartment.reservations)
const canChangeQueue = computed(() => props.apartment.can_change_queue)
const activeReservation = computed(() => reservations.value ? reservations.value[0] : {})

const tabs = computed(() => (
    [
        { 
            label: 'Информация',
            visible: true,
        },
        {
          label: 'Отчет по рекламе',
          visible: isSendToAds(props.apartment),
        },
        {
            label: 'Очередь',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(60.000000, 0.000000)" stroke="none">
                            <path d="M178.2,192h150a6,6,0,0,0,0-12h-150a6,6,0,0,0,0,12Z"></path>
                            <path d="M117.614,184.889l-13.331,12.745-5.407-5.407a6,6,0,1,0-8.484,8.485l9.555,9.556a6,6,0,0,0,8.389.094l17.571-16.8a6,6,0,1,0-8.293-8.673Z"></path>
                            <path d="M108.2,156.9a40.722,40.722,0,1,0,40.722,40.721A40.767,40.767,0,0,0,108.2,156.9Zm0,69.443a28.722,28.722,0,1,1,28.722-28.722A28.754,28.754,0,0,1,108.2,226.347Z"></path>
                            <path d="M178.2,292h150a6,6,0,0,0,0-12h-150a6,6,0,0,0,0,12Z"></path>
                            <path d="M117.614,284.889l-13.331,12.745-5.407-5.407a6,6,0,1,0-8.484,8.485l9.555,9.556a6,6,0,0,0,8.389.094l17.571-16.8a6,6,0,1,0-8.293-8.673Z"></path>
                            <path d="M108.2,256.9a40.722,40.722,0,1,0,40.722,40.721A40.767,40.767,0,0,0,108.2,256.9Zm0,69.443a28.722,28.722,0,1,1,28.722-28.722A28.754,28.754,0,0,1,108.2,326.347Z"></path>
                            <path d="M117.614,384.889l-13.331,12.745-5.407-5.407a6,6,0,1,0-8.484,8.485l9.555,9.556a6,6,0,0,0,8.389.094l17.571-16.8a6,6,0,1,0-8.293-8.673Z"></path>
                            <path d="M108.2,356.9a40.722,40.722,0,1,0,40.722,40.721A40.767,40.767,0,0,0,108.2,356.9Zm0,69.443a28.722,28.722,0,1,1,28.722-28.722A28.754,28.754,0,0,1,108.2,426.347Z"></path>
                            <path d="M178.2,212h80a6,6,0,0,0,0-12h-80a6,6,0,0,0,0,12Z"></path>
                            <path d="M178.2,312h80a6,6,0,0,0,0-12h-80a6,6,0,0,0,0,12Z"></path>
                            <path d="M457.271,267.7A31.02,31.02,0,0,0,433.8,272.18L372,312.766V87.625C372,67.775,355.687,52,335.836,52H298V33.375a6,6,0,0,0-12,0V52H235V33.375a6,6,0,0,0-12,0V52H173V33.375a6,6,0,0,0-12,0V52H110V33.375a6,6,0,0,0-12,0V52H65.836A35.582,35.582,0,0,0,30,87.625v361C30,468.476,45.985,485,65.836,485h270C355.687,485,372,468.476,372,448.625V387.46l96.086-63.1A31.217,31.217,0,0,0,457.271,267.7ZM291.661,89.574a10.61,10.61,0,1,1-10.61,10.61A10.621,10.621,0,0,1,291.661,89.574Zm-62.523,0a10.61,10.61,0,1,1-10.611,10.61A10.622,10.622,0,0,1,229.138,89.574Zm-62.525,0A10.61,10.61,0,1,1,156,100.184,10.622,10.622,0,0,1,166.613,89.574Zm-62.523,0a10.61,10.61,0,1,1-10.611,10.61A10.622,10.622,0,0,1,104.09,89.574ZM360,448.625A24.491,24.491,0,0,1,335.836,473h-270C52.6,473,42,461.859,42,448.625v-361A23.57,23.57,0,0,1,65.836,64H98V78.388c-9,2.636-16.565,11.406-16.565,21.8a22.605,22.605,0,1,0,45.21,0A22.185,22.185,0,0,0,110,78.388V64h51V78.388a22.324,22.324,0,0,0-16.8,21.8,22.634,22.634,0,0,0,45.268,0A23.2,23.2,0,0,0,173,78.388V64h50V78.388c-9,2.636-16.541,11.406-16.541,21.8a22.6,22.6,0,1,0,45.2,0A22.2,22.2,0,0,0,235,78.388V64h51V78.388a22.3,22.3,0,0,0-16.779,21.8,22.631,22.631,0,0,0,45.262,0c0-10.39-7.483-19.16-16.483-21.8V64h37.836C349.069,64,360,74.392,360,87.625V320.646l-22.537,14.8a6,6,0,0,0-1.439,8.7h0a6,6,0,0,0,8.026,1.327l89.218-58.589,7.257,11.046L289.368,397.2l-7.259-11.047,28.4-18.647a6,6,0,0,0-6.587-10.031L270.533,379.4c-.061.041-.117.092-.179.135-.152.108-.3.216-.446.338-.048.04-.09.086-.135.128H178.2a6,6,0,0,0,0,12h84.81l-4.249,8.028c-.185-.017-.371-.028-.561-.028h-80a6,6,0,0,0,0,12h74.225l-6.937,13.105a6,6,0,0,0,5.3,8.807c.053,0,.106,0,.158,0l50.707-1.329c.123,0,.244-.024.366-.034s.261-.017.391-.037c.159-.024.313-.065.467-.1.114-.027.229-.046.343-.08a5.949,5.949,0,0,0,.767-.289c.061-.027.118-.065.178-.1a6,6,0,0,0,.566-.314c.02-.013.041-.02.059-.033L360,395.341Zm-69.439-27.757-29.667.777,13.462-25.438Zm12.655-2.593-.461-.7-6.8-10.344,151.157-99.265,7.258,11.045Zm161.013-106.12-20.756-31.589a19.363,19.363,0,0,1,16.073.484,17.179,17.179,0,0,1,3.973,2.649A19.275,19.275,0,0,1,464.229,312.155Z"></path>
                        </g>
                    </svg>`,
            count: props.apartment.reservations?.length,
            visible: props.apartment.reservations?.length > 0,
        },
    ]
));

const handleSplitButtonClick = () => {
  splitButton.value.onDropdownButtonClick();
};

const closeModal = (room) => {
  if (room) {
    Object.entries(room).forEach(([key, value]) => {
      openedRoom.value[key] = value;
    });
  }

  openedRoom.value = {};
};

const handleApplicationClick = () => {
  isReqOpen.value = true
};

const handleChangeStatus = (e) => {
  api
    .updateRoom({ id: props.apartment.id, complex_status_id: e.item.value })
    .then((res) => {
      props.apartment.complex_status_id = res.data.complex_status_id;
      props.apartment.status_id = res.data.status_id;
      props.apartment.status_name = res.data.status_name;
      props.apartment.status_type = res.data.status_type;
      props.apartment.status_color = res.data.status_color;
      props.apartment.complex_status_info = res.data.complex_status_info;
      props.apartment.reservations = res.data.reservations;

      toast.add({
        severity: "success",
        summary: "Статус обновлен",
        detail: "Статус помещения успешно обновлен",
        life: 3000,
      });

      eventBus.$emit('change-apartment-status', props.apartment.id, e.item.value)
    });
};

const statuses = computed(() => {
  return fieldsStore.complex_status.map((status) => ({
    label: status.name,
    value: status.id,
    command: handleChangeStatus,
  }))
});

// const handleReservationClick = (apartment) => {
//   if (apartment.status != 'reservation') return

//   api.getRoomRequisition(apartment.id).then((res) => {
//     requisition.value = res.data
//   })
// }

const emits = defineEmits([
  "update:isOpen",
  "floor:changed",
  "update:activeFloor",
  "update:viewGrid",
  "update:is-open-window",
  "full:plan-state-updated"
]);
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

const { isOpen } = toRefs(props);

const window = ref < HTMLElement > HTMLElement;
const openFullImage = ref(false);

// Plan
const openFullPlan = ref(false);

// const floors = ref(["10 этаж", "9 этаж", "7 этаж"]);
const activeFloor = ref(props.apartment.floor);
const availableFloorsNames = computed(() =>
  props.availableFloors.map((floor) => ({
    label: `${floor.position} Этаж`,
    value: floor.position,
  }))
);
const setHoveredFigureVisible = (id) => {
  hoveredFigure.value = activeFloor?.value?.plan.figures.find((figure) => figure.id === id)
  if(useViewFloor.hoveredFigure.value) {
    useViewFloor.hoveredFigure.value.visible = hoveredFigure.value && hoveredFigure.value.room.visible 
  }
}
watch(() => useViewFloor.hoveredFigure.value?.id_, setHoveredFigureVisible)


const getDecoration = (decoration_id) => {
  if (!decoration_id) return "";

  return props.decorations.find(
    (decoration) => decoration.code == decoration_id
  )?.name;
};

const getWindowsPlacement = (windows_placement_id) => {
  if (!windows_placement_id || !props.windowsPlacements) return "";

  return props.windowsPlacements.find(
    (windowsPlacement) => windowsPlacement.id == windows_placement_id
  )?.name;
};

watch(
  () => props.apartment,
  (value) => {
    activeFloor.value = value.floor;

    if (value) {
      fetchPlanFigures()
    }
  }
);

const floorChanged = (event) => {
  emits("floor:changed", event.value);
};

const dropdownStyle = ref({
  root: {
    class: ["!border-0"],
  },
  input: {
    class: ["!text-black"],
  },
});

const handleListenChange = ({ complex_status_id, req_id }) => {
  // const status = fieldsStore.complex_status.find((status) => status.id == complex_status_id);
  // props.apartment.complex_status_id = complex_status_id;
  // props.apartment.complex_status_info.status_name = status.name;
  // props.apartment.complex_status_info.status_color = status.color;
  // props.apartment.complex_status_info.status_type = status.status;

  props.apartment.requisition_id = req_id;
};

const handlePdfStateChanged = (apartamentId) => {
  if (props.apartment.id == apartamentId) {
    props.apartment.inPdf = !props.apartment.inPdf
  }
}

const handleCreatedRequisition = (requisitions) => {
  props.apartment.requisitions = requisitions
  console.log(requisitions);
  
  toast.add({
    severity: "success",
    summary: "Заявка создана",
    detail: "Перейдите в раздел заявки",
    life: 3000,
  });
}

const handleChangeReservations = (reservations) => {
  props.apartment.reservations = reservations.data
  props.apartment.can_change_queue = reservations.can_change_queue
}

const handleOpenRequisitions = (apartment) => {
  eventBus.$emit("apartment-open-requisitions", {
    id: apartment.id,
    title: `${room_types[apartment.type]} № ${apartment.number} ID ${apartment.id}`
  });
};

const handleOpenReservation = (id, apartment_id, apartment_type, apartment_number) => {
  eventBus.$emit("apartment-open-reservation", {
    id,
    apartment_title: `${room_types[apartment_type]} № ${apartment_number} ID ${apartment_id}`
  });
};

const removeFromQueue = (revervation_id) => {
  const tooltip = document.querySelector('.ui-tooltip.ui-widget.ui-corner-all.ui-widget-content')

  if (tooltip)
  {
    tooltip.remove()
  }

  api
    .updateRoom({ id: props.apartment.id, requisition_id: revervation_id })
    .then((res) => {
      props.apartment.requisitions = res.data.requisitions;
      props.apartment.reservations = res.data.reservations;
      props.apartment.can_change_queue = res.data.can_change_queue;
      props.apartment.complex_status_info = res.data.complex_status_info;

      toast.add({
        severity: "success",
        summary: "Заявка исключен из очереди",
        detail: "Заявка очереди успешно исключен",
        life: 3000,
      });
    });
};

const updateQueuePositions = (reservations) => {
  api
    .updateRoom({ update_positions: reservations })
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Изменена очередь заявок",
        detail: "Очередь заявок успешно изменена",
        life: 3000,
      });
    });
}

const onDragEnd = (event) => {
  const tooltip = document.querySelector('.ui-tooltip.ui-widget.ui-corner-all.ui-widget-content')

  if (tooltip)
  {
    tooltip.remove()
  }

  // Get old and new indexes
  const oldIndex = event.oldIndex;
  const newIndex = event.newIndex;

  // Get the dragged item
  const movedItem = reservations.value[newIndex];

  // Shift positions based on the drag movement
  if (oldIndex < newIndex)
  {
    // Dragged down: Decrease positions of the reservations between oldIndex and newIndex
    for (let i = oldIndex; i < newIndex; i++)
    {
      reservations.value[i].position--;
    }
    // Assign the new position to the moved item
    movedItem.position = newIndex + 1;
  }
  else if (oldIndex > newIndex)
  {
    // Dragged up: Increase positions of the reservations between newIndex and oldIndex
    for (let i = newIndex; i <= oldIndex; i++)
    {
      reservations.value[i].position++;
    }
    // Assign the new position to the moved item
    movedItem.position = newIndex + 1;
  }

  reservations.value.sort((a, b) => a.position - b.position)

  updateQueuePositions(reservations.value.map((r) => ({ id: r.id, position: r.position })))
};


const fetchPlanFigures = async () => {
  if (!props.apartment.figures && props.apartment.id) {
    await api.getRoomFigures(props.apartment.id).then(({data}) => {
      if (!data) return;

      props.apartment.figures = [{
          id: data.id,
          visible: true,
          points: data.points.map((point) => {
            return [point.x, point.y]
          })
        }]
    })
  }
}


const handleOpenFullPlan = () => {
  openFullPlan.value = !openFullPlan.value;
  openFullImage.value = false
  console.log("hellllllll");
  
  emits('full:plan-state-updated', openFullPlan.value)
}

onMounted(() => {
  fetchPlanFigures();
  if (complexHook.agencyPhone) {
    agencyPhone.value = complexHook.agencyPhone
    localStorage.setItem('agencyPhone', complexHook.agencyPhone)
    console.log(agencyPhone,"numberr");
    
  }
  eventBus.$on("apartment-status-changed", handleListenChange);

  eventBus.$on("change-apartment-created-requisition", handleCreatedRequisition);
  eventBus.$on("change-apartment-reservations", handleChangeReservations);

  eventBus.$on('pdf-state-changed', handlePdfStateChanged)
});
const loadDecorations = async () => {
  if (decorations.value.length > 0) return
  const response = await api.getDecorations()
  decorations.value = response.data
}

onMounted(async () => {
  loadDecorations()
  if (complexHook.agencyPhone) {
    agencyPhone.value = complexHook.agencyPhone
    localStorage.setItem('agencyPhone', complexHook.agencyPhone)
    console.log(agencyPhone,"numberr");
    
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

onUnmounted(() => {
  eventBus.$off("apartment-status-changed", handleListenChange);

  eventBus.$off("change-apartment-created-requisition", handleCreatedRequisition);
  eventBus.$off("change-apartment-reservations", handleChangeReservations);

  eventBus.$off("pdf-state-changed", handlePdfStateChanged);
});


</script>

<style scoped lang="scss">
    .btns-wrapper {
    display: flex;
    gap: 40px;
    justify-content: center;
    align-items: center;
}

.appartmentloader{
  width: 100vw;
  height: 100vh;
  transform: translatex(-50%);  
}

.request-btn {
    height: 35px;
}

.modelWindow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 0;
    min-height: 2000px !important;
    height: 100% !important;
    z-index: 1000;
    background-color: #ffffff;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: flex-start;
    visibility: hidden;
    overflow: hidden;
    opacity: 0;

    &.__top_holder{
      display: flex;
      width: 100%;
      height: 100%;  
      background-color: red;
  }

    &.open {
      visibility: visible;
      // width: 100vw;
      opacity: 1;
    }
    
    &.openFull {
      width: 100vw;
    }
    
    &__content {
        width: 100%;
        height: 100%;
        max-width: 100vw;
        padding: 50px;
        overflow-y: scroll;
        overflow-x: hidden;
        border-left: 1px solid #dedede;
        z-index: 99;

    }

    &__fullImage {
        width: 0;
        height: 100%;
        visibility: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        &.open {
            width: 100%;
            visibility: visible;
        }

        img {
            width: 50%;
            height: auto;
            object-fit: fill;
        }
    }

    &__fullPlan {
        width: 0;
        height: 100%;
        visibility: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        &.open {
            visibility: visible;
        }

        img {
            width: 50%;
            height: auto;
            object-fit: fill;
        }
    }

    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    &__title {
        font-weight: 700;
    }

    &__info_box {
        display: flex;
        justify-content: space-between;
        position: relative;
      }
      
      &__info {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        column-gap: 30px;
        margin-bottom: 30px;

        
        .apartment-requisitions {
            color: #237ef7 !important;
            border-color: #3a8efa !important;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            height: 30px;
            line-height: 30px;
            border: 1px solid rgb(208, 208, 208);
            padding: 0px 13px;
            margin: 0px;
            font-family: Lato, sans-serif;
        }
    }

    &__status {
        @apply bg-green;
        @apply text-white;
        @apply rounded-s-md;
        font-weight: 700;
        padding: 8px 10px;
        margin-left: auto;
        margin-right: -50px;
    }

    &__image {
        width: 100%;
        min-width: 500px;
        position: relative;
        margin-bottom: 30px;

        .image {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 50%;
            }
        }

        .image__loop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(#ffffff, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: 0.5s all ease-in-out;

            svg {
                width: 140px;
                height: 140px;
            }
        }

        &:hover {
            .image__loop {
                opacity: 1;
                visibility: visible;
                transition: 0.5s all ease-in-out;
                cursor: pointer;
            }
        }
    }

    /* .btn-wrapper {
    display: flex;
    align-items: center;
    } */
    .square-price-and-btn {
        display: flex;
        justify-content: space-between;
        // background-color: #FF3838;  
    }

    .to_send_complexes {
        // background-color: #FF3838;
        color: #ffffff;
        user-select: none;
        cursor: pointer;
        border-radius: 3px;
        min-width: 55px;
        max-width: 55px;
        height: 25px;
        font-size: 14px;
        line-height: 0.6;
        padding: 8px 13px;

        &.active {
          background-color: black;
        }
    }

    .mt-30px {
        margin-top: 30px;
    }

    &__btns {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        margin-bottom: 30px;
    }

    &__price {
        display: flex;
        justify-content: space-between;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;

        p {
            padding: 0;
            font-size: 14px;
            cursor: pointer;
            color: #666666;
        }

        p:hover {
            color: #007eff;

            path {
                fill: #007eff;
            }
        }
    }

    &__priceSqure {
        font-size: 18px;
        @apply text-grey-900;
        margin-bottom: 30px;
    }

    &__settings {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        .settings__title {
            font-size: 18px;
            line-height: 100%;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .settings__table {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;

            .row {
                width: 100%;
                height: auto;
                display: grid;
                grid-template-columns: 250px 1fr;
                @apply border-b;
                @apply border-grey-400;

                .cell {
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding: 11px 30px;
                    @apply text-black;
                    font-size: 14px;
                    font-weight: 300;

                    &:first-child {
                        padding: 11px 0;
                        @apply border-r;
                        @apply border-grey-400;
                        @apply text-grey-900;
                    }
                }
            }
        }
    }

    .window-chess-floor{
      width: 100vw;
    }

    :deep(.modelWindow__fullPlan.window-chess-floor.open.appartmentWindow) {
      .window-chess-floor .chessFloors{
      }
      .chessFloors__head{
        .chessFloors__title , .chessFloors__title+div{
          display: none !important;
        }
      }
      .chessFloors__listFloor {
        display: none !important;
      }
     .chessFloors {
        height: 100% !important;
        width: 100vw !important;
        padding: 20px !important;
        grid-template-columns: 1fr;
}
    } 

    .appartmentWindow-chessFloor{
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    @media screen and (max-width: 1600px) {
        &.open {
            visibility: visible;
        }
  
        &.openFull {
            width: 100%;
        }
  
        &__content {
            width: 100%;
            height: 100%;
            max-width: 550px;
            padding: 30px;
            overflow-y: scroll;
            border-left: 1px solid #dedede;
            border: 1px solid red;
        }
  
        &__fullImage {
            width: 0;
            height: 100%;
            visibility: hidden;
            transition: 0.5s all ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 10px;
  
            &.open {
                width: 100%;
                visibility: visible;
                transition: 0.5s all ease-in-out;
            }
  
            img {
                width: 50%;
                height: auto;
                object-fit: fill;
            }
        }
  
        &__fullPlan {
            width: 0;
            height: 100%;
            visibility: hidden;
            transition: 0.5s all ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 10px;
  
            &.open {
                width: 100%;
                visibility: visible;
                transition: 0.5s all ease-in-out;
            }
  
            img {
                width: 50%;
                height: auto;
                object-fit: fill;
            }
        }
  
        &__head {
            margin-bottom: 24px;
        }
  
        &__title {
            font-size: 24px;
            line-height: 100%;
        }
  
        &__close {
            width: 32px;
            height: 32px;
  
            svg {
                width: 100%;
                height: 100%;
            }
        }
  
        &__info {
            column-gap: 30px;
            margin-bottom: 30px;
        }
  
        &__status {
            padding: 6px 8px;
            margin-right: -30px;
        }
  
        &__image {
            margin-bottom: 24px;
  
            .image {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
  
                img {
                    width: 60%;
                }
            }
  
            .image__loop {
                svg {
                    width: 80px;
                    height: 80px;
                }
            }
        }
  
        &__price {
            font-size: 22px;
            margin-bottom: 4px;
        }
  
        &__priceSqure {
            font-size: 14px;
            margin-bottom: 30px;
        }
        
    }
  }
</style>
<style lang="scss" scoped>
.apartment-number {
  font-size: 32px;
  margin-bottom: 40px;
}
.apartment-detail {
  width: 96vw;
  height: 100%;
  max-height: 609px;
  justify-content: space-evenly;
  display: flex;
  gap: 50px;

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
      object-fit: fill;
      max-height: 593px;
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
  margin-top: 10px;
  padding-left: 115px;
}
.detail-apartment-wrapper {
  background-color: #ffffff;
  z-index: 1000;
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly; 
  gap: 20px; 
  margin: auto;  
  overflow-y: auto;
  width: 100% !important;
  padding: 100px 0px;


  .modelWindow__close{
    position: absolute;
    top: 10px;
    right: 10px;
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

.detail-apartment-wrapper {
background-color: #ffffff;
z-index: 1000;
position: fixed;
overflow-y: auto;
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-evenly;
gap: 20px;


.modelWindow__close{
  position: absolute;
  top: 10px;
  right: 10px;
}

.apartment-image{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;  
  max-width: 593px;
}
}
.bottom-title{
  width: 100%;
  text-align: center;
  padding-left: 0px;
}
.detail-bottom {
  width: 100%;
  height: auto;
  margin-top:600px !important;
}

}

.detail-close-btn {
  position: absolute;
  right: 150px;
  top: 15px;
  cursor: pointer;
}

@media (max-width: 768px) {
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
    .bottom-title{
      width: 100%;
      text-align: center;
      padding-left: 0px;
    }

  .dragDrop
  {
    width: 550px;
  }

  }
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

  .detail-apartment-wrapper {
  background-color: #ffffff;
  z-index: 1000;
  position: fixed;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
  padding: 20px 0px;

  .modelWindow__close{
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .apartment-image{
    width: 100%;
    height: 57%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.bottom-title{
  width: 100%;
  text-align: center;
  padding-left: 0px;
  font-size: 31px;
}
.detail-bottom {
  width: 100%;
  height: auto;
  margin-top: 325px !important;
}


}
</style>