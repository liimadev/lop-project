
const menu = document.querySelector('#menu')

async function init () {
    const response = await fetch('/api/me', {
        method: 'GET'
    })
    if(response.status == 200) {
        menu.innerHTML += ` <div class="links">
                                <a href="/jogo">Jogo v2.0</a>
                                <a href="/jogo-legacy">Jogo v1.0</a>
                                <a href="/ranking" target="_blank" id="ranking">Ranking</a>
                                <a id="creditos">Créditos</a>
                            </div>`
        const btnCreditos = document.querySelector('#creditos'),
            diagCreditos = document.querySelector('#diagCreditos'),
            closeModal = document.querySelector('#closeModal')

        btnCreditos.addEventListener('click', () => {
            diagCreditos.showModal()
        })
        closeModal.addEventListener('click', () => {
            diagCreditos.close()
        })

        const dados = await response.json()
        carregarUsername(dados.username)
    } else {
        menu.innerHTML += ` <div class="links">
                                <a id="login">Login</a>
                                <a id="cadastro">Cadastro</a>
                            </div>`

        document.querySelector('#login').addEventListener('click', () => login())
        document.querySelector('#cadastro').addEventListener('click', () => cadastro())
    }
}

async function login () {
    const username = prompt('Qual o seu username?')
    const senha = prompt('Informe sua senha:')

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, senha: senha })
    })
    const dados = await response.json()

    alert(dados.mensagem)
    if(response.status == 200)
        window.location.reload()
}

async function cadastro () {
    const username = prompt('Informe um username:')
    const senha = prompt('Crie uma senha:')

    if(username.toString().length > 0 && senha.toString().length >= 8) {
        return alert('O usuário precisa ser válido e a senha deve ter mais de 8 caracteres.')
    }

    const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, senha: senha })
    })
    const dados = await response.json()

    if(response.status == 200){
        alert(dados.mensagem + `\nFaça o login com as informações fornecidas.`)
        window.location.reload()
    } else {
        alert(dados.mensagem)
    }
}
function carregarUsername (username) {
    document.querySelector('#username').classList.add('show')
    document.querySelector('#username p').textContent = `Olá, ${username}!`
}

init()