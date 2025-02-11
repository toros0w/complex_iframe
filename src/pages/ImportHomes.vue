<template>
  <div class="importHome bg-white">
    <div class="importHome__title">Импорт помещений</div>
    <Steps :active-item="activeItem" :items="stepItems" />
    <div class="tabContent w-full mt-7.5">
      <template v-if="!uploadedFileInfo.is_processing">
        <UploadStep
          v-if="activeItem === 1"
          :isRequesting="isRequesting"
          @update:active-item="activeItem = $event"
          @done:comparison-prepared="handlePrepared" @updateImport="updateImport"
        />
        <FieldStep
          v-if="activeItem === 2"
          :isRequesting="isRequesting"
          @update:active-item="activeItem = $event"
          @updateImport="updateImport"
          :data="uploadedFileInfo"
        />
        <ObjectStep
          v-if="activeItem === 3"
          :isRequesting="isRequesting"
          @update:active-item="activeItem = $event"
          @updateImport="updateImport"
          @open:create-home="(key) => {
            isCreateHomeOpen = true
            formAddHome.open()
            keyToUseWhileAddingHouse = key;
          }"
          :houses="housesList"
          :fileHousesMapping="uploadedFileInfo.house_name_to_id"
          @setHouse="uploadedFileInfo.house_name_to_id = $event"
        />
        <StatusStep
          v-if="activeItem === 4 && uploadedFileInfo.dynamic_fields"
          :isRequesting="isRequesting"
          @update:active-item="activeItem = $event"
          @updateImport="updateImport"
          :statusesFromFile="uploadedFileInfo.dynamic_fields.complex_status_id"
          :typesFromFile="uploadedFileInfo.dynamic_fields.type"
        />
      </template>
      <div class="loadingScreen" v-else>
        <div class="loadingScreen__content">
          <div class="loadingScreen__title">
            Вы загрузили файл.
          </div>
          <div class="loadingScreen__text max-w-[318px]">
            Идет обработка и автоматическое распознавание файла. Процесс может
            занимать от 1 до 10 минут.
          </div>
          <div style="width: 320px; margin-top: 10px">
            <Loader />
          </div>
        </div>
        <Message :closable="false" severity="info" :pt="{ root: { class: ['!bg-blue-100 !border-blue-500'] } }">
          <template #messageicon>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
              <path
                d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74965 11.4489 9.74965 11.25V9C9.74965 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.293 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74965 6.89834 9.74965 6.75C9.74965 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57758 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
                fill="#3A8EFA" />
            </svg>
          </template>
          <template #default>
            Смотрите пошаговые инструкции по созданию шахматки в Базе знаний.
            Клиентская поддержка: 8 800 201 89 61 (бесплатно из России).
          </template>
        </Message>
        <MyButton :theme="'green'" @click="emits('update:activeItem', 0)">Прервать и загрузить другой файл</MyButton>
      </div>
    </div>
    <FormAddHome :isOpen="isCreateHomeOpen" ref="formAddHome" @close-model="isCreateHomeOpen = !isCreateHomeOpen"
      @add_house="add_house" />
  </div>
  <Toast />
</template>

<script setup>
import UploadStep from "@/widgets/importSteps/uploadStep.vue";
import FieldStep from "@/widgets/importSteps/fieldStep.vue";
import ObjectStep from "@/widgets/importSteps/objectStep.vue";
import StatusStep from "@/widgets/importSteps/statusStep.vue";
import { onMounted, ref, watch } from "vue";
import FormAddHome from "@/widgets/forms/formAddHome.vue";
import api from "@/shared/api";
import { generateAlphabetSequence } from "@/shared/utils/util";
import { useRoute, useRouter } from "vue-router";
import Loader from "@/components/Loader.vue";
import Steps from "@/widgets/steps.vue";
import { useToast } from "primevue/usetoast";

const uploadedFileInfo = ref({
  body: null,
  head: null
})
const keyToUseWhileAddingHouse = ref()
const isRequesting = ref()
const router = useRouter()
const route = useRoute()
const toast = useToast();

