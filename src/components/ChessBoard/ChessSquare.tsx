import type { ChessPieceColor } from "../../ChessPiece";
import type { Vector2 } from "../../Vector";

export default function ChessSquare({ color, chessPos, screenPos, debug }: { color: ChessPieceColor, chessPos: string, screenPos: Vector2, debug?: boolean }) {
    return <div className={`chess_square chess_square_${color}`}>
        <div>{chessPos}</div>
        {debug && <div>{`(${screenPos.x}, ${screenPos.y})`}</div>}
    </div>;
}