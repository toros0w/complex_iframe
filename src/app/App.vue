<template>
  <router-view />
</template>

<script setup>
import "@/app/styles/main.scss";

</script>

<style>
body {
  font-size: 15px;
}
.jw__layout {
  font-size: 14px;
}
.p-component-overlay{
  background-color: #fff;
}

.p-galleria .p-galleria-item-nav{
  width: auto;
}

.p-galleria-item-nav{
  top: 40% !important;
}

.p-link:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0.2rem #22c55e;
}

</style>
