import { vec2, type Vector2 } from "./vector";

export function numberToVec2(position: number): Vector2 {
  return vec2(position % 8, Math.trunc(position / 8));
}

export function vec2ToNumber(position: Vector2): number {
  return position.y * 8 + position.x;
}

export function vec2ToChess(position: Vector2): string {
  return "abcdefgh"[position.x] + (position.y + 1).toString();
}

export function chessToVec2(position: string): Vector2 {
  return vec2("abcdefgh".indexOf(position[0]), +position[1] - 1);
}

export function numberToChess(position: number): string {
  return vec2ToChess(numberToVec2(position));
}

export function chessToNumber(position: string): number {
  return vec2ToNumber(chessToVec2(position));
}