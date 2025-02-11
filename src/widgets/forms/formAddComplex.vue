<template>
  <FormLayout
    class="addComplex"
    :title="titleForm"
    @closeModel="$emit('closeModel')"
    :class="isOpen ? 'open' : ''"
  >
    <template v-slot:default>
      <form class="form addComplex__form" v-if="complex.dop">
        <div class="form__item">
          <label for="nameHome">Тип комплекса <span>*</span></label>
          <Dropdown
            v-model="complex.type"
            :options="fieldsStore.complexes_types"
            optionLabel="name"
            optionValue="code"
          >
            <template #dropdownicon>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                  fill="#9E9E9E"
                />
              </svg>
            </template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="id_dmclck">ID комплекса в базе Домклик</label>
          <InputText
            :value="complex.domclick_id || ''"
            v-model="complex.domclick_id"
            id="id_dmclck"
            placeholder="Введите ID"
          />
        </div>
        <div class="form__item">
          <label for="id_zastroyshik_dmclck"
            >ID застройщика в базе Домклик</label
          >
          <InputText
            :value="complex.domclick_builder_id || ''"
            v-model="complex.domclick_builder_id"
            id="id_zastroyshik_dmclck"
            placeholder="Введите ID"
          />
        </div>
        <div class="form__item">
          <label for="cian_id">ID ЖК на ЦИАН</label>
          <InputText
            :value="complex.cian_id || ''"
            v-model="complex.cian_id"
            id="Ccian_id"
            placeholder="Введите ID"
          />
        </div>
        <div class="form__item">
          <label for="avito_id">ID ЖК на Авито</label>
          <InputText
            :value="complex.avito_id || ''"
            v-model="complex.avito_id"
            id="avito_id"
            placeholder="Введите ID"
          />
        </div>
        <div class="form__item">
          <label for="yandex_id">ID ЖК на Я.Недвижимость</label>
          <InputText
            :value="complex.yandex_id || ''"
            v-model="complex.yandex_id"
            id="yandex_id"
            placeholder="Введите ID"
          />
        </div>
        <div class="form__item">
          <label for="nameHome">Страна</label>
          <Dropdown
            @change="changeCountry"
            filter
            v-model="complex.country_id"
            :options="fieldsStore.countries"
            optionLabel="name"
            optionValue="code"
          >
            <template #dropdownicon>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                  fill="#9E9E9E"
                />
              </svg>
            </template>
            <template #emptyfilter>Нет данных</template>
            <template #empty>Нет данных</template>
          </Dropdown>
        </div>

        <div v-if="complex.country_id == 171" class="form__item">
          <label for="nameHome">Название субъекта РФ (регион)</label>
          <Dropdown
            @change="changeRegion"
            filter
            :options="fieldsStore.regionsInfo.regions"
            optionLabel="name"
            optionValue="code"
            v-model="fieldsStore.currentRegionInfo.region_id"
          >
            <template #dropdownicon>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                  fill="#9E9E9E"
                />
              </svg>
            </template>
            <template #emptyfilter>Нет данных</template>
            <template #empty>Нет данных</template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="address">Адрес</label>
          <div
            ref="addressCoordinates"
            style="display: flex; flex-direction: column"
          >
            <AutoComplete
              :pt="{ pcInput: { class: ['!w-100'] } }"
              v-model="selectedAddress"
              optionLabel="name"
              optionValue="id"
              :suggestions="filteredAdresses"
              @complete="searchSuggestions"
              emptySearchMessage="Совпадений не найдено"
            />
            <p
              style="color: red; font-size: 12px; padding: 6px 0px"
              v-if="!coordinatesSetted"
            >
              Необходимо уточнить координаты объекта на карте
            </p>
            <span
              @click="showEditAddress = !showEditAddress"
              class="edit_address-actions"
              >{{
                showEditAddress ? "Скрыть форму" : "Редактировать адрес"
              }}</span
            >
            <div
              :style="
                showEditAddress
                  ? 'max-height: 436px'
                  : 'max-height: 0px; overflow: hidden; margin: 0'
              "
              class="edit_address"
            >
              <div class="form__item small__item">
                <label for="name">Населенный пункт</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Населенный пункт"
                  v-model="complex.address.city"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">Район города</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Район города"
                  v-model="complex.address.rayon"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">Улица</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Улица"
                  v-model="complex.address.street"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">№ дома</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="№ дома"
                  v-model="complex.address.dom"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">Корпус</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Корпус"
                  v-model="complex.address.korpus"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">Литера</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Литера"
                  v-model="complex.address.litera"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">Широта</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Введите название"
                  v-model="complex.address.latitude"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
              <div class="form__item small__item">
                <label for="name">Долгота</label>
                <InputText
                  type="text"
                  id="name"
                  placeholder="Введите название"
                  v-model="complex.address.longitude"
                  :pt="{ root: { class: ['!max-w-[300px]'] } }"
                />
              </div>
            </div>
            <span
              @click="isEditInMapsModalOpen = true"
              class="edit_address-actions"
              >Уточнить координаты на карте</span
            >
          </div>
        </div>
        <YandexMaps
          v-if="isEditInMapsModalOpen"
          :regionLabel="fieldsStore.currentRegionInfo.label"
          :address="selectedAddress?.name"
          :hasHouse="!!complex.address.dom"
          :coords="
            complex.address.latitude
              ? [complex.address.longitude, complex.address.latitude]
              : []
          "
          @closeMaps="isEditInMapsModalOpen = false"
          @coordsChoosed="coordsChoosed"
        />
        <!--<div class="form__item">
          <label for="metro">Название комплекса</label>
          <div class="item__content !items-center">
            <InputSwitch />
            <div class="text text-sm">Выбрать из новостроек</div>
          </div>
        </div>-->
        <div class="form__item">
          <label for="name">Название</label>
          <InputText
            type="text"
            id="name"
            placeholder="Введите название"
            v-model="complex.name"
          />
        </div>

        <div class="form__item" v-if="fieldsStore.metros.length">
          <label for="nameHome">Метро</label>
          <Dropdown
            v-if="form_add_metro"
            :options="fieldsStore.metros"
            filter
            optionLabel="name"
            optionValue="code"
            v-model="metro_to_add.metro_id"
          >
            <template #dropdownicon>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                  fill="#9E9E9E"
                />
              </svg>
            </template>
            <template #emptyfilter>Нет данных</template>
            <template #empty>Нет данных</template>
          </Dropdown>
          <div
            v-else
            style="
              display: flex;
              flex-direction: column;
              align-items: start;
              gap: 5px;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 5px;
                align-items: start;
                max-height: 120px;
                overflow: auto;
              "
            >
              <MyButton
                v-for="(metro, indexMetro) in complex.metros"
                :key="metro.id"
                class="item__delete text-sm"
                @click.prevent="showTemplate($event, indexMetro)"
                v-tooltip.top="'Удалить Метро'"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#EF4444"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <div style="display: flex; gap: 5px">
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
                  <div class="time">
                    {{ metro.subway_time }} минут
                    <span v-if="metro.subway_type == 1">пешком</span
                    ><span v-else-if="metro.subway_type == 2"
                      >на транспорте</span
                    >
                  </div>
                </div>
              </MyButton>
              <ConfirmPopup
                group="deleteMetro"
                :pt="confirmpopupStyle"
              ></ConfirmPopup>
            </div>

            <MyButton
              v-if="!form_add_metro"
              class="item__delete text-sm"
              @click.prevent="form_add_metro = true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                  fill="#4CAF50"
                />
              </svg>
              Добавить метро
            </MyButton>
            <small v-if="errors.metro" class="small_text p-invalid"
              >Выберите метро</small
            >
          </div>
        </div>
        <div class="form__item" v-if="form_add_metro">
          <label for="title"></label>
          <div class="item__content flex-col">
            <div class="form__item" style="grid-template-columns: 1fr 351px">
              <label for="metro">До метро</label>
              <div class="item__content flex-row !items-center">
                <InputText
                  type="number"
                  id="metro"
                  placeholder="Не более"
                  v-model="metro_to_add.subway_time"
                />
                <div class="item__text">минут</div>
              </div>
            </div>
            <div class="form__item" style="grid-template-columns: 1fr 351px">
              <label for="metro">Тип</label>
              <Dropdown
                class="w-full"
                v-model="metro_to_add.subway_type"
                optionLabel="name"
                optionValue="code"
                :options="time_to_subway"
              >
                <template #dropdownicon>
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                      fill="#9E9E9E"
                    />
                    <path
                      d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                      fill="#9E9E9E"
                    />
                    <path
                      d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                      fill="#9E9E9E"
                    />
                  </svg>
                </template>
                <template #emptyfilter>Нет данных</template>
                <template #empty>Нет данных</template>
              </Dropdown>
            </div>
            <div class="item__btns">
              <MyButton
                class="item__save"
                :theme="'green'"
                @click.prevent="saveMetro"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5325 6.9675L11.0325 2.4675C10.9634 2.40004 10.8819 2.34656 10.7925 2.31C10.6995 2.27221 10.6004 2.25187 10.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H13.5C14.0967 15.75 14.669 15.5129 15.091 15.091C15.5129 14.669 15.75 14.0967 15.75 13.5V7.5C15.7506 7.4013 15.7317 7.30345 15.6943 7.21207C15.657 7.12069 15.602 7.03758 15.5325 6.9675ZM6.75 3.75H9.75V5.25H6.75V3.75ZM11.25 14.25H6.75V12C6.75 11.8011 6.82902 11.6103 6.96967 11.4697C7.11032 11.329 7.30109 11.25 7.5 11.25H10.5C10.6989 11.25 10.8897 11.329 11.0303 11.4697C11.171 11.6103 11.25 11.8011 11.25 12V14.25ZM14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25H12.75V12C12.75 11.4033 12.5129 10.831 12.091 10.409C11.669 9.98705 11.0967 9.75 10.5 9.75H7.5C6.90326 9.75 6.33097 9.98705 5.90901 10.409C5.48705 10.831 5.25 11.4033 5.25 12V14.25H4.5C4.30109 14.25 4.11032 14.171 3.96967 14.0303C3.82902 13.8897 3.75 13.6989 3.75 13.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H5.25V6C5.25 6.19891 5.32902 6.38968 5.46967 6.53033C5.61032 6.67098 5.80109 6.75 6 6.75H10.5C10.6989 6.75 10.8897 6.67098 11.0303 6.53033C11.171 6.38968 11.25 6.19891 11.25 6V4.8075L14.25 7.8075V13.5Z"
                    fill="white"
                  />
                </svg>
                Сохранить
              </MyButton>
              <MyButton
                :theme="'grey-icon'"
                class="item__delete"
                @click.prevent="form_add_metro = false"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0575 8.99999L13.2825 5.78249C13.4237 5.64126 13.503 5.44971 13.503 5.24999C13.503 5.05026 13.4237 4.85871 13.2825 4.71749C13.1412 4.57626 12.9497 4.49692 12.75 4.49692C12.5502 4.49692 12.3587 4.57626 12.2175 4.71749L8.99995 7.94249L5.78245 4.71749C5.64123 4.57626 5.44968 4.49692 5.24995 4.49692C5.05023 4.49692 4.85868 4.57626 4.71745 4.71749C4.57623 4.85871 4.49689 5.05026 4.49689 5.24999C4.49689 5.44971 4.57623 5.64126 4.71745 5.78249L7.94245 8.99999L4.71745 12.2175C4.64716 12.2872 4.59136 12.3702 4.55329 12.4616C4.51521 12.5529 4.49561 12.651 4.49561 12.75C4.49561 12.849 4.51521 12.947 4.55329 13.0384C4.59136 13.1298 4.64716 13.2128 4.71745 13.2825C4.78718 13.3528 4.87013 13.4086 4.96152 13.4467C5.05292 13.4847 5.15095 13.5043 5.24995 13.5043C5.34896 13.5043 5.44699 13.4847 5.53839 13.4467C5.62978 13.4086 5.71273 13.3528 5.78245 13.2825L8.99995 10.0575L12.2175 13.2825C12.2872 13.3528 12.3701 13.4086 12.4615 13.4467C12.5529 13.4847 12.6509 13.5043 12.75 13.5043C12.849 13.5043 12.947 13.4847 13.0384 13.4467C13.1298 13.4086 13.2127 13.3528 13.2825 13.2825C13.3527 13.2128 13.4085 13.1298 13.4466 13.0384C13.4847 12.947 13.5043 12.849 13.5043 12.75C13.5043 12.651 13.4847 12.5529 13.4466 12.4616C13.4085 12.3702 13.3527 12.2872 13.2825 12.2175L10.0575 8.99999Z"
                    fill="#666666"
                  />
                </svg>
              </MyButton>
            </div>
          </div>
        </div>

        <div class="form__item">
          <label for="nameHome">Список Акций</label>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: start;
              gap: 5px;
            "
          >
            <ComplexAction
              v-for="(action, indexAction) in complex.actions"
              :key="indexAction"
              :errors="errors"
              :action="action"
              @updateAction="(event) => updateAction(event, indexAction)"
              @deleteAction="
                (event) => showActionTemplate(event, indexAction, action.id)
              "
            />
            <MyButton
              v-if="!form_add_action"
              class="item__delete text-sm"
              @click.prevent="form_add_action = true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                  fill="#4CAF50"
                />
              </svg>
              Добавить акцию
            </MyButton>
            <div
              v-else
              style="
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 100%;
              "
            >
              <InputText
                v-model="actionName"
                @input="errors.titleAction = false"
                :class="{ 'p-invalid': errors.titleAction }"
                type="text"
                placeholder="Название"
                class="w-full"
              />
              <small v-if="errors.titleAction" class="small_text p-invalid"
                >Введите заголовок УТП</small
              >
              <Textarea
                v-model="actionDesc"
                placeholder="Описание"
                autoResize
                class="w-full"
              />
              <input
                @change="onImagesAdded"
                accept="image/*"
                type="file"
                class="hidden"
                ref="photoInput"
              />
              <MyButton
                v-if="!actionPhoto"
                @click.stop="onAddPhotoClick"
                :theme="'green'"
                class="text-sm"
              >
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
              <div v-else class="complex-photo-container">
                <img
                  class="complex-photo"
                  :src="photoToObjectUrl(actionPhoto)"
                  alt=""
                />
                <div
                  @click.stop="actionPhoto = null"
                  class="complex-photo-overlay"
                >
                  <img
                    src="@/shared/assets/images/complexes/trash.svg"
                    alt="Удалить"
                  />
                </div>
              </div>

              <div class="item__btns">
                <MyButton
                  :disabled="actionLoading"
                  class="item__save"
                  :theme="'green'"
                  @click.prevent="saveAction"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5325 6.9675L11.0325 2.4675C10.9634 2.40004 10.8819 2.34656 10.7925 2.31C10.6995 2.27221 10.6004 2.25187 10.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H13.5C14.0967 15.75 14.669 15.5129 15.091 15.091C15.5129 14.669 15.75 14.0967 15.75 13.5V7.5C15.7506 7.4013 15.7317 7.30345 15.6943 7.21207C15.657 7.12069 15.602 7.03758 15.5325 6.9675ZM6.75 3.75H9.75V5.25H6.75V3.75ZM11.25 14.25H6.75V12C6.75 11.8011 6.82902 11.6103 6.96967 11.4697C7.11032 11.329 7.30109 11.25 7.5 11.25H10.5C10.6989 11.25 10.8897 11.329 11.0303 11.4697C11.171 11.6103 11.25 11.8011 11.25 12V14.25ZM14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25H12.75V12C12.75 11.4033 12.5129 10.831 12.091 10.409C11.669 9.98705 11.0967 9.75 10.5 9.75H7.5C6.90326 9.75 6.33097 9.98705 5.90901 10.409C5.48705 10.831 5.25 11.4033 5.25 12V14.25H4.5C4.30109 14.25 4.11032 14.171 3.96967 14.0303C3.82902 13.8897 3.75 13.6989 3.75 13.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H5.25V6C5.25 6.19891 5.32902 6.38968 5.46967 6.53033C5.61032 6.67098 5.80109 6.75 6 6.75H10.5C10.6989 6.75 10.8897 6.67098 11.0303 6.53033C11.171 6.38968 11.25 6.19891 11.25 6V4.8075L14.25 7.8075V13.5Z"
                      fill="white"
                    />
                  </svg>
                  Сохранить
                </MyButton>
                <MyButton
                  :theme="'grey-icon'"
                  class="item__delete"
                  @click.prevent="closeAction"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.0575 8.99999L13.2825 5.78249C13.4237 5.64126 13.503 5.44971 13.503 5.24999C13.503 5.05026 13.4237 4.85871 13.2825 4.71749C13.1412 4.57626 12.9497 4.49692 12.75 4.49692C12.5502 4.49692 12.3587 4.57626 12.2175 4.71749L8.99995 7.94249L5.78245 4.71749C5.64123 4.57626 5.44968 4.49692 5.24995 4.49692C5.05023 4.49692 4.85868 4.57626 4.71745 4.71749C4.57623 4.85871 4.49689 5.05026 4.49689 5.24999C4.49689 5.44971 4.57623 5.64126 4.71745 5.78249L7.94245 8.99999L4.71745 12.2175C4.64716 12.2872 4.59136 12.3702 4.55329 12.4616C4.51521 12.5529 4.49561 12.651 4.49561 12.75C4.49561 12.849 4.51521 12.947 4.55329 13.0384C4.59136 13.1298 4.64716 13.2128 4.71745 13.2825C4.78718 13.3528 4.87013 13.4086 4.96152 13.4467C5.05292 13.4847 5.15095 13.5043 5.24995 13.5043C5.34896 13.5043 5.44699 13.4847 5.53839 13.4467C5.62978 13.4086 5.71273 13.3528 5.78245 13.2825L8.99995 10.0575L12.2175 13.2825C12.2872 13.3528 12.3701 13.4086 12.4615 13.4467C12.5529 13.4847 12.6509 13.5043 12.75 13.5043C12.849 13.5043 12.947 13.4847 13.0384 13.4467C13.1298 13.4086 13.2127 13.3528 13.2825 13.2825C13.3527 13.2128 13.4085 13.1298 13.4466 13.0384C13.4847 12.947 13.5043 12.849 13.5043 12.75C13.5043 12.651 13.4847 12.5529 13.4466 12.4616C13.4085 12.3702 13.3527 12.2872 13.2825 12.2175L10.0575 8.99999Z"
                      fill="#666666"
                    />
                  </svg>
                </MyButton>
              </div>
            </div>
          </div>
        </div>
        <div class="form__item">
          <label>Основное описание комплекса</label>
          <div class="item__content flex-col">
            <InputText
              type="text"
              placeholder="Заголовок описания"
              class="w-full"
              v-model="complex.dop.title_desc"
            />
            <Textarea
              placeholder="Описание"
              autoResize
              class="w-full"
              v-model="complex.dop.text_desc"
            />
          </div>
        </div>
        <div class="form__item">
          <label for="title">Второстепенное описание ЖК</label>
          <div class="item__content flex-col">
            <InputText
              type="text"
              placeholder="Заголовок описания"
              class="w-full"
              v-model="complex.dop.title_desc_dop"
            />
            <Textarea
              placeholder="Описание"
              autoResize
              class="w-full"
              v-model="complex.dop.text_desc_dop"
            />
          </div>
        </div>
        <div class="form__item">
          <label for="video">Видео ЖК</label>
          <div class="item__content flex-col">
            <InputText
              type="text"
              id="video"
              placeholder="Ссылка на видео"
              class="w-full"
              v-model="complex.dop.url_video"
            />
          </div>
        </div>
        <div class="form__item">
          <label for="nameHome">Тип видео</label>
          <Dropdown
            v-model="complex.dop.type_video"
            :options="types_video"
            optionLabel="name"
            optionValue="code"
          >
            <template #dropdownicon>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                  fill="#9E9E9E"
                />
              </svg>
            </template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="nameHome">Название Застройщика</label>
          <div class="item__content flex-col">
            <Dropdown
              v-model="complex.builder_id"
              filter
              emptyFilterMessage="Ничего не найдено"
              placeholder="Выберите застройщика"
              :options="fieldsStore.builders.options"
              optionLabel="name"
              optionValue="code"
            >
              <template #dropdownicon>
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                    fill="#9E9E9E"
                  />
                  <path
                    d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                    fill="#9E9E9E"
                  />
                  <path
                    d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                    fill="#9E9E9E"
                  />
                </svg>
              </template>
            </Dropdown>
          </div>
        </div>

        <div class="form__item">
          <label for="nameHome">Телефон застройщика</label>
          <InputText
            type="number"
            class="select text small-input rooms"
            placeholder="Телефон застройщика"
            v-model="newBuilderPhone"
            style="width: 450px"
          />
        </div>
        <div class="form__item">
          <label for="nameHome">Ссылка на сайт застройщика</label>
          <InputText
            class="select text small-input rooms"
            placeholder="Ссылка на сайт застройщика"
            v-model="newBuilderLink"
            style="width: 450px"
          />
        </div>

        <div class="form__item">
          <label for="nameHome">Информация об офисе продаж</label>
          <div class="item__content flex-col">
            <InputText
              type="number"
              class="select text small-input rooms"
              placeholder="Телефон отдела продаж..."
              v-model="complex.dop.phone_op"
              style="width: 450px"
            />
            <InputText
              type="number"
              class="select text small-input rooms"
              placeholder="Мобильный телефон ДомКлик PRO..."
              v-model="complex.dop.phone_mobil_op"
              style="width: 450px"
            />
            <InputText
              class="select text small-input rooms"
              placeholder="Адрес отдела продаж..."
              v-model="complex.dop.address_op"
              style="width: 450px"
            />
            <InputText
              class="select text small-input rooms"
              placeholder="Широта офиса продаж..."
              v-model="complex.dop.latitude_op"
              style="width: 450px"
            />
            <InputText
              class="select text small-input rooms"
              placeholder="Долгота офиса продаж..."
              v-model="complex.dop.longitude_op"
              style="width: 450px"
            />
            <InputText
              class="select text small-input rooms"
              placeholder="Часовой пояс по Гринвичу..."
              v-model="complex.dop.timezone_op"
              style="width: 450px"
            />
            <MultiSelect
              :pt="multiSelectStyle"
              id="type"
              v-model="complex.dop.workdays_op"
              :options="workDays"
              optionLabel="name"
              optionValue="name"
              placeholder="Рабочие дни..."
              selectedItemsLabel="Выбрано: {0}"
              :maxSelectedLabels="1"
              class="w-full md:w-20rem"
            />
            <Calendar
              date-format="HH:mm"
              timeOnly
              :show-icon="true"
              placeholder="Время работы с"
              v-model="complex.dop.opentime_op"
              @show="!complex.dop.opentime_op ? complex.dop.opentime_op = new Date() : null"
              style="width: 300px;"
            >
              <template #dropdownicon>
                <img
                  src="@/shared/assets/images/complexes/dropdown-icon.svg"
                  alt=""
                  class=""
                />
              </template>
            </Calendar>
            <Calendar
              date-format="H:m"
              timeOnly
              :show-icon="true"
              placeholder="Время работы до"
              v-model="complex.dop.closetime_op"
              style="width: 300px;"
              @show="!complex.dop.closetime_op ? complex.dop.closetime_op = new Date() : null"
            >
              <template #dropdownicon>
                <img
                  src="@/shared/assets/images/complexes/dropdown-icon.svg"
                  alt=""
                  class=""
                />
              </template>
            </Calendar>
          </div>
        </div>
        <div class="form__item">
          <label for="cadastral_number">Кадастровый номер земельного участка</label>
          <InputText
            type="text"
            id="cadastral_number"
            placeholder="Введите номер"
            v-model="complex.cadastral_number"
            :pt="{ root: { class: ['!max-w-[300px]'] } }"
          />
        </div>
        <div class="form__item">
          <label for="has_show_room">Наличие шоурума</label>
          <InputSwitch id="has_show_room" v-model="complex.has_show_room" />
        </div>
      </form>
      <Toast />
    </template>
    <template v-slot:formBtns>
      <MyButton
        :style="!coordinatesSetted ? 'border: none' : ''"
        :disabled="!coordinatesSetted"
        :theme="'green'"
        class="submit mt-7.5"
        @click="save"
        >{{ complex ? "Сохранить" : "Добавить" }}</MyButton
      >
    </template>
  </FormLayout>
