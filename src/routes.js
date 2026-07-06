import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body ?? {}

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'title and description are required' }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify(task))
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query ?? {}

      const search =
        title || description
          ? {
              ...(title && { title }),
              ...(description && { description }),
            }
          : null

      const tasks = database.select('tasks', search)

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body ?? {}

      const task = database.findById('tasks', id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found' }))
      }

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'title or description is required' }))
      }

      const updated = database.update('tasks', id, {
        ...(title && { title }),
        ...(description && { description }),
        updated_at: new Date(),
      })

      return res.end(JSON.stringify(updated))
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.findById('tasks', id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found' }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.findById('tasks', id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found' }))
      }

      const isCompleted = !!task.completed_at

      const updated = database.update('tasks', id, {
        completed_at: isCompleted ? null : new Date(),
        updated_at: new Date(),
      })

      return res.end(JSON.stringify(updated))
    },
  },
]
