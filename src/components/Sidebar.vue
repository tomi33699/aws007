<script setup lang="ts">
import { ref } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps(["activeMenu"]);
const emit = defineEmits(["selectMenu", "signOut"]);
const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="logo" @click="toggleSidebar">
      <img src="@/assets/logo.svg" alt="Logó" class="logo-img" />
    </div>
    <div v-if="!isCollapsed" class="app-name">EforceApp</div>
    <nav>
      <ul>
        <li @click="emit('selectMenu', 'Főoldal')" :class="{ active: props.activeMenu === 'Főoldal' }">
          <span class="material-icons icon">home</span>
          <span v-if="!isCollapsed">Főoldal</span>
        </li>
        <li @click="emit('selectMenu', 'Hupx')" :class="{ active: props.activeMenu === 'Hupx' }">
          <span class="material-icons icon">trending_up</span>
          <span v-if="!isCollapsed">Hupx</span>
        </li>
        <li @click="emit('selectMenu', 'Termelés')" :class="{ active: props.activeMenu === 'Termelés' }">
          <span class="material-icons icon">bolt</span>
          <span v-if="!isCollapsed">Termelés</span>
        </li>
        <li @click="emit('selectMenu', 'Szabályozás')" :class="{ active: props.activeMenu === 'Szabályozás' }">
          <span class="material-icons icon">build</span>
          <span v-if="!isCollapsed">Szabályozás</span>
        </li>
      </ul>
    </nav>
    <div class="logout">
      <button @click="emit('signOut')">Kijelentkezés</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 15em;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.collapsed {
  width: 80px;
}

.logo {
  text-align: center;
  cursor: pointer;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.app-name {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  margin: 10px 0;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

nav li:hover, .active {
  background-color: #34495e;
}

.logout {
  margin-top: auto;
  text-align: center;
}

button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}

.icon {
  font-size: 1.2em;
}
</style>
