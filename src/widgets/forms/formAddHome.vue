<template>
  <FormLayout class="addHome" :title="titleForm" @closeModel="$emit('closeModel')" :class="isOpen ? 'open' : ''">
    <template v-slot:default>
      <form class="form addHome__form">
        <div class="form__item">
          <label for="nameHome">Название дома <span>*</span></label>
          <div class="item__content flex-col">
            <InputText @input="errors.name = false" type="text" id="nameHome" placeholder="Введите название дома"
              v-model="localHouse.name" :class="{ 'p-invalid': errors.name }" />
            <small v-if="errors.name" class="small_text p-invalid">Введите название дома</small>
          </div>
        </div>


        <div class="form__item">
          <label for="nameHome">ЖК <span>*</span></label>
          <Dropdown v-model="localHouse.complex_id" :options="complexes_list" optionLabel="name"
            optionValue="code" :class="{ 'p-invalid': errors.complex_id }">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
            <template #emptyfilter>Нет данных</template>
            <template #empty>Нет данных</template>
          </Dropdown>
          <small v-if="errors.complex_id" class="small_text p-invalid"></small>
          <small v-if="errors.complex_id" class="small_text p-invalid">Выберите ЖК</small>
        </div>

        <div class="form__item">
          <label for="dom_click_id">ID Дома на ДомКлик</label>
          <div class="item__content flex-col">
            <InputText type="text" id="dom_click_id" placeholder="Введите идентификатор дома/корпуса" v-model="localHouse.domclick_id" />
          </div>
        </div>
        <div class="form__item">
          <label for="cian_id">ID Дома на ЦИАН</label>
          <div class="item__content flex-col">
            <InputText type="text" id="cian_id" placeholder="Введите идентификатор дома/корпуса" v-model="localHouse.cian_id" />
          </div>
        </div>
        <div class="form__item">
          <label for="avito_id">ID Дома на Авито</label>
          <div class="item__content flex-col">
            <InputText type="text" id="avito_id" placeholder="Введите идентификатор дома/корпуса" v-model="localHouse.avito_id" />
          </div>
        </div>
        <div class="form__item">
          <label for="yandex_id">ID Дома на Я.Недвижимость</label>
          <div class="item__content flex-col">
            <InputText type="text" id="yandex_id" placeholder="Введите идентификатор дома/корпуса" v-model="localHouse.yandex_id" />
          </div>
        </div>
        <div class="form__item">
          <label for="nameHome">Тип строения </label>
          <Dropdown :options="types_building" showClear v-model="localHouse.type_building" optionLabel="name"
            optionValue="code">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
            <template #emptyfilter>Нет данных</template>
            <template #empty>Нет данных</template>
          </Dropdown>

        </div>
        <div class="form__item">
          <label>Тип помещения <span>*</span></label>
          <Dropdown :options="placement_types" optionLabel="name" optionValue="code"
            v-model="localHouse.placement_type">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
            <template #emptyfilter>Нет данных</template>
            <template #empty>Нет данных</template>
          </Dropdown>
          <small v-if="errors.complex_id" class="small_text p-invalid"></small>
          <small v-if="errors.complex_id" class="small_text p-invalid">Выберите тип помещения </small>
        </div>
        <div class="form__item">
          <label for="address">Адрес</label>
          <InputText type="text" id="address" v-model="localHouse.address" />
        </div>
        <div class="form__item">
          <label for="title">Главные УТП</label>
          <div class="item__content flex-col">
            <div class="flex-grap-group">
              <HouseUTP v-for="(utp, indexUtp) in localHouse.utps" 
                :key="indexUtp" 
                :errors="errors"
                :utp="utp"
                @updateUtp="(event) => updateUTP(event, indexUtp)"
                @deleteUtp="(event) => showTemplate(event, indexUtp, utp.id)"
              />
              <MyButton v-if="!form_add_main_utp" class="item__delete text-sm" @click.prevent="form_add_main_utp = true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                    fill="#4CAF50" />
                </svg>
                Добавить еще УТП
              </MyButton>
            </div>
            <template v-if="form_add_main_utp">
              <InputText v-model="titleUtp" @input="errors.titleUtp = false" :class="{ 'p-invalid': errors.titleUtp }"
                type="text" placeholder="Заголовок УТП" class="w-full" />
              <small v-if="errors.titleUtp" class="small_text p-invalid">Введите заголовок УТП</small>
              <Textarea v-model="descUtp" placeholder="Описание" autoResize class="w-full" />
              <MyButton v-if="!photoUtp" @click.prevent.stop="onAddPhotoClick" :theme="'green'" class="text-sm">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                    fill="white" />
                </svg>

                Добавить изображение
              </MyButton>
              <div v-else class="house-photo-container">
                <img class="house-photo" :src="photoToObjectUrl(photoUtp)" alt="">
                <div @click.stop="photoUtp = null" class="house-photo-overlay"><img
                    src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
              </div>

              <div class="item__btns">
                <MyButton :disabled="utpLoading" class="item__save" :theme="'green'" @click.prevent="saveUTP">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.5325 6.9675L11.0325 2.4675C10.9634 2.40004 10.8819 2.34656 10.7925 2.31C10.6995 2.27221 10.6004 2.25187 10.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H13.5C14.0967 15.75 14.669 15.5129 15.091 15.091C15.5129 14.669 15.75 14.0967 15.75 13.5V7.5C15.7506 7.4013 15.7317 7.30345 15.6943 7.21207C15.657 7.12069 15.602 7.03758 15.5325 6.9675ZM6.75 3.75H9.75V5.25H6.75V3.75ZM11.25 14.25H6.75V12C6.75 11.8011 6.82902 11.6103 6.96967 11.4697C7.11032 11.329 7.30109 11.25 7.5 11.25H10.5C10.6989 11.25 10.8897 11.329 11.0303 11.4697C11.171 11.6103 11.25 11.8011 11.25 12V14.25ZM14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25H12.75V12C12.75 11.4033 12.5129 10.831 12.091 10.409C11.669 9.98705 11.0967 9.75 10.5 9.75H7.5C6.90326 9.75 6.33097 9.98705 5.90901 10.409C5.48705 10.831 5.25 11.4033 5.25 12V14.25H4.5C4.30109 14.25 4.11032 14.171 3.96967 14.0303C3.82902 13.8897 3.75 13.6989 3.75 13.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H5.25V6C5.25 6.19891 5.32902 6.38968 5.46967 6.53033C5.61032 6.67098 5.80109 6.75 6 6.75H10.5C10.6989 6.75 10.8897 6.67098 11.0303 6.53033C11.171 6.38968 11.25 6.19891 11.25 6V4.8075L14.25 7.8075V13.5Z"
                      fill="white" />
                  </svg>
                  Сохранить
                </MyButton>
                <MyButton :theme="'grey-icon'" class="item__delete" @click.prevent="closeUTP">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.0575 8.99999L13.2825 5.78249C13.4237 5.64126 13.503 5.44971 13.503 5.24999C13.503 5.05026 13.4237 4.85871 13.2825 4.71749C13.1412 4.57626 12.9497 4.49692 12.75 4.49692C12.5502 4.49692 12.3587 4.57626 12.2175 4.71749L8.99995 7.94249L5.78245 4.71749C5.64123 4.57626 5.44968 4.49692 5.24995 4.49692C5.05023 4.49692 4.85868 4.57626 4.71745 4.71749C4.57623 4.85871 4.49689 5.05026 4.49689 5.24999C4.49689 5.44971 4.57623 5.64126 4.71745 5.78249L7.94245 8.99999L4.71745 12.2175C4.64716 12.2872 4.59136 12.3702 4.55329 12.4616C4.51521 12.5529 4.49561 12.651 4.49561 12.75C4.49561 12.849 4.51521 12.947 4.55329 13.0384C4.59136 13.1298 4.64716 13.2128 4.71745 13.2825C4.78718 13.3528 4.87013 13.4086 4.96152 13.4467C5.05292 13.4847 5.15095 13.5043 5.24995 13.5043C5.34896 13.5043 5.44699 13.4847 5.53839 13.4467C5.62978 13.4086 5.71273 13.3528 5.78245 13.2825L8.99995 10.0575L12.2175 13.2825C12.2872 13.3528 12.3701 13.4086 12.4615 13.4467C12.5529 13.4847 12.6509 13.5043 12.75 13.5043C12.849 13.5043 12.947 13.4847 13.0384 13.4467C13.1298 13.4086 13.2127 13.3528 13.2825 13.2825C13.3527 13.2128 13.4085 13.1298 13.4466 13.0384C13.4847 12.947 13.5043 12.849 13.5043 12.75C13.5043 12.651 13.4847 12.5529 13.4466 12.4616C13.4085 12.3702 13.3527 12.2872 13.2825 12.2175L10.0575 8.99999Z"
                      fill="#666666" />
                  </svg>
                </MyButton>
              </div>
            </template>
            <input @change="onImagesAdded" accept="image/*" type="file" class="hidden" ref="photoInput" />
          </div>
        </div>
        <!--<div class="form__item">
          <label for="nameHome">Очередь</label>
          <MyButton @click.prevent class="!items-center gap-2 !w-max text-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                fill="#4CAF50"
              />
            </svg>
            Добавить очередь
          </MyButton>
        </div>-->
        <!-- <div class="form__item">
          <label for="nameHome">Акции</label>
          <MyButton @click.prevent class="!items-center gap-2 !w-max text-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                fill="#4CAF50"
              />
            </svg>
            Добавить акцию
          </MyButton>
        </div> -->
        <!--<div class="form__item">
          <label for="nameHome">Тип отделки</label>
          <Dropdown :options="decorations" showClear optionLabel="name" optionValue="code" v-model="decoration_id">
            <template #dropdownicon>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.375 7.875H0.625C0.279813 7.875 0 8.15481 0 8.5C0 8.84519 0.279813 9.125 0.625 9.125H15.375C15.7202 9.125 16 8.84519 16 8.5C16 8.15481 15.7202 7.875 15.375 7.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 2.875H0.625C0.279813 2.875 0 3.15481 0 3.5C0 3.84519 0.279813 4.125 0.625 4.125H15.375C15.7202 4.125 16 3.84519 16 3.5C16 3.15481 15.7202 2.875 15.375 2.875Z"
                  fill="#9E9E9E"
                />
                <path
                  d="M15.375 12.875H0.625C0.279813 12.875 0 13.1548 0 13.5C0 13.8452 0.279813 14.125 0.625 14.125H15.375C15.7202 14.125 16 13.8452 16 13.5C16 13.1548 15.7202 12.875 15.375 12.875Z"
                  fill="#9E9E9E"
                />
              </svg>
            </template>
          </Dropdown>
        </div>-->
        <div class="form__item">
          <label for="house_material">Материал дома</label>
          <Dropdown id="house_material" showClear :options="house_types" optionLabel="name" optionValue="code"
            v-model="localHouse.house_type">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="has_parking">Наличие парковки</label>
          <Dropdown id="has_parking" showClear :options="[
            { name: 'Подземная', value: 'Подземная' },
            { name: 'Наземная', value: 'Наземная' },
            { name: 'Нет', value: 'Нет' },
          ]" optionLabel="name" optionValue="value" v-model="localHouse.parking">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="security_switch">Охрана</label>
          <InputSwitch id="security_switch" v-model="localHouse.security" />
        </div>
        <div class="form__item">
          <label for="has_fenced_area">Огороженная территория</label>
          <InputSwitch id="has_fenced_area" v-model="localHouse.fenced_area" />
        </div>
        <div class="form__item">
          <label for="has_sports_ground">Спортивная площадка</label>
          <InputSwitch id="has_sports_ground" v-model="localHouse.sports_ground" />
        </div>
        <div class="form__item">
          <label for="has_playground">Детская площадка</label>
          <InputSwitch id="has_playground" v-model="localHouse.play_ground" />
        </div>
        <div class="form__item">
          <label for="has_school">Школа</label>
          <InputSwitch id="has_school" v-model="localHouse.school" />
        </div>
        <div class="form__item">
          <label for="has_kindergarten">Детский сад</label>
          <InputSwitch id="has_kindergarten" v-model="localHouse.kinder_garten" />
        </div>
        <div class="form__item">
          <label for="material">Стадия строительства</label>
          <Dropdown id="material" showClear :options="status_corpus_list" optionLabel="name" optionValue="code"
            v-model="localHouse.status_corpus">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="metro">Срок сдачи</label>
          <div class="item__content flex-row">
            <Dropdown class="w-full" :options="quarter_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.deadline.quarter">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
            <Dropdown class="w-full" :options="years_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.deadline.year">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="form__item">
          <label for="metro">Начало строительства</label>
          <div class="item__content flex-row">
            <Dropdown class="w-full" :options="quarter_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.development_start.quarter">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
            <Dropdown class="w-full" :options="years_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.development_start.year">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="form__item">
          <label for="metro">Завершение строительства </label>
          <div class="item__content flex-row">
            <Dropdown class="w-full" :options="quarter_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.development_end.quarter">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
            <Dropdown class="w-full" :options="years_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.development_end.year">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="form__item">
          <label for="metro">Старт продаж</label>
          <div class="item__content flex-row">
            <Dropdown class="w-full" :options="month_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.sales_start.month">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
            <Dropdown class="w-full" :options="years_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.sales_start.year">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="form__item">
          <label for="metro">Окончание продаж</label>
          <div class="item__content flex-row">
            <Dropdown class="w-full" :options="month_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.sales_end.month">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
            <Dropdown class="w-full" :options="years_list" showClear optionLabel="name" optionValue="code"
              v-model="localHouse.sales_end.year">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="form__item">
          <label for="title">Отделка</label>
          <div class="item__content flex-col">
            <div class="flex-grap-group">
              <HouseDecoration v-for="(decoration, indexDecoration) in localHouse.decorations"
                        :key="indexDecoration"
                        :errors="errorsDecoration"
                        :decoration="decoration"
                        @updateDecoration="(event) => updateDecoration(event, indexDecoration)"
                        @deleteDecoration="(event) => showTemplateDecoration(event, indexDecoration, decoration.id)"
              />
              <MyButton v-if="!form_add_main_decoration" class="item__delete text-sm" @click.prevent="form_add_main_decoration = true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                      fill="#4CAF50" />
                </svg>
                Добавить еще отделку
              </MyButton>
            </div>
            <template v-if="form_add_main_decoration">
              <Dropdown @change="onChangeDec($event)" v-model="decoration_id" showClear :options="decorations" optionLabel="name" optionValue="code" class="w-full">
                <template #dropdownicon>
                  <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
                </template>
              </Dropdown>
              <small v-if="errors.decoration_id" class="small_text p-invalid">Выберите отделку</small>
              <Textarea v-model="descDecoration" placeholder="Описание" autoResize class="w-full" />
              <MyButton v-if="!photoDecoration" @click.prevent.stop="onAddPhotoDecorationClick" :theme="'green'" class="text-sm">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                      fill="white" />
                </svg>

                Добавить изображение
              </MyButton>
              <div v-else class="house-photo-container">
                <img class="house-photo" :src="photoToObjectUrl(photoDecoration)" alt="">
                <div @click.stop="photoDecoration = null" class="house-photo-overlay"><img
                    src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
              </div>

              <MyButton v-if="!photoDecoration2" @click.prevent.stop="onAddPhotoDecoration2Click" :theme="'green'" class="text-sm">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                      fill="white" />
                </svg>

                Добавить изображение
              </MyButton>
              <div v-else class="house-photo-container">
                <img class="house-photo" :src="photoToObjectUrl(photoDecoration2)" alt="">
                <div @click.stop="photoDecoration2 = null" class="house-photo-overlay"><img
                    src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
              </div>

              <MyButton v-if="!photoDecoration3" @click.prevent.stop="onAddPhotoDecoration3Click" :theme="'green'" class="text-sm">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                      fill="white" />
                </svg>

                Добавить изображение
              </MyButton>
              <div v-else class="house-photo-container">
                <img class="house-photo" :src="photoToObjectUrl(photoDecoration3)" alt="">
                <div @click.stop="photoDecoration3 = null" class="house-photo-overlay"><img
                    src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
              </div>

              <MyButton v-if="!photoDecoration4" @click.prevent.stop="onAddPhotoDecoration4Click" :theme="'green'" class="text-sm">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                      fill="white" />
                </svg>

                Добавить изображение
              </MyButton>
              <div v-else class="house-photo-container">
                <img class="house-photo" :src="photoToObjectUrl(photoDecoration4)" alt="">
                <div @click.stop="photoDecoration4 = null" class="house-photo-overlay"><img
                    src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
              </div>

              <MyButton v-if="!photoDecoration5" @click.prevent.stop="onAddPhotoDecoration5Click" :theme="'green'" class="text-sm">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M7.0325 5.78251L8.75 4.05751V11.25C8.75 11.4489 8.82902 11.6397 8.96967 11.7803C9.11032 11.921 9.30109 12 9.5 12C9.69891 12 9.88968 11.921 10.0303 11.7803C10.171 11.6397 10.25 11.4489 10.25 11.25V4.05751L11.9675 5.78251C12.0372 5.85281 12.1202 5.90861 12.2116 5.94668C12.303 5.98476 12.401 6.00436 12.5 6.00436C12.599 6.00436 12.697 5.98476 12.7884 5.94668C12.8798 5.90861 12.9628 5.85281 13.0325 5.78251C13.1028 5.71279 13.1586 5.62984 13.1967 5.53845C13.2347 5.44705 13.2543 5.34902 13.2543 5.25001C13.2543 5.151 13.2347 5.05298 13.1967 4.96158C13.1586 4.87019 13.1028 4.78724 13.0325 4.71751L10.0325 1.71751C9.96117 1.64923 9.87706 1.59571 9.785 1.56001C9.6024 1.485 9.39759 1.485 9.215 1.56001C9.12294 1.59571 9.03883 1.64923 8.9675 1.71751L5.9675 4.71751C5.89757 4.78744 5.8421 4.87046 5.80425 4.96183C5.76641 5.05319 5.74693 5.15112 5.74693 5.25001C5.74693 5.34891 5.76641 5.44683 5.80425 5.5382C5.8421 5.62957 5.89757 5.71258 5.9675 5.78251C6.03743 5.85244 6.12045 5.90791 6.21181 5.94576C6.30318 5.9836 6.4011 6.00308 6.5 6.00308C6.59889 6.00308 6.69682 5.9836 6.78819 5.94576C6.87955 5.90791 6.96257 5.85244 7.0325 5.78251ZM16.25 9.00001C16.0511 9.00001 15.8603 9.07903 15.7197 9.21968C15.579 9.36034 15.5 9.5511 15.5 9.75001V14.25C15.5 14.4489 15.421 14.6397 15.2803 14.7803C15.1397 14.921 14.9489 15 14.75 15H4.25C4.05109 15 3.86032 14.921 3.71967 14.7803C3.57902 14.6397 3.5 14.4489 3.5 14.25V9.75001C3.5 9.5511 3.42098 9.36034 3.28033 9.21968C3.13968 9.07903 2.94891 9.00001 2.75 9.00001C2.55109 9.00001 2.36032 9.07903 2.21967 9.21968C2.07902 9.36034 2 9.5511 2 9.75001V14.25C2 14.8468 2.23705 15.419 2.65901 15.841C3.08097 16.263 3.65326 16.5 4.25 16.5H14.75C15.3467 16.5 15.919 16.263 16.341 15.841C16.7629 15.419 17 14.8468 17 14.25V9.75001C17 9.5511 16.921 9.36034 16.7803 9.21968C16.6397 9.07903 16.4489 9.00001 16.25 9.00001Z"
                      fill="white" />
                </svg>

                Добавить изображение
              </MyButton>
              <div v-else class="house-photo-container">
                <img class="house-photo" :src="photoToObjectUrl(photoDecoration5)" alt="">
                <div @click.stop="photoDecoration5 = null" class="house-photo-overlay"><img
                    src='@/shared/assets/images/complexes/trash.svg' alt="Удалить"></div>
              </div>

              <div class="item__btns">
                <MyButton :disabled="decorationLoading" class="item__save" :theme="'green'" @click.prevent="saveDecoration">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.5325 6.9675L11.0325 2.4675C10.9634 2.40004 10.8819 2.34656 10.7925 2.31C10.6995 2.27221 10.6004 2.25187 10.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V13.5C2.25 14.0967 2.48705 14.669 2.90901 15.091C3.33097 15.5129 3.90326 15.75 4.5 15.75H13.5C14.0967 15.75 14.669 15.5129 15.091 15.091C15.5129 14.669 15.75 14.0967 15.75 13.5V7.5C15.7506 7.4013 15.7317 7.30345 15.6943 7.21207C15.657 7.12069 15.602 7.03758 15.5325 6.9675ZM6.75 3.75H9.75V5.25H6.75V3.75ZM11.25 14.25H6.75V12C6.75 11.8011 6.82902 11.6103 6.96967 11.4697C7.11032 11.329 7.30109 11.25 7.5 11.25H10.5C10.6989 11.25 10.8897 11.329 11.0303 11.4697C11.171 11.6103 11.25 11.8011 11.25 12V14.25ZM14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25H12.75V12C12.75 11.4033 12.5129 10.831 12.091 10.409C11.669 9.98705 11.0967 9.75 10.5 9.75H7.5C6.90326 9.75 6.33097 9.98705 5.90901 10.409C5.48705 10.831 5.25 11.4033 5.25 12V14.25H4.5C4.30109 14.25 4.11032 14.171 3.96967 14.0303C3.82902 13.8897 3.75 13.6989 3.75 13.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H5.25V6C5.25 6.19891 5.32902 6.38968 5.46967 6.53033C5.61032 6.67098 5.80109 6.75 6 6.75H10.5C10.6989 6.75 10.8897 6.67098 11.0303 6.53033C11.171 6.38968 11.25 6.19891 11.25 6V4.8075L14.25 7.8075V13.5Z"
                        fill="white" />
                  </svg>
                  Сохранить
                </MyButton>
                <MyButton :theme="'grey-icon'" class="item__delete" @click.prevent="closeDecoration">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.0575 8.99999L13.2825 5.78249C13.4237 5.64126 13.503 5.44971 13.503 5.24999C13.503 5.05026 13.4237 4.85871 13.2825 4.71749C13.1412 4.57626 12.9497 4.49692 12.75 4.49692C12.5502 4.49692 12.3587 4.57626 12.2175 4.71749L8.99995 7.94249L5.78245 4.71749C5.64123 4.57626 5.44968 4.49692 5.24995 4.49692C5.05023 4.49692 4.85868 4.57626 4.71745 4.71749C4.57623 4.85871 4.49689 5.05026 4.49689 5.24999C4.49689 5.44971 4.57623 5.64126 4.71745 5.78249L7.94245 8.99999L4.71745 12.2175C4.64716 12.2872 4.59136 12.3702 4.55329 12.4616C4.51521 12.5529 4.49561 12.651 4.49561 12.75C4.49561 12.849 4.51521 12.947 4.55329 13.0384C4.59136 13.1298 4.64716 13.2128 4.71745 13.2825C4.78718 13.3528 4.87013 13.4086 4.96152 13.4467C5.05292 13.4847 5.15095 13.5043 5.24995 13.5043C5.34896 13.5043 5.44699 13.4847 5.53839 13.4467C5.62978 13.4086 5.71273 13.3528 5.78245 13.2825L8.99995 10.0575L12.2175 13.2825C12.2872 13.3528 12.3701 13.4086 12.4615 13.4467C12.5529 13.4847 12.6509 13.5043 12.75 13.5043C12.849 13.5043 12.947 13.4847 13.0384 13.4467C13.1298 13.4086 13.2127 13.3528 13.2825 13.2825C13.3527 13.2128 13.4085 13.1298 13.4466 13.0384C13.4847 12.947 13.5043 12.849 13.5043 12.75C13.5043 12.651 13.4847 12.5529 13.4466 12.4616C13.4085 12.3702 13.3527 12.2872 13.2825 12.2175L10.0575 8.99999Z"
                        fill="#666666" />
                  </svg>
                </MyButton>
              </div>
            </template>
            <input @change="onImagesDecorationAdded" accept="image/*" type="file" class="hidden" ref="photoDecorationInput" />
            <input @change="onImagesDecorationAdded2" accept="image/*" type="file" class="hidden" ref="photoDecorationInput2" />
            <input @change="onImagesDecorationAdded3" accept="image/*" type="file" class="hidden" ref="photoDecorationInput3" />
            <input @change="onImagesDecorationAdded4" accept="image/*" type="file" class="hidden" ref="photoDecorationInput4" />
            <input @change="onImagesDecorationAdded5" accept="image/*" type="file" class="hidden" ref="photoDecorationInput5" />
          </div>
        </div>
        <div class="form__item">
          <label for="is_partner_show">Вывод в кабинет партнера</label>
          <InputSwitch id="is_partner_show" v-model="localHouse.is_partner_show" />
        </div>
        <!-- <div class="form__item">
          <label for="nameHome">Название застройщика</label>
          <InputText type="text" />
        </div>
        <div class="form__item">
          <label for="nameHome">Сайт застройщика</label>
          <InputText type="text" />
        </div> -->
        <!-- <div class="form__item">
          <label for="nameHome">Офис продаж</label>
          <Dropdown>
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
          </Dropdown>
        </div> -->
        <!-- <div class="form__item">
          <label for="nameHome">Телефон отдела продаж</label>
          <InputText type="text" id="nameHome" />
        </div>
        <div class="form__item">
          <label for="nameHome">Мобильный телефон ДомКликPro</label>
          <InputText type="text" id="nameHome" />
        </div>
        <div class="form__item">
          <label for="nameHome">Адрес отдела продаж</label>
          <InputText type="text" id="nameHome" />
        </div>
        <div class="form__item">
          <label for="nameHome">Широта офиса отдела продаж</label>
          <InputText type="text" id="nameHome" />
        </div>
        <div class="form__item">
          <label for="nameHome">Долгота офиса отдела продаж</label>
          <InputText type="text" id="nameHome" />
        </div>
        <div class="form__item">
          <label for="nameHome">Часовой пояс по Гринвичу</label>
          <Dropdown>
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
          </Dropdown>
        </div>
        <div class="form__item">
          <label for="nameHome">Рабочие дни</label>
          <MultiSelect selectionMessage="{0} варианта выбрано" :options="work_days" optionLabel="name"
            v-model="localHouse.select_work_day" :maxSelectedLabels="7">
            <template #dropdownicon>
              <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
            </template>
          </MultiSelect>
        </div>
        <div class="form__item">
          <label for="">Время работы-</label>
          <div class="p-inputgroup flex flex-row !items-center gap-4">
            <div class="text-grey-900 h-max">c</div>
            <Calendar date-format="H:m" :timeOnly="true" :show-icon="true" v-model="localHouse.start_time">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Calendar>
            <div class="text-grey-900 h-max">до</div>
            <Calendar date-format="H:m" :timeOnly="true" :show-icon="true" v-model="localHouse.end_time">
              <template #dropdownicon>
                <img src="@/shared/assets/images/complexes/dropdown-icon.svg" alt="" class="" />
              </template>
            </Calendar>
          </div>
        </div>
        <div class="form__item">
          <label for="nameHome">Кадастровый номер земельного участка</label>
          <InputText type="text" v-model="localHouse.cadastral_number" />
        </div>
        <div class="form__item"> -->
          <!-- <label for="nameHome">Наличие шоурума</label>
          <InputSwitch v-model="localHouse.is_shop" />
        </div> -->
      </form>
      <Toast />
    </template>
    <template v-slot:formBtns>
      <MyButton @click="save" class="submit mt-5 ml-auto" :theme="'green'">Сохранить</MyButton>
    </template>
  </FormLayout>