</template>

<script setup>
import FormLayout from "@/shared/UI/modalLayout.vue";
import MyButton from "@/shared/UI/MyButton.vue";
import { ref, onMounted, watch, computed, toRefs, onUpdated } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import {
  isEmpty,
  getConstraints,
  INITIAL_COMPLEX,
  confirmpopupStyle,
  photoToObjectUrl,
  copyObject,
} from "@/shared/utils/util";

import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import api from "@/shared/api";
import AutoComplete from "primevue/autocomplete";
import YandexMaps from "@/components/YandexMaps.vue";
import { useFieldsStore } from "@/app/store/fields";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ComplexAction from "./complexAction.vue";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import InputText from "primevue/inputtext";

const fieldsStore = useFieldsStore();
const confirm = useConfirm();
const toast = useToast();

const router = useRouter();
const addressCoordinates = ref();

const multiSelectStyle = {
  root: {
    class: ["!rounded !border !border-grey-400 !p-3 !h-max"],
  },
  input: {
    class: [
      "!flex !flex-row !items-center !p-0 !text-sm !leading-none !text-grey-900 !mr-3",
    ],
  },
  wrapper: {
    class: ["!p-0"],
  },
  item: {
    class: ["!text-sm"],
  },
  label: {
    class: ["!p-0"],
  },
  header: {
    class: ["custom-header"],
  },
};

