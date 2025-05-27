<template>
  <div v-if="loaders.list" class="loader-div Loader_list">
    <RocketSpinner/>
  </div>
  <ListItems v-else :isViewPage="true" />
</template>

<script setup>
  import { useComplexStore } from "@/app/store/complex";
import ListItems from "@/widgets/ListItems.vue";
import RocketSpinner from "@/components/RocketSpinner.vue";
  const { loaders } = useComplexStore()
</script>

<style lang="scss">
    .loader{
        width:110px;
        max-width: none;
        display: flex;
        margin-left: auto;
        margin-right: auto;
        height: 1000px;

        img {
            /* width:110px;
            max-width: none; */
        }
    }
</style>
