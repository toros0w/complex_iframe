<template>
  <MapsModalLayout
    class="edit-in-maps open"
    title=""
    @closeModel="$emit('closeModel')"
  >
  <template v-if="center.length">
    <yandex-map
        v-model="map"
        :settings="{
          location: {
            center,
            zoom: hasHouse ? 15 : 10,
            controls: ['fullscreenControl', 'zoomControl']
          },
        }"
        width="100%"
        height="500px"
    >
      <yandex-map-default-scheme-layer/>
      <yandex-map-default-features-layer/>
      <yandex-map-marker  
        :settings="{
          coordinates: marker,
          onDragEnd: ([long, lat]) => $emit('coordsChoosed', [long.toPrecision(8), lat.toPrecision(8)]),
          draggable: true
        }"
      >
        <div class="marker"/>
      </yandex-map-marker>
    </yandex-map>
    <button @click="$emit('closeMaps')" class="close">Закрыть</button>
  </template>
  </MapsModalLayout>
</template>
  
<script setup>
  import MapsModalLayout from '@/shared/UI/mapsModalLayout.vue';
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapMarker } from 'vue-yandex-maps';

  const props = defineProps({
    regionLabel: Object,
    address: String,
    coords: Array,
    hasHouse: Boolean,
  })

  const center = ref([])
  const marker = ref([])
  const map = ref(null)

  onMounted(() => {
    const trimmedLabel = props.regionLabel.replace(/\s+/g, ' ').trim();
    window.yandexMap.geocode(trimmedLabel).then((res) => {
      var [coord1, cord2] = res.geoObjects.get(0).geometry.getCoordinates();
      center.value = [cord2.toPrecision(8), coord1.toPrecision(8)]

      if (props.coords.length) {
        center.value = props.coords
        marker.value = props.coords
      } else if (props.address) {
        window.yandexMap.geocode((props.address || '').replace(/\s+/g, ' ').trim()).then((res) => {
          var [coord1, cord2] = res.geoObjects.get(0).geometry.getCoordinates();
      
          marker.value = [cord2.toPrecision(8), coord1.toPrecision(8)]
          center.value = [cord2.toPrecision(8), coord1.toPrecision(8)]
        })
        .catch(console.log)
      } else {
        marker.value = center.value
      }
    })
    .catch(console.log)
  })

</script>
<style scoped>
  .marker {
    position: relative;
    width: 34px;
    height: 41px;
    background-image: url("/src/shared/assets/images/mark.png");
    text-align: center;
    color: #fff;
    font-weight: bold;
    line-height: 20px;
    cursor: pointer;
  }

  .close {
    background: rgb(67, 160, 71);
    background-image: -moz-linear-gradient(top, rgba(67, 160, 71, 1) 0%, rgba(56, 142, 60, 1) 100%);
    background-image: -webkit-linear-gradient(top, rgba(67, 160, 71, 1) 0%, rgba(56, 142, 60, 1) 100%);
    background-image: linear-gradient(to bottom, rgba(67, 160, 71, 1) 0%, rgba(56, 142, 60, 1) 100%);
    filter: progid: DXImageTransform.Microsoft.gradient( startColorstr='#43a047', endColorstr='#388e3c', GradientType=0);
    cursor: pointer;
    font-family: "Lato";
    padding: 7px 22px 11px;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    border: 1px solid #328436;
    -webkit-transition-property: background;
    -webkit-transition-duration: 0.5s;
    -webkit-transition-timing-function: ease;
  }

  .close:hover {
    background: #328436 !important;
    color: #ffffff !important;
    border: 1px solid #328436 !important;
  }

</style>