const emits = defineEmits(["closeModel", "updateComplex"]);

const props = defineProps({
  isOpen: Boolean,
  complex: Object,
});

const has_restricted_access = ref(!!Number(document.getElementById('has_restricted_access')?.value))
const hasDeveloper = ref(!!Number(document.getElementById('has_developer')?.value))

const complex = ref(copyObject(INITIAL_COMPLEX));
const titleForm = ref(
  props.complex ? "Редактировать комплекс" : "Добавить комплекс"
);

// const region_kladr = ref(null);
// const  = region_labelref(null);
const time_to_subway = [
  { code: 1, name: "пешком" },
  { code: 2, name: "на транспорте" },
];
const types_video = [
  { code: "youtube", name: "Youtube" },
  { code: "realtime", name: "Realtime" },
];
const errors = ref({ metro: false, action: false });
const metro_to_add = ref({
  metro_id: null,
  subway_time: null,
  subway_type: null,
});
const actionName = ref();
const actionDesc = ref();
const actionPhoto = ref();
const action_to_edit = ref(null);
const form_add_metro = ref(false);
const form_add_action = ref(false);
const showEditAddress = ref(false);
const isEditInMapsModalOpen = ref(false);
const coordinatesSetted = ref(true);
const photoInput = ref();
const actionLoading = ref(false);
const workDays = ref([
  { name: "Понедельник" },
  { name: "Вторник" },
  { name: "Среда" },
  { name: "Четверг" },
  { name: "Пятница" },
  { name: "Суббота" },
  { name: "Воскресенье" },
]);
const newBuilderPhone = ref("");
const newBuilderLink = ref("");
// const {complex} = toRefs(props);

