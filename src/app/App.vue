<template>
  <router-view />
</template>

<script setup>
import "@/app/styles/main.scss";
import api from "@/shared/api";
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";



const route = useRoute()
const router = useRouter()


watch(
  () => route.params, 
  (newParams) => {
    const token = newParams.token;


    if (newParams.token) {
      api.getFrameAccess(token).then((response) => {
        console.log(response.data.access, 'response for access');

        if (response.data.access !== true) {
          router.push('/access-denied');
          return;
        }

        console.log('log inside .then block'); 
      });

      // No use of `response` here
      console.log('log in app.vue which is first'); 
    }
    console.log('log in app.vue which is first');
    
    api.getAllColors(token)
      .then(({ data }) => {
        if (typeof data === 'object' && data !== null) {
          data.not_for_sale = '#dedede'
          data.sold = '#757575'
          const storedColors = localStorage.getItem("colors");
          if (storedColors) {
            const parsedColors = JSON.parse(storedColors);

            
            if (JSON.stringify(parsedColors) !== JSON.stringify(data)) {
              localStorage.setItem("colors", JSON.stringify(data));
            }
          } else {
            localStorage.setItem("colors", JSON.stringify(data));
          }
      
          const colors = JSON.parse(localStorage.getItem('colors'));
          const frameColor = colors.frame_color;
          const freeColor = colors.color_free;
          const reservedColor = colors.color_reserved;
      
          document.documentElement.style.setProperty("--main-color", frameColor) 
        }
        //  else {
        //   document.documentElement.style.setProperty("--main-color", "#07a860") // frameColor
        // }

    });
    }
  ,
  { immediate: true }
);




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
