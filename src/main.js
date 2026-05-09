import * as THREE from 'three';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x020617, 8, 30);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 1.5, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x60a5fa, 1.2, 50);
pointLight.position.set(3, 5, 4);
scene.add(pointLight);

const starGeo = new THREE.BufferGeometry();
const starCount = 1000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 40;
  positions[i3 + 1] = (Math.random() - 0.5) * 24;
  positions[i3 + 2] = (Math.random() - 0.5) * 40;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.05, transparent: true, opacity: 0.9 }),
);
scene.add(stars);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.4,
    metalness: 0.15,
    roughness: 0.35,
    wireframe: false,
  }),
);
scene.add(core);

const orbitRing = new THREE.Mesh(
  new THREE.TorusGeometry(2.3, 0.015, 16, 180),
  new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 }),
);
orbitRing.rotation.x = Math.PI / 2.5;
scene.add(orbitRing);

const node = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 18, 18),
  new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0x93c5fd, emissiveIntensity: 0.7 }),
);
scene.add(node);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  core.rotation.y = t * 0.35;
  core.rotation.x = Math.sin(t * 0.3) * 0.2;
  stars.rotation.y = t * 0.03;

  const orbitRadius = 2.3;
  node.position.set(Math.cos(t * 0.9) * orbitRadius, Math.sin(t * 0.55) * 0.5, Math.sin(t * 0.9) * orbitRadius);

  camera.position.x = Math.sin(t * 0.18) * 0.8;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
