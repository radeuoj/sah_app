import type { ChessGame } from "../ChessGame";
import type { ChessMove } from "../ChessMove";
import { vec2 } from "../Vector";
import ChessMoveComponent from "./ChessMoveComponent";

export default function ChessMoves({ game }: { game: ChessGame }) {
    return (
        <div className="chess_moves">
            <div className="moves_container">
                {game.moves.map((m, i) => {
                return <ChessMoveComponent key={i} move={m} last={i == game.currentMove.current - 1} />
                })}
            </div>
            <div className="moves_controls">
                <button onClick={(e) => game.moveBackward()}>&lt;-</button>
                <button onClick={(e) => game.moveForward()}>-&gt;</button>
            </div>
        </div>
    );
}