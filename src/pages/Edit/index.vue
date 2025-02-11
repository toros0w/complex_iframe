<template>
  <DefaultLayout>
    <RouterView></RouterView>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/shared/layouts/defaultLayout.vue";
import { onMounted } from "vue";
onMounted(() => {
  document.getElementById('vue-page')?.classList.add('active')
})
</script>