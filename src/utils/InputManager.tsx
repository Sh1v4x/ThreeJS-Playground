import * as THREE from "three";

export class InputManager {
  private moveState: { [key: string]: boolean };
  private mouseSensitivity: number;
  private keyPressHandlers: { [key: string]: () => void };

  constructor() {
    this.moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    };
    this.keyPressHandlers = {};
    this.mouseSensitivity = 0.000005;

    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.moveState.forward = true;
        break;
      case "KeyS":
        this.moveState.backward = true;
        break;
      case "KeyA":
        this.moveState.left = true;
        break;
      case "KeyD":
        this.moveState.right = true;
        break;
      case "Space":
        this.moveState.jump = true;
        break;
    }

    if (this.keyPressHandlers[event.code]) {
      this.keyPressHandlers[event.code]();
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.moveState.forward = false;
        break;
      case "KeyS":
        this.moveState.backward = false;
        break;
      case "KeyA":
        this.moveState.left = false;
        break;
      case "KeyD":
        this.moveState.right = false;
        break;
      case "Space":
        this.moveState.jump = false;
        break;
    }
  }

  updateRotation(player: THREE.Object3D, camera: THREE.Camera) {
    document.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        player.rotation.y -= movementX * this.mouseSensitivity;
        camera.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(
            Math.PI / 2,
            camera.rotation.x - movementY * this.mouseSensitivity
          )
        );
      }
    });
  }

  getMoveState() {
    return this.moveState;
  }

  addKeyPressHandler(key: string, handler: () => void) {
    this.keyPressHandlers[key] = handler;
  }

  cleanup() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
