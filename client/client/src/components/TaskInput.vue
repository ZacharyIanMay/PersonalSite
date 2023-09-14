<template>
    <div>
        <h3>New Task</h3>
        <div id="labels">
            <label for="task">Task:  </label>
            <br>
            <input type="text" id="task" v-model="task" />
        </div>
        <br>
        <div id="inputs">
            <label for="deadline">Deadline:  </label>
            <br>
            <input type="datetime-local" id="deadline" v-model="deadline" />
        </div>
        <br>
        <button id="button" @click="createTask(task, deadline)">Create</button>
    </div>
</template>

<script setup>
import {defineEmits, ref} from 'vue';

const emit = defineEmits(['submitTask']);
const task = ref('');
const deadline = ref('');

function createTask(task, deadline)
{
    emit('submitTask', {task: task, deadline: deadline});
}

</script>

<style scoped>
#labels, #inputs
{
    display:inline-block;
    vertical-align:top;
    margin-top: 2px;
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
input, button
{
    margin: 2px;
}
</style>