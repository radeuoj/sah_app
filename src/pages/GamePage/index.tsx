import React from "react";
import { ChessGame } from "../../ChessGame";
import ChessBoard from "../../components/ChessBoard";
import "./GamePage.css";

export default function GamePage() {
    // const game = React.useRef(new ChessGame());
    const game = new ChessGame();

    return (
        <main>
            <div className="left"></div>
            <div className="center">
                <div className="top"></div>
                <div className="center">
                    <ChessBoard game={game} />
                </div>
                <div className="bottom"></div>
            </div>
            <div className="right"></div>
        </main>
    );
}