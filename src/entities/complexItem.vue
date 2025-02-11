<template>
    <div class="complexItem">
    <div class="complexItem__image">
      <div v-if="isEmpty(complex.images)" class="no-image">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="130px" height="130px" viewBox="0 0 217.267 217.267" style="enable-background:new 0 0 217.267 217.267;" xml:space="preserve">
          <g>
            <path d="M163.627,138.057c1.94,0,3.505-1.564,3.505-3.505V83.749c0-1.937-1.564-3.504-3.505-3.504    c-1.937,0-3.504,1.567-3.504,3.504v50.803C160.123,136.493,161.69,138.057,163.627,138.057z" fill="#506979"></path>
            <path d="M108.633,0C48.73,0,0,48.732,0,108.633c0,29.931,12.167,57.071,31.816,76.738c0.014,0.014,0.017,0.034,0.031,0.048    s0.032,0.018,0.046,0.031c19.666,19.646,46.807,31.815,76.74,31.815c59.901,0,108.634-48.731,108.634-108.633S168.531,0,108.633,0    z M108.633,7.009c26.758,0,51.12,10.416,69.285,27.379l-26.936,26.938H52.564c-9.661,0-17.521,7.861-17.521,17.521v59.573    c0,9.661,7.861,17.521,17.521,17.521h3.805l-21.979,21.978C17.42,159.753,7.009,135.394,7.009,108.633    C7.009,52.599,52.595,7.009,108.633,7.009z M86.196,108.63c0-12.363,10.056-22.42,22.417-22.42c4.921,0,9.466,1.615,13.172,4.313    l-1.875,1.875c-3.207-2.24-7.094-3.564-11.297-3.564c-10.913,0-19.789,8.879-19.789,19.792c0,4.195,1.321,8.09,3.559,11.3    l-1.874,1.868C87.811,118.095,86.196,113.554,86.196,108.63z M131.034,108.63c0,12.364-10.054,22.418-22.418,22.418    c-4.915,0-9.449-1.608-13.145-4.298l1.874-1.876c3.203,2.231,7.082,3.546,11.274,3.546c10.91,0,19.794-8.877,19.794-19.791    c0-4.187-1.321-8.071-3.549-11.272l1.875-1.875C129.433,99.181,131.034,103.717,131.034,108.63z M95.833,108.63    c0-7.051,5.735-12.784,12.78-12.784c2.257,0,4.347,0.639,6.184,1.668l-17.304,17.306C96.469,112.972,95.833,110.885,95.833,108.63    z M121.397,108.63c0,7.049-5.735,12.782-12.781,12.782c-2.244,0-4.322-0.633-6.158-1.652l17.29-17.289    C120.769,104.31,121.397,106.383,121.397,108.63z M90.467,131.753c5.005,3.936,11.298,6.311,18.146,6.311    c16.229,0,29.431-13.206,29.431-29.431c0-6.848-2.375-13.141-6.311-18.149l22.148-22.146h10.814    c5.797,0,10.513,4.717,10.513,10.513v59.573c0,5.797-4.716,10.513-10.513,10.513H73.289L90.467,131.753z M126.784,85.523    c-5.007-3.948-11.311-6.326-18.168-6.326c-16.23,0-29.426,13.204-29.426,29.429c0,6.858,2.375,13.158,6.321,18.172l-22.136,22.135    H52.561c-5.797,0-10.513-4.716-10.513-10.514V78.847c0-5.795,4.716-10.513,10.513-10.513h91.413L126.784,85.523z M108.633,210.257    c-26.759,0-51.12-10.417-69.287-27.377l26.934-26.939h98.422c9.66,0,17.521-7.86,17.521-17.521V78.847    c0-9.661-7.861-17.521-17.521-17.521h-3.806l21.977-21.979c16.968,18.17,27.381,42.529,27.381,69.287    C210.258,164.667,164.667,210.257,108.633,210.257z" fill="#506979"></path>
            <path d="M53.002,54.317h23.654c1.937,0,3.504-1.567,3.504-3.504s-1.567-3.504-3.504-3.504H53.002    c-1.938,0-3.504,1.567-3.504,3.504S51.064,54.317,53.002,54.317z" fill="#506979"></path>
          </g>
        </svg>
      </div>
      
        <Galleria
          v-else
          :value="complex.images"
          :responsiveOptions="responsiveOptions"
          :showThumbnails="false"
          :showItemNavigators="complex.images.length > 1"
          :numVisible="5"
          :showItemNavigatorsOnHover="complex.images.length > 1"
          containerStyle="max-width: 640px">
            <template #item="slotProps">
                <img :src="slotProps.item.image" :alt="slotProps.item.name" style="width: 100%;" />
            </template>
        </Galleria>
    </div>    

    <RouterLink style="display: flex" :to="{path: complexLink, query: $route.query }">
    <div class="complexItem__content">
      <div class="complexItem__head">
        <div v-if="!route.meta.isViewPage"class="complexItem__nav">
          <div class="complexItem__develop" v-html="complex.builder.name"></div>
          <div class="complexItem__btnMenu">
            <Button style="background: transparent; border: none; padding: 0 !important" type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.591 17.341C9.71231 18.2196 8.28768 18.2196 7.409 17.341C6.53032 16.4623 6.53032 15.0377 7.409 14.159C8.28768 13.2803 9.71231 13.2803 10.591 14.159C11.4697 15.0377 11.4697 16.4623 10.591 17.341Z"
                  fill="#BDBDBD"
                />
                <path
                  d="M10.591 10.591C9.71231 11.4697 8.28768 11.4697 7.409 10.591C6.53032 9.71231 6.53032 8.28768 7.409 7.40901C8.28768 6.53033 9.71231 6.53033 10.591 7.40901C11.4697 8.28768 11.4697 9.71231 10.591 10.591Z"
                  fill="#BDBDBD"
                />
                <path
                  d="M10.591 3.84098C9.71231 4.71966 8.28768 4.71966 7.409 3.84098C6.53032 2.96231 6.53032 1.53768 7.409 0.659007C8.28768 -0.219669 9.71231 -0.219669 10.591 0.659007C11.4697 1.53768 11.4697 2.96231 10.591 3.84098Z"
                  fill="#BDBDBD"
                />
              </svg>
            </Button>
            <Menu :pt="{ root: { class: ['custom-p-menu'] } }" ref="menuItems" id="overlay_menu" :model="items" :popup="true" />
          </div>
          <!-- <div class="complexItem__btnMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M19.2678 8.23232C20.2441 9.20863 20.2441 10.7916 19.2678 11.7679C18.2915 12.7442 16.7085 12.7442 15.7322 11.7679C14.7559 10.7916 14.7559 9.20863 15.7322 8.23232C16.7085 7.25601 18.2915 7.25601 19.2678 8.23232Z"
                fill="#BDBDBD"
              />
              <path
                d="M11.7678 8.23232C12.7441 9.20863 12.7441 10.7916 11.7678 11.7679C10.7915 12.7442 9.20854 12.7442 8.23223 11.7679C7.25592 10.7916 7.25592 9.20863 8.23223 8.23232C9.20854 7.25601 10.7915 7.25601 11.7678 8.23232Z"
                fill="#BDBDBD"
              />
              <path
                d="M4.26776 8.23232C5.24406 9.20863 5.24406 10.7916 4.26776 11.7679C3.29145 12.7442 1.70854 12.7442 0.73223 11.7679C-0.244077 10.7916 -0.244077 9.20863 0.73223 8.23232C1.70854 7.25601 3.29145 7.25601 4.26776 8.23232Z"
                fill="#BDBDBD"
              />
            </svg>
          </div> -->
        </div>
        <div class="complexItem__title">{{ complex.name }}</div>
      </div>
      <div class="complexItem__location">
        <div class="complexItem__metroList">
          <template v-if="complex.metros">
            <div class="complexItem__metro" v-for="(metro, index) in complex.metros" :key="index">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.242 2.24765L9.99989 12.4689L6.75798 2.24765C2.90144 3.57322 0 7.16913 0 11.2916C0 13.7746 1.01298 16.0644 2.65178 17.752H7.35212L7.84488 15.6151C2.22957 13.4149 3.29134 6.59717 5.32701 5.48428C5.56864 5.55694 9.10942 17.7017 9.10942 17.7017C9.15779 17.7017 9.31493 17.7017 9.50692 17.7017C9.54747 17.7017 9.70018 17.7017 9.89048 17.7017C9.95934 17.7017 10.0337 17.7017 10.1091 17.7017C10.2384 17.7017 10.3725 17.7017 10.4924 17.7017C10.6846 17.7017 10.8416 17.7017 10.8902 17.7017C10.8902 17.7017 14.4311 5.55694 14.6726 5.48428C16.7085 6.59717 17.7698 13.4149 12.1545 15.6151L12.6475 17.752H17.3478C18.9868 16.0644 19.9998 13.7746 19.9998 11.2916C19.9998 7.16913 17.0983 3.57322 13.242 2.24765Z"
                  fill="#8EB3F5"
                />
              </svg>
              {{ metro.metro }}
              <div class="time">{{ metro.subway_time}} минут <span v-if="metro.subway_distance == 1">пешком</span><span v-else-if="metro.subway_distance == 2">на транспорте</span></div>
            </div>
          </template>
        </div>
        <div class="complexItem__address">
          {{ complex.address.address }}
        </div>
      </div>
      <div class="complexItem__change">
        
        <span v-for="(corpus) in complex.corpuses"
          :key="corpus.id">
          {{ corpus.line }} очередь. Корпус {{ corpus.corpus }} - {{ corpus.deadline}}
        </span>
      </div>
