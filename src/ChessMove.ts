import type { ChessPiece } from "./ChessPiece";
import type { Vector2 } from "./Vector";

export interface ChessMove {
    from: Vector2,
    to: Vector2,
    piece: ChessPiece,
    capture: ChessPiece | null,
}