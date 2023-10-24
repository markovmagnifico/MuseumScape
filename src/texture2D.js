import * as THREE from 'three';

export default class texture2D {
  constructor(position, size, texturePath, scene) {
    this.position = position;
    this.size = size;
    this.texturePath = texturePath;
    this.scene = scene;

    this.init();
  }

  async init() {
    const loader = new THREE.TextureLoader();

    loader.load(this.texturePath, (texture) => {
      const geometry = new THREE.PlaneGeometry(
        this.size.width,
        this.size.height
      ); // Dimensions set here
      const material = new THREE.MeshToonMaterial({
        map: texture,
        transparent: true, // Enable transparency
        alphaTest: 0.5, // Set an alpha test (optional, but can help with artifacts)
      });

      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;

      this.scene.add(this.mesh);
    });
  }
}
