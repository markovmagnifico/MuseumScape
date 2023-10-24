import * as THREE from 'three';
import { DEBUG } from './Constants';

export default class AbilityUnlocker {
  constructor(scene, x, y, z, abilityName, unlockText) {
    this.scene = scene;
    this.abilityName = abilityName;
    this.unlockText = unlockText;

    this.createBoundingBox(x, y, z);
    this.isAbilityUnlocked = false;
  }

  update(player) {
    const isInside = this.boundingBox.intersectsSphere(player.boundingSphere);
    if (isInside && !this.isAbilityUnlocked) {
      this.unlockAbility(player);
      this.displayUnlockText();
      console.log(`${this.abilityName} unlocked!`);
    }
  }

  createBoundingBox(x, y, z) {
    const halfSize = 2;
    this.boundingBox = new THREE.Box3(
      new THREE.Vector3(x - halfSize, y - halfSize, z - halfSize),
      new THREE.Vector3(x + halfSize, y + halfSize, z + halfSize)
    );

    if (DEBUG) {
      const boxGeometry = new THREE.BoxGeometry(
        halfSize * 2,
        halfSize * 2,
        halfSize * 2
      );
      const boxMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 'blue',
      });
      this.debugBox = new THREE.Mesh(boxGeometry, boxMaterial);
      this.debugBox.position.set(x, y, z);
      this.scene.add(this.debugBox);
    }
  }

  unlockAbility(player) {
    this.isAbilityUnlocked = true;
    player[this.abilityName] = true;
  }

  displayUnlockText() {
    const textDiv = document.createElement('div');
    textDiv.className = 'ability-unlock-text';
    textDiv.innerHTML = this.unlockText.replace(/\n/g, '<br>'); // Handle newlines
    textDiv.style.opacity = '1'; // fade in

    document.body.appendChild(textDiv);

    setTimeout(() => {
      textDiv.style.opacity = '0'; // Fade out before removing
      setTimeout(() => {
        document.body.removeChild(textDiv);
      }, 300); // Wait for fade out to complete, then remove
    }, 5700); // Adjust the time so that the total time remains 3 seconds
  }
}
