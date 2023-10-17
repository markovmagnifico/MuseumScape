import * as THREE from 'three';

export default class Painting {
  constructor(
    scene,
    imagePath,
    position,
    width,
    height,
    orientation = 'north'
  ) {
    const textureLoader = new THREE.TextureLoader();
    const paintingTexture = textureLoader.load(imagePath);
    paintingTexture.minFilter = THREE.NearestFilter;
    paintingTexture.magFilter = THREE.NearestFilter;

    // Frame
    const frameThickness = 0.05;
    const frameGeometry = new THREE.BoxGeometry(
      width + 2 * frameThickness,
      height + 2 * frameThickness,
      frameThickness
    );
    const frameMaterial = new THREE.MeshToonMaterial({ color: 0xcd853f }); // Brown
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    frameMesh.position.copy(position);

    // Canvas
    const canvasGeometry = new THREE.PlaneGeometry(width, height);
    const canvasMaterial = new THREE.MeshToonMaterial({
      map: paintingTexture,
    });
    const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvasMesh.position.set(position.x, position.y, position.z); // Offset to avoid z-fighting

    // Handle orientation

    let canvasOffset = new THREE.Vector3(0, 0, frameThickness / 2 + 0.001);
    switch (orientation) {
      case 'west':
        canvasMesh.rotation.y = Math.PI / 2;
        frameMesh.rotation.y = Math.PI / 2;
        canvasOffset = new THREE.Vector3(frameThickness / 2 + 0.001, 0, 0);
        break;
      case 'south':
        canvasMesh.rotation.y = Math.PI;
        frameMesh.rotation.y = Math.PI;
        canvasOffset = new THREE.Vector3(0, 0, -(frameThickness / 2 + 0.001));
        break;
      case 'east':
        canvasMesh.rotation.y = -Math.PI / 2;
        frameMesh.rotation.y = -Math.PI / 2;
        canvasOffset = new THREE.Vector3(-(frameThickness / 2 + 0.001), 0, 0);
        break;
      // default is 'north', no need for rotation adjustments
    }
    canvasMesh.position.add(canvasOffset);

    scene.add(canvasMesh);
    scene.add(frameMesh);
  }
}
