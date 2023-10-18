import * as THREE from 'three';
import createSpotlight from './Spotlight';

export default class Painting {
  static textureLoader = new THREE.TextureLoader();
  static defaultSpotlightProps = {
    color: '#ffffff',
    intensity: 25,
    distance: 6,
    angle: 0.6,
    penumbra: 0.5,
    decay: 2,
  };

  constructor(
    scene,
    imagePath,
    framePath,
    position,
    width,
    height,
    orientation = 'north',
    showSpotlight = true,
    spotlightProps = {}
  ) {
    // Canvas Logic
    const paintingTexture = Painting.textureLoader.load(imagePath);
    paintingTexture.minFilter = THREE.NearestFilter;
    paintingTexture.magFilter = THREE.NearestFilter;
    const canvasGeometry = new THREE.PlaneGeometry(width, height);
    const canvasMaterial = new THREE.MeshToonMaterial({ map: paintingTexture });
    const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvasMesh.position.set(position.x, position.y, position.z); // Offset to avoid z-fighting

    // Frame Logic
    const frameThickness = 0.05;
    const frameTexture = Painting.textureLoader.load(framePath); // Load the frame texture
    const frameGeometry = new THREE.BoxGeometry(
      width + 2 * frameThickness,
      height + 2 * frameThickness,
      frameThickness
    );
    const frameMaterial = new THREE.MeshToonMaterial({ map: frameTexture });
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    frameMesh.position.copy(position);

    // Handle orientation
    let canvasOffset = new THREE.Vector3(0, 0, frameThickness / 2 + 0.001);
    let spotlightX, spotlightZ;
    const spotlightY = Math.min(4, position.y + 2.5);
    switch (orientation) {
      case 'west':
        canvasMesh.rotation.y = Math.PI / 2;
        frameMesh.rotation.y = Math.PI / 2;
        canvasOffset = new THREE.Vector3(frameThickness / 2 + 0.001, 0, 0);

        spotlightX = position.x + 3;
        spotlightZ = position.z;
        break;
      case 'south':
        canvasMesh.rotation.y = Math.PI;
        frameMesh.rotation.y = Math.PI;
        canvasOffset = new THREE.Vector3(0, 0, -(frameThickness / 2 + 0.001));

        spotlightX = position.x;
        spotlightZ = position.z - 3;
        break;
      case 'east':
        canvasMesh.rotation.y = -Math.PI / 2;
        frameMesh.rotation.y = -Math.PI / 2;
        canvasOffset = new THREE.Vector3(-(frameThickness / 2 + 0.001), 0, 0);

        spotlightX = position.x - 3;
        spotlightZ = position.z;
        break;
      case 'north':
        spotlightX = position.x;
        spotlightZ = position.z + 3;
      // default is 'north', no need for rotation adjustments
    }
    canvasMesh.position.add(canvasOffset);

    scene.add(canvasMesh);
    scene.add(frameMesh);

    if (showSpotlight) {
      // Create a spotlight for this painting
      const mergedSpotlightProps = {
        ...Painting.defaultSpotlightProps,
        ...spotlightProps,
        position: { x: spotlightX, y: spotlightY, z: spotlightZ },
        target: { x: position.x, y: position.y, z: position.z },
      };
      if (imagePath === '/assets/images/paintings/exhibit1/alley.png') {
        console.log(mergedSpotlightProps);
      }
      const spotlight = createSpotlight(mergedSpotlightProps);
      scene.add(spotlight);
      scene.add(spotlight.target);

      // Uncomment this to see helpers
      // const lightHelper = new THREE.SpotLightHelper(spotlight);
      // scene.add(lightHelper);
    }
  }
}
