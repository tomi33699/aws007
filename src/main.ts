import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.css";
import VueApexCharts from "vue3-apexcharts";
import { initWebSocket } from "./services/webSocketService";

// AWS Amplify konfigurálása
Amplify.configure(outputs);

// WebSocket inicializálása
initWebSocket("wss://eforceapi.hu/ws");

// Vue app létrehozása
const app = createApp(App);

// Plugin-ek használata
app.use(router);
app.use(VueApexCharts);

// App mountolása
app.mount("#app");
