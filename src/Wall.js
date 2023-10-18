import * as THREE from 'three';

export default class Wall {
  static geometryCache = new Map();

  constructor(
    scene,
    {
      x,
      y,
      z,
      width,
      height,
      depth,
      texturePath = '/assets/images/textures/wall1.jpg',
      wallType = 'floor',
    }
  ) {
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

    const texture = new THREE.TextureLoader().load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    let repeatX, repeatY;

    if (wallType === 'floor') {
      repeatX = width / 3;
      repeatY = depth / 3;
    } else if (wallType == 'wallEW') {
      repeatX = depth / 3;
      repeatY = height / 3;
    } else if (wallType == 'wallNS') {
      repeatX = width / 3;
      repeatY = height / 3;
    } else {
      console.log('Error: Unrecognized wall type');
    }

    texture.repeat.set(repeatX, repeatY);
    const material = new THREE.MeshToonMaterial({ map: texture });
    this.mesh = new THREE.Mesh(cachedGeometry, material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(x, y, z);
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
    this.scene.add(this.mesh);
  }
}
