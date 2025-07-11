import React from "react";
import { ChessGame } from "../../ChessGame";
import { vec2, vec2ToChessNotation, type Vector2 } from "../../Vector";

import "./ChessBoard.css";

import ChessSquare from "./ChessSquare";
import type { ChessPiece } from "../../ChessPiece";
import ChesspieceComponent from "./ChessPieceComponent";
import { ChessBoardContext } from "../../contexts/chess_board_context";

export default function ChessBoard({ game, playingAsWhite, debug }: { game: ChessGame, playingAsWhite: boolean, debug?: boolean }) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const targetSquareRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        game.generatePieces();
    }, []);

    function screenPosToGamePos(pos: Vector2): Vector2 {
        if (playingAsWhite) return { x: pos.x + 1, y: 8 - pos.y };
        else return { x: 8 - pos.x, y: pos.y + 1 };
    }

    function gamePosToScreenPos(pos: Vector2): Vector2 {
        if (playingAsWhite) return { x: pos.x - 1, y: 8 - pos.y };
        else return { x: 8 - pos.x, y: pos.y - 1 };
    }

    function getChessSquares(): React.ReactNode[] {
        const result: React.ReactNode[] = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const screenPos = vec2(j, i);
                const chessPos = vec2ToChessNotation(screenPosToGamePos(screenPos));
                result.push(<ChessSquare key={`square_${chessPos}`} color={i % 2 == j % 2 ? "white" : "black"} chessPos={chessPos} screenPos={screenPos} debug={debug} />)
            }
        }

        return result;
    }

    function getChessPieces(): React.ReactNode[] {
        return game.pieces.map((p) => <ChesspieceComponent key={p.id} piece={p} game={game} />);
    }

    function getScreenPosFromEvent(e: React.MouseEvent | React.TouchEvent): Vector2 {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        const rect = ref.current?.getBoundingClientRect() as DOMRect;
        const x = (clientX - rect.x) / rect.width * 8;
        const y = (clientY - rect.y) / rect.height * 8;
        
        return vec2(x, y);
    }

    function handleMouseMove(e: React.MouseEvent | React.TouchEvent) {
        const newScreenPos = getScreenPosFromEvent(e);
        newScreenPos.x = Math.floor(newScreenPos.x);
        newScreenPos.y = Math.floor(newScreenPos.y);
        
        if (newScreenPos.x < 0 || newScreenPos.x >= 8 || newScreenPos.y < 0 || newScreenPos.y >= 8) hideTargetSquare();
        else showTargetSquare();

        moveTargetSquare(newScreenPos);
    }

    function handleOnMouseEnter(e: React.MouseEvent | React.TouchEvent) {
        const newScreenPos = getScreenPosFromEvent(e);
        newScreenPos.x = Math.floor(newScreenPos.x);
        newScreenPos.y = Math.floor(newScreenPos.y);

        showTargetSquare();
        moveTargetSquare(newScreenPos);
    }

    function handleOnMouseLeave() {
        hideTargetSquare();
    }

    function showTargetSquare() {
        targetSquareRef.current?.style.setProperty("visibility", "visible");
    }

    function moveTargetSquare(pos: Vector2) {
        targetSquareRef.current?.style.setProperty("translate", `${pos.x * 100}% ${pos.y * 100}%`);
    }

    function hideTargetSquare() {
        targetSquareRef.current?.style.setProperty("visibility", "hidden");
    }
    
    return <div ref={ref} className="chess_board" onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} onMouseMove={handleMouseMove} onTouchStart={handleOnMouseEnter} onTouchEnd={handleOnMouseLeave} onTouchMove={handleMouseMove}>
        {getChessSquares()}
        <div className="target_square" ref={targetSquareRef} style={{ visibility: "hidden" }}></div>

        <ChessBoardContext.Provider value={{
            screenPosToGamePos,
            gamePosToScreenPos,
            getBoundingClientRect: () => ref.current?.getBoundingClientRect() as DOMRect,
            playingAsWhite,
        }}>
            {getChessPieces()}
        </ChessBoardContext.Provider>
    </div>;
}