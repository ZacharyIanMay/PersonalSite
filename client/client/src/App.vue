<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <SignIn />
    <ToDo />
  </div>
</template>

<script setup>
import SignIn from './components/SignIn.vue'
import ToDo from "./components/ToDo.vue"
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
