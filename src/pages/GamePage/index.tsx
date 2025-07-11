import React from "react";
import { ChessGame } from "../../ChessGame";
import ChessBoard from "../../components/ChessBoard";
import "./GamePage.css";
import ChessMoves from "../../components/ChessMoves";

export default function GamePage() {
    // const game = React.useRef(new ChessGame());
    const game = new ChessGame();
    const [playingAsWhite, setPlayingAsWhite] = React.useState(true);
    const [debug, setDebug] = React.useState(true);

    return (
        <main>
            <div className="left">
                <input name="playing_as_white" id="playing_as_white" type="checkbox" checked={playingAsWhite} onChange={(e) => setPlayingAsWhite(e.target.checked)} />
                <label htmlFor="playing_as_white">joc ca alb</label><br />

                <input name="debug" id="debug" type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
                <label htmlFor="debug">debug</label><br />
            </div>
            <div className="center">
                <div className="top"></div>
                <div className="center">
                    <ChessBoard game={game} playingAsWhite={playingAsWhite} debug={debug} />
                </div>
                <div className="bottom"></div>
            </div>
            <div className="right">
                <ChessMoves game={game} />
            </div>
        </main>
    );
}