import { createApp } from "vue";
import App from "@/app/App.vue";
import { createPinia } from "pinia";
import router from "@/app/router";
import PrimeVue from "primevue/config";

import ConfirmationService from "primevue/confirmationservice";


//Components
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar"; 
import InputSwitch from "primevue/inputswitch";
import Message from "primevue/message";
import primeVueSettings from "./shared/utils/primeVueSettings";
import MyButton from "@/shared/UI/MyButton.vue";
import Tooltip from "primevue/tooltip";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dialog from "primevue/dialog";
import Galleria from 'primevue/galleria';
import Paginator from 'primevue/paginator';
import Carousel from 'primevue/carousel';
import VueCropper from 'vue-cropperjs';
import ToastService from 'primevue/toastservice'
import Editor from 'primevue/editor';
import 'cropperjs/dist/cropper.css';
import { createYmaps } from "vue-yandex-maps";

const app = createApp(App);
const pinia = createPinia();

app.component("VueCropper", VueCropper);
app.component("InputText", InputText);
app.component("Carousel", Carousel);
app.component("Dropdown", Dropdown);
app.component("Textarea", Textarea);
app.component("MultiSelect", MultiSelect);
app.component("Calendar", Calendar);
app.component("InputSwitch", InputSwitch);
app.component("Message", Message);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Button", Button);
app.component("MyButton", MyButton);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Dialog", Dialog);
app.component("Galleria", Galleria);
app.component("Paginator", Paginator);
app.component('Editor', Editor);

app.directive("tooltip", Tooltip);

app.use(pinia);
app.use(router);
app.use(ToastService)
app.use(PrimeVue, primeVueSettings);
app.use(ConfirmationService, {});
app.use(createYmaps({
    apikey: '692f0a05-cb88-4158-88b9-06bc0dc93004',
    lang: 'ru-RU',
    // load: 'package.standard',
    // ns: 'yandexMap'
    // &onload=onYandexMapInit
}));
app.mount("#app");


import eventBus from "./eventBus";
window.complexBus = eventBus