const selectedAddress = ref(null);
const filteredAdresses = ref([]);
const addresses = ref([]);

const onAddPhotoClick = (e) => {
  e.preventDefault();
  photoInput.value.click();
};

const onImagesAdded = (e) => {
  if (!e.target.files.length) return;

  actionPhoto.value = e.target.files[0];
};

const coordsChoosed = (coords) => {
  coordinatesSetted.value = true;
  changeAddressAdditionalInfo({ longitude: coords[0], latitude: coords[1] });
};
const searchAddress = async (query) => {
  coordinatesSetted.value = false;

  const url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  const token = "2f6595e671df25163a441a544bbed3683791c5d0";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify(query),
  };

  const response = await fetch(url, options);

  return await response.json();
};

const searchSuggestions = async (event) => {
  addresses.value = [];
  const address = event.query.toLowerCase();

  const result = await searchAddress({
    query: address,
    count: 5,
    type: "ADDRESS",
    locations: getConstraints(
      fieldsStore.currentRegionInfo.kladr,
      fieldsStore.currentRegionInfo.label
    ),
    restrict_value: false,
  });

  addresses.value = result.suggestions;

  filteredAdresses.value = addresses.value.map((address, index) => ({
    name: address.value,
    unrestricted_value: address.unrestricted_value,
    id: index,
  }));
};

