import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "@/pages/DashboardPage.vue";
import HalmajPage from "@/pages/HalmajPage.vue";
import Weather from "@/pages/Weather.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/weather",
    name: "Időjárás",
    component: Weather,
  },
  {
    path: "/halmaj",
    name: "Halmaj",
    component: HalmajPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }), // Reset scroll on route change
});

export default router;
