<template>
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Az oldal nem található</h2>
      <p>Úgy tűnik, hogy az oldal, amit keresel, nem létezik.</p>
      <router-link to="/" class="back-home">Vissza a főoldalra</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  .not-found-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #f8f9fa;
    color: #333;
  }
  
  h1 {
    font-size: 5rem;
    color: #ff4d4d;
    margin-bottom: 0.5rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .back-home {
    display: inline-block;
    padding: 0.8em 1.5em;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
  }
  
  .back-home:hover {
    background: #0056b3;
  }
  </style>
  