const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let car = { x: 180, y: 500, width: 40, height: 60, color: 'red', speed: 0 };
let obstacles = [];
let score = 0;
let combo = 0;
let gameOver = false;
let keys = {};

// Sterowanie
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Proceduralny tor (linie i przeszkody)
function spawnObstacle() {
    let obs = {
        x: Math.floor(Math.random() * 9) * 40,
        y: -50,
        width: 40,
        height: 40,
        color: ['blue','purple','green'][Math.floor(Math.random()*3)]
    };
    obstacles.push(obs);
}

// Rysowanie samochodu i przeszkód
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Tor (linie)
    for(let i=0; i<canvas.height; i+=40) {
        ctx.fillStyle = 'white';
        ctx.fillRect(180, i, 40, 10); // center dashed line
    }

    // Samochód
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);

    // Obstacles
    obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

// Aktualizacja pozycji
function update() {
    if(keys['ArrowLeft'] && car.x > 0) car.x -= 5;
    if(keys['ArrowRight'] && car.x < canvas.width - car.width) car.x += 5;

    obstacles.forEach((obs,index)=>{
        obs.y += 5 + combo*0.5; // combo przyspiesza przeszkody
        if(obs.y > canvas.height){
            obstacles.splice(index,1);
            score += 10;
            combo += 1; // combo rośnie przy udanym mini-przejściu
        }

        // Kolizja
        if(car.x < obs.x + obs.width &&
           car.x + car.width > obs.x &&
           car.y < obs.y + obs.height &&
           car.y + car.height > obs.y){
               gameOver = true;
               alert(`Koniec gry!\nTwój wynik: ${score}\nCombo: ${combo}`);
               window.location.reload();
        }
    });

    document.getElementById('score').textContent = `Punkty: ${score} | Combo: ${combo}`;
}

// Pętla gry
function gameLoop(){
    if(!gameOver){
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Co 1.5s nowe przeszkody
setInterval(spawnObstacle,1500);

gameLoop();
