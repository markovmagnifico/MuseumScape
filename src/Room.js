import * as THREE from 'three';
import Wall from './Wall';

export default class Room {
  constructor(scene, { x, z, width, depth, height = 5, doors = [] }) {
    this.scene = scene;
    this.center = { x, z };
    this.dimensions = { width, depth };
    this.height = height;
    this.doors = doors;
    this.walls = []; // Track the walls created for the room

    this.createRoom();
  }

  createWall(x, z, width, depth, wallType) {
    const wall = new Wall(this.scene, {
      x,
      y: this.height / 2,
      z,
      width,
      height: this.height,
      depth,
      wallType,
    });
    this.walls.push(wall);
  }

  hasDoorOnWall(wall) {
    return this.doors.find((door) => door.wall === wall);
  }

  createRoom() {
    this.createWalls();
    this.createLights();
  }

  createLights() {
    const pointLight = new THREE.PointLight(
      0xffffff,
      4,
      Math.max(this.dimensins) / 2
    );
    pointLight.position.set(this.center.x, this.height / 2, this.center.z);
    this.scene.add(pointLight);
  }

  createWalls() {
    const halfWidth = this.dimensions.width / 2;
    const halfDepth = this.dimensions.depth / 2;
    const doorWidth = 2;

    ['north', 'south', 'east', 'west'].forEach((wall) => {
      let door = this.hasDoorOnWall(wall);
      if (!door) {
        switch (wall) {
          case 'north':
            this.createWall(
              this.center.x,
              this.center.z + halfDepth,
              this.dimensions.width,
              0.5,
              'wallNS'
            );
            break;
          case 'south':
            this.createWall(
              this.center.x,
              this.center.z - halfDepth,
              this.dimensions.width,
              0.5,
              'wallNS'
            );
            break;
          case 'east':
            this.createWall(
              this.center.x + halfWidth,
              this.center.z,
              0.5,
              this.dimensions.depth,
              'wallEW'
            );
            break;
          case 'west':
            this.createWall(
              this.center.x - halfWidth,
              this.center.z,
              0.5,
              this.dimensions.depth,
              'wallEW'
            );
            break;
        }
      } else {
        let doorStart, doorEnd;
        switch (wall) {
          case 'north':
            doorStart = this.center.x - doorWidth / 2 + door.position;
            doorEnd = this.center.x + doorWidth / 2 + door.position;

            this.createWall(
              this.center.x -
                halfWidth +
                (doorStart - this.center.x + halfWidth) / 2,
              this.center.z + halfDepth,
              doorStart - this.center.x + halfWidth,
              0.5,
              'wallNS'
            );

            this.createWall(
              doorEnd + (this.center.x + halfWidth - doorEnd) / 2,
              this.center.z + halfDepth,
              this.center.x + halfWidth - doorEnd,
              0.5,
              'wallNS'
            );
            break;

          case 'south':
            doorStart = this.center.x - doorWidth / 2 + door.position;
            doorEnd = this.center.x + doorWidth / 2 + door.position;

            this.createWall(
              this.center.x -
                halfWidth +
                (doorStart - this.center.x + halfWidth) / 2,
              this.center.z - halfDepth,
              doorStart - this.center.x + halfWidth,
              0.5,
              'wallNS'
            );

            this.createWall(
              doorEnd + (this.center.x + halfWidth - doorEnd) / 2,
              this.center.z - halfDepth,
              this.center.x + halfWidth - doorEnd,
              0.5,
              'wallNS'
            );
            break;

          case 'east':
            doorStart = this.center.z - doorWidth / 2 + door.position;
            doorEnd = this.center.z + doorWidth / 2 + door.position;

            this.createWall(
              this.center.x + halfWidth,
              this.center.z -
                halfDepth +
                (doorStart - this.center.z + halfDepth) / 2,
              0.5,
              doorStart - this.center.z + halfDepth,
              'wallEW'
            );

            this.createWall(
              this.center.x + halfWidth,
              doorEnd + (this.center.z + halfDepth - doorEnd) / 2,
              0.5,
              this.center.z + halfDepth - doorEnd,
              'wallEW'
            );
            break;

          case 'west':
            doorStart = this.center.z - doorWidth / 2 + door.position;
            doorEnd = this.center.z + doorWidth / 2 + door.position;

            this.createWall(
              this.center.x - halfWidth,
              this.center.z -
                halfDepth +
                (doorStart - this.center.z + halfDepth) / 2,
              0.5,
              doorStart - this.center.z + halfDepth,
              'wallEW'
            );

            this.createWall(
              this.center.x - halfWidth,
              doorEnd + (this.center.z + halfDepth - doorEnd) / 2,
              0.5,
              this.center.z + halfDepth - doorEnd,
              'wallEW'
            );
            break;
        }
      }
    });
  }

  getWalls() {
    return this.walls;
  }
}
