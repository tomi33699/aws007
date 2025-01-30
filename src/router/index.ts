import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "@/pages/DashboardPage.vue";
import BukkPage from "@/pages/BukkPage.vue";
import HalmajPage from "@/pages/HalmajPage.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/bukk",
    name: "Bukk",
    component: BukkPage,
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
