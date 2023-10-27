import { defineStore } from "pinia";
import type { TaskInterface } from "./type";
import { mande } from 'mande'

const api = mande('http://localhost:3001/tasks')

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
            const response : TaskInterface[] = await api.get();

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
            await api.post(newTask);
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
            await api.put(updatedTask.id, {"name": updatedTask.name});

            await this.getAllTasks();
            this.updatingTaskData = null;

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
            await api.delete(id);
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

