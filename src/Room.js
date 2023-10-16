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

  createWall(x, z, width, depth) {
    const wall = new Wall(this.scene, {
      x,
      y: this.height / 2,
      z,
      width,
      height: this.height,
      depth,
    });
    console.log('C wall for room');
    this.walls.push(wall);
  }

  hasDoorOnWall(wall) {
    return this.doors.find((door) => door.wall === wall);
  }

  createRoom() {
    const halfWidth = this.dimensions.width / 2;
    const halfDepth = this.dimensions.depth / 2;
    const doorWidth = 2;

    ['north', 'south', 'east', 'west'].forEach((wall) => {
      let door = this.hasDoorOnWall(wall);
      if (!door) {
        console.log('Creating non-door walls');
        switch (wall) {
          case 'north':
            this.createWall(
              this.center.x,
              this.center.z + halfDepth,
              this.dimensions.width,
              0.5
            );
            break;
          case 'south':
            this.createWall(
              this.center.x,
              this.center.z - halfDepth,
              this.dimensions.width,
              0.5
            );
            break;
          case 'east':
            this.createWall(
              this.center.x + halfWidth,
              this.center.z,
              0.5,
              this.dimensions.depth
            );
            break;
          case 'west':
            this.createWall(
              this.center.x - halfWidth,
              this.center.z,
              0.5,
              this.dimensions.depth
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
              0.5
            );

            this.createWall(
              doorEnd + (this.center.x + halfWidth - doorEnd) / 2,
              this.center.z + halfDepth,
              this.center.x + halfWidth - doorEnd,
              0.5
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
              0.5
            );

            this.createWall(
              doorEnd + (this.center.x + halfWidth - doorEnd) / 2,
              this.center.z - halfDepth,
              this.center.x + halfWidth - doorEnd,
              0.5
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
              doorStart - this.center.z + halfDepth
            );

            this.createWall(
              this.center.x + halfWidth,
              doorEnd + (this.center.z + halfDepth - doorEnd) / 2,
              0.5,
              this.center.z + halfDepth - doorEnd
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
              doorStart - this.center.z + halfDepth
            );

            this.createWall(
              this.center.x - halfWidth,
              doorEnd + (this.center.z + halfDepth - doorEnd) / 2,
              0.5,
              this.center.z + halfDepth - doorEnd
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
