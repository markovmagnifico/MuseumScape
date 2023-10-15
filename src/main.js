import * as THREE from 'three';
import { scene, renderer, camera } from './SceneSetup.js';
import Player from './Player.js';

const canvas = document.querySelector('#gameCanvas');

// Grid Floor
const size = 50; // Size of the grid
const divisions = 50; // Number of divisions on the grid
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const player = new Player(scene, canvas, camera);

// XYZ Axes
const axesHelper = new THREE.AxesHelper(5); // Size of the axes
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  player.update();
  renderer.render(scene, camera);
}
animate();
