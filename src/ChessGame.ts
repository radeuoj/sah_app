import React from "react";
import { type ChessPiece, makeChessPiece } from "./ChessPiece";
import { vec2, type Vector2 } from "./Vector";
import type { ChessMove } from "./ChessMove";

export class ChessGame {
    public pieces: ChessPiece[];
    private setPieces: React.Dispatch<React.SetStateAction<ChessPiece[]>>;

    public moves: ChessMove[];
    private setMoves: React.Dispatch<React.SetStateAction<ChessMove[]>>;

    public whiteTurn: React.RefObject<boolean>;
    public currentMove: React.RefObject<number>;

    public constructor() {
        [this.pieces, this.setPieces] = React.useState<ChessPiece[]>([]);
        [this.moves, this.setMoves] = React.useState<ChessMove[]>([]);
        this.whiteTurn = React.useRef(true);
        this.currentMove = React.useRef(0);
    }

    private move(piece: ChessPiece, pos: Vector2) {
        const capture = this.pieces.find((p) => p.position.x == pos.x && p.position.y == pos.y);
        this.setPieces((ps) => ps.filter((p) => p != capture));

        const from = Object.assign({}, piece.position);
        const to = Object.assign({}, pos);
        this.setMoves((m) => [...m, {
            from,
            to,
            piece,
            capture: capture ?? null,
        }]);

        piece.position = pos;
        if (capture) capture.position = vec2(0, 0);

        this.whiteTurn.current = !this.whiteTurn.current;
        this.currentMove.current++;
    }

    // returns whether the move was successful
    public requestMove(piece: ChessPiece, pos: Vector2): boolean {
        if (piece.position.x == pos.x && piece.position.y == pos.y) return false;
        if (pos.x < 1 || pos.y < 1 || pos.x > 8 || pos.y > 8) return false;
        if (this.currentMove.current < this.moves.length) return false;

        // Other rules which I'm lazy to do well
        if ((this.whiteTurn.current && piece.color != "white") || (!this.whiteTurn.current && piece.color != "black")) return false;

        const capture = this.pieces.find((p) => p.position.x == pos.x && p.position.y == pos.y);
        if (capture && capture.color == piece.color) return false;

        // this.pieces = this.pieces.filter((p) => p.position.x != pos.x || p.position.y != pos.y);
        // this.setPieces(this.pieces.filter((p) => p.position.x != pos.x || p.position.y != pos.y));
        // this.setPieces((ps) => ps.filter((p) => p.position.x != pos.x || p.position.y != pos.y || p == piece));
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
    }

    public moveForward() {
        if (this.currentMove.current >= this.moves.length) return;

        this.moves[this.currentMove.current].piece.position = Object.assign({}, this.moves[this.currentMove.current].to);
        const capture = this.moves[this.currentMove.current].capture;
        if (capture != null)
            capture.position = vec2(0, 0);

        this.setPieces(this.pieces.filter((p) => p != capture));
        
        this.currentMove.current++;
    }

    public moveBackward() {
        if (this.currentMove.current <= 0) return;

        this.currentMove.current--;
        this.moves[this.currentMove.current].piece.position = Object.assign({}, this.moves[this.currentMove.current].from);
        const capture = this.moves[this.currentMove.current].capture;
        if (capture != null) {
            capture.position = Object.assign({}, this.moves[this.currentMove.current].to);
            this.setPieces([...this.pieces, capture]);
        } else {
            this.setPieces([...this.pieces]);
        }
        console.log(this.moves[this.currentMove.current].piece)
    }
}