import React from "react";
import { useChessGame } from "../../ChessGame";
import ChessBoard from "../../components/ChessBoard";
import "./GamePage.css";
import ChessMoves from "../../components/ChessMoves";
import { type ChessMove } from "../../ChessMove";

export default function GamePage() {
    // const game = React.useRef(new ChessGame());
    const game = useChessGame();
    const [playingAsWhite, setPlayingAsWhite] = React.useState(true);
    const [debug, setDebug] = React.useState(true);
    const [lastMoveThatHappened, setLastMoveThatHappened] = React.useState<ChessMove | null>(null);
    const gameMovesLength = React.useRef(0);

    React.useEffect(() => {
        if (game.moves.length <= 0) {
            gameMovesLength.current = 0;
            return;
        }

        if (game.moves.length > gameMovesLength.current)
            setLastMoveThatHappened({ ...game.getLastMove() });
        gameMovesLength.current = game.moves.length;
    }, [game.moves]);

    return (
        <main>
            <div className="left">
                <input name="playing_as_white" id="playing_as_white" type="checkbox" checked={playingAsWhite} onChange={(e) => setPlayingAsWhite(e.target.checked)} />
                <label htmlFor="playing_as_white">joc ca alb</label><br />

                {/* <input name="debug" id="debug" type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
                <label htmlFor="debug">debug</label><br /> */}

                <div>check: {game.isBoardInCheck(game.pieces, game.moves) ?? "no"}</div>
                <div>verdict: {game.verdict}</div>
            </div>
            <div className="center">
                <div className="top"></div>
                <div className="center">
                    <ChessBoard game={game} lastMoveThatHappened={lastMoveThatHappened} playingAsWhite={playingAsWhite} debug={debug} />
                </div>
                <div className="bottom"></div>
            </div>
            <div className="right">
                <ChessMoves game={game} setLastMoveThatHappened={(m) => setLastMoveThatHappened({ ...m })} />
            </div>
        </main>
    );
}