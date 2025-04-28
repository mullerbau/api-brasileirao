import express from 'express'
import routesClubes from './routes/clubes'
import routesJogadores from './routes/jogadores'

const app = express()
const port = 3000

app.use(express.json())
app.use("/clubes", routesClubes)
app.use("/jogadores", routesJogadores)

app.get('/', (req, res) => {
  res.send('API: Cadastro de clubes Brasileirão 2025 - Casa pt2')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})