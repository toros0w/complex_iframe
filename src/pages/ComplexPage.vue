<template>
  <Teleport to="body">
    <FormAddComplex
      :isOpen="formEditComplexOpen"
      @closeModel="formEditComplexOpen = !formEditComplexOpen"
      :complex="copyObject(complex)"
      @update-complex="onComplexUpdate"
    />
  </Teleport>
  <div class="complexPage">
    <ListHome
      @open-add-home="openAddHome"
      :complex_id="complex_id"
      :houses="houses"
      :loadHome="loadHome"
    />
    <div class="infoByComplex">
      <div class="infoByComplex__title">{{ complex.name }}</div>
      <div class="infoByComplex__content">
        <div class="infoByComplex-block infoByComplex__infoBlock">
          <div class="block-head infoBlock__head">
            <div class="head__title">Информация об объекте</div>
            <div class="head__btnMenu">
              <Button style="background: transparent; border: none" type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.591 17.341C9.71231 18.2196 8.28768 18.2196 7.409 17.341C6.53032 16.4623 6.53032 15.0377 7.409 14.159C8.28768 13.2803 9.71231 13.2803 10.591 14.159C11.4697 15.0377 11.4697 16.4623 10.591 17.341Z"
                    fill="#BDBDBD"
                  />
                  <path
                    d="M10.591 10.591C9.71231 11.4697 8.28768 11.4697 7.409 10.591C6.53032 9.71231 6.53032 8.28768 7.409 7.40901C8.28768 6.53033 9.71231 6.53033 10.591 7.40901C11.4697 8.28768 11.4697 9.71231 10.591 10.591Z"
                    fill="#BDBDBD"
                  />
                  <path
                    d="M10.591 3.84098C9.71231 4.71966 8.28768 4.71966 7.409 3.84098C6.53032 2.96231 6.53032 1.53768 7.409 0.659007C8.28768 -0.219669 9.71231 -0.219669 10.591 0.659007C11.4697 1.53768 11.4697 2.96231 10.591 3.84098Z"
                    fill="#BDBDBD"
                  />
                </svg>
              </Button>
              <Menu :pt="{ root: { class: ['custom-p-menu'] } }" ref="menuItems" id="overlay_menu" :model="items" :popup="true" />
            </div>
          </div>
          
          <div class="block-content" style="display: flex; flex-direction: column; gap: 5px;">
            <div class="textBlock__item">
              <div class="item__label">
                Тип комплекса: Жилой комплекс в новостройке
              </div>
            </div>
            <div class="textBlock__item">
              <div class="item__label">
                Адрес: {{ complex.address.address }}
              </div>
            </div>

            <div class="textBlock__item" v-if="complex.metros?.length">
              <div class="item__label" style="display: flex; align-items: start; gap: 10px;">
                <span>Метро: </span>
                <div>
                  <div :key="metro.id" style="display: flex; gap: 5px" v-for="metro in complex.metros">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.242 2.24765L9.99989 12.4689L6.75798 2.24765C2.90144 3.57322 0 7.16913 0 11.2916C0 13.7746 1.01298 16.0644 2.65178 17.752H7.35212L7.84488 15.6151C2.22957 13.4149 3.29134 6.59717 5.32701 5.48428C5.56864 5.55694 9.10942 17.7017 9.10942 17.7017C9.15779 17.7017 9.31493 17.7017 9.50692 17.7017C9.54747 17.7017 9.70018 17.7017 9.89048 17.7017C9.95934 17.7017 10.0337 17.7017 10.1091 17.7017C10.2384 17.7017 10.3725 17.7017 10.4924 17.7017C10.6846 17.7017 10.8416 17.7017 10.8902 17.7017C10.8902 17.7017 14.4311 5.55694 14.6726 5.48428C16.7085 6.59717 17.7698 13.4149 12.1545 15.6151L12.6475 17.752H17.3478C18.9868 16.0644 19.9998 13.7746 19.9998 11.2916C19.9998 7.16913 17.0983 3.57322 13.242 2.24765Z"
                        fill="#8EB3F5"
                      />
                    </svg>
                    {{ metro.metro }}
                    <div class="time">{{ metro.subway_time}} минут <span v-if="metro.subway_type == 1">пешком</span><span v-else-if="metro.subway_type == 2">на транспорте</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="infoByComplex-block infoByComplex__media">
          <div class="block-head infoBlock__head">
            <div class="head__title">Медиа-материалы</div>
          </div>
          <div class="block__plug media__plug">
            <div class="card">
              <FileUpload
                :pt="{
                  root: { class: ['flex', 'flex-col-reverse'] },
                  content: {
                    class: [
                      '!border-transparent',
                      '!p-0',
                      files.length > 0 ? '' : 'dashed-content',
                    ],
                  },
                  buttonbar: { class: ['!bg-white', '!border-transparent'] },
                }"
                @upload="onTemplatedUpload($event)"
                :multiple="true"
                accept="image/*"
                :maxFileSize="10000000"
                @select="onSelectedFiles"
              >
                <template
                  #header="{
                    chooseCallback,
                    uploadCallback,
                    clearCallback,
                  }"
                >
                  <div
                    class="flex flex-wrap justify-center align-items-center flex-1 gap-2"
                  >
                    <div class="flex gap-2">
                      <!-- <Button
                        @click="chooseCallback()"
                        icon="pi pi-images"
                        rounded
                        outlined
                      ></Button> -->
                      <MyButton
                        class="plug__btn"
                        :theme="'green'"
                        @click.stop="chooseCallback()"
                        ><svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.5 1.5C8.01664 1.5 6.5666 1.93987 5.33323 2.76398C4.09986 3.58809 3.13856 4.75943 2.57091 6.12987C2.00325 7.50032 1.85472 9.00832 2.14411 10.4632C2.4335 11.918 3.14781 13.2544 4.1967 14.3033C5.2456 15.3522 6.58197 16.0665 8.03683 16.3559C9.49168 16.6453 10.9997 16.4968 12.3701 15.9291C13.7406 15.3614 14.9119 14.4001 15.736 13.1668C16.5601 11.9334 17 10.4834 17 9C17 8.01509 16.806 7.03982 16.4291 6.12987C16.0522 5.21993 15.4997 4.39314 14.8033 3.6967C14.1069 3.00026 13.2801 2.44781 12.3701 2.0709C11.4602 1.69399 10.4849 1.5 9.5 1.5ZM9.5 15C8.31332 15 7.15328 14.6481 6.16658 13.9888C5.17989 13.3295 4.41085 12.3925 3.95673 11.2961C3.5026 10.1997 3.38378 8.99334 3.61529 7.82946C3.8468 6.66557 4.41825 5.59647 5.25736 4.75736C6.09648 3.91824 7.16558 3.3468 8.32946 3.11529C9.49335 2.88378 10.6997 3.0026 11.7961 3.45672C12.8925 3.91085 13.8295 4.67988 14.4888 5.66658C15.1481 6.65327 15.5 7.81331 15.5 9C15.5 10.5913 14.8679 12.1174 13.7426 13.2426C12.6174 14.3679 11.0913 15 9.5 15ZM12.5 8.25H10.25V6C10.25 5.80109 10.171 5.61032 10.0303 5.46967C9.88968 5.32902 9.69892 5.25 9.5 5.25C9.30109 5.25 9.11033 5.32902 8.96967 5.46967C8.82902 5.61032 8.75 5.80109 8.75 6V8.25H6.5C6.30109 8.25 6.11033 8.32902 5.96967 8.46967C5.82902 8.61032 5.75 8.80109 5.75 9C5.75 9.19891 5.82902 9.38968 5.96967 9.53033C6.11033 9.67098 6.30109 9.75 6.5 9.75H8.75V12C8.75 12.1989 8.82902 12.3897 8.96967 12.5303C9.11033 12.671 9.30109 12.75 9.5 12.75C9.69892 12.75 9.88968 12.671 10.0303 12.5303C10.171 12.3897 10.25 12.1989 10.25 12V9.75H12.5C12.6989 9.75 12.8897 9.67098 13.0303 9.53033C13.171 9.38968 13.25 9.19891 13.25 9C13.25 8.80109 13.171 8.61032 13.0303 8.46967C12.8897 8.32902 12.6989 8.25 12.5 8.25Z"
                            fill="white"
                          />
                        </svg>
                        Добавить материалы
                      </MyButton>
                      <!-- <Button
                        @click="uploadEvent(uploadCallback)"
                        icon="pi pi-cloud-upload"
                        rounded
                        outlined
                        severity="success"
                        :disabled="!files || files.length === 0"
                      ></Button>
                      <Button
                        @click="clearCallback()"
                        icon="pi pi-times"
                        rounded
                        outlined
                        severity="danger"
                        :disabled="!files || files.length === 0"
                      ></Button> -->
                    </div>
                  </div>
                </template>
                <template
                  #content="{
                    uploadedFiles,
                    removeUploadedFileCallback,
                    removeFileCallback,
                  }"
                >
                  <div v-if="files.length > 0">
                    <div
                      class="flex flex-wrap !p-0 sm:p-5 gap-2"
                      style="max-height: 385px; overflow: auto"
                    >
                      <div
                        v-for="(file, index) of files"
                        :key="file.name + file.type + file.size"
                        style="align-items: center"
                        class="upload-file-card flex-grow justify-between card m-0 px-6 flex flex-column border-1 surface-border gap-3"
                      >
                        <div style="min-width: 100px; max-width: 100px">
                          <img
                            role="presentation"
                            :alt="file.name"
                            :src="file.objectURL"
                            width="100"
                            height="50"
                            style="max-height: 100px;object-fit: contain;"
                          />
                        </div>
                        <span class="font-semibold file-name">{{
                          file.name
                        }}</span>
                        <div
                          style="
                            font-size: 12px;
                            font-weight: bold;
                            text-wrap: nowrap;
                          "
                        >
                          {{ formatSize(file.size) }}
                        </div>
                        <div class="flex-col justify-around image-actions-container">
                          <img src="@/shared/assets/images/complexes/settings.svg" @click.stop="openCropper(file)" alt="Настроить">
                          <img src='@/shared/assets/images/complexes/trash.svg' @click.stop="onRemoveTemplatingFile(file.id, index)" alt="Удалить">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    "
                  >
                    <div class="plug__icon">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.6668 16.6667C31.2248 16.6667 30.8009 16.8423 30.4883 17.1548C30.1758 17.4674 30.0002 17.8913 30.0002 18.3333V23.9667L27.5335 21.5C26.6625 20.6359 25.4854 20.151 24.2585 20.151C23.0316 20.151 21.8545 20.6359 20.9835 21.5L19.8168 22.6833L15.6835 18.5333C14.8125 17.6692 13.6354 17.1844 12.4085 17.1844C11.1816 17.1844 10.0045 17.6692 9.1335 18.5333L6.66683 21.0167V11.6667C6.66683 11.2246 6.84242 10.8007 7.15498 10.4882C7.46755 10.1756 7.89147 10 8.3335 10H21.6668C22.1089 10 22.5328 9.82441 22.8453 9.51185C23.1579 9.19929 23.3335 8.77536 23.3335 8.33334C23.3335 7.89131 23.1579 7.46739 22.8453 7.15482C22.5328 6.84226 22.1089 6.66667 21.6668 6.66667H8.3335C7.00741 6.66667 5.73564 7.19345 4.79796 8.13114C3.86028 9.06882 3.3335 10.3406 3.3335 11.6667V32.0333C3.33789 33.2608 3.82745 34.4368 4.69542 35.3047C5.56339 36.1727 6.73934 36.6623 7.96683 36.6667H28.7002C29.1518 36.6631 29.6007 36.5957 30.0335 36.4667C30.9959 36.1967 31.8431 35.6185 32.4453 34.8207C33.0474 34.0229 33.3711 33.0495 33.3668 32.05V18.3333C33.3669 18.1116 33.3227 17.8921 33.2369 17.6877C33.151 17.4833 33.0253 17.2981 32.8669 17.1429C32.7086 16.9877 32.5209 16.8656 32.3149 16.7838C32.1088 16.7021 31.8885 16.6622 31.6668 16.6667ZM8.3335 33.3333C7.89147 33.3333 7.46755 33.1577 7.15498 32.8452C6.84242 32.5326 6.66683 32.1087 6.66683 31.6667V25.7167L11.4835 20.9C11.7271 20.6578 12.0566 20.5218 12.4002 20.5218C12.7437 20.5218 13.0732 20.6578 13.3168 20.9L25.7668 33.3333H8.3335ZM30.0002 31.6667C29.9895 31.9894 29.8852 32.3021 29.7002 32.5667L22.1668 25L23.3502 23.8333C23.4697 23.7114 23.6123 23.6145 23.7697 23.5484C23.9271 23.4822 24.0961 23.4481 24.2668 23.4481C24.4376 23.4481 24.6066 23.4822 24.764 23.5484C24.9214 23.6145 25.064 23.7114 25.1835 23.8333L30.0002 28.6833V31.6667ZM35.0002 6.66667H33.3335V5C33.3335 4.55798 33.1579 4.13405 32.8453 3.82149C32.5328 3.50893 32.1089 3.33334 31.6668 3.33334C31.2248 3.33334 30.8009 3.50893 30.4883 3.82149C30.1758 4.13405 30.0002 4.55798 30.0002 5V6.66667H28.3335C27.8915 6.66667 27.4675 6.84226 27.155 7.15482C26.8424 7.46739 26.6668 7.89131 26.6668 8.33334C26.6668 8.77536 26.8424 9.19929 27.155 9.51185C27.4675 9.82441 27.8915 10 28.3335 10H30.0002V11.6667C30.0002 12.1087 30.1758 12.5326 30.4883 12.8452C30.8009 13.1577 31.2248 13.3333 31.6668 13.3333C32.1089 13.3333 32.5328 13.1577 32.8453 12.8452C33.1579 12.5326 33.3335 12.1087 33.3335 11.6667V10H35.0002C35.4422 10 35.8661 9.82441 36.1787 9.51185C36.4912 9.19929 36.6668 8.77536 36.6668 8.33334C36.6668 7.89131 36.4912 7.46739 36.1787 7.15482C35.8661 6.84226 35.4422 6.66667 35.0002 6.66667Z"
                          fill="#BDBDBD"
                        />
                      </svg>
                    </div>
                    <div class="plug__text">
                      У вас еще не загружены видео и фото материалы
                    </div>
                  </div>
                </template>
              </FileUpload>
              <Cropper
                v-if="fileToCrop"
                :imgSrc="fileToCrop.objectURL"
                :isOpen="isOpenCropper"
                :onClose="closeCropper"
                @save:image="handelSaveImage"
              />
            </div>
            <!-- <MyButton class="plug__btn" :theme="'green'" @click.stop="chooseCallback()"
              ><svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 1.5C8.01664 1.5 6.5666 1.93987 5.33323 2.76398C4.09986 3.58809 3.13856 4.75943 2.57091 6.12987C2.00325 7.50032 1.85472 9.00832 2.14411 10.4632C2.4335 11.918 3.14781 13.2544 4.1967 14.3033C5.2456 15.3522 6.58197 16.0665 8.03683 16.3559C9.49168 16.6453 10.9997 16.4968 12.3701 15.9291C13.7406 15.3614 14.9119 14.4001 15.736 13.1668C16.5601 11.9334 17 10.4834 17 9C17 8.01509 16.806 7.03982 16.4291 6.12987C16.0522 5.21993 15.4997 4.39314 14.8033 3.6967C14.1069 3.00026 13.2801 2.44781 12.3701 2.0709C11.4602 1.69399 10.4849 1.5 9.5 1.5ZM9.5 15C8.31332 15 7.15328 14.6481 6.16658 13.9888C5.17989 13.3295 4.41085 12.3925 3.95673 11.2961C3.5026 10.1997 3.38378 8.99334 3.61529 7.82946C3.8468 6.66557 4.41825 5.59647 5.25736 4.75736C6.09648 3.91824 7.16558 3.3468 8.32946 3.11529C9.49335 2.88378 10.6997 3.0026 11.7961 3.45672C12.8925 3.91085 13.8295 4.67988 14.4888 5.66658C15.1481 6.65327 15.5 7.81331 15.5 9C15.5 10.5913 14.8679 12.1174 13.7426 13.2426C12.6174 14.3679 11.0913 15 9.5 15ZM12.5 8.25H10.25V6C10.25 5.80109 10.171 5.61032 10.0303 5.46967C9.88968 5.32902 9.69892 5.25 9.5 5.25C9.30109 5.25 9.11033 5.32902 8.96967 5.46967C8.82902 5.61032 8.75 5.80109 8.75 6V8.25H6.5C6.30109 8.25 6.11033 8.32902 5.96967 8.46967C5.82902 8.61032 5.75 8.80109 5.75 9C5.75 9.19891 5.82902 9.38968 5.96967 9.53033C6.11033 9.67098 6.30109 9.75 6.5 9.75H8.75V12C8.75 12.1989 8.82902 12.3897 8.96967 12.5303C9.11033 12.671 9.30109 12.75 9.5 12.75C9.69892 12.75 9.88968 12.671 10.0303 12.5303C10.171 12.3897 10.25 12.1989 10.25 12V9.75H12.5C12.6989 9.75 12.8897 9.67098 13.0303 9.53033C13.171 9.38968 13.25 9.19891 13.25 9C13.25 8.80109 13.171 8.61032 13.0303 8.46967C12.8897 8.32902 12.6989 8.25 12.5 8.25Z"
                  fill="white"
                />
              </svg>
              Добавить материалы
            </MyButton> -->
          </div>
        </div>
        <div class="infoByComplex-block infoByComplex__generalPlan">
          <div class="block-disabled" />
          <div class="block-head infoBlock__head">
            <div class="head__title"><span>Генпланы</span><span>В разработке</span></div>
          </div>
          <div class="block__plug media__plug">
            <div class="plug__icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16651 14.7667L19.1665 23.4333C19.4199 23.5796 19.7073 23.6566 19.9998 23.6566C20.2924 23.6566 20.5798 23.5796 20.8332 23.4333L35.8332 14.7667C36.0851 14.6212 36.2945 14.4124 36.4407 14.161C36.5869 13.9095 36.6648 13.6242 36.6665 13.3333C36.6677 13.0396 36.5912 12.7509 36.4449 12.4962C36.2985 12.2416 36.0875 12.0302 35.8332 11.8833L20.8332 3.23333C20.5798 3.08705 20.2924 3.01004 19.9998 3.01004C19.7073 3.01004 19.4199 3.08705 19.1665 3.23333L4.16651 11.8833C3.91217 12.0302 3.70115 12.2416 3.55481 12.4962C3.40847 12.7509 3.33201 13.0396 3.33318 13.3333C3.33494 13.6242 3.41278 13.9095 3.55897 14.161C3.70516 14.4124 3.91462 14.6212 4.16651 14.7667ZM19.9998 6.66666L31.6665 13.3333L19.9998 20L8.33318 13.3333L19.9998 6.66666ZM34.1665 18.6167L19.9998 26.6667L5.83318 18.55C5.64296 18.4398 5.43281 18.3683 5.21485 18.3397C4.99688 18.311 4.77541 18.3258 4.56317 18.3831C4.35094 18.4404 4.15214 18.5392 3.97823 18.6737C3.80432 18.8081 3.65873 18.9757 3.54985 19.1667C3.33256 19.5494 3.27545 20.0025 3.39098 20.4271C3.50651 20.8517 3.78529 21.2135 4.16651 21.4333L19.1665 30.1C19.4199 30.2463 19.7073 30.3233 19.9998 30.3233C20.2924 30.3233 20.5798 30.2463 20.8332 30.1L35.8332 21.4333C36.2144 21.2135 36.4932 20.8517 36.6087 20.4271C36.7242 20.0025 36.6671 19.5494 36.4498 19.1667C36.341 18.9757 36.1954 18.8081 36.0215 18.6737C35.8475 18.5392 35.6488 18.4404 35.4365 18.3831C35.2243 18.3258 35.0028 18.311 34.7848 18.3397C34.5669 18.3683 34.3567 18.4398 34.1665 18.55V18.6167ZM34.1665 25.2833L19.9998 33.3333L5.83318 25.2167C5.64296 25.1065 5.43281 25.035 5.21485 25.0064C4.99688 24.9777 4.77541 24.9925 4.56317 25.0498C4.35094 25.1071 4.15214 25.2059 3.97823 25.3403C3.80432 25.4748 3.65873 25.6424 3.54985 25.8333C3.33256 26.216 3.27545 26.6691 3.39098 27.0938C3.50651 27.5184 3.78529 27.8801 4.16651 28.1L19.1665 36.7667C19.4199 36.9129 19.7073 36.99 19.9998 36.99C20.2924 36.99 20.5798 36.9129 20.8332 36.7667L35.8332 28.1C36.2144 27.8801 36.4932 27.5184 36.6087 27.0938C36.7242 26.6691 36.6671 26.216 36.4498 25.8333C36.341 25.6424 36.1954 25.4748 36.0215 25.3403C35.8475 25.2059 35.6488 25.1071 35.4365 25.0498C35.2243 24.9925 35.0028 24.9777 34.7848 25.0064C34.5669 25.035 34.3567 25.1065 34.1665 25.2167V25.2833Z"
                  fill="#BDBDBD"
                />
              </svg>
            </div>
            <div class="plug__text">
              У вас еще не загружено ни одного генплана
            </div>
            <MyButton :theme="'green'" class="plug__btn"
              ><svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 1.5C8.01664 1.5 6.5666 1.93987 5.33323 2.76398C4.09986 3.58809 3.13856 4.75943 2.57091 6.12987C2.00325 7.50032 1.85472 9.00832 2.14411 10.4632C2.4335 11.918 3.14781 13.2544 4.1967 14.3033C5.2456 15.3522 6.58197 16.0665 8.03683 16.3559C9.49168 16.6453 10.9997 16.4968 12.3701 15.9291C13.7406 15.3614 14.9119 14.4001 15.736 13.1668C16.5601 11.9334 17 10.4834 17 9C17 8.01509 16.806 7.03982 16.4291 6.12987C16.0522 5.21993 15.4997 4.39314 14.8033 3.6967C14.1069 3.00026 13.2801 2.44781 12.3701 2.0709C11.4602 1.69399 10.4849 1.5 9.5 1.5ZM9.5 15C8.31332 15 7.15328 14.6481 6.16658 13.9888C5.17989 13.3295 4.41085 12.3925 3.95673 11.2961C3.5026 10.1997 3.38378 8.99334 3.61529 7.82946C3.8468 6.66557 4.41825 5.59647 5.25736 4.75736C6.09648 3.91824 7.16558 3.3468 8.32946 3.11529C9.49335 2.88378 10.6997 3.0026 11.7961 3.45672C12.8925 3.91085 13.8295 4.67988 14.4888 5.66658C15.1481 6.65327 15.5 7.81331 15.5 9C15.5 10.5913 14.8679 12.1174 13.7426 13.2426C12.6174 14.3679 11.0913 15 9.5 15ZM12.5 8.25H10.25V6C10.25 5.80109 10.171 5.61032 10.0303 5.46967C9.88968 5.32902 9.69892 5.25 9.5 5.25C9.30109 5.25 9.11033 5.32902 8.96967 5.46967C8.82902 5.61032 8.75 5.80109 8.75 6V8.25H6.5C6.30109 8.25 6.11033 8.32902 5.96967 8.46967C5.82902 8.61032 5.75 8.80109 5.75 9C5.75 9.19891 5.82902 9.38968 5.96967 9.53033C6.11033 9.67098 6.30109 9.75 6.5 9.75H8.75V12C8.75 12.1989 8.82902 12.3897 8.96967 12.5303C9.11033 12.671 9.30109 12.75 9.5 12.75C9.69892 12.75 9.88968 12.671 10.0303 12.5303C10.171 12.3897 10.25 12.1989 10.25 12V9.75H12.5C12.6989 9.75 12.8897 9.67098 13.0303 9.53033C13.171 9.38968 13.25 9.19891 13.25 9C13.25 8.80109 13.171 8.61032 13.0303 8.46967C12.8897 8.32902 12.6989 8.25 12.5 8.25Z"
                  fill="white"
                />
              </svg>
              Добавить генплан
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FormAddHome
    :isOpen="isOpenForm"
    ref="formAddHome"
    :complex="complex"
    @close-model="isOpenForm = !isOpenForm"
    @add_house="add_house"
  />
  <Toast />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Toast from "primevue/toast";
