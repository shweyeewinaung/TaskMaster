import { server } from './stores/mocks/server';
import { beforeAll, afterAll, afterEach } from 'vitest';

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})