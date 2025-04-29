<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="white"/>
    <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" :stroke="computedColor"/>
    <rect x="8" y="13" width="24" height="2" rx="1" :fill="computedColor"/>
    <rect x="8" y="19" width="24" height="2" rx="1" :fill="computedColor"/>
    <rect x="8" y="25" width="24" height="2" rx="1" :fill="computedColor"/>
  </svg>
</template>

<script>
export default {
  name: 'Burger',
  computed: {
    computedColor() {
      return this.mainColor || document.documentElement.style.getPropertyValue("--main-color") || '#ED4B00';
    }
  }
}
</script>
