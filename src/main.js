import * as THREE from 'three';
import { scene, renderer, camera } from './SceneSetup.js';
import Player from './Player.js';
import Wall from './Wall.js';
import GameStateManager from './GameStateManager.js';
import { createCompass, createFloatingText } from './utils.js';
import { DEBUG, playerStartLoc, ambientLight } from './Constants.js';

const canvas = document.querySelector('#gameCanvas');

// Load the gameConfig init state
let gameStateManager;
let player;
async function initGame() {
  const response = await fetch('src/gameConfig.json');
  const config = await response.json();

  gameStateManager = new GameStateManager(scene);
  gameStateManager.loadConfig(config);

  player = new Player(playerStartLoc, scene, canvas, camera, gameStateManager);
}
await initGame();

// Add some pointlights to the east parkour course
const pointLight = new THREE.PointLight(0xffffff, ambientLight, 25, 2);
pointLight.position.set(16, 8, -24);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, ambientLight, 25, 2);
pointLight2.position.set(25, 8, -38);
scene.add(pointLight2);

createFloatingText(scene, { x: 10, y: 2, z: 2 }, 'Welcome to\nthe museum');

// Do post-init stuff

if (DEBUG) {
  createCompass(scene, player.position);
}
// createCompass(scene, player.position);
window.player = player;
window.gameStateManager = gameStateManager;
window.Wall = Wall;

function animate() {
  requestAnimationFrame(animate);
  player.update();
  gameStateManager.updateLights(player);
  renderer.render(scene, camera);
}
animate();
