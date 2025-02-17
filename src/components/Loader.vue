<template>
    <div class="loader-container">
      <div class="loader"></div>
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
    height: 100vh;
    width: 100%;
    text-align: center;
  }.loader{
      width: 315px;
      height: 200px;
      background:
          linear-gradient(0.25turn, transparent, #FFF, transparent),
          linear-gradient(#DDD, #DDD),
          radial-gradient(38px circle at 19px 19px, #DDD 50%, transparent 51%),
          linear-gradient(#DDD, #DDD);
      background-color: #fff;
      background-repeat: no-repeat;
      background-size: 315px 200px, 315px 130px, 100px 100px, 225px 30px;
      background-position: -315px 0, 0 0, 15px 140px, 65px 145px;
      animation: loading 1.5s infinite;
  }

  @keyframes loading {
    to {
      background-position: 315px 0, 0 0, 15px 140px, 65px 145px;
    }
  }
  

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
  p {
    font-size: 14px;
    font-weight: bold;
    color: #555;
  }
  </style>
  