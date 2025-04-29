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
    <Tabs :tabs="tabs" :onClickTab="() => {openFullImage = false; openFullPlan = false; emits('full:plan-state-updated', false)}">
      <template #tab-0>
        <div class="modelWindow__content">
          <div class="modelWindow__head">
            <div class="modelWindow__title mr-auto text-3xl">
              {{ room_types[apartment.type] }} №&nbsp;{{
                apartment.number
              }}
              ID&nbsp;{{ apartment.id }}
              <img v-if="isErrorStatus(apartment)" src="@/shared/assets/images/icons-bookmark-22-red.png" alt="Реклама" class=""
                   v-tooltip.bottom="{
                          value: getStatusText(apartment),
                          escape: true,
                          hideDelay: 1000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"
              />
              <img v-if="isWaitStatus(apartment)" src="@/shared/assets/images/icons-bookmark-22-orange.png" alt="Реклама" class=""
                   v-tooltip.bottom="{
                          value: getStatusText(apartment),
                          escape: true,
                          hideDelay: 1000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-orange !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-orange'],
                            },
                          },
                        }"
              />
              <img v-if="isActiveStatus(apartment)" src="@/shared/assets/images/icons-bookmark-22-green.png" alt="Реклама" class=""
                    v-tooltip.bottom="{
                          value: getStatusText(apartment),
                          escape: true,
                          hideDelay: 1000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-green !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-green'],
                            },
                          },
                        }"
                />
            </div>
            <SplitButton
              @click="handleSplitButtonClick"
              v-if="!route.meta.isViewPage && fieldsStore.complex_status.length"
              :model="statuses"
              :label="apartment.complex_status_info?.status_name"
              ref="splitButton"
              :buttonProps="{
                pt: {
                  root: {
                    style: `background-color: ${apartment.complex_status_info?.status_color}`,
                    class: [ 'status_button, !border-0' ],
                    'data-req-id': apartment.requisition_id,
                  },
                },
              }"
              :menuButtonProps="{
                pt: {
                  root: {
                    style: `background-color: ${apartment.complex_status_info?.status_color}`,
                    class: [ '!border-0' ],
                  },
                },
                'aria-expanded': true,
                'aria-controls': 'overlay_menu',
              }"
              class="modelWindow__status !p-0 !rounded-e-none"
            />
            <div
              v-else
              :style="{'background-color' : apartment.complex_status_info?.status_color}"
              :data-req-id="apartment.requisition_id"
              class="modelWindow__status status_button"
            >
              {{ apartment?.complex_status_info?.status_name }}
            </div>
          </div>
          <div class="modelWindow__info_box">
            <div class="modelWindow__info">
              <div class="modelWindow__type">{{ apartment.rooms_count }}</div>
              <div class="modelWindow__square">{{ apartment.area }} м2</div>
              <Dropdown
                :options="availableFloorsNames"
                optionLabel="label"
                optionValue="value"
                v-model="activeFloor"
                @change="floorChanged"
                :pt="dropdownStyle"
              ></Dropdown>
              <!-- @click="save" 
              :model="items" -->
              <div v-if="apartment.requisitions && apartment.requisitions.length > 0" @click="handleOpenRequisitions(apartment)" class="apartment-requisitions">
                {{ apartment.requisitions.length }}
              </div>
            </div>

            <div v-if="activeReservation && activeReservation.completion_time" class="active_reservation">
              <p class="title">
                Активная бронь
              </p>
              <p class="date">
                до {{ moment.tz(activeReservation.completion_time, 'DD.MM.YYYY HH:mm:ss', 'Europe/Moscow').tz(localTimeZone).format('DD.MM.YYYY HH:mm') }}
              </p>
            </div>
          </div>
          <div class="modelWindow__image">
            <div>
              <div class="image">
                <img
                  v-if="apartment.plan_url"
                  :src="apartment.plan_url"
                  alt=""
                  class=""
                />
                <img
                  v-else
                  style="width: 120px"
                  src="@/shared/assets/images/complexes/gallery.svg"
                  alt=""
                  class=""
                />
              </div>
              <div
                v-if="apartment.plan_url"
                class="image__loop"
                @click="() => {openFullImage = !openFullImage; openFullPlan = false; emits('full:plan-state-updated', false)}"
              >
                <svg
                  v-if="openFullImage"
                  xmlns="http://www.w3.org/2000/svg"
                  width="118px"
                  height="117px"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="#000000"
                    d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zM352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64z"
                  />
                </svg>
                <svg
                  v-else
                  width="118"
                  height="117"
                  viewBox="0 0 1024 1024"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#000000"
                    d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zm-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="btns-wrapper">
            <div class="modelWindow__btns">
              <button v-if="props.apartment.figures" @click="handleOpenFullPlan" class="text-green font-bold">
                Посмотреть на плане этажа
              </button>
              <div
                  v-if="apartment.has_light_angle"
                >
                  <div class="cell">
                    <img
                      style="width: 95px"
                      :src="require('@/shared/assets/images/said.png')"
                      alt=""
                      :style="`transform: rotate(${apartment.light_angle}deg)`"
                    />
                  </div>
              </div>
              <template v-if="apartment.status_type != 'not_for_sale' && apartment.status_type != 'sold'">
                  <MyButton class="request-btn" :theme="'green'" @click="handleApplicationClick()">
                      Создать заявку
                  </MyButton>
              </template>
            </div>
          </div>
          <div class="modelWindow__price">
            <div>{{ formatNumber(apartment.total_amount) }} руб.</div>
            <p
              style="
                display: flex;
                align-items: center;
                height: max-content;
                gap: 5px;
              "
              v-if="!route.meta.isViewPage"
              @click="openedRoom = apartment"
            >
              Редактировать
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.75 9.00002C15.5511 9.00002 15.3603 9.07903 15.2197 9.21969C15.079 9.36034 15 9.5511 15 9.75002V14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V3.75002C3 3.5511 3.07902 3.36034 3.21967 3.21969C3.36032 3.07903 3.55109 3.00002 3.75 3.00002H8.25C8.44891 3.00002 8.63968 2.921 8.78033 2.78035C8.92098 2.63969 9 2.44893 9 2.25002C9 2.0511 8.92098 1.86034 8.78033 1.71969C8.63968 1.57903 8.44891 1.50002 8.25 1.50002H3.75C3.15326 1.50002 2.58097 1.73707 2.15901 2.15903C1.73705 2.58098 1.5 3.15328 1.5 3.75002V14.25C1.5 14.8468 1.73705 15.419 2.15901 15.841C2.58097 16.263 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.263 15.841 15.841C16.2629 15.419 16.5 14.8468 16.5 14.25V9.75002C16.5 9.5511 16.421 9.36034 16.2803 9.21969C16.1397 9.07903 15.9489 9.00002 15.75 9.00002ZM4.5 9.57001V12.75C4.5 12.9489 4.57902 13.1397 4.71967 13.2803C4.86032 13.421 5.05109 13.5 5.25 13.5H8.43C8.5287 13.5006 8.62655 13.4817 8.71793 13.4443C8.80931 13.407 8.89242 13.352 8.9625 13.2825L14.1525 8.08502L16.2825 6.00002C16.3528 5.93029 16.4086 5.84734 16.4467 5.75595C16.4847 5.66455 16.5043 5.56652 16.5043 5.46752C16.5043 5.36851 16.4847 5.27048 16.4467 5.17908C16.4086 5.08769 16.3528 5.00474 16.2825 4.93502L13.1025 1.71752C13.0328 1.64722 12.9498 1.59142 12.8584 1.55335C12.767 1.51527 12.669 1.49567 12.57 1.49567C12.471 1.49567 12.373 1.51527 12.2816 1.55335C12.1902 1.59142 12.1072 1.64722 12.0375 1.71752L9.9225 3.84002L4.7175 9.03752C4.64799 9.1076 4.59299 9.19071 4.55567 9.28209C4.51835 9.37346 4.49943 9.47131 4.5 9.57001ZM12.57 3.30752L14.6925 5.43002L13.6275 6.49502L11.505 4.37252L12.57 3.30752ZM6 9.87752L10.4475 5.43002L12.57 7.55252L8.1225 12H6V9.87752Z"
                  fill="#666666"
                />
              </svg>
            </p>
          </div>
          <div class="square-price-and-btn">
            <div class="modelWindow__priceSqure">
            {{
              formatNumber(
                ((apartment.total_amount || 0) / (apartment.area || 0)).toFixed(2)
              )
            }}
            руб. за м2
          </div>    
        </div>
          <div class="modelWindow__settings">
            <div class="settings__title">Характеристики</div>
            <div class="settings__table">
              <div class="row">
                <div class="cell">Номер помещения</div>
                <div class="cell">{{ apartment.number }}</div>
              </div>
              <div class="row">
                <div class="cell">Подъезд</div>
                <div class="cell">{{ apartment.entrance_name }}</div>
              </div>
              <div class="row">
                <div class="cell">Этаж</div>
                <div class="cell">{{ apartment.floor }}</div>
              </div>
              <div class="row">
                <div class="cell">Название дома</div>
                <div class="cell">{{ apartment.house_name }}</div>
              </div>
              <div class="row">
                <div class="cell">Название ЖК</div>
                <div class="cell">{{ apartment.complex_name }}</div>
              </div>
              <div class="row">
                <div class="cell">Площадь, м2</div>
                <div class="cell">{{ apartment.area }}</div>
              </div>
              <div class="row">
                <div class="cell">Отделка</div>
                <div class="cell">{{ getDecoration(apartment.decoration_id) }}</div>
              </div>
              <div class="row">
                <div class="cell">Куда выходят окна</div>
                <div class="cell">
                  {{ getWindowsPlacement(apartment.windows_placement_id) }}
                </div>
              </div>
              <div class="row">
                <div class="cell">Высота потолков</div>
                <div class="cell">{{ apartment.ceiling_height }}</div>
              </div>
              <div class="row">
                <div class="cell">Наличие Парковки</div>
                <div class="cell">
                  {{ apartment.house_parking ? apartment.house_parking : "Нет" }}
                </div>
              </div>
              <div class="row">
                <div class="cell">Охрана</div>
                <div class="cell">
                  {{ apartment.house_security ? "Да" : "Нет" }}
                </div>
              </div>
              <div class="row">
                <div class="cell">Огороженная территория</div>
                <div class="cell">
                  {{ apartment.house_fenced_area ? "Да" : "Нет" }}
                </div>
              </div>
              <div class="row">
                <div class="cell">Спортивная площадка</div>
                <div class="cell">
                  {{ apartment.house_sports_ground ? "Да" : "Нет" }}
                </div>
              </div>
              <div class="row">
                <div class="cell">Детская площадка</div>
                <div class="cell">
                  {{ apartment.house_play_ground ? "Да" : "Нет" }}
                </div>
              </div>
              <div class="row">
                <div class="cell">Школа</div>
                <div class="cell">{{ apartment.house_school ? "Да" : "Нет" }}</div>
              </div>
              <div class="row">
                <div class="cell">Детский сад</div>
                <div class="cell">
                  {{ apartment.house_kinder_garten ? "Да" : "Нет" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="apartment.plan_url"
          class="modelWindow__fullImage"
          :class="openFullImage ? 'open' : ''"
        >
          <img :src="apartment.plan_url" alt="" class="" />
          <div
            v-if="apartment.has_light_angle"
          >
            <div class="cell">
              <img
                style="width: 100px"
                :src="require('@/shared/assets/images/said.png')"
                alt=""
                :style="`transform: rotate(${apartment.light_angle}deg)`"
              />
            </div>
          </div>
        </div>
        <div
          class="modelWindow__fullPlan window-chess-floor"
          :class="openFullPlan ? 'open' : ''"
        >
          <ChessFloors
            v-if="props.apartment.figures && openFullPlan"
            :house_name="house_name"
            :complex_name="complex_name"
            :filters="filters"
            :custom-figures="props.apartment.figures"
            :list-floor-is-show="false"
            :cardinal-directions-is-show="false"
            canvasId="apartmentPlan"
          />
        </div>
      </template>
      <template #tab-1>
        <div class="modelWindow__content">
          <div class="modelWindow__head">
            <div class="modelWindow__title mr-auto text-3xl">
              Отчет по рекламе
            </div>
          </div>
          <div class="modelWindow__info_box">
            <div class="modelWindow__info">
              Общее количество просмотров {{ apartment.advStat.allViews }}
            </div>
          </div>
          <div class="modelWindow__settings">
            <div class="settings__title" v-if="props.apartment.ads_avito_url">Статистика размещения <a style="border-bottom: 1px solid" :href="`${props.apartment.ads_avito_url}`" target="_blank">Авито</a>&nbsp;<img v-if="props.apartment.ads_avito_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_avito_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__title" v-else>Статистика размещения Авито&nbsp;<img v-if="props.apartment.ads_avito_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_avito_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__table" v-if="props.apartment.add_to_avito_feed">
              <div class="row">
                <div class="cell">Просмотров объявления</div>
                <div class="cell">{{ apartment.advStat.avito.views }}</div>
              </div>
              <div class="row">
                <div class="cell">Просмотров контактов</div>
                <div class="cell">{{ apartment.advStat.avito.contacts }}</div>
              </div>
              <div class="row">
                <div class="cell">Добавили в избранное</div>
                <div class="cell">{{ apartment.advStat.avito.favorites }}</div>
              </div>
              <div class="row">
                <div class="cell">Звонков с сайта</div>
                <div class="cell">{{ apartment.advStat.avito.calls }}</div>
              </div>
            </div>
            <div v-else>
              Объект не размещается через XML-фид
            </div>
          </div>
          <br/>
          <div class="modelWindow__settings">
            <div class="settings__title" v-if="props.apartment.ads_cian_url">Статистика размещения <a style="border-bottom: 1px solid" :href="`${props.apartment.ads_cian_url}`" target="_blank">Циан</a>&nbsp;<img v-if="props.apartment.ads_cian_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_cian_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__title" v-else>Статистика размещения Циан&nbsp;<img v-if="props.apartment.ads_cian_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_cian_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__table" v-if="props.apartment.add_to_cian_feed">
              <div class="row">
                <div class="cell">Просмотров объявления</div>
                <div class="cell">{{ apartment.advStat.cian.views }}</div>
              </div>
              <div class="row">
                <div class="cell">Просмотров контактов</div>
                <div class="cell">{{ apartment.advStat.cian.contacts }}</div>
              </div>
              <div class="row">
                <div class="cell">Добавили в избранное</div>
                <div class="cell">{{ apartment.advStat.cian.favorites }}</div>
              </div>
              <div class="row">
                <div class="cell">Звонков с сайта</div>
                <div class="cell">{{ apartment.advStat.cian.calls }}</div>
              </div>
            </div>
            <div v-else>
              Объект не размещается через XML-фид
            </div>
          </div>
          <br/>
          <div class="modelWindow__settings">
            <div class="settings__title" v-if="props.apartment.ads_yandex_url">Статистика размещения <a style="border-bottom: 1px solid" :href="`${props.apartment.ads_yandex_url}`" target="_blank">Яндекс</a>&nbsp;<img v-if="props.apartment.ads_yandex_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_yandex_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__title" v-else>Статистика размещения Яндекс&nbsp;<img v-if="props.apartment.ads_yandex_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_yandex_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__table" v-if="props.apartment.add_to_yandex_feed">
              <div class="row">
                <div class="cell">Просмотров объявления</div>
                <div class="cell">{{ apartment.advStat.yandex.views }}</div>
              </div>
              <div class="row">
                <div class="cell">Просмотров контактов</div>
                <div class="cell">{{ apartment.advStat.yandex.contacts }}</div>
              </div>
              <div class="row">
                <div class="cell">Добавили в избранное</div>
                <div class="cell">{{ apartment.advStat.yandex.favorites }}</div>
              </div>
              <div class="row">
                <div class="cell">Звонков с сайта</div>
                <div class="cell">{{ apartment.advStat.yandex.calls }}</div>
              </div>
            </div>
            <div v-else>
              Объект не размещается через XML-фид
            </div>
          </div>
          <br/>
          <div class="modelWindow__settings">
            <div class="settings__title" v-if="props.apartment.ads_domclick_url">Статистика размещения <a style="border-bottom: 1px solid" :href="`${props.apartment.ads_domclick_url}`" target="_blank">ДомКлик</a>&nbsp;<img v-if="props.apartment.ads_domclick_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_domclick_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__title" v-else>Статистика размещения ДомКлик&nbsp;<img v-if="props.apartment.ads_domclick_error" src="@/shared/assets/images/warning.png" alt="" v-tooltip.bottom="{
                          value: `<div>${props.apartment.ads_domclick_error}</div>`,
                          escape: true,
                          hideDelay: 2000,
                          pt: {
                            text: {
                              class: [
                                '!border !border-red !bg-white !text-black !h-auto !whitespace-normal !w-max',
                                ' !p-2.5 !break-normal',
                              ],
                            },
                            arrow: {
                              class: ['!border-t-red'],
                            },
                          },
                        }"/></div>
            <div class="settings__table" v-if="props.apartment.add_to_domclick_feed">
              <div class="row">
                <div class="cell">Просмотров объявления</div>
                <div class="cell">{{ apartment.advStat.domclick.views }}</div>
              </div>
              <div class="row">
                <div class="cell">Просмотров контактов</div>
                <div class="cell">{{ apartment.advStat.domclick.contacts }}</div>
              </div>
              <div class="row">
                <div class="cell">Добавили в избранное</div>
                <div class="cell">{{ apartment.advStat.domclick.favorites }}</div>
              </div>
              <div class="row">
                <div class="cell">Звонков с сайта</div>
                <div class="cell">{{ apartment.advStat.domclick.calls }}</div>
              </div>
            </div>
            <div v-else>
              Объект не размещается через XML-фид
            </div>
          </div>
          <br/>
          <br/>
          <div style="color: #9e9e9e;font-size: 13px;">
            <img src="@/shared/assets/images/info.png" alt="" style="height: 13px;"/>&nbsp;Статистика от Авито, Циан, ДомКлик и Яндекс обновляется раз в 1 час.
          </div>
        </div>
      </template>
      <template #tab-2>
          <draggable
              :list="reservations"
              ghost-class="ghost"
              handle=".handle"
              group="reservations"
              animation="200"
              @end="onDragEnd"
              class="dragDrop"
          >
              <template #item="{ element }">
                  <transition-group :data-id="element.id" type="transition" name="flip-list" tag="div" class="item-reservation-box">
                      <section
                          :key="`reservation-${element.id}`"
                          :data-id="element.id"
                          class="item-reservation"
                      >
                          <div class="employee-info-top">
                              <div class="employee-header">
                                  <p class="e-reservation-buttons">
                                      <span class="e-reservation-id-box">
                                        ID {{ element.id }}
                                      </span>
                                      <span v-if="element.can_read_details" @click="handleOpenReservation(element.id, apartment.id, apartment.type, apartment.number)" class="e-reservation-details-button">
                                        Подробнее
                                      </span>
                                  </p>
                                  <h5 class="employee-info-fio">
                                    Ответственный: {{ element.responsible_last_name }} {{ element.responsible_first_name }} {{ element.responsible_middle_name }}
                                  </h5>
                              </div>
                              <div
                                v-if="canChangeQueue"  
                                class="handle-icon-block"
                              >
                                  <div class="item-icon trash">
                                      <div @click="removeFromQueue(element.id)" class="trash-box" title="Исключить из очереди">
                                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 25 25" version="1.1">
                                              <g id="surface1">
                                              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 10.460938 3.347656 C 10.507812 3.347656 10.558594 3.347656 10.609375 3.347656 C 10.769531 3.347656 10.929688 3.347656 11.089844 3.347656 C 11.203125 3.347656 11.316406 3.347656 11.429688 3.347656 C 11.664062 3.347656 11.898438 3.347656 12.136719 3.347656 C 12.4375 3.347656 12.738281 3.347656 13.039062 3.34375 C 13.269531 3.34375 13.503906 3.34375 13.734375 3.34375 C 13.847656 3.34375 13.957031 3.34375 14.066406 3.34375 C 14.222656 3.34375 14.378906 3.34375 14.535156 3.34375 C 14.578125 3.34375 14.625 3.34375 14.671875 3.34375 C 15.019531 3.347656 15.273438 3.433594 15.539062 3.65625 C 15.566406 3.6875 15.589844 3.71875 15.617188 3.75 C 15.660156 3.796875 15.660156 3.796875 15.699219 3.84375 C 15.894531 4.152344 15.882812 4.476562 15.875 4.832031 C 15.875 4.878906 15.875 4.925781 15.875 4.972656 C 15.871094 5.089844 15.871094 5.207031 15.867188 5.320312 C 15.902344 5.320312 15.9375 5.320312 15.972656 5.320312 C 16.300781 5.316406 16.628906 5.316406 16.953125 5.316406 C 17.121094 5.3125 17.289062 5.3125 17.457031 5.3125 C 17.652344 5.308594 17.84375 5.308594 18.039062 5.308594 C 18.097656 5.308594 18.15625 5.304688 18.21875 5.304688 C 18.636719 5.304688 19.03125 5.335938 19.355469 5.628906 C 19.386719 5.65625 19.414062 5.683594 19.445312 5.710938 C 19.699219 6.003906 19.699219 6.28125 19.699219 6.648438 C 19.699219 6.703125 19.699219 6.753906 19.699219 6.808594 C 19.699219 6.917969 19.699219 7.03125 19.699219 7.140625 C 19.699219 7.308594 19.699219 7.476562 19.703125 7.648438 C 19.703125 7.753906 19.703125 7.863281 19.703125 7.96875 C 19.703125 8.019531 19.703125 8.070312 19.703125 8.121094 C 19.703125 8.167969 19.703125 8.214844 19.703125 8.265625 C 19.703125 8.328125 19.703125 8.328125 19.703125 8.390625 C 19.675781 8.496094 19.675781 8.496094 19.605469 8.574219 C 19.421875 8.675781 19.257812 8.660156 19.054688 8.652344 C 18.996094 8.652344 18.996094 8.652344 18.9375 8.648438 C 18.84375 8.648438 18.746094 8.644531 18.652344 8.640625 C 18.652344 8.730469 18.652344 8.730469 18.652344 8.820312 C 18.65625 10.226562 18.65625 11.632812 18.65625 13.039062 C 18.65625 13.214844 18.65625 13.386719 18.65625 13.558594 C 18.65625 13.613281 18.65625 13.613281 18.65625 13.664062 C 18.660156 14.222656 18.660156 14.78125 18.660156 15.335938 C 18.660156 15.910156 18.660156 16.484375 18.660156 17.054688 C 18.660156 17.378906 18.660156 17.699219 18.664062 18.019531 C 18.664062 18.324219 18.664062 18.625 18.664062 18.929688 C 18.664062 19.039062 18.664062 19.148438 18.664062 19.261719 C 18.664062 19.414062 18.664062 19.566406 18.664062 19.71875 C 18.664062 19.78125 18.664062 19.78125 18.664062 19.847656 C 18.664062 20.355469 18.578125 20.785156 18.261719 21.191406 C 17.925781 21.515625 17.570312 21.652344 17.109375 21.652344 C 17.070312 21.652344 17.027344 21.652344 16.984375 21.652344 C 16.847656 21.652344 16.714844 21.652344 16.578125 21.652344 C 16.476562 21.652344 16.378906 21.652344 16.28125 21.652344 C 16.015625 21.65625 15.75 21.65625 15.484375 21.65625 C 15.316406 21.65625 15.148438 21.65625 14.984375 21.65625 C 14.402344 21.65625 13.820312 21.65625 13.238281 21.65625 C 12.695312 21.65625 12.15625 21.660156 11.613281 21.660156 C 11.148438 21.664062 10.683594 21.664062 10.21875 21.664062 C 9.941406 21.664062 9.664062 21.664062 9.386719 21.667969 C 9.125 21.667969 8.863281 21.667969 8.601562 21.667969 C 8.503906 21.667969 8.410156 21.667969 8.3125 21.667969 C 7.738281 21.671875 7.246094 21.65625 6.789062 21.253906 C 6.378906 20.832031 6.339844 20.292969 6.339844 19.734375 C 6.339844 19.6875 6.339844 19.640625 6.339844 19.589844 C 6.339844 19.429688 6.34375 19.273438 6.34375 19.113281 C 6.34375 19 6.34375 18.886719 6.34375 18.773438 C 6.34375 18.460938 6.34375 18.152344 6.34375 17.84375 C 6.34375 17.554688 6.34375 17.261719 6.34375 16.972656 C 6.34375 16.394531 6.34375 15.820312 6.34375 15.246094 C 6.34375 14.6875 6.34375 14.128906 6.34375 13.566406 C 6.34375 13.515625 6.34375 13.515625 6.34375 13.464844 C 6.34375 13.289062 6.34375 13.117188 6.34375 12.945312 C 6.347656 11.511719 6.347656 10.078125 6.347656 8.640625 C 6.289062 8.644531 6.230469 8.644531 6.171875 8.648438 C 6.097656 8.648438 6.019531 8.652344 5.945312 8.652344 C 5.90625 8.652344 5.867188 8.652344 5.828125 8.65625 C 5.546875 8.660156 5.546875 8.660156 5.394531 8.574219 C 5.296875 8.46875 5.296875 8.410156 5.296875 8.265625 C 5.296875 8.21875 5.292969 8.171875 5.292969 8.125 C 5.292969 8.074219 5.292969 8.023438 5.292969 7.972656 C 5.292969 7.921875 5.292969 7.867188 5.292969 7.816406 C 5.292969 7.703125 5.292969 7.59375 5.292969 7.484375 C 5.292969 7.316406 5.292969 7.148438 5.292969 6.980469 C 5.292969 6.875 5.292969 6.765625 5.292969 6.660156 C 5.289062 6.609375 5.289062 6.558594 5.289062 6.507812 C 5.292969 6.125 5.402344 5.902344 5.652344 5.613281 C 5.675781 5.59375 5.703125 5.570312 5.726562 5.546875 C 5.753906 5.527344 5.777344 5.503906 5.804688 5.480469 C 6.15625 5.277344 6.5625 5.308594 6.957031 5.3125 C 7.019531 5.3125 7.082031 5.3125 7.144531 5.3125 C 7.308594 5.3125 7.472656 5.316406 7.636719 5.316406 C 7.808594 5.316406 7.976562 5.316406 8.144531 5.316406 C 8.472656 5.320312 8.800781 5.320312 9.128906 5.320312 C 9.128906 5.292969 9.128906 5.265625 9.128906 5.234375 C 9.125 5.101562 9.125 4.96875 9.121094 4.832031 C 9.121094 4.789062 9.121094 4.742188 9.117188 4.695312 C 9.113281 4.3125 9.171875 3.992188 9.4375 3.695312 C 9.460938 3.664062 9.488281 3.632812 9.515625 3.601562 C 9.804688 3.359375 10.097656 3.347656 10.460938 3.347656 Z M 9.960938 4.199219 C 9.792969 4.496094 9.792969 4.496094 9.863281 5.320312 C 11.601562 5.320312 13.34375 5.320312 15.136719 5.320312 C 15.214844 4.480469 15.214844 4.480469 14.988281 4.148438 C 14.753906 4.035156 14.523438 4.039062 14.265625 4.039062 C 14.222656 4.039062 14.179688 4.039062 14.136719 4.039062 C 14 4.039062 13.859375 4.039062 13.71875 4.039062 C 13.621094 4.039062 13.523438 4.039062 13.425781 4.039062 C 13.222656 4.035156 13.019531 4.035156 12.816406 4.039062 C 12.554688 4.039062 12.296875 4.035156 12.035156 4.035156 C 11.832031 4.035156 11.632812 4.035156 11.433594 4.035156 C 11.335938 4.035156 11.238281 4.035156 11.144531 4.035156 C 11.007812 4.035156 10.875 4.035156 10.742188 4.035156 C 10.699219 4.035156 10.660156 4.035156 10.621094 4.035156 C 10.367188 4.035156 10.183594 4.074219 9.960938 4.199219 Z M 6.101562 6.199219 C 5.890625 6.730469 6.003906 7.339844 6.003906 7.910156 C 10.292969 7.910156 14.578125 7.910156 18.992188 7.910156 C 19.101562 6.609375 19.101562 6.609375 18.847656 6.152344 C 18.710938 6.054688 18.601562 6.042969 18.4375 6.042969 C 18.394531 6.042969 18.351562 6.042969 18.304688 6.042969 C 18.257812 6.042969 18.210938 6.042969 18.164062 6.042969 C 18.113281 6.042969 18.0625 6.042969 18.011719 6.042969 C 17.84375 6.039062 17.671875 6.042969 17.503906 6.042969 C 17.382812 6.042969 17.261719 6.039062 17.140625 6.039062 C 16.847656 6.039062 16.554688 6.039062 16.257812 6.039062 C 16.019531 6.039062 15.78125 6.039062 15.539062 6.039062 C 15.488281 6.039062 15.488281 6.039062 15.4375 6.039062 C 15.367188 6.039062 15.296875 6.039062 15.230469 6.039062 C 14.582031 6.039062 13.933594 6.039062 13.28125 6.039062 C 12.6875 6.039062 12.09375 6.039062 11.5 6.039062 C 10.890625 6.039062 10.28125 6.035156 9.671875 6.035156 C 9.332031 6.035156 8.988281 6.035156 8.644531 6.035156 C 8.324219 6.035156 8.003906 6.035156 7.679688 6.035156 C 7.5625 6.035156 7.445312 6.035156 7.328125 6.035156 C 7.164062 6.035156 7.003906 6.035156 6.84375 6.035156 C 6.773438 6.035156 6.773438 6.035156 6.699219 6.035156 C 6.375 6.035156 6.375 6.035156 6.101562 6.199219 Z M 7.078125 8.640625 C 7.074219 10.691406 7.074219 10.691406 7.074219 12.738281 C 7.074219 13.011719 7.074219 13.289062 7.070312 13.566406 C 7.070312 13.601562 7.070312 13.632812 7.070312 13.671875 C 7.070312 14.230469 7.070312 14.785156 7.070312 15.34375 C 7.066406 15.917969 7.066406 16.492188 7.066406 17.066406 C 7.066406 17.386719 7.066406 17.707031 7.066406 18.03125 C 7.0625 18.332031 7.0625 18.636719 7.0625 18.9375 C 7.0625 19.050781 7.0625 19.160156 7.0625 19.273438 C 7.0625 19.425781 7.0625 19.578125 7.0625 19.730469 C 7.0625 19.773438 7.0625 19.816406 7.0625 19.863281 C 7.0625 20.207031 7.113281 20.488281 7.359375 20.746094 C 7.644531 20.929688 7.921875 20.960938 8.25 20.960938 C 8.289062 20.960938 8.328125 20.960938 8.367188 20.960938 C 8.492188 20.960938 8.617188 20.960938 8.746094 20.960938 C 8.835938 20.960938 8.925781 20.960938 9.015625 20.960938 C 9.261719 20.960938 9.507812 20.960938 9.753906 20.960938 C 9.960938 20.960938 10.164062 20.960938 10.371094 20.960938 C 10.855469 20.964844 11.339844 20.964844 11.828125 20.960938 C 12.328125 20.960938 12.828125 20.964844 13.328125 20.964844 C 13.757812 20.964844 14.1875 20.964844 14.617188 20.964844 C 14.871094 20.964844 15.128906 20.964844 15.382812 20.964844 C 15.625 20.964844 15.867188 20.964844 16.109375 20.964844 C 16.195312 20.964844 16.285156 20.964844 16.375 20.964844 C 17.050781 20.996094 17.050781 20.996094 17.65625 20.738281 C 17.933594 20.4375 17.933594 20.074219 17.933594 19.6875 C 17.933594 19.640625 17.933594 19.59375 17.933594 19.542969 C 17.933594 19.386719 17.929688 19.226562 17.929688 19.070312 C 17.929688 18.957031 17.929688 18.84375 17.929688 18.730469 C 17.929688 18.421875 17.929688 18.113281 17.929688 17.804688 C 17.929688 17.515625 17.929688 17.226562 17.929688 16.9375 C 17.929688 16.363281 17.929688 15.789062 17.925781 15.21875 C 17.925781 14.660156 17.925781 14.105469 17.925781 13.546875 C 17.925781 13.496094 17.925781 13.496094 17.925781 13.441406 C 17.925781 13.140625 17.925781 12.839844 17.925781 12.535156 C 17.921875 11.238281 17.921875 9.941406 17.917969 8.640625 C 14.34375 8.640625 10.765625 8.640625 7.078125 8.640625 Z M 7.078125 8.640625 "/>
                                              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 9.523438 10.859375 C 9.703125 10.894531 9.753906 10.941406 9.863281 11.085938 C 9.886719 11.222656 9.886719 11.222656 9.886719 11.386719 C 9.886719 11.449219 9.890625 11.511719 9.890625 11.578125 C 9.890625 11.648438 9.886719 11.714844 9.886719 11.785156 C 9.886719 11.859375 9.886719 11.929688 9.886719 12.003906 C 9.890625 12.203125 9.890625 12.398438 9.886719 12.597656 C 9.886719 12.804688 9.886719 13.011719 9.886719 13.21875 C 9.886719 13.566406 9.886719 13.914062 9.886719 14.261719 C 9.882812 14.664062 9.882812 15.066406 9.886719 15.46875 C 9.886719 15.855469 9.886719 16.242188 9.886719 16.628906 C 9.882812 16.792969 9.882812 16.957031 9.882812 17.121094 C 9.886719 17.316406 9.882812 17.507812 9.882812 17.703125 C 9.882812 17.773438 9.882812 17.84375 9.882812 17.917969 C 9.882812 18.015625 9.882812 18.109375 9.882812 18.207031 C 9.882812 18.261719 9.882812 18.316406 9.882812 18.371094 C 9.863281 18.507812 9.863281 18.507812 9.796875 18.59375 C 9.671875 18.683594 9.574219 18.695312 9.421875 18.703125 C 9.199219 18.597656 9.199219 18.597656 9.132812 18.457031 C 9.125 18.359375 9.125 18.265625 9.125 18.167969 C 9.121094 18.109375 9.121094 18.046875 9.121094 17.984375 C 9.121094 17.914062 9.121094 17.847656 9.121094 17.777344 C 9.121094 17.707031 9.121094 17.632812 9.121094 17.5625 C 9.117188 17.324219 9.117188 17.089844 9.117188 16.855469 C 9.117188 16.773438 9.117188 16.691406 9.117188 16.609375 C 9.117188 16.273438 9.113281 15.933594 9.113281 15.597656 C 9.113281 15.113281 9.113281 14.628906 9.109375 14.144531 C 9.105469 13.804688 9.105469 13.460938 9.105469 13.121094 C 9.105469 12.917969 9.105469 12.714844 9.105469 12.511719 C 9.101562 12.320312 9.101562 12.128906 9.101562 11.9375 C 9.101562 11.867188 9.101562 11.796875 9.101562 11.726562 C 9.101562 11.632812 9.101562 11.535156 9.101562 11.441406 C 9.101562 11.386719 9.101562 11.332031 9.101562 11.277344 C 9.152344 11.039062 9.285156 10.90625 9.523438 10.859375 Z M 9.523438 10.859375 "/>
                                              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 15.476562 10.859375 C 15.675781 10.898438 15.742188 10.976562 15.867188 11.132812 C 15.898438 11.277344 15.898438 11.277344 15.898438 11.4375 C 15.898438 11.5 15.902344 11.5625 15.902344 11.625 C 15.902344 11.695312 15.898438 11.761719 15.898438 11.828125 C 15.898438 11.902344 15.898438 11.972656 15.898438 12.046875 C 15.902344 12.242188 15.898438 12.433594 15.898438 12.628906 C 15.898438 12.835938 15.898438 13.039062 15.898438 13.242188 C 15.898438 13.585938 15.898438 13.925781 15.894531 14.269531 C 15.894531 14.664062 15.894531 15.0625 15.894531 15.457031 C 15.894531 15.839844 15.894531 16.21875 15.890625 16.601562 C 15.890625 16.761719 15.890625 16.925781 15.890625 17.085938 C 15.890625 17.277344 15.890625 17.46875 15.890625 17.660156 C 15.890625 17.730469 15.890625 17.800781 15.890625 17.871094 C 15.890625 17.964844 15.890625 18.0625 15.886719 18.15625 C 15.886719 18.210938 15.886719 18.265625 15.886719 18.320312 C 15.867188 18.476562 15.832031 18.542969 15.722656 18.652344 C 15.542969 18.710938 15.464844 18.71875 15.292969 18.636719 C 15.1875 18.554688 15.1875 18.554688 15.136719 18.457031 C 15.132812 18.359375 15.128906 18.261719 15.128906 18.167969 C 15.128906 18.105469 15.128906 18.042969 15.128906 17.980469 C 15.128906 17.910156 15.128906 17.839844 15.128906 17.773438 C 15.128906 17.699219 15.128906 17.628906 15.128906 17.554688 C 15.125 17.359375 15.125 17.160156 15.125 16.964844 C 15.125 16.84375 15.125 16.71875 15.125 16.597656 C 15.125 16.210938 15.121094 15.828125 15.121094 15.441406 C 15.121094 15 15.121094 14.554688 15.117188 14.109375 C 15.117188 13.769531 15.117188 13.425781 15.117188 13.082031 C 15.117188 12.878906 15.117188 12.671875 15.113281 12.46875 C 15.113281 12.273438 15.113281 12.082031 15.113281 11.890625 C 15.113281 11.816406 15.113281 11.746094 15.113281 11.675781 C 15.113281 11.578125 15.113281 11.484375 15.113281 11.386719 C 15.113281 11.332031 15.113281 11.277344 15.113281 11.222656 C 15.152344 11 15.257812 10.902344 15.476562 10.859375 Z M 15.476562 10.859375 "/>
                                              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 12.5 10.863281 C 12.683594 10.894531 12.730469 10.941406 12.84375 11.085938 C 12.867188 11.222656 12.867188 11.222656 12.867188 11.386719 C 12.867188 11.449219 12.867188 11.511719 12.867188 11.578125 C 12.867188 11.644531 12.867188 11.714844 12.867188 11.785156 C 12.867188 11.855469 12.867188 11.929688 12.867188 12.003906 C 12.871094 12.199219 12.871094 12.398438 12.871094 12.597656 C 12.871094 12.761719 12.871094 12.925781 12.871094 13.089844 C 12.871094 13.480469 12.871094 13.871094 12.871094 14.257812 C 12.867188 14.660156 12.871094 15.0625 12.871094 15.464844 C 12.871094 15.808594 12.875 16.152344 12.871094 16.5 C 12.871094 16.703125 12.871094 16.910156 12.875 17.117188 C 12.875 17.308594 12.875 17.503906 12.871094 17.699219 C 12.871094 17.769531 12.871094 17.839844 12.875 17.910156 C 12.875 18.007812 12.875 18.105469 12.871094 18.203125 C 12.871094 18.257812 12.871094 18.308594 12.871094 18.367188 C 12.84375 18.507812 12.84375 18.507812 12.726562 18.621094 C 12.597656 18.703125 12.597656 18.703125 12.445312 18.699219 C 12.296875 18.648438 12.25 18.628906 12.15625 18.507812 C 12.140625 18.371094 12.140625 18.371094 12.140625 18.207031 C 12.140625 18.144531 12.136719 18.082031 12.136719 18.019531 C 12.136719 17.949219 12.136719 17.878906 12.136719 17.8125 C 12.136719 17.738281 12.136719 17.664062 12.136719 17.59375 C 12.136719 17.394531 12.136719 17.195312 12.136719 17 C 12.136719 16.832031 12.136719 16.667969 12.136719 16.503906 C 12.136719 16.113281 12.136719 15.722656 12.136719 15.335938 C 12.136719 14.933594 12.136719 14.53125 12.136719 14.128906 C 12.132812 13.785156 12.132812 13.4375 12.132812 13.09375 C 12.132812 12.886719 12.132812 12.679688 12.132812 12.476562 C 12.132812 12.28125 12.132812 12.085938 12.132812 11.894531 C 12.132812 11.820312 12.132812 11.75 12.132812 11.679688 C 12.132812 11.582031 12.132812 11.484375 12.132812 11.386719 C 12.132812 11.332031 12.132812 11.28125 12.132812 11.222656 C 12.171875 11 12.277344 10.902344 12.5 10.863281 Z M 12.5 10.863281 "/>
                                              </g>
                                          </svg>
                                      </div>
                                  </div>
                                  <div class="item-icon handle" title="Изменить очередь">
                                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 25 25" version="1.1">
                                          <g id="surface1">
                                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 7.703125 10.6875 C 7.761719 10.6875 7.824219 10.6875 7.886719 10.6875 C 7.953125 10.6875 8.019531 10.6875 8.085938 10.6875 C 8.160156 10.6875 8.230469 10.683594 8.300781 10.683594 C 8.496094 10.683594 8.695312 10.683594 8.890625 10.683594 C 9.101562 10.683594 9.3125 10.683594 9.523438 10.683594 C 10.035156 10.679688 10.546875 10.679688 11.058594 10.679688 C 11.203125 10.679688 11.347656 10.679688 11.488281 10.679688 C 12.386719 10.679688 13.28125 10.675781 14.175781 10.675781 C 14.382812 10.675781 14.589844 10.675781 14.796875 10.675781 C 14.851562 10.675781 14.902344 10.675781 14.953125 10.675781 C 15.789062 10.675781 16.625 10.675781 17.460938 10.671875 C 18.320312 10.667969 19.175781 10.667969 20.03125 10.667969 C 20.515625 10.667969 20.996094 10.667969 21.476562 10.667969 C 21.886719 10.664062 22.296875 10.664062 22.707031 10.664062 C 22.917969 10.664062 23.125 10.664062 23.335938 10.664062 C 23.527344 10.664062 23.71875 10.664062 23.910156 10.664062 C 23.980469 10.664062 24.050781 10.664062 24.117188 10.664062 C 24.703125 10.65625 24.703125 10.65625 24.894531 10.808594 C 25.023438 10.964844 25.035156 11.046875 25.039062 11.25 C 25.039062 11.308594 25.039062 11.371094 25.039062 11.433594 C 25.039062 11.503906 25.039062 11.570312 25.039062 11.636719 C 25.039062 11.707031 25.039062 11.773438 25.039062 11.84375 C 25.039062 11.988281 25.039062 12.132812 25.039062 12.277344 C 25.035156 12.460938 25.039062 12.648438 25.039062 12.832031 C 25.039062 12.976562 25.039062 13.117188 25.039062 13.261719 C 25.039062 13.328125 25.039062 13.398438 25.039062 13.464844 C 25.039062 13.5625 25.039062 13.65625 25.039062 13.75 C 25.039062 13.804688 25.039062 13.859375 25.039062 13.917969 C 24.996094 14.078125 24.941406 14.152344 24.8125 14.253906 C 24.570312 14.375 24.28125 14.339844 24.015625 14.335938 C 23.945312 14.335938 23.875 14.339844 23.804688 14.339844 C 23.605469 14.339844 23.410156 14.339844 23.214844 14.335938 C 23.003906 14.335938 22.792969 14.339844 22.582031 14.339844 C 22.167969 14.339844 21.753906 14.339844 21.339844 14.339844 C 21.003906 14.335938 20.667969 14.335938 20.328125 14.335938 C 20.28125 14.335938 20.234375 14.335938 20.183594 14.335938 C 20.085938 14.335938 19.992188 14.335938 19.894531 14.335938 C 19.03125 14.339844 18.171875 14.335938 17.3125 14.335938 C 16.480469 14.335938 15.644531 14.335938 14.808594 14.335938 C 13.902344 14.335938 12.992188 14.335938 12.082031 14.335938 C 11.988281 14.335938 11.890625 14.335938 11.792969 14.335938 C 11.746094 14.335938 11.699219 14.335938 11.648438 14.335938 C 11.3125 14.335938 10.976562 14.335938 10.640625 14.335938 C 10.230469 14.335938 9.820312 14.335938 9.410156 14.332031 C 9.203125 14.332031 8.992188 14.332031 8.785156 14.332031 C 8.59375 14.332031 8.402344 14.332031 8.210938 14.332031 C 8.140625 14.332031 8.074219 14.332031 8.003906 14.332031 C 7.910156 14.332031 7.816406 14.332031 7.722656 14.332031 C 7.667969 14.332031 7.617188 14.332031 7.5625 14.332031 C 7.386719 14.300781 7.304688 14.234375 7.179688 14.113281 C 7.113281 13.980469 7.121094 13.875 7.121094 13.730469 C 7.121094 13.667969 7.117188 13.609375 7.117188 13.546875 C 7.117188 13.480469 7.117188 13.417969 7.117188 13.351562 C 7.117188 13.316406 7.117188 13.285156 7.117188 13.25 C 7.117188 13.074219 7.113281 12.902344 7.113281 12.726562 C 7.113281 12.546875 7.113281 12.367188 7.109375 12.183594 C 7.109375 12.046875 7.109375 11.90625 7.109375 11.769531 C 7.109375 11.703125 7.109375 11.636719 7.105469 11.570312 C 7.105469 11.476562 7.105469 11.382812 7.105469 11.289062 C 7.105469 11.238281 7.105469 11.183594 7.105469 11.128906 C 7.132812 10.953125 7.199219 10.871094 7.324219 10.742188 C 7.457031 10.675781 7.554688 10.6875 7.703125 10.6875 Z M 7.703125 10.6875 "/>
                                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 7.804688 17.816406 C 7.863281 17.816406 7.925781 17.816406 7.984375 17.816406 C 8.050781 17.816406 8.121094 17.816406 8.1875 17.816406 C 8.257812 17.816406 8.328125 17.816406 8.398438 17.816406 C 8.59375 17.816406 8.789062 17.816406 8.980469 17.8125 C 9.191406 17.8125 9.402344 17.8125 9.609375 17.8125 C 10.070312 17.8125 10.527344 17.8125 10.988281 17.8125 C 11.273438 17.8125 11.558594 17.8125 11.847656 17.8125 C 12.636719 17.8125 13.429688 17.8125 14.222656 17.8125 C 14.273438 17.8125 14.324219 17.8125 14.375 17.8125 C 14.453125 17.8125 14.453125 17.8125 14.53125 17.8125 C 14.632812 17.8125 14.738281 17.8125 14.839844 17.808594 C 14.890625 17.808594 14.941406 17.808594 14.996094 17.808594 C 15.824219 17.808594 16.652344 17.808594 17.480469 17.808594 C 18.332031 17.808594 19.179688 17.804688 20.03125 17.804688 C 20.507812 17.804688 20.984375 17.804688 21.460938 17.804688 C 21.871094 17.804688 22.277344 17.804688 22.683594 17.804688 C 22.890625 17.804688 23.097656 17.804688 23.304688 17.804688 C 23.496094 17.804688 23.683594 17.804688 23.875 17.804688 C 23.941406 17.804688 24.011719 17.804688 24.082031 17.804688 C 24.175781 17.804688 24.265625 17.804688 24.359375 17.804688 C 24.414062 17.804688 24.464844 17.804688 24.519531 17.804688 C 24.679688 17.824219 24.769531 17.871094 24.902344 17.96875 C 25.015625 18.140625 25.011719 18.207031 25.015625 18.410156 C 25.015625 18.472656 25.015625 18.53125 25.015625 18.59375 C 25.019531 18.660156 25.019531 18.726562 25.019531 18.792969 C 25.019531 18.863281 25.019531 18.929688 25.019531 19 C 25.019531 19.140625 25.019531 19.285156 25.019531 19.425781 C 25.019531 19.609375 25.023438 19.792969 25.023438 19.976562 C 25.027344 20.117188 25.027344 20.257812 25.027344 20.398438 C 25.027344 20.464844 25.027344 20.53125 25.027344 20.601562 C 25.03125 20.695312 25.03125 20.789062 25.027344 20.882812 C 25.03125 20.9375 25.03125 20.992188 25.03125 21.046875 C 25 21.195312 24.960938 21.28125 24.851562 21.382812 C 24.617188 21.507812 24.324219 21.46875 24.066406 21.464844 C 23.996094 21.46875 23.925781 21.46875 23.851562 21.46875 C 23.65625 21.46875 23.457031 21.46875 23.261719 21.46875 C 23.050781 21.46875 22.835938 21.46875 22.625 21.46875 C 22.207031 21.46875 21.789062 21.46875 21.375 21.46875 C 21.035156 21.46875 20.695312 21.46875 20.359375 21.46875 C 20.285156 21.46875 20.285156 21.46875 20.210938 21.46875 C 20.113281 21.46875 20.015625 21.46875 19.917969 21.46875 C 19 21.46875 18.085938 21.46875 17.167969 21.46875 C 16.378906 21.464844 15.59375 21.464844 14.804688 21.46875 C 13.890625 21.46875 12.976562 21.46875 12.0625 21.46875 C 11.964844 21.46875 11.867188 21.46875 11.769531 21.46875 C 11.722656 21.46875 11.675781 21.46875 11.625 21.46875 C 11.285156 21.46875 10.949219 21.46875 10.609375 21.46875 C 10.199219 21.46875 9.785156 21.46875 9.375 21.46875 C 9.164062 21.46875 8.953125 21.46875 8.742188 21.46875 C 8.550781 21.46875 8.359375 21.46875 8.167969 21.46875 C 8.097656 21.464844 8.027344 21.46875 7.957031 21.46875 C 7.371094 21.472656 7.371094 21.472656 7.210938 21.320312 C 7.113281 21.164062 7.097656 21.070312 7.097656 20.886719 C 7.097656 20.824219 7.097656 20.761719 7.09375 20.699219 C 7.09375 20.636719 7.097656 20.570312 7.097656 20.503906 C 7.097656 20.433594 7.097656 20.367188 7.097656 20.300781 C 7.09375 20.15625 7.097656 20.015625 7.097656 19.871094 C 7.097656 19.691406 7.097656 19.507812 7.097656 19.324219 C 7.09375 19.183594 7.09375 19.046875 7.097656 18.90625 C 7.097656 18.835938 7.097656 18.769531 7.09375 18.703125 C 7.089844 18.113281 7.089844 18.113281 7.242188 17.953125 C 7.4375 17.828125 7.578125 17.816406 7.804688 17.816406 Z M 7.804688 17.816406 "/>
                                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 8.0625 3.535156 C 8.132812 3.53125 8.203125 3.53125 8.277344 3.53125 C 8.472656 3.53125 8.671875 3.53125 8.867188 3.53125 C 9.078125 3.53125 9.292969 3.53125 9.503906 3.53125 C 9.921875 3.53125 10.339844 3.53125 10.753906 3.53125 C 11.09375 3.53125 11.433594 3.53125 11.769531 3.53125 C 11.820312 3.53125 11.867188 3.53125 11.917969 3.53125 C 12.015625 3.53125 12.113281 3.53125 12.210938 3.53125 C 13.128906 3.53125 14.042969 3.53125 14.960938 3.53125 C 15.75 3.535156 16.535156 3.535156 17.324219 3.53125 C 18.238281 3.53125 19.152344 3.53125 20.066406 3.53125 C 20.164062 3.53125 20.261719 3.53125 20.359375 3.53125 C 20.429688 3.53125 20.429688 3.53125 20.503906 3.53125 C 20.84375 3.53125 21.179688 3.53125 21.519531 3.53125 C 21.929688 3.53125 22.34375 3.53125 22.753906 3.53125 C 22.964844 3.53125 23.175781 3.53125 23.386719 3.53125 C 23.578125 3.53125 23.769531 3.53125 23.960938 3.53125 C 24.03125 3.535156 24.101562 3.53125 24.171875 3.53125 C 24.757812 3.527344 24.757812 3.527344 24.917969 3.679688 C 25.015625 3.835938 25.03125 3.929688 25.03125 4.113281 C 25.03125 4.175781 25.03125 4.238281 25.03125 4.300781 C 25.03125 4.363281 25.03125 4.429688 25.03125 4.496094 C 25.03125 4.566406 25.03125 4.632812 25.03125 4.699219 C 25.03125 4.84375 25.03125 4.984375 25.027344 5.128906 C 25.027344 5.308594 25.027344 5.492188 25.027344 5.675781 C 25.027344 5.816406 25.027344 5.953125 25.027344 6.09375 C 25.027344 6.164062 25.027344 6.230469 25.027344 6.296875 C 25.027344 6.390625 25.027344 6.484375 25.027344 6.578125 C 25.027344 6.660156 25.027344 6.660156 25.023438 6.742188 C 24.992188 6.917969 24.933594 7 24.804688 7.128906 C 24.648438 7.179688 24.539062 7.183594 24.375 7.183594 C 24.3125 7.183594 24.253906 7.183594 24.191406 7.183594 C 24.125 7.183594 24.058594 7.183594 23.992188 7.183594 C 23.921875 7.183594 23.851562 7.183594 23.78125 7.183594 C 23.585938 7.183594 23.390625 7.183594 23.195312 7.1875 C 22.988281 7.1875 22.777344 7.1875 22.566406 7.1875 C 22.109375 7.1875 21.652344 7.1875 21.191406 7.1875 C 20.90625 7.1875 20.621094 7.1875 20.332031 7.1875 C 19.542969 7.1875 18.75 7.1875 17.957031 7.1875 C 17.90625 7.1875 17.855469 7.1875 17.804688 7.1875 C 17.753906 7.1875 17.703125 7.1875 17.648438 7.1875 C 17.546875 7.1875 17.445312 7.1875 17.339844 7.191406 C 17.265625 7.191406 17.265625 7.191406 17.1875 7.191406 C 16.359375 7.191406 15.53125 7.191406 14.703125 7.191406 C 13.851562 7.191406 13 7.195312 12.152344 7.195312 C 11.675781 7.195312 11.199219 7.195312 10.71875 7.195312 C 10.3125 7.195312 9.90625 7.195312 9.5 7.195312 C 9.292969 7.195312 9.085938 7.195312 8.878906 7.195312 C 8.6875 7.195312 8.5 7.195312 8.308594 7.195312 C 8.242188 7.195312 8.171875 7.195312 8.101562 7.195312 C 8.007812 7.195312 7.917969 7.195312 7.824219 7.195312 C 7.746094 7.195312 7.746094 7.195312 7.664062 7.195312 C 7.492188 7.175781 7.375 7.121094 7.226562 7.03125 C 7.113281 6.859375 7.117188 6.792969 7.113281 6.589844 C 7.113281 6.527344 7.113281 6.46875 7.113281 6.40625 C 7.109375 6.339844 7.109375 6.273438 7.109375 6.207031 C 7.109375 6.136719 7.109375 6.070312 7.109375 6 C 7.109375 5.859375 7.109375 5.714844 7.109375 5.574219 C 7.109375 5.390625 7.105469 5.207031 7.105469 5.023438 C 7.101562 4.882812 7.101562 4.742188 7.101562 4.601562 C 7.101562 4.535156 7.101562 4.46875 7.101562 4.398438 C 7.097656 4.304688 7.097656 4.210938 7.101562 4.117188 C 7.097656 4.0625 7.097656 4.007812 7.097656 3.953125 C 7.128906 3.804688 7.167969 3.71875 7.277344 3.617188 C 7.511719 3.492188 7.804688 3.53125 8.0625 3.535156 Z M 8.0625 3.535156 "/>
                                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 4.289062 17.433594 C 4.863281 17.882812 5.253906 18.460938 5.371094 19.1875 C 5.445312 19.960938 5.324219 20.695312 4.832031 21.316406 C 4.328125 21.898438 3.773438 22.257812 3 22.351562 C 2.171875 22.40625 1.546875 22.1875 0.875 21.722656 C 0.429688 21.324219 0.0351562 20.707031 -0.0078125 20.097656 C -0.0351562 18.976562 -0.0351562 18.976562 0.195312 18.507812 C 0.210938 18.46875 0.230469 18.429688 0.246094 18.390625 C 0.582031 17.714844 1.160156 17.296875 1.851562 17.039062 C 2.675781 16.785156 3.59375 16.933594 4.289062 17.433594 Z M 4.289062 17.433594 "/>
                                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 4.515625 3.324219 C 5 3.785156 5.355469 4.414062 5.382812 5.089844 C 5.394531 5.914062 5.246094 6.648438 4.65625 7.265625 C 3.988281 7.875 3.289062 8.097656 2.390625 8.0625 C 1.644531 8.011719 1.03125 7.617188 0.539062 7.078125 C 0.0078125 6.378906 -0.0546875 5.632812 0 4.785156 C 0.113281 4.121094 0.5625 3.53125 1.085938 3.121094 C 2.144531 2.386719 3.550781 2.503906 4.515625 3.324219 Z M 4.515625 3.324219 "/>
                                          <path style=" stroke:none;fill-rule:nonzero;fill:rgb(82.745099%,81.176472%,81.176472%);fill-opacity:1;" d="M 4.296875 10.304688 C 4.871094 10.746094 5.261719 11.335938 5.371094 12.0625 C 5.429688 12.9375 5.289062 13.660156 4.703125 14.34375 C 4.242188 14.828125 3.632812 15.167969 2.957031 15.195312 C 2.085938 15.214844 1.398438 15.039062 0.753906 14.429688 C 0.121094 13.777344 -0.0273438 13.109375 -0.0117188 12.234375 C 0.0117188 11.515625 0.347656 10.9375 0.863281 10.449219 C 1.820312 9.625 3.273438 9.558594 4.296875 10.304688 Z M 4.296875 10.304688 "/>
                                          </g>
                                      </svg>
                                  </div>
                              </div>
                          </div>
                          <div class="employee-info-bottom">
                              <div class="e-email-box">
                                  <p>Email</p>
                                  <p class="e-email">
                                      {{ element.responsible_email }}
                                  </p>
                              </div>
                              <div class="e-phone-box">
                                  <p>Телефон</p>
                                  <p class="e-phone">
                                      {{ element.responsible_phone }}
                                  </p>
                              </div>
                              <div class="e-position-box">
                                  <p>Позиция в очереди на помещение</p>
                                  <p class="e-position" :title="`Позиция ${element.position}`">
                                      {{ element.position }}
                                  </p>
                              </div>
                          </div>
                      </section>
                  </transition-group>
              </template>
          </draggable>
      </template>
      <template #custom-tab>
          <button class="modelWindow__close" @click="emits('update:isOpen'), (openFullImage = false), (openFullPlan = false), (emits('full:plan-state-updated', false))">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M22.8281 20L31.4141 11.4141C32.1953 10.6328 32.1953 9.36719 31.4141 8.58594C30.6328 7.80469 29.3672 7.80469 28.5859 8.58594L20 17.1719L11.4141 8.58594C10.6328 7.80469 9.36719 7.80469 8.58594 8.58594C7.80469 9.36719 7.80469 10.6328 8.58594 11.4141L17.1719 20L8.58594 28.5859C7.80469 29.3672 7.80469 30.6328 8.58594 31.4141C8.97656 31.8047 9.48828 32 10 32C10.5117 32 11.0234 31.8047 11.4141 31.4141L20 22.8281L28.5859 31.4141C28.9766 31.8047 29.4883 32 30 32C30.5117 32 31.0234 31.8047 31.4141 31.4141C32.1953 30.6328 32.1953 29.3672 31.4141 28.5859L22.8281 20Z"
                      fill="#757575" />
              </svg>
          </button>
      </template>
    </Tabs>
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

//import { PTOptions } from "primevue/ts-helpers";
import { useFieldsStore } from "@/app/store/fields";
import useViewFloors from "@/features/useViewFloors";
import api from "@/shared/api";
import { room_types, formatNumber, isErrorStatus, getStatusText, isWaitStatus, isActiveStatus, isSendToAds } from "@/shared/utils/util";
import eventBus from "@/eventBus";

import Tabs from "@/components/Tabs.vue";
import FormAddRoom from "@/widgets/forms/formAddRoom.vue";
import ChessFloors from "@/widgets/homePage/viewHome/chessFloors.vue";
import requestModal from "@/shared/UI/requestModal.vue";


const localTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

const fieldsStore = useFieldsStore()
const isReqOpen = ref(false);

const toast = useToast();
const splitButton = ref();
const openReqModal = () => {
  isReqOpen.value = true
}

const closeReqModal = () => {
  isReqOpen.value = false
}

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

  emits('full:plan-state-updated', openFullPlan.value)
}

