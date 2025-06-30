import type { ChessPieceColor } from "../../ChessPiece";
import type { Vector2 } from "../../Vector";

export default function ChessSquare({ color, chessPos, screenPos }: { color: ChessPieceColor, chessPos: string, screenPos: Vector2 }) {
    return <div className={`chess_square chess_square_${color}`}>
        <div>{`(${screenPos.x}, ${screenPos.y})`}</div>
        <div>{chessPos}</div>
    </div>;
}