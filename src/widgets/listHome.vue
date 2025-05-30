<template>
  <div class="listHome">
    <div class="listHome__title">Список домов</div>
    <nav class="listHome__nav">
      <div class="nav__item">
        <button
          class="nav__btn"
          :class="activeListItem === 'activeHome' ? 'active' : ''"
          @click="toggleHome('activeHome')"
        >
          Активные дома
        </button>
      </div>
      <div class="nav__item">
        <button
          class="nav__btn"
          :class="activeListItem === 'archiveHome' ? 'active' : ''"
          @click="toggleHome('archiveHome')"
        >
          Архив домов
        </button>
      </div>
      <div class="nav__item">
        <button class="nav__btn" @click="emits('openAddHome')">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6445 1.21817H10.3555V20.784H11.6445V1.21817Z"
              fill="#4CAF50"
            />
            <path
              d="M20.7841 10.3555H1.21826V11.6445H20.7841V10.3555Z"
              fill="#4CAF50"
            />
          </svg>
          Добавить дом
        </button>
      </div>
    </nav>
    <div v-show="loadHome" class="loader-div">
      <RocketSpinner/>
    </div>
    <div v-show="!loadHome" class="listHome__list">
      <template v-if="activeListItem === 'activeHome'">
        <homeItem
          v-for="house in houses.filter((house) => !house.is_archive)"
          :key="house.id"
          @archiveItem="() => archiveHouse(house)"
          :house="house"
        />
      </template>
      <template v-if="activeListItem === 'archiveHome'">
        <homeItem
          v-for="house in houses.filter((house) => house.is_archive)"
          isArchivePage
          @unArchiveItem="() => unArchiveHouse(house)"
          @deleteItem="() => deleteHouse(house)"
          :key="house.id"
          :house="house"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import homeItem from "@/entities/homeItem.vue";
import api from "@/shared/api";
import bus from "@/eventBus";
import RocketSpinner from "@/components/RocketSpinner.vue";
const props = defineProps({
  complex_id: 0,
  houses: [],
  loadHome: true
});

const emits = defineEmits(
  ["openAddHome"]
);

const activeListItem = ref("activeHome");

const toggleHome = (tab) => {
  activeListItem.value = tab;
}

const archiveHouse = (house) => {
  api.addEditHouse({ ...house, is_archive: true }).then(() => {
    house.is_archive = true
  })
}

const unArchiveHouse = (house) => {
  api.addEditHouse({ ...house, is_archive: false }).then(() => {
    house.is_archive = false
  })
} 

const deleteHouse = (house) => {
  bus.$emit("remove-house", house.id)
}


</script>
<style scoped lang="scss">

.listHome {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &__title {
    width: 100%;
    font-size: 32px;
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid;
    @apply border-grey-400;
  }
  &__nav {
    width: 100%;
    height: 38px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    column-gap: 20px;

    .nav__item {
      width: auto;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .nav__btn {
        position: relative;
        width: auto;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 16px;

        &::before {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 0%;
          height: 3px;
          content: "";
          @apply bg-green;
        }
        &.active {
          font-weight: 600;
          &::before {
            width: 100%;
          }
        }

        svg {
          width: 22px;
          height: 22px;
          margin-right: 6px;
        }
      }
    }
  }
  &__list {
    position: relative;
    left: -30px;
    width: calc(100% + 60px);
    height: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    @apply bg-grey-200;
    padding: 30px 0;
  }

  @media screen and (max-width: 1440px) {
    &__list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
