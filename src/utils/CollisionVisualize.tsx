import * as THREE from "three";

export class CollisionVisualizer {
  private scene: THREE.Scene;
  private collisionMeshes: THREE.Object3D[] = [];
  private isVisible: boolean = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  updateCollisionMeshes(objects: THREE.Object3D[]) {
    // Remove old collision meshes
    this.collisionMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.collisionMeshes = [];

    // Create new collision meshes
    objects.forEach((object) => {
      if (object instanceof THREE.Mesh) {
        const boundingBox = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        // Create a box geometry slightly larger than the object
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        geometry.translate(
          object.position.x,
          object.position.y,
          object.position.z
        );

        // Create edges from the geometry
        const edges = new THREE.EdgesGeometry(geometry, 1);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0xff0000 })
        );

        // Create grid lines
        const gridHelper = this.createGridLines(size, object.position);

        // Group the edges and grid lines
        const group = new THREE.Group();
        group.add(line);
        group.add(gridHelper);

        this.collisionMeshes.push(group);
        this.scene.add(group);
        group.visible = this.isVisible;
      }
    });
  }

  private createGridLines(
    size: THREE.Vector3,
    position: THREE.Vector3
  ): THREE.Object3D {
    const group = new THREE.Group();

    // Parameters for grid density
    const divisions = 10;
    const step = {
      x: size.x / divisions,
      y: size.y / divisions,
      z: size.z / divisions,
    };

    // Create grid lines
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        // X-axis lines
        const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(
            -size.x / 2,
            -size.y / 2 + j * step.y,
            -size.z / 2 + i * step.z
          ),
          new THREE.Vector3(
            size.x / 2,
            -size.y / 2 + j * step.y,
            -size.z / 2 + i * step.z
          ),
        ]);
        const xLine = new THREE.Line(
          xLineGeometry,
          new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
        group.add(xLine);

        // Y-axis lines
        const yLineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(
            -size.x / 2 + i * step.x,
            -size.y / 2,
            -size.z / 2 + j * step.z
          ),
          new THREE.Vector3(
            -size.x / 2 + i * step.x,
            size.y / 2,
            -size.z / 2 + j * step.z
          ),
        ]);
        const yLine = new THREE.Line(
          yLineGeometry,
          new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
        group.add(yLine);

        // Z-axis lines
        const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(
            -size.x / 2 + i * step.x,
            -size.y / 2 + j * step.y,
            -size.z / 2
          ),
          new THREE.Vector3(
            -size.x / 2 + i * step.x,
            -size.y / 2 + j * step.y,
            size.z / 2
          ),
        ]);
        const zLine = new THREE.Line(
          zLineGeometry,
          new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
        group.add(zLine);
      }
    }

    group.position.copy(position);
    return group;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.collisionMeshes.forEach((mesh) => (mesh.visible = this.isVisible));
  }
}
