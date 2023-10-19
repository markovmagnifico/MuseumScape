import * as THREE from 'three';

export default class DynamicSpotlight {
  constructor(scene, spotlightProps, debug = false) {
    this.scene = scene;
    this.spotlightProps = spotlightProps;
    this.debug = debug;

    // Calculate bounding box position based on spotlight position
    const halfHeight = 2;
    this.boundingBox = new THREE.Box3(
      new THREE.Vector3(
        spotlightProps.position.x - 1.5,
        spotlightProps.position.y - 4,
        spotlightProps.position.z - 1.5
      ),
      new THREE.Vector3(
        spotlightProps.position.x + 1.5,
        spotlightProps.position.y - 4 + halfHeight * 2,
        spotlightProps.position.z + 1.5
      )
    );

    if (this.debug) {
      const boxGeometry = new THREE.BoxGeometry(3, 4, 3);
      const boxMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 'red',
      });
      this.debugBox = new THREE.Mesh(boxGeometry, boxMaterial);
      this.debugBox.position.set(
        spotlightProps.position.x,
        spotlightProps.position.y - halfHeight,
        spotlightProps.position.z
      );
      this.scene.add(this.debugBox);
    }

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

  addSpotlight() {
    const spotlight = new THREE.SpotLight(
      this.spotlightProps.color,
      this.spotlightProps.intensity,
      this.spotlightProps.distance,
      this.spotlightProps.angle,
      this.spotlightProps.penumbra,
      this.spotlightProps.decay
    );
    spotlight.position.set(
      this.spotlightProps.position.x,
      this.spotlightProps.position.y,
      this.spotlightProps.position.z
    );
    spotlight.target.position.set(
      this.spotlightProps.target.x,
      this.spotlightProps.target.y,
      this.spotlightProps.target.z
    );
    spotlight.castShadow = true;

    this.spotlight = spotlight;
    this.scene.add(this.spotlight);

    if (this.debug) {
      this.lightHelper = new THREE.SpotLightHelper(spotlight);
      this.scene.add(this.lightHelper);
    }

    this.isSpotlightAdded = true;
  }

  removeSpotlight() {
    this.scene.remove(this.spotlight);

    if (this.debug && this.lightHelper) {
      this.scene.remove(this.lightHelper);
    }

    this.isSpotlightAdded = false;
  }
}
