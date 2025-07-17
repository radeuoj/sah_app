import type { ChessPieceColor } from "../../ChessPiece";
import type { Vector2 } from "../../Vector";

export default function ChessSquare({ color, chessPos, lastMove }: { color: ChessPieceColor, chessPos: string, lastMove: boolean, screenPos: Vector2, debug?: boolean }) {
    return <div className={`chess_square chess_square_${color} ${lastMove ? "chess_square_last_move" : ""}`}>
        <div className="chess_square_letter">{chessPos[1] == "1" && chessPos[0]}</div>
        <div className="chess_square_number">{chessPos[0] == "a" && chessPos[1]}</div>
    </div>;
}