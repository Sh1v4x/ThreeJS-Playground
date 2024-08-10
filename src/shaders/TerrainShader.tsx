import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load("assets/ground/grass.jpg");
const sandTexture = textureLoader.load("/assets/ground/sand.jpg");
const stoneTexture = textureLoader.load("/assets/ground/stone.jpg");
const blendTexture = textureLoader.load("/assets/blendmap/blend_map.jpg");

[grassTexture, sandTexture, stoneTexture].forEach((texture) => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
});

export const TerrainShader = {
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
};
