import { ChessPiece } from "./ChessPiece";
import { vec2, type Vector2 } from "./Vector";

export class ChessGame {
    private pieces: ChessPiece[] = [];
    private updatePiecesFn: (pieces: ChessPiece[]) => void = () => {};

    public constructor() {
        
    }

    private move(piece: ChessPiece, pos: Vector2) {
        piece.position = pos;
    }

    // returns whether the move was successful
    public requestMove(piece: ChessPiece, pos: Vector2): boolean {
        if (piece.position.x == pos.x && piece.position.y == pos.y) return false;
        if (pos.x < 1 || pos.y < 1 || pos.x > 8 || pos.y > 8) return false;

        this.pieces = this.pieces.filter((p) => p.position.x != pos.x || p.position.y != pos.y);
        this.move(piece, pos);
        this.updatePieces();
        
        return true;
    }

    public generatePieces() {
        this.pieces = [];

        this.pieces.push(new ChessPiece("king", "white", vec2(5, 1)));
        this.pieces.push(new ChessPiece("king", "black", vec2(5, 8)));

        this.pieces.push(new ChessPiece("queen", "white", vec2(4, 1)));
        this.pieces.push(new ChessPiece("queen", "black", vec2(4, 8)));

        this.pieces.push(new ChessPiece("rook", "white", vec2(1, 1)));
        this.pieces.push(new ChessPiece("rook", "white", vec2(8, 1)));
        this.pieces.push(new ChessPiece("rook", "black", vec2(1, 8)));
        this.pieces.push(new ChessPiece("rook", "black", vec2(8, 8)));

        this.pieces.push(new ChessPiece("knight", "white", vec2(2, 1)));
        this.pieces.push(new ChessPiece("knight", "white", vec2(7, 1)));
        this.pieces.push(new ChessPiece("knight", "black", vec2(2, 8)));
        this.pieces.push(new ChessPiece("knight", "black", vec2(7, 8)));

        this.pieces.push(new ChessPiece("bishop", "white", vec2(3, 1)));
        this.pieces.push(new ChessPiece("bishop", "white", vec2(6, 1)));
        this.pieces.push(new ChessPiece("bishop", "black", vec2(3, 8)));
        this.pieces.push(new ChessPiece("bishop", "black", vec2(6, 8)));

        for (let i = 1; i <= 8; i++) {
            this.pieces.push(new ChessPiece("pawn", "white", vec2(i, 2)));
            this.pieces.push(new ChessPiece("pawn", "black", vec2(i, 7)));
        }

        this.updatePieces();
    }

    public setUpdatePieces(updatePieces: (pieces: ChessPiece[]) => void) {
        this.updatePiecesFn = updatePieces;
    }

    private updatePieces() {
        this.updatePiecesFn(this.pieces);
    }
}