const searchBySelectedAddress = async (address) => {
  const result = await searchAddress({
    count: 1,
    query: address,
    restrict_value: false,
  });

  return result;
};

const saveMetro = () => {
  if (metro_to_add.value.metro_id) {
    complex.value.metros.push(metro_to_add.value);
    closeAddMetro();
  } else {
    errors.value.metro = true;
  }
};

const saveAction = () => {
  if (!isEmpty(actionName.value)) {
    // if (!complex.value.actions) {
    //   localHouse.value.actions = []
    // }

    const action = {
      name: actionName.value,
      desc: actionDesc.value,
      image: actionPhoto.value,
    };

    if (props.complex) {
      actionLoading.value = true;
      const bodyFormData = new FormData();
      bodyFormData.append("name", actionName.value);
      bodyFormData.append("desc", actionDesc.value);
      bodyFormData.append("complex_id", props.complex.id);
      bodyFormData.append("image", actionPhoto.value);

      api
        .saveComplexAction(bodyFormData)
        .then((response) => {
          complex.value.actions.push({ ...action, id: response.data });
          toast.add({
            severity: "success",
            summary: "Загружено",
            detail: "Акция успешно загружена",
            life: 3000,
          });
          closeAction();
        })
        .finally(() => (actionLoading.value = false));
    } else {
      complex.value.actions.push({
        name: actionName.value,
        desc: actionDesc.value,
        image: actionPhoto.value,
      });
      closeAction();
    }
  } else {
    errors.value.titleUtp = true;
  }
};

