import * as THREE from 'three';
import Wall from './Wall';
import Painting from './Painting';
import DynamicSpotlight from './Spotlight';
import { ambientLight } from './Constants';

export default class Room {
  constructor(
    scene,
    {
      x,
      y = 0,
      z,
      width,
      depth,
      height = 5,
      doors = [],
      paintings = [],
      spotlights = [],
      ceiling = {
        exists: true,
        texturePath: '/assets/images/textures/wall1.jpg',
      },
    }
  ) {
    // General constants
    this.scene = scene;

    // Room constants
    this.center = { x, z };
    this.floorY = y;
    this.dimensions = { width, depth };
    this.height = height;
    this.doors = doors;
    this.wallThickness = 0.5;

    // Arrays for tracking room assets
    this.walls = [];
    this.paintings = [];
    this.spotlights = [];

    // Room creation
    this.createWalls();
    this.createLights();
    if (ceiling.exists) {
      this.createCeiling(ceiling.texturePath);
    }
    this.createPaintings(paintings);
    this.createSpotlights(spotlights);
  }

  createSpotlights(spotlights) {
    spotlights.forEach((spotlightData) => {
      const {
        wall,
        offset = 0,
        color = 0xffffff,
        intensity = 20,
        distance = 8,
        angle = 0.5,
        penumbra = 0.5,
        targetY = 1.6,
        spotlightY = 3.9,
      } = spotlightData;
      let position = {
        x: this.center.x,
        y: this.floorY + spotlightY,
        z: this.center.z,
      };
      let targetPosition = {
        x: this.center.x,
        y: this.floorY + targetY,
        z: this.center.z,
      };

      // Distance light is away from wall
      const wallDist = 3;

      switch (wall) {
        case 'north':
          position.z = this.center.z + this.dimensions.depth / 2 - wallDist;
          position.x += offset;
          targetPosition.z = this.center.z + this.dimensions.depth / 2;
          targetPosition.x += offset;
          break;
        case 'south':
          position.z = this.center.z - this.dimensions.depth / 2 + wallDist;
          position.x += offset;
          targetPosition.z = this.center.z - this.dimensions.depth / 2;
          targetPosition.x += offset;
          break;
        case 'east':
          position.x = this.center.x - this.dimensions.width / 2 + wallDist;
          position.z += offset;
          targetPosition.x = this.center.x - this.dimensions.width / 2;
          targetPosition.z += offset;
          break;
        case 'west':
          position.x = this.center.x + this.dimensions.width / 2 - wallDist;
          position.z += offset;
          targetPosition.x = this.center.x + this.dimensions.width / 2;
          targetPosition.z += offset;
          break;
      }

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
        this.scene,
        spotlightProps,
        true
      );
      this.spotlights.push(dynamicSpotlight);
    });
  }

  createPaintings(paintings) {
    paintings.forEach((paintingData) => {
      const { wall, offset, width, height, yRelative, imagePath, framePath } =
        paintingData;
      let position = {
        x: this.center.x,
        y: this.floorY + yRelative,
        z: this.center.z,
      };
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
      y: this.floorY + this.height / 2,
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
    const y = this.floorY + this.height;

    const ceiling = new Wall(this.scene, {
      x: x,
      y: y,
      z: z,
      width: width + 0.49,
      height: 0.2,
      depth: depth + 0.49,
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
    const pointLight = new THREE.PointLight(0xffffff, ambientLight, 0, 1.5);
    pointLight.position.set(
      this.center.x,
      this.floorY + this.height / 2,
      this.center.z
    );
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
