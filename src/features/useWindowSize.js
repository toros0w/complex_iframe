import { ref, onMounted, onUnmounted } from "vue";

export default function useWindowSize() {
  const isMobile = ref(false);
  const isTablet = ref(false);

  const updateSize = () => {
    const width = window.innerWidth;
    isMobile.value = width <= 408;
    isTablet.value = width > 408 && width <= 768;
  };

  onMounted(() => {
    updateSize(); // Initial check
    window.addEventListener("resize", updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateSize);
  });

  return {
    isMobile,
    isTablet
  };
}