</template>

<script setup>
import FormLayout from "@/shared/UI/modalLayout.vue";
import MyButton from "@/shared/UI/MyButton.vue";
import { ref } from "vue";
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import { confirmpopupStyle, copyObject, isEmpty, photoToObjectUrl } from "@/shared/utils/util";
import api from "@/shared/api";
import InputSwitch from "primevue/inputswitch";
import { reactive } from "vue";
import { useToast } from "primevue/usetoast";
import HouseUTP from "./houseUTP.vue";
import HouseDecoration from "./houseDecoration.vue";
import Toast from "primevue/toast";
import {useFieldsStore} from "@/app/store/fields";

const confirm = useConfirm();
const toast = useToast();

const emit = defineEmits(["closeModel"], ['add_house']);
const props = defineProps({
  isOpen: Boolean,
  complex: Array,
  house: Object,
});

const titleForm = ref(props.house ? "Редактировать дом" : "Добавить дом");
const complexes_list = ref([]);

const fieldsStore = useFieldsStore();

const localHouse = ref({
    id: null,
    name: null,
    complex_id: null,
    address: null,
    region_id: null,
    country_id: 171,
    type_building: 'RESIDENTIAL',
    placement_type: 1,
    house_type: null,
    parking: false,
    security: false,
    fenced_area: false,
    sports_ground: false,
    play_ground: false,
    school: false,
    kinder_garten: false,
    status_corpus: null,
    deadline: { 'quarter': null, 'year': null },
    development_start: { 'quarter': null, 'year': null },
    development_end: { 'quarter': null, 'year': null },
    sales_start: { 'month': null, 'year': null },
    sales_end: { 'month': null, 'year': null },
    select_work_day: null,
    start_time: null,
    end_time: null,
    is_shop: false,
    utps: [],
    decorations: [],
    cadastral_number: null,
    is_partner_show: false,
})
const decorations = fieldsStore.decorations;
const metro_list = ref([]);
const house_types = ref([]);
const years_list = ref([]);
const form_add_main_utp = ref(false);
const form_add_main_decoration = ref(false);
const errors = ref({ 'name': false, 'titleUtp': false });
const errorsDecoration = ref({ 'name': false, 'decoration_id': false });
const titleUtp = ref('');
const decoration_id = ref(null);
const decoration_name = ref('');
const descUtp = ref('');
const descDecoration = ref('');
const photoUtp = ref(null)
const photoDecoration = ref(null)
const photoDecoration2 = ref(null)
const photoDecoration3= ref(null)
const photoDecoration4 = ref(null)
const photoDecoration5 = ref(null)
const utpLoading = ref(false)
const decorationLoading = ref(false)
const photoInput = ref()
const photoDecorationInput = ref()
const photoDecorationInput2 = ref()
const photoDecorationInput3 = ref()
const photoDecorationInput4 = ref()
const photoDecorationInput5 = ref()
// const utps = ref([])

