import { defineStore } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";

export const useNavigateStore = defineStore("navigate", () => {
    const pages = ref([]);
    const route = useRoute();

    const setPages = (newPages) => {
        const token = route.params.token;

        pages.value = newPages.map(page => {
            // Найдём часть после `/view`, чтобы не дублировать
            const viewIndex = page.path.indexOf('/view');
            const suffix = viewIndex !== -1 ? page.path.slice(viewIndex + 5) : ''; // +5 чтобы пропустить "/view"
            
            return {
                ...page,
                path: `/${token}/view${suffix}`
            };
        });
    };

    return {
        pages,
        setPages
    };
});