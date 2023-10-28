import * as THREE from 'three';
import { distance3D } from './utils';

export default class SpeechBubble {
  static width = 564;
  static height = 256;

  static dialogue1 = [
    "Hello and welcome! Name's Markov and I'm the curator in these parts.",
    "If you haven't already click anywhere in the window and use your mouse to look around.",
    'You can also jump with the "Spacebar" key, give it a try!',
    'Oh and you can press the "Escape" key any time to free your mouse cursor.',
    "Where are we exactly? What is this place? That's tough to answer.",
    "This is a museum. Not a real place, but a real museum that's for sure",
    "As for where we are... that's all a matter of perspective isn't it?",
    "You might say we're in a machine somewhere and that would be correct...",
    "But I prefer to say we're inside your head right now.",
    'Am I saying these words, or are you? Hahaha!',
    'Anyways...',
    "There's a number of exhibits in the museum already, feel free to explore.",
    'Oh, and some of the paintings are more than paintings...',
    'They give you special powers!',
    "I'll be here if you need any help. Enjoy the art!",
  ];
  static dialogue2 = [
    'Ah I see you\'ve you\'ve learned to "Double Jump" now.',
    'Just press "space" again while you\'re in the air to go even higher!',
    'This should help you reach some areas still under construction.',
  ];
  static dialogue3 = [
    'Ah I see you\'ve you\'ve learned to "Air Dash" now.',
    'Just press "left shift" while you\'re in the air to for a burst of forwards speed!',
    'This should help you reach even more remote areas in the museum.',
  ];
  static dialogue4 = [
    "Look at that, you've reached the end of the museum!",
    "That's all the art we have for now, I hope you enjoyed your visit!",
  ];

  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
    this.init();

    // state related to tracking dialogue
    this.state = 'Distant'; // Initialize state
    this.currentDialogue = SpeechBubble.dialogue1;
    this.dialogueIndex = 0; // Pointer to the current line of dialogue
  }

  roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
  }

  init() {
    const speechBubble = document.createElement('canvas');
    speechBubble.width = SpeechBubble.width;
    speechBubble.height = SpeechBubble.height;
    const context = speechBubble.getContext('2d');
    context.clearRect(0, 0, SpeechBubble.width, SpeechBubble.height);

    context.fillStyle = 'white';
    context.beginPath();
    this.roundedRect(
      context,
      0,
      0,
      SpeechBubble.width,
      SpeechBubble.height,
      20
    );
    context.fill();

    const texture = new THREE.CanvasTexture(speechBubble);
    const material = new THREE.MeshToonMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(2.2, 1);

    this.dialogueBubble = new THREE.Mesh(geometry, material);
    this.dialogueBubble.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.scene.add(this.dialogueBubble);
  }

  changeState(newState) {
    this.state = newState;
    if (newState === 'Dialogue') {
      this.dialogueIndex = 0;
    }
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line !== '') {
        context.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  updateText(newText) {
    const speechBubble = document.createElement('canvas');
    speechBubble.width = SpeechBubble.width;
    speechBubble.height = SpeechBubble.height;
    const context = speechBubble.getContext('2d');
    context.clearRect(0, 0, SpeechBubble.width, SpeechBubble.height);

    context.fillStyle = 'white';
    context.beginPath();
    this.roundedRect(
      context,
      0,
      0,
      SpeechBubble.width,
      SpeechBubble.height,
      20
    );
    context.fill();

    // Set some initial values for text placement and formatting
    const maxWidth = SpeechBubble.width - 30; // 10px padding on each side
    const lineHeight = 50; // You may want to adjust this
    const x = 30; // Start x at padding
    const y = 50; // Start y, leaving some space at the top

    // Set a default font size and color
    context.fillStyle = 'black';
    context.font = '40px Quicksand'; // Set a default font size

    // Use the wrapText function to draw the text
    this.wrapText(context, newText, x, y, maxWidth, lineHeight);

    if (this.state === 'Dialogue') {
      this.drawUIHints(context, SpeechBubble.width, SpeechBubble.height);
    }

    this.dialogueBubble.material.map.dispose();
    this.dialogueBubble.material.map = new THREE.CanvasTexture(speechBubble);
    this.dialogueBubble.material.map.needsUpdate = true;
  }

  drawUIHints(context, canvasWidth, canvasHeight) {
    const hintFontSize = 30;
    context.font = `${hintFontSize}px Oswald, Sans-Serif`;

    const leftHint = '← Q';
    const rightHint = 'E →';

    // Calculate positions, accounting for the text width and a 10px margin from the edge
    const leftX = 10;
    const rightX = canvasWidth - context.measureText(rightHint).width - 10;
    const y = canvasHeight - 20; // 10px from the bottom

    // Choose the appropriate color for the left hint
    context.fillStyle = this.dialogueIndex === 0 ? '#888888' : '#000000';
    context.fillText(leftHint, leftX, y);

    // Choose the appropriate color for the right hint
    context.fillStyle =
      this.dialogueIndex === this.currentDialogue.length - 1
        ? '#888888'
        : '#000000';
    context.fillText(rightHint, rightX, y);
  }

  updateTextBasedOnState() {
    if (this.state === 'Distant') {
      this.updateText(
        'Psst, come over here! Use the WASD keys to move around.'
      );
    } else if (this.state === 'Dialogue') {
      this.updateText(this.currentDialogue[this.dialogueIndex]);
    }
  }

  handleKeyEvent(event) {
    if (this.state === 'Dialogue') {
      if (event.key === 'q') {
        this.dialogueIndex = Math.max(0, this.dialogueIndex - 1);
      } else if (event.key === 'e') {
        this.dialogueIndex = Math.min(
          this.currentDialogue.length - 1,
          this.dialogueIndex + 1
        );
      }
    }
  }

  update(player) {
    const distance = distance3D(this.position, player.position);

    if (player.gameComplete) {
      this.currentDialogue = SpeechBubble.dialogue4;
    } else if (player.airDashUnlocked) {
      this.currentDialogue = SpeechBubble.dialogue3;
    } else if (player.doubleJumpUnlocked) {
      this.currentDialogue = SpeechBubble.dialogue2;
    } else {
      this.currentDialogue = SpeechBubble.dialogue1;
    }

    // State transitions based on distance
    if (distance < 4 && this.state !== 'Dialogue') {
      this.changeState('Dialogue');
    } else if (distance >= 4 && this.state !== 'Distant') {
      this.changeState('Distant');
    }

    this.updateTextBasedOnState();
  }
}