<!--      <div class="complexItem__advertisement" v-if="!route.meta.isViewPage">
        <RouterLink :to="baseLink" class="complexItem__advertisementLink">
          Реклама
        </RouterLink>
      </div>-->
      <div class="complexItem__counts">
        <RouterLink :to="{path: complexLink, query: $route.query }" class="complexItem__houseLink">
          Домов: <strong>{{ complex.houses_total }}</strong>
        </RouterLink>
        <RouterLink :to="apartmentsLink" class="complexItem__roomLink">
          Помещений: <strong>{{ complex.total_rooms}}</strong>
        </RouterLink>
      </div>
    </div>
  </RouterLink>
  <ConfirmPopup group="deleteHouse" :pt="confirmpopupStyle"></ConfirmPopup>
  </div>
</template>

<script setup>
import { confirmpopupStyle, isEmpty } from "@/shared/utils/util";
import { computed } from "vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import ModalLayout from "@/shared/UI/modalLayout.vue";
import Dialog from "primevue/dialog";

const visible = ref(true)
const confirm = useConfirm()
const props = defineProps({
  complex: {},
  onComplexEdit: Function,
  onComplexArchive: Function,
  onComplexDelete: Function,
})
const route = useRoute()

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
      emits('deleteItem')
    },
    reject: () => {
      return;
    },
  });
};

