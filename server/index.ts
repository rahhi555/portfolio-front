import express from 'express'

const app: express.Express = express()

app.get('/health-check', (_, res: express.Response) => {
  res.status(200).send('health check front ok')
})

module.exports = app