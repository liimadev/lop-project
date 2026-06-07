import express from 'express'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

config({ quiet: true })
const app = express()
const PORT = process.env.PORT || 3000

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use('/assets', express.static(path.join(__dirname, 'public/assets/')))
app.use('/js', express.static(path.join(__dirname, 'public/scripts/')))
app.use('/css', express.static(path.join(__dirname, 'public/css/')))
app.use('/capas', express.static(path.join(__dirname, 'public/capas/')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/paginas/index.html'))
})

app.get('/jogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/paginas/jogo.html'))
})
app.get('/jogo-legacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/paginas/jogo-antigo.html'))
})

app.listen(PORT, () => console.log(`# Servidor iniciado em localhost:${PORT}.`))