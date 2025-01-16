<template>
    <div class="banner-container">
      <div class="banner-header">
        <h2>PV Monitoring: Adatfolyamok <span class="green">(Aktív)</span></h2>
      </div>
      <div class="banner-body">
        <div class="banner-left">
          <div class="info-block">
            <p><span class="badge-dot bg-success"></span> Total Power</p>
            <h2>800.88 kW</h2>
            <div class="info-details">
              <div>
                <p>Min <span class="text-danger">648.0</span> <i class="fas fa-sort-down"></i></p>
              </div>
              <div>
                <p>Max <span class="text-success">928.0</span> <i class="fas fa-sort-up"></i></p>
              </div>
            </div>
          </div>
          <hr class="my-35" />
        
          <div class="info-block">
            <p><span class="badge-dot bg-warning"></span> Total Irrad</p>
            <h2>32.35 kW/m²</h2>
            <p>1 órás átlag <span class="fw-bold">6.8</span> kW/m²</p>
          </div>
        </div>
        <div class="banner-right">
          <img src="@/assets/solar-panel.png" alt="Solar Panel" class="banner-img" />
          <div class="stats-box">
            <div class="stat-item">
              <i class="fas fa-battery-full text-success"></i>
              <div>
                <p>Capacity</p>
                <h5>210 kWh</h5>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-solar-panel text-success"></i>
              <div>
                <p>Yield</p>
                <h5>178 kWh</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Banner",
  };
  </script>
  
  <style scoped>
  .banner-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    font-family: inherit;
    
  }
  
  .green{
    color: green
  }
  
  .banner-header {
    color: #0E0E23;
    display: block;
    padding: 1em;
    position: relative;
    border-bottom: 1px solid #f0f3f6;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  
  .banner-header h4 {
    color: #0e0e23;
    font-weight: 500;
  }
  
  .box-body{
    padding: 1em;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    border-radius: 10px;
  }
  
  .banner-body {
    padding: 1em;
    display: flex;
    justify-content: space-between;
  }
  
  .banner-left {
    flex: 1;
    padding: 0 1em;
  }
  
  .info-block {
    margin-bottom: 20px;
    line-height: 1.8em;
  }
  
  .info-block h1 {
    margin: 10px 0;
    color: #0e0e23;
  }

  
  .info-details {
    display: flex;
    justify-content: flex-start;
    gap: 1em;
  }
  
  .info-details p {
    margin: 0;
    font-size: .9em;
    
  }
  
  .badge-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }
  
  .bg-success {
    background-color: #198754;
  }
  
  .bg-warning {
    background-color: #ffc107;
  }
  
  .text-danger {
    color: #dc3545;
  }
  
  .text-success {
    color: #198754;
  }
  
  hr {
    margin: 20px 0;
    border: none;
    border-top: 1px solid #dee2e6;
  }

  .fw-bold{
    font-weight: bold;
  }
  
  .banner-right {
    flex: 1;
    text-align: center;
    padding: 0 1em;
  }
  
  .banner-right img {
    width: auto;
    height: auto;
  }
  
  .stats-box {
    background-color: #eeeeee;
    border-radius: 10px;
    display: flex;
    justify-content: space-around;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
  }
  
  .stat-item i {
    margin-right: 8px;
  }
  
  .stat-item p {
    margin: 0;
    color: #0e0e23;
    font-family: inherit;
    
  }
  
  .stat-item h5 {
    margin: 0;
    color: #0e0e23;
    font-family: inherit;
  
  }

  .my-35 {
    margin-top: 1em !important;
    margin-bottom: 1.5em !important;
    border: 0 !important;
  }
  </style>
  