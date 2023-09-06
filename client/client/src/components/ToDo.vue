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
                <td><input type="checkbox" id="{{ index }}" /></td>
                <td>{{task.taskid}}</td>
                <td>{{task.task}}</td>
                <td>{{new Date(task.deadline).toString()}}</td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import {defineProps, ref, watch} from 'vue';
    import axios from 'axios';
    const props = defineProps({user: String});
    const tasks = ref({});
    const username = ref(props.user);
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
                console.log(response);
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

</script>

<style scoped>
table, th, td
{
    border:1px solid black;
}
p
{
    padding-right: 10px;
    padding-left: 10px;
}
.center
{
    margin-left:auto;
    margin-right:auto;
}
</style>
