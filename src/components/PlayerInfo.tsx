import React from "react";

interface PlayerInfoProps {
  position: { x: number; y: number; z: number };
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ position }) => (
  <div style={{
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "5px",
    fontFamily: "Arial, sans-serif",
  }}>
    Position du joueur:
    <br />
    X: {position.x.toFixed(2)}, Y: {position.y.toFixed(2)}, Z: {position.z.toFixed(2)}
  </div>
);