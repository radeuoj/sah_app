import type { ChessMove } from "../ChessMove";
import { chessPieceTypeToLetter } from "../ChessPiece";
import { vec2ToChessNotation } from "../Vector";

export default function ChessMoveComponent({ move, last }: { move: ChessMove, last?: boolean }) {
    return <div style={{
        backgroundColor: last as true | undefined && "#dbdbdb",
    }} className="chess_move">{move.piece.color[0] + chessPieceTypeToLetter(move.piece.type)} -{move.capture && "x"}&gt; {vec2ToChessNotation(move.to)}</div>;
}