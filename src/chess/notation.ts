import { vec2, type Vector2 } from "./vector";

export type Square = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'}`;

export function numberToVec2(position: number): Vector2 {
  return vec2(position % 8, Math.trunc(position / 8));
}

export function vec2ToNumber(position: Vector2): number {
  return position.y * 8 + position.x;
}

export function vec2ToChess(position: Vector2): Square {
  return ("abcdefgh"[position.x] + (position.y + 1).toString()) as Square;
}

export function chessToVec2(position: Square): Vector2 {
  return vec2("abcdefgh".indexOf(position[0]), +position[1] - 1);
}

export function numberToChess(position: number): Square {
  return vec2ToChess(numberToVec2(position));
}

export function chessToNumber(position: Square): number {
  return vec2ToNumber(chessToVec2(position));
}