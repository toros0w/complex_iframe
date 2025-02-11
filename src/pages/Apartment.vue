<template>
  <ApartmentLayout :apartment="apartment">
    <div class="apartment-show">
        <div class="apartment-show__content" v-if="apartment">
          <div class="apartment-show__head">
            <!-- <div class="apartment-show__title mr-auto text-3xl">
              {{ room_types["apartment.type"] }} № &nbsp;{{ apartment.number }}
            </div> -->
          </div>
          <div class="apartment-show__info">
            <Button
                v-tooltip="'Посмотреть дом'"
                severity="secondary"
                class="homeItem__edit"
                @click="handleClickDom"
            >
                <house />
            </Button>
            <div class="apartment-show__type" v-if="room_types_which_has_rooms.includes(apartment.type)" >Комнат - {{ apartment.rooms_count }}</div>
            <div class="apartment-show__square">{{ apartment.area }} м2</div>
            <Dropdown
              :options="availableFloorsNames"
              optionLabel="label"
              optionValue="value"
              v-model="activeFloor"
              @change="floorChanged"
              :pt="{
                root: {
                    class: ['!border-0'],
                },
                input: {
                    class: ['!text-black'],
                },
            }"
            ></Dropdown>
            <div
              :style="{'background-color' : apartment?.complex_status_info.status_color}"
              class="apartment-show__status"
            >
              {{ apartment?.complex_status_info.status_name }}
            </div>
          </div>
          <div class="apartment-show__image">
            <div class="image">
              <img
                v-if="apartment.plan_url"
                :src="apartment.plan_url"
                alt=""
                class=""
              />
              <img
                v-else
                style="width: 240px"
                src="@/shared/assets/images/complexes/gallery.svg"
                alt=""
                class=""
              />
            </div>
          </div>
          <div v-if="apartment.status_type == 'available' || apartment.has_light_angle" class="apartment-show__btns">
                <div v-if="apartment.has_light_angle">
                  <div class="cell">
                    <img
                      style="width: 95px"
                      :src="require('@/shared/assets/images/said.png')"
                      alt=""
                      :style="`transform: rotate(${apartment.light_angle}deg)`"
                    />
                  </div>
              </div>
                <MyButton v-if="apartment.status_type == 'available'" :theme="'green'" @click="handleApplicationClick(apartment.id)">Заявка на квартиру</MyButton>
            </div>
          <div class="apartment-show__price">
            {{ formatNumber(apartment.total_amount) }} руб.
          </div>
          <div class="apartment-show__priceSqure">
            {{
              formatNumber(((apartment.total_amount || 0) / (apartment.area || 0)).toFixed(2))
            }}
            руб. за м2
          </div>
          <div class="apartment-show__settings">
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
                <div class="cell">{{ apartment.house_parking ? apartment.house_parking : 'Нет' }}</div>
              </div>
              <div class="row">
                <div class="cell">Охрана</div>
                <div class="cell">{{ apartment.house_security ? 'Да' : 'Нет' }}</div>
              </div>
              <div class="row">
                <div class="cell">Огороженная территория</div>
                <div class="cell">{{ apartment.house_fenced_area ? 'Да' : 'Нет' }}</div>
              </div>
              <div class="row">
                <div class="cell">Спортивная площадка</div>
                <div class="cell">{{ apartment.house_sports_ground ? 'Да' : 'Нет' }}</div>
              </div>
              <div class="row">
                <div class="cell">Детская площадка</div>
                <div class="cell">{{ apartment.house_play_ground ? 'Да' : 'Нет' }}</div>
              </div>
              <div class="row">
                <div class="cell">Школа</div>
                <div class="cell">{{ apartment.house_school ? 'Да' : 'Нет' }}</div>
              </div>
              <div class="row">
                <div class="cell">Детский сад</div>
                <div class="cell">{{ apartment.house_kinder_garten ? 'Да' : 'Нет' }}</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </ApartmentLayout>
