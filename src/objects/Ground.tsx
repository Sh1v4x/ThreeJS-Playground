import * as THREE from "three";
import { TerrainShader } from "../shaders/TerrainShader";

export class Ground {
  public mesh: THREE.Mesh;

  constructor(scene: THREE.Scene, x: number, y: number, z: number) {
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.ShaderMaterial(TerrainShader);
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.x = -Math.PI / 2;
    scene.add(this.mesh);

    this.mesh.userData.groundThickness = 0.1;
    this.mesh.userData.isGround = true;
  }
}
