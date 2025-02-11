<template>
  <div
    class="chessLayouts grid grid-cols-4 gap-[25px] xl:grid-cols-3 xl:gap-[20px]"
  >
    <ChessLayoutsItem
      v-for="plan in filteredPlans"
      :key="plan.id"
      :isDetailsOpened="isDetailsOpened"
      :plan="{...plan, complex_name, house_name}"
      @openWindow="(room) => emits('update:is-open-window', room)"
    />
  </div>
</template>

<script setup>
import ChessLayoutsItem from "@/entities/viewHome/chessLayoutsItem.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()

const filteredPlans = computed(() => {
  if (route.query) {
    return props.plans.filter(plan => {      
      return plan.rooms.some(room => room.visible)
    })
  }
  return props.plans
})

const props = defineProps({
  plans: Array,
  complex_name: String,
  house_name: String,
  isDetailsOpened: Boolean,
})


const emits = defineEmits(
  ["update:is-open-window"]
);
</script>
