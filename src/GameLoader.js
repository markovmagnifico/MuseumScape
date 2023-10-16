import * as THREE from 'three';
import Wall from './Wall.js';

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

  constructor(debug) {
    this.debug = debug !== undefined ? debug : false;
  }

  initWalls(wallData, scene) {
    const walls = [];
    wallData.forEach((data) => {
      const wall = new Wall(scene, data);
      walls.push(wall);
    });
    return walls;
  }

  initSpotlights(spotlightData, scene) {
    const spotlights = [];
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
      scene.add(spotlight);
      scene.add(spotlight.target);
      spotlights.push(spotlight);
      if (this.debug) {
        const lightHelper = new THREE.SpotLightHelper(spotlight);
        scene.add(lightHelper);
      }
    });
    return spotlights;
  }
}