const types_building = [
  { 'code': 'RESIDENTIAL', 'name': 'Жилое' },
  { 'code': 'PARKING', 'name': 'Паркинг' },
  { 'code': 'APARTMENT', 'name': 'Апартаменты' },
  { 'code': 'OFFICE', 'name': 'Офисы' }

];

const placement_types = [
  { 'code': 1, 'name': 'Квартиры' },
  { 'code': 2, 'name': 'Комнаты' },
  { 'code': 3, 'name': 'Дома' },
  { 'code': 4, 'name': 'Коммерция' },
  { 'code': 5, 'name': 'Части домов' },
  { 'code': 7, 'name': 'Участки' }

];

const time_to_subway = [
  { 'code': 1, 'name': 'пешком' },
  { 'code': 2, 'name': 'на транспорте' }
];

const quarter_list = [
  { 'code': 1, 'name': 'I квартал' },
  { 'code': 2, 'name': 'II квартал' },
  { 'code': 3, 'name': 'III квартал' },
  { 'code': 4, 'name': 'IV квартал' },
]

const month_list = [
  { 'code': 1, 'name': 'Январь' },
  { 'code': 2, 'name': 'Февраль' },
  { 'code': 3, 'name': 'Март' },
  { 'code': 4, 'name': 'Апрель' },
  { 'code': 5, 'name': 'Май' },
  { 'code': 6, 'name': 'Июнь' },
  { 'code': 7, 'name': 'Июль' },
  { 'code': 8, 'name': 'Август' },
  { 'code': 9, 'name': 'Сентябрь' },
  { 'code': 10, 'name': 'Октябрь' },
  { 'code': 11, 'name': 'Ноябрь' },
  { 'code': 12, 'name': 'Декабрь' },
];