const changeActionByIndex = (action, index) => {
  complex.value.actions[index].id = action.id;
  complex.value.actions[index].name = action.name;
  complex.value.actions[index].desc = action.desc;
  complex.value.actions[index].image = action.image;
};

const updateAction = (action, index) => {
  if (action.id) {
    actionLoading.value = true;
    const bodyFormData = new FormData();
    bodyFormData.append("name", action.name);
    bodyFormData.append("desc", action.desc);
    bodyFormData.append("complex_id", props.complex.id);
    bodyFormData.append("image", action.image);
    bodyFormData.append("id", action.id);
    api
      .saveComplexAction(bodyFormData)
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Обновлено",
          detail: "Aкция успешно обновлена",
          life: 3000,
        });

        changeActionByIndex(action, index);
      })
      .finally(() => (actionLoading.value = false));
  } else {
    changeActionByIndex(action, index);
  }
};

const closeAction = () => {
  form_add_action.value = false;
  actionDesc.value = null;
  actionPhoto.value = null;
  actionName.value = null;
  errors.value.titleAction = false;
};

const showTemplate = (event, index) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteMetro",
    message: "Удалить Метро?",
    acceptLabel: "Да",
    rejectLabel: "Нет",
    acceptClass: "!bg-green !shadow-none",
    rejectClass: "!bg-red !shadow-none",
    accept: () => {
      complex.value.metros.splice(index, 1);
    },
    reject: () => {
      return;
    },
  });
};

