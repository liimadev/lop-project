import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"
import "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"
import "https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.2/dist/aframe-physics-system.min.js"

AFRAME.registerComponent('mycar', {
    schema: {
        velMax: { type: "number", default: 0.8 },
        aceleracao: { type: "number", default: 0.01 },
        friccao: { type: "number", default: 0.95 },
        rotV: { type: "number", default: 0.5 }
    },

    init: function () {
        this.direcao = {
            frente: false,
            tras: false,
            direita: false,
            esquerda: false,
        }
        this.velAtual = 0
        this.velocimetro = document.querySelector("#velocimetro")
        this.estadoCamera = 0
        this.caixa = null

        window.addEventListener('keydown', (e) => this.onKey(e, true))
        window.addEventListener('keyup', (e) => this.onKey(e, false))

        this.camera = document.querySelector("#camera1")
        if (this.camera && this.estadoCamera == 0) {
            this.camera.setAttribute('position', '4 3 0')
            this.camera.setAttribute('rotation', '-15 90 0')
        }
    },

    onKey: function (e, status) {
        const key = e.key.toLowerCase()
        if (key == 'w') this.direcao.frente = status
        if (key == 's') this.direcao.tras = status
        if (key == 'd') this.direcao.direita = status
        if (key == 'a') this.direcao.esquerda = status
    },

    tick: function () {
        const rot = this.el.object3D.rotation,
            valRot = THREE.MathUtils.degToRad(this.data.rotV) * 2

        if (this.direcao.frente) {
            this.velAtual -= this.data.aceleracao
        } else if (this.direcao.tras)
            this.velAtual += this.data.aceleracao
        else this.velAtual *= this.data.friccao


        if (this.velAtual > this.data.velMax * 0.75) this.velAtual = this.data.velMax * 0.75
        if (this.velAtual < -this.data.velMax) this.velAtual = -this.data.velMax

        if (Math.abs(this.velAtual) < 0.01)
            this.velAtual = 0

        if (Math.abs(this.velAtual) >= 0.1) {
            let angulo = 0
            if(this.direcao.direita) angulo = -valRot
            if(this.direcao.esquerda) angulo = valRot

            if(this.velAtual > 0) 
                angulo = -angulo

            if(this.el.body) {
                let mudancaRotacao = new CANNON.Quaternion()
                mudancaRotacao.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angulo)

                this.el.body.quaternion = this.el.body.quaternion.mult(mudancaRotacao)

                this.el.object3D.quaternion.copy(this.el.body.quaternion)
            }
        }

        if(this.el.body) {
            this.el.body.angularVelocity.set(0, 0, 0)

            let carroDirecao = new THREE.Vector3(1, 0, 0)
            carroDirecao.applyQuaternion(this.el.object3D.quaternion)

            let velX = carroDirecao.x * this.velAtual * 60,
                velZ = carroDirecao.z * this.velAtual * 60

            const velY = this.el.body.velocity.y
            this.el.body.velocity.set(velX, velY, velZ)
        }

        this.velocimetro.setAttribute('value', `${this.velAtual > 0 ? '(R)' : ''} ${parseInt(Math.abs(this.velAtual) * 100)} km/h`)
    

        if(this.caixa == null) {
            const cena = document.querySelector('#cena')
            const valX = (Math.random() * 250) + (Math.random() * (-250)),
                valZ = (Math.random() * 250) + (Math.random() * (-250))
                
            this.caixa = document.createElement('a-box')
            this.caixa.setAttribute('scale', '1 0.5 1')
            this.caixa.setAttribute('position', `${valX} 2 ${valZ}`)
            cena.appendChild(this.caixa)
        } else {
            if(this.verificarColisao(this.caixa)) {
                const pontuacao = document.querySelector('#pontuacao'),
                    valPontuacao = parseInt(pontuacao.getAttribute('text').value)

                pontuacao.setAttribute('text', `value: ${valPontuacao+1}`)
                this.caixa.remove()
                this.caixa = null
            }
        }
    },

    verificarColisao: function (obj) {
        let carX = this.el.object3D.position.x,
            carZ = this.el.object3D.position.z,
            objX = obj.object3D.position.x,
            objZ = obj.object3D.position.z

        let distance = Math.sqrt(((carX - objX)**2) + ((carZ - objZ)**2))

        return distance < 2
    }
})

AFRAME.registerComponent('gestos-input', {
    init: async function () {
        this.detector = null, this.video = null, this.canvas = null, this.ctx = null
        this.car = document.querySelector('#carro').components.mycar

        try {
            await this.configCamera()
            this.canvas = document.getElementById('canvas')
            this.ctx = this.canvas.getContext('2d')

            const model = handPoseDetection.SupportedModels.MediaPipeHands
            const detectorConfig = {
                runtime: 'mediapipe',
                modelType: 'full',
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
            }

            this.detector = await handPoseDetection.createDetector(model, detectorConfig)

            this.detectarMaos()
        } catch(erro) {
            console.error(erro)
        }
    },

    configCamera: async function () {
        this.video = document.getElementById('video')
        const stream = await navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': { width: 640, height: 480 }
        })
        this.video.srcObject = stream

        return new Promise((resolve) => {
            this.video.onloadedmetadata = () => {
                resolve(this.video)
            }
        })
    },

    detectarMaos: async function () {
        if(this.video.readyState >= 2) {
            const maos = await this.detector.estimateHands(this.video)

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            if(maos && maos.length > 0) {
                maos.forEach(mao => {
                    //hand.keypoints.forEach(keypoint => {
                    //    ctx.beginPath()
                    //    ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                    //    ctx.fillStyle = keypoint.name == "middle_finger_mcp" ? "blue" : "red";
                    //    ctx.fill();
                    //})
                    const point = mao.keypoints.filter(point => point.name == "middle_finger_mcp")

                    if(point.length > 0) {
                        const posX = point[0].x / (this.canvas.width * 2.5),
                            posY = point[0].y / (this.canvas.height * 2)

                        this.car.direcao.direita = posX < 0.3
                        this.car.direcao.esquerda = posX > 0.6 
                        this.car.direcao.frente = posY < 0.3
                        this.car.direcao.tras = posY > 0.7
                    } else {
                        Object.keys(this.car.direcao).forEach(k => this.car.direcao[k] = false)
                    }
                })
            } else Object.keys(this.car.direcao).forEach(k => this.car.direcao[k] = false)
        }
        requestAnimationFrame(() => this.detectarMaos())
    }
})