const status_corpus_list = [
  { 'code': 1, 'name': 'Построен, но не сдан' },
  // { 'code': 2, 'name': 'Cдан в эксплуатацию' },
  { 'code': 3, 'name': 'Cтроится' },
  { 'code': 4, 'name': 'Построен и сдан' },
];

const work_days = [
  { 'code': 1, 'name': 'Понедельник' },
  { 'code': 2, 'name': 'Вторник' },
  { 'code': 3, 'name': 'Среда' },
  { 'code': 4, 'name': 'Четверг' },
  { 'code': 5, 'name': 'Пятница' },
  { 'code': 6, 'name': 'Суббота' },
  { 'code': 7, 'name': 'Воскресенье' },
]

const onAddPhotoClick = () => photoInput.value.click()
const onAddPhotoDecorationClick = () => photoDecorationInput.value.click()
const onAddPhotoDecoration2Click = () => photoDecorationInput2.value.click()
const onAddPhotoDecoration3Click = () => photoDecorationInput3.value.click()
const onAddPhotoDecoration4Click = () => photoDecorationInput4.value.click()
const onAddPhotoDecoration5Click = () => photoDecorationInput5.value.click()

const onImagesAdded = (e) => {
  if (!e.target.files.length) return;

  photoUtp.value = e.target.files[0]
}

