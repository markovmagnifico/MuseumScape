import * as THREE from 'three';
import Wall from './Wall';
import Painting from './Painting';

export default class Room {
  constructor(
    scene,
    {
      x,
      z,
      width,
      depth,
      height = 5,
      doors = [],
      paintings = [],
      ceiling = {
        exists: true,
        texturePath: '/assets/images/textures/wood_light.jpg',
      },
    }
  ) {
    // General constants
    this.scene = scene;

    // Room constants
    this.center = { x, z };
    this.dimensions = { width, depth };
    this.height = height;
    this.doors = doors;
    this.wallThickness = 0.5;

    // Arrays for tracking room assets
    this.walls = [];
    this.paintings = [];

    // Room creation
    this.createWalls();
    this.createLights();
    if (ceiling.exists) {
      this.createCeiling(ceiling.texturePath);
    }
    this.createPaintings(paintings);
  }

  createPaintings(paintings) {
    paintings.forEach((paintingData) => {
      const { wall, offset, width, height, yRelative, imagePath, framePath } =
        paintingData;
      let position = { x: this.center.x, y: yRelative, z: this.center.z };
      let orientation;

      switch (wall) {
        case 'south':
          position.z = this.center.z - this.dimensions.depth / 2;
          position.x += offset;
          orientation = 'north';
          break;
        case 'north':
          position.z = this.center.z + this.dimensions.depth / 2;
          position.x += offset;
          orientation = 'south';
          break;
        case 'west':
          position.x = this.center.x + this.dimensions.width / 2;
          position.z += offset;
          orientation = 'east';
          break;
        case 'east':
          position.x = this.center.x - this.dimensions.width / 2;
          position.z += offset;
          orientation = 'west';
          break;
      }

      // Add padding for the wall and frame thickness
      switch (orientation) {
        case 'north':
          position.z += this.wallThickness / 2 + 0.025;
          break;
        case 'south':
          position.z -= this.wallThickness / 2 + 0.025;
          break;
        case 'west':
          position.x += this.wallThickness / 2 + 0.025;
          break;
        case 'east':
          position.x -= this.wallThickness / 2 + 0.025;
          break;
      }

      const painting = new Painting(
        this.scene,
        imagePath,
        framePath,
        position,
        width,
        height,
        orientation
      );

      this.paintings.push(painting);
    });
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

  createCeiling(texturePath) {
    const { width, depth } = this.dimensions;
    const { x, z } = this.center;
    const y = this.height;

    const ceiling = new Wall(this.scene, {
      x: x,
      y: y,
      z: z,
      width: width + 0.01,
      height: 0.2,
      depth: depth + 0.01,
      texturePath: texturePath,
      wallType: 'floor',
    });

    this.walls.push(ceiling);
  }

  getWalls() {
    return this.walls;
  }

  hasDoorOnWall(wall) {
    return this.doors.find((door) => door.wall === wall);
  }

  createLights() {
    const pointLight = new THREE.PointLight(
      0xffffff,
      26,
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
          case 'south':
            this.createWall(
              this.center.x,
              this.center.z + halfDepth,
              this.dimensions.width,
              this.wallThickness,
              'wallNS'
            );
            break;
          case 'north':
            this.createWall(
              this.center.x,
              this.center.z - halfDepth,
              this.dimensions.width,
              this.wallThickness,
              'wallNS'
            );
            break;
          case 'east':
            this.createWall(
              this.center.x + halfWidth,
              this.center.z,
              this.wallThickness,
              this.dimensions.depth,
              'wallEW'
            );
            break;
          case 'west':
            this.createWall(
              this.center.x - halfWidth,
              this.center.z,
              this.wallThickness,
              this.dimensions.depth,
              'wallEW'
            );
            break;
        }
      } else {
        let doorStart, doorEnd;
        switch (wall) {
          case 'south':
            doorStart = this.center.x - doorWidth / 2 + door.position;
            doorEnd = this.center.x + doorWidth / 2 + door.position;

            this.createWall(
              this.center.x -
                halfWidth +
                (doorStart - this.center.x + halfWidth) / 2,
              this.center.z + halfDepth,
              doorStart - this.center.x + halfWidth,
              this.wallThickness,
              'wallNS'
            );

            this.createWall(
              doorEnd + (this.center.x + halfWidth - doorEnd) / 2,
              this.center.z + halfDepth,
              this.center.x + halfWidth - doorEnd,
              this.wallThickness,
              'wallNS'
            );
            break;

          case 'north':
            doorStart = this.center.x - doorWidth / 2 + door.position;
            doorEnd = this.center.x + doorWidth / 2 + door.position;

            this.createWall(
              this.center.x -
                halfWidth +
                (doorStart - this.center.x + halfWidth) / 2,
              this.center.z - halfDepth,
              doorStart - this.center.x + halfWidth,
              this.wallThickness,
              'wallNS'
            );

            this.createWall(
              doorEnd + (this.center.x + halfWidth - doorEnd) / 2,
              this.center.z - halfDepth,
              this.center.x + halfWidth - doorEnd,
              this.wallThickness,
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
              this.wallThickness,
              doorStart - this.center.z + halfDepth,
              'wallEW'
            );

            this.createWall(
              this.center.x + halfWidth,
              doorEnd + (this.center.z + halfDepth - doorEnd) / 2,
              this.wallThickness,
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
              this.wallThickness,
              doorStart - this.center.z + halfDepth,
              'wallEW'
            );

            this.createWall(
              this.center.x - halfWidth,
              doorEnd + (this.center.z + halfDepth - doorEnd) / 2,
              this.wallThickness,
              this.center.z + halfDepth - doorEnd,
              'wallEW'
            );
            break;
        }
      }
    });
  }
}
