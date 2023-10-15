import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { gravity } from './Constants';

export default class Player {
  constructor(scene, canvas, camera) {
    // General onstants
    this.scene = scene;
    this.controls = null;
    this.camera = camera;

    // Player constants
    this.playerHeight = 2;
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
    this.keystate = { KeyW: false, KeyS: false, KeyA: false, KeyD: false };
  }

  initPlayerModel() {
    const playerGeometry = new THREE.CylinderGeometry(
      0.5,
      0.5,
      this.playerHeight,
      32
    ); // Parameters for a cylinder
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1; // Position it on top of the grid
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
            this.velocity.setY(this.velocity.y + this.jumpForce);
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
    }

    // Apply gravity
    this.velocity.setY(this.velocity.y + gravity);
    this.position.y += this.velocity.y;

    // Ground collision detection
    if (this.position.y <= 1) {
      this.position.y = 1;
      this.canJump = true; // Player can jump again
      this.velocity.setY(0); // Reset vertical velocity
      this.hasDoubleJumped = false; // Reset the double-jump state
    }

    camera.position.x = this.position.x;
    camera.position.y = this.position.y + this.playerHeight * 0.3; // This puts the camera position at 80% the height of the player
    camera.position.z = this.position.z;
  }
}
