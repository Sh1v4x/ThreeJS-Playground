export interface Position {
    x: number;
    y: number;
    z: number;
  }
  
  export interface MoveState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  }