onMounted(() => {
  fetchPlanFigures();

  eventBus.$on("apartment-status-changed", handleListenChange);

  eventBus.$on("change-apartment-created-requisition", handleCreatedRequisition);
  eventBus.$on("change-apartment-reservations", handleChangeReservations);

  eventBus.$on('pdf-state-changed', handlePdfStateChanged)
});

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

.request-btn {
    height: 35px;
}

.modelWindow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 0;
    height: 100vh !important;
    z-index: 1000;
    background-color: #ffffff;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: flex-start;
    visibility: hidden;
    transition: 0.5s all ease-in-out;
    overflow: hidden;
    opacity: 0;

    &.open {
        visibility: visible;
        width: 750px;
        transition: 0.5s all ease-in-out;
        opacity: 1;
    }

    &.openFull {
        width: 100%;
    }

    &__content {
        width: 100%;
        height: 100%;
        max-width: 750px;
        padding: 50px;
        overflow-y: scroll;
        overflow-x: hidden;
        border-left: 1px solid #dedede;
        z-index: 99;
        background: white;
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
            object-fit: cover;
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
            object-fit: cover;
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
    }

    .to_send_complexes {
        background-color: #FF3838;
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

    @media screen and (max-width: 1600px) {
        &.open {
            visibility: visible;
            width: 550px;
            transition: 0.5s all ease-in-out;
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
                object-fit: cover;
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
                object-fit: cover;
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

.reservation {
    cursor: pointer;
}
</style>

<style>
.p-button:focus
{
    box-shadow: unset !important;
}

.tabs
{
    display: flex;
    flex-direction: column;
    align-items: end;
}

.tab-block
{
    width: 750px;
    border-left: 1px solid #dedede;
}

.tab-content
{
    display: flex;
    flex-direction: row-reverse;
    transition: 0.5s all ease-in-out;
    width: 100%;
}

.item-reservation-box
{
    border-radius: 15px;
    margin: 20px;
}

.item-reservation
{
    background-color: white;
    border: 0.125rem solid #dedede;
    border-radius: 15px;
    padding: 10px;
}

.employee-info-top
{
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #dedede;
}

.employee-info-top .employee-header
{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.employee-info-top .employee-header .e-reservation-buttons
{
    display: flex;
    gap: 10px;
}

.employee-info-top .employee-header .e-reservation-id-box
{
    padding: 8px 10px;
    background: #4caf50;
    color: #ffffff;
    border-radius: 10px;
}

.employee-info-top .employee-header .e-reservation-details-button
{
    padding: 8px 10px;
    border-radius: 10px;
    color: #4CAF50;
    border-color: rgb(67, 160, 71);
    border: 1px solid;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.employee-info-top .employee-header .e-reservation-details-button:hover
{
    background-color: #4caf50;
    color: white;
    border-color: #4CAF50;
}

.employee-info-top .employee-header .employee-info-fio
{
    font-size: 20px;
    color: #56b35a;
}

.employee-info-top .handle-icon-block {
    display: flex;
    gap: 8px;
}

.employee-info-top .handle-icon-block .item-icon
{
    height: max-content;
}

.employee-info-top .handle-icon-block .item-icon .trash-box
{
    border: 1px solid #d3cfcf;
    border-radius: 16%;
}

.employee-info-top .handle-icon-block .item-icon:hover
{
    cursor: pointer;
}

.employee-info-top .handle-icon-block .item-icon:hover svg path
{
    fill: #66ba6a !important;
}

.employee-info-top .handle-icon-block .item-icon:hover .trash-box
{
    border-color: #66ba6a;
}

.employee-info-bottom
{
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    gap: 5px;
    flex-direction: column;
}

.employee-info-bottom .e-email-box,
.employee-info-bottom .e-phone-box,
.employee-info-bottom .e-position-box
{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
}


.e-position-box .e-position
{
    height: max-content;
    padding: 0 7px;
    background: #87c98a;
    color: #ffffff;
    border-radius: 8px;
}

.e-email-box .e-email,
.e-phone-box .e-phone,
.e-position-box .e-position
{
    font-weight: 400;
    letter-spacing: 0.2px;
}

.dragDrop
{
    height: 100%;
    width: 750px;
    overflow-y: auto;
    border-left: 1px solid #dedede;
}

.ghost
{
    opacity: 0.5;
    background: #a2d0e5;
}


.active_reservation
{
    text-wrap: nowrap;
    border-top-left-radius: 0.375rem;
    border: 1px solid #3a8efa;
    position: absolute;
    background: #ffffff;
    width: 160px;
    overflow: hidden;
    right: -50px;
    top: -8px;
}

.active_reservation p
{
    padding: 5px 10px;
    margin: 0;
}

.active_reservation .title
{
    display: flex;
    justify-content: space-between;
    gap: 10px;
    background: #3a8efa;
    color: #fff;
    fill: #ffffff;
}

.active_reservation .title .count_reservations
{
    background-color: #4caf50;
    color: white;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
        
.window-chess-floor .chessFloors {
    height: 100% !important;
    width: 100% !important;
    padding: 20px !important;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
}

@media screen and (max-width: 1600px) {
  .active_reservation
  {
    right: -30px;
  }

  .tab-block
  {
    width: 550px;
  }

  .dragDrop
  {
    width: 550px;
  }
}
</style>