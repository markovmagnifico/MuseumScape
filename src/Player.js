import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { gravity } from './Constants';
import Wall from './Wall';

export default class Player {
  constructor(scene, canvas, camera, stateManager) {
    // General onstants
    this.scene = scene;
    this.controls = null;
    this.camera = camera;
    this.stateManager = stateManager;

    // Player constants
    this.playerHeight = 2;
    this.playerRadius = 0.5;
    this.speed = 0.1;
    this.jumpForce = 0.15; // Upward force applied when jumping

    // State variables
    this.position = new THREE.Vector3(0, 1, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.canJump = true;
    this.hasDoubleJumped = false;

    // Initialize geometry, material, mesh, etc.
    this.initPlayerModel();
    this.initControls(canvas);
    this.initEventListeners();
    this.boundingSphere = new THREE.Sphere(this.position, this.playerRadius);
    this.keystate = { KeyW: false, KeyS: false, KeyA: false, KeyD: false };
  }

  initPlayerModel() {
    const playerGeometry = new THREE.CylinderGeometry(
      0.5,
      0.5,
      this.playerHeight,
      32
    ); // Parameters for a cylinder
    const playerMaterial = new THREE.MeshToonMaterial({ color: 0xff0000 }); // Red color
    const player = new THREE.Mesh(playerGeometry, playerMaterial);

    player.castShadow = true;
    player.receiveShadow = true;
    player.position.y = 2; // Position it on top of the grid
    console.log(player.position);
    this.scene.add(player);
  }

  initControls(canvas) {
    this.controls = new PointerLockControls(this.camera, canvas);
    this.scene.add(this.controls.getObject());
    canvas.addEventListener('click', () => {
      this.controls.lock();
    });
  }

  initEventListeners() {
    // Initialize event listeners for controls
    document.addEventListener('keydown', this.handleInput.bind(this));
    document.addEventListener('keyup', this.handleInput.bind(this));
  }

  handleInput(event) {
    switch (event.type) {
      case 'keydown':
        if (this.keystate.hasOwnProperty(event.code)) {
          this.keystate[event.code] = true;
        }
        if (event.code === 'Space') {
          if (this.canJump) {
            this.velocity.setY(this.velocity.y + this.jumpForce);
            this.canJump = false;
          } else if (!this.hasDoubleJumped) {
            this.velocity.setY(
              Math.max(this.velocity.y + this.jumpForce, this.jumpForce)
            );
            this.hasDoubleJumped = true;
          }
        }
        break;
      case 'keyup':
        if (this.keystate.hasOwnProperty(event.code)) {
          this.keystate[event.code] = false;
        }
        break;
    }
  }

  update() {
    const viewDirection = new THREE.Vector3();
    const movementVector = new THREE.Vector3();

    if (
      this.keystate.KeyW ||
      this.keystate.KeyS ||
      this.keystate.KeyA ||
      this.keystate.KeyD
    ) {
      this.controls.getDirection(viewDirection);

      if (this.keystate.KeyW) {
        movementVector.add(
          new THREE.Vector3(viewDirection.x, 0, viewDirection.z)
        );
      }
      if (this.keystate.KeyS) {
        movementVector.add(
          new THREE.Vector3(-viewDirection.x, 0, -viewDirection.z)
        );
      }
      if (this.keystate.KeyA) {
        movementVector.add(
          new THREE.Vector3(viewDirection.z, 0, -viewDirection.x)
        );
      }
      if (this.keystate.KeyD) {
        movementVector.add(
          new THREE.Vector3(-viewDirection.z, 0, viewDirection.x)
        );
      }

      this.position.add(movementVector.normalize().multiplyScalar(this.speed));
      this.boundingSphere.set(this.position, this.playerRadius);
    }

    // Apply gravity
    this.velocity.setY(this.velocity.y + gravity);
    this.position.y += this.velocity.y;

    // Ground collision detection
    // if (this.position.y <= 1) {
    //   this.position.y = 1;
    //   this.canJump = true; // Player can jump again
    //   this.velocity.setY(0); // Reset vertical velocity
    //   this.hasDoubleJumped = false; // Reset the double-jump state
    // }

    const walls = this.stateManager.getEntities(Wall);
    let isOnSolidGround = false;
    for (let wall of walls) {
      if (this.boundingSphere.intersectsBox(wall.boundingBox)) {
        // Collision detected

        // Find the closest point on the wall's bounding box to the player's position
        const closestPoint = new THREE.Vector3();
        wall.boundingBox.clampPoint(this.position, closestPoint);

        // Compute the collision response vector
        const collisionResponse = new THREE.Vector3()
          .subVectors(this.position, closestPoint)
          .normalize();

        // Adjust the player's movement vector
        const overlap =
          this.boundingSphere.radius -
          closestPoint.distanceTo(this.position) +
          0.01; // Adding a small value to ensure there's no overlap
        collisionResponse.multiplyScalar(overlap);
        this.position.add(collisionResponse);

        if (this.position.y > wall.boundingBox.max.y && this.velocity.y <= 0) {
          isOnSolidGround = true;
        }
      }
    }

    if (isOnSolidGround) {
      this.canJump = true;
      this.velocity.setY(0); // Reset vertical velocity
      this.hasDoubleJumped = false; // Reset the double-jump state
    }

    this.boundingSphere.set(this.position, this.playerRadius);

    camera.position.x = this.position.x;
    camera.position.y = this.position.y + this.playerHeight * 0.3; // This puts the camera position at 80% the height of the player
    camera.position.z = this.position.z;
  }
}
