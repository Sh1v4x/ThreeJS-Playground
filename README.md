<div align="center">

# ThreeJS Playground

**Un bac à sable FPS 3D dans le navigateur.**

Exploration Three.js d'un petit jeu à la première personne : un joueur se déplace sur un terrain avec gestion des collisions, contrôle caméra à la souris (pointer lock) et un shader de terrain personnalisé.

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## Overview

Bac à sable Three.js explorant la création d'un petit jeu 3D à la première personne dans le navigateur. On y déplace un joueur sur un terrain, avec gestion des collisions, contrôle caméra à la souris (pointer lock) et un shader de terrain personnalisé.

## Fonctionnalités

- Vue à la première personne avec verrouillage du pointeur (pointer lock)
- Déplacement du joueur au clavier (**ZQSD**) et regard à la souris
- Détection de collisions avec visualisation activable (touche **P**)
- Terrain avec shader personnalisé et blend map, objets texturés (cubes)
- Affichage de la position du joueur en temps réel

## Tech Stack

- **Three.js** — moteur de rendu 3D
- **React 18** + **TypeScript** (Create React App)
- **@react-three/drei** — utilitaires Three.js pour React
- **stats.js** — affichage des performances

## Installation

```bash
npm install
```

## Lancement

```bash
npm start          # serveur de développement (http://localhost:3000)
```

Cliquez sur la scène pour capturer la souris, puis déplacez-vous avec ZQSD.

## Build & déploiement

```bash
npm run build      # build de production
npm run deploy     # déploiement sur GitHub Pages
```
