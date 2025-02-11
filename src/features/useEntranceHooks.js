import { computed, ref, watch } from "vue";
import api from "@/shared/api";

export default function useEntranceHooks() {
  const entranceList = ref([]);
  const entrancesLoader = ref(true)

  const getEntranceList = (house_id) => {
    return api.getHouseEntrances(house_id, ['rooms'])
      .then((response) => {
        entranceList.value = response.data
      })
      .finally(() => entrancesLoader.value = false)
      .catch(function(error) {
        console.log(error);
      });    
  }

  const updateEntrance = async (entrance, fields) => {
    api.updateEntrance(entrance.id, fields)
      .then((response) => {
        entrance = {...entrance , ...fields}
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  const deleteEntrance = async (entrance_id) => {
    api.deleteEntrance(entrance_id)
      .then(() => {
        entranceList.value = entranceList.value.filter(entrance => entrance.id !== entrance_id)
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  const addNewEntrance = (house_id, fields = {}) => {
    fields.position = entranceList.value.length + 1;
    fields.name = `Подъезд ${entranceList.value.length + 1}`;

    return api.createEntrance(house_id, fields)
      .then((response) => {
        entranceList.value.push(response.data)
        return response.data
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const sortedEntranceList = computed(() => {
    return entranceList.value.sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      } else {
        return -1;
      }
    });
  });

  const updateTitle = (index, name) => {
    const entrance = entranceList.value.find((el) => el.id === index);
    if (entrance) {
      updateEntrance(entrance, {name}).then(() => {
        entrance.name = name;
      })
    }
  };

  watch(sortedEntranceList, (value) => {
    value.forEach((entrance, index) => {
      updateEntrance(entrance, { position: index + 1 })
    })
  });

  return {
    entranceList,
    addNewEntrance,
    sortedEntranceList,
    updateEntrance,
    updateTitle,
    getEntranceList,
    deleteEntrance,
    entrancesLoader
  };
}
