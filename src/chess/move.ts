import { numberToChess, type Square } from "./notation"
import { getPieceType, type PromotionPieceType } from "./piece"

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

export function stringifyMove(move: Move): string {
  const promotion = move.promotion == "knight" ? "n" : move.promotion ? move.promotion[0] : "";
  return move.from + move.to + promotion;
}