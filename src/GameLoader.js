import * as THREE from 'three';
import Wall from './Wall.js';
import Room from './Room.js';
import Painting from './Painting.js';
import DynamicSpotlight from './Spotlight.js';
import AbilityUnlocker from './abilityUnlocker.js';

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

  constructor() {}

  initFloors(floorData, scene) {
    const floors = [];
    floorData.forEach((data) => {
      data.wallType = data.wallType ? data.wallType : 'floor';
      const floor = new Wall(scene, data);
      floors.push(floor);
    });
    return floors;
  }

  initAbilityChecks(scene) {
    const checks = [];
    const doubleJumpUnlocker = new AbilityUnlocker(
      scene,
      4.5,
      2.5,
      -25,
      'doubleJumpUnlocked',
      'Double Jump Unlocked!\nPress space while in\nair to jump again.'
    );
    checks.push(doubleJumpUnlocker);
    const airDashUnlocker = new AbilityUnlocker(
      scene,
      -51,
      13,
      0,
      'airDashUnlocked',
      'Air Dash Unlocked!\nPress left shift in\nair to dash forwards.'
    );
    checks.push(airDashUnlocker);
    return checks;
  }

  initRooms(roomData, scene) {
    const rooms = [];
    roomData.forEach((data) => {
      const room = new Room(scene, data);
      rooms.push(room);
    });
    return rooms;
  }

  initPaintings(paintingData, scene) {
    const paintings = [];
    paintingData.forEach((data) => {
      const painting = new Painting(
        scene,
        data.imagePath,
        data.framePath,
        new THREE.Vector3(data.x, data.y, data.z),
        data.width,
        data.height,
        data.orientation
      );
      paintings.push(painting);
    });
    return paintings;
  }

  initSpotlights(spotlightsData, scene) {
    const spotlights = [];

    spotlightsData.forEach((data) => {
      const {
        x,
        y,
        z,
        color = 0xffffff,
        intensity = 20,
        distance = 8,
        angle = 0.5,
        penumbra = 0.5,
        targetY = 1.6,
        orientation = 'north', // default orientation
      } = data;

      const position = new THREE.Vector3(x, y, z);

      // Calculate target position based on orientation
      let targetOffset = new THREE.Vector3(0, -3 + targetY, 0);
      switch (orientation) {
        case 'north':
          targetOffset.z = 1;
          break;
        case 'south':
          targetOffset.z = -1;
          break;
        case 'east':
          targetOffset.x = -1;
          break;
        case 'west':
          targetOffset.x = 1;
          break;
      }

      const targetPosition = position.clone().add(targetOffset);

      const spotlightProps = {
        color,
        intensity,
        distance,
        angle,
        penumbra,
        position,
        target: targetPosition,
      };

      const dynamicSpotlight = new DynamicSpotlight(
        scene,
        spotlightProps,
        true
      );
      spotlights.push(dynamicSpotlight);
    });

    return spotlights;
  }
}
