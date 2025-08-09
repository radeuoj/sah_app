import type { InternalMove, Move } from "./move";
import type { Square } from "./notation";

export const InternalPieceType = {
  KING: 1,
  QUEEN: 2,
  ROOK: 3,
  KNIGHT: 4,
  BISHOP: 5,
  PAWN: 6,
};

export const InternalPieceColor = {
  BLACK: 8,
  WHITE: 16,
};

export type PieceColor = "white" | "black";
export type PieceType = "king" | "queen" | "rook" | "knight" | "bishop" | "pawn";
export type PromotionPieceType = "queen" | "rook" | "knight" | "bishop"; 

export type Piece = {
  id: number,
  type: PieceType,
  color: PieceColor,
  position: Square,
  moves: Move[],
};

export function getInternalPieceType(piece: number): number {
  return piece & 0b00111;
}

export function getInternalPieceColor(piece: number): number {
  return piece & 0b11000;
}

export function getPieceId(piece: number): number {
  return piece >> 5;
}

export function getPieceType(piece: number): PieceType {
  const pieceType = getInternalPieceType(piece);
  const index = Object.values(InternalPieceType).indexOf(pieceType);
  if (index == undefined)
    throw new Error("Unkown piece type!");

  return Object.keys(InternalPieceType)[index].toLowerCase() as PieceType;
}

export function getPieceColor(piece: number): PieceColor {
  const pieceColor = getInternalPieceColor(piece);
  const index = Object.values(InternalPieceColor).indexOf(pieceColor);
  if (index == undefined)
    throw new Error("Unkown piece color!");

  return Object.keys(InternalPieceColor)[index].toLowerCase() as PieceColor;
}

export function isSlidingPiece(piece: number): boolean {
  const pieceType = getInternalPieceType(piece);
  switch (pieceType) {
    case InternalPieceType.QUEEN:
    case InternalPieceType.ROOK:
    case InternalPieceType.BISHOP:
      return true;
    default:
      return false;
  }
}

export function internalPieceToPiece(piece: number, position: Square, moves: Move[]): Piece {
  return {
    id: getPieceId(piece),
    type: getPieceType(piece),
    color: getPieceColor(piece),
    position,
    moves,
  }
}