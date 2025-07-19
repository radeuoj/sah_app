import React from "react";
import { type ChessPiece, makeChessPiece } from "./ChessPiece";
import { vec2, type Vector2 } from "./Vector";
import type { ChessMove } from "./ChessMove";

export type ChessGame = {
    pieces: ChessPiece[],
    moves: ChessMove[],
    verdict: "ok" | "stalemate" | "checkmate",
    isWhiteTurn(): boolean,
    getLastMove(): ChessMove,
    requestMove(piece: ChessPiece, pos: Vector2): boolean,
    requestUnmove(): ChessMove,
    generatePieces(): void,
    isBoardInCheck(pieces: ChessPiece[], moves: ChessMove[]): null | "white" | "black" | "both",
}

export function useChessGame(): ChessGame {
    const [pieces, setPieces] = React.useState<ChessPiece[]>([]);
    const [moves, setMoves] = React.useState<ChessMove[]>([]);
    const [verdict, setVerdict] = React.useState<"ok" | "stalemate" | "checkmate">("ok");

    function isWhiteTurn(): boolean {
        return moves.length % 2 == 0;
    }

    function getLastMove(): ChessMove {
        if (moves.length <= 0)
            throw new Error("No moves!!");

        return moves[moves.length - 1];
    }
    
    function requestMove(piece: ChessPiece, pos: Vector2): boolean {
        const nextMove = piece.suggestions.find((m) => m.to.x == pos.x && m.to.y == pos.y);
        if (nextMove) {
            let newPieces = [...pieces]; 
            let newMoves = [...moves];

            if (move(nextMove, newPieces, (cb) => newPieces = cb(newPieces), newMoves, (cb) => newMoves = cb(newMoves)))
                setVerdict(generateMoveSuggestions(newPieces, newMoves));

            setPieces(newPieces);
            setMoves(newMoves);
        }
        
        return nextMove != undefined;
    }

    function requestUnmove(): ChessMove {
        let newPieces = [...pieces];
        let newMoves = [...moves];

        const lastMoev = unmove(newPieces, (cb) => newPieces = cb(newPieces), newMoves, (cb) => newMoves = cb(newMoves));
        setVerdict(generateMoveSuggestions(newPieces, newMoves));

        setPieces(newPieces);
        setMoves(newMoves);

        return lastMoev;
    }

    function move(
        move: ChessMove, 
        pieces: ChessPiece[], 
        setPieces: (cb: (ps: ChessPiece[]) => ChessPiece[]) => void, 
        moves: ChessMove[], 
        setMoves: (cb: (pm: ChessMove[]) => ChessMove[]) => void
    ): boolean {
        let newPieces = pieces.filter((p) => p != move.capture); 
        let newMoves = [...moves, move];

        move.piece.position = Object.assign({}, move.to);
        if (move.capture) move.capture.position = vec2(0, 0);

        if (move.castle) castle(move, newPieces, newMoves);
        if (move.promotion) promote(move);

        const check = isBoardInCheck(newPieces, newMoves);
        if (check == "both" || check == move.piece.color) {
            unmove(newPieces, (cb) => newPieces = cb(newPieces), newMoves, (cb) => newMoves = cb(newMoves));
            return false;
        } else {
            setPieces((ps) => newPieces);
            setMoves((pm) => newMoves);
            return true;
        }
    }

    function unmove(
        pieces: ChessPiece[], 
        setPieces: (cb: (ps: ChessPiece[]) => ChessPiece[]) => void, 
        moves: ChessMove[], 
        setMoves: (cb: (pm: ChessMove[]) => ChessMove[]) => void
    ): ChessMove {
        if (moves.length <= 0)
            throw new Error("No moves!!");

        const move = moves[moves.length - 1];

        if (move.capture)
            setPieces((ps) => [...ps, move.capture as ChessPiece]);
        else
            setPieces((ps) => [...ps]);
        setMoves((pm) => pm.filter((m) => m != move));

        move.piece.position = Object.assign({}, move.from);
        if (move.capture) move.capture.position = Object.assign({}, move.to);

        if (move.castle) uncastle(move, pieces, moves);
        if (move.promotion) unpromote(move);
        if (move.enPassant && move.capture) move.capture.position = Object.assign({}, move.enPassant);

        return move;
    }

    function castle(move: ChessMove, pieces: ChessPiece[], moves: ChessMove[]) {
        if (move.castle == undefined)
            throw new Error("castle is undefined!!!");

        const rook = pieces.find((p) => p.type == "rook" && p.position.x == (move.castle == "king" ? 8 : 1) && p.position.y == move.piece.position.y);
        if (rook == undefined) 
            throw new Error(`no ${move.castle} side rook`);
        rook.position = vec2(move.piece.position.x + (move.castle == "king" ? -1 : +1), move.piece.position.y);
    }

    function uncastle(move: ChessMove, pieces: ChessPiece[], moves: ChessMove[]) {
        if (move.castle == undefined)
            throw new Error("castle is undefined!!!");

        const rook = pieces.find((p) => p.type == "rook" && p.position.x == move.to.x + (move.castle == "king" ? -1 : +1) && p.position.y == move.to.y);
        if (rook == undefined) 
            throw new Error(`no ${move.castle} side rook`);
        rook.position = vec2(move.castle == "king" ? 8 : 1, move.piece.position.y);
    }

    function promote(move: ChessMove) {
        if (move.promotion == undefined)
            throw new Error("this isnt a promotion!!");

        move.piece.type = move.promotion;
    }

    function unpromote(move: ChessMove) {
        if (move.promotion == undefined)
            throw new Error("this isnt a promotion!!");

        move.piece.type = "pawn";
    }

    function generateTestPieces() {
        const pieces: ChessPiece[] = [];

        pieces.push(makeChessPiece("king", "black", vec2(5, 8)));
        pieces.push(makeChessPiece("king", "white", vec2(5, 1)));

        pieces.push(makeChessPiece("rook", "white", vec2(1, 1)));
        pieces.push(makeChessPiece("rook", "white", vec2(8, 1)));
        pieces.push(makeChessPiece("rook", "black", vec2(1, 8)));
        pieces.push(makeChessPiece("rook", "black", vec2(8, 8)));
            pieces.push(makeChessPiece("pawn", "white", vec2(6, 4)));

        setPieces(pieces);
        generateMoveSuggestions(pieces, moves);
    }

    function generatePieces() {
        // generateTestPieces();
        // return;
        setPieces([]);
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

        setPieces(pieces);
        generateMoveSuggestions(pieces, moves);
    }

    function generateMoveSuggestions(pieces: ChessPiece[], moves: ChessMove[]): "ok" | "stalemate" | "checkmate" {
        let whiteMoveCount = 0, blackMoveCount = 0;
        const check = isBoardInCheck(pieces, moves);
        for (const piece of pieces) {
           piece.suggestions = suggestMoves(piece, check, pieces, moves);
           if (piece.color == "white") whiteMoveCount += piece.suggestions.length;
           else blackMoveCount += piece.suggestions.length;
        }

        if ((moves.length % 2 == 0 ? whiteMoveCount : blackMoveCount) > 0) return "ok";
        if (check) return "checkmate";
        return "stalemate";
    }

    function isMoveValid(newMove: ChessMove, pieces: ChessPiece[], moves: ChessMove[]): boolean {
        let newPieces = [...pieces];
        let newMoves = [...moves];
        const ok = move(newMove, newPieces, (cb) => newPieces = cb(newPieces), newMoves, (cb) => newMoves = cb(newMoves));
        if (ok) unmove(newPieces, (cb) => newPieces = cb(newPieces), newMoves, (cb) => newMoves = cb(newMoves));
        return ok;
    }

    function suggestMoves(piece: ChessPiece, check: null | "white" | "black" | "both", pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        return suggestMovesUnsafe(piece, check, pieces, moves).filter((m) => isMoveValid(m, pieces, moves));
    }

    function suggestMovesUnsafe(piece: ChessPiece, check: null | "white" | "black" | "both", pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        switch (piece.type) {
            case "bishop": return suggestBishopMoves(piece, pieces, moves);
            case "king": return suggestKingMoves(piece, check, pieces, moves);
            case "queen": return suggestQueenMoves(piece, pieces, moves); 
            case "rook": return suggestRookMoves(piece, pieces, moves);
            case "knight": return suggestKnightMoves(piece, pieces, moves);
            case "pawn": return suggestPawnMoves(piece, pieces, moves);
        }
    }

    function generateMove(piece: ChessPiece, pos: Vector2, pieces: ChessPiece[]): ChessMove {
        const capture = pieces.find((p) => p.position.x == pos.x && p.position.y == pos.y);
        const from = Object.assign({}, piece.position);
        const to = Object.assign({}, pos);
        return {
            from,
            to,
            piece,
            capture: capture ?? null,
        };
    }

    function isValidPosition(piece: ChessPiece, pos: Vector2, pieces: ChessPiece[]): boolean {
        if (piece.position.x == pos.x && piece.position.y == pos.y) return false;
        if (pos.x < 1 || pos.y < 1 || pos.x > 8 || pos.y > 8) return false;
        const capture = pieces.find((p) => p.position.x == pos.x && p.position.y == pos.y);
        if (capture && capture.color == piece.color) return false;
        return true;
    }

    function progressPosition(piece: ChessPiece, step: Vector2, pieces: ChessPiece[]): Vector2[] {
        const result: Vector2[] = [];

        for (let i = piece.position.x + step.x, j = piece.position.y + step.y; isValidPosition(piece, vec2(i, j), pieces); i += step.x, j += step.y) {
            result.push(vec2(i, j));
            if (pieces.find((p) => p.position.x == i && p.position.y == j))
                break;
        }

        return result;
    }

    function suggestKingMoves(piece: ChessPiece, check: null | "white" | "black" | "both", pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        const result: ChessMove[] = [];

        for (let i = piece.position.x - 1; i <= piece.position.x + 1; i++) {
            for (let j = piece.position.y - 1; j <= piece.position.y + 1; j++) {
                if (isValidPosition(piece, vec2(i, j), pieces))
                    result.push(generateMove(piece, vec2(i, j), pieces));
            }
        }

        // castle
        if (moves.filter((m) => m.piece == piece).length == 0 && check != "both" && check != piece.color) {
            const kingSideRook = pieces.find((p) => p.type == "rook" && p.position.x == 8 && p.position.y == piece.position.y);
            const queenSideRook = pieces.find((p) => p.type == "rook" && p.position.x == 1 && p.position.y == piece.position.y);

            if (kingSideRook && moves.filter((m) => m.piece == kingSideRook).length == 0 && pieces.filter((p) => p.position.y == piece.position.y && (p.position.x == piece.position.x + 1 || p.position.x == piece.position.x + 2)).length == 0) 
                result.push({
                    from: Object.assign({}, piece.position),
                    to: vec2(piece.position.x + 2, piece.position.y),
                    piece,
                    capture: null,
                    castle: "king",
                });

            if (queenSideRook && moves.filter((m) => m.piece == queenSideRook).length == 0 && pieces.filter((p) => p.position.y == piece.position.y && (p.position.x == piece.position.x - 1 || p.position.x == piece.position.x - 2 || p.position.x == piece.position.x - 3)).length == 0) 
                result.push({
                    from: Object.assign({}, piece.position),
                    to: vec2(piece.position.x - 2, piece.position.y),
                    piece,
                    capture: null,
                    castle: "queen",
                });
        }
        
        return result;
    }

    function suggestRookMoves(piece: ChessPiece, pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        const result: ChessMove[] = [];

        result.push(...progressPosition(piece, vec2(1, 0), pieces).map((v) => generateMove(piece, v, pieces)));
        result.push(...progressPosition(piece, vec2(-1, 0), pieces).map((v) => generateMove(piece, v, pieces)));
        result.push(...progressPosition(piece, vec2(0, 1), pieces).map((v) => generateMove(piece, v, pieces)));
        result.push(...progressPosition(piece, vec2(0, -1), pieces).map((v) => generateMove(piece, v, pieces)));

        return result;
    }

    function suggestBishopMoves(piece: ChessPiece, pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        const result: ChessMove[] = [];

        result.push(...progressPosition(piece, vec2(1, 1), pieces).map((v) => generateMove(piece, v, pieces)));
        result.push(...progressPosition(piece, vec2(-1, 1), pieces).map((v) => generateMove(piece, v, pieces)));
        result.push(...progressPosition(piece, vec2(1, -1), pieces).map((v) => generateMove(piece, v, pieces)));
        result.push(...progressPosition(piece, vec2(-1, -1), pieces).map((v) => generateMove(piece, v, pieces)));

        return result;
    }

    function suggestKnightMoves(piece: ChessPiece, pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        const result: ChessMove[] = [];

        const dir = [vec2(2, 1), vec2(2, -1), vec2(-2, 1), vec2(-2, -1), vec2(1, 2), vec2(1, -2), vec2(-1, 2), vec2(-1, -2)];
        for (let i = 0; i < dir.length; i++) {
            const pos = vec2(piece.position.x + dir[i].x, piece.position.y + dir[i].y);
            if (isValidPosition(piece, pos, pieces))
                result.push(generateMove(piece, pos, pieces));
        }

        return result;
    }

    function suggestQueenMoves(piece: ChessPiece, pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        const result: ChessMove[] = [];

        result.push(...suggestRookMoves(piece, pieces, moves));
        result.push(...suggestBishopMoves(piece, pieces, moves));

        return result;
    }

    function suggestPawnMoves(piece: ChessPiece, pieces: ChessPiece[], moves: ChessMove[]): ChessMove[] {
        const result: ChessMove[] = [];

        const frontPos = vec2(piece.position.x, piece.position.y + (piece.color == "white" ? +1 : -1));
        const front = pieces.find((p) => p.position.x == frontPos.x && p.position.y == frontPos.y);
        if (!front && isValidPosition(piece, frontPos, pieces)) {
            const move = generateMove(piece, frontPos, pieces);
            if (move.to.y == (piece.color == "white" ? 8 : 1))
                move.promotion = "queen";
            result.push(move);
        }

        const frontLeft = pieces.find((p) => p.position.x == frontPos.x - 1 && p.position.y == frontPos.y);
        if (frontLeft && frontLeft.color != piece.color) {
            const move = generateMove(piece, vec2(frontPos.x - 1, frontPos.y), pieces);
            if (move.to.y == (piece.color == "white" ? 8 : 1))
                move.promotion = "queen";
            result.push(move);
        }

        const frontRight = pieces.find((p) => p.position.x == frontPos.x + 1 && p.position.y == frontPos.y);
        if (frontRight && frontRight.color != piece.color){
            const move = generateMove(piece, vec2(frontPos.x + 1, frontPos.y), pieces);
            if (move.to.y == (piece.color == "white" ? 8 : 1))
                move.promotion = "queen";
            result.push(move);
        }

        const doubleFrontPos = vec2(frontPos.x, frontPos.y + (piece.color == "white" ? +1 : -1));
        const doubleFront = pieces.find((p) => p.position.x == doubleFrontPos.x && p.position.y == doubleFrontPos.y);
        if (!doubleFront && isValidPosition(piece, doubleFrontPos, pieces) && moves.filter((m) => m.piece == piece).length == 0) 
            result.push(generateMove(piece, doubleFrontPos, pieces));

        if (moves.length > 0) {
            const epMove = moves[moves.length - 1];

            const enPassantLeft = pieces.find((p) => p.type == "pawn" && p.color != piece.color && p.position.x == piece.position.x - 1 && p.position.y == piece.position.y);
            if (enPassantLeft && epMove.piece == enPassantLeft && Math.abs(epMove.from.y - epMove.to.y) == 2) 
                result.push({
                    from: Object.assign({}, piece.position),
                    to: Object.assign({}, vec2(frontPos.x - 1, frontPos.y)),
                    piece,
                    capture: enPassantLeft,
                    enPassant: Object.assign({}, enPassantLeft.position),
                });

            const enPassantRight = pieces.find((p) => p.type == "pawn" && p.color != piece.color && p.position.x == piece.position.x + 1 && p.position.y == piece.position.y);
            if (enPassantRight && epMove.piece == enPassantRight && Math.abs(epMove.from.y - epMove.to.y) == 2) 
                result.push({
                    from: Object.assign({}, piece.position),
                    to: Object.assign({}, vec2(frontPos.x + 1, frontPos.y)),
                    piece,
                    capture: enPassantRight,
                    enPassant: Object.assign({}, enPassantRight.position),
                });
        }
        
        return result;
    }

    function isBoardInCheck(pieces: ChessPiece[], moves: ChessMove[]): null | "white" | "black" | "both" {
        const whiteKing = pieces.find((p) => p.color == "white" && p.type == "king");
        const blackKing = pieces.find((p) => p.color == "black" && p.type == "king");

        if (blackKing == undefined || whiteKing == undefined)
            return null;

        let blackResult = false, whiteResult = false;

        for (const piece of pieces) {
            const pieceMoves = suggestMovesUnsafe(piece, null, pieces, moves);

            for (const move of pieceMoves) {
                if (piece.color == "white" && move.to.x == blackKing.position.x && move.to.y == blackKing.position.y)
                    blackResult = true;
                if (piece.color == "black" && move.to.x == whiteKing.position.x && move.to.y == whiteKing.position.y)
                    whiteResult = true;
            }
        }

        if (blackResult && whiteResult) return "both";
        if (blackResult) return "black";
        if (whiteResult) return "white";
        return null;
    }

    return {
        pieces,
        moves,
        verdict,
        isWhiteTurn,
        getLastMove,
        requestMove,
        requestUnmove,
        generatePieces,
        isBoardInCheck,
    };
}
