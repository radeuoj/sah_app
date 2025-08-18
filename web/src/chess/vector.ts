export type Vector2 = {
  x: number,
  y: number,
}

export function vec2(x: number, y: number): Vector2 {
  return { x, y };
}