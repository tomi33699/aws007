<template>
  <div class="profile-card">
    <div class="profile-image">
      <img src="@/assets/card-img.jpeg" alt="Profile Image" />
      <div class="profile-layer"></div>
    </div>
    <div class="profile-details">
      <h2>{{ currentDate }}</h2>
      <p>{{ currentTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
data() {
  return {
    currentDate: new Date().toLocaleDateString(),
    currentTime: new Date().toLocaleTimeString(),
  };
},
created() {
  setInterval(() => {
    this.currentTime = new Date().toLocaleTimeString();
  }, 1000);
}
};
</script>

<style scoped>
.profile-card {
position: relative;
border-radius: 12px;
padding: 1em;
width: 100%;
text-align: center;
background-color: #fff;
align-content: center;
}
.profile-image img {
position: relative;
border-radius: 0;
width: 100%;
height: 100%;
object-fit: cover;
margin-bottom: 15px;
}

.profile-details h2 {
margin: 10px 0;
font-size: 20px;
font-weight: 600;
}
.profile-details p {
font-size: 16px;
color: #555;
}

</style>