const onImagesDecorationAdded = (e) => {
  if (!e.target.files.length) return;

  photoDecoration.value = e.target.files[0]
}

const onImagesDecorationAdded2 = (e) => {
  if (!e.target.files.length) return;

  photoDecoration2.value = e.target.files[0]
}

const onImagesDecorationAdded3 = (e) => {
  if (!e.target.files.length) return;

  photoDecoration3.value = e.target.files[0]
}

const onImagesDecorationAdded4 = (e) => {
  if (!e.target.files.length) return;

  photoDecoration4.value = e.target.files[0]
}

const onImagesDecorationAdded5 = (e) => {
  if (!e.target.files.length) return;

  photoDecoration5.value = e.target.files[0]
}

// const uploadImage = (house_id) => {
//   const bodyFormData = new FormData();
//   bodyFormData.append("house_id", house_id);
//   bodyFormData.append("photos[]", photoUtp.value);
//   return api.addPhotoToHouse(bodyFormData)
// };


const onChangeDec = (event) => {
  decoration_name.value = event.originalEvent.target.ariaLabel;
}

async function getMetro() {
  if (isEmpty(metro_list.value)) {
    api.getMetro(localHouse.value.region_id)
      .then((response) => {
        metro_list.value = response.data;

      })
  }
}

//Комплексы
async function getComplexes() {
  if (isEmpty(complexes_list.value)) {
    api.getComplex(localHouse.value.country_id, localHouse.value.region_id)
      .then((response) => {
        complexes_list.value = response.data;

      })
  }
}

