<template>
  <div class="container">
    <!-- <div class="primary-btn" @click="openReqModal">CallModal</div> -->
    <!-- <IframeNavbar /> -->
    <!-- <ListItemsIframe /> -->
    <!-- <ApartmentListIframe /> -->
    <ApartmentDetailIframe />
    <!-- <IframeApartmentType /> -->
    <!-- <requestModal @close="closeModal" :isOpen="isOpen" :info="info" /> -->
  </div>
</template>

<script>
// import IframeNavbar from '@/components/IframeNavbar.vue';
// import SearchForm from '@/components/SearchForm.vue';
// import ListItemsIframe from '@/widgets/ListItemsIframe.vue';
// import ApartmentListIframe from '@/pages/ApartmentListIframe.vue';
import ApartmentDetailIframe from '@/pages/ApartmentDetailIframe.vue';
// import IframeApartmentType from '@/components/IframeApartmentType.vue';
// import requestModal from '../UI/requestModal.vue';
export default {
  name: 'TestLayout',
  components: {
    // IframeNavbar,
    // SearchForm,
    // ListItemsIframe
    // ApartmentListIframe
    ApartmentDetailIframe
    // IframeApartmentType
    // requestModal
  },
  data() {
    return {
      info: {
        complexName: "Тестовый ЖК 123",
        houseName: "Тестовый дом 123",
        entranceName: "Тестовый подъезд 123",
        roomNumber: "123",
      },
      isOpen: false
    }
  },
  methods: {
    openReqModal() {
      this.isOpen = true
    },
    closeModal() {
      this.isOpen = false
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 70px;
  max-width: 100%;
  padding: 100px 100px;
  /* margin-left: 50px;
  margin-top: 50px; */
}

</style>