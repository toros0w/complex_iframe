<template>
  <div class="item">
    <div class="home-img">
      <div v-if="!home.images || home.images.length === 0" class="no-image">
        <svg
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
      
      <Galleria
        class="home-galleria"
        v-else
        :value="home.images"
        :responsiveOptions="responsiveOptions"
        :showThumbnails="false"
        :showItemNavigators="home.images.length > 1"
        :numVisible="5"
        :showItemNavigatorsOnHover="home.images.length > 1"
        containerStyle="max-width: 640px"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.url"
            :alt="slotProps.item.name"
            style="width: 100%; height: 300px; max-width: 300px; object-fit: cover;"
          />
        </template>
      </Galleria>
    </div>
    <div class="home-info">
      <div class="home-title">{{ home.name }}</div>
      <div class="line"></div>
      <div class="home-address-info">
        <template v-if="metros">

          <div class="metro-wrapper" v-for="(metro, index) in metros" :key="index">
            <img
              src="@/shared/assets/icons/metro.svg"
              alt=""
              class="metro-icon"
            />
            <span class="metro-title">{{ metro.metro }}</span>
            <div class="metro-distance">{{ metro.subway_time}} минут <span v-if="metro.subway_distance == 1">пешком</span><span v-else-if="metro.subway_distance == 2">на транспорте</span></div>
          </div>
        </template>
        <div v-if="!isHome" class="home-address">{{ home.address }}</div>
        <div v-else class="home-address">{{ home.address }}</div>
      </div>
      <div class="line"></div>
      <div class="home-price-and-count-info">
        <div class="home-price">
          Стоимость: <span>от {{ formatTotalPrice(props.home.min_total_amount) }} руб</span>
        </div>
        <div class="count-info">
          Найдено в доме: &nbsp;
          <div class="homeItem__roomLink">

            {{ home.total_rooms}} квартир
          </div>
          <!-- <RouterLink :to="apartmentsLink" class="homeItem__roomLink">  -->
          <!-- </RouterLink> -->
        </div>
        <div class="line"></div>
        <RouterLink :to="apartmentsLink" class="complexItem__roomLink">
  
          <div class="primary-btn_all">Посмотреть все квартиры</div>
        </RouterLink>
        <RouterLink :to="apartmentsLink" class="complexItem__roomLink">
  
          <div class="primary-btn_all mob">Открыть каталог</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { confirmpopupStyle, isEmpty } from "@/shared/utils/util";
import { computed } from "vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Button from "primevue/button";
import Menu from "primevue/menu";
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import ModalLayout from "@/shared/UI/modalLayout.vue";
import Dialog from "primevue/dialog";

const visible = ref(true);
const confirm = useConfirm();
const props = defineProps({
  home: {},
  onComplexEdit: Function,
  onComplexArchive: Function,
  onComplexDelete: Function,
  minPrice: {
    type: String,
    required: false
  },
  metros: {
    type: Array,
    required: false,
  },
  complexId: {
    type: Number,
    default: null
  }
});
const route = useRoute();

const totalMinPrice = props.home.min_total_amount ? props.home.min_total_amount : props.minPrice;

const menuItems = ref();
const items = ref();

const showDeleteTemplate = (event, index) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteComplex",
    message: "Удалить Комплекс?",
    acceptLabel: "Да",
    rejectLabel: "Нет",
    acceptClass: "!bg-green !shadow-none",
    rejectClass: "!bg-red !shadow-none",
    accept: () => {
      // emits('deleteItem')
    },
    reject: () => {
      return;
    },
  });
};
const formatTotalPrice = (value) => {
  if (!value) return '0';
  return Number(value).toLocaleString('ru-RU');
};

// console.log(props.home?.rooms, 'props.home?.rooms');


const showArchiveTemplate = (event, index) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteComplex",
    message: "Перенести Комплекс в архив?",
    acceptLabel: "Да",
    rejectLabel: "Нет",
    acceptClass: "!bg-green !shadow-none",
    rejectClass: "!bg-red !shadow-none",
    accept: () => {
      emits("deleteItem");
    },
    reject: () => {
      return;
    },
  });
};

