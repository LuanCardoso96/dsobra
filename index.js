// ===== Three.js: PAREDE SENDO CONSTRUÍDA (MELHORADA) =====
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0.8, 0.8, 3.2);

const envLight = new THREE.AmbientLight(0x98a7a1, 0.75);
scene.add(envLight);
const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
keyLight.position.set(2.5, 3.5, 2.2);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
scene.add(keyLight);

// "chão" estilo canteiro
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 4),
  new THREE.MeshStandardMaterial({ color: 0x0d1713, metalness: 0.1, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

// parametros da parede
const BRICK_W = 0.30;
const BRICK_H = 0.12;
const BRICK_D = 0.14;
const COLS = 16;       // quantos tijolos por linha
const ROWS = 8;        // quantas fiadas
const GAP  = 0.012;    // "argamassa"
const OFFSET_ROW = BRICK_W * 0.5; // amarração (meio tijolo)

const bricks = [];
const brickGeo = new THREE.BoxGeometry(BRICK_W, BRICK_H, BRICK_D);
const brickMat = new THREE.MeshStandardMaterial({
  color: 0x3a8f53, metalness: 0.15, roughness: 0.4, 
  emissive: 0x0a2d1a, emissiveIntensity: 0.08
});

// constrói a grade de tijolos invisíveis (escala 0) e vamos "erguendo"
function createWall() {
  // largura total para centralizar
  const rowWidth = COLS * (BRICK_W + GAP) - GAP;
  const startX = -rowWidth / 2;

  for (let r = 0; r < ROWS; r++) {
    const isOffset = r % 2 === 1;
    for (let c = 0; c < COLS; c++) {
      // desloca meia peça em linhas alternadas
      const x = startX + c * (BRICK_W + GAP) + (isOffset ? OFFSET_ROW : 0);
      const y = r * (BRICK_H + GAP);

      const m = new THREE.Mesh(brickGeo, brickMat);
      m.position.set(x, y, 0);
      m.scale.set(0.001, 0.001, 0.001); // nasce "do nada"
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
      bricks.push(m);
    }
  }
}
createWall();

// timeline de construção: 1 tijolo a cada X ms
let buildIndex = 0;
const BUILD_EVERY_MS = 70;  // mais rápido para melhor visualização
let lastBuild = 0;

// Reiniciar construção quando a página carrega
function resetConstruction() {
  buildIndex = 0;
  lastBuild = 0;
  // Resetar todos os tijolos para invisíveis
  bricks.forEach(brick => {
    brick.scale.set(0.001, 0.001, 0.001);
    brick.userData.birth = null;
  });
}

// Reiniciar a cada 15 segundos para mostrar a animação continuamente
setInterval(resetConstruction, 15000);

// resize
function onResize(){
  const w = canvas.clientWidth || canvas.parentElement.clientWidth;
  const h = canvas.clientHeight || canvas.parentElement.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);
onResize();

function animate(t){
  // animação de "chefe de obra olhando": leve orbit
  camera.position.x = Math.sin(t*0.00022) * 1.1 + 0.3;
  camera.lookAt(0, ROWS*BRICK_H*0.45, 0);

  // construir tijolo por tijolo
  if (t - lastBuild > BUILD_EVERY_MS && buildIndex < bricks.length){
    const b = bricks[buildIndex++];
    b.userData.birth = t;
    lastBuild = t;
  }

  // tijolos recém-criados expandem com ease-out
  for (const b of bricks){
    if (b.userData.birth){
      const k = Math.min(1, (t - b.userData.birth) / 300); // 300ms de "surto"
      const ease = 1 - Math.pow(1 - k, 3);
      const s = THREE.MathUtils.lerp(0.001, 1, ease);
      b.scale.set(s, s, s);
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ===== Fade-in Portfólio =====
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('show'); observer.unobserve(e.target); }
  });
},{ threshold: 0.15 });
document.querySelectorAll('.fade-item').forEach(el=>observer.observe(el));

// ===== Firebase (Contato) =====
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAbPd9nBarQ0zvFz5OikteT6oeUrDpHQMw",
  authDomain: "ds-engenharia-84e9b.firebaseapp.com",
  projectId: "ds-engenharia-84e9b",
  storageBucket: "ds-engenharia-84e9b.appspot.com",
  messagingSenderId: "706301154499",
  appId: "1:706301154499:web:ac2d1b6e611b649fe77e76"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const form = document.getElementById('contact-form');
