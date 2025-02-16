import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router"; // ✅ Javított type-only import
import DashboardPage from "@/pages/DashboardPage.vue";
import Market from "@/pages/MarketPage.vue";
import Weather from "@/pages/Weather.vue";
import NotFound from "@/pages/NotFound.vue";
import { fetchAuthSession, signOut } from "aws-amplify/auth"; // ✅ Helyes import AWS Amplify 6.x verzióhoz

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/market",
    name: "Market",
    component: Market,
    meta: { requiresAuth: true },
  },
  {
    path: "/weather",
    name: "Időjárás",
    component: Weather,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 🔹 Route Guard (Hitelesítés ellenőrzése)
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const session = await fetchAuthSession(); // 🔹 Az új autentikációs ellenőrzés
      if (session) {
        next();
      } else {
        console.warn("🔒 Bejelentkezés szükséges!");
        next("/");
      }
    } catch {
      console.warn("🔒 Bejelentkezés szükséges!");
      next("/");
    }
  } else {
    next();
  }
});


export default router;
