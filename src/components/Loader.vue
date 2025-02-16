<template>
    <div class="loader-container">
      <div class="spinner"></div>
      <p>Adatok betöltése...</p>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100%;
    text-align: center;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 255, 0.3);
    border-top: 5px solid #008FFB;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    font-size: 14px;
    font-weight: bold;
    color: #555;
  }
  </style>
  