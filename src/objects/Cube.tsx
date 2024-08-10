import * as THREE from "three";

export class Cube {
  public mesh: THREE.Mesh;
  public velocity: THREE.Vector3;
  public mass: number;

  constructor(
    scene: THREE.Scene,
    x: number,
    y: number,
    z: number,
    texture: string
  ) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const mesh = new THREE.TextureLoader().load(texture);
    const material = new THREE.MeshBasicMaterial({ map: mesh });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);

    this.velocity = new THREE.Vector3();
    this.mass = 10;

    this.mesh.userData.isCube = true;
    this.mesh.userData.cubeInstance = this;
  }

  update(delta: number) {
    this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));

    this.velocity.multiplyScalar(0.95);

    if (this.velocity.length() < 0.01) {
      this.velocity.set(0, 0, 0);
    }
  }
}
