import { numberToChess, type Square } from "./notation"
import { getPieceType, type PieceType, type PromotionPieceType } from "./piece"

export type InternalMove = {
  from: number,
  to: number,
  promotion: number,
}

export type Move = {
  from: Square,
  to: Square,
  promotion: PromotionPieceType | null,
}

export function internalMoveToMove(move: InternalMove): Move {
  return {
    from: numberToChess(move.from),
    to: numberToChess(move.to),
    promotion: move.promotion == 0 ? null : getPieceType(move.promotion) as PromotionPieceType,
  };
}

export function pieceToSymbol(piece: PieceType): string {
  return piece == "knight" ? "n" : piece[0];
}

export function symbolToPiece(symbol: string): PieceType {
  switch (symbol.toLowerCase()) {
    case "k": return "king";
    case "q": return "queen";
    case "r": return "rook";
    case "n": return "knight";
    case "b": return "bishop";
    case "p": return "pawn";
    default: throw new Error("Invalid symbiol");
  }
}

export function stringifyMove(move: Move): string {
  const promotion = move.promotion != null ? pieceToSymbol(move.promotion) : "";
  return move.from + move.to + promotion;
}

export function parseMove(move: string): Move {
  const from = move.slice(0, 2) as Square;
  const to = move.slice(2, 4) as Square;
  const promotion = move.length == 5 ? symbolToPiece(move.slice(4, 5)) as PromotionPieceType : null;
  return { from, to, promotion };
}