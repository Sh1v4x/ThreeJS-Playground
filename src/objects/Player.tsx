import * as THREE from "three";
import {
  GRAVITY,
  MAX_JUMP_HEIGHT,
  MOVE_SPEED,
  PLAYER_HEIGHT,
} from "../constants/GameConstants";
import { CollisionDetector } from "../utils/CollisionDetector";
import { InputManager } from "../utils/InputManager";

export class Player {
  private object: THREE.Object3D;
  private camera: THREE.Camera;
  private velocity: THREE.Vector3;
  private isJumping: boolean;
  private canJump: boolean;
  private moveSpeed: number;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.object = new THREE.Object3D();
    this.object.position.set(0, PLAYER_HEIGHT / 0.7, 0);
    scene.add(this.object);
    this.object.add(camera);
    camera.position.set(0, PLAYER_HEIGHT / 0.7, 0);
    this.camera = camera;
    this.velocity = new THREE.Vector3();
    this.isJumping = false;
    this.canJump = true;
    this.moveSpeed = MOVE_SPEED;
  }

  update(
    inputManager: InputManager,
    collisionDetector: CollisionDetector,
    objects: THREE.Object3D[]
  ) {
    const moveState = inputManager.getMoveState();
    const direction = new THREE.Vector3();
    const sideVector = new THREE.Vector3();
    const moveVector = new THREE.Vector3();

    this.object.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    sideVector.setFromMatrixColumn(this.object.matrix, 0);

    if (moveState.forward) moveVector.sub(direction);
    if (moveState.backward) moveVector.add(direction);
    if (moveState.left) moveVector.sub(sideVector);
    if (moveState.right) moveVector.add(sideVector);

    if (moveState.jump && this.canJump) {
      this.velocity.y = MAX_JUMP_HEIGHT;
      this.isJumping = true;
      this.canJump = false;
    }

    this.object.position.y += this.velocity.y;
    this.velocity.y -= GRAVITY;

    const { collided, collidedObject, groundY } =
      collisionDetector.checkCollision(this.object.position, objects, true);

    if (collided && this.velocity.y < 0) {
      this.object.position.y = groundY + 0.001;
      this.velocity.y = 0;
      this.canJump = true;
      this.isJumping = false;
    } else if (this.object.position.y <= groundY) {
      this.object.position.y += this.velocity.y;
      this.velocity.y -= GRAVITY;
      this.canJump = true;
      this.isJumping = false;
    }

    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(this.moveSpeed);

      const newPosition = this.object.position.clone();

      newPosition.x += moveVector.x;
      if (
        !collisionDetector.checkCollision(newPosition, objects, true).collided
      ) {
        this.object.position.x = newPosition.x;
      }

      newPosition.z += moveVector.z;
      if (
        !collisionDetector.checkCollision(newPosition, objects, true).collided
      ) {
        this.object.position.z = newPosition.z;
      }
    }

    inputManager.updateRotation(this.object, this.camera);
  }

  getPosition() {
    return {
      x: this.object.position.x,
      y: this.object.position.y,
      z: this.object.position.z,
    };
  }
}
