import { defineStore } from "pinia";
import type { TaskInterface } from "./type";

export const useTaskStore = defineStore('myStore', {
  state: () => ({
    tasks: [] as TaskInterface[], 
    isLoading: false,
    updatingTaskData: null as null | TaskInterface,
  }),
  getters: {
    reversedTasks: (state) => {
        return state.tasks.slice().reverse();
    },
    setUpdatingTaskData: (state) => {
        return (selectedTask : TaskInterface) => {
            state.updatingTaskData = selectedTask
        } 
    }
  },
  actions: {
    async getAllTasks() {
        this.isLoading = true;
        try {
            const response = await $fetch<TaskInterface[]>('http://localhost:3001/tasks', {
                method: 'GET'
            }); 

            if(response){
                this.tasks = response
            }

        } catch (error) {
            console.error('Error fetching task:', error);
            throw error;
        } finally {
            this.isLoading = false; 
        }
    },

    async createTask(newTask : TaskInterface) {
        this.isLoading = true;
        try{
            await $fetch(`http://localhost:3001/tasks/`, {
                method: 'POST',
                body: newTask
            })

            await this.getAllTasks();

        } catch (error){
            console.error('Error creating task:', error);
            throw error;
        } finally {
            this.isLoading = false; 
        }
    },

    async updateTask(updatedTask : TaskInterface) {
        this.isLoading = true;
        try{
            await $fetch(`http://localhost:3001/tasks/${updatedTask.id}`, {
                method: 'PUT',
                body: updatedTask
            });

            this.updatingTaskData = null;
            await this.getAllTasks();

        } catch (error){
            console.error('Error updating task:', error);
            throw error;

        } finally {
            this.isLoading = false; 
        }
    },

    async deleteTask(id : number) {
        this.isLoading = true;
        try{
            await $fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'DELETE'
            })

            await this.getAllTasks();

        } catch (error){
            console.error('Error deleting task:', error);
            throw error;
        } finally {
            this.isLoading = false; 
        }
    },
  },
});

