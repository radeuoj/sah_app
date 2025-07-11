import { vec2ToChessNotation, type Vector2 } from "./Vector";

export type ChessPieceColor = "white" | "black";
export type ChessPieceType =
| "king"
| "queen"
| "rook"
| "knight"
| "bishop"
| "pawn";

export interface ChessPiece {
    id: string,
    type: ChessPieceType,
    color: ChessPieceColor,
    position: Vector2,
}

export function makeChessPiece(type: ChessPieceType, color: ChessPieceColor, position: Vector2): ChessPiece {
    return {
        id: type + vec2ToChessNotation(position),
        type,
        color,
        position,
    };
}

// export class ChessPiece {
//     id: string;
//     type: ChessPieceType;
//     color: ChessPieceColor;
//     position: Vector2;

//     constructor(type: ChessPieceType, color: ChessPieceColor, position: Vector2) {
//         this.id = type + vec2ToChessNotation(position);
//         this.type = type;
//         this.color = color;
//         this.position = position;
//     }
// }