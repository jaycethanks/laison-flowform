<template>
  <div id="app">
    <formdesign/>
  </div>
</template>

<script>
import formdesign from './components/formdesign/index.vue'

export default {
  name: 'App',
  components: {
    formdesign
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
