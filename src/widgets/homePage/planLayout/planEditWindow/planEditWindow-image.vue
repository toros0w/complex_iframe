<template>
  <div class="editImage">
    <div class="editImage__listImages">
      <Message
        v-if="images.length === 0"
        class="max-w-[900px]"
        :closable="false"
      >
        <template #messageicon>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-[40px] h-auto mr-2.5"
          >
            <path
              d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74965 11.4489 9.74965 11.25V9C9.74965 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.293 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74965 6.89834 9.74965 6.75C9.74965 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57758 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
              fill="#3A8EFA"
            />
          </svg>
        </template>
        <template #default>
          У вас нет загруженных изображений планировки, загрузите хотя бы одно.
          Рекомендуемый размер изображения 1000*1000 пикселей. Без пустых или
          белых полей в формате jpeg, jpg, png. Вес одного изображения не должен
          превышать 500 кб.
        </template>
      </Message>
      <div
        class="imageItem"
        :draggable="true"
        v-for="image in sortImages"
        :key="image.id"
        @dragstart="dragStartHandler($event, image)"
        @dragleave="dragEndHandler($event)"
        @dragend="dragEndHandler($event)"
        @dragover="dragOverHandler($event)"
        @drop="dropHandler($event, image)"
      >
        <div class="imageItem__iconDrag">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.375 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H15.375C15.7202 8.625 16 8.34519 16 8C16 7.65481 15.7202 7.375 15.375 7.375Z"
              fill="#9E9E9E"
            />
            <path
              d="M15.375 2.375H0.625C0.279813 2.375 0 2.65481 0 3C0 3.34519 0.279813 3.625 0.625 3.625H15.375C15.7202 3.625 16 3.34519 16 3C16 2.65481 15.7202 2.375 15.375 2.375Z"
              fill="#9E9E9E"
            />
            <path
              d="M15.375 12.375H0.625C0.279813 12.375 0 12.6548 0 13C0 13.3452 0.279813 13.625 0.625 13.625H15.375C15.7202 13.625 16 13.3452 16 13C16 12.6548 15.7202 12.375 15.375 12.375Z"
              fill="#9E9E9E"
            />
          </svg>
        </div>
        <div class="imageItem__img">
          <img :src="image.url" alt="" />
        </div>
        <div class="imageItem__field">
          <label for="codePlan" class="mb-2">Наименование планировки</label>
          <InputText id="codePlan" disabled v-model="image.name" class="w-full" />
        </div>
        <div class="imageItem__info" v-if="image === sortImages[0]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.29974 11.9002L2.56641 8.16689L3.28307 7.45023L6.29974 10.4669L12.6997 4.06689L13.4164 4.78356L6.29974 11.9002Z"
              fill="#333333"
            />
          </svg>
          Основные
        </div>
        <Button
          severity="danger"
          class="imageItem__btnDelete ml-auto"
          @click="deleteImage(image.id)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 13.5C7.69891 13.5 7.88968 13.421 8.03033 13.2803C8.17098 13.1397 8.25 12.9489 8.25 12.75V8.25C8.25 8.05109 8.17098 7.86032 8.03033 7.71967C7.88968 7.57902 7.69891 7.5 7.5 7.5C7.30109 7.5 7.11032 7.57902 6.96967 7.71967C6.82902 7.86032 6.75 8.05109 6.75 8.25V12.75C6.75 12.9489 6.82902 13.1397 6.96967 13.2803C7.11032 13.421 7.30109 13.5 7.5 13.5ZM15 4.5H12V3.75C12 3.15326 11.7629 2.58097 11.341 2.15901C10.919 1.73705 10.3467 1.5 9.75 1.5H8.25C7.65326 1.5 7.08097 1.73705 6.65901 2.15901C6.23705 2.58097 6 3.15326 6 3.75V4.5H3C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25C2.25 5.44891 2.32902 5.63968 2.46967 5.78033C2.61032 5.92098 2.80109 6 3 6H3.75V14.25C3.75 14.8467 3.98705 15.419 4.40901 15.841C4.83097 16.2629 5.40326 16.5 6 16.5H12C12.5967 16.5 13.169 16.2629 13.591 15.841C14.0129 15.419 14.25 14.8467 14.25 14.25V6H15C15.1989 6 15.3897 5.92098 15.5303 5.78033C15.671 5.63968 15.75 5.44891 15.75 5.25C15.75 5.05109 15.671 4.86032 15.5303 4.71967C15.3897 4.57902 15.1989 4.5 15 4.5ZM7.5 3.75C7.5 3.55109 7.57902 3.36032 7.71967 3.21967C7.86032 3.07902 8.05109 3 8.25 3H9.75C9.94891 3 10.1397 3.07902 10.2803 3.21967C10.421 3.36032 10.5 3.55109 10.5 3.75V4.5H7.5V3.75ZM12.75 14.25C12.75 14.4489 12.671 14.6397 12.5303 14.7803C12.3897 14.921 12.1989 15 12 15H6C5.80109 15 5.61032 14.921 5.46967 14.7803C5.32902 14.6397 5.25 14.4489 5.25 14.25V6H12.75V14.25ZM10.5 13.5C10.6989 13.5 10.8897 13.421 11.0303 13.2803C11.171 13.1397 11.25 12.9489 11.25 12.75V8.25C11.25 8.05109 11.171 7.86032 11.0303 7.71967C10.8897 7.57902 10.6989 7.5 10.5 7.5C10.3011 7.5 10.1103 7.57902 9.96967 7.71967C9.82902 7.86032 9.75 8.05109 9.75 8.25V12.75C9.75 12.9489 9.82902 13.1397 9.96967 13.2803C10.1103 13.421 10.3011 13.5 10.5 13.5Z"
              fill="white"
            />
          </svg>
        </Button>
      </div>
    </div>
    <div class="fileUpload">
      <input type="file" name="" @change="uploadFile" id="" multiple ref="inputFile" class="hidden" />
      <Button severity="secondary" @click="openUploadInput()"
        >Добавить изображение</Button
      >
    </div>
  </div>
