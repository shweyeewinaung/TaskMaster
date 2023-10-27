import { describe, test, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from './task';
import { server } from './mocks/server';
import { mount } from '@vue/test-utils';
import AddNewTask from '../components/AddNewTask.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe.skip('task store function test', () => {

    test('get all tasks function', async() => {

        const response = await fetch('http://localhost:3001/tasks')

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
    });

    test('create a task function', async() => {

        let newTask = JSON.stringify({
            "name": "Added by testing 787878",
            "id": '787878'
        });
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: newTask
        };
        
        const response = await fetch('http://localhost:3001/tasks', requestOptions)

        expect(response.status).toBe(201);
        expect(response.statusText).toBe('Created');
        expect(await response.json()).toEqual({
            "name": "Added by testing 787878",
            "id": '787878'
        })
    })

    test('update a task function', async() => {

        let updateTask = JSON.stringify({
            "name": "Added by testing 787878 (updated 3)"
        });
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: updateTask
        };

        const response = await fetch('http://localhost:3001/tasks/787878', requestOptions);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        expect(await response.json()).toEqual({
            "name": "Added by testing 787878 (updated 3)",
            "id": '787878'
        })
    })

    test('delete a task function', async() => {
        const response = await fetch('http://localhost:3001/tasks/787878', {
            method: 'DELETE'
        });

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        expect(await response.json()).toEqual({})
    })
    
});

describe.skip('test for getters', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('reversedTasks', () => {
        const store = useTaskStore();
        
        store.tasks = [
            { id: '1', name: 'Task 1' },
            { id: '2', name: 'Task 2' },
            { id: '3', name: 'Task 3' },
        ];

        const reversedTasks: TaskInterface[] = store.reversedTasks;
        const expectedReversedTasks: TaskInterface[] = [
            { id: '3', name: 'Task 3' },
            { id: '2', name: 'Task 2' },
            { id: '1', name: 'Task 1' },
        ];

        expect(reversedTasks).toEqual(expectedReversedTasks);
    });

    it('setUpdatingTaskData', () => {
        const store = useTaskStore();
        
        store.updatingTaskData = null;

        const newTask: TaskInterface = { id: '3', name: 'Task 3' };

        store.setUpdatingTaskData(newTask);
        expect(store.updatingTaskData).toEqual(newTask);
    })

})
