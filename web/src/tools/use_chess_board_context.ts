import type { Square } from "@/chess/notation";
import type { InternalPieceColor, PieceColor } from "@/chess/piece";
import type { Vector2 } from "@/chess/vector";
import { inject } from "vue";

export type BoardData = {
  getSide(): PieceColor,
  screenPosToGamePos(pos: Vector2): Square,
  gamePosToScreenPos(pos: Square): Vector2,
  getBoundingClientRect(): DOMRect,
}

export default function useChessBoardContext(): BoardData {
  const data = inject<BoardData>("board");
  if (data == undefined) throw new Error("Board is undefined bro");
  return data;
}