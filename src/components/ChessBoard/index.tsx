import React from "react";
import { useChessGame, type ChessGame } from "../../ChessGame";
import { vec2, vec2ToChessNotation, type Vector2 } from "../../Vector";

import "./ChessBoard.css";

import ChessSquare from "./ChessSquare";
import type { ChessPiece } from "../../ChessPiece";
import ChesspieceComponent from "./ChessPieceComponent";
import { ChessBoardContext } from "../../contexts/chess_board_context";

import moveSound from "../../assets/sounds/move.mp3";
import captureSound from "../../assets/sounds/capture.mp3";
import type { ChessMove } from "../../ChessMove";

export default function ChessBoard({ game, lastMoveThatHappened, playingAsWhite, debug }: { game: ChessGame, lastMoveThatHappened: ChessMove | null, playingAsWhite: boolean, debug?: boolean }) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const targetSquareRef = React.useRef<HTMLDivElement | null>(null);
    const shouldAllowTargetSquare = React.useRef(false);
    const [selectedPiece, setSelectedPiece] = React.useState<ChessPiece | null>(null);

    const moveSoundAudio = new Audio(moveSound);
    const captureSoundAudio = new Audio(captureSound);

    React.useEffect(() => {
        game.generatePieces();
    }, []);

    // React.useEffect(() => {
    //     console.log(game.isBoardInCheck(game.pieces, game.moves));
    // }, [game.pieces]);
    
    React.useEffect(() => {
        if (lastMoveThatHappened == null)
            return;

        if (lastMoveThatHappened.capture == null) {
            playMoveSound();
        } else {
            playCaptureSound();
        }
    }, [lastMoveThatHappened]);

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
                const gamePos = screenPosToGamePos(screenPos)
                const chessPos = vec2ToChessNotation(gamePos);
                const lastMove = game.moves.length > 0
                && ((gamePos.x == game.getLastMove().from.x && gamePos.y == game.getLastMove().from.y)
                || (gamePos.x == game.getLastMove().to.x && gamePos.y == game.getLastMove().to.y))
                || (selectedPiece != null && gamePos.x == selectedPiece.position.x && gamePos.y == selectedPiece.position.y);
                result.push(<ChessSquare key={`square_${chessPos}`} color={i % 2 == j % 2 ? "white" : "black"} chessPos={chessPos} playingAsWhite={playingAsWhite} lastMove={lastMove} screenPos={screenPos} debug={debug} />)
            }
        }

        return result;
    }

    function getChessPieces(): React.ReactNode[] {
        return game.pieces.map((p) => <ChesspieceComponent key={p.id} piece={p} game={game} />);
    }

    function getMoveSuggestions(): React.ReactNode[] {
        if (selectedPiece == null) 
            return [];

        return selectedPiece.suggestions.map((s, i) => {
            const gamePos = s.to;
            const screenPos = gamePosToScreenPos(gamePos);
            return (
                <div className="move_suggestion" key={i} style={{
                    translate: `${screenPos.x * 100}% ${screenPos.y * 100}%`,
                }}>
                    <div className={s.capture ? "big_circle" : "small_circle"} />
                </div>
            );
        });
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

    function allowTargetSquare(allow: boolean) {
        shouldAllowTargetSquare.current = allow;
        if (!allow)
            hideTargetSquare();
    }

    function showTargetSquare() {
        if (shouldAllowTargetSquare.current)
            targetSquareRef.current?.style.setProperty("visibility", "visible");
    }

    function moveTargetSquare(pos: Vector2) {
        targetSquareRef.current?.style.setProperty("translate", `${pos.x * 100}% ${pos.y * 100}%`);
    }

    function hideTargetSquare() {
        targetSquareRef.current?.style.setProperty("visibility", "hidden");
    }

    function playMoveSound() {
        moveSoundAudio.play();
    }

    function playCaptureSound() {
        captureSoundAudio.play();
    }
    
    return <div ref={ref} className="chess_board" onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} onMouseMove={handleMouseMove} onTouchStart={handleOnMouseEnter} onTouchEnd={handleOnMouseLeave} onTouchMove={handleMouseMove}>
        {getChessSquares()}
        {getMoveSuggestions()}
        <div className="target_square" ref={targetSquareRef} style={{ visibility: "hidden" }}></div>

        <ChessBoardContext.Provider value={{
            screenPosToGamePos,
            gamePosToScreenPos,
            getBoundingClientRect: () => ref.current?.getBoundingClientRect() as DOMRect,
            playingAsWhite,
            allowTargetSquare,
            playMoveSound,
            playCaptureSound,
            setSelectedPiece: (piece: ChessPiece | null) => setSelectedPiece(piece),
        }}>
            {getChessPieces()}
        </ChessBoardContext.Provider>
    </div>;
}