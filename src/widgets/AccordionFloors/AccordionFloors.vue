<template>
  <section class="info" :style="inner ? 'flex-direction: column;' : ''">
    <AccordionFloorItem
      v-for="floor in floors"
      :key="floor.id"
      :floor="floor"
      :index="floor.position"
      @dragstart="dragStartHandler($event, floor)"
      @dragleave="(e) => dragEndHandler(e, floor.position)"
      @dragend.prevent="(e) => dragEndHandler(e, floor.position)"
      @dragover.prevent="(e) => dragOverHandler(e)"
      @drop.prevent="
        (e) => {
          $emit('dragEnd', {
            event: e,
            position: floor.position,
            dragFloor: dragFloor,
          })
        }
      "
      @delete-floor="toggle($event, floor)"
      @copy-floor="$emit('copy:floor', $event)"
    />
    <div class="entrance-delete">
      <OverlayPanel unstyled="true" ref="op" class="planEditWindow3dOverlay">
        <h3 class="popover-title">Удалить этаж?</h3>
        <div class="popover-content">
          <p class="confirmation-content" style="display: none"></p>
          <div class="confirmation-buttons text-center">
            <div
              style="display: flex; justify-content: center"
              class="overlay-custom-btn-group"
            >
              <button
                @click="handleDeleteFloor()"
                style="display: flex; align-items: center"
                class="overlay-custom-btn overlay-custom-btn-xs overlay-custom-btn-success"
                data-apply="confirmation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="13"
                  height="13"
                  viewBox="0 0 26 26"
                >
                  <path
                    fill="white"
                    d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"
                  ></path>
                </svg>
                Да
              </button>
              <button
                @click="toggle"
                style="display: flex; align-items: center"
                class="overlay-custom-btn overlay-custom-btn-xs overlay-custom-btn-danger"
                data-dismiss="confirmation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="13"
                  height="13"
                  viewBox="0 0 26 26"
                >
                  <path
                    fill="white"
                    d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z"
                  ></path>
                </svg>
                Нет
              </button>
            </div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  </section>
</template>

<script>
import { ref } from "vue";
import "./AccordionFloors.css";
import AccordionFloorItem from "./AccordionFloorItem.vue";
import OverlayPanel from "primevue/overlaypanel";

export default {
  name: "Accordion",
  components: {
    AccordionFloorItem,
    OverlayPanel
  },
  props: {
    floors: Array,
    inner: Boolean,
  },
  setup() {
    const dragFloor = ref(1);
    const floorToDelete = ref()

    return { dragFloor, floorToDelete };
  },
  methods: {
    dragStartHandler(e, floor) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      this.dragFloor = floor;
    },
    dragEndHandler(e) {
      e.target.style.background = "#ffffff";
    },
    dragOverHandler(e) {
      e.target.style.background = "#F2EED6";
    },
    toggle(event, floor) {
      if (floor) {
        this.floorToDelete = floor;
      }
      this.$refs.op.toggle(event);
    },
    handleDeleteFloor() {
      this.$emit('delete:floor', this.floorToDelete)
      this.toggle()
    }
  },
};
</script>

<style scoped lang="scss">
.info {
  gap: 30px;
  display: flex;
  flex-direction: column-reverse;
}
</style>