const showActionTemplate = (event, index, id) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteAction",
    message: "Удалить Акцию?",
    acceptLabel: "Да",
    rejectLabel: "Нет",
    acceptClass: "!bg-green !shadow-none",
    rejectClass: "!bg-red !shadow-none",
    accept: () => {
      api.deleteComplexAction(id).then(() => {
        toast.add({
          severity: "success",
          summary: "Удалено",
          detail: "Акция успешно удалена",
          life: 3000,
        });
        complex.value.actions.splice(index, 1);
      });
    },
    reject: () => {
      return;
    },
  });
};

const closeAddMetro = () => {
  form_add_metro.value = false;
  metro_to_add.value = {
    metro_id: null,
    subway_time: null,
    subway_type: null,
  };
  errors.value.metro = false;
};
function clear() {
  complex.value = copyObject(INITIAL_COMPLEX);
}

function closeModel() {
  emits("closeModel");
  clear();
}

//Выбор страны
const changeCountry = () => {
  if (complex.value.country_id != 171) {
    fieldsStore.changeRegionInfoRegionId(0);
  } else {
    fieldsStore.changeRegionInfoRegionId(
      fieldsStore.currentRegionInfo.region_id_user
    );
    changeRegion();
  }
};

//Выбор региона
const changeRegion = (event) => {
  complex.value.address = copyObject(INITIAL_COMPLEX.address);
  selectedAddress.value = null;
  coordinatesSetted.value = false;
  if (fieldsStore.currentRegionInfo.region_id) {
    complex.value.rf_region_id = fieldsStore.currentRegionInfo.region_id;
    fieldsStore.currentRegionInfo.kladr =
      fieldsStore.regionsInfo.regions_list[complex.value.rf_region_id].kladr;
    fieldsStore.currentRegionInfo.label =
      fieldsStore.regionsInfo.regions_list[complex.value.rf_region_id].label;
  }
  fieldsStore.metroListChanged(event.value);
};

