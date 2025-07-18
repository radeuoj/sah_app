import type { ChessMove } from "./ChessMove";
import { vec2ToChessNotation, type Vector2 } from "./Vector";

export type ChessPieceColor = "white" | "black";
export type ChessPieceType =
| "king"
| "queen"
| "rook"
| "knight"
| "bishop"
| "pawn";

export function chessPieceTypeToLetter(type: ChessPieceType): string {
    switch (type) {
    case "king": return "k";
    case "queen": return "q";
    case "rook": return "r";
    case "knight": return "n";
    case "bishop": return "b";
    case "pawn": return "p";
    }
}

export interface ChessPiece {
    id: string,
    type: ChessPieceType,
    color: ChessPieceColor,
    position: Vector2,
    suggestions: ChessMove[],
}

export function makeChessPiece(type: ChessPieceType, color: ChessPieceColor, position: Vector2): ChessPiece {
    return {
        id: type + vec2ToChessNotation(position),
        type,
        color,
        position,
        suggestions: [],
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