<template>
  <div class="planEditWindowSideWorld">
    <div class="planEditWindowSideWorld__checkboxWrapper">
      <InputSwitch v-model="formData.has_light_angle" />
      <label for="">Отображать стороны света</label>
    </div>
    <div class="planEditWindowSideWorld__content mt-10" v-if="formData.has_light_angle">
      <div class="planEditWindowSideWorld__compass">
        <ChangeSideWorld :formData="formData"/>
      </div>
      <div class="planEditWindowSideWorld__imagePlan flex" style="flex-wrap: wrap;">
        <div 
          class="flex flex-col w-max"
          style="align-items: center;"
          v-for="image in images"
          :key="image.url"
        >
          <img
            :src="image.url"
            width="200px"
            height="200px"
            alt=""
          />
          <span>
            {{ image.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChangeSideWorld from "@/entities/changeSideWorld.vue";

const props = defineProps({
  formData: Object,
  images: {
    type: Array,
    default: []
  },
})
</script>


<style scoped lang="scss">
.planEditWindowSideWorld {
  &__checkboxWrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    label {
      margin-left: 20px;
    }
  }
  &__content {
    display: flex;
    width: 100%;
    height: auto;
    gap: 40px;
    padding: 20px;
  }

  &__imagePlan {
    gap: 40px;
    justify-content: end;
  }
}
</style>