const nome = document.getElementById('nome');
const telefone = document.getElementById('telefone');
const email = document.getElementById('email');
const mensagem = document.getElementById('mensagem');
const statusEl = document.getElementById('form-status');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Enviando mensagem...';
  
  try{
    await addDoc(collection(db, 'Site-mensagems'), {
      nome: nome.value.trim(),
      telefone: telefone.value.trim(),
      email: email.value.trim(),
      mensagem: mensagem.value.trim(),
      createdAt: serverTimestamp(),
      projeto: 'DS Engenharia'
    });
    
    // Limpar formulário
    nome.value = '';
    telefone.value = '';
    email.value = '';
    mensagem.value = '';
    
    statusEl.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
    statusEl.style.color = '#3a8f53';
    
    setTimeout(()=> {
      statusEl.textContent = '';
      statusEl.style.color = '';
    }, 3000);
    
  }catch(err){
    console.error('Erro ao enviar mensagem:', err);
    statusEl.textContent = 'Erro ao enviar mensagem. Tente novamente ou entre em contato pelo telefone.';
    statusEl.style.color = '#e53e3e';
    
    setTimeout(()=> {
      statusEl.textContent = '';
      statusEl.style.color = '';
    }, 3000);
  }
});

// ===== Mapa (Leaflet) =====
const LAT = -23.454;  // ajuste
const LON = -46.533;
const map = L.map('map', { zoomControl: true }).setView([LAT, LON], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
L.marker([LAT, LON]).addTo(map).bindPopup('DS Engenharia').openPopup();

// ===== Lightbox para Portfólio =====
function openLightbox(imgSrc, title, description) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  
  lightboxImg.src = imgSrc;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightboxDescription.textContent = description;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Adicionar event listeners para os cards do portfólio
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const img = card.querySelector('img');
      const title = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      
      openLightbox(img.src, title, description);
    });
  });
  
  // Event listener para o botão de fechar
  const closeBtn = document.getElementById('lightbox-close-btn');
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });
  
  // Fechar lightbox ao clicar fora da imagem
  const lightbox = document.getElementById('lightbox');
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Fechar lightbox com tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ===== Navegação do Portfólio =====
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');
  const portfolioSections = document.querySelectorAll('.portfolio-section');

  portfolioTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remover classe active de todas as abas
      portfolioTabs.forEach(t => t.classList.remove('active'));
      // Adicionar classe active na aba clicada
      this.classList.add('active');
      
      // Esconder todas as seções
      portfolioSections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Mostrar a seção correspondente
      const targetSection = document.getElementById(targetTab);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // Reativar fade-in para os novos cards
        const newCards = targetSection.querySelectorAll('.fade-item');
        newCards.forEach(card => {
          card.classList.remove('show');
          observer.observe(card);
        });
      }
    });
  });

  // ===== Menu Mobile =====
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.querySelector('.nav');
  
  // Função para fechar o menu mobile
  function closeMobileMenu() {
    nav.classList.remove('mobile-open');
  }
  
  // Função para abrir o menu mobile
  function openMobileMenu() {
    nav.classList.add('mobile-open');
  }
  
  mobileMenuBtn?.addEventListener('click', function() {
    if (nav.classList.contains('mobile-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  
  // Fechar menu mobile ao clicar nos links de navegação
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Verificar se é um link âncora (começa com #)
      if (this.getAttribute('href').startsWith('#')) {
        // Fechar menu mobile após iniciar o scroll
        setTimeout(() => {
          closeMobileMenu();
        }, 100);
      }
    });
  });
  
  // Fechar menu mobile ao clicar fora dele
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Removido código problemático que fechava menu imediatamente

  // ===== Navegação por Âncora Global =====
  // Handler para todos os links de âncora (desktop e mobile)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') !== '#') {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        // Scroll suave com offset
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });

  // ===== Botão Ver Tudo - Elétrica =====
  const verTudoBtnEletrica = document.getElementById('ver-tudo-eletrica');
  const fotosExtrasEletrica = document.querySelectorAll('.eletrica-extra');
  let todasVisiveisEletrica = false;

  verTudoBtnEletrica?.addEventListener('click', function() {
    if (!todasVisiveisEletrica) {
      // Mostrar todas as fotos
      fotosExtrasEletrica.forEach((foto, index) => {
        setTimeout(() => {
          foto.style.display = 'block';
          foto.classList.add('show');
        }, index * 100); // Delay escalonado para efeito cascata
      });
      
      // Atualizar botão
      this.querySelector('.btn-text').textContent = 'Ver Menos';
      this.querySelector('.btn-count').textContent = '-16 projetos';
      this.querySelector('i').className = 'fa-solid fa-eye-slash';
      todasVisiveisEletrica = true;
      
    } else {
      // Esconder fotos extras
      fotosExtrasEletrica.forEach((foto, index) => {
        setTimeout(() => {
          foto.classList.remove('show');
          setTimeout(() => {
            foto.style.display = 'none';
          }, 300); // Aguarda animação terminar
        }, index * 50);
      });
      
      // Atualizar botão
      this.querySelector('.btn-text').textContent = 'Ver Todos os Projetos';
      this.querySelector('.btn-count').textContent = '+16 projetos';
      this.querySelector('i').className = 'fa-solid fa-eye';
      todasVisiveisEletrica = false;
    }
  });

  // ===== Botão Ver Tudo - Alvenaria =====
  const verTudoBtnAlvenaria = document.getElementById('ver-tudo-alvenaria');
  const fotosExtrasAlvenaria = document.querySelectorAll('.alvenaria-extra');
  let todasVisiveisAlvenaria = false;

  verTudoBtnAlvenaria?.addEventListener('click', function() {
    if (!todasVisiveisAlvenaria) {
      // Mostrar todas as fotos
      fotosExtrasAlvenaria.forEach((foto, index) => {
        setTimeout(() => {
          foto.style.display = 'block';
          foto.classList.add('show');
        }, index * 100); // Delay escalonado para efeito cascata
      });
      
      // Atualizar botão
      this.querySelector('.btn-text').textContent = 'Ver Menos';
      this.querySelector('.btn-count').textContent = '-3 projetos';
      this.querySelector('i').className = 'fa-solid fa-eye-slash';
      todasVisiveisAlvenaria = true;
      
    } else {
      // Esconder fotos extras
      fotosExtrasAlvenaria.forEach((foto, index) => {
        setTimeout(() => {
          foto.classList.remove('show');
          setTimeout(() => {
            foto.style.display = 'none';
          }, 300); // Aguarda animação terminar
        }, index * 50);
      });
      
      // Atualizar botão
      this.querySelector('.btn-text').textContent = 'Ver Todos os Projetos';
      this.querySelector('.btn-count').textContent = '+3 projetos';
      this.querySelector('i').className = 'fa-solid fa-eye';
      todasVisiveisAlvenaria = false;
    }
  });
});

