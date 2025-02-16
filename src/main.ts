import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import router from "./router";
import VueApexCharts from "vue3-apexcharts"; // ensure correct import
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";


import "./assets/main.css"; 


Amplify.configure(outputs);

const app = createApp(App);

// Regisztráljuk a VueApexCharts komponenst globálisan
app.component('vue-apexcharts', VueApexCharts);

app.use(createPinia());
app.use(router);


app.mount("#app");