//Тип дома
async function getHouseTypes() {
  if (isEmpty(house_types.value)) {
    api.getHouseTypes()
      .then((response) => {

        const res = response.data;
        house_types.value = res;
      })
  }
}

const listYearGen = () => {
  if (isEmpty(years_list.value)) {
    const now = new Date();
    const oldDate = new Date();
    const newDate = new Date();
    oldDate.setFullYear(now.getFullYear() - 10);
    newDate.setFullYear(now.getFullYear() + 10);

    for (let i = oldDate.getFullYear(); i <= newDate.getFullYear(); i++) {
      years_list.value.push({ 'code': i, 'name': i });
    }
  }
}

const open = () => {
  if (props.house) {

    titleForm.value = "Редактировать дом";

    localHouse.value = copyObject(props.house)
    localHouse.value.is_shop = Boolean(props.house.is_shop)
    localHouse.value.deadline = { quarter: props.house.deadline_quarter, year: props.house.deadline_year };
    localHouse.value.development_start = { quarter: props.house.development_start_quarter, year: props.house.development_start_year };
    localHouse.value.development_end = { quarter: props.house.development_end_quarter, year: props.house.development_end_year };
    localHouse.value.sales_start = { month: props.house.sales_start_month, year: props.house.sales_start_year };
    localHouse.value.sales_end = { month: props.house.sales_end_month, year: props.house.sales_end_year };

    localHouse.value.security = Boolean(props.house.security)
    localHouse.value.fenced_area = Boolean(props.house.fenced_area)
    localHouse.value.sports_ground = Boolean(props.house.sports_ground)
    localHouse.value.play_ground = Boolean(props.house.play_ground)
    localHouse.value.kinder_garten = Boolean(props.house.kinder_garten)
    localHouse.value.school = Boolean(props.house.school)
    localHouse.value.is_partner_show = Boolean(props.house.is_partner_show)

  }

  if (props.complex) {
    localHouse.value.address = props.complex.address.address;
    localHouse.value.region_id = props.complex.rf_region_id;
    localHouse.value.complex_id = props.complex.id;
    localHouse.value.country_id = props.complex.country_id;
  }
  getMetro();
  getComplexes();

  getHouseTypes();
  listYearGen();
}

