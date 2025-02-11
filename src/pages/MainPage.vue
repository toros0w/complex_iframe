<template>
    <template v-if="route.name != 'archive-main'">
        <div v-if="loaders.list" class="loader-div">
            <img src="../app/images/rocket-spinner.svg">
        </div>   
        <ListItems v-else />
    </template>
    <template v-else>
        <div v-if="loaders.archivedList" class="loader-div">
            <img src="../app/images/rocket-spinner.svg">
        </div>   
        <ArchivedListItems v-else />
    </template>

</template>
  
<script setup>
import { useComplexStore } from "@/app/store/complex";
import ArchivedListItems from "@/widgets/ArchivedListItems.vue";
import ListItems from "@/widgets/ListItems.vue";
import { useRoute } from "vue-router";

const { loaders } = useComplexStore()

const route = useRoute()

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

