import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("../pages/DashboardPage.vue") },
  { path: "/bukk", component: () => import("../pages/BukkPage.vue") },
  { path: "/halmaj", component: () => import("../pages/HalmajPage.vue") },
  { path: "/charts", component: () => import("../pages/ChartsPage.vue") },
  { path: "/balancing", component: () => import("../pages/BalancingPage.vue") },
  { path: "/hupx", component: () => import("../pages/HupxPage.vue") },
  { path: "/load", component: () => import("../pages/LoadPage.vue") },
  { path: "/forecast", component: () => import("../pages/ForecastPage.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
