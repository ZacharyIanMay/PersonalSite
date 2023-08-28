<template>
    <div>
        <table>
            <tr>
                <th>
                    <input type="checkbox" id="todo-item1" />
                </th>
                <th>
                    <p>[insert task name here]</p>
                </th>
                <th>
                    <p>[insert task deadline here]</p>
                </th>
            </tr>
            <tr>
                <th>
                    <input type="checkbox" id="todo-item2" />
                </th>
                <th>
                    <p>[insert task name here]</p>
                </th>
                <th>
                    <p>[insert task deadline here]</p>
                </th>
            </tr>
            <tr>
                <th>
                    <input type="checkbox" id="todo-item3" />
                </th>
                <th>
                    <p>[insert task name here]</p>
                </th>
                <th>
                    <p>[insert task deadline here]</p>
                </th>
            </tr>
            <tr>
                <th>
                    <input type="checkbox" id="todo-item4" />
                </th>
                <th>
                    <p>[insert task name here]</p>
                </th>
                <th>
                    <p>[insert task deadline here]</p>
                </th>
            </tr>
        </table>
        
    </div>
</template>

<script>
export default
{
    props:
    {
        list: {default: false}
    }
}
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
</style>
