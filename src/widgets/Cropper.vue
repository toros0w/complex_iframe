<template>
  <Teleport to="body">
    <ModalLayout @closeModel="onClose" :class="{'open': isOpen}" wrapperClass="full-screen">
      <div class="flex align-items-center gap-5">
        <input
          ref="input"
          type="file"
          name="image"
          accept="image/*"
          @change="setImage"
        />

        <div class="content">
          <section class="cropper-area">
            <div class="img-cropper">
              <vue-cropper ref="cropper" :src="imgSrc" />
            </div>
                <!-- <div class="actions">
                <a href="#" role="button" @click.prevent="zoom(0.2)"> Zoom In </a>
                <a href="#" role="button" @click.prevent="zoom(-0.2)">
                    Zoom Out
                </a>
                <a href="#" role="button" @click.prevent="move(-10, 0)">
                    Move Left
                </a>
                <a href="#" role="button" @click.prevent="move(10, 0)">
                    Move Right
                </a>
                <a href="#" role="button" @click.prevent="move(0, -10)">
                    Move Up
                </a>
                <a href="#" role="button" @click.prevent="move(0, 10)">
                    Move Down
                </a>
                <a href="#" role="button" @click.prevent="rotate(90)">
                    Rotate +90deg
                </a>
                <a href="#" role="button" @click.prevent="rotate(-90)">
                    Rotate -90deg
                </a>
                <a ref="flipX" href="#" role="button" @click.prevent="flipX">
                    Flip X
                </a>
                <a ref="flipY" href="#" role="button" @click.prevent="flipY">
                    Flip Y
                </a>
                <a href="#" role="button" @click.prevent="cropImage"> Crop </a>
                <a href="#" role="button" @click.prevent="reset"> Reset </a>
                <a href="#" role="button" @click.prevent="getData"> Get Data </a>
                <a href="#" role="button" @click.prevent="setData"> Set Data </a>
                <a href="#" role="button" @click.prevent="getCropBoxData">
                    Get CropBox Data
                </a>
                <a href="#" role="button" @click.prevent="setCropBoxData">
                    Set CropBox Data
                </a>
                <a href="#" role="button" @click.prevent="showFileChooser">
                    Upload Image
                </a>
                </div> -->
          </section>
        </div>
      <div class="actions-container">
        <div>
          <svg
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            width="36px"
            height="36px"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve"
          >
            <title>Crop</title>
            <desc>Created with Sketch.</desc>
            <g id="Page-1" sketch:type="MSPage">
              <g
                id="Crop"
                transform="translate(1.757575, 1.757575)"
                sketch:type="MSLayerGroup"
              >
                <path
                  id="Shape"
                  sketch:type="MSShapeGroup"
                  fill="none"
                  stroke="#6B6C6E"
                  stroke-width="2"
                  d="M60,45h-9V15v-2c0-1.1-0.9-2-2-2    h-2H17V2c0-1.1-0.9-2-2-2h-2c-1.1,0-2,0.9-2,2v9H2c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h9V9.125V47v2c0,1.1,0.9,2,2,2h2h36h-6v9    c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-9h9c1.1,0,2-0.9,2-2v-2C62,45.9,61.1,45,60,45L60,45z M17,45V9.625V17h28v28h6.5H17L17,45z"
                />
                <path
                  id="Shape_1_"
                  sketch:type="MSShapeGroup"
                  fill="none"
                  stroke="#6B6C6E"
                  stroke-width="2"
                  d="M18,44L60,2"
                />
              </g>
            </g>
          </svg>
          <span class="text-gray">Обрезать</span>
        </div>
        <div @click="rotate(90)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36px"
            height="36px"
            viewBox="0 0 512 512"
          >
            <path
              fill="var(--ci-primary-color, #757575)"
              d="M49.386,256c0-114.184,92.8-207.1,206.935-207.294V90.465L368,15.965H256.321L256,16c-63.783.094-123.414,25.679-168.525,70.79A237.732,237.732,0,0,0,17.386,256Z"
              class="ci-primary"
            />
            <path
              fill="var(--ci-primary-color, #757575)"
              d="M255.987,463.367V432L144.308,496H255.987c132.4-.36,240-108.214,240-239.965h-32C463.982,370.141,370.738,463.007,255.987,463.367Z"
              class="ci-primary"
            />
            <path
              fill="var(--ci-primary-color, #757575)"
              d="M337.372,152H184V120H152v32H120v32h32V360H320v32h32V360h32V328H352V222.628l-32,32V328H201.373L384,145.372V128H361.372ZM184,305.372V184H305.372Z"
              class="ci-primary"
            />
          </svg>
          <span class="text-gray">Повернуть</span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36px"
            height="36px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect width="24" height="24" fill="white" />
            <path
              d="M5 7.5H19L18 21H6L5 7.5Z"
              stroke="#757575"
              stroke-linejoin="round"
            />
            <path
              d="M15.5 9.5L15 19"
              stroke="#757575"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 9.5V19"
              stroke="#757575"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.5 9.5L9 19"
              stroke="#757575"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 5H19C20.1046 5 21 5.89543 21 7V7.5H3V7C3 5.89543 3.89543 5 5 5H8M16 5L15 3H9L8 5M16 5H8"
              stroke="#757575"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text-gray">Удалить</span>
        </div>
      </div>
      </div>
      <div class="footer">
        <div><MyButton
          @click.stop="getResult"
          theme="green"
          class="floorItem__addRoom text-sm"
        >
          Сохранить
        </MyButton></div>
        <div><MyButton
          @click.stop="onClose"
          theme="grey-icon"
          class="floorItem__addRoom text-sm"
        >
          Отмена
        </MyButton></div>
      </div>
    </ModalLayout>
  </Teleport>
</template>
  
  <script>
import ModalLayout from "@/shared/UI/modalLayout.vue";
import MyButton from "@/shared/UI/MyButton.vue";
import { ref } from "vue";

export default {
  props: {
    imgSrc: {
      type: String,
      default:
        "https://img.dmclk.ru/vitrina/fd/75/fd7530d884375860b09199ae4e81ab89494a6028.png",
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    onClose: Function,
  },
  components: {
    ModalLayout,
  },
  setup() {
    const cropImg = ref("");
    const data = ref(null);

    return { data, cropImg };
  },
  methods: {
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    getResult() {
      const canvas = this.$refs.cropper.getCroppedCanvas()
      canvas.toBlob((blob) => {
        
        this.$emit('save:image', blob)
      }, 'image/jpeg')

    },
    flipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute("data-scale", scale);
    },
    flipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute("data-scale", scale);
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;

      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;

      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    setImage(e) {
      const file = e.target.files[0];

      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
/* body {
    font-family: Arial, Helvetica, sans-serif;
    width: 1024px;
    margin: 0 auto;
  } */

.modalWindow  input[type="file"] {
  display: none;
}

.modalWindow .content {
  display: flex;
  justify-content: space-between;
}

.modalWindow .cropper-area {
  width: 614px;
}

.modalWindow .actions {
  margin-top: 1rem;
}

.modalWindow .actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.full-screen {
  min-height: 100vh;
  min-width: 100vw;
  justify-content: center !important;
  align-items: center !important;
  gap: 40px;;
}

.text-gray {
    color: #757575;
}

.modalWindow .actions-container {
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.modalWindow .actions-container > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.align-items-center {
    align-items: center;
}

.modalWindow .footer {
    display: flex;
    gap: 10px;
}
</style>