const handlePrepared = (inputData) => {
  if (!inputData) return;

  api.getHouseImport(inputData.id).then((response) => {
    uploadedFileInfo.value.body = response.data.document_preview.body.map((data, index) => ({
      items: data,
      initialIndex: index
    }))

    uploadedFileInfo.value.head = generateAlphabetSequence(response.data.document_preview.head.length);
    uploadedFileInfo.value.import_id = response.data.id;
    uploadedFileInfo.value.created_at = response.data.created_at;
    uploadedFileInfo.value.is_processing = response.data.status.includes('in_progress')
    uploadedFileInfo.value.house_name_to_id = response.data.house_name_to_id
    uploadedFileInfo.value.dynamic_fields = response.data.dynamic_fields

    router.replace({ query: { import_id: inputData.id } })
    activeItem.value = inputData.step
  })

}

const add_house = (house_id) => {
  api.getAllHouses()
    .then((response) => {
      if (keyToUseWhileAddingHouse.value) {
        uploadedFileInfo.value.house_name_to_id[keyToUseWhileAddingHouse.value] = house_id
      } else {
        uploadedFileInfo.value.house_name_to_id = house_id
      }

      housesList.value = response.data

      isCreateHomeOpen.value = false
    })
}

const isCreateHomeOpen = ref(false)
const formAddHome = ref(null)
const activeItem = ref(1);
const housesList = ref([])
const stepItems = [
  {
    id: 1,
    text: "Загрузка файла",
  },
  {
    id: 2,
    text: "Сопоставление полей",
  },
  {
    id: 3,
    text: "Объекты",
  },
  {
    id: 4,
    text: "Статусы и типы",
  },
  {
    id: 5,
    text: "Завершение",
  },
];

onMounted(() => {
  api.getAllHouses()
    .then((response) => {
      housesList.value = response.data
    })

  if (route.query.import_id) {
    api.getHouseImport(route.query.import_id).then((importData) => {
      if (!importData.data.id) {
        router.replace({ query: {} });
      } else {
        uploadedFileInfo.value.body = importData.data.document_preview.body.map((data, index) => ({
          items: data,
          initialIndex: index
        }))
        uploadedFileInfo.value.head = importData.data.document_preview.head
        uploadedFileInfo.value.import_id = importData.data.id
        uploadedFileInfo.value.step = importData.data.step
        uploadedFileInfo.value.created_at = importData.data.created_at
        uploadedFileInfo.value.mapping_fields = importData.data.mapping_fields
        uploadedFileInfo.value.is_processing = importData.data.status.includes('in_progress')
        uploadedFileInfo.value.house_name_to_id = importData.data.house_name_to_id
        uploadedFileInfo.value.dynamic_fields = importData.data.dynamic_fields
        activeItem.value = importData.data.step
      }

      if (importData.data.status == 'done' && importData.data.step == 5) {
        router.push('/my-objects')
      }
    })
  }
})

watch(() => uploadedFileInfo.value.is_processing, () => {
  if (route.query.import_id && uploadedFileInfo.value.is_processing) {
    const interval = setInterval(() => {
      api.getHouseImportStatus(route.query.import_id).then((response) => {
        if (response.data.status.includes('done')) {
          clearInterval(interval)
          api.getHouseImport(route.query.import_id)
            .then((importData) => {
              uploadedFileInfo.value.import_id = importData.data.id
              uploadedFileInfo.value.step = importData.data.step
              uploadedFileInfo.value.created_at = importData.data.created_at
              uploadedFileInfo.value.mapping_fields = importData.data.mapping_fields
              uploadedFileInfo.value.is_processing = importData.data.status.includes('in_progress')
              uploadedFileInfo.value.house_name_to_id = importData.data.house_name_to_id
              uploadedFileInfo.value.dynamic_fields = importData.data.dynamic_fields
              activeItem.value = importData.data.step

              if (importData.data.status == 'done' && importData.data.step == 5) {
                toast.add({ severity: 'success', summary: 'Импорт заверщен', detail: 'Импорт помещений успешно завершен', life: 3000 });
                router.push('/my-objects')
              }
            })
        } else {
          uploadedFileInfo.value.is_processing = !response.data.status || response.data.status.includes('in_progress')
        }
      })
    }, 2000)
  }
})

const updateImport = (fields) => {
  isRequesting.value = true
  api.updateHouseImport(route.query.import_id, fields)
    .then(() => {
      api.getHouseImportStatus(route.query.import_id)
        .then((response) => {
          uploadedFileInfo.value.is_processing = response.data.status.includes('in_progress')

          activeItem.value = response.data.step
        });
    }).finally(() => isRequesting.value = false)
}
</script>

<style scoped lang="scss">
.importHome {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 30px;
  overflow-y: scroll;

  &__title {
    font-size: 32px;
    margin-bottom: 30px;
  }
}

</style>