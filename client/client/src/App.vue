<template>
  <div>
    <p>Token: {{ token }}</p>
    <p>User: {{ username }}</p>
    <img alt="Vue logo" src="./assets/logo.png">
    <SignIn v-if="!token" @login="storeToken($event)"/>
    <ToDo v-if="token" :user="username" />
  </div>
</template>

<script setup>
import SignIn from './components/SignIn.vue'
import ToDo from "./components/ToDo.vue"
import axios  from 'axios';
import {ref} from 'vue';

const token = ref('');
const username = ref('');

function storeToken(event)
{
  token.value = event;
  axios.post("http://localhost:3000/jwt", {jwt: token.value}).then(function (response) {
  username.value = response.data.user;
  }).catch(function (error) {
    console.log(`Error ${error}`);
  });
}
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
