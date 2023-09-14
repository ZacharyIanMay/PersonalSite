<template>
    <div>
        <div v-if="!register">
            <h3>Login</h3>
            <div id="labels">
                <label for="username">Username:  </label>
                <br>
                <label for="password">Password:  </label>
                <br>
            </div>
            <div id="inputs">
                <input type="text" id="username" v-model="username" placeholder="username" />
                <br>
                <input type="password" id="password" v-model="password" placeholder="password" />
                <br>
                <button id="button" @click="log(username, password)">Login</button>
                <button id="register" @click="reg()">Register</button>
            </div>
            <p id="error">{{ errorMessage }}</p>
        </div>
        <RegisterUser v-if="register" @login="send($event)" />
    </div>
</template>

<script setup>
import RegisterUser from './RegisterUser.vue';
import {ref, defineEmits} from 'vue';
import axios from 'axios';

const emit = defineEmits(['login']);
const username = ref('');
const password = ref('');
const token = ref({});
const errorMessage = ref('');
const register = ref(0);

function log(username, password)
{
    axios.post("http://localhost:3000/login", {username: username, password: password}).then(function (response) {
    //console.log(response);
    if(response.data.success)
    {
        token.value = response.data.token;
        errorMessage.value = '';
        emit('login', token.value);
    }
    else
    {
        errorMessage.value = 'Incorrect Username or Password';
    }
  }).catch(function (error) {
    console.log(`Error ${error}`);
  });
}

function send(event)
{
    emit('login', event);
}

function reg()
{
    register.value = 1;
}

</script>

<style scoped>
#labels, #inputs
{
    display:inline-block;
    vertical-align:top;
    margin-top: 2px;
    padding: 5px;
}
button
{
    margin-left:0%;
    margin-right:100%;
}
#error
{
    color:red;
}
label
{
    margin-top: 2px;
}
input, button
{
    margin: 2px;
}
</style>