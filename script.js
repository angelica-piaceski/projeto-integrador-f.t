// Menu Mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            nav.classList.remove('nav-active');
        }
    });
});

// Canvas Animation - Simulação Melhorada da Câmara Escura
const canvas = document.getElementById('cameraCanvas');
const ctx = canvas.getContext('2d');

let objectDistance = 250;
let apertureSize = 6;
let objectHeight = 100;
let showRays = true;

// Elementos de controle
const distanceSlider = document.getElementById('distance');
const apertureSlider = document.getElementById('aperture');
const objectSizeSlider = document.getElementById('objectSize');
const distanceValue = document.getElementById('distanceValue');
const apertureValue = document.getElementById('apertureValue');
const objectSizeValue = document.getElementById('objectSizeValue');
const toggleRaysBtn = document.getElementById('toggleRays');

distanceSlider.addEventListener('input', (e) => {
    objectDistance = parseInt(e.target.value);
    distanceValue.textContent = objectDistance + 'px';
    draw();
});

apertureSlider.addEventListener('input', (e) => {
    apertureSize = parseInt(e.target.value);
    apertureValue.textContent = apertureSize + 'px';
    draw();
});

objectSizeSlider.addEventListener('input', (e) => {
    objectHeight = parseInt(e.target.value);
    objectSizeValue.textContent = objectHeight + 'px';
    draw();
});

toggleRaysBtn.addEventListener('click', () => {
    showRays = !showRays;
    draw();
});

function draw() {
    // Limpar canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dimensões da câmara
    const chamberWidth = 200;
    const chamberHeight = 300;
    const chamberX = 400;
    const chamberY = 100;
    
    // Posição do orifício
    const holeX = chamberX;
    const holeY = chamberY + chamberHeight / 2;
    
    // Posição do objeto
    const objectX = holeX - objectDistance;
    const objectY = holeY;
    
    // Desenhar a câmara escura
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.fillRect(chamberX, chamberY, chamberWidth, chamberHeight);
    ctx.strokeRect(chamberX, chamberY, chamberWidth, chamberHeight);
    
    // Desenhar parede interna (onde a imagem é projetada)
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(chamberX + chamberWidth - 10, chamberY + 10, 10, chamberHeight - 20);
    
    // Desenhar orifício
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(holeX, holeY, apertureSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Calcular tamanho da imagem projetada
    const chamberDepth = chamberWidth - 10; // profundidade útil
    const imageHeight = (objectHeight * chamberDepth) / objectDistance;
    const imageTop = holeY - imageHeight / 2;
    const imageBottom = holeY + imageHeight / 2;
    
    // Desenhar raios de luz
    if (showRays) {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Raio do topo do objeto para base da imagem
        ctx.beginPath();
        ctx.moveTo(objectX, objectY - objectHeight / 2);
        ctx.lineTo(holeX, holeY);
        ctx.lineTo(chamberX + chamberWidth - 10, holeY + imageHeight / 2);
        ctx.stroke();
        
        // Raio da base do objeto para topo da imagem
        ctx.beginPath();
        ctx.moveTo(objectX, objectY + objectHeight / 2);
        ctx.lineTo(holeX, holeY);
        ctx.lineTo(chamberX + chamberWidth - 10, holeY - imageHeight / 2);
        ctx.stroke();
        
        // Raio do centro
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(holeX, holeY);
        ctx.lineTo(chamberX + chamberWidth - 10, holeY);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    // Desenhar objeto (árvore estilizada)
    drawTree(objectX, objectY, objectHeight, false);
    
    // Desenhar imagem projetada (invertida)
    drawTree(chamberX + chamberWidth - 15, holeY, imageHeight, true);
    
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    
    ctx.fillText('Objeto', objectX, objectY + objectHeight / 2 + 25);
    ctx.fillText('Orifício', holeX, chamberY + chamberHeight + 25);
    ctx.fillText('Imagem', chamberX + chamberWidth - 15, holeY + imageHeight / 2 + 25);
    ctx.fillText('(Invertida)', chamberX + chamberWidth - 15, holeY + imageHeight / 2 + 45);
    
    // Linhas de distância
    ctx.strokeStyle = '#666';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    
    // Distância do objeto ao orifício
    ctx.beginPath();
    ctx.moveTo(objectX, chamberY + chamberHeight + 60);
    ctx.lineTo(holeX, chamberY + chamberHeight + 60);
    ctx.stroke();
    
    ctx.fillStyle = '#999';
    ctx.fillText(`d₀ = ${objectDistance}px`, (objectX + holeX) / 2, chamberY + chamberHeight + 80);
    
    // Profundidade da câmara
    ctx.beginPath();
    ctx.moveTo(holeX, chamberY + chamberHeight + 100);
    ctx.lineTo(chamberX + chamberWidth, chamberY + chamberHeight + 100);
    ctx.stroke();
    
    ctx.fillText(`dᵢ = ${chamberDepth}px`, (holeX + chamberX + chamberWidth) / 2, chamberY + chamberHeight + 120);
    
    ctx.setLineDash([]);
    
    // Informações da fórmula
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 16px Roboto';
    ctx.textAlign = 'left';
    ctx.fillText(`h₀ = ${objectHeight}px`, 20, 30);
    ctx.fillText(`hᵢ = ${imageHeight.toFixed(1)}px`, 20, 55);
    ctx.fillText(`d₀ = ${objectDistance}px`, 20, 80);
    ctx.fillText(`dᵢ = ${chamberDepth}px`, 20, 105);
}

function drawTree(x, y, height, inverted) {
    const scale = height / 100;
    const trunkWidth = 15 * scale;
    const trunkHeight = height * 0.4;
    const crownRadius = height * 0.4;
    
    ctx.save();
    ctx.translate(x, y);
    
    if (inverted) {
        ctx.scale(1, -1);
    }
    
    // Tronco
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(-trunkWidth / 2, 0, trunkWidth, trunkHeight);
    
    // Copa (círculo)
    ctx.fillStyle = '#2d5a27';
    ctx.beginPath();
    ctx.arc(0, trunkHeight + crownRadius * 0.6, crownRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Detalhes da copa
    ctx.fillStyle = '#3d7a37';
    ctx.beginPath();
    ctx.arc(-crownRadius * 0.3, trunkHeight + crownRadius * 0.4, crownRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(crownRadius * 0.3, trunkHeight + crownRadius * 0.8, crownRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Inicializar canvas
draw();

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item, .fade-in, .physics-card').forEach((el) => {
    observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    }
});

// Efeito de digitação no hero
const heroText = document.querySelector('.hero-content p');
const originalText = heroText.textContent;
heroText.textContent = '';

let charIndex = 0;
function typeWriter() {
    if (charIndex < originalText.length) {
        heroText.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    }
}

window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Botão de calcular exemplo
document.getElementById('calcExample').addEventListener('click', () => {
    const ho = 100;
    const do_ = 200;
    const di = 50;
    const hi = (ho * di) / do_;
    
    alert(`Exemplo de cálculo:\n\nObjeto (h₀): ${ho}cm\nDistância do objeto (d₀): ${do_}cm\nProfundidade da câmara (dᵢ): ${di}cm\n\nImagem projetada (hᵢ): ${hi}cm\n\nFórmula: hᵢ = (h₀ × dᵢ) / d₀\nhᵢ = (${ho} × ${di}) / ${do_} = ${hi}cm`);
});
