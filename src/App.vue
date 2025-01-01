<!-- App.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import DashboardContent from './components/DashboardContent.vue';
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { I18n } from '@aws-amplify/core';

// Magyar fordítások konfigurálása
onMounted(() => {
  I18n.putVocabularies({
    hu: {
      'Sign in': 'Belépés', // Kisbetűs kulcs
      'Sign In': 'Bejelentkezés', // Nagybetűs kulcs
      'Sign Up': 'Fiók létrehozása',
      'Email': 'E-mail',
      'Password': 'Jelszó',
      'Confirm Password': 'Jelszó megerősítése',
      'Forgot your password?': 'Elfelejtette a jelszavát?',
      'Reset your password': 'Jelszó visszaállítása',
      'Submit': 'Küldés',
      'Confirm': 'Megerősítés',
      'Back to Sign In': 'Vissza a bejelentkezéshez',
      'Create Account': 'Fiók létrehozása',
      'Enter your Email': 'Adja meg az e-mail címét',
      'Enter your Password': 'Adja meg a jelszavát',
      'Please confirm your Password': 'Erősítse meg a jelszavát',
      'Resend Code': 'Kód újraküldése',
      'Confirmation Code': 'Megerősítő kód'
    }
  });

  I18n.setLanguage('hu'); // Nyelv beállítása magyarra
});

// Aktív menü
const activeMenu = ref('Főoldal');

// Menü választás
function selectMenu(menu: string) {
  activeMenu.value = menu;
}
</script>

<template>
  <main class="app-container">
    <!-- AWS Amplify Authenticator -->
    <authenticator :hide-sign-up="true">
      <template v-slot:header>
        <!-- Egyedi fejléc -->
        <div class="login-header">
          <img src="@/assets/logo.svg" alt="EforceApp Logo" class="logo" />
          <h1 class="app-name">EforceApp</h1>
        </div>
      </template>

      <!-- Dashboard elrendezés -->
      <template v-slot="{ signOut }">
        <div class="dashboard-container">
          <!-- Oldalsáv -->
          <Sidebar 
            :activeMenu="activeMenu" 
            @selectMenu="selectMenu" 
            @signOut="signOut" 
          />
          <!-- Tartalom -->
          <DashboardContent :activeMenu="activeMenu" />
        </div>
      </template>
    </authenticator>
  </main>
</template>


<style scoped>
/* Globális stílusok */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0; /* Szürke háttér */
}

/* Amplify UI container (középre igazítás) */
.app-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

/* Dashboard elrendezés */
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Testreszabott gombok */
.amplify-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.amplify-button:hover {
  background-color: #0056b3;
}
/* Logó és app név */
.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 100px; /* Logó mérete */
  margin-bottom: 10px;
}

.app-name {
  font-size: 1.5em;
  font-weight: bold;
  color: #005566;
}
</style>
