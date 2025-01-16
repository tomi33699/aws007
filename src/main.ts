import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import router from "./router"; // Import the router
import '@fortawesome/fontawesome-free/css/all.css'; // FontAwesome for icons
import VueApexCharts from "vue3-apexcharts"; // ApexCharts for charts

// Configure AWS Amplify
Amplify.configure(outputs);

// Create Vue app instance
const app = createApp(App);

// Use router and ApexCharts
app.use(router);
app.use(VueApexCharts); // Most itt regisztráljuk a VueApexCharts-t

// Mount the app
app.mount("#app");
