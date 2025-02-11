import api from "@/shared/api";
import { ref } from "vue";

export default function useHouseHook() {
  const house = ref({});
  const complex = ref({'dop':{}, 'metro':{}});

  const get_house = async (house_id) => {
    api.getHouseOne(house_id)
      .then((response) => {
        var res = response.data;
        if(res.house) house.value = res.house;
        if(res.complex) complex.value = res.complex;
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
}
