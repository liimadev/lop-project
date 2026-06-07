# LoP Project - 2.0
- O jogo foi desenvolvido como trabalho semestral da disciplina de Lógica de Programação.
Seu objetivo é simples: Mover o carro pelo mapa e coletar o maior números de moedas possível. Mas, invés de teclas, **usa-se as mãos**.

## Dependências
O game foi construído com **[AFrame](https://aframe.io/)**, que possibilita o desenvolvimento de elementos 3D na Web e outras bibliotecas:
- **[TensorFlow.js](https://www.tensorflow.org/js?hl=pt-br)** unido ao *[HandPoseDetection](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection)* do Mediapipe, para identificar e definir a direção do carro usando as mãos.
- **[AFrame Physics System](https://github.com/c-frame/aframe-physics-system#installation)**, para criar a física de colisão entre o veiculo e os limites do mapa.

## Considerações
- Para rodar o projeto localmente, deve-se ter instalado o Node.js e NPM. 
- Para que funcione adequadamente, é necessário o uso de uma WebCam.

---
![LoP Project](https://github.com/user-attachments/assets/e1f2191c-60d5-4e68-8b5d-77cf9015c1f5)