import FileUpload from "primevue/fileupload";
import Menu from "primevue/menu";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

import { useComplexStore } from "@/app/store/complex";

import bus from "@/eventBus";
import api from "@/shared/api";
import MyButton from "@/shared/UI/MyButton.vue";
import { copyObject } from "@/shared/utils/util";

import FormAddHome from "@/widgets/forms/formAddHome.vue";
import ListHome from "@/widgets/listHome.vue";
import Cropper from "@/widgets/Cropper.vue";
import FormAddComplex from "@/widgets/forms/formAddComplex.vue";

const route = useRoute();
const toast = useToast();

const complexStore = useComplexStore()

const isOpenForm = ref(false);
const formEditComplexOpen = ref(false)
const complex = ref({ address: {}, metro: {} });
const complex_id = route.params.id;
const formAddHome = ref(null);
const houses = ref([]);
const loadHome = ref(true);
const fileToCrop = ref();
const isOpenCropper = ref(false);
const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const menuItems = ref();
const items = ref([
  {
    items: [
        {
            label: 'Редактировать',
            command: () => formEditComplexOpen.value = true
        }
    ]
  }
]);

const toggle = (event) => {
  menuItems.value.toggle(event);
};


const openCropper = (file) => {
  fileToCrop.value = file;
  isOpenCropper.value = true;
};

