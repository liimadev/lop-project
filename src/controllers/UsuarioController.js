import { Router } from 'express'
import { Usuario } from '../models/Usuario.js'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'

const router = Router()

router.post('/cadastro', async (req, res) => {
    const data = req.body
    try {
        const { username } = data

        const userExiste = await Usuario.findOne({ where: { username } })
        if(userExiste)
            return res.status(400).json({ mensagem: 'O username já está em uso.' })

        await Usuario.create(data)
        return res.status(200).json({ mensagem: 'Usuário criado!' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro ao inserir.', error })
    }
})

router.post('/login', async (req, res) => {
    const data = req.body
    try {
        const { username } = data

        const usuario = await Usuario.findOne({ where: { username } })
        if(usuario) {
            const senhaValida = await bcrypt.compare(data.senha, usuario.senha)
            if(senhaValida) {
                res.cookie('auth_cookie', usuario.id, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 5 * 1000
                })
            } else return res.status(400).json({ mensagem: 'A senha está incorreta.' })
        } else return res.status(400).json({ mensagem: 'O usuário não existe.' })

        return res.status(200).json({ mensagem: "Usuário logado com sucesso!" })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro ao logar.', error })
    }
})

router.get('/me', async (req, res) => {
    const usuario = await validarUsuario(req.cookies.auth_cookie)
    if(usuario != null)
        return res.json({ username: usuario.username })
    else return res.status(401).send("Você não tem autorização")
})

router.post('/novo-recorde', async (req, res) => {
    const usuario = await validarUsuario(req.cookies.auth_cookie)
    if(usuario != null) {
        const pontuacao = req.body.pontuacao
        if(pontuacao > usuario.maiorPontuacao) {
            usuario.maiorPontuacao = pontuacao
            usuario.save()
        }
        return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' })
    }else return res.status(401).send("Você não tem autorização")
})

router.get('/ranking', async (req, res) => {
    const usuarios = await Usuario.findAll({ 
        where: {
            maiorPontuacao: {
                [Op.ne]: 0
            }
        },
        attributes: ['username', 'maiorPontuacao', 'dataPontuacao'],
        order: [["maiorPontuacao", "DESC"]]
    })
    return res.json(usuarios)
})


export const validarUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id)
    return usuario
}
export { router }