async function save() {
  if (has_restricted_access.value)
  {
    toast.add({
      severity: 'warn',
      summary: 'Тариф не оплачен',
      detail: 'У вас отключен тариф, для того, чтобы добавить Комплекс необходимо произвести Оплату.',
      life: 3000 
    });

    return;
  }

  if (!selectedAddress.value || !coordinatesSetted.value) {
    coordinatesSetted.value = false;
    addressCoordinates.value.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const updatedComplex = {
    ...complex.value,
    address: {
      ...complex.value.address,
      address: selectedAddress.value
        ? selectedAddress.value.name
        : complex.value.address.address,
    },
    metros: complex.value.metros.map((metro) => {
      if (!metro.metro_id) {
        return {
          metro: metro.metro,
          subway_time: metro.subway_time,
          subway_type: metro.subway_type,
          metro_id: fieldsStore.metros.find((list) => list.name == metro.metro)
            ?.code,
        };
      }

      return metro;
    }),
  };

  api
    .saveComplex(updatedComplex, newBuilderPhone.value, newBuilderLink.value)
    .then((response) => {
      var res = response.data;
      if (res.result == "done") {
        emits("closeModel");
        if (complex.value.builder_id) {
          fieldsStore.builders.list[complex.value.builder_id].phone =
            newBuilderPhone.value;
          fieldsStore.builders.list[complex.value.builder_id].link =
            newBuilderLink.value;

            if (!complex.value.builder) complex.value.builder = {}
            complex.value.builder.name = fieldsStore.builders.list[complex.value.builder_id].name
        }
        if (props.complex) {
          emits("updateComplex", {
            ...complex.value,
            address: {
              ...complex.value.address,
              address: selectedAddress.value?.name,
            },
          });
        } else {
          if (complex.value.actions.length) {
            actionLoading.value = true;
            const promises = complex.value.actions.map((action) => {
              const bodyFormData = new FormData();
              bodyFormData.append("name", action.name);
              bodyFormData.append("desc", action.desc);
              bodyFormData.append("image", action.image);
              bodyFormData.append("complex_id", res.complex_id);

              return api.saveComplexAction(bodyFormData);
            });

            Promise.all(promises).finally(() => {
              location.hash = "#/my-objects/" + res.complex_id;
              location.reload();
            });
          } else {
            location.hash = "#/my-objects/" + res.complex_id;
            location.reload();
          }
        }
      }
    });
}

watch(
  metro_to_add,
  (value) => {
    const metro_from_list = fieldsStore.metros.find(
      (m) => m.code == value.metro_id
    );

    if (metro_from_list) {
      metro_to_add.value.metro = metro_from_list.name;
    }
  },
  { deep: true }
);

const changeAddressAdditionalInfo = (params) => {
  complex.value.address = { ...complex.value.address, ...params };
};

watch(selectedAddress, async (value) => {
  if (!value || !addresses.value[value.id]) return;

  changeAddressAdditionalInfo(copyObject(INITIAL_COMPLEX.address));

  const result = await searchBySelectedAddress(value.unrestricted_value);

  selectedAddress.value.name = result.suggestions[0].value;

  const address = result.suggestions[0].data;

  if (address.house) {
    coordinatesSetted.value = true;
  }

  const joinedAddress = address.settlement_with_type;

  if (address.city === address.region && address.settlement) {
    changeAddressAdditionalInfo({ city: joinedAddress });
  } else {
    if (address.city) changeAddressAdditionalInfo({ city: address.city });
    else changeAddressAdditionalInfo({ city: joinedAddress });
  }

  if (address.city_district)
    changeAddressAdditionalInfo({ rayon: address.city_district });
  else if (address.settlement && !address.area && address.city)
    changeAddressAdditionalInfo({ rayon: joinedAddress });
  if (address.settlement_type_full == "микрорайон")
    changeAddressAdditionalInfo({ rayon: joinedAddress });

  changeAddressAdditionalInfo({ street: address.street_with_type });

  if (address.house) changeAddressAdditionalInfo({ dom: address.house });

  if (address.block_type_full == "корпус")
    changeAddressAdditionalInfo({ korpus: address.block });

  if (["строение", "литера", "литер"].includes(address.block_type_full))
    changeAddressAdditionalInfo({ litera: address.block });

  const trimmedLabel = value.name.replace(/\s+/g, " ").trim();
  window.yandexMap.geocode(trimmedLabel).then((res) => {
    const response = res.geoObjects.get(0).geometry.getCoordinates();

    if (!response || !response.length) {
      coordinatesSetted.value = false;
    } else {
      const [coord1, cord2] = response;
      changeAddressAdditionalInfo({
        longitude: cord2.toPrecision(8),
        latitude: coord1.toPrecision(8),
      });
    }
  });
});

onUpdated(() => {
  if (props.complex) {
    complex.value = { ...props.complex };

    if (props.complex.dop?.opentime_op) {
      complex.value.dop.opentime_op = new Date(props.complex.dop.opentime_op);
    }
    if (props.complex.dop?.closetime_op) {
      complex.value.dop.closetime_op = new Date(props.complex.dop.closetime_op);
    }

    if (props.complex.builder_id > 0) {
      if (fieldsStore.builders.list[props.complex.builder_id]) {
        newBuilderPhone.value =
          fieldsStore.builders.list[props.complex.builder_id].phone;
        newBuilderLink.value =
          fieldsStore.builders.list[props.complex.builder_id].link;
      }
    }
  }
});

watch(
  () => props.complex,
  (newValue) => {
    if (newValue && newValue.address) {
      if (newValue.address.dom) {
        coordinatesSetted.value = true;
      }
      selectedAddress.value = { name: newValue.address.address };
    }
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.addComplex {
  width: 100%;
  height: auto;

  &__form {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;
    row-gap: 20px;

    .form__item {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: 1fr 436px;

      .p-invalid {
        color: #e24c4c;
      }

      label {
        margin-top: 8px;
        font-size: 16px;
        font-weight: 400;
        @apply text-grey-900;

        span {
          @apply text-red;
        }
      }

      .item__content {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        column-gap: 16px;
        row-gap: 16px;
      }

      .item__text {
        @apply text-grey-900;
        font-size: 16px;
      }

      .item__btns {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        column-gap: 8px;
      }
    }

    .small__item {
      grid-template-columns: 1fr 276px;
    }

    .edit_address {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-top: 20px;
      row-gap: 20px;
      transition: max-height 0.35s ease-out;
    }

    .edit_address-actions {
      cursor: pointer;
      margin: 10px 5px 0 5px;
      border-bottom: 1px solid #b5b5b5;
      width: max-content;
      font-size: 14px;
      user-select: none;
    }
  }

  .complex-photo-container {
    position: relative;
    width: max-content;
    height: 140px;

    .complex-photo {
      height: 140px;
      max-width: 250px;
      object-fit: contain;
    }

    &:hover {
      .complex-photo-overlay {
        opacity: 0.5;
        z-index: 1;
      }
    }

    .complex-photo-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background: #cdc9c9;
      opacity: 0;
      z-index: -1;
      cursor: pointer;
      transition: 0.25s;

      img {
        width: 50px;
        height: 50px;
      }
    }
  }

  .flex-grap-group {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }

  .p-dropdown {
    width: 100%;
  }
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
  max-width: 380px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