const handelSaveImage = (blob) => {
  if (fileToCrop.value) {
    const index = files.value.findIndex((file) => file.objectURL == fileToCrop.value.objectURL)

    const file = new File(
      [blob],
      fileToCrop.value.name,
      { type: blob.type }
    );
    file.objectURL = URL.createObjectURL(blob)

    const bodyFormData = new FormData();
    bodyFormData.append("photo_id", fileToCrop.value.id);
    bodyFormData.append("photo", file);

    return api.updateComplexPhoto(bodyFormData)
      .then((response) => {
        if (response.data) {
          const image = response.data.image
          fetch(image)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File(
                [blob],
                image.substring(image.lastIndexOf("/") + 1, image.length),
                { type: blob.type }
              );
              file.objectURL = image;
              file.id = response.data.id

              files.value[index] = file
              closeCropper();
            });

        }
      })
  }
};

const closeCropper = () => {
  fileToCrop.value = null;
  isOpenCropper.value = false;
};

const onRemoveTemplatingFile = (photo_id, index) => {
  api.deleteComplexPhoto(photo_id)
    .then((response) => {
      if (response.data) {
        files.value.splice(index, 1);
      }

    })
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const showUploadSuccess = () => {
    toast.add({ severity: 'success', summary: 'Загружено', detail: 'Медиа-материалы успешно загружены', life: 3000 });
};

const onSelectedFiles = (event) => {
  const promises = event.files.map((file, index) => {
    const bodyFormData = new FormData();
    bodyFormData.append("complex_id", complex_id);
    bodyFormData.append("photos[]", file);
    return api.addPhotoToComplex(bodyFormData)
      .then((response) => {
        if (response.data) {
          const currentFile = event.files[index]
          currentFile.id = response.data[0].id
          files.value.push(file)
        }
      })
  })

  Promise.all(promises).then(() => {
    // files.value.push(...selectedFiles);
    let counterSize = 0
    files.value.forEach((file) => {
      counterSize += parseInt(formatSize(file.size));
    });
    totalSize.value = counterSize

    showUploadSuccess()
  })

};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

// const onTemplatedUpload = () => {
//   toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
// };

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
async function getHouses() {
  loadHome.value = true;
  api.getComplexHouses(complex_id)
    .then((response) => {
      var res = response.data;
      houses.value = res;
      loadHome.value = false;
    })
}

async function get_complex_one() {
  return await api.getComplexOne(complex_id, false)
    .then((response) => {
      var res = response.data;
      complexStore.setActiveComplex(res)
      complex.value = res;
      if (complex.value.images && complex.value.images.length) {
        complex.value.images.forEach(({ image, id }) => {
          fetch(image)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File(
                [blob],
                image.substring(image.lastIndexOf("/") + 1, image.length),
                { type: blob.type }
              );
              file.objectURL = image;
              file.id = id
              files.value.push(file)
            });
        });
      }
    })
}

