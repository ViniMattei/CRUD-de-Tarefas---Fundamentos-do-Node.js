import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (!route) {
    return res.writeHead(404).end(JSON.stringify({ message: 'Route not found' }))
  }

  const routeParams = url.match(route.path)

  const { query, ...params } = routeParams.groups

  req.params = params
  req.query = query ? extractQueryParams(query) : {}

  return route.handler(req, res)
})

const port = process.env.PORT ?? 3333

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
