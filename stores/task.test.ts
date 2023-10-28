import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from './task';
import { v4 as uuidv4 } from 'uuid';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('Task Store Function Test', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('Get All Tasks Function', async() => {

        const response = await fetch('http://localhost:3001/tasks')

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
    });

    test('Create a Task Function', async() => {

        const newId = uuidv4();
        let newTask = JSON.stringify({
            "name": `Added by testing ${newId}`,
            "id": newId
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
            "name": `Added by testing ${newId}`,
            "id": newId
        })
    })

    test('Update a Task Function', async() => {

        const newId = uuidv4();
        let newTask = JSON.stringify({
            "name": `Added by testing ${newId}`,
            "id": newId
        });
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: newTask
        };
        await fetch('http://localhost:3001/tasks', postOptions)

        let updateTask = JSON.stringify({
            "name": `Added by testing ${newId} (updated)`
        });
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: updateTask
        };

        setTimeout(async () => {
            const response = await fetch(`http://localhost:3001/tasks/${newId}`, requestOptions);

            expect(response.status).toBe(200);
            expect(response.statusText).toBe('OK');
            expect(await response.json()).toEqual({
                "name": `Added by testing ${newId} (updated)`,
                "id": newId
            })
        }, 500); 
    })

    test('Delete a Task Function', async() => {
        const newId = uuidv4();
        let newTask = JSON.stringify({
            "name": `Added by testing ${newId} to delete`,
            "id": newId
        });
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: newTask
        };
        await fetch('http://localhost:3001/tasks', postOptions)

        setTimeout(async () => {
            const response = await fetch(`http://localhost:3001/tasks/${newId}`, {
                method: 'DELETE'
            });

            expect(response.status).toBe(200);
            expect(response.statusText).toBe('OK');
            expect(await response.json()).toEqual({})
        }, 500); 
    })
    
});

describe('Test for Getters', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('ReversedTasks', () => {
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

    it('SetUpdatingTaskData', () => {
        const store = useTaskStore();
        
        store.updatingTaskData = null;

        const newTask: TaskInterface = { id: '3', name: 'Task 3' };

        store.setUpdatingTaskData(newTask);
        expect(store.updatingTaskData).toEqual(newTask);
    })

})