defineExpose({
  open
})

const scrollToElement = (id) => {
  const container = document.getElementById(id);
  container.scrollIntoView({ behavior: 'smooth' });
};

const showTemplate = (event, index, id) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteUTP",
    message: "Удалить УТП?",
    acceptLabel: "Да",
    rejectLabel: "Нет",
    acceptClass: "!bg-red !shadow-none",
    rejectClass: "!bg-green !shadow-none",
    accept: () => {
      api.deleteHouseUtp(id).then(() => {
        toast.add({ severity: 'success', summary: 'Удалено', detail: 'УТП успешно удалено', life: 3000 });
        localHouse.value.utps.splice(index, 1);
        // localHouse.value.utps = localHouse.value.utps.filter((utp, i) => i != index)
      })
    },
    reject: () => {
      return;
    },
  });
};

const showTemplateDecoration = (event, index, id) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteDecoration",
    message: "Удалить отделку?",
    acceptLabel: "Да",
    rejectLabel: "Нет",
    acceptClass: "!bg-red !shadow-none",
    rejectClass: "!bg-green !shadow-none",
    accept: () => {
      api.deleteHouseDecoration(id).then(() => {
        toast.add({ severity: 'success', summary: 'Удалено', detail: 'Отделка успешно успешно удалена', life: 3000 });
        localHouse.value.decorations.splice(index, 1);
      })
    },
    reject: () => {
      return;
    },
  });
};

const saveUTP = () => {
  if (!isEmpty(titleUtp.value)) {
    if (!localHouse.value.utps) {
      localHouse.value.utps = []
    }
    
    const utp = {
      title: titleUtp.value,
      desc: descUtp.value,
      photo: photoUtp.value,
    }

    if (props.house) {
      const bodyFormData = new FormData();
      bodyFormData.append("title", titleUtp.value);
      bodyFormData.append("desc", descUtp.value);
      bodyFormData.append("house_id", props.house.id);
      bodyFormData.append("photo", photoUtp.value);

      utpLoading.value = true;

      api.saveHouseUTP(bodyFormData)
        .then((response) => {
          localHouse.value.utps.push({ ...utp, id: response.data })
          toast.add({ severity: 'success', summary: 'Загружено', detail: 'УТП успешно загружены', life: 3000 });
          closeUTP();
        })
        .finally(() => utpLoading.value = false)
    } else {
      localHouse.value.utps.push({
        title: titleUtp.value,
        desc: descUtp.value,
        photo: photoUtp.value,
      })
      closeUTP();
    }
    
  } else {
    errors.value.titleUtp = true;
  }
}

const saveDecoration = () => {
  if (!isEmpty(decoration_id.value)) {
    if (!localHouse.value.decorations) {
      localHouse.value.decorations = []
    }

    const decoration = {
      decoration_id: decoration_id.value,
      decoration_name: decoration_name.value,
      desc: descDecoration.value,
      photo: photoDecoration.value,
      photo2: photoDecoration2.value,
      photo3: photoDecoration3.value,
      photo4: photoDecoration4.value,
      photo5: photoDecoration5.value,
    }

    if (props.house) {
      const bodyFormData = new FormData();
      bodyFormData.append("decoration_id", decoration_id.value);
      bodyFormData.append("desc", descDecoration.value);
      bodyFormData.append("house_id", props.house.id);
      bodyFormData.append("photo", photoDecoration.value);
      bodyFormData.append("photo2", photoDecoration2.value);
      bodyFormData.append("photo3", photoDecoration3.value);
      bodyFormData.append("photo4", photoDecoration4.value);
      bodyFormData.append("photo5", photoDecoration5.value);

      decorationLoading.value = true;

      api.saveHouseDecoration(bodyFormData)
          .then((response) => {
            localHouse.value.decorations.push({ ...decoration, id: response.data })
            toast.add({ severity: 'success', summary: 'Загружено', detail: 'Планировки успешно загружены', life: 3000 });
            closeDecoration();
          })
          .finally(() => decorationLoading.value = false)
    } else {
      localHouse.value.decorations.push({
        decoration_id: decoration_id.value,
        decoration_name: decoration_name.value,
        desc: descDecoration.value,
        photo: photoDecoration.value,
        photo2: photoDecoration2.value,
        photo3: photoDecoration3.value,
        photo4: photoDecoration4.value,
        photo5: photoDecoration5.value,
      })
      closeDecoration();
    }

  } else {
    errors.value.decoraion_id = true;
  }
}

const changeUtpByIndex = (utp, index) => {
  localHouse.value.utps[index].id = utp.id
  localHouse.value.utps[index].title = utp.title
  localHouse.value.utps[index].desc = utp.desc
  localHouse.value.utps[index].photo = utp.photo
}

const changeDecorationByIndex = (decoration, index) => {
  localHouse.value.decorations[index].id = decoration.id
  localHouse.value.decorations[index].decoration_id = decoration.decoration_id
  localHouse.value.decorations[index].desc = decoration.desc
  localHouse.value.decorations[index].photo = decoration.photo
  localHouse.value.decorations[index].photo2 = decoration.photo2
  localHouse.value.decorations[index].photo3 = decoration.photo3
  localHouse.value.decorations[index].photo4 = decoration.photo4
  localHouse.value.decorations[index].photo5 = decoration.photo5
}

const updateUTP = (utp, index) => {
  if (utp.id) {
    const bodyFormData = new FormData();
    bodyFormData.append("title", utp.title);
    bodyFormData.append("desc", utp.desc);
    bodyFormData.append("house_id", props.house.id);
    bodyFormData.append("photo", utp.photo);
    bodyFormData.append("id", utp.id);

    utpLoading.value = true
    api.saveHouseUTP(bodyFormData)
      .then(() => {
        toast.add({ severity: 'success', summary: 'Обновлено', detail: 'УТП успешно обновлено', life: 3000 });

        changeUtpByIndex(utp, index)
      })
      .finally(() => utpLoading.value = false)
  } else {
    changeUtpByIndex(utp, index)
  }
}

