import React from "react";
import type { ChessGame } from "../../ChessGame";
import type { ChessPiece } from "../../ChessPiece";
import { useChessBoardContext } from "../../contexts/chess_board_context";
import { vec2, type Vector2 } from "../../Vector";

export default function ChesspieceComponent({ piece, game }: { piece: ChessPiece, game: ChessGame }) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const mouseDown = React.useRef(false);
    const { gamePosToScreenPos, screenPosToGamePos, getBoundingClientRect, playingAsWhite, allowTargetSquare, playMoveSound, playCaptureSound, setSelectedPiece } = useChessBoardContext();
    const screenPos = React.useRef(gamePosToScreenPos(piece.position));

    React.useEffect(() => {
        goToCurrentGamePosition();
    }, [playingAsWhite, piece.position]);

    const imageSrc = `./assets/chess_pieces/${piece.type}-${piece.color == "white" ? "w" : "b"}.svg`;

    React.useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchmove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchend", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchmove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [playingAsWhite, game.pieces, game.moves]);

    function updateScreenPos(pos: Vector2) {
        screenPos.current = pos;
        ref.current?.style.setProperty("translate", `${pos.x * 100}% ${pos.y * 100}%`);
    }

    function goToCurrentGamePosition() {
        ref.current?.style.setProperty("transition", "translate 0.15s");
        updateScreenPos(gamePosToScreenPos(piece.position));
        setTimeout(() => ref.current?.style.setProperty("transition", null), 200);
    }

    function updateZIndex(zIndex: number | null) {
        ref.current?.style.setProperty("z-index", zIndex ? zIndex?.toString() : null);
    }

    function handleMouseMove(e: MouseEvent | TouchEvent) {
        if (!mouseDown.current) return;

        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        const rect = getBoundingClientRect();
        const x = (clientX - rect.x) / rect.width * 8;
        const y = (clientY - rect.y) / rect.height * 8;
        const newScreenPos = vec2(x - 0.5, y - 0.5);
        // setScreenPos(newScreenPos);
        updateScreenPos(newScreenPos);
    }

    function handleMouseDown() {
        // if (game.currentMove.current != game.moves.length) return;
        
        if ((game.isWhiteTurn() && piece.color != "white") || (!game.isWhiteTurn() && piece.color != "black")) return;

        allowTargetSquare(true);
        setSelectedPiece(piece);
        mouseDown.current = true;
        updateZIndex(2);
    }

    function handleMouseUp() {
        if (!mouseDown.current) return;

        const gamePos = screenPosToGamePos(vec2(Math.floor(screenPos.current.x + 0.5), Math.floor(screenPos.current.y + 0.5)));

        game.requestMove(piece, gamePos);
        // const success = game.requestMove(piece, gamePos);

        // if (success == "success") {
        //     playMoveSound();
        // } else if (success == "capture") {
        //     playCaptureSound();
        // }

        allowTargetSquare(false);
        setSelectedPiece(null);
        mouseDown.current = false;
        goToCurrentGamePosition();
        updateZIndex(null);
    }

    return <div id={piece.id} ref={ref} className="chess_piece" onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} style={{
        translate: `${screenPos.current.x * 100}% ${screenPos.current.y * 100}%`,
        // zIndex: mouseDown ? 2 : undefined,
    }}>
        <img src={imageSrc} draggable={false} />
    </div>
}