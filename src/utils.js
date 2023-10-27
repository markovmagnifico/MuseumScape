import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function distance3D(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
  );
}

function createCompass(scene, position) {
  const arrowLength = 1; // Define the length of the arrows
  const arrowHeadSize = 0.2; // Define the size of the arrowhead

  // Create arrows for each direction
  const directions = [
    { dir: new THREE.Vector3(0, 0, 1), color: 0xff0000, label: 'N' },
    { dir: new THREE.Vector3(0, 0, -1), color: 0x00ff00, label: 'S' },
    { dir: new THREE.Vector3(1, 0, 0), color: 0x0000ff, label: 'E' },
    { dir: new THREE.Vector3(-1, 0, 0), color: 0xffff00, label: 'W' },
  ];

  const loader = new FontLoader();

  loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    directions.forEach(({ dir, color, label }) => {
      const arrow = new THREE.ArrowHelper(
        dir,
        position,
        arrowLength,
        color,
        arrowHeadSize
      );
      scene.add(arrow);

      const textGeometry = new TextGeometry(label, {
        font: font,
        size: 0.5,
        height: 0.1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(
        position.x + dir.x * (arrowLength + 0.5),
        position.y,
        position.z + dir.z * (arrowLength + 0.5)
      );
      scene.add(textMesh);
    });
  });
}

function createFloatingText(scene, position, textContent) {
  const loader = new FontLoader();

  loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry(textContent, {
      font: font,
      size: 0.5,
      height: 0.1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x1b1b1b });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(position.x, position.y, position.z);
    scene.add(textMesh);
  });
}

export { createCompass, createFloatingText, distance3D };
