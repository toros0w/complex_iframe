<template>
  <div v-if="loaders.list" class="loader-div">
    <img src="../app/images/rocket-spinner.svg">
  </div>   
  <ListItems v-else :isViewPage="true" />
</template>

<script setup>
  import { useComplexStore } from "@/app/store/complex";
import ListItems from "@/widgets/ListItems.vue";

  const { loaders } = useComplexStore()
</script>

<style lang="scss">
    .loader-div{
        margin-left: 45%;
        margin-right: 50%;
        margin-top: 15%;

        img {
            width:150px;
            max-width: none;
        }
    }
</style>
