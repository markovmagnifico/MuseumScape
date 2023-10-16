import * as THREE from 'three';

export default class Wall {
  static geometryCache = new Map();
  // static material = new THREE.MeshPhongMaterial({ color: 0xff7f50 });
  static material = new THREE.MeshToonMaterial({ color: 0xff7f50 });

  constructor(scene, { x, y, z, width, height, depth }) {
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

    this.mesh = new THREE.Mesh(cachedGeometry, Wall.material);
    this.mesh.position.set(x, y, z);
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
    this.scene.add(this.mesh);
  }
}
