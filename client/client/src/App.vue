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
import vueCookies from "vue-cookies"
import axios  from 'axios';
import {ref} from 'vue';


const token = ref('');
const username = ref('');
const cookie = ref('');
cookie.value = vueCookies.get("jwt");

if(cookie.value)
{
  storeToken(cookie.value);
}

function storeToken(event)
{
  token.value = event;
  if(!vueCookies.get("jwt"))
  {
    vueCookies.set("jwt", token.value, "30D");
  }

  let valid = false;
  axios.post("http://localhost:3000/verify", {jwt: token.value}).then(function (response) {
    valid = response.data.valid;

    if(valid)
    {
      axios.post("http://localhost:3000/jwt", {jwt: token.value}).then(function (response) {
        username.value = response.data.user;
      }).catch(function (error) {
        console.log(`Error ${error}`);
      });
    }
    else
    {
      token.value = '';
      vueCookies.remove("jwt");
      cookie.value = '';
    }

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
