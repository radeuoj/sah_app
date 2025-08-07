import type { PieceType } from "./piece"

export type InternalMove = {
  from: number,
  to: number,
  promotion: number,
}

export type Move = {
  from: number,
  to: number,
  promotion: PieceType | null,
}