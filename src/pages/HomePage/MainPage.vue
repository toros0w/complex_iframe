<template>
  <FormAddHome
    :isOpen="isOpenEditForm"
    ref="formEditHome"
    :complex="complex"
    :house="house"
    @close-model="isOpenEditForm = !isOpenEditForm"
    @add_house="edit_house"
  />
  <div class="mainPage p-7.5 w-full">
    <div class="mainPage__title mb-7.5">{{ house.name }}</div>
    <HomeNav v-if="house" :house="house" class="mb-7.5" />
    <RouterLink
      v-if="house.rooms_count"
      :to="$route.path + '/view'"
      class="mainPage__viewChess mb-7.5 bg-green flex flex-row items-center px-5 py-3 gap-x-1.5 text-white rounded"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.25 0.6875H1.25C1.10142 0.689442 0.959472 0.749329 0.8544 0.8544C0.749329 0.959472 0.689442 1.10142 0.6875 1.25V4.25C0.689442 4.39858 0.749329 4.54053 0.8544 4.6456C0.959472 4.75067 1.10142 4.81056 1.25 4.8125H4.25C4.39858 4.81056 4.54053 4.75067 4.6456 4.6456C4.75067 4.54053 4.81056 4.39858 4.8125 4.25V1.25C4.81056 1.10142 4.75067 0.959472 4.6456 0.8544C4.54053 0.749329 4.39858 0.689442 4.25 0.6875ZM3.6875 3.6875H1.8125V1.8125H3.6875V3.6875ZM14.75 0.6875H11.75C11.6014 0.689442 11.4595 0.749329 11.3544 0.8544C11.2493 0.959472 11.1894 1.10142 11.1875 1.25V4.25C11.1894 4.39858 11.2493 4.54053 11.3544 4.6456C11.4595 4.75067 11.6014 4.81056 11.75 4.8125H14.75C14.8986 4.81056 15.0405 4.75067 15.1456 4.6456C15.2507 4.54053 15.3106 4.39858 15.3125 4.25V1.25C15.3106 1.10142 15.2507 0.959472 15.1456 0.8544C15.0405 0.749329 14.8986 0.689442 14.75 0.6875ZM14.1875 3.6875H12.3125V1.8125H14.1875V3.6875ZM9.5 0.6875H6.5C6.35142 0.689442 6.20947 0.749329 6.1044 0.8544C5.99933 0.959472 5.93944 1.10142 5.9375 1.25V4.25C5.93944 4.39858 5.99933 4.54053 6.1044 4.6456C6.20947 4.75067 6.35142 4.81056 6.5 4.8125H9.5C9.64858 4.81056 9.79053 4.75067 9.8956 4.6456C10.0007 4.54053 10.0606 4.39858 10.0625 4.25V1.25C10.0606 1.10142 10.0007 0.959472 9.8956 0.8544C9.79053 0.749329 9.64858 0.689442 9.5 0.6875ZM8.9375 3.6875H7.0625V1.8125H8.9375V3.6875ZM4.25 5.9375H1.25C1.10142 5.93944 0.959472 5.99933 0.8544 6.1044C0.749329 6.20947 0.689442 6.35142 0.6875 6.5V9.5C0.689442 9.64858 0.749329 9.79053 0.8544 9.8956C0.959472 10.0007 1.10142 10.0606 1.25 10.0625H4.25C4.39858 10.0606 4.54053 10.0007 4.6456 9.8956C4.75067 9.79053 4.81056 9.64858 4.8125 9.5V6.5C4.81056 6.35142 4.75067 6.20947 4.6456 6.1044C4.54053 5.99933 4.39858 5.93944 4.25 5.9375ZM3.6875 8.9375H1.8125V7.0625H3.6875V8.9375ZM9.5 5.9375H6.5C6.35142 5.93944 6.20947 5.99933 6.1044 6.1044C5.99933 6.20947 5.93944 6.35142 5.9375 6.5V9.5C5.93944 9.64858 5.99933 9.79053 6.1044 9.8956C6.20947 10.0007 6.35142 10.0606 6.5 10.0625H9.5C9.64858 10.0606 9.79053 10.0007 9.8956 9.8956C10.0007 9.79053 10.0606 9.64858 10.0625 9.5V6.5C10.0606 6.35142 10.0007 6.20947 9.8956 6.1044C9.79053 5.99933 9.64858 5.93944 9.5 5.9375ZM8.9375 8.9375H7.0625V7.0625H8.9375V8.9375ZM14.75 5.9375H11.75C11.6014 5.93944 11.4595 5.99933 11.3544 6.1044C11.2493 6.20947 11.1894 6.35142 11.1875 6.5V9.5C11.1894 9.64858 11.2493 9.79053 11.3544 9.8956C11.4595 10.0007 11.6014 10.0606 11.75 10.0625H14.75C14.8986 10.0606 15.0405 10.0007 15.1456 9.8956C15.2507 9.79053 15.3106 9.64858 15.3125 9.5V6.5C15.3106 6.35142 15.2507 6.20947 15.1456 6.1044C15.0405 5.99933 14.8986 5.93944 14.75 5.9375ZM14.1875 8.9375H12.3125V7.0625H14.1875V8.9375ZM9.5 11.1875H6.5C6.35142 11.1894 6.20947 11.2493 6.1044 11.3544C5.99933 11.4595 5.93944 11.6014 5.9375 11.75V14.75C5.93944 14.8986 5.99933 15.0405 6.1044 15.1456C6.20947 15.2507 6.35142 15.3106 6.5 15.3125H9.5C9.64858 15.3106 9.79053 15.2507 9.8956 15.1456C10.0007 15.0405 10.0606 14.8986 10.0625 14.75V11.75C10.0606 11.6014 10.0007 11.4595 9.8956 11.3544C9.79053 11.2493 9.64858 11.1894 9.5 11.1875ZM8.9375 14.1875H7.0625V12.3125H8.9375V14.1875Z"
          fill="white"
        />
      </svg>
      Посмотреть объект
    </RouterLink>
    <div
      class="mainPage__information w-full border border-grey-400 px-7.5 py-5"
    >
      <div class="information__head border-b border-grey-400 pb-7.5 mb-7.5">
        <div class="information__title">Информация о доме</div>
        <MyButton
          @click.stop="() => {
            isOpenEditForm = true
            formEditHome.open();
          }"
          :disabled="!house.id"
          :theme="'grey-icon'"
          class="information__btnEdit text-sm text-grey-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.75 8C14.5511 8 14.3603 8.07902 14.2197 8.21967C14.079 8.36032 14 8.55109 14 8.75V13.25C14 13.4489 13.921 13.6397 13.7803 13.7803C13.6397 13.921 13.4489 14 13.25 14H2.75C2.55109 14 2.36032 13.921 2.21967 13.7803C2.07902 13.6397 2 13.4489 2 13.25V2.75C2 2.55109 2.07902 2.36032 2.21967 2.21967C2.36032 2.07902 2.55109 2 2.75 2H7.25C7.44891 2 7.63968 1.92098 7.78033 1.78033C7.92098 1.63968 8 1.44891 8 1.25C8 1.05109 7.92098 0.860322 7.78033 0.71967C7.63968 0.579018 7.44891 0.5 7.25 0.5H2.75C2.15326 0.5 1.58097 0.737053 1.15901 1.15901C0.737053 1.58097 0.5 2.15326 0.5 2.75V13.25C0.5 13.8467 0.737053 14.419 1.15901 14.841C1.58097 15.2629 2.15326 15.5 2.75 15.5H13.25C13.8467 15.5 14.419 15.2629 14.841 14.841C15.2629 14.419 15.5 13.8467 15.5 13.25V8.75C15.5 8.55109 15.421 8.36032 15.2803 8.21967C15.1397 8.07902 14.9489 8 14.75 8ZM3.5 8.57V11.75C3.5 11.9489 3.57902 12.1397 3.71967 12.2803C3.86032 12.421 4.05109 12.5 4.25 12.5H7.43C7.5287 12.5006 7.62655 12.4817 7.71793 12.4443C7.80931 12.407 7.89242 12.352 7.9625 12.2825L13.1525 7.085L15.2825 5C15.3528 4.93028 15.4086 4.84733 15.4467 4.75593C15.4847 4.66454 15.5043 4.56651 15.5043 4.4675C15.5043 4.36849 15.4847 4.27046 15.4467 4.17907C15.4086 4.08767 15.3528 4.00472 15.2825 3.935L12.1025 0.7175C12.0328 0.647204 11.9498 0.591408 11.8584 0.553331C11.767 0.515255 11.669 0.495651 11.57 0.495651C11.471 0.495651 11.373 0.515255 11.2816 0.553331C11.1902 0.591408 11.1072 0.647204 11.0375 0.7175L8.9225 2.84L3.7175 8.0375C3.64799 8.10758 3.59299 8.19069 3.55567 8.28207C3.51835 8.37345 3.49943 8.4713 3.5 8.57ZM11.57 2.3075L13.6925 4.43L12.6275 5.495L10.505 3.3725L11.57 2.3075ZM5 8.8775L9.4475 4.43L11.57 6.5525L7.1225 11H5V8.8775Z"
              fill="#666666"
            />
          </svg>
          Редактировать
        </MyButton>
      </div>
      <div class="information__content">
        <div class="information__image flex flex-col items-center">
          <Galleria
            v-if="galleryImages.length"
            :activeIndex="activeImageIndex"
            @update:activeIndex="(index) => activeImageIndex = index"
            :value="galleryImages"
            :showThumbnails="false"
            :showItemNavigators="galleryImages.length > 1"
            :numVisible="galleryImages.length + 1"
            :showItemNavigatorsOnHover="galleryImages.length > 1"
            containerStyle="width: 100%"
          >
              <template #item="slotProps">
                  <img :src="slotProps.item.url" :alt="slotProps.item.name" style="width: 100%;" />
              </template>
          </Galleria>
          <div class="img__btns flex flex-row mt-5 gap-x-2">
            <input @change="onImagesAdded" multiple accept="image/*" type="file" class="hidden" ref="imagesInput" />
            <MyButton @click.stop="onAddImagesClick" :theme="'green'" class="text-sm">
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                  fill="white"
                />
              </svg>

              Добавить изображение
            </MyButton>
            <MyButton @click.stop="deleteImage" :theme="'grey-icon'">
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 13.5C8.19891 13.5 8.38968 13.421 8.53033 13.2803C8.67098 13.1397 8.75 12.9489 8.75 12.75V8.25C8.75 8.05109 8.67098 7.86032 8.53033 7.71967C8.38968 7.57902 8.19891 7.5 8 7.5C7.80109 7.5 7.61032 7.57902 7.46967 7.71967C7.32902 7.86032 7.25 8.05109 7.25 8.25V12.75C7.25 12.9489 7.32902 13.1397 7.46967 13.2803C7.61032 13.421 7.80109 13.5 8 13.5ZM15.5 4.5H12.5V3.75C12.5 3.15326 12.2629 2.58097 11.841 2.15901C11.419 1.73705 10.8467 1.5 10.25 1.5H8.75C8.15326 1.5 7.58097 1.73705 7.15901 2.15901C6.73705 2.58097 6.5 3.15326 6.5 3.75V4.5H3.5C3.30109 4.5 3.11032 4.57902 2.96967 4.71967C2.82902 4.86032 2.75 5.05109 2.75 5.25C2.75 5.44891 2.82902 5.63968 2.96967 5.78033C3.11032 5.92098 3.30109 6 3.5 6H4.25V14.25C4.25 14.8467 4.48705 15.419 4.90901 15.841C5.33097 16.2629 5.90326 16.5 6.5 16.5H12.5C13.0967 16.5 13.669 16.2629 14.091 15.841C14.5129 15.419 14.75 14.8467 14.75 14.25V6H15.5C15.6989 6 15.8897 5.92098 16.0303 5.78033C16.171 5.63968 16.25 5.44891 16.25 5.25C16.25 5.05109 16.171 4.86032 16.0303 4.71967C15.8897 4.57902 15.6989 4.5 15.5 4.5ZM8 3.75C8 3.55109 8.07902 3.36032 8.21967 3.21967C8.36032 3.07902 8.55109 3 8.75 3H10.25C10.4489 3 10.6397 3.07902 10.7803 3.21967C10.921 3.36032 11 3.55109 11 3.75V4.5H8V3.75ZM13.25 14.25C13.25 14.4489 13.171 14.6397 13.0303 14.7803C12.8897 14.921 12.6989 15 12.5 15H6.5C6.30109 15 6.11032 14.921 5.96967 14.7803C5.82902 14.6397 5.75 14.4489 5.75 14.25V6H13.25V14.25ZM11 13.5C11.1989 13.5 11.3897 13.421 11.5303 13.2803C11.671 13.1397 11.75 12.9489 11.75 12.75V8.25C11.75 8.05109 11.671 7.86032 11.5303 7.71967C11.3897 7.57902 11.1989 7.5 11 7.5C10.8011 7.5 10.6103 7.57902 10.4697 7.71967C10.329 7.86032 10.25 8.05109 10.25 8.25V12.75C10.25 12.9489 10.329 13.1397 10.4697 13.2803C10.6103 13.421 10.8011 13.5 11 13.5Z"
                  fill="#666666"
                />
              </svg>
            </MyButton>
          </div>
        </div>
        <div class="information__textBlock flex flex-col">
          <div class="textBlock__item">
            <div class="item__label">Тип комплекса:</div>
            <div class="item__text">Жилой комплекс в новостройке</div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Адрес:</div>
            <div class="item__text">{{ house.address }}</div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Тип строения:</div>
            <div class="item__text">{{ house.type_building_text }}</div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Тип помещений по умолчанию:</div>
            <div class="item__text">{{ house.placement_type_text }}</div>
          </div>
          
          <!-- <div class="textBlock__item">
            <div class="item__label">Метро:</div>
            <div v-if="complex.metros">
              <div style="display: flex; gap: 5px" v-for="metro in complex.metros">
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
                <div class="time">{{ metro.subway_time}} минут <span v-if="metro.subway_type == 1">пешком</span><span v-else-if="metro.subway_type == 2">на транспорте</span></div>
              </div>
            </div>
          </div> -->
          <div class="textBlock__item">
            <div class="item__label">Название ЖК:</div>
            <div class="item__text">{{ complex.name }}</div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Описание:</div>
            <div class="item__text">
              {{ complex.dop.text_desc }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Стадия строительства:</div>
            <span v-if="isEmpty(house.status_corpus_text)" class="text-grey-400">Неуказано</span>
            <div class="item__text">
              {{ house.status_corpus_text }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Срок сдачи:</div>
            <span v-if="isEmpty(house.deadline)" class="text-grey-400">Неуказано</span>
            <div v-else class="item__text">{{ house.deadline }}</div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Сроки строительства:</div>
            <span v-if="isEmpty(house.development)" class="text-grey-400">Неуказано</span>
            <div v-else class="item__text">{{ house.development }}</div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Кадастровый номер:</div>
            <span v-if="isEmpty(house.cadastral_number)" class="text-grey-400">Неуказано</span>
            <div v-else class="item__text">
              {{ house.cadastral_number }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Охрана:</div>
            <div class="item__text">
              {{ house.security == 1 ? 'Да' : 'Нет' }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Огороженная территория:</div>
            <div class="item__text">
              {{ house.fenced_area == 1 ? 'Да' : 'Нет' }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Спортивная площадка:</div>
            <div class="item__text">
              {{ house.sports_ground == 1 ? 'Да' : 'Нет' }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Детская площадка:</div>
            <div class="item__text">
              {{ house.play_ground == 1 ? 'Да' : 'Нет' }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Школа:</div>
            <div class="item__text">
              {{ house.school == 1 ? 'Да' : 'Нет' }}
            </div>
          </div>
          <div class="textBlock__item">
            <div class="item__label">Детский сад:</div>
            <div class="item__text">
              {{ house.kinder_garten == 1 ? 'Да' : 'Нет' }}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/shared/UI/MyButton.vue";
import HomeNav from "@/widgets/homePage/homeNav.vue";
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from 'vue-router';
import { isEmpty } from "@/shared/utils/util";
import FormAddHome from "@/widgets/forms/formAddHome.vue";
import api from "@/shared/api";
import { useHouseStore } from "@/app/store/house";

// Route
const route = useRoute();

const imagesInput = ref(null)
const formEditHome = ref(null);
const isOpenEditForm = ref(false)

const houseStore = useHouseStore()
const activeImageIndex = ref(0)
const activeImage = ref(null)
const galleryImages = ref([])

const complex = computed(() => houseStore.complex)
const house = computed(() => houseStore.house)

const edit_house = () => {
  houseStore.get_house(house_id).then(() => {
    isOpenEditForm.value = !isOpenEditForm.value;
  });
}

const house_id = route.params.house_id;

watch(activeImageIndex, (index) => activeImage.value = galleryImages.value[index])

watch(() => house.value.images, (updatedImages) => {
  if (!updatedImages) return

  if (!activeImage.value) activeImage.value = updatedImages[0]
  galleryImages.value = updatedImages
}, { deep: true, immediate: true })


const onAddImagesClick = () => imagesInput.value.click()

const uploadImage = (file) => {
  var bodyFormData = new FormData();
  bodyFormData.append("house_id", house_id);
  bodyFormData.append("photos[]", file);
  api.addPhotoToHouse(bodyFormData)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        if (!house.value.images) house.value.images = []

        house.value.images.push(...response.data)
      }
    });
};

const onImagesAdded = (e) => {
  Array.from(e.target.files).forEach((file) => {
    uploadImage(file);
  });
}

const deleteImage = () => {
  return api.deleteHousePhoto(activeImage.value.id)
    .then((response) => {
      if (response.data) {
        house.value.images.splice(activeImageIndex.value, 1)
        activeImageIndex.value = activeImageIndex.value ? activeImageIndex.value - 1 : 0;
        activeImage.value = galleryImages[activeImageIndex.value]
      }
    });
}

onMounted(() => {
  houseStore.get_house(house_id);
})

</script>

<style scoped lang="scss">
.mainPage {
  &__title {
    font-size: 32px;
  }
  &__viewChess {
    width: max-content;
  }
  &__information {
    max-width: 1390px;

    .information__head {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .information__image {
      justify-content: center
    }

    .information__title {
      @apply text-grey-900;
    }

    .information__content {
      display: grid;
      grid-template-columns: 432px 1fr;
      grid-column-gap: 30px;
    }

    .information__textBlock {
      row-gap: 30px;
      .textBlock__item {
        width: 100%;
        height: auto;
        display: grid;
        grid-template-columns: 150px 1fr;
        grid-column-gap: 30px;

        .item__label,
        .item__text {
          font-size: 15px;
        }
        .item__text span {
          color: #bdbdbd;
        }
      }
    }
  }

  @media screen and (max-width: 1600px) {
    &__information {
      .information__textBlock {
        row-gap: 20px;
      }
    }
  }
}
</style>

<style>
.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav {
  color: #d19090;
}


</style>
