import type { ChessGame } from "../ChessGame";
import type { ChessMove } from "../ChessMove";
import { vec2 } from "../Vector";
import ChessMoveComponent from "./ChessMoveComponent";

export default function ChessMoves({ game, setLastMoveThatHappened }: { game: ChessGame, setLastMoveThatHappened: (move: ChessMove) => void }) {
    return (
        <div className="chess_moves">
            <div className="moves_container">
                {game.moves.map((m, i) => {
                return <ChessMoveComponent key={i} move={m} last={i == game.moves.length - 1} />
                })}
            </div>
            <div className="moves_controls">
                <button onClick={(e) => game.moves.length > 0 && setLastMoveThatHappened(game.requestUnmove())}>&lt;-</button>
                {/* <button onClick={(e) => game.moveForward()}>-&gt;</button> */}
            </div>
        </div>
    );
}