onMounted(() => {
  if (route.name != "archive-main") {
    items.value = [
      {
        items: [
          {
            label: "Перенести в архив",
            command: () => props.onComplexArchive(),
          },

          {
            label: "Редактировать",
            command: () => props.onComplexEdit(),
          },
        ],
      },
    ];
  } else {
    items.value = [
      {
        items: [
          {
            label: "Вернуть из архива",
            command: () => props.onComplexArchive(),
          },

          {
            label: "Удалить",
            command: () => props.onComplexDelete(),
          },
        ],
      },
    ];
  }
});

const toggle = (event) => {
  event.stopPropagation();
  event.preventDefault();
  menuItems.value.toggle(event);
};

const complexLink = computed(() => {
  return `/${route.params.token}/view/${props.complexId}/home/${props.home.id}`;
});

const apartmentsLink = computed(() => {
  return { path: complexLink.value, query: route.query };
});

const responsiveOptions = [
  {
    breakpoint: "1600px",
    numVisible: 4,
  },
  {
    breakpoint: "976px",
    numVisible: 3,
  },
  {
    breakpoint: "200px",
    numVisible: 1,
  },
];

const change = computed(() => {
  const queue = "1 очередь";
  const corps = "Корпус 1";
  const status = "Сдан";
  return `${queue}. ${corps} - ${status}`;
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  gap: 40px;
  max-width: 100%;
  position: relative;
  /* align-items: center!important; */


  & .line {
    border-top: 1px solid #f3f3f3;
    /* margin: 20px 0 20px 0; */
    /* padding-bottom: 20px; */
    width: 400px;
  }
  & .home-info > * {
    flex-grow: 1;
  }
  & .home-info {
    display: flex;
    flex-direction: column;
    /* gap: 20px; */
    min-width: 100px;
    /* max-height: 300px; */


    & .home-title {
      font-size: 27px;
      font-weight: bold;
      line-height: 1;
    }
    & .home-address-info {
      display: flex;
      flex-direction: column;
      /* gap: 20px; */

      & .metro-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;

        & .metro-title {
          font-size: 14px;
          font-weight: normal;
          color: #222222;
        }
        & .metro-distance {
          color: #757575;
          font-size: 14px;
        }
      }
      & .home-address {
        margin-top: 20px;
        font-size: 15px;
        color: #333333;
      }
    }
    & .home-price-and-count-info {
      font-size: 15px;
      font-weight: bold;
      color: #333333;
      display: flex;
      flex-direction: column;
      gap: 20px;
      & span {
        color: var(--main-color);
        font-weight: normal;
      }
      & .count-info {
        display: flex;
        & .homeItem__roomLink {
          text-decoration: underline;
          color: var(--main-color);
          font-weight: normal;
        }
      }
    }
  }
  & .home-img {
    /* width: 300px;
    height: 300px;
    overflow: hidden; */
    width: 100%; 
    max-width: 300px; 
    height: 300px; 
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    & .home-galleria {
      width: 100%;
      height: 100%;
      & .img {
      object-fit: contain; 

      width: 100%;
      height: 100%;
      }
   }
    & .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
  }
  & .primary-btn_all {
    background-color: var(--main-color);
    width: 207px;
    height: 37px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    bottom: 0;
  }
  & .primary-btn_all.mob {
    display: none;
  }
}
@media (max-width: 1024px) {
  .item {
    max-width: 80vw;
  }
}
@media (max-width: 768px) {
  .item {
    width: 100vw;
    & .primary-btn_all {
      display: none;
    }
    & .primary-btn_all.mob {
      display: flex;
      padding: 0 20px;
    }
  }
}
@media (max-width: 758px) {
  .item {
    flex-direction: column;
  }
}
.galleria-item img {
}

.primary-btn_all.mob {
  display: inline-block;
  width: auto;
}
</style>