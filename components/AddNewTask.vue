<template>
  <form class="addTask taskContainer" @submit="onSubmit">
    <section class="addTask__innerBox">
      <label for="taskInput" data-test="form-label">
          {{ updatingTaskData ? 'Update Task' : 'Create Your New Task' }}
      </label>
      <input 
        type="text" 
        id="taskInput" 
        v-model="taskName"
        @input="clearError"
      />
      <p v-show="showError" class="addTask__error" data-test="form-error">Please enter a task name!</p>
    </section>

    <button type="submit" class="addTask__submit" data-test="form-submit">
      {{ updatingTaskData ? 'Update Now' : 'Create Now' }}
    </button>

    <button 
      type="button" 
      v-if="updatingTaskData" 
      @click="setUpdatingTaskData(null); updateTaskName('');"
      class="addTask__cancel"
      data-test="update-cancel"
    >
        Not Now
    </button>
  </form>
</template>

<script lang="ts" setup>

  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useTaskStore } from '@/stores/task';
  import { v4 as uuidv4 } from 'uuid';

  const store = useTaskStore();
  const { createTask, updateTask } = store;
  const { isLoading, tasks, updatingTaskData, setUpdatingTaskData } = storeToRefs(store);

  const taskName = ref(''); 
  const showError = ref(false);

  function updateTaskName(newValue : string){
    taskName.value = newValue
  }

  watch(updatingTaskData, () => {
    if(updatingTaskData?.value?.name){
      updateTaskName(updatingTaskData.value.name);
    }
  })

  function clearError() {
    showError.value = false;
  }

  function onSubmit(e : Event) {
    e.preventDefault();
    const inputValue = taskName.value; 

    if(inputValue){
      showError.value = false;

      if(!updatingTaskData?.value?.id){
        const newId = uuidv4();

        let newTask : TaskInterface = {
          name: inputValue,
          id : newId
        }
        createTask(newTask);

      } else {

        let updatedTask : TaskInterface = {
          name: taskName.value,
          id : updatingTaskData.value.id
        }
        updateTask(updatedTask);
      }

      updateTaskName('');
    } else {
      showError.value = true;
    }
  }
</script>

