import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { setupScene } from "../utils/SceneSetup";
import { Player } from "../objects/Player";
import { Ground } from "../objects/Ground";
import { Cube } from "../objects/Cube";
import { InputManager } from "../utils/InputManager";
import { CollisionDetector } from "../utils/CollisionDetector";
import { PlayerInfo } from "./PlayerInfo";
import { GameInstructions } from "./GameInstructions";
import { CollisionVisualizer } from "../utils/CollisionVisualize";

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const { scene, camera, renderer } = setupScene(mountRef.current);
    const player = new Player(scene, camera);
    const ground = new Ground(scene, 0, 0, 0);
    const cube = new Cube(scene, 5, 1, 5, "box/box.jpg");

    const cube2 = new Cube(scene, 10, 1, 5, "/box/box.jpg");

    const cube3 = new Cube(scene, 15, 1, 5, "public/box/box.jpg");

    const inputManager = new InputManager();
    const collisionDetector = new CollisionDetector();
    const collisionVisualizer = new CollisionVisualizer(scene);

    const objects = [cube.mesh, ground.mesh, cube2.mesh, cube3.mesh];
    collisionVisualizer.updateCollisionMeshes(objects);

    inputManager.addKeyPressHandler("KeyP", () => {
      collisionVisualizer.toggleVisibility();
    });

    const shadowGeometry = new THREE.CircleGeometry(0.5, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    scene.add(shadow);

    const animate = () => {
      player.update(inputManager, collisionDetector, objects);
      shadow.position.x = player.getPosition().x;
      shadow.position.z = player.getPosition().z;
      setPlayerPosition(player.getPosition());
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const lockChangeAlert = () => {
      setIsLocked(
        document.pointerLockElement === mountRef.current ||
          document.pointerLockElement === mountRef.current
      );
    };

    if (mountRef.current) {
      mountRef.current.addEventListener("click", () => {
        mountRef.current?.requestPointerLock();
      });
    }

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
    window.addEventListener("resize", onWindowResize);

    return () => {
      document.removeEventListener("pointerlockchange", lockChangeAlert);
      document.removeEventListener("mozpointerlockchange", lockChangeAlert);
      window.removeEventListener("resize", onWindowResize);
      inputManager.cleanup();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <PlayerInfo position={playerPosition} />
      {!isLocked && <GameInstructions />}
    </div>
  );
};

export default Game;
