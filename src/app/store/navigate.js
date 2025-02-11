import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigateStore = defineStore("navigate", () => {
    const pages = ref([]);

    const setPages = (newPages) => {
        pages.value = newPages
    }

    return {
        pages,
        setPages
    };
});