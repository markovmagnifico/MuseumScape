import * as THREE from 'three';
import Wall from './Wall.js';
import GameStateManager from './GameStateManager.js';

export default class GameLoader {
  static spotlightDefaults = {
    color: 0xffffff,
    intensity: 1,
    distance: 20,
    angle: Math.PI / 3,
    penumbra: 0.1,
    decay: 1,
    position: { x: 0, y: 5, z: 0 },
    target: { x: 0, y: 0, z: 0 },
  };

  constructor(scene, debug) {
    this.scene = scene;
    this.debug = debug !== undefined ? debug : false;
    this.stateManager = new GameStateManager();
  }

  loadConfig(config) {
    this.initWalls(config.walls);
    this.initSpotlights(config.spotlights);
  }

  initWalls(wallData) {
    wallData.forEach((wall) => {
      const newWall = new Wall(this.scene, wall);
      this.stateManager.addEntity(newWall);
    });
  }

  initSpotlights(spotlightData) {
    spotlightData.forEach((data) => {
      const spotlightProps = { ...GameLoader.spotlightDefaults, ...data };
      const spotlight = new THREE.SpotLight(
        spotlightProps.color,
        spotlightProps.intensity,
        spotlightProps.distance,
        spotlightProps.angle,
        spotlightProps.penumbra,
        spotlightProps.decay
      );
      spotlight.position.set(
        spotlightProps.position.x,
        spotlightProps.position.y,
        spotlightProps.position.z
      );
      spotlight.target.position.set(
        spotlightProps.target.x,
        spotlightProps.target.y,
        spotlightProps.target.z
      );
      spotlight.castShadow = true;
      this.scene.add(spotlight);
      this.scene.add(spotlight.target);
      if (this.debug) {
        const lightHelper = new THREE.SpotLightHelper(spotlight);
        this.scene.add(lightHelper);
      }
    });
  }
}
