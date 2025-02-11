<template>
  <div class="homePage relative bg-white flex justify-start items-start">
    <RouterView></RouterView>
  </div>
</template>
<style lang="scss">
.homePage {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 1s ease, opacity 1s ease;
  will-change: transform, opacity;
}

.slide-enter-from {
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // left: 100%;
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // left: 0%;
  transform: translateX(0%);
  opacity: 1;
}

.slide-leave-from {
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // left: 0%;
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-to {
  // position: absolute;
  // overflow: hidden;
  // top: 0;
  // bottom: 0;
  // left: -100%;
  transform: translateX(-100%);
  opacity: 0;
}
</style>
