import express from 'express'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { sequelize } from './src/database/config.js'
import { router } from './src/controllers/UsuarioController.js'
import cookieParser from 'cookie-parser'
import { gameRouter } from './src/controllers/GameController.js'

config({ quiet: true })
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use('/api', [router])
app.use([gameRouter])

const PORT = process.env.PORT || 3000

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use('/assets', express.static(path.join(__dirname, 'public/assets/')))
app.use('/js', express.static(path.join(__dirname, 'public/scripts/')))
app.use('/css', express.static(path.join(__dirname, 'public/css/')))
app.use('/capas', express.static(path.join(__dirname, 'public/capas/')))

sequelize.authenticate()
    .then(() => {
        console.log('# Banco iniciado!')
        return sequelize.sync()
    })
    .then(() => {
        app.listen(PORT, () => console.log(`# Servidor iniciado em localhost:${PORT}.`))
    })
    .catch(err => {
        console.error(err)
    })