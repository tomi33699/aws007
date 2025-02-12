<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import "@fortawesome/fontawesome-free/css/all.css"; 
import { I18n } from "@aws-amplify/core";

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

  I18n.setLanguage("hu");
});
</script>

<template>
  <div class="app-layout">
    <!-- Bejelentkezési rendszer -->
    <Authenticator :hide-sign-up="true">
      <template v-slot="{ signOut }">
        <div class="dashboard-layout">
          <Sidebar :signOut="signOut" />
          <div class="main-content">
            <router-view />
          </div>
        </div>
      </template>
    </Authenticator>
  </div>
</template>

<style scoped>
/* Alap layout */
.app-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fb;
}

/* Fő dashboard felépítés */
.dashboard-layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* Sidebar és tartalom elrendezése */
.main-content {
  flex-grow: 1;
  padding: 1em;
  overflow-y: auto;
}

/* Amplify bejelentkezés gomb */
.amplify-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.amplify-button:hover {
  background-color: #0056b3;
}

/* Bejelentkezési fejléc */
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
