# ThreeJS Playground

Bac à sable Three.js explorant la création d'un petit jeu 3D à la première personne dans le navigateur. On y déplace un joueur sur un terrain, avec gestion des collisions, contrôle caméra à la souris (pointer lock) et un shader de terrain personnalisé.

## Stack technique

- **Three.js** — moteur de rendu 3D
- **React 18** + **TypeScript** (Create React App)
- **@react-three/drei** — utilitaires Three.js pour React
- **stats.js** — affichage des performances

## Fonctionnalités

- Vue à la première personne avec verrouillage du pointeur (pointer lock)
- Déplacement du joueur au clavier (**ZQSD**) et regard à la souris
- Détection de collisions avec visualisation activable (touche **P**)
- Terrain avec shader personnalisé et blend map, objets texturés (cubes)
- Affichage de la position du joueur en temps réel

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
