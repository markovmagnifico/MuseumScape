import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { gravity } from './Constants';
import Wall from './Wall';

export default class Player {
  constructor(startPosition, scene, canvas, camera, stateManager) {
    // General constants
    this.scene = scene;
    this.controls = null;
    this.camera = camera;
    this.stateManager = stateManager;

    // Player constants
    this.playerHeight = 2;
    this.playerRadius = 0.7;
    this.speed = 0.07;
    this.jumpForce = 0.15;
    this.airDashForce = 0.15;

    // Ability unlocks
    this.doubleJumpUnlocked = false;
    this.airDashUnlocked = false;

    // State variables
    // this.position = new THREE.Vector3(15, 0.71, 11);
    this.position = new THREE.Vector3(
      startPosition.x,
      startPosition.y,
      startPosition.z
    );
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.canJump = true;
    this.canDoubleJump = true;
    this.canAirDash = true;
    this.isAirDashing = false;

    // Audio constants
    this.footstepsAudio = document.getElementById('playerFootsteps');
    this.footstepsAudioOn = false;

    // Initialize geometry, controls, event handling, etc
    this.initPlayerModel();
    this.initControls(canvas);
    this.initEventListeners();
    this.boundingSphere = new THREE.Sphere(this.position, this.playerRadius);
    this.keystate = { KeyW: false, KeyS: false, KeyA: false, KeyD: false };
  }

  initPlayerModel() {
    // const playerGeometry = new THREE.CylinderGeometry(
    //   0.5,
    //   0.5,
    //   this.playerHeight,
    //   32
    // ); // Parameters for a cylinder
    // const playerMaterial = new THREE.MeshToonMaterial({ color: 0xff0000 }); // Red color
    // const player = new THREE.Mesh(playerGeometry, playerMaterial);
    // player.castShadow = true;
    // player.receiveShadow = true;
    // player.position.y = 2; // Position it on top of the grid
    // console.log(player.position);
    // this.scene.add(player);
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
          } else if (this.doubleJumpUnlocked && this.canDoubleJump) {
            this.velocity.setY(
              Math.max(this.velocity.y + this.jumpForce, this.jumpForce)
            );
            this.canDoubleJump = false;
          }
        }
        if (event.code === 'Backquote') {
          // press tilde ~ key for debugging
          console.log(this.position);
        }
        if (
          event.code === 'ShiftLeft' &&
          this.airDashUnlocked &&
          !this.canJump &&
          this.canAirDash &&
          !this.isAirDashing
        ) {
          this.isAirDashing = true;
          this.canAirDash = false;
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
      if (!this.footstepsAudioOn && this.canJump) {
        this.footstepsAudio.play();
        this.footstepsAudioOn = true;
      }
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
    } else if (this.footstepsAudioOn) {
      this.footstepsAudioOn = false;
      this.footstepsAudio.pause();
    }
    if (this.footstepsAudioOn && !this.canJump) {
      this.footstepsAudioOn = false;
      this.footstepsAudio.pause();
    }

    // Apply gravity
    this.velocity.setY(this.velocity.y + gravity);
    const originalY = this.position.y;

    // Do air-dash
    if (this.isAirDashing) {
      this.controls.getDirection(viewDirection);
      viewDirection.y = 0; // Make sure we only move horizontally
      this.velocity.add(
        viewDirection.normalize().multiplyScalar(this.airDashForce)
      );

      this.isAirDashing = false; // Reset air-dash state
    }

    // Final position update before collision handling
    this.position.add(this.velocity);

    const walls = this.stateManager.getEntities(Wall);
    let isOnSolidGround = false;
    let isTouchingCeiling = false;
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

        if (
          this.position.y + this.playerHeight > wall.boundingBox.max.y &&
          this.velocity.y > 0
        ) {
          isTouchingCeiling = true;
        }
      }
    }

    if (isTouchingCeiling) {
      this.velocity.setY(0);
    }

    if (isOnSolidGround) {
      this.canJump = true;
      this.position.y = originalY;
      this.velocity.setX(0);
      this.velocity.setY(0);
      this.velocity.setZ(0);
      this.canDoubleJump = true; // Reset the double-jump state
      this.canAirDash = true;
      this.isAirDashing = false;
    }

    this.boundingSphere.set(this.position, this.playerRadius);

    camera.position.x = this.position.x;
    camera.position.y = this.position.y + this.playerHeight * 0.3; // This puts the camera position at 80% the height of the player
    camera.position.z = this.position.z;
  }
}
