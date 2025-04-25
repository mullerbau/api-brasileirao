import express from 'express'
import routesViagens from './routes/clubes'

const app = express()
const port = 3000

app.use(express.json())
app.use("/viagens", routesViagens)

app.get('/', (req, res) => {
  res.send('API: Cadastro de clubes Brasileirão 2025')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})