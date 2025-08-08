import type { Square } from "./notation"
import type { PromotionPieceType } from "./piece"

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