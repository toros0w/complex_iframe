<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div  class="modal-content">
      <div v-if="openCongMess" class="infoModal">
        <div class="infoModal-content">
          <p>Ваше заявка  отправлено</p>
          <p>Скоро с вами свяжется наш менеджер!</p>
        </div>
      </div>
      <span class="request-title">Забронировать</span>
      <div class="wrapper">
        <div class="request-row">
          <slot name="name-input">
            <InputText 
              id="fullName" 
              v-model="fullName" 
              @input="formatFullName" 
              placeholder="Введите ваше имя"
              :class="errors.fullName ? 'input-error' : ''"
            />
          </slot>
        </div>
        
        <div class="request-row">
          <slot name="phone-input">
            <InputMask 
              id="phone" 
              v-model="phoneNumber" 
              mask="+7 (999) 999-9999" 
              placeholder="+7 (999) 999-99-99 "
              :class="errors.phoneNumber ? 'input-error' : ''"
            />
          </slot>
        </div>
        
        <button class="close-req-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.8281 20L31.4141 11.4141C32.1953 10.6328 32.1953 9.36719 31.4141 8.58594C30.6328 7.80469 29.3672 7.80469 28.5859 8.58594L20 17.1719L11.4141 8.58594C10.6328 7.80469 9.36719 7.80469 8.58594 8.58594C7.80469 9.36719 7.80469 10.6328 8.58594 11.4141L17.1719 20L8.58594 28.5859C7.80469 29.3672 7.80469 30.6328 8.58594 31.4141C8.97656 31.8047 9.48828 32 10 32C10.5117 32 11.0234 31.8047 11.4141 31.4141L20 22.8281L28.5859 31.4141C28.9766 31.8047 29.4883 32 30 32C30.5117 32 31.0234 31.8047 31.4141 31.4141C32.1953 30.6328 32.1953 29.3672 31.4141 28.5859L22.8281 20Z" fill="#757575"></path>
          </svg>
          </button>
      </div>
      <div class="primary-btn" @click="submitForm">Создать заявку</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import api from "@/shared/api";

export default {
  props: {
    isOpen: Boolean,
    info: {
      type: Object,
      required: true,
    }
  },
  components: {
    InputText,
    InputMask,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const fullName = ref("");
    const phoneNumber = ref("");
    const errors = ref({ fullName: false, phoneNumber: false });
    const router = useRoute();
    const token = router.params.token || 'c5c567a2b70a0e1a83ae0c30e1ed677b';
    const openCongMess = ref(false);
    const formatFullName = (event) => {
      let value = event.target.value;
      value = value.replace(/[^А-Яа-яЁё\s-]/g, " ");
      value = value
        .split(/\s+/)
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""))
        .join(" ");
      fullName.value = value;
    };

    const validateForm = () => {
      errors.value.fullName = fullName.value.trim().split(" ").length < 1;
      errors.value.phoneNumber = !/^\+7 \(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber.value);
      return !errors.value.fullName && !errors.value.phoneNumber;
    };

    const submitForm = async () => {
      if (!validateForm()) return;

      const formData = new FormData();
      // const formatedPhoneNumber = phoneNumber.replace(/\D/g, "").replace(/^7/, "7");
      const formatedPhoneNumber = "+" + String(phoneNumber.value || "").replace(/\D/g, "").replace(/^7/, "7");
      console.log(formatedPhoneNumber);
      formData.append("token", token);
      formData.append("full_name", fullName.value);
      formData.append("phone_number", formatedPhoneNumber);
      formData.append("complex_name", props.info.complexName);
      formData.append("house_name", props.info.houseName);
      formData.append("entrance_name", props.info.entranceName);
      formData.append("room_number", props.info.roomNumber);

      try {
        const response = await api.createRequisition(formData);
        console.log("Ответ API:", response);
        openCongMess.value = true;
        setTimeout(() => {
          emit('close')
          openCongMess.value = false;
                }, 3000);
        fullName.value = "";
        phoneNumber.value = "";
      } catch (error) {
        console.error("Ошибка при отправке заявки:", error);
      }

    };
    return { fullName, phoneNumber, formatFullName, submitForm, errors ,openCongMess };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
    width: 600px;
    height: 350px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 25px;
    align-items: center;
}
.request-title {
  font-size: 24px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  width: 90%;

}
.request-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
  gap:20px;
  input{
    width: 100%;
    height: 55px;
  }
}

.close-req-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.input-error {
  border: 1px solid red;
}

.infoModal{
  background: #ffffff;
  width: 100%;
  position: absolute;
  height: 80%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.infoModal-content{
  width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 21px;
}


@media screen and (max-width: 768px ) {
  .modal-content{
    width: 480px;
    gap: 30px;
    .request-title{
      font-size: 18px;
    }
  }
}
@media screen and (max-width: 500px ) {
  .modal-content{
   gap: 10px;
   width: 280px;
   text-align: center;
    input{
      text-align: center;
    }
  }
  .infoModal-content{
    font-size: 16px;
}
}
</style>