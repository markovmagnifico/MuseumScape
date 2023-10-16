import * as THREE from 'three';

export default class Wall {
  static geometryCache = new Map();

  constructor(scene, { x, y, z, width, height, depth, color = 0xffffff }) {
    this.scene = scene;

    // Automatically set y when undefined
    y = y !== undefined ? y : height / 2;

    // Check the cache for a geometry
    const geometryKey = `${width}-${height}-${depth}`;
    if (!Wall.geometryCache.has(geometryKey)) {
      const newGeometry = new THREE.BoxGeometry(width, height, depth);
      Wall.geometryCache.set(geometryKey, newGeometry);
    }
    const cachedGeometry = Wall.geometryCache.get(geometryKey);

    const material = new THREE.MeshToonMaterial({ color });
    this.mesh = new THREE.Mesh(cachedGeometry, material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(x, y, z);
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
    this.scene.add(this.mesh);
  }
}
