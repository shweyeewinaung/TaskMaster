/**
 * @vitest-environment node
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from './task';
import { server } from './mocks/server';
import { http, HttpResponse, delay } from 'msw'

/* beforeAll(() => {
    setActivePinia(createPinia());
}); */

describe('useTaskStore', () => {

    /* let store : ReturnType<typeof useTaskStore>;

    beforeEach(() => {
        store = useTaskStore();
    });

    afterEach(() => {
        store.$reset();
    });

    test('create a store', () => {
        const store = useTaskStore();
        expect(store).toBeDefined();
    }) */

    test('get all tasks function', async() => {

        const response = await fetch('http://localhost:3001/tasks')

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        expect(await response.json()).toEqual([{
            "id": 4,
            "name": "Exercise at the gym"
        },
        {
            "name": "Plan multiple vacations",
            "id": 5
        }])
    })

    /* test.only('get all tasks function', async() => {

        server.resetHandlers(
            http.get('http://localhost:3001/tasks', () => {
                return new HttpResponse(null, {
                    status: 500,
                })
            }),
        )
        const response = await fetch('http://localhost:3001/tasks')

        expect(response.status).toBe(500);
        expect(response.statusText).toBe('Internal Server Error');
        console.log(response)

    }) */

    
})