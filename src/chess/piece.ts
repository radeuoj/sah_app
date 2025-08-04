import type { Move } from "./move";

export type PieceColor = "white" | "black";
export type PieceType = "king" | "queen" | "rook" | "knight" | "bishop" | "pawn";

export type Piece = {
  type: PieceType,
  color: PieceColor,
  position: number,
  moves: Move[],
};