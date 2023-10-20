import * as THREE from 'three';
import { DEBUG } from './Constants';

export default class DynamicSpotlight {
  constructor(scene, spotlightProps) {
    this.scene = scene;
    this.spotlightProps = spotlightProps;

    this.createBoundingBox(spotlightProps);
    this.createSpotlight(spotlightProps);
    this.isSpotlightAdded = false;
  }

  update(player) {
    const isInside = this.boundingBox.intersectsSphere(player.boundingSphere);

    if (isInside && !this.isSpotlightAdded) {
      this.addSpotlight();
    } else if (!isInside && this.isSpotlightAdded) {
      this.removeSpotlight();
    }
  }

  createBoundingBox(spotlightProps) {
    // Calculate bounding box position based on spotlight position
    const height = 4;
    this.boundingBox = new THREE.Box3(
      new THREE.Vector3(
        spotlightProps.position.x - 1.5,
        spotlightProps.position.y - 4,
        spotlightProps.position.z - 1.5
      ),
      new THREE.Vector3(
        spotlightProps.position.x + 1.5,
        spotlightProps.position.y - 4 + height,
        spotlightProps.position.z + 1.5
      )
    );

    if (DEBUG) {
      const boxGeometry = new THREE.BoxGeometry(3, 4, 3);
      const boxMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 'red',
      });
      this.debugBox = new THREE.Mesh(boxGeometry, boxMaterial);
      this.debugBox.position.set(
        spotlightProps.position.x,
        spotlightProps.position.y - height / 2,
        spotlightProps.position.z
      );
      this.scene.add(this.debugBox);
    }
  }

  createSpotlight(spotlightProps) {
    const spotlight = new THREE.SpotLight(
      spotlightProps.color,
      spotlightProps.intensity,
      spotlightProps.distance,
      spotlightProps.angle,
      spotlightProps.penumbra,
      spotlightProps.decay
    );
    spotlight.position.set(
      spotlightProps.position.x,
      spotlightProps.position.y,
      spotlightProps.position.z
    );
    spotlight.target.position.set(
      spotlightProps.target.x,
      spotlightProps.target.y,
      spotlightProps.target.z
    );
    spotlight.castShadow = true;

    this.spotlight = spotlight;
    this.lightHelper = new THREE.SpotLightHelper(this.spotlight);
  }

  addSpotlight() {
    this.scene.add(this.spotlight);

    if (DEBUG) {
      this.scene.add(this.lightHelper);
    }

    this.isSpotlightAdded = true;
  }

  removeSpotlight() {
    this.scene.remove(this.spotlight);

    if (DEBUG && this.lightHelper) {
      this.scene.remove(this.lightHelper);
    }

    this.isSpotlightAdded = false;
  }
}