onMounted(() => {
  if (route.name != 'archive-main') {
    items.value = [
      {
        items: [
            {
                label: 'Перенести в архив',
                command: () => props.onComplexArchive()
            },

            {
                label: 'Редактировать',
                command: () => props.onComplexEdit()
            }
        ]
      }
    ]
  } else {
    items.value = [
      {
        items: [
            {
                label: 'Вернуть из архива',
                command: () => props.onComplexArchive()
            },

            {
                label: 'Удалить',
                command: () => props.onComplexDelete()
            }
        ]
      }
    ]
  }
})

const toggle = (event) => {
  event.stopPropagation()
  event.preventDefault();
  menuItems.value.toggle(event);
};

const baseLink = computed(() => {
  return route.name == 'complexes-list' ? '/view' : '/my-objects'
})
const complexLink = computed(() => {
  return `${baseLink.value}/${props.complex.id}`
})

const apartmentsLink = computed(() => {
  return {path: complexLink.value + '/apartments', query: route.query }
})

const responsiveOptions = [
  {
      breakpoint: '1600px',
      numVisible: 4
  },
  {
      breakpoint: '976px',
      numVisible: 3
  },
  {
      breakpoint: '200px',
      numVisible: 1
  }
];

const change = computed(() => {
  const queue = "1 очередь";
  const corps = "Корпус 1";
  const status = "Сдан";
  return `${queue}. ${corps} - ${status}`;
});



