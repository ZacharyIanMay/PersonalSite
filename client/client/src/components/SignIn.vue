<template>
    <div>
        <h3>Login</h3>
        <p>{{ token }}</p>
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
        </div>
        <p id="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import {ref, defineEmits} from 'vue';
import axios from 'axios';

const emit = defineEmits(['login']);
const username = ref('');
const password = ref('');
const token = ref({});
const errorMessage = ref('');

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

</script>

<style scoped>
#labels, #inputs
{
    display:inline-block;
    vertical-align:top;
}
#button
{
    margin-left:0%;
    margin-right:100%;
}
#error
{
    color:red;
}
</style>