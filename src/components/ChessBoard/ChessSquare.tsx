import type { ChessPieceColor } from "../../ChessPiece";
import type { Vector2 } from "../../Vector";

export default function ChessSquare({ color, chessPos, playingAsWhite, lastMove }: { color: ChessPieceColor, chessPos: string, playingAsWhite: boolean, lastMove: boolean, screenPos: Vector2, debug?: boolean }) {
    return <div className={`chess_square chess_square_${color} ${lastMove ? "chess_square_last_move" : ""}`}>
        <div className="chess_square_letter">{(playingAsWhite ? chessPos[1] == "1" : chessPos[1] == "8") && chessPos[0]}</div>
        <div className="chess_square_number">{(playingAsWhite ? chessPos[0] == "a" : chessPos[0] == "h") && chessPos[1]}</div>
    </div>;
}