</script>

<style>
.p-button:focus {
  box-shadow: unset !important;
}
</style>

<style scoped lang="scss">
@import "@/app/styles/function.scss";


.complexItem {
  width: 100%;
  height: 353px;
  display: grid;
  grid-template-columns: vw(400, 1920) 1fr;
  @apply bg-white;
  overflow: hidden;

  .no-image{
    height: 353px;
  
    svg {
      top: 60px;
      left: 50%;
      margin-left: -65px;
      position: relative; 
    }
  }

  .complexItem__title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }


  &.medium {
    width: 100%;
    height: auto;
    grid-template-columns: 1fr;
    border-radius: 5px;
    overflow: hidden;

    .complexItem__content {
      grid-template-columns: 1fr;
      padding: 16px;
    }
    .complexItem__head {
      flex-direction: column;
      padding: 0;
      border-bottom: 1px solid;
      @apply border-grey;
      padding-bottom: 16px;
    }
    .complexItem__nav {
      width: 100%;
      margin-left: 0;
      margin-bottom: 20px;
    }
    .complexItem__btnMenu {
      margin-left: auto;
    }
    .complexItem__title {
      font-size: 18px;
    }
    .complexItem__location {
      width: 100%;
      padding: 16px 0;
    }
    .complexItem__change {
      grid-column: 1;
      grid-row: 3;
      border-left: 0;
      padding: 16px 0;
      max-height: 130px;
      overflow: auto;
    }
    .complexItem__advertisement {
      grid-row: 4;
      grid-column: 1;
      padding: 16px 0;
    }
    .complexItem__counts {
      grid-row: 5;
      grid-column: 1;
      padding: 16px 0 0 0;

      strong {
        text-decoration: underline;
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      height: 343px;
    }
  }
  .no-image{
    height: 343px;
  
    svg {
      top: 60px;
      left: 50%;
      margin-left: -65px;
      position: relative; 
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
  }
  &__head {
    width: 100%;
    height: auto;
    grid-row: 1;
    grid-column: span 2;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 30px;
    border-bottom: 1px solid;
    @apply border-grey;
  }

  &__title {
    width: max-content;
    position: relative;
    font-size: 27px;
    line-height: 100%;

    &::before {
      width: 100%;
      height: 1px;
      @apply bg-black;
      content: "";
      position: absolute;
      left: 0;
      bottom: -2px;
      right: 0;
    }
  }

  &__nav {
    width: auto;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    margin-left: auto;
  }

  &__develop {
    @apply text-grey-900;
    font-size: 15px;
    line-height: 100%;
    margin-right: 30px;
  }

  &__btnMenu {
    width: max-content;
    height: max-content;
    svg {
      width: 18px;
      height: 18px;
    }
  }

  &__location {
    grid-row: 2;
    grid-column: 1;
    width: 100%;
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-bottom: 1px solid;
    @apply border-grey;
  }
  &__metro {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 10px;
    .time {
      @apply text-grey-900;
      font-size: 14px;
    }
  }
  &__change {
    width: 100%;
    grid-row: 2;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-left: 1px solid;
    border-bottom: 1px solid;
    @apply border-grey;
    padding: 20px 30px;
    font-size: 15px;
    max-height: 130px;
    overflow: auto;
  }
  &__advertisement {
    width: 100%;
    grid-row: 3;
    grid-column: 1;
    padding: 18px 30px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  &__advertisementLink {
    border-radius: 3px;
    border: 1px solid;
    @apply border-green;
    background: var(
      --linear,
      linear-gradient(180deg, #fefefe 0%, #f6f6f6 100%)
    );
    padding: 8px 12px;
    @apply text-green;
    @apply transition-colors;
    &:hover {
      background: transparent;
      @apply bg-green;
      @apply text-white;
      @apply transition-colors;
    }
  }
  &__counts {
    grid-row: 3;
    grid-column: 2;
    padding: 18px 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 10px;
    border-left: 1px solid;
    @apply border-grey;

    a {
      padding: 8px 20px;
      border-radius: 3px;
      border: 1px solid #dedede;
      background: var(
        --linear,
        linear-gradient(180deg, #fefefe 0%, #f6f6f6 100%)
      );
    }
  }

  &__metroList {
    max-height: 50px;
    overflow: auto;
    width: 100%;
  }

  
  @media screen and (max-width: 2000px) {
    width: 100%;
    height: 300px;
    display: grid;
    grid-template-columns: vw(300, 1440) 1fr;
    @apply bg-white;
    
    &__image {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        height: 300px;
      }
    }
    .no-image{
      height: 300px;
    
      svg {
        top: 60px;
        left: 50%;
        margin-left: -65px;
        position: relative; 
      }
    }
  }

  @media screen and (max-width: 1900px) {
    width: 100%;
    height: 270px;
    display: grid;
    grid-template-columns: vw(300, 1440) 1fr;
    @apply bg-white;
    &__image {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        height: 270px;
      }
    }
    .no-image{
      height: 270px;
    
      svg {
        top: 60px;
        left: 50%;
        margin-left: -65px;
        position: relative; 
      }
    }
  }

  .complexItem__btnMenu {
    box-shadow: unset !important;
    svg {
      width: 18px !important;
    }
  }

  @media screen and (max-width: 1600px) {
    width: 100%;
    height: 250px;
    display: grid;
    grid-template-columns: vw(300, 1440) 1fr;
    @apply bg-white;

    &.medium {
      width: 100%;
      height: auto;
      grid-template-columns: 1fr;
      border-radius: 5px;
      overflow: hidden;

      .complexItem__content {
        grid-template-columns: 1fr;
        padding: 16px;
      }
      /*.complexItem__image {
        height: 280px;
      }*/
      .complexItem__head {
        flex-direction: column;
        padding: 0;
        border-bottom: 1px solid;
        @apply border-grey;
        padding-bottom: 16px;
      }
      .complexItem__nav {
        width: 100%;
        margin-left: 0;
        margin-bottom: 20px;
      }
      .complexItem__btnMenu {
        margin-left: auto;
      }
      .complexItem__title {
        font-size: 18px;
      }
      .complexItem__location {
        width: 100%;
        padding: 16px 0;
      }
      .complexItem__change {
        border-left: 0;
        padding: 16px 0;
        max-height: 130px;
        overflow: auto;
      }
      .complexItem__advertisement {
        padding: 16px 0;
      }
      .complexItem__counts {
        padding: 16px 0 0 0;
      }
    }
    &__image {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        height: 250px;
      }
    }
    .no-image{
      height: 250px;
    
      svg {
        top: 60px;
        left: 50%;
        margin-left: -65px;
        position: relative; 
      }
    }

    &__content {
      display: grid;
      grid-template-columns: 1fr 0.8fr;
    }
    &__head {
      padding: 26px;
      border-bottom: 1px solid;
      @apply border-grey;
    }

    &__title {
      font-size: 24px;
    }

    &__nav {
      margin-bottom: 0px;
    }

    &__develop {
      font-size: 14px;
    }

    &__location {
      padding: 16px 25px;
    }
    &__metro {
      column-gap: 8px;
      margin-bottom: 0;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: flex-start;
    }
    &__change {
      padding: 16px 25px;
      font-size: 14px;
    }
    &__advertisement {
      padding: 16px 25px;
    }
    &__advertisementLink {
      padding: 6px 10px;
      font-size: 14px;
    }
    &__counts {
      column-gap: 8px;

      a {
        padding: 8px 18px;
        font-size: 15px;
      }
    }
  }
}

.complexItem__content {
  width: 100%;
}
</style>
