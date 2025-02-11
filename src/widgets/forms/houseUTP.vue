<template>
    <div class="utp">
        <div v-if="isPreview" class="preview">
            <div
                style="margin: 0; display: flex; gap: 5px; align-items: center"
                class="text-sm"
            >
                <MyButton class="delete-btn" style="align-items: start" @click.prevent="$emit('delete-utp', $event)" v-tooltip.top="'Удалить УТП'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        </path>
                    </svg>
                </MyButton>
                <div v-tooltip.top="localUtp.title" style="text-wrap: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 135px;">
                    {{ localUtp.title }}
                </div>
            </div>
            <template v-if="localUtp.photo">
                <img
                    style="max-width: 220px;"
                    :src="typeof localUtp.photo == 'string' ? localUtp.photo : photoToObjectUrl(localUtp.photo)"
                    alt=""
                >
            </template>
            <img
                v-tooltip.top="'Редактировать УТП'"
                @click.stop="isPreview = false"
                style="cursor: pointer; margin-top: 5px;"
                width="18px"
                src="@/shared/assets/images/complexes/edit.svg"
                alt=""
            >
        </div>

        <template v-else>
            <InputText
                v-model="localUtp.title"
                @input="errors.titleUtp = false"
                :class="{ 'p-invalid': errors.titleUtp }"
                type="text"
                placeholder="Заголовок описания"
                class="w-full"
            />
            <small
                v-if="errors.titleUtp"
                class="small_text p-invalid"
            >
                Введите заголовок УТП
            </small>
            <Textarea
                v-model="localUtp.desc"
                placeholder="Описание"
                autoResize
                class="w-full"
            />
            <template v-if="!localUtp.photo">
                <input @change="onImagesAdded" accept="image/*" type="file" class="hidden" ref="editInput" />
                <MyButton @click.stop="handleAddImageClick" :theme="'green'" class="text-sm">
                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                            fill="white" />
                    </svg>

                    Добавить изображение
                </MyButton>
            </template>
            <div v-else class="house-photo-container">
                <img class="house-photo" :src="typeof localUtp.photo == 'string' ? localUtp.photo : photoToObjectUrl(localUtp.photo)" alt="">
                <div @click.stop="localUtp.photo = null" class="house-photo-overlay"><img
                        src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
            </div>

            <div class="item__btns" style="margin-top: 10px;">
                <MyButton class="item__save" :theme="'green'"
                    @click.prevent="handleSave">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.5325 6.9675L11.0325 2.4675C10.9634 2.40004 10.8819 2.34656 10.7925 2.31C10.6995 2.27221 10.6004 2.25187 10.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H13.5C14.0967 15.75 14.669 15.5129 15.091 15.091C15.5129 14.669 15.75 14.0967 15.75 13.5V7.5C15.7506 7.4013 15.7317 7.30345 15.6943 7.21207C15.657 7.12069 15.602 7.03758 15.5325 6.9675ZM6.75 3.75H9.75V5.25H6.75V3.75ZM11.25 14.25H6.75V12C6.75 11.8011 6.82902 11.6103 6.96967 11.4697C7.11032 11.329 7.30109 11.25 7.5 11.25H10.5C10.6989 11.25 10.8897 11.329 11.0303 11.4697C11.171 11.6103 11.25 11.8011 11.25 12V14.25ZM14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25H12.75V12C12.75 11.4033 12.5129 10.831 12.091 10.409C11.669 9.98705 11.0967 9.75 10.5 9.75H7.5C6.90326 9.75 6.33097 9.98705 5.90901 10.409C5.48705 10.831 5.25 11.4033 5.25 12V14.25H4.5C4.30109 14.25 4.11032 14.171 3.96967 14.0303C3.82902 13.8897 3.75 13.6989 3.75 13.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H5.25V6C5.25 6.19891 5.32902 6.38968 5.46967 6.53033C5.61032 6.67098 5.80109 6.75 6 6.75H10.5C10.6989 6.75 10.8897 6.67098 11.0303 6.53033C11.171 6.38968 11.25 6.19891 11.25 6V4.8075L14.25 7.8075V13.5Z"
                            fill="white" />
                    </svg>
                    Сохранить
                </MyButton>
                <MyButton :theme="'grey-icon'" class="item__discard" @click.prevent="handleDiscard">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.0575 8.99999L13.2825 5.78249C13.4237 5.64126 13.503 5.44971 13.503 5.24999C13.503 5.05026 13.4237 4.85871 13.2825 4.71749C13.1412 4.57626 12.9497 4.49692 12.75 4.49692C12.5502 4.49692 12.3587 4.57626 12.2175 4.71749L8.99995 7.94249L5.78245 4.71749C5.64123 4.57626 5.44968 4.49692 5.24995 4.49692C5.05023 4.49692 4.85868 4.57626 4.71745 4.71749C4.57623 4.85871 4.49689 5.05026 4.49689 5.24999C4.49689 5.44971 4.57623 5.64126 4.71745 5.78249L7.94245 8.99999L4.71745 12.2175C4.64716 12.2872 4.59136 12.3702 4.55329 12.4616C4.51521 12.5529 4.49561 12.651 4.49561 12.75C4.49561 12.849 4.51521 12.947 4.55329 13.0384C4.59136 13.1298 4.64716 13.2128 4.71745 13.2825C4.78718 13.3528 4.87013 13.4086 4.96152 13.4467C5.05292 13.4847 5.15095 13.5043 5.24995 13.5043C5.34896 13.5043 5.44699 13.4847 5.53839 13.4467C5.62978 13.4086 5.71273 13.3528 5.78245 13.2825L8.99995 10.0575L12.2175 13.2825C12.2872 13.3528 12.3701 13.4086 12.4615 13.4467C12.5529 13.4847 12.6509 13.5043 12.75 13.5043C12.849 13.5043 12.947 13.4847 13.0384 13.4467C13.1298 13.4086 13.2127 13.3528 13.2825 13.2825C13.3527 13.2128 13.4085 13.1298 13.4466 13.0384C13.4847 12.947 13.5043 12.849 13.5043 12.75C13.5043 12.651 13.4847 12.5529 13.4466 12.4616C13.4085 12.3702 13.3527 12.2872 13.2825 12.2175L10.0575 8.99999Z"
                            fill="#666666" />
                    </svg>
                </MyButton>
            </div>
        </template>
        <ConfirmPopup group="deleteUTP" :pt="confirmpopupStyle"></ConfirmPopup>
    </div>
