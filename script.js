const marcilio = document.getElementById("marcilio");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

let score = 0;
let lives = 3;
let marcilioPosition = 175; // Posição inicial do Marcilio
const moveAmount = 15; // Quantidade que Marcilio se move
const fallingObjects = ["xavasca.png", "cool.png"]; // Imagens que vão cair
let gameStarted = false; // Controle de estado do jogo

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && marcilioPosition > 0) {
        marcilioPosition -= moveAmount;
    } else if (event.key === "ArrowRight" && marcilioPosition < gameArea.clientWidth - marcilio.clientWidth) {
        marcilioPosition += moveAmount;
    } else if (event.key === "Enter" && !gameStarted) {
        gameStarted = true; // Inicia o jogo
        startGame();
    }
    marcilio.style.left = marcilioPosition + "px";
});

// Função para iniciar o jogo
function startGame() {
    setInterval(spawnFallingObject, 1000); // Gera um novo objeto a cada segundo
}

// Função para gerar objetos em queda
function spawnFallingObject() {
    const object = document.createElement("img");
    const randomIndex = Math.floor(Math.random() * fallingObjects.length);
    object.src = fallingObjects[randomIndex];
    object.classList.add("falling");
    object.style.left = Math.random() * (gameArea.clientWidth - 50) + "px"; // Posição aleatória
    object.style.top = "0px"; // Inicia no topo
    gameArea.appendChild(object);
    
    let fallInterval = setInterval(() => {
        let objectPosition = parseInt(object.style.top) || 0;
        objectPosition += 5; // Velocidade de queda

        // Verifica colisões
        if (checkCollision(object, marcilio)) {
            if (object.src.includes("xavasca.png")) {
                lives--;
                livesDisplay.innerText = "Lives: " + lives;
                shakeMarcilio(); // Chama a função de tremor
                if (lives <= 0) {
                    alert("Game Over! Final Score: " + score);
                    document.location.reload();
                }
            } else if (object.src.includes("cool.png")) {
                score += 100;
                scoreDisplay.innerText = "Score: " + score;
            }
            clearInterval(fallInterval);
            object.remove();
        }

        if (objectPosition > gameArea.clientHeight) {
            clearInterval(fallInterval);
            object.remove();
        }

        object.style.top = objectPosition + "px";
    }, 50); // Atualiza a posição a cada 50ms
}

// Função para verificar colisões
function checkCollision(object, marcilio) {
    const objectRect = object.getBoundingClientRect();
    const marcilioRect = marcilio.getBoundingClientRect();
    return !(
        objectRect.top > marcilioRect.bottom ||
        objectRect.bottom < marcilioRect.top ||
        objectRect.right < marcilioRect.left ||
        objectRect.left > marcilioRect.right
    );
}

// Função para aplicar o efeito de tremor no Marcilio
function shakeMarcilio() {
    marcilio.classList.add("shake");
    setTimeout(() => {
        marcilio.classList.remove("shake");
    }, 500); // Dura 500ms
}