const updateDecoration = (decoration, index) => {
  if (decoration.id) {
    const bodyFormData = new FormData();
    bodyFormData.append("decoration_id", decoration.decoration_id);
    bodyFormData.append("desc", decoration.desc);
    bodyFormData.append("house_id", props.house.id);
    bodyFormData.append("photo", decoration.photo);
    bodyFormData.append("photo2", decoration.photo2);
    bodyFormData.append("photo3", decoration.photo3);
    bodyFormData.append("photo4", decoration.photo4);
    bodyFormData.append("photo5", decoration.photo5);
    bodyFormData.append("id", decoration.id);

    decorationLoading.value = true
    api.saveHouseDecoration(bodyFormData)
        .then(() => {
          toast.add({ severity: 'success', summary: 'Обновлено', detail: 'Отделка успешно обновлена', life: 3000 });

          changeDecorationByIndex(decoration, index)
        })
        .finally(() => decorationLoading.value = false)
  } else {
    changeDecorationByIndex(decoration, index)
  }
}

const deleteUtpPhoto = (utp) => {
  if (utp.id) {
    api.deleteUtpPhoto(utp.id).then(() => {
      utp.photo = null
      toast.add({ severity: 'success', summary: 'Удалено', detail: 'Фото УТП успешно удалено', life: 3000 });
    })
  } else {
    utp.photo = null
  }
}

const closeUTP = () => {
  form_add_main_utp.value = false;
  titleUtp.value = '';
  descUtp.value = '';
  photoUtp.value = ''
  errors.value.titleUtp = false;
}

const closeDecoration = () => {
  form_add_main_decoration.value = false;
  decoration_id.value = '';
  descDecoration.value = '';
  photoDecoration.value = ''
  photoDecoration2.value = ''
  photoDecoration3.value = ''
  photoDecoration4.value = ''
  photoDecoration5.value = ''
  errorsDecoration.value.decoration_id = false;
}

const save = () => {
  if (isEmpty(localHouse.value.name)) {
    errors.value.name = true;
    scrollToElement('nameHome');
  } else {
    return api.addEditHouse(localHouse.value)
      .then((response) => {
        if (localHouse.value.utps.length || localHouse.value.decorations.length) {
          let utps = localHouse.value.utps;
          let decorations = localHouse.value.decorations;

          if (props.house) {
            utps = localHouse.value.utps.find((utp) => !utp.id)
          }

          if (props.house) {
            decorations = localHouse.value.decorations.find((decoration) => !decoration.id)
          }

          
          let promises = (utps || []).map((utp) => {
            const bodyFormData = new FormData();
            bodyFormData.append("title", utp.title);
            bodyFormData.append("desc", utp.desc);
            bodyFormData.append("photo", utp.photo)
            bodyFormData.append("house_id", response.data.id);

            return api.saveHouseUTP(bodyFormData)
          });

          const promisesDec = (decorations || []).map((decoration) => {
            const bodyFormData = new FormData();
            bodyFormData.append("decoration_id", decoration.decoration_id);
            bodyFormData.append("desc", decoration.desc);
            bodyFormData.append("photo", decoration.photo)
            bodyFormData.append("photo2", decoration.photo2)
            bodyFormData.append("photo3", decoration.photo3)
            bodyFormData.append("photo4", decoration.photo4)
            bodyFormData.append("photo5", decoration.photo5)
            bodyFormData.append("house_id", response.data.id);

            return api.saveHouseDecoration(bodyFormData)
          });

          const result = [...promises, ...promisesDec];

          Promise.all(result).finally(() => {
            emit('add_house', response.data.id);
          })
        } else {
          emit('add_house', response.data.id);
        }
      })
  }
}

</script>

<style lang="scss">
.addHome {
  .p-multiselect {
    .p-multiselect-label {
      color: #495057;
      padding: 0rem 0.75rem
    }

  }

  .p-multiselect.py-2 {
    padding-top: 0.3rem;
  }

  .p-multiselect-trigger svg {
    margin-top: 0.2rem;
  }

  .p-checkbox {
    .p-checkbox-box {
      &.p-highlight {
        border-color: #4caf50;
        background: #4caf50;

        &:hover {
          border-color: #3b913e !important;
          background: #3b913e !important;

        }
      }
    }
  }

  .p-confirm-popup {
    &:before {
      border-bottom-color: #4caf50;
    }

    &:after {
      border-bottom-color: #4caf50;
    }

    &.p-confirm-popup-flipped {
      &:before {
        border-top-color: #4caf50;
      }

      &:after {
        border-top-color: #4caf50;
      }
    }
  }

  .p-tooltip .p-tooltip-text {
    background: #ffffff;
    color: #495057;
    border: solid 1px rgb(76 175 80 / var(--tw-bg-opacity));

  }

  width: 100%;
  height: auto;

  &__form {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;
    row-gap: 20px;

    .small_text {
      margin-top: -16px;

      &.p-invalid {
        color: #e24c4c;
      }
    }

    .text-sm {
      margin-top: 10px;
    }

    .item__content {
      &.flex-col {
        .p-inputtext {
          width: 100%;
          margin-top: 5px;
        }

        .flex-grap-group {
          display: flex;
          flex-direction: column;
          row-gap: 20px;
        }
      }

    }

    .form__item {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: 1fr 436px;
      grid-gap: 30px;

      label {
        margin-top: 8px;
        font-size: 16px;
        font-weight: 400;
        @apply text-grey-900;

        span {
          @apply text-red;
        }
      }

      .item__content {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        column-gap: 16px;
        row-gap: 16px;
      }

      .item__text {
        @apply text-grey-900;
        font-size: 16px;
      }

      .item__btns {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        column-gap: 8px;
      }
    }
  }

  .house-photo-container {
    position: relative;
    width: max-content;
    height: 140px;

    .house-photo {
      height: 140px;
      max-width: 250px;
      object-fit: contain;
    }

    &:hover {
      .house-photo-overlay {
        opacity: 0.5;
        z-index: 1;
      }
    }

    .house-photo-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background: #cdc9c9;
      opacity: 0;
      z-index: -1;
      cursor: pointer;
      transition: .25s;

      img {
        width: 50px;
        height: 50px;
      }
    }
  }

}
</style>
