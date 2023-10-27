import * as THREE from 'three';
import { scene, renderer, camera } from './SceneSetup.js';
import Player from './Player.js';
import Wall from './Wall.js';
import GameStateManager from './GameStateManager.js';
import { createCompass } from './utils.js';
import { DEBUG, playerStartLoc, ambientLight, BASE_URL } from './Constants.js';
import Sign from './Sign.js';
import SpeechBubble from './SpeechBubble.js';
import texture2D from './texture2D.js';

const canvas = document.querySelector('#gameCanvas');

// Load the gameConfig init state
let gameStateManager;
let player;
let speechBubble;
let gameInitComplete = false;
async function initGame() {
  const response = await fetch(`${BASE_URL}/gameConfig.json`);
  const config = await response.json();

  // Do some setup before the main GameStateManager bc it's in the player's view

  // Instantiate NPC
  const npcPosition = { x: 14, y: 1.1, z: 1.5 };
  const npcSize = { width: 1.3, height: 2.6 };
  const npcTexturePath = `${BASE_URL}/assets/images/other/shopkeep.png`;
  new texture2D(npcPosition, npcSize, npcTexturePath, scene);
  const spotlight = new THREE.SpotLight(0xffffff, 10, 8, 0.7, 0.05, 0.8);
  spotlight.position.set(11.5, 3.5, 5.6);
  spotlight.target.position.set(npcPosition.x, npcPosition.y, npcPosition.z);
  spotlight.castShadow = true;
  const lightHelper = new THREE.SpotLightHelper(spotlight);
  scene.add(spotlight);
  // scene.add(lightHelper);

  // Shop background
  const shopPosition = { x: 12, y: 2, z: 0.5 };
  const shopSize = { width: 12, height: 6 };
  const shopTexturePath = `${BASE_URL}/assets/images/other/wall2.png`;
  new texture2D(shopPosition, shopSize, shopTexturePath, scene);

  // Do most of the initialization handled here
  gameStateManager = new GameStateManager(scene);
  gameStateManager.loadConfig(config);
  player = new Player(playerStartLoc, scene, canvas, camera, gameStateManager);

  // Add some pointlights to the east parkour course
  const pointLight = new THREE.PointLight(0xffffff, ambientLight + 1, 25, 2);
  pointLight.position.set(16, 8, -24);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xffffff, ambientLight + 1, 25, 2);
  pointLight2.position.set(25, 8, -38);
  scene.add(pointLight2);

  // Initialize the speech dialogue option
  const dialoguePos = {
    x: npcPosition.x - 2,
    y: npcPosition.y + 1,
    z: npcPosition.z,
  };
  speechBubble = new SpeechBubble(scene, dialoguePos);
  window.addEventListener('keydown', (event) => {
    speechBubble.handleKeyEvent(event);
  });
}
function initializeSigns() {
  const sign1 = new Sign(
    new THREE.Vector3(-1.1, 0, -11.4),
    new THREE.Vector3(0, Math.PI / 4, 0),
    'Stairs under\nconstruction'
  );
  const sign2 = new Sign(
    new THREE.Vector3(9.7, 0.3, -14.7),
    new THREE.Vector3(0, 2.5, 0),
    'Space\nShift\nSpace',
    60
  );
  const sign3 = new Sign(
    new THREE.Vector3(11, 0.3, -14.2),
    new THREE.Vector3(0, Math.PI, 0),
    "Don't\nOverthink\nIt",
    60
  );
  scene.add(sign1.group);
  scene.add(sign2.group);
  scene.add(sign3.group);
}

async function initializeGame() {
  if ('fonts' in document) {
    await Promise.all([
      document.fonts.load('400 1em Oswald'),
      document.fonts.load('400 1em Quicksand'),
    ]);
    await initGame();
    initializeSigns();
  } else {
    // Fallback for browsers that don't support Font Loading API
    await initGame();
    initializeSigns();
  }
  gameInitComplete = true;
}

initializeGame();

// Debugging stuff
// if (DEBUG) {
//   createCompass(scene, player.position);
// }
// createCompass(scene, player.position);
window.player = player;
window.gameStateManager = gameStateManager;
window.Wall = Wall;

function animate() {
  requestAnimationFrame(animate);
  if (gameInitComplete) {
    player.update();
    gameStateManager.updateLights(player);
    gameStateManager.updateAbilities(player);
    speechBubble.update(player);
  }
  renderer.render(scene, camera);
}
animate();
