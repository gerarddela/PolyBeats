const canvas = document.getElementById('polyrhythmCanvas');
const ctx = canvas.getContext('2d');
const toggleButton = document.getElementById('toggleButton');
const selectors = document.querySelectorAll('.polygonSelector');
const controlButtons = document.querySelectorAll('.polygon-control span');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPolygonsOnce();
});

const tempoSlider = document.getElementById('tempoSlider');
const tempoValue = document.getElementById('tempoValue');

let BPM = 120;
let startTime;
let isAnimating = false;
let animationFrame;
let polygons = [];

class Polygon {
    constructor(sides, radius, color) {
        this.sides = sides;
        this.radius = radius;
        this.color = color;
        this.vertices = this.calculateVertices();
        this.lastVertex = -1;
    }

    calculateVertices() {
        const vertices = [];
        if (this.sides === 0) return vertices;

        if (this.sides === 1) {
            vertices.push({ x: canvas.width / 2, y: canvas.height / 2 });
        } else if (this.sides === 2) {
            vertices.push({ x: canvas.width / 2, y: canvas.height / 2 - this.radius });
            vertices.push({ x: canvas.width / 2, y: canvas.height / 2 + this.radius });
        } else {
            for (let i = 0; i < this.sides; i++) {
                const theta = (i * 2 * Math.PI) / this.sides - Math.PI / 2;
                const x = canvas.width / 2 + this.radius * Math.cos(theta);
                const y = canvas.height / 2 + this.radius * Math.sin(theta);
                vertices.push({ x, y });
            }
        }
        return vertices;
    }

    drawPolygon() {
        if (this.sides === 0) return;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        if (this.sides === 1) {
            ctx.arc(this.vertices[0].x, this.vertices[0].y, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.sides === 2) {
            ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
            ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
        } else {
            for (let i = 0; i < this.sides; i++) {
                const { x, y } = this.vertices[i];
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
        ctx.stroke();
    }

    drawBallAtStart() {
        if (this.sides === 0) return;
        const startVertex = this.vertices[0];
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(startVertex.x, startVertex.y, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    updateBall() {
        if (!isAnimating || this.sides === 0) return;
    
        let elapsed = (performance.now() - startTime) / 1000;
        let cycleTime = 60 / BPM;
        let cycleProgress = (elapsed % cycleTime) / cycleTime;
    
        if (this.sides === 1) {
            let beatTime = Math.floor(elapsed / cycleTime);
            if (beatTime !== this.lastVertex) {
                this.lastVertex = beatTime;
                playSound(this.sides);
                this.flashTime = performance.now();
            }
    
            let flashDuration = 100;
            let timeSinceFlash = performance.now() - this.flashTime;
            let ballSize = (timeSinceFlash < flashDuration) ? 12 : 8;
    
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, ballSize, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
    
        let segmentProgress = (cycleProgress * this.sides) % 1;
        let currentVertex = Math.floor(cycleProgress * this.sides);
        let nextVertex = (currentVertex + 1) % this.sides;
    
        const current = this.vertices[currentVertex];
        const next = this.vertices[nextVertex];
    
        const x = current.x + (next.x - current.x) * segmentProgress;
        const y = current.y + (next.y - current.y) * segmentProgress;

        if (currentVertex !== this.lastVertex) {
            this.lastVertex = currentVertex;
            playSound(this.sides);
            this.flashTime = performance.now();
        }

        let flashDuration = 100; 
        let timeSinceFlash = performance.now() - this.flashTime;
        let ballSize = (timeSinceFlash < flashDuration) ? 12 : 8;
    
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, ballSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.drawPolygon();
        this.updateBall();
    }
}

function updateTempo() {
    BPM = parseInt(tempoSlider.value);
    tempoValue.textContent = `${BPM} BPM`;
    console.log(`Tempo actualizado: ${BPM} BPM`);
}

function setupSelectors() {
    selectors.forEach((select, index) => {
        select.innerHTML = '';

        for (let i = 0; i <= 32; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }

        select.value = [3, 4, 5, 6, 7][index];

        select.addEventListener("change", () => {
            updatePolygons();
        });
    });
}

function updatePolygons() {
    polygons = [];

    selectors.forEach((select, index) => {
        let sides = parseInt(select.value);
        let colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF00FF'];

        controlButtons[index].textContent = sides;

        if (sides > 0) {
            polygons.push(new Polygon(sides, 100 + index * 50, colors[index]));
        }
    });

    drawPolygonsOnce();
}

function drawPolygonsOnce() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygons.forEach(polygon => {
        polygon.drawPolygon();
    });
}

function animate() {
    if (!isAnimating || polygons.length === 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygons.forEach(polygon => polygon.update());
    animationFrame = requestAnimationFrame(animate);
}

function toggleAnimation() {
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationFrame);
        toggleButton.classList.remove("active");
        drawPolygonsOnce();
        toggleButton.textContent = "Iniciar";
    } else {
        isAnimating = true;
        startTime = performance.now();
        animate();
        toggleButton.classList.add("active");
        toggleButton.textContent = "Pausar";
    }
}

document.querySelectorAll('.polygon-control').forEach(control => {
    const selector = control.querySelector('.polygonSelector');

    control.addEventListener('click', (event) => {
        event.stopPropagation();

        document.querySelectorAll('.polygonSelector').forEach(sel => {
            if (sel !== selector) sel.style.display = 'none';
        });

        selector.style.display = (selector.style.display === 'block') ? 'none' : 'block';
    });

    selector.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    selector.addEventListener('change', () => {
        selector.style.display = 'none';
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.polygonSelector').forEach(selector => {
        selector.style.display = 'none';
    });
});

toggleButton.addEventListener("click", toggleAnimation);

setupSelectors();
updatePolygons();
tempoSlider.addEventListener("input", updateTempo);
updateTempo();
drawPolygonsOnce();
console.log("PolyBeats ha sido inicializado correctamente.");