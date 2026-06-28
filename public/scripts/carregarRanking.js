const rankingDiv = document.querySelector('#ranking')
async function carregar () {
    const response = await fetch("/api/ranking", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()

    let pos = 1
    for(const d of data) {
        const dt = new Date(d.dataPontuacao)
        const data = `${dt.getDate().toString().padStart(2, "0")}/${(dt.getMonth()+1).toString().padStart(2, "0")}/${dt.getFullYear()}`
        rankingDiv.innerHTML += `<div class="jogador">
                                    <div>
                                        <h4>${pos}. ${d.username}</h4>
                                        <p>Em ${data}</p>
                                    </div>
                                    <p id="pontos">${d.maiorPontuacao}</p>
                                </div>`
    
        pos++
    }
}

carregar()