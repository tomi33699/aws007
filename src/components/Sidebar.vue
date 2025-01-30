<template>
  <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
    <div class="logo-container" @click="toggleSidebar">
      <i class="logo-icon fa fa-bolt"></i>
      <h2 v-if="!isSidebarCollapsed" class="logo-text">EnergyForce</h2>
    </div>
    <ul class="menu">
      <li v-for="menu in menus" :key="menu.path" class="menu-items">
        <router-link :to="menu.path" active-class="active">
          <i :class="['fa', menu.icon]"></i>
          <span v-if="!isSidebarCollapsed">{{ menu.label }}</span>
        </router-link>
      </li>
    </ul>
    <button class="sign-out-button" @click="signOut">
      <span v-if="!isSidebarCollapsed">Kijelentkezés</span>
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const menus = ref([
  { label: "Dashboard", path: "/", icon: "fa-tachometer-alt" },
  { label: "Bükk", path: "/bukk", icon: "fa-cogs" },
  { label: "Halmaj", path: "/halmaj", icon: "fa-cogs" },
  /* { label: "Charts", path: "/charts", icon: "fa-chart-line" }, */
  /* { label: "Balancing", path: "/balancing", icon: "fa-balance-scale" },
  { label: "HUPX", path: "/hupx", icon: "fa-plug" },
  { label: "Load", path: "/load", icon: "fa-tachometer-alt" },
  { label: "Forecast", path: "/forecast", icon: "fa-calendar" }, */
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
.sidebar {
  background-color: #4b42ab;
  color: white;
  width: 15vw; /* Alapértelmezett szélesség */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1vh 0.8vw;
  transition: width 0.5s ease; /* Csak a szélesség animálása */
  overflow: hidden;
}

.sidebar.collapsed {
  width: 7vw; /* Az összecsukott állapot szélessége */
}

.logo-container {
  margin: 1em 0;
  display: flex;
  gap: 1em;
  flex-direction: column;
  text-align: center;
  cursor: pointer; /* Mutatóváltás jelzi a kattinthatóságot */
}

.logo-container i{
  font-size: 2em;
}

.logo {
  width: 80%;
  transition: 0.3s ease;
  margin-bottom: 0em;
  padding-top: 1em;
}

.logo-icon{
  color: #fac107e5;
}

.menu {
  list-style: none;
  padding: 0;
  margin-bottom: auto;
  margin-top: 5em;
}

.menu-items {
  text-decoration: none;
  width: max-content;
  padding: 1em;
  width: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Középre igazítja az ikonokat */
  border-bottom: 1px solid #fbf5f3;
}

.menu-items.active {
  background-color: #c8dfe7;
  border-radius: 5px;
}

.menu-items i {
  margin-right: 1vw; /* Rugalmas méretezés */
  color: #fac107e5;
}

.menu-items span {
  transition: 0.2s;
  color: #fbf5f3;
  font-weight: bold;
}

.menu-items span:hover {
  color: #FAC107; 
}

li {
  width: max-content;
}

.sign-out-button {
  background-color: #fac107e5 ;
  color: rgb(16, 15, 15);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 1em 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .2s;
}

.sign-out-button span {
  display: inline-block;
}

.sign-out-button:hover {
  background-color: black;
  color: #c8dfe7;
}

a {
  text-decoration: none;
}

.sidebar.collapsed .menu-items span,
.sidebar.collapsed .sign-out-button span {
  display: none;
}

.sidebar.collapsed .menu-items {
  justify-content: center; /* Középre igazítja az ikonokat */
}
</style>
