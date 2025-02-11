<template>
    <div class="homeFromFile w-full">
        <div class="homeFromFile__title font-bold mb-5">
            Дома найденые в файле
        </div>
        <InputText disabled :value="fileHouseName" class="w-full mb-5" />
        <!-- <div class="isImport flex items-center">
            <label for="isImport" class="mr-5">Импортировать</label>
            <InputSwitch id="isImport" v-model="isImport" />
        </div> -->
    </div>
    <div class="homeFromJW flex flex-col">
        <div class="homeFromJW__title mb-5 font-bold">Дома в JoyWork</div>
        <Dropdown @change="$emit('chooseHouse', $event.value.id)" v-model="homeFromFile" :options="housesList" placeholder="Выберите дом из системы JoyWork" :pt="{
            root: {
                class: ['h-max'],
            },
            input: {
                class: ['h-max'],
            },
        }">
            <template #dropdownicon>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                        fill="#9E9E9E" />
                    <path
                        d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                        fill="#9E9E9E" />
                    <path
                        d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                        fill="#9E9E9E" />
                </svg>
            </template>
            <template #value="slotProps">
                <div class="home w-full grid grid-cols-[100px,_1fr] gap-3.5" v-if="slotProps.value">
                    <div class="home__image">
                        <img v-if="slotProps.value.image_url" :src="slotProps.value.image_url" alt="">
                        <img style="width: 70px" v-else src="@/shared/assets/images/complexes/gallery.svg" alt="" />
                    </div>
                    <div class="home__content">
                        <div class="home__title">{{ slotProps.value.complex_name }} - {{ slotProps.value.name }}</div>
                        <div class="home__address">{{ slotProps.value.complex_address }}</div>
                        <div class="home__description">
                            {{ slotProps.value.total_rooms }} квартир - от
                            {{ slotProps.value.min_room_amount }} руб.
                            {{ slotProps.value.development_end_quarter }} квартал {{
                                slotProps.value.development_end_year }}
                        </div>
                    </div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="home w-full grid grid-cols-[100px,_1fr] gap-3.5">
                    <div class="home__image">
                        <img v-if="slotProps.option.image_url" :src="slotProps.option.image_url" alt="">
                        <img style="width: 70px" v-else src="@/shared/assets/images/complexes/gallery.svg" alt="" />
                    </div>
                    <div class="home__content flex flex-col">
                        <div class="home__title text-black">
                            {{ slotProps.option.complex_name }} - {{ slotProps.option.name }}
                        </div>
                        <div class="home__address text-sm">
                            {{ slotProps.option.complex_address }}
                        </div>
                        <div class="home__description text-sm">
                            {{ slotProps.option.total_rooms }} квартир - от
                            {{ slotProps.option.min_room_amount }} руб.
                            <template v-if="slotProps.option.development_end_quarter">
                                {{ slotProps.option.development_end_quarter }} квартал {{
                                    slotProps.option.development_end_year }}
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </Dropdown>
        <Button class="addHome flex items-center gap-x-2 mt-5 !text-black !px-0" text plain
            @click.stop="$emit('open:create-home')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                    fill="#4CAF50" />
            </svg>
            Создать дом
        </Button>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    fileHouseName: String,
    houseId: String | Number,
    housesList: Array
});

const homeFromFile = ref("");
const isImport = ref(false);

watch(() => props.housesList, () => {
    homeFromFile.value = props.housesList.find((house) => house.id == props.houseId)
}, { immediate: true })
</script>