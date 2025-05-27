<template>
    <template v-if="route.name != 'archive-main'">
        <div v-if="loaders.list" class="loader-div">
            <RocketSpinner/>
        </div>   
        <ListItems v-else />
    </template>
    <template v-else>
        <div v-if="loaders.archivedList" class="loader-div">
            <RocketSpinner/>
        </div>   
        <ArchivedListItems v-else />
    </template>

</template>
  
<script setup>
import { useComplexStore } from "@/app/store/complex";
import ArchivedListItems from "@/widgets/ArchivedListItems.vue";
import ListItems from "@/widgets/ListItems.vue";
import { useRoute } from "vue-router";
import RocketSpinner from "@/components/RocketSpinner.vue";

const { loaders } = useComplexStore()

const route = useRoute()

</script>
<style lang="scss">

</style>

