import type { ChessMove } from "../ChessMove";
import { vec2ToChessNotation } from "../Vector";

export default function ChessMoveComponent({ move, last }: { move: ChessMove, last?: boolean }) {
    return <div style={{
        backgroundColor: last as true | undefined && "#dbdbdb",
    }} className="chess_move">{vec2ToChessNotation(move.from)} -&gt; {vec2ToChessNotation(move.to)}</div>;
}