<template>
  <Dialog
    modal
    v-model:visible="visibleWindowLocal"
    :style="'width: 95%; height: 90%;'"
    :draggable="false"
    @update:visible="$emit('update:visibleWindow')"
  >
    <template #header>
      <div class="title 2xl:text-[32px] xl:text-[28px]">
        Связать размеченную область с планировкой
      </div>
    </template>
    <template #default>
      <div class="items grid grid-cols-5 gap-7.5">
        <div
          class="itemPlan hover:!bg-grey-200"
          v-for="plan in plans"
          :key="`itemPlan` + plan.id"
          @click="onSelectPlan(plan.id)"
        >
          <div class="itemPlan__title">Тип планировки</div>
          <div class="itemPlan__place">{{plan.images.length && plan.images[0].name}}</div>
          <div class="itemPlan__image">
            <img
              :src="plan.images.length && plan.images[0].url"
              alt=""
            />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script>
import { ref } from "vue";

import bus from "@/eventBus";
import api from "@/shared/api";


export default{
  props: {
    visibleWindow:{
      type: Boolean
    },
    figure_id: Number,
  },
  setup(props) {
    const visibleWindowLocal = ref(props.visibleWindow);

    const plans = ref([])

    return {visibleWindowLocal, plans}
  },
  watch: {
    visibleWindow(newValue) {
      this.visibleWindowLocal = newValue
    }
  },
  methods: {
    getPlans() {
      if (!this.$route.params.house_id) return;
      return api.getHousePlans(this.$route.params.house_id)
        .then((response) => {
          var res = response.data;

          if (res) {
            this.plans = res;
          }
        })
    },
    onSelectPlan(plan_id) {
      bus.$emit('floor-plan:figure-plan-selected', { room_plan_id: plan_id, figure_id: this.figure_id, background: '51, 255, 87' })
      this.$emit('update:visibleWindow')
    }
  },
  mounted() {
    this.getPlans()
  }
}

// const props = { visibleWindo };
// const { visibleWindow } = toRefs(props);
/*const emits = defineEmits<{
  (e: "update:selectPlan", id: string): void;
  (e: "update:visibleWindow"): void;
}>();*/
</script>

<style scoped lang="scss">
.itemPlan {
  border-radius: 6px;
  border: 1px solid #dedede;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  cursor: pointer;

  &__title {
    color: #666;
    font-size: 16px;
    margin-bottom: 20px;
  }

  &__place {
    color: #4caf50;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 30px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
