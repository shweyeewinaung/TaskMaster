import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('http://localhost:3001/tasks', () => {
    return HttpResponse.json([
        {
            "id": '787887687',
            "name": "Exercise at the gym"
        },
        {
            "name": "Plan multiple vacations",
            "id": '76876993434'
        }
    ])
  }),

  http.post('http://localhost:3001/tasks', () => {
    return HttpResponse.json({
        "id": '0000000000',
        "name": "Hello Testing ID 3"
    })
  }),

  http.put('http://localhost:3001/tasks/4', () => {
    return HttpResponse.json({
        "id": 4,
        "name": "Exercise at the gym (updated)"
    })
  }),

  http.delete('http://localhost:3001/tasks/4', () => {
    return HttpResponse.json({})
  }),
]