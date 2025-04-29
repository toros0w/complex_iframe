<template>
  <div class="apartment_type_item">
    <div class="founded_aparts">
      <div class="type">1к</div>
      <div class="count">7 квартир найдено</div>
    </div>
    <div class="apart_info">
      <div class="plane_img">
        <div class="hover-bg"></div>
        <img src="@/shared/assets/icons/zoom.svg" alt="" class="zoom" />
        <img
          src="https://img.dmclk.ru/vitrina/fe/1a/fe1a0ecc45398fc537df972f0544e42d546707dd.jpg"
          alt=""
        />
      </div>
      <Dropdown
        v-model="selectedValue"
        :options="options"
        optionLabel="label"
        placeholder="Выберите квартиру"
        class="custom-dropdown"
      >
        <template #option="{ option }">
          <div class="option-wrapper">
            <div class="apart-info">
              <span
                class="apart-status"
                :style="{ backgroundColor: getBackgroundColor(option.status_type) }"
              ></span>
              <div class="apart-price-wrapper">
                <span class="full-price"
                  >{{ option.apartment_price }} руб.</span
                >
                <div class="squere-info">
                  <span class="squere">{{ option.apartment_squere }} м2</span>
                  <span class="dash"> - </span>
                  <span class="price-squere"
                    >{{ option.squere_price }} руб./м2</span
                  >
                </div>
              </div>
            </div>
            <div class="apart-additional">
              <span class="floor">{{ option.apartment_floor }} этаж</span>
              <span class="number">№{{ option.apartment_number }}</span>
            </div>
          </div>
        </template>
      </Dropdown>
      <div class="primary-btn type_btn">Подробнее</div>
    </div>
  </div>
</template>

<script setup>
import Dropdown from "primevue/dropdown";
import { ref } from "vue";


const colors = JSON.parse(localStorage.getItem('colors')) || {}


const statusMap = {
  reservation: 'color_reserved',
  available: 'color_free',
  not_for_sale: 'not_for_sale',
  sold: 'sold',
}

const getBackgroundColor = (statusType) => {
  
  const colorKey = statusMap[statusType]
  return colors[colorKey]
}

const options = [
  {
    label: "",
    value: "40",
    apartment_status: "free",
    apartment_price: "7360000₽",
    apartment_squere: "36,6",
    squere_price: "189637",
    apartment_floor: "10",
    apartment_number: "40",
    status_color: "#ED4B00",
  },
  {
    label: "",
    value: "41",
    apartment_status: "free",
    apartment_price: "8200000",
    apartment_squere: "40,2",
    squere_price: "204478",
    apartment_floor: "11",
    apartment_number: "41",
    status_color: "#2100B1",
  },
  {
    label: "",
    value: "42",
    apartment_status: "free",
    apartment_price: "9000000",
    apartment_squere: "45,1",
    squere_price: "199556",
    apartment_floor: "12",
    apartment_number: "42",
    status_color: "#2100B1",
  },
];

const selectedValue = ref(null);
</script>

<style lang="scss" scoped>
.apartment_type_item {
  display: flex;
  flex-direction: column;
  max-width: 463px;
  max-height: 490px;
  border: 1px solid #dedede;
  border-radius: 6px;
  padding-bottom: 26px;
  & .founded_aparts {
    display: flex;
    gap: 10px;
    align-items: center;
    color: #757575;
    margin: 20px 0 0 20px;
    & .type {
      border: 1px solid #757575;
      border-radius: 50%;
      display: flex;
      font-size: 14px;
      padding: 3px 6px;
    }
    & .count {
      font-size: 12px;
    }
  }
  & .apart_info {
    padding: 0 40px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    & .plane_img {
      position: relative;

      & img:hover {
      }

      & .hover-bg {
        position: absolute;
        background-color: #fff;
        opacity: 0;
        visibility: hidden;
        width: 100%;
        height: 100%;
        transition: opacity 0.3s ease, visibility 0s 0.3s;
      }

      & .zoom {
        display: none;
        width: 70px;
        height: 70px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
      }
    }

    & .plane_img:hover {
      cursor: pointer;
      & .zoom {
        display: block;
        opacity: 1;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease, visibility 0s;
      }

      & .hover-bg {
        opacity: 0.7;
        visibility: visible;
        transition: opacity 0.2s ease, visibility 0s;
      }
    }
    & .select {
      margin-top: 10px;
    }
    & .type_btn {
      align-self: center;
      width: 130px;
      height: 40px;
      color: #ffffff;
      border-radius: 20px;
      font-size: 14px;
      line-height: 0;
      margin-top: 10px;
    }
  }
}
.option-wrapper {
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  & .apart-info {
    & .apart-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 18px;
    }
    & .apart-price-wrapper {
      & .full-price {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
      }
      & .squere {
        font-size: 12px;
        color: #333333;
      }
      & .price-squere {
        font-size: 12px;
        color: #757575;
      }
    }
  }
  /* & .apartment-info {
    display: flex;
    flex-direction: column;
  } */
  & .apart-additional {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    & .floor {
      color: #333333;
    }

  }
}
</style>