<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 69 100"
    :width="width"
    :height="height"
  >
    <path
      d="M34.5074 0C15.7476 0 0.537109 15.1083 0.537109 
                33.746C0.537109 43.2806 9.89002 60.3623 9.89002 60.3623L33.2552 
                100L57.6341 60.8251C57.6341 60.8251 68.4635 44.5271 68.4635 
                33.746C68.4663 15.1083 53.2586 0 34.5074 0ZM34.3484 52.3325C23.6042 
                52.3325 14.9015 43.6299 14.9015 32.8743C14.9015 22.1329 23.6014 
                13.4359 34.3484 13.4359C45.0869 13.4359 53.7981 22.1329 53.7981 
                32.8743C53.7981 43.6299 45.0869 52.3325 34.3484 52.3325Z"
      :fill="mainColor"
    />
  </svg>
</template>

<script>
// import { onBeforeMount } from "vue";
export default {
  name: "MapIcon",
  props: {
    mainColor: {
      type: String,
      required: true,
      default: "ED4B00",
    },
    width: {
      type: String,
      required: false,
      default: "40px",
    },
    height: {
      type: String,
      required: false,
      default: "54px",
    },
  },
  // onBeforeMount() {
  //   console.log('onbeforemount');
    
  // }
};
</script>