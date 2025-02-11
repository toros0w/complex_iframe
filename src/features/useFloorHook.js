import api from "@/shared/api";
import { computed, watch } from "vue";

export default function useFloorHooks(floors) {
  const updateFloor = (floor, fields) => {
    return api.updateFloor(floor.id, fields)
      .then((response) => {
        floor = {...floor , ...fields}
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const sortedFloors = computed(() => {
    return floors ? floors.sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      } else {
        return -1;
      }
    }) : [];
  });

  watch(sortedFloors, (value) => {
    value.forEach((floor, index) => {
      updateFloor(floor, { position: index + 1 })
    })
  });
  return {
    sortedFloors,
    updateFloor,
  };
}
