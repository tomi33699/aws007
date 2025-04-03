<template>
    <div class="menetrend-page">
      <div class="left-panel">
        <h2>Menetrend – 96 negyedórás ajánlat</h2>
  
        <label>Dátum kiválasztása:</label>
        <input type="date" v-model="selectedDate" />
  
        <h3>Fejléc adatok</h3>
        <div class="header-fields">
          <div class="form-group">
            <label>Azonosító (mRID):</label>
            <input type="text" v-model="header.mrid" />
          </div>
          <div class="form-group">
            <label>Revision:</label>
            <input type="number" v-model="header.revisionNumber" />
          </div>
          <div class="form-group">
            <label>Sender:</label>
            <input type="text" v-model="header.sender" />
          </div>
          <div class="form-group">
            <label>Registered Resource ID:</label>
            <input type="text" v-model="header.resourceId" />
          </div>
        </div>
  
        <div class="savs-container">
          <div
            v-for="(column, colIndex) in bidColumns"
            :key="colIndex"
            class="bid-column-card"
          >
            <div class="card-header">
              <h4>Sáv {{ colIndex + 1 }}</h4>
              <button @click="removeColumn(colIndex)" class="delete-btn">🗑</button>
            </div>
            <div class="bid-entry" v-for="(entry, index) in column" :key="index">
              <span class="time-label">{{ timeLabels[index] }}</span>
              <input type="number" v-model="entry.quantity" placeholder="MW" />
              <input type="number" v-model="entry.price" placeholder="HUF/MWh" />
            </div>
          </div>
        </div>
  
        <button @click="addColumn" class="add-column-btn">➕ Új sáv hozzáadása</button>
      </div>
  
      <div class="right-panel">
        <div class="xml-header">
          <h3>Generált XML</h3>
          <button @click="copyXML" class="copy-btn">📋 Másolás</button>
        </div>
        <textarea :value="generateXML()" readonly rows="40" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const today = new Date()
  today.setDate(today.getDate() + 1)
  const defaultDate = today.toISOString().substring(0, 10)
  const selectedDate = ref(defaultDate)
  
  const header = ref({
    mrid: 'egyedi_azonosito_20250404_009',
    revisionNumber: 1,
    sender: '15X-DTTPI------I',
    resourceId: '15W-SZK007--UE-K',
  })
  
  const timeLabels: string[] = []
  for (let i = 0; i < 96; i++) {
    const h = String(Math.floor(i / 4)).padStart(2, '0')
    const m = String((i % 4) * 15).padStart(2, '0')
    timeLabels.push(`${h}:${m}`)
  }
  
  function createDefaultBidColumn() {
    return Array.from({ length: 96 }, () => ({
      quantity: 1,
      price: -200000,
    }))
  }
  
  const bidColumns = ref([createDefaultBidColumn()])
  
  function addColumn() {
    bidColumns.value.push(createDefaultBidColumn())
  }
  
  function removeColumn(index: number) {
    if (bidColumns.value.length > 1) {
      bidColumns.value.splice(index, 1)
    } else {
      alert('Legalább egy sávnak maradnia kell.')
    }
  }
  
  function generateXML() {
    const date = new Date(selectedDate.value)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
  
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <urn:ReserveBid_MarketDocument xmlns:urn="urn:iec62325.351:tc57wg16:451-7:reservebiddocument:7:2">
    <urn:mRID>${header.value.mrid}</urn:mRID>
    <urn:revisionNumber>${header.value.revisionNumber}</urn:revisionNumber>
    <urn:type>A37</urn:type>
    <urn:process.processType>A51</urn:process.processType>
    <urn:sender_MarketParticipant.mRID codingScheme="A01">${header.value.sender}</urn:sender_MarketParticipant.mRID>
    <urn:sender_MarketParticipant.marketRole.type>A46</urn:sender_MarketParticipant.marketRole.type>
    <urn:receiver_MarketParticipant.mRID codingScheme="A01">10X1001A1001A329</urn:receiver_MarketParticipant.mRID>
    <urn:receiver_MarketParticipant.marketRole.type>A04</urn:receiver_MarketParticipant.marketRole.type>
    <urn:createdDateTime>${new Date().toISOString()}</urn:createdDateTime>
    <urn:domain.mRID codingScheme="A01">10YHU-MAVIR----U</urn:domain.mRID>`
  
    const timeSeries = bidColumns.value
      .map((column, colIdx) => {
        const startTime = `${yyyy}-${mm}-${dd}T00:00Z`
        const endTime = `${yyyy}-${mm}-${dd}T24:00Z`
        const points = column
          .map((entry, i) => {
            return `        <urn:Point>
            <urn:position>${i + 1}</urn:position>
            <urn:quantity.quantity>${entry.quantity}</urn:quantity.quantity>
            <urn:energy_Price.amount>${entry.price}</urn:energy_Price.amount>
          </urn:Point>`
          })
          .join('\n')
  
        return `  <urn:Bid_TimeSeries>
      <urn:mRID>${header.value.mrid}_${colIdx + 1}</urn:mRID>
      <urn:auction.mRID>AFRR_${yyyy}${mm}${dd}0000_${yyyy}${mm}${dd}2400</urn:auction.mRID>
      <urn:businessType>B74</urn:businessType>
      <urn:acquiring_Domain.mRID codingScheme="A01">10YHU-MAVIR----U</urn:acquiring_Domain.mRID>
      <urn:connecting_Domain.mRID codingScheme="A01">10YHU-MAVIR----U</urn:connecting_Domain.mRID>
      <urn:quantity_Measure_Unit.name>MAW</urn:quantity_Measure_Unit.name>
      <urn:currency_Unit.name>HUF</urn:currency_Unit.name>
      <urn:price_Measure_Unit.name>MWH</urn:price_Measure_Unit.name>
      <urn:divisible>A01</urn:divisible>
      <urn:status><urn:value>A06</urn:value></urn:status>
      <urn:registeredResource.mRID codingScheme="A01">${header.value.resourceId}</urn:registeredResource.mRID>
      <urn:flowDirection.direction>A01</urn:flowDirection.direction>
      <urn:standard_MarketProduct.marketProductType>A02</urn:standard_MarketProduct.marketProductType>
      <urn:Period>
        <urn:timeInterval>
          <urn:start>${startTime}</urn:start>
          <urn:end>${endTime}</urn:end>
        </urn:timeInterval>
        <urn:resolution>PT15M</urn:resolution>
  ${points}
      </urn:Period>
    </urn:Bid_TimeSeries>`
      })
      .join('\n')
  
    const xmlFooter = `</urn:ReserveBid_MarketDocument>`
    return `${xmlHeader}\n${timeSeries}\n${xmlFooter}`
  }
  
  function copyXML() {
    navigator.clipboard.writeText(generateXML())
      .then(() => alert("XML másolva!"))
      .catch(() => alert("Hiba másoláskor!"))
  }
  </script>
  
  <style scoped>
  .menetrend-page {
    display: flex;
    gap: 30px;
    padding: 20px;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .left-panel {
    flex: 1;
    max-width: 900px;
  }
  
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .header-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin-bottom: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="date"] {
    padding: 6px;
    font-size: 0.95rem;
  }
  
  .bid-entry {
    display: flex;
    gap: 8px;
    margin-bottom: 3px;
  }
  
  .time-label {
    width: 45px;
    font-weight: bold;
  }
  
  .savs-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .bid-column-card {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    min-width: 250px;
    max-height: 85vh;
    overflow-y: auto;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .add-column-btn {
    margin-top: 12px;
    padding: 6px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .copy-btn {
    padding: 6px 10px;
    font-size: 0.9rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .xml-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  textarea {
    width: 100%;
    height: 100%;
    font-family: monospace;
    margin-top: 10px;
    white-space: pre;
    resize: none;
  }
  </style>
  