import * as THREE from 'three';
import Wall from './Wall.js';
import Room from './Room.js';
import Painting from './Painting.js';
import createSpotlight from './Spotlight.js';

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
    const walls = [];
    roomData.forEach((data) => {
      const room = new Room(scene, data);
      rooms.push(room);
      walls.push(...room.getWalls());
    });
    return walls;
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

  initSpotlights(spotlightData, scene) {
    /*
    {
      "color": "#ffffff",
      "intensity": 25,
      "distance": 8,
      "angle": 0.523599,
      "penumbra": 0.5,
      "decay": 2,
      "position": { "x": -14.54, "y": 4.5, "z": -4 },
      "target": { "x": -17.54, "y": 1.6, "z": -4 }
    }
    */
    const spotlights = [];
    spotlightData.forEach((data) => {
      const spotlightProps = { ...GameLoader.spotlightDefaults, ...data };
      const spotlight = createSpotlight(spotlightProps);
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
