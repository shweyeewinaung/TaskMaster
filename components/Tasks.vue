<template>
  <section class="taskList taskContainer">
    <h2 class="mt-0">Master Task List</h2>
    <ol class="taskList__listItem">
        <li v-if="!isLoading && tasks.length === 0">No tasks found.</li>

        <li v-if="isLoading" class="skeleton taskList__listItem__skeleton"></li>
        <li v-if="isLoading" class="skeleton taskList__listItem__skeleton"></li>
        <li v-if="isLoading" class="skeleton taskList__listItem__skeleton"></li>

        <li v-else v-for="task in reversedTasks" :key="task.id" :class="`${(updatingTaskData && task.id === updatingTaskData?.id) ? 'selected' : ''}`">
            <span class="taskList__listItem__name">{{ task.name }}</span>
            <span class="taskList__listItem__tool">
                <button @click="setUpdatingTaskData(task)" :disabled="updatingTaskData">
                    <Icon name="ic:baseline-edit-note"/>
                </button>
                <button @click="onDeleteTask(task.id)" :disabled="updatingTaskData">
                    <Icon name="material-symbols:delete-outline" />
                </button>
            </span>
        </li>
    </ol>
    <span class="taskList__totalText">
        Total task(s) : {{ tasks.length }} task(s)
    </span>
  </section>
</template>

<script lang="ts" setup>
    import { storeToRefs } from 'pinia';
    import { useTaskStore } from '@/stores/task';

    const store = useTaskStore();

    const { getAllTasks, deleteTask } = store;
    const { tasks, isLoading, reversedTasks, updatingTaskData, setUpdatingTaskData } = storeToRefs(store);

    await getAllTasks();

    function onDeleteTask(id : number){
        deleteTask(id)
    }

</script>