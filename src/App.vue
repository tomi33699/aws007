<script setup lang="ts">
import { ref, onMounted } from "vue";
import Sidebar from './components/Sidebar.vue';
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { I18n } from '@aws-amplify/core';

// Magyar fordítások konfigurálása
onMounted(() => {
  I18n.putVocabularies({
    hu: {
      'Sign in': 'Belépés',
      'Sign In': 'Bejelentkezés',
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
      'Confirmation Code': 'Megerősítő kód',
    },
  });

  I18n.setLanguage('hu');
});
</script>

<template>
  <main class="app-container">
    <authenticator :hide-sign-up="true">
      <template v-slot:header>
        <div class="login-header">
          <img src="@/assets/logo.svg" alt="EforceApp Logo" class="logo" />
          <h1 class="app-name">EforceApp</h1>
        </div>
      </template>
      <template v-slot="{ signOut }">
        <div class="dashboard-container">
          <Sidebar :signOut="signOut" />
          <router-view /> <!-- Fontos -->
        </div>
      </template>
    </authenticator>
  </main>
</template>
<style scoped>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f0f0f0;
}

.app-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.amplify-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.amplify-button:hover {
  background-color: #0056b3;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  margin-bottom: 10px;
}

.app-name {
  font-size: 1.5em;
  font-weight: bold;
  color: #5b757b;
}
</style>
