import * as THREE from 'three';

export default class Sign {
  constructor(
    position,
    orientation,
    signText,
    fontSize = 80,
    texturePath = '/assets/images/textures/wood_med.jpg'
  ) {
    this.group = new THREE.Group();

    const loader = new THREE.TextureLoader();
    loader.load(texturePath, (texture) => {
      this.createPole(texture);
      this.createBoard(texture, signText, fontSize);

      this.group.position.set(position.x, position.y, position.z);
      this.group.rotation.set(orientation.x, orientation.y, orientation.z);
    });
  }

  createPole(texture) {
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 32);
    const material = new THREE.MeshToonMaterial({ map: texture });
    const pole = new THREE.Mesh(geometry, material);
    this.group.add(pole);
  }

  createBoard(texture, signText, fontSize) {
    const geometry = new THREE.BoxGeometry(1.2, 0.6, 0.1);
    const material = new THREE.MeshToonMaterial({ map: texture });
    const board = new THREE.Mesh(geometry, material);
    board.position.set(0, 1, 0);

    // Smaller geometry for textBoard
    const textGeometry = new THREE.BoxGeometry(1, 0.5, 0.01);

    // Create canvas and add text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;
    context.font = `${fontSize}px Oswald, sans-serif`;
    context.fillStyle = '#FFFAF0';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';

    // Center text settings
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const centerX = canvas.width / 2;

    const lines = signText.split('\n');
    const lineHeight = fontSize + 10;
    const totalHeight = lines.length * lineHeight;
    let yOffset = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    for (const line of lines) {
      context.fillText(line, centerX, yOffset);
      yOffset += lineHeight;
    }

    // Create a texture from the canvas
    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshToonMaterial({ map: textTexture });
    const textBoard = new THREE.Mesh(textGeometry, textMaterial);
    textBoard.position.set(0, 1, 0.05); // Slightly in front of the main board

    this.group.add(board);
    this.group.add(textBoard);
  }
}
