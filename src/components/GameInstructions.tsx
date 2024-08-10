import React from "react";

export const GameInstructions: React.FC = () => (
  <div style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  }}>
    Cliquez pour jouer
    <br />
    Utilisez ZQSD pour vous déplacer
    <br />
    Utilisez la souris pour regarder autour
  </div>
);