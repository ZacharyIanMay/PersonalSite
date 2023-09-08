<template>
    <div>
        <h3>Welcome {{ username }}</h3>
        
        <table class="center">

            <tr>
                <th>Selection</th>
                <th>Task ID</th>
                <th>Task</th>
                <th>Deadline</th>
            </tr>

            <tr v-for="(task, index) in tasks" :key="index">
                <td><input type="checkbox" :id="index" /></td>
                <td>{{task.taskid}}</td>
                <td>{{task.task}}</td>
                <td>{{new Date(task.deadline).toString()}}</td>
            </tr>

        </table>

        <TaskInput v-if="newTask" @submitTask="createTask($event)" />

        <button v-if="!newTask" id="button" @click="addTask()">Add a task</button>
    </div>
</template>

<script setup>
    import TaskInput from './TaskInput.vue'
    import {defineProps, ref, watch} from 'vue';
    import axios from 'axios';

    const props = defineProps({user: String});
    const tasks = ref({});
    const username = ref(props.user);
    const newTask = ref(0);
    const update = ref(0);

    axios.post("http://localhost:3000/usertask", {username: username.value}).then(function (response) {
        //console.log(response);
        tasks.value = response.data;
        if(tasks.value.success)
        {
            tasks.value = tasks.value.tasks;
        }
        else
        {
            tasks.value = [{taskid: 0, username: username, task: "No tasks", deadline:Date.now()}];
        }
    }).catch(function (error) {
        console.log(`Error ${error}`);
    });

    watch(props, () => {
        setTimeout(function() {
            username.value = props.user;
            axios.post("http://localhost:3000/usertask", {username: username.value}).then(function (response) {
                tasks.value = response.data;
                if(tasks.value.success)
                {
                    tasks.value = tasks.value.tasks;
                }
                else
                {
                    tasks.value = [{taskid: 0, username: username, task: "No tasks", deadline:Date.now()}];
                }
            }).catch(function (error) {
                console.log(`Error ${error}`);
            });  
        }, 10)
    });

    watch(update, () => {
        setTimeout(function() {
            username.value = props.user;
            axios.post("http://localhost:3000/usertask", {username: username.value}).then(function (response) {
                tasks.value = response.data;
                if(tasks.value.success)
                {
                    tasks.value = tasks.value.tasks;
                }
                else
                {
                    tasks.value = [{taskid: 0, username: username, task: "No tasks", deadline:Date.now()}];
                }
            }).catch(function (error) {
                console.log(`Error ${error}`);
            });  
        }, 10)
    });

    function addTask()
    {
        newTask.value = 1;
    }

    function createTask(event)
    {
        axios.post("http://localhost:3000/task", {username: username.value, task: event.task, deadline: event.deadline}).then(function () {
                update.value = 1;
                setTimeout(function() {
                    update.value = 0;
                }, 50)
                newTask.value = 0;
            }).catch(function (error) {
                console.log(`Error ${error}`);
            });
    }

</script>

<style scoped>
table
{
    border:1px solid black;
}
tr
{
    box-shadow: 0px 0px 0px 1px rgb(0, 0, 0);
}
p
{
    padding-right: 10px;
    padding-left: 10px;
}
button
{
    padding: 2px;
    margin: 10px;
}
.center
{
    margin-left:auto;
    margin-right:auto;
}
</style>
