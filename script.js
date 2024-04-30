const symbols = ['reel1_1.png', 'reel1_2.png', 'reel2_1.png', 'reel2_2.png', 'reel3_1.png', 'reel3_2.png'];
const payouts = {
    'reel1_1.png': { 2: 5, 3: 10 },
    'reel1_2.png': { 2: 5, 3: 10 },
    'reel2_1.png': { 3: 20 },
    'reel2_2.png': { 3: 20 },
    'reel3_1.png': { 3: 30 },
    'reel3_2.png': { 3: 30 }
};

// Variable para rastrear el estado del giro
let spinning = false;

// Función para girar los carretes y determinar los resultados
async function spinReels() {
    spinning = true;
    const reels = document.querySelectorAll('.reel');
    const spinResults = [];
    const animationPromises = [];
    reels.forEach(reel => {
        const spinPromise = new Promise(resolve => {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            const newPosition = randomIndex * -150; // Cada imagen tiene 150px de alto
            reel.style.transition = 'transform 2s ease-in-out';
            reel.style.transform = `translateY(${newPosition}px)`;
            setTimeout(() => {
                spinResults.push(symbols[randomIndex]);
                resolve();
            }, 2000);
        });
        animationPromises.push(spinPromise);
    });
    await Promise.all(animationPromises);
    spinning = false;
    return spinResults;
}

// Función para calcular las ganancias
function calculateWinnings(spinResult) {
    let winnings = 0;
    const symbolCounts = {};
    spinResult.forEach(symbol => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    });
    for (const symbol in symbolCounts) {
        const count = symbolCounts[symbol];
        if (payouts[symbol] && payouts[symbol][count]) {
            winnings += payouts[symbol][count];
        }
    }
    return winnings;
}

// Función para iniciar el juego al hacer clic en el botón "Spin"
async function play() {
    if (!spinning) {
        const spinResult = await spinReels();
        const winnings = calculateWinnings(spinResult);
        displayResult(spinResult, winnings);
    }
}

// Función para mostrar los resultados en la interfaz de usuario
function displayResult(spinResult, winnings) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `Result: ${spinResult.join(' - ')} <br> Winnings: ${winnings}`;
}

// Evento para iniciar el juego al hacer clic en un botón
document.getElementById('spinButton').addEventListener('click', play);
