import type { ChessGame } from "../ChessGame";
import type { ChessMove } from "../ChessMove";
import { vec2 } from "../Vector";
import ChessMoveComponent from "./ChessMoveComponent";

export default function ChessMoves({ game }: { game: ChessGame }) {
    return <div className="chess_moves">
        {game.moves.map((m, i) => {
            return <ChessMoveComponent key={i} move={m} last={i == game.moves.length - 1} />
        })}
    </div>;
}