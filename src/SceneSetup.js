import * as THREE from 'three';

// Set up the scene
const canvas = document.querySelector('#gameCanvas');
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x62a0de);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 5;
camera.position.z = 10;
camera.lookAt(0, 0, 0); // Makes the camera look at the origin
window.camera = camera;

export { scene, renderer, camera };
