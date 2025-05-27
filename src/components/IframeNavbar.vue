<template>
    <!-- <div v-if="apartmentsLoader" class="loader-div">
      <RocketSpinner/>
    </div> -->
  <div class="navbar-wrapper">
    <div class="close-btn" @click="closeIframeNavbar">
      <span class="close-icon">&times;</span>
    </div>
    <nav class="menu">
      <ul>
        <li v-for="item in filteredMenuItems" :key="item.text">
          <a class="menu-item" @click="changeViewMode(item.viewMode)">
            <img :src="item.icon" :alt="item.text" class="menu-icon" />
            <span class="menu-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "IframeNavbar",
  props: {
    visibility: Object,
  },
  
  data() {
    return {
      screenWidth: window.innerWidth,
      menuItems: [
        { 
          viewMode: {icon: "list", name: "Список", value: "list", visible: true}, 
          id: "all", 
          text: "Все объекты", 
          icon: require("@/shared/assets/icons/iframeNavIcons/all-objects.svg") 
        },
        { 
          viewMode: {icon: "facades", name: "Фасады", value: "facades", visible: true}, 
          id: "facades", 
          text: "Фасады", 
          icon: require("@/shared/assets/icons/iframeNavIcons/facades.svg") 
        },
        { 
          viewMode: {icon: "layouts", name: "Планировки", value: "layouts", visible: true}, 
          id: "plans", 
          text: "Планировки", 
          icon: require("@/shared/assets/icons/iframeNavIcons/plate.svg") 
        },
        { 
          viewMode: {icon: "tile", name: "Плитка", value: "tile", visible: true}, 
          id: "plate", 
          text: "Плитка", 
          icon: require("@/shared/assets/icons/iframeNavIcons/flat-planes.svg") 
        },
        { 
          viewMode: {icon: "grid", name: "Сетка", value: "grid", visible: true}, 
          id: "net", 
          text: "Сетка", 
          icon: require("@/shared/assets/icons/iframeNavIcons/tile.svg") 
        },
        { 
          viewMode: {icon: "floors", name: "Этажи", value: "floors", visible: true}, 
          id: "floors", 
          text: "Этажи", 
          icon: require("@/shared/assets/icons/iframeNavIcons/floors.svg") 
        },
      ],
    };
  },
  computed: {
    filteredMenuItems() {
      return this.menuItems.filter(item => {
        const isVisible = this.visibility[item.id];
        const isFacadesHiddenOnSmallScreen = item.id === "facades" && this.screenWidth < 1210;
        return isVisible && !isFacadesHiddenOnSmallScreen;
      });
    },
  },
  methods: {
    changeViewMode(value) {
      this.$emit("view-mode-emit", value);
      this.$emit("update:viewType", value);
      this.$emit("closeIframeNavbar");
    },
    closeIframeNavbar() {
      this.$emit("closeIframeNavbar");
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    }
  },
  
  mounted() {
    window.addEventListener("resize", this.updateScreenWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScreenWidth);
  }
  
};

</script>


<style lang="scss">
.navbar-wrapper {
  position: relative;
  max-width: 300px;
  min-width: 300px;
  height: 100vh;
  background: url('@/shared/assets/images/skyscraper.svg');
  background-color: var(--main-color);
  background-position: bottom;
  background-repeat: no-repeat;
}
.bg-svg {
  z-index: 1;
  position: absolute;
  right: 0;
  bottom: 0;
  /* user-select: none; */
}
.menu {
  padding-top: 36px;
  display: flex;
  /* justify-content: center; */
  margin-left: 44px;
}
.menu-item {
  color: white;
  font-size: 26px;
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  transition: opacity 0.3s ease;
  cursor: pointer;
}
.menu-item:hover {
  opacity: 0.7;
}
.close-btn {
  display: none;
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 6px;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 16px;
}
.close-icon {
  font-size: 35px;
  color: var(--main-color);
  user-select: none;
  line-height: 0.03;
}
@media(max-width: 768px) {
  .close-btn {
    display: flex;
  }
  .menu {
  padding-top: 76px;
}
}
@media(max-width: 405px) {
  .navbar-wrapper {
    max-width: 405px;
  }
}
</style>