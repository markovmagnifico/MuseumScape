import * as THREE from 'three';
import { scene, renderer, camera } from './SceneSetup.js';
import Player from './Player.js';
import Wall from './Wall.js';
import GameStateManager from './GameStateManager.js';
import { createCompass } from './utils.js';
import { DEBUG } from './Constants.js';

const canvas = document.querySelector('#gameCanvas');

const playerStartPosition = { x: -12, y: 0.7, z: -18 };

// Load the gameConfig init state
let gameStateManager;
let player;
async function initGame() {
  const response = await fetch('src/gameConfig.json');
  const config = await response.json();

  gameStateManager = new GameStateManager(scene);
  gameStateManager.loadConfig(config);

  player = new Player(
    playerStartPosition,
    scene,
    canvas,
    camera,
    gameStateManager
  );
}
await initGame();

// Do post-init stuff

if (DEBUG) {
  // createCompass(scene, player.position);
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
