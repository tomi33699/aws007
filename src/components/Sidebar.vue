<template>
  <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
    <!-- Logo & Sidebar Toggle -->
    <div class="logo-container" @click="toggleSidebar">
      <i class="logo-icon fa fa-bolt"></i>
      <transition name="fade">
        <h2 v-if="!isSidebarCollapsed" class="logo-text">EnergyForce</h2>
      </transition>
    </div>
    <!-- Menü elemek -->
    <ul class="menu">
      <li v-for="menu in menus" :key="menu.path" class="menu-item">
        <router-link :to="menu.path" active-class="active">
          <i :class="['fa', menu.icon]"></i>
          <transition name="fade">
            <span v-if="!isSidebarCollapsed">{{ menu.label }}</span>
          </transition>
        </router-link>
      </li>
    </ul>
    <!-- Kijelentkezés gomb -->
    <button class="sign-out-button" @click="signOut">
      <i class="fa fa-sign-out-alt"></i>
      <transition name="fade">
        <span v-if="!isSidebarCollapsed">Kijelentkezés</span>
      </transition>
    </button>
  </div>
</template>
<script setup>
import { ref, defineEmits } from "vue";
const menus = ref([
  { label: "Dashboard", path: "/", icon: "fa-tachometer-alt" },
  { label: "Időjárás", path: "/weather", icon: "fa-cloud-sun" },
  { label: "Halmaj", path: "/halmaj", icon: "fa-solar-panel" },
]);
const isSidebarCollapsed = ref(false);
const emit = defineEmits(["sidebarToggle"]);
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  emit("sidebarToggle", isSidebarCollapsed.value);
}
defineProps(["signOut"]);
</script>
<style scoped>
/* ===== Alap Sidebar Stílus ===== */
.sidebar {
  background-color: #2C2F48;
  color: white;
  width: 14vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1vh 1vw;
  transition: width 0.4s ease-in-out;
  overflow: hidden;
  box-shadow: 3px 0px 10px rgba(0, 0, 0, 0.1);
}
/* ===== Összecsukott Sidebar ===== */
.sidebar.collapsed {
  width: 5vw;
}
/* ===== Logo & Sidebar Toggle ===== */
.logo-container {
  display: flex;
  align-items: center;
  gap: 1em;
  cursor: pointer;
  padding: 1em 0;
}
.logo-icon {
  font-size: 1.8em;
  color: #FAC107;
}
.logo-text {
  font-size: 1.2em;
  font-weight: bold;
}
/* ===== Menü Lista ===== */
.menu {
  list-style: none;
  padding: 0;
  margin: 2em 0;
}
.menu-item {
  padding: 1em;
  border-radius: 8px;
  transition: background 0.3s, transform 0.2s;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}
.menu-item i {
  font-size: 1.2em;
  color: #FAC107;
  margin-right: 0.8em;
}
.menu-item span {
  font-weight: bold;
  color: #ffffff;
}
/* ===== Aktív Menüelem ===== */
.active {
  border-radius: 8px;
}
/* ===== Kijelentkezés Gomb ===== */
.sign-out-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8em;
  font-size: 1em;
  transition: background 0.3s ease;
}
.sign-out-button:hover {
  background-color: #ff3333;
}
/* ===== Összecsukott Állapothoz ===== */
.sidebar.collapsed .menu-item span,
.sidebar.collapsed .sign-out-button span,
.sidebar.collapsed .logo-text {
  display: none;
}
.sidebar.collapsed .menu-item {
  justify-content: center;
}
.sidebar.collapsed .menu-item i {
  margin-right: 0;
}
/* ===== Fade Animáció a Szövegeknek ===== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
