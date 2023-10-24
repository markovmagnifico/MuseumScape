import * as THREE from 'three';

export default class Painting {
  static textureLoader = new THREE.TextureLoader();

  constructor(
    scene,
    imagePath,
    framePath,
    position,
    width,
    height,
    orientation = 'north'
  ) {
    this.group = new THREE.Group();
    this.group.position.copy(position);

    const canvasMesh = this.createCanvas(imagePath, width, height);
    const frameMesh = this.createFrame(framePath, width, height);

    this.group.add(canvasMesh);
    this.group.add(frameMesh);

    switch (orientation) {
      case 'west':
        this.group.rotation.y = Math.PI / 2;
        break;
      case 'south':
        this.group.rotation.y = Math.PI;
        break;
      case 'east':
        this.group.rotation.y = -Math.PI / 2;
        break;
      default:
        // 'north' orientation doesn't require any rotation
        break;
    }

    scene.add(this.group);
  }

  createCanvas(imagePath, width, height) {
    const texture = Painting.textureLoader.load(imagePath);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshToonMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0.015; // Position relative to group
    return mesh;
  }

  createFrame(framePath, width, height) {
    const frameThickness = 0.05;
    const frameDepth = 0.05;
    const frameGroup = new THREE.Group();

    const texture = Painting.textureLoader.load(framePath);
    const material = new THREE.MeshToonMaterial({ map: texture });

    // Create top bar
    const topGeometry = new THREE.BoxGeometry(
      width + 2 * frameThickness,
      frameThickness,
      frameDepth
    );
    const topBar = new THREE.Mesh(topGeometry, material);
    topBar.position.set(0, height / 2 + frameThickness / 2, 0);
    frameGroup.add(topBar);

    // Create bottom bar
    const bottomGeometry = new THREE.BoxGeometry(
      width + 2 * frameThickness,
      frameThickness,
      frameDepth
    );
    const bottomBar = new THREE.Mesh(bottomGeometry, material);
    bottomBar.position.set(0, -height / 2 - frameThickness / 2, 0);
    frameGroup.add(bottomBar);

    // Create left bar
    const leftGeometry = new THREE.BoxGeometry(
      frameThickness,
      height,
      frameDepth
    );
    const leftBar = new THREE.Mesh(leftGeometry, material);
    leftBar.position.set(-width / 2 - frameThickness / 2, 0, 0);
    frameGroup.add(leftBar);

    // Create right bar
    const rightGeometry = new THREE.BoxGeometry(
      frameThickness,
      height,
      frameDepth
    );
    const rightBar = new THREE.Mesh(rightGeometry, material);
    rightBar.position.set(width / 2 + frameThickness / 2, 0, 0);
    frameGroup.add(rightBar);

    return frameGroup;
  }
}
