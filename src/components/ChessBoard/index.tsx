import React from "react";
import { ChessGame } from "../../ChessGame";
import { vec2, vec2ToChessNotation, type Vector2 } from "../../Vector";

import "./ChessBoard.css";

import ChessSquare from "./ChessSquare";
import type { ChessPiece } from "../../ChessPiece";
import ChesspieceComponent from "./ChessPieceComponent";
import { ChessBoardContext } from "../../contexts/chess_board_context";

export default function ChessBoard({ game }: { game: ChessGame }) {
    const [playingAsWhite, setPlayingAsWhite] = React.useState(true);
    const [pieces, setPieces] = React.useState<ChessPiece[]>([]);
    const ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        game.setUpdatePieces((pieces) => setPieces(pieces));
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
                result.push(<ChessSquare key={`square_${chessPos}`} color={i % 2 == j % 2 ? "white" : "black"} chessPos={chessPos} screenPos={screenPos} />)
            }
        }

        return result;
    }

    function getChessPieces(): React.ReactNode[] {
        return pieces.map((p) => <ChesspieceComponent key={p.id} piece={p} game={game} />);
    }
    
    return <div ref={ref} className="chess_board">
        {getChessSquares()}

        <ChessBoardContext.Provider value={{
            screenPosToGamePos,
            gamePosToScreenPos,
            getBoundingClientRect: () => ref.current?.getBoundingClientRect() as DOMRect,
        }}>
            {getChessPieces()}
        </ChessBoardContext.Provider>
    </div>;
}