</template>

<script>
import api from "@/shared/api";
import ApartmentLayout from "@/shared/layouts/ApartmentLayout.vue";
import { formatNumber, room_types, room_types_which_has_rooms } from "@/shared/utils/util";
import { ref } from "vue";
import { useFieldsStore } from '@/app/store/fields';
import house from "@/shared/assets/icons/house.vue"
export default {
  components: {
    ApartmentLayout,house,
  },
  setup() {
    const apartment = ref();
    const activeFloor = ref()
    const fieldsStore = useFieldsStore()
    const entrance = ref()
    const is_loading = ref(false)
    return { apartment, room_types, formatNumber, decorations: fieldsStore.decorations, windowsPlacements: fieldsStore.windowsPlacements, entrance, activeFloor, is_loading, room_types_which_has_rooms };
  },
  computed: {
    entranceAvailableFloors() {
        if (this.apartment) {
            return this.entrance.floors
                .filter((floor) => floor.rooms.find((room) => room.position == this.apartment.position))
        }
    
        return []
    },
    availableFloorsNames() {
        return this.entranceAvailableFloors.map((floor) => ({
            label: `${floor.position} Этаж`,
            value: floor.position,
        }))
    }
  },
  mounted() {
    this.mountPage()
  },
  methods: {
    getDecoration(decoration_id) {
        if (!decoration_id) return ''

        return this.decorations.find((decoration) => decoration.code == decoration_id)?.name
    },
    getWindowsPlacement(windows_placement_id) {
        if (!windows_placement_id) return ''

        return this.windowsPlacements.find((windowsPlacement) => windowsPlacement.id == windows_placement_id)?.name
    },
    floorChanged(event) {
        this.entrance.floors.forEach((floor) => {
            floor.rooms.find((room) => {
                if (room.floor == event.value && room.position == this.apartment.position ) {
                    this.$router.replace(`/apartments/${room.id}`)
                    this.mountPage()
                }
            })
        })
    },
    mountPage() {
        if (this.is_loading) return
        this.is_loading = true
        api.get_room_entrance(this.$route.params.apartment_id).then((res) => {
            this.entrance = res.data;
            this.entrance.floors.forEach((floor) => floor.rooms.find((room) => {
                if (room.id == this.$route.params.apartment_id) {
                    this.apartment = room
                    this.activeFloor = room.floor
                }
            }))
        }).finally(() => this.is_loading = false)
    },
    handleApplicationClick(room_id) {
        const reqForm = document.querySelector('#req_form')
        if (reqForm) {
            const input = document.createElement('input')
            input.type = 'hidden';
            input.name = 'complex_room_id';
            input.value = room_id;

            reqForm.appendChild(input)
        }
        const actionsContainer = document.querySelector('.jw__add-popup')

        if (actionsContainer) {
            const addReqElement = actionsContainer.querySelector('.add_req_new')

            if (addReqElement) {
                addReqElement.click()
            }
        }
    },
    handleClickDom() {
      const routeData = this.$router.resolve({path: '/view/' + this.entrance.complex_id + '/home/'+this.apartment.house_id});
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style scoped lang="scss">
.apartment-show {
    width: 100%;
    height: 100%;
  &.openFull {
    width: 100%;
  }

  &__content {
    width: 100%;
    height: 100%;
    // box-shadow: -2px 0px 6px 1px rgba(0, 0, 0, 0.25);
    padding: 0 50px 50px 50px;
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

  &__info {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 30px;
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
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        max-height: 500px;
        object-fit: contain;
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

  &__btns {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    gap: 10px;
  }

  &__price {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
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

    &__head {
      margin-bottom: 24px;
    }

    &__title {
      font-size: 24px;
      line-height: 100%;
    }

    &__status {
      padding: 6px 8px;
    }

    &__image {
      margin-bottom: 24px;
    }

    &__btns {
      margin-bottom: 30px;
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