const openAddHome = () => {
  isOpenForm.value = !isOpenForm.value;
  formAddHome.value.open();
};

const add_house = () => {
  isOpenForm.value = !isOpenForm.value;
  getHouses();
};

const removeHouse = (house_id) => {
  api.deleteHouse(house_id).then(() => {
    houses.value = houses.value.filter((house) => house.id !== house_id)
  })
}

const onComplexUpdate = (updatedComplex) => {
  complex.value = {...updatedComplex }
}

onMounted(() => {
  get_complex_one();
  getHouses();


  bus.$on('remove-house', removeHouse)
});

onUnmounted(() => {
  bus.$off('remove-house', removeHouse)
})

</script>

<style lang="scss" scoped>
@import "@/app/styles/function.scss";
.complexPage {
  width: 100%;
  height: 100%;
  @apply bg-white;
  // margin: 0 30px;
  border-radius: 4px;
  padding: 40px 30px;
  padding-bottom: 0;
  overflow-y: scroll;
  .infoByComplex {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 30px;


    .head__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 30px;
    }
    &__content {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      grid-column-gap: vw(30, 1920);
    }
    &-block {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 30px;
      border: 1px solid;
      position: relative;
      @apply border-grey-400;
      .block-head {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid;
        @apply border-grey-400;
        padding-bottom: 30px;
        margin-bottom: 30px;
        .head__title {
          @apply text-grey-900;
        }
      }
      .block__content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
      .block__plug {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 15px;
        .plug__icon {
          width: 40px;
          height: 40px;

          svg {
            width: 100%;
            height: 100%;
          }
        }
        .plug__text {
          font-size: 15px;
          text-align: center;
        }
        .plug__btn {
          @apply bg-green;
          @apply text-white;
          display: flex;
          align-items: center;
        }
      }
    }
    &__infoBlock {
      width: 100%;
      height: auto;
    }
  }
  .listHomes {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;

    &__title {
      width: 100%;
      font-size: 32px;
      padding-bottom: 30px;
      border-bottom: 1px solid;
      @apply border-grey-400;
    }

    &__nav {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }

    &__list {
      flex-grow: 1;
      position: relative;
      width: calc(100% + 60px);
      height: 200px;
      left: -30px;
      display: flex;
      @apply bg-grey-200;
    }
  }

  .file-name {
    display: block;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }

  .upload-file-card {
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;
    position: relative;
    margin: 1px;
  }
  .upload-file-card:hover {
    background: aliceblue;
    outline: 1px solid #dedede;
  }

  .image-actions-container {
    display: flex;
    width: 30px;
    height: 100%;
    padding: 0 5px;
    border-radius: 4px;
    position: absolute;
    right: 0;
    background-color: #fff;
    transition: .25s all;
    opacity: 0;
  }

  .upload-file-card:hover .image-actions-container {
    opacity: 1;
  }

  .dashed-content {
    border: 2px dashed #c8c2c2 !important;
    border-radius: 6px !important;
  }

  .block-disabled {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #cbcbcb38;
  }
  
}
</style>

<style>
.complexPage .p-button:focus {
  box-shadow: unset !important;
}
.p-submenu-header {
  display: none !important;
}

.p-menuitem-link {
  border: none !important;
}
</style>
