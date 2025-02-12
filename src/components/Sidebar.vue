<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useRoute } from "vue-router";
import { signOut } from "aws-amplify/auth";

const route = useRoute();

const menus = ref([
  { label: "Dashboard", path: "/", icon: "fa-sliders-h" },
  { label: "Weather", path: "/weather", icon: "fa-cloud-sun" },
  { label: "Blank", path: "/blank", icon: "fa-file" },
]);

const tools = ref([
  { label: "Buttons", path: "/buttons", icon: "fa-square" },
]);

const plugins = ref([
  { label: "Profile", path: "/profile", icon: "fa-chart-bar" },
]);

const isSidebarCollapsed = ref(false);
const emit = defineEmits(["sidebarToggle"]);

const isActive = (path: string) => route.path === path;

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  emit("sidebarToggle", isSidebarCollapsed.value);
}

async function handleSignOut() {
  if (isSidebarCollapsed.value) return; // Ha össze van csukva, ne fusson le a kijelentkezés
  try {
    await signOut();
  } catch (error) {
    console.error("Kijelentkezési hiba:", error);
  }
}
</script>


<template>
  <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
    <div class="sidebar-header" :class="{ sidebarhelp: isSidebarCollapsed }" @click="toggleSidebar">
      <i class="fa fa-bolt logo-icon"></i>
      <span v-if="!isSidebarCollapsed" class="logo-text">EforceApp</span>
    </div>
    <div class="menu-section">
      <span v-if="!isSidebarCollapsed" class="section-title">Dashboard</span>
      <ul class="menu">
        <li v-for="menu in menus" :key="menu.path" class="menu-item" :class="{ active: isActive(menu.path) }">
          <router-link :to="menu.path">
            <i :class="['fa', menu.icon]"></i>
            <span v-if="!isSidebarCollapsed">{{ menu.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="menu-section">
      <span v-if="!isSidebarCollapsed" class="section-title">Market</span>
      <ul class="menu">
        <li v-for="tool in tools" :key="tool.path" class="menu-item" :class="{ active: isActive(tool.path) }">
          <router-link :to="tool.path">
            <i :class="['fa', tool.icon]"></i>
            <span v-if="!isSidebarCollapsed">{{ tool.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="menu-section">
      <span v-if="!isSidebarCollapsed" class="section-title">User</span>
      <ul class="menu">
        <li v-for="plugin in plugins" :key="plugin.path" class="menu-item" :class="{ active: isActive(plugin.path) }">
          <router-link :to="plugin.path">
            <i :class="['fa', plugin.icon]"></i>
            <span v-if="!isSidebarCollapsed">{{ plugin.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="sidebar-footer">
  <button class="sign-out-button" @click="handleSignOut">
    <span v-if="!isSidebarCollapsed">Kijelentkezés</span>
    <i class="fa fa-sign-out-alt sign-out-icon" :class="{ disable: isSidebarCollapsed }"></i>
  </button>
</div>
  </div>
</template>

<style scoped>
.sidebar {
  background-color: #222e3c;
  color: white;
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
  cursor: pointer;
  justify-content: start;
}
.sidebarhelp{
  justify-content: center;
}
.logo-icon {
  font-size: 24px;
  color: #3b7ddd;
}
.logo-text{
  margin-left: 5px;
}

.menu-section {
  margin-top: 20px;
}

.section-title {
  background: transparent;
  color: #ced4da;
  font-size: .9em;
  padding: 1.5rem 1.5rem .375rem;
}

.menu {
  list-style: none;
  padding: 0;
  margin-top: .2em;
}

.menu-item {
  position: relative;
  padding: 2px 10px;
  transition: color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  opacity: 0.6;
  font-weight: 500;
}

.menu-item:hover {
  color: #e9ecef;
  opacity: 1;
}

.menu-item a {
  display: flex;
  align-items: center;
  color: #ced4da;
  text-decoration: none;
  padding: 10px;
  position: relative;
}

.menu-item i {
  font-size: 15px;
  width: 30px;
  text-align: center;
  color: #ced4da;
  margin-right: 5px;
}
.menu-item.active {
  color: #e9ecef;
  opacity: 1;
  background: linear-gradient(90deg, rgba(59, 125, 221, .1), rgba(59, 125, 221, .088) 50%, transparent);
}

.menu-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #3b7ddd;
  transition: all 0.3s ease-in-out;
}


.sidebar-footer {
  margin-top: auto;
  padding: 20px;
  text-align: center;
}

.sign-out-button {
  background-color: #3b7ddd;
  color: #ced4da;
  border: none;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}

.sign-out-button{
  transition: .3s ease-in-out;
}

.sign-out-button:hover {
  background-color: #326abc;
}

.sign-out-icon.disable {
  display: flex;
  visibility: visible;
  pointer-events: none; /* Letiltja a kattintást */
  background-color: #3b7ddd; /* Megőrzi az eredeti színt, csak átlátszóbb */
}

.sign-out-icon {
  visibility: hidden;
  display: none;
  transition: .2s ease-in-out
}
</style>