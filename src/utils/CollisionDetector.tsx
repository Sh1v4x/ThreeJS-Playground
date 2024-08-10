import * as THREE from "three";
import { PLAYER_HEIGHT, PLAYER_RADIUS } from "../constants/GameConstants";

export class CollisionDetector {
  checkCollision(
    playerPosition: THREE.Vector3,
    objects: THREE.Object3D[],
    checkY = true
  ): { collided: boolean; collidedObject: THREE.Mesh | null; groundY: number } {
    let groundY = -Infinity;
    let collided = false;
    let collidedObject: THREE.Mesh | null = null;

    for (const object of objects) {
      if (object instanceof THREE.Mesh) {
        const playerBottom = playerPosition.y;
        const playerTop = playerPosition.y + PLAYER_HEIGHT;
        const playerLeft = playerPosition.x - PLAYER_RADIUS;
        const playerRight = playerPosition.x + PLAYER_RADIUS;
        const playerFront = playerPosition.z - PLAYER_RADIUS;
        const playerBack = playerPosition.z + PLAYER_RADIUS;

        let objectBottom,
          objectTop,
          objectLeft,
          objectRight,
          objectFront,
          objectBack;

        if (object.userData.isGround) {
          const groundThickness = 0.1; 
          objectBottom = object.position.y - groundThickness / 2;
          objectTop = object.position.y + groundThickness / 2;
          objectLeft = object.position.x - object.geometry.parameters.width / 2;
          objectRight =
            object.position.x + object.geometry.parameters.width / 2;
          objectFront =
            object.position.z - object.geometry.parameters.height / 2;
          objectBack =
            object.position.z + object.geometry.parameters.height / 2;
        } else if (object.geometry instanceof THREE.BoxGeometry) {
          objectBottom =
            object.position.y - object.geometry.parameters.height / 2;
          objectTop = object.position.y + object.geometry.parameters.height / 2;
          objectLeft = object.position.x - object.geometry.parameters.width / 2;
          objectRight =
            object.position.x + object.geometry.parameters.width / 2;
          objectFront =
            object.position.z - object.geometry.parameters.depth / 2;
          objectBack = object.position.z + object.geometry.parameters.depth / 2;
        } else {
          continue;
        }

        if (
          playerLeft < objectRight &&
          playerRight > objectLeft &&
          playerFront < objectBack &&
          playerBack > objectFront
        ) {
          if (checkY) {
            if (playerBottom <= objectTop && playerTop > objectBottom) {
              collided = true;
              collidedObject = object;
              groundY = Math.max(groundY, objectTop);
            }
          } else {
            collided = true;
            collidedObject = object;
          }
        }
      }
    }

    return { collided, collidedObject, groundY };
  }
}
