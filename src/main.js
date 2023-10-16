import * as THREE from 'three';
import { scene, renderer, camera } from './SceneSetup.js';
import Player from './Player.js';
import GameLoader from './GameLoader.js';
import Wall from './Wall.js';

const canvas = document.querySelector('#gameCanvas');

// Load the gameConfig init state
let gameLoader;
let player;
async function initGame() {
  const response = await fetch('src/gameConfig.json');
  const config = await response.json();

  gameLoader = new GameLoader(scene, true);
  gameLoader.loadConfig(config);

  player = new Player(scene, canvas, camera, gameLoader.stateManager);
  // ... rest of your game setup
}

await initGame();
window.player = player;
window.state = gameLoader.stateManager;
window.Wall = Wall;

const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

// Grid Floor
const size = 50; // Size of the grid
const divisions = 50; // Number of divisions on the grid
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);
// XYZ Axes
const axesHelper = new THREE.AxesHelper(5); // Size of the axes
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  player.update();
  renderer.render(scene, camera);
}
animate();
