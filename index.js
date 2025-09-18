// ===== Three.js (estrutura 3D) =====
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 0.8, 3.2);

const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
light1.position.set(2, 3, 2);
scene.add(light1);
scene.add(new THREE.AmbientLight(0x88a099, 0.6));

// Torus-knot “estrutura”
const geo = new THREE.TorusKnotGeometry(0.9, 0.22, 180, 24, 2, 3);
const mat = new THREE.MeshStandardMaterial({
  color: 0x49b87a, metalness: 0.35, roughness: 0.25,
  emissive: 0x062b1b, emissiveIntensity: 0.15
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// wireframe sutil
const wire = new THREE.LineSegments(
  new THREE.WireframeGeometry(geo),
  new THREE.LineBasicMaterial({ transparent: true, opacity: 0.15 })
);
mesh.add(wire);

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
  mesh.rotation.y = t * 0.00025;
  mesh.rotation.x = Math.sin(t * 0.00015) * 0.2;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ===== Fade-in do Portfólio =====
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('show'); observer.unobserve(e.target); }
  });
},{ threshold: 0.15 });
document.querySelectorAll('.fade-item').forEach(el=>observer.observe(el));

// ===== Firebase (Comentários) =====
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

// >>>> Suas credenciais (fornecidas por você) <<<<
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

// Submit do formulário
const form = document.getElementById('comment-form');
const nome = document.getElementById('nome');
const texto = document.getElementById('texto');
const statusEl = document.getElementById('form-status');
const list = document.getElementById('comments-list');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Enviando...';
  try{
    await addDoc(collection(db, 'comments'), {
      nome: nome.value.trim(),
      texto: texto.value.trim(),
      createdAt: serverTimestamp()
    });
    nome.value = ''; texto.value = '';
    statusEl.textContent = 'Comentário enviado!';
    setTimeout(()=> statusEl.textContent = '', 1500);
  } catch(err){
    console.error(err);
    statusEl.textContent = 'Falha ao enviar. Tente novamente.';
  }
});

// Stream em tempo real (ordem desc)
const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snap)=>{
  list.innerHTML = '';
  snap.forEach(doc=>{
    const c = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(c.nome || 'Anônimo')}</strong><br>${escapeHtml(c.texto || '')}`;
    list.appendChild(li);
  });
});
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// ===== Mapa (Leaflet, sem chave) =====
// Ajuste as coordenadas para a sede da empresa:
const LAT = -23.454;  // exemplo Guarulhos
const LON = -46.533;

const map = L.map('map', { zoomControl: true }).setView([LAT, LON], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);
L.marker([LAT, LON]).addTo(map).bindPopup('DS Engenharia').openPopup();