</template>
<script setup>
import { confirmpopupStyle, photoToObjectUrl } from '@/shared/utils/util';
import ConfirmPopup from 'primevue/confirmpopup';
import { onMounted, watch } from 'vue';
import { toRefs } from 'vue';
import { ref } from 'vue';

const props = defineProps({
    errors: {
        type: Object,
        default: () => ({})
    },
    utp: {
        type: Object,
        default: {
            id: null,
            photo: null,
            desc: null,
            title: null
        }
    }
})

const emits = defineEmits(["delete-house-utp", "save-utp"])
const editInput = ref()
const isPreview = ref(true)
const localUtp = ref({
    photo: null,
    desc: null,
    title: null
})

const handleAddImageClick = () => editInput.value.click()

const onImagesAdded = (e) => {
  if (!e.target.files.length) return;

  localUtp.value.photo = e.target.files[0]
}

const handleSave = () => {
    if (!localUtp.value.title) {
        props.errors.titleUtp = true
    } else {
        emits('update-utp', localUtp.value);
        isPreview.value = true
    }
}

const handleDiscard = () => {
    isPreview.value = true

    localUtp.value.desc = props.utp.desc
    localUtp.value.title = props.utp.title
    localUtp.value.photo = props.utp.photo
}

onMounted(() => {
    localUtp.value.id = props.utp.id
    localUtp.value.desc = props.utp.desc
    localUtp.value.title = props.utp.title
    localUtp.value.photo = props.utp.photo
})

watch(() => props.utp, () => {
    localUtp.value.id = props.utp.id
    localUtp.value.desc = props.utp.desc
    localUtp.value.title = props.utp.title
    localUtp.value.photo = props.utp.photo
})
</script>

<style lang="scss" scoped>
.utp {
    .preview {
        display: flex;
        align-items: start;
        gap: 20px;
        justify-content: space-between;

        .delete-btn {
            padding: 0px !important;
        }
    }
}
</style>