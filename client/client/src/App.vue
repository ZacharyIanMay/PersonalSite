<template>
  <div>
    <p>Token: {{ token }}</p>
    <p>User: {{ user }}</p>
    <img alt="Vue logo" src="./assets/logo.png">
    <SignIn v-if="!token" @login="storeToken($event)"/>
    <ToDo v-if="token" />
  </div>
</template>

<script setup>
import SignIn from './components/SignIn.vue'
import ToDo from "./components/ToDo.vue"
import base64url  from 'base64url';
import {ref} from 'vue';

const token = ref('');
const user = ref('');

function storeToken(event)
{
  token.value = event;
  user.value = getUser(token.value);
}

function getUser(JWT)
{
  //TODO: Fix this
  console.log("Testing nested function");
  let split = JWT.split('.');
  console.log(1);
  let body = base64url.decode(split[1]);
  console.log(2);
  body = JSON.parse(body);
  console.log(3);
  let user = body.user;
  console.log(body);
  console.log(user);
  return user;
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
