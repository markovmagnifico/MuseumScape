import * as THREE from 'three';
import Wall from './Wall.js';
import Room from './Room.js';
import Painting from './Painting.js';

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
      data.wallType = 'floor';
      const floor = new Wall(scene, data);
      floors.push(floor);
    });
    return floors;
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
        new THREE.Vector3(data.position.x, data.position.y, data.position.z),
        data.width,
        data.height,
        data.orientation,
        data.showSpotlight,
        data.spotlightProps
      );
      paintings.push(painting);
    });
    return paintings;
  }
}
