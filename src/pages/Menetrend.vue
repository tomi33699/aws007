<template>
  <div class="charts-page">
    <h2>XML Ajánlatgenerátor</h2>

    <!-- Fejléc adatok -->
    <div class="section">
      <label>Sender ID: <input v-model="header.senderId" /></label>
      <label>Receiver ID: <input v-model="header.receiverId" /></label>
      <label>Resource ID: <input v-model="header.resourceId" /></label>
      <label>Dátum:
        <input type="date" v-model="header.date" />
      </label>
    </div>

    <!-- Sávok -->
    <div class="section">
      <h3>Sávok</h3>
      <div v-for="(band, bandIndex) in bands" :key="bandIndex" class="band">
        <h4>{{ bandIndex + 1 }}. sáv</h4>
        <div class="points">
          <div v-for="i in 96" :key="i" class="point">
            <label>{{ i }}.</label>
            <input
              type="number"
              v-model.number="band.points[i - 1].quantity"
              step="0.001"
            />
            <input
              type="number"
              v-model.number="band.points[i - 1].price"
              step="1"
            />
          </div>
        </div>
      </div>
      <button @click="addBand">+ Új sáv hozzáadása</button>
    </div>

    <!-- XML -->
    <div class="section">
      <h3>Generált XML</h3>
      <button @click="generateXml">XML generálása</button>
      <textarea rows="20" readonly :value="generatedXml"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format, addDays } from "date-fns"

const header = ref({
  senderId: '15X-DTTPI------I',
  receiverId: '10X1001A1001A329',
  resourceId: '15W-SZK007--UE-K',
  date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
})

const createEmptyBand = () => {
  return {
    points: Array.from({ length: 96 }, (_, i) => ({
      quantity: 1.0,
      price: -100000.0,
    })),
  }
}

const bands = ref([createEmptyBand(), createEmptyBand(), createEmptyBand()])

const addBand = () => {
  bands.value.push(createEmptyBand())
}

const generatedXml = ref('')

const generateXml = () => {
  const date = header.value.date
  const startDate = new Date(date + 'T00:00:00Z')

  const formatTime = (d: Date) => d.toISOString().replace('.000', '')

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<ReserveBid>\n`

  bands.value.forEach((band, bandIndex) => {
    band.points.forEach((point, i) => {
      const start = new Date(startDate.getTime() + i * 15 * 60000)
      const end = new Date(start.getTime() + 15 * 60000)

      xml += `  <Bid_TimeSeries>\n`
      xml += `    <mRID>${header.value.resourceId}_${bandIndex + 1}_${i + 1}</mRID>\n`
      xml += `    <auction.mRID>AFRR_${formatTime(start)}_${formatTime(end)}</auction.mRID>\n`
      xml += `    <Period>\n`
      xml += `      <timeInterval>\n`
      xml += `        <start>${formatTime(start)}</start>\n`
      xml += `        <end>${formatTime(end)}</end>\n`
      xml += `      </timeInterval>\n`
      xml += `      <Point>\n`
      xml += `        <position>${i + 1}</position>\n`
      xml += `        <quantity.quantity>${point.quantity.toFixed(3)}</quantity.quantity>\n`
      xml += `        <energy_Price.amount>${point.price.toFixed(3)}</energy_Price.amount>\n`
      xml += `      </Point>\n`
      xml += `    </Period>\n`
      xml += `  </Bid_TimeSeries>\n`
    })
  })

  xml += `</ReserveBid>`

  generatedXml.value = xml
}
</script>

<style scoped>
.charts-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.band {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}
.points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 5px;
}
textarea {
  width: 100%;
  font-family: monospace;
}
</style>
