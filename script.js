// Menu Mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    
    // Animação do burger
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
            // Fechar menu mobile se aberto
            nav.classList.remove('nav-active');
        }
    });
});

// Canvas Animation - Demonstração da Câmara Escura
const canvas = document.getElementById('cameraCanvas');
const ctx = canvas.getContext('2d');

let distance = 250;
let aperture = 5;
let inverted = false;

// Elementos de controle
const distanceSlider = document.getElementById('distance');
const apertureSlider = document.getElementById('aperture');
const distanceValue = document.getElementById('distanceValue');
const apertureValue = document.getElementById('apertureValue');
const toggleBtn = document.getElementById('toggleAnimation');

distanceSlider.addEventListener('input', (e) => {
    distance = parseInt(e.target.value);
    distanceValue.textContent = distance + 'px';
    draw();
});

apertureSlider.addEventListener('input', (e) => {
    aperture = parseInt(e.target.value);
    apertureValue.textContent = aperture + 'px';
    draw();
});

toggleBtn.addEventListener('click', () => {
    inverted = !inverted;
    draw();
});

function draw() {
    // Limpar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const boxHeight = 300;
    const boxTop = 50;
    
    // Desenhar caixa da câmara escura
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - 150, boxTop, 300, boxHeight);
    
    // Desenar orifício
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(centerX, boxTop + boxHeight/2, aperture, 0, Math.PI * 2);
    ctx.fill();
    
    // Posição do objeto (árvore simplificada)
    const objectX = centerX - distance - 100;
    const objectY = boxTop + boxHeight/2;
    const objectHeight = 120;
    
    // Desenar objeto (árvore)
    ctx.fillStyle = inverted ? '#666' : '#2d5a27';
    
    // Tronco
    ctx.fillRect(objectX - 10, objectY, 20, objectHeight/2);
    
    // Copa (triângulo)
    ctx.beginPath();
    ctx.moveTo(objectX - 40, objectY + 20);
    ctx.lineTo(objectX + 40, objectY + 20);
    ctx.lineTo(objectX, objectY - 40);
    ctx.closePath();
    ctx.fill();
    
    // Raios de luz
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;
    
    // Raio superior
    ctx.beginPath();
    ctx.moveTo(objectX, objectY - 40);
    ctx.lineTo(centerX, boxTop + boxHeight/2);
    ctx.lineTo(centerX + (distance * 0.6), inverted ? boxTop + boxHeight - 20 : boxTop + 20);
    ctx.stroke();
    
    // Raio inferior
    ctx.beginPath();
    ctx.moveTo(objectX, objectY + 60);
    ctx.lineTo(centerX, boxTop + boxHeight/2);
    ctx.lineTo(centerX + (distance * 0.6), inverted ? boxTop + 20 : boxTop + boxHeight - 20);
    ctx.stroke();
    
    // Raio do meio
    ctx.beginPath();
    ctx.moveTo(objectX, objectY);
    ctx.lineTo(centerX, boxTop + boxHeight/2);
    ctx.lineTo(centerX + (distance * 0.6), boxTop + boxHeight/2);
    ctx.stroke();
    
    // Desenar imagem projetada (invertida ou não)
    const imageX = centerX + (distance * 0.6) + 50;
    const imageScale = 0.6;
    const projectedHeight = objectHeight * imageScale;
    
    ctx.fillStyle = inverted ? '#8b4513' : '#666';
    ctx.globalAlpha = 0.7;
    
    if (inverted) {
        // Imagem invertida (normal)
        // Tronco invertido
        ctx.fillRect(imageX - 6, boxTop + boxHeight - projectedHeight/2 - 20, 12, projectedHeight/2);
        
        // Copa invertida
        ctx.beginPath();
        ctx.moveTo(imageX - 24, boxTop + boxHeight - projectedHeight + 20);
        ctx.lineTo(imageX + 24, boxTop + boxHeight - projectedHeight + 20);
        ctx.lineTo(imageX, boxTop + boxHeight - 20);
        ctx.closePath();
        ctx.fill();
    } else {
        // Imagem não-invertida (para demonstração)
        ctx.fillRect(imageX - 6, boxTop + 20, 12, projectedHeight/2);
        
        ctx.beginPath();
        ctx.moveTo(imageX - 24, boxTop + projectedHeight - 20);
        ctx.lineTo(imageX + 24, boxTop + projectedHeight - 20);
        ctx.lineTo(imageX, boxTop + 20);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
    
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Objeto', objectX, objectY + 80);
    ctx.fillText('Orifício', centerX, boxTop + boxHeight + 20);
    ctx.fillText('Imagem ' + (inverted ? '(Invertida)' : '(Direta)'), imageX, boxTop + boxHeight + 20);
    
    // Linhas de distância
    ctx.strokeStyle = '#666';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    
    // Linha de distância do objeto
    ctx.beginPath();
    ctx.moveTo(objectX, boxTop + boxHeight + 40);
    ctx.lineTo(centerX, boxTop + boxHeight + 40);
    ctx.stroke();
    
    ctx.fillStyle = '#999';
    ctx.fillText(`d_o = ${distance}px`, (objectX + centerX)/2, boxTop + boxHeight + 55);
    
    ctx.setLineDash([]);
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

// Observar elementos
document.querySelectorAll('.timeline-item, .fade-in, .physics-card').forEach((el) => {
    observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    }
    
    lastScroll = currentScroll;
});

// Animação de números na fórmula
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

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

// Iniciar animação de digitação quando a página carregar
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Fórmula interativa - cálculo em tempo real
const formulaInputs = {
    hi: document.createElement('input'),
    ho: document.createElement('input'),
    di: document.createElement('input'),
    do: document.createElement('input')
};

// Adicionar interatividade extra na seção de física
document.addEventListener('DOMContentLoaded', () => {
    const formulaBox = document.querySelector('.formula-box');
    
    const calcBtn = document.createElement('button');
    calcBtn.textContent = 'Calcular Exemplo';
    calcBtn.className = 'btn-secondary';
    calcBtn.style.marginTop = '1rem';
    calcBtn.style.width = '100%';
    
    calcBtn.addEventListener('click', () => {
        // Exemplo: objeto de 100cm a 200cm de distância, câmara com 50cm de profundidade
        const ho = 100; // cm
        const do_ = 200; // cm
        const di = 50; // cm
        const hi = (ho * di) / do_; // 25cm
        
        alert(`Exemplo de cálculo:\n\nObjeto (h₀): ${ho}cm\nDistância do objeto (d₀): ${do_}cm\nProfundidade da câmara (dᵢ): ${di}cm\n\nImagem projetada (hᵢ): ${hi}cm\n\nFórmula: hᵢ = (h₀ × dᵢ) / d₀\nhᵢ = (${ho} × ${di}) / ${do_} = ${hi}cm`);
    });
    
    formulaBox.appendChild(calcBtn);
});

// Prevenir scroll horizontal
document.body.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });
