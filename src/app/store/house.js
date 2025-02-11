import { defineStore } from "pinia";
import { ref } from "vue";
import api from '@/shared/api'

export const useHouseStore = defineStore("house", () => {
  const house = ref({});
  const complex = ref({'dop':{}, 'metro':{}});

  const get_house = async (house_id, includes = []) => {
    return api.getHouseOne(house_id, includes)
      .then((response) => {
        var res = response.data;
        if(res.house) house.value = res.house;
        if(res.complex) complex.value = res.complex;

        return response
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return {
    house,
    complex,
    get_house
  };
});