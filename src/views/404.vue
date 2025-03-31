<script>
export default {
  name: 'NotFound',
}
</script>

<template>
  <div class="not-found">
    <div class="main-container vgo-panel">
      <h1>404</h1>
      <p>Page not found</p>
      <router-link to="/" class="vgo-button">Go back to home</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  text-align: center;

  .main-container {
    padding: 40px 50px;

    h1 {
      font-size: 80px;
      margin-top: 0;
      margin-bottom: 0;
    }

    p {
      font-size: 1.5rem;
      font-weight: 200;
      margin-top: 0;
      margin-bottom: 20px;
    }

    a {
      text-decoration: none;
    }
  }
}
</style>
