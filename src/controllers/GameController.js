import { Router } from 'express'
import { validarUsuario } from './UsuarioController.js'
import path from 'path'
import { fileURLToPath } from 'url'

const gameRouter = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))


gameRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/paginas/index.html'))
})
gameRouter.get('/ranking', async (req, res) => {
    const user = await validarUsuario(req.cookies.auth_cookie)

    if(user != null)
        res.sendFile(path.join(__dirname, '../../public/paginas/ranking.html'))
    else res.redirect('/')
})
gameRouter.get('/jogo', async (req, res) => {
    const user = await validarUsuario(req.cookies.auth_cookie)

    if(user != null)
        res.sendFile(path.join(__dirname, '../../public/paginas/jogo.html'))
    else res.redirect('/')
})
gameRouter.get('/jogo-legacy', async (req, res) => {
    const user = await validarUsuario(req.cookies.auth_cookie)

    if(user != null)
        res.sendFile(path.join(__dirname, '../../public/paginas/jogo-antigo.html'))
    else res.redirect('/')
})

export { gameRouter }