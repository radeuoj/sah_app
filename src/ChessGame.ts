import React from "react";
import { type ChessPiece, makeChessPiece } from "./ChessPiece";
import { vec2, type Vector2 } from "./Vector";

export class ChessGame {
    public pieces: ChessPiece[];
    private setPieces: React.Dispatch<React.SetStateAction<ChessPiece[]>>;

    public constructor() {
        [this.pieces, this.setPieces] = React.useState<ChessPiece[]>([]);
    }

    private move(piece: ChessPiece, pos: Vector2) {
        piece.position = pos;
    }

    // returns whether the move was successful
    public requestMove(piece: ChessPiece, pos: Vector2): boolean {
        if (piece.position.x == pos.x && piece.position.y == pos.y) return false;
        if (pos.x < 1 || pos.y < 1 || pos.x > 8 || pos.y > 8) return false;

        // this.pieces = this.pieces.filter((p) => p.position.x != pos.x || p.position.y != pos.y);
        // this.setPieces(this.pieces.filter((p) => p.position.x != pos.x || p.position.y != pos.y));
        this.setPieces((ps) => ps.filter((p) => p.position.x != pos.x || p.position.y != pos.y || p == piece));
        this.move(piece, pos);
        // this.updatePieces();
        
        return true;
    }

    public generatePieces() {
        this.setPieces([]);
        const pieces: ChessPiece[] = [];

        pieces.push(makeChessPiece("king", "black", vec2(5, 8)));
        pieces.push(makeChessPiece("king", "white", vec2(5, 1)));
        
        pieces.push(makeChessPiece("queen", "white", vec2(4, 1)));
        pieces.push(makeChessPiece("queen", "black", vec2(4, 8)));

        pieces.push(makeChessPiece("rook", "white", vec2(1, 1)));
        pieces.push(makeChessPiece("rook", "white", vec2(8, 1)));
        pieces.push(makeChessPiece("rook", "black", vec2(1, 8)));
        pieces.push(makeChessPiece("rook", "black", vec2(8, 8)));

        pieces.push(makeChessPiece("knight", "white", vec2(2, 1)));
        pieces.push(makeChessPiece("knight", "white", vec2(7, 1)));
        pieces.push(makeChessPiece("knight", "black", vec2(2, 8)));
        pieces.push(makeChessPiece("knight", "black", vec2(7, 8)));

        pieces.push(makeChessPiece("bishop", "white", vec2(3, 1)));
        pieces.push(makeChessPiece("bishop", "white", vec2(6, 1)));
        pieces.push(makeChessPiece("bishop", "black", vec2(3, 8)));
        pieces.push(makeChessPiece("bishop", "black", vec2(6, 8)));

        for (let i = 1; i <= 8; i++) {
            pieces.push(makeChessPiece("pawn", "white", vec2(i, 2)));
            pieces.push(makeChessPiece("pawn", "black", vec2(i, 7)));
        }

        this.setPieces(pieces);
        // this.updatePieces();
    }

    // private updatePieces() {
    //     this.pieces = [...this.pieces];
    // }
}