</template>

<script setup>
import api from "@/shared/api";
import axios from "axios";
import { computed, nextTick, onMounted, ref } from "vue";

const props = defineProps({
  formData: Object,
  plan: Object
})

const images = ref([]);
const currentImage = ref({
  id: 0,
  url: "",
  position: 0,
  name: "",
});

const inputFile = ref(HTMLInputElement);

const openUploadInput = () => {
  if (inputFile.value) {
    inputFile.value.value = null;
    inputFile.value.click();
  }
}
const uploadFile = (e) => {
  if (inputFile.value) {
      const files = (e.target).files;
      let counter = props.plan.images.length
      if (files && files.length !== 0) {
        Array.from(files).forEach((file) => {
          counter++
          addImage(file, counter);
        })
      }
  }
};
const addImage = (file, position) => {
  var bodyFormData = new FormData();
  bodyFormData.append("plan_id", props.plan.id);
  bodyFormData.append("position", position);
  bodyFormData.append("photos[]", file);

  api.addPhotoRomRoomPlan(bodyFormData)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        props.plan.images.push(...response.data)
        images.value.push(...response.data)
      }
    })
};

const dragStartHandler = (event, imageItem) => {
  currentImage.value = imageItem;
};
const dragEndHandler = (event) => {
  (event.target).style.backgroundColor = "#ffffff";
};
const dragOverHandler = (event) => {
  event.preventDefault();
  (event.target).style.backgroundColor = "#F6F6F6";
};
const dropHandler = (event, imageItem) => {
  event.preventDefault();
  images.value = images.value.map((image) => {
    if (image.id === imageItem.id) {
      return { ...image, position: currentImage.value.position };
    }
    if (image.id === currentImage.value?.id) {
      return { ...image, position: imageItem.position };
    }
  nextTick(() => {
    sortImages.value.forEach((image, index) => {
      
      api.updateRoomPlanPhotoPosition(image.id, index + 1)
        .then((response) => {
          if (response.data) {}
        })
    })
  })

    

    return image;
  });

  (event.target).style.backgroundColor = "#ffffff";
};
const sortImages = computed(() => {
  return [...images.value].sort((a, b) => {
    if (a.position > b.position) {
      return 1;
    } else {
      return -1;
    }
  });
});

const deleteImage = (id) => {
  api.deleteRoomPlanPhoto(id)
    .then((response) => {
      if (response.data) {
        const index = images.value.findIndex((el) => el.id === id);
        images.value.splice(index, 1);

        props.plan.images.splice(index, 1);
      }
    })
  
};

onMounted(() => {
  images.value.push(...(props.plan.images || []))
})
</script>

<style scoped lang="scss">
.editImage {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &__listImages {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 30px;
    row-gap: 30px;

    .imageItem {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 6px;
      border: 1px solid #dedede;
      padding: 18px 14px;
      column-gap: 26px;

      &__iconDrag {
        width: 16px;
        height: 16px;
        cursor: grab;
        svg {
          width: 100%;
          height: 100%;
        }
      }

      &__img {
        width: 56px;
        height: auto;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &__field {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        input {
          width: 350px;
        }
      }

      &__info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0 50px;

        svg {
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
