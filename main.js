import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//
// RENDERER, CAMERA, LIGHTS, RESIZE
//
function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  return renderer;
}

function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1, 6);
  camera.lookAt(0, 0.5, 0);
  return camera;
}

function basicLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 5, 5);
  scene.add(dir);
}

function resize(renderer, camera, container) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

//
// SKILLS 
//
function skillsScene() {
  const container = document.getElementById('skills-canvas');
  const scene = new THREE.Scene();
  const camera = createCamera(container);
  const renderer = createRenderer(container);

  basicLights(scene);

  const cubes = [];

  for (let i = 0; i < 6; i++) {
    const geo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${i * 60}, 60%, 60%)`)
    });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(
      Math.cos(i) * 1.5,
      Math.sin(i) * 0.5,
      Math.sin(i) * 1.5
    );
    scene.add(cube);
    cubes.push(cube);
  }

  function animate() {
    requestAnimationFrame(animate);
    cubes.forEach((c, i) => {
      c.rotation.x += 0.01;
      c.rotation.y += 0.015;
      c.position.y = Math.sin(Date.now() * 0.002 + i) * 0.3;
    });
    renderer.render(scene, camera);
  }

  animate();
  window.addEventListener('resize', () => resize(renderer, camera, container));
}

//
// PHONE – telefon placeholder
//
function phoneScene() {
  const container = document.getElementById('phone-canvas');
  const scene = new THREE.Scene();
  const camera = createCamera(container);
  const renderer = createRenderer(container);

  basicLights(scene);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.8, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 2.4),
    new THREE.MeshStandardMaterial({ color: 0x44aa88 })
  );
  screen.position.z = 0.11;

  scene.add(body);
  scene.add(screen);

  function animate() {
    requestAnimationFrame(animate);
    body.rotation.y += 0.004;
    screen.rotation.y += 0.004;
    renderer.render(scene, camera);
  }

  animate();
  window.addEventListener('resize', () => resize(renderer, camera, container));
}

//
// THESIS
//
function animalScene() {
  const container = document.getElementById('animal-canvas');
  const scene = new THREE.Scene();
  const camera = createCamera(container);
  const renderer = createRenderer(container);

  basicLights(scene);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  base.position.y = -1.1;
  scene.add(base);

  let animal;
  const loader = new GLTFLoader();
  loader.load(
    'smoothmeerkat.glb',
    (gltf) => {
      animal = gltf.scene;

      const box = new THREE.Box3().setFromObject(animal);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      animal.scale.setScalar(2.5 / maxDim);

      const center = new THREE.Vector3();
      box.getCenter(center);
      animal.position.sub(center);

      animal.position.y += -0.9 + maxDim / 2;

      scene.add(animal);
    },
    undefined,
    (err) => console.error('GLB load error:', err)
  );

  function animate() {
    requestAnimationFrame(animate);
    if (animal) {
      animal.rotation.y += 0.005;
      animal.position.y = -0.9 + Math.sin(Date.now() * 0.002) * 0.1;
    }
    renderer.render(scene, camera);
  }

  animate();
  window.addEventListener('resize', () => resize(renderer, camera, container));
}

// INIT
skillsScene();
phoneScene();
animalScene();
