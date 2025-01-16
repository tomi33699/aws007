<template>
    <div class="analytics-card">
      <div class="analytics-header">
        <h5 class="analytics-title">Adatelérés monitoring <span class="green">(Aktív)</span></h5>
        <h6 class="analytics-subtitle">6/6 aktív szkript</h6>
      </div>
      <div class="analytics-body">
        <div class="analytics-content">
          <p class="analytics-section-title">Adatok</p>
          <div class="analytics-stats">
            <div class="stat-item">
              <div class="stat-value"><i class="fa-solid fa-circle-check"></i></div>
              <p class="stat-label">Halmaj adatelérés</p>
            </div>
            <div class="stat-item">
              <div class="stat-value"><i class="fa-solid fa-circle-check"></i></div>
              <p class="stat-label">Bükk adatelérés</p>
            </div>
            <div class="stat-item">
              <div class="stat-value"><i class="fa-solid fa-circle-check"></i></div>
              <p class="stat-label">Hupx adatelérés</p>
            </div>
            <div class="stat-item">
              <div class="stat-value"><i class="fa-solid fa-circle-check"></i></div>
              <p class="stat-label">ENTSO-e adatelérés</p>
            </div>
            <div class="stat-item">
              <div class="stat-value"><i class="fa-solid fa-circle-check"></i></div>
              <p class="stat-label">Mavir adatelérés</p>
            </div>
            <div class="stat-item">
              <div class="stat-value"><i class="fa-solid fa-circle-check"></i></div>
              <p class="stat-label">SZK státus</p>
            </div>
          </div>
        </div>
        <div class="analytics-image">
          <img src="@/assets/graphic-illustration-1.png" alt="Banner-graphics" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AnalyticsCard",
  };
  </script>
  
  <style scoped>
  .analytics-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #5b52bf;
    color: white;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0px 4px 18px rgba(0, 0, 0, 0.16);
  }
  

 .green{
    color: #58c2cb;
 }
  
  .analytics-title {
    font-size: 1em;
    margin: 0;
  }
  
  .analytics-subtitle {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .analytics-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .analytics-content {
    flex: 1;
  }
  
  .analytics-section-title {
    font-size: 1em;
    margin-bottom: 10px;
  }
  
  .analytics-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5em 0;
  }
  
  .stat-item {
    display: flex;
    flex-direction: row;
    gap: 1em;
   
  }
  
  .stat-value {
    font-size: 1em;
    font-weight: bold;
    background-color: rgba(103, 92, 216, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
  }
  
  .stat-label {
    font-size: 0.9em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  
  .analytics-image img {
    width: 85%;
    text-align: end;
    height: auto;
    border-radius: 6px;
  }

  .analytics-image {
    text-align: center;
  }
  </style>
  