// Scroll Arrows - Setas de navegação
document.addEventListener('DOMContentLoaded', function() {
  const scrollArrows = document.getElementById('scroll-arrows');
  const scrollUp = document.getElementById('scroll-up');
  const scrollDown = document.getElementById('scroll-down');
  
  // Função para mostrar/ocultar setas baseado na posição do scroll
  function toggleScrollArrows() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Mostrar setas apenas se houver scroll suficiente
    if (documentHeight > windowHeight + 100) {
      scrollArrows.classList.add('visible');
      
      // Ocultar seta para cima no topo
      if (scrollTop < 100) {
        scrollUp.style.opacity = '0.5';
        scrollUp.style.pointerEvents = 'none';
      } else {
        scrollUp.style.opacity = '1';
        scrollUp.style.pointerEvents = 'auto';
      }
      
      // Ocultar seta para baixo no final
      if (scrollTop + windowHeight >= documentHeight - 100) {
        scrollDown.style.opacity = '0.5';
        scrollDown.style.pointerEvents = 'none';
      } else {
        scrollDown.style.opacity = '1';
        scrollDown.style.pointerEvents = 'auto';
      }
    } else {
      scrollArrows.classList.remove('visible');
    }
  }
  
  // Função de scroll suave
  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();
    
    function animation(currentTime) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (easeInOutCubic)
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startY + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
  
  // Event listeners
  scrollUp.addEventListener('click', function() {
    smoothScrollTo(0);
  });
  
  scrollDown.addEventListener('click', function() {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    smoothScrollTo(documentHeight - windowHeight);
  });
  
  // Mostrar/ocultar setas baseado no scroll
  window.addEventListener('scroll', toggleScrollArrows);
  window.addEventListener('resize', toggleScrollArrows);
  
  // Verificar estado inicial
  toggleScrollArrows();
});

// Modal de Expansão de Imagem do Portfólio
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('portfolioModal');
  const modalImg = document.getElementById('portfolioModalImg');
  const modalClose = document.getElementById('portfolioModalClose');
  const modalBackdrop = modal.querySelector('.portfolio-modal-backdrop');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  // Abrir modal ao clicar em uma imagem do portfólio
  portfolioCards.forEach(card => {
    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('click', function() {
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll da página
      });
    }
  });

  // Fechar modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll da página
  }

  // Event listeners para fechar modal
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Fechar com tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});