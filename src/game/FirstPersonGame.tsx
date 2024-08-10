import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const SimpleGame = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [fps, setFps] = useState(0);

  const PLAYER_HEIGHT = 1.5;
  const PLAYER_RADIUS = 0.5;
  const MAX_JUMP_HEIGHT = 0.2;
  const GRAVITY = 0.01;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current
      ? mountRef.current.appendChild(renderer.domElement)
      : document.body.appendChild(renderer.domElement);

    const staticGroup = new THREE.Group();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    staticGroup.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    staticGroup.add(directionalLight);

    scene.background = new THREE.Color(0x87ceeb);

    const textureLoader = new THREE.TextureLoader();
    const loader = new GLTFLoader();

    const grassTexture = textureLoader.load("/grass.jpg");
    const sandTexture = textureLoader.load("/sand.jpg");
    const stoneTexture = textureLoader.load("/stone.jpg");
    const blendTexture = textureLoader.load("/blend_map.jpg");

    [grassTexture, sandTexture, stoneTexture].forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10); // Réduction de la répétition pour améliorer la performance
    });

    const terrainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        grassTexture: { value: grassTexture },
        sandTexture: { value: sandTexture },
        stoneTexture: { value: stoneTexture },
        blendTexture: { value: blendTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D grassTexture;
        uniform sampler2D sandTexture;
        uniform sampler2D stoneTexture;
        uniform sampler2D blendTexture;
        varying vec2 vUv;
        void main() {
          vec4 blendFactors = texture2D(blendTexture, vUv);
          vec4 grassColor = texture2D(grassTexture, vUv * 10.0);
          vec4 sandColor = texture2D(sandTexture, vUv * 10.0);
          vec4 stoneColor = texture2D(stoneTexture, vUv * 10.0);
          vec4 finalColor = grassColor * blendFactors.r + 
                            sandColor * blendFactors.g + 
                            stoneColor * blendFactors.b;
          gl_FragColor = finalColor;
        }
      `,
      side: THREE.DoubleSide,
    });

    const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const ground = new THREE.Mesh(groundGeometry, terrainMaterial);
    ground.rotation.x = -Math.PI / 2;
    staticGroup.add(ground);

    const boxTexture = textureLoader.load("/box.jpg");
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshBasicMaterial({ map: boxTexture });
    const redCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    redCube.position.set(5, 1, 5);
    staticGroup.add(redCube);

    // loader.load("/house.glb", (gltf) => {
    //   const house = gltf.scene;
    //   house.position.set(0, 0, -10);
    //   house.scale.set(0.001, 0.001, 0.001);
    //   staticGroup.add(house);
    // });

    scene.add(staticGroup);

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

    const player = new THREE.Object3D();
    player.position.set(0, 1.5, 0);
    scene.add(player);
    player.add(camera);

    let isJumping = false;
    let canJump = true;
    let moveSpeed = 0.2;
    const moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          moveState.forward = true;
          break;
        case "KeyS":
          moveState.backward = true;
          break;
        case "KeyA":
          moveState.left = true;
          break;
        case "KeyD":
          moveState.right = true;
          break;
        case "ShiftLeft":
          moveSpeed = 0.5;
          break;
        case "Space":
          if (canJump && !isJumping) {
            isJumping = true;
            canJump = false;
          }
          break;
        default:
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          moveState.forward = false;
          break;
        case "KeyS":
          moveState.backward = false;
          break;
        case "KeyA":
          moveState.left = false;
          break;
        case "KeyD":
          moveState.right = false;
          break;
        case "ShiftLeft":
          moveSpeed = 0.2;
          break;
        default:
          break;
      }
    };

    const checkCollision = (position: THREE.Vector3, checkY = true) => {
      const playerBottom = position.y;
      const playerTop = position.y + PLAYER_HEIGHT;
      const playerLeft = position.x - PLAYER_RADIUS;
      const playerRight = position.x + PLAYER_RADIUS;
      const playerFront = position.z - PLAYER_RADIUS;
      const playerBack = position.z + PLAYER_RADIUS;

      const cubeBottom = redCube.position.y - 1;
      const cubeTop = redCube.position.y + 2;
      const cubeLeft = redCube.position.x - 1;
      const cubeRight = redCube.position.x + 1;
      const cubeFront = redCube.position.z - 1;
      const cubeBack = redCube.position.z + 1;

      return (
        playerLeft < cubeRight &&
        playerRight > cubeLeft &&
        playerFront < cubeBack &&
        playerBack > cubeFront &&
        (!checkY || (playerBottom < cubeTop && playerTop > cubeBottom))
      );
    };

    let verticalVelocity = 0;

    const updatePosition = () => {
      const direction = new THREE.Vector3();
      const sideVector = new THREE.Vector3();
      const moveVector = new THREE.Vector3();

      player.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();

      sideVector.setFromMatrixColumn(player.matrix, 0);

      if (moveState.forward) moveVector.sub(direction);
      if (moveState.backward) moveVector.add(direction);
      if (moveState.left) moveVector.sub(sideVector);
      if (moveState.right) moveVector.add(sideVector);

      if (isJumping && canJump) {
        verticalVelocity = MAX_JUMP_HEIGHT;
        isJumping = false;
        canJump = false;
      }

      player.position.y += verticalVelocity;
      verticalVelocity -= GRAVITY;

      const isOnCube = checkCollision(player.position, true);

      if (isOnCube && verticalVelocity < 0) {
        player.position.y = redCube.position.y + 2;
        verticalVelocity = 0;
        canJump = true;
      } else if (player.position.y <= PLAYER_HEIGHT) {
        player.position.y = PLAYER_HEIGHT;
        verticalVelocity = 0;
        canJump = true;
      }

      if (moveVector.length() > 0) {
        moveVector.normalize().multiplyScalar(moveSpeed);

        const newPosition = player.position.clone();

        newPosition.x += moveVector.x;
        if (!checkCollision(newPosition, !isJumping)) {
          player.position.x = newPosition.x;
        }

        newPosition.z += moveVector.z;
        if (!checkCollision(newPosition, !isJumping)) {
          player.position.z = newPosition.z;
        }
      }

      shadow.position.x = player.position.x;
      shadow.position.z = player.position.z;

      setPlayerPosition({
        x: parseFloat(player.position.x.toFixed(2)),
        y: parseFloat(player.position.y.toFixed(2)),
        z: parseFloat(player.position.z.toFixed(2)),
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isLocked) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        player.rotation.y -= movementX * 0.002;
        camera.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, camera.rotation.x - movementY * 0.002)
        );
      }
    };

    const animate = () => {
      updatePosition();
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
      if (
        document.pointerLockElement === mountRef.current ||
        document.pointerLockElement === mountRef.current
      ) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    };

    if (mountRef.current) {
      mountRef.current.addEventListener("click", () => {
        if (mountRef.current) {
          mountRef.current.requestPointerLock =
            mountRef.current.requestPointerLock ||
            mountRef.current.requestPointerLock;
          mountRef.current.requestPointerLock();
        }
      });
    }
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onWindowResize);

    return () => {
      document.removeEventListener("pointerlockchange", lockChangeAlert);
      document.removeEventListener("mozpointerlockchange", lockChangeAlert);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onWindowResize);

      mountRef.current
        ? mountRef.current.removeChild(renderer.domElement)
        : document.body.removeChild(renderer.domElement);
    };
  }, [isLocked]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "5px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Position du joueur:
        <br />
        X: {playerPosition.x}, Y: {playerPosition.y}, Z: {playerPosition.z}
        <br />
      </div>
      {!isLocked && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Cliquez pour jouer
          <br />
          Utilisez ZQSD pour vous déplacer
          <br />
          Utilisez la souris pour regarder autour
        </div>
      )}
    </div>